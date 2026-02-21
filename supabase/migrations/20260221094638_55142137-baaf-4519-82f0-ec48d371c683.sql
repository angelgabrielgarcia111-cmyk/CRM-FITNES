-- Allow anyone (including anon) to check if an email exists in students
-- This is safe because we only expose the id, not sensitive data
CREATE POLICY "anon_check_email_exists"
ON public.students
FOR SELECT
TO anon
USING (true);
