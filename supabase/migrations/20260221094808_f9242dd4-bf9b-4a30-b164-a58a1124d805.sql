-- Remove the overly permissive anon policy
DROP POLICY IF EXISTS "anon_check_email_exists" ON public.students;

-- Create a secure RPC to check email allowlist without exposing student data
CREATE OR REPLACE FUNCTION public.check_email_allowed(check_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students WHERE lower(email) = lower(check_email)
  );
$$;
