
-- Enable pgcrypto for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add invite columns to students
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS invite_token_hash text,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Update link_student_user to accept optional student_id and token for validation
CREATE OR REPLACE FUNCTION public.link_student_user(_student_id uuid DEFAULT NULL, _token text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _email text;
  _uid uuid;
  _found_student_id uuid;
  _stored_hash text;
  _expires timestamptz;
  _computed_hash text;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Not authenticated');
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;
  IF _email IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'No email found');
  END IF;

  -- If student_id and token provided, validate token
  IF _student_id IS NOT NULL AND _token IS NOT NULL THEN
    SELECT id, invite_token_hash, expires_at
    INTO _found_student_id, _stored_hash, _expires
    FROM public.students
    WHERE id = _student_id
      AND lower(email) = lower(_email)
      AND user_id IS NULL;

    IF _found_student_id IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'message', 'Student not found or already linked');
    END IF;

    -- Validate token hash
    _computed_hash := encode(digest(_token, 'sha256'), 'hex');
    IF _stored_hash IS NULL OR _stored_hash <> _computed_hash THEN
      RETURN jsonb_build_object('ok', false, 'message', 'Invalid token');
    END IF;

    -- Validate expiration
    IF _expires IS NOT NULL AND _expires < now() THEN
      RETURN jsonb_build_object('ok', false, 'message', 'Token expired');
    END IF;

    -- Link and clear token
    UPDATE public.students
    SET user_id = _uid, status = 'active', invite_token_hash = NULL
    WHERE id = _found_student_id;

    -- Ensure profile exists with student role
    INSERT INTO public.profiles (id, role, name)
    VALUES (_uid, 'student', '')
    ON CONFLICT (id) DO UPDATE SET role = 'student';

    RETURN jsonb_build_object('ok', true, 'linked', true, 'student_id', _found_student_id);
  END IF;

  -- Fallback: original behavior (find by email without token)
  SELECT id INTO _found_student_id
  FROM public.students
  WHERE lower(email) = lower(_email)
    AND user_id IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF _found_student_id IS NOT NULL THEN
    UPDATE public.students
    SET user_id = _uid, status = 'active'
    WHERE id = _found_student_id;
    RETURN jsonb_build_object('ok', true, 'linked', true, 'student_id', _found_student_id);
  END IF;

  -- Check if already linked
  SELECT id INTO _found_student_id
  FROM public.students
  WHERE user_id = _uid
  LIMIT 1;

  IF _found_student_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'linked', true, 'student_id', _found_student_id, 'already_linked', true);
  END IF;

  RETURN jsonb_build_object('ok', true, 'linked', false, 'message', 'No matching student record found');
END;
$function$;
