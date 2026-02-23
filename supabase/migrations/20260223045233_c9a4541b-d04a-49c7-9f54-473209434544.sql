
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'trainer', 'student');

-- 2. Create user_roles table (authoritative source for roles)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create is_admin helper for frontend
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 5. RLS for user_roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Create trainer_invites table
CREATE TABLE public.trainer_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  accepted_at timestamptz
);

CREATE UNIQUE INDEX trainer_invites_email_unique ON public.trainer_invites (lower(email));

ALTER TABLE public.trainer_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage trainer_invites"
ON public.trainer_invites
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Migrate existing profiles.role data to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role FROM public.profiles
WHERE role IN ('trainer', 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. Create accept_trainer_invite function (called on first trainer login)
CREATE OR REPLACE FUNCTION public.accept_trainer_invite()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _email text;
  _invite_id uuid;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Not authenticated');
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;

  SELECT id INTO _invite_id
  FROM public.trainer_invites
  WHERE lower(email) = lower(_email)
    AND status = 'sent'
  LIMIT 1;

  IF _invite_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'No pending invite found');
  END IF;

  -- Assign trainer role in user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'trainer')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Keep profiles.role in sync for backward compat
  UPDATE public.profiles SET role = 'trainer' WHERE id = _uid;

  -- Mark invite as accepted
  UPDATE public.trainer_invites
  SET status = 'accepted', accepted_at = now()
  WHERE id = _invite_id;

  RETURN jsonb_build_object('ok', true, 'message', 'Trainer role assigned');
END;
$$;

-- 9. Protect profiles.role from client-side changes
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_profile_role_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();

-- 10. Update handle_new_user to also insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role text;
BEGIN
  v_role := coalesce(new.raw_user_meta_data->>'role', 'trainer');

  INSERT INTO public.profiles (id, role, name)
  VALUES (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''));

  -- Also insert into user_roles
  IF v_role IN ('trainer', 'student', 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, v_role::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;
