
-- RPC to link a student record to the authenticated user (bypasses RLS)
CREATE OR REPLACE FUNCTION public.link_student_user()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email text;
  _uid uuid;
  _student_id uuid;
  _name text;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Not authenticated');
  END IF;

  -- Get user email from auth
  SELECT email INTO _email FROM auth.users WHERE id = _uid;
  IF _email IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'No email found');
  END IF;

  -- Find the most recent unlinked student record matching this email
  SELECT id INTO _student_id
  FROM public.students
  WHERE lower(email) = lower(_email)
    AND user_id IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF _student_id IS NOT NULL THEN
    UPDATE public.students
    SET user_id = _uid, status = 'active'
    WHERE id = _student_id;
    RETURN jsonb_build_object('ok', true, 'linked', true, 'student_id', _student_id);
  END IF;

  -- Check if already linked
  SELECT id INTO _student_id
  FROM public.students
  WHERE user_id = _uid
  LIMIT 1;

  IF _student_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'linked', true, 'student_id', _student_id, 'already_linked', true);
  END IF;

  RETURN jsonb_build_object('ok', true, 'linked', false, 'message', 'No matching student record found');
END;
$$;
