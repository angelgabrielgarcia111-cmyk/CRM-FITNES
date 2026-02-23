
-- Fix search_path on handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  v_role := coalesce(new.raw_user_meta_data->>'role', 'trainer');

  INSERT INTO public.profiles (id, role, name)
  VALUES (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''));

  IF v_role IN ('trainer', 'student', 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, v_role::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;
