
-- Update handle_new_user to support student invitations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  _role text;
  _student_id uuid;
begin
  _role := coalesce(new.raw_user_meta_data->>'role', 'trainer');

  insert into public.profiles (id, role, name)
  values (new.id, _role, coalesce(new.raw_user_meta_data->>'name', ''));

  -- Auto-link invited student to their record
  if _role = 'student' then
    _student_id := (new.raw_user_meta_data->>'student_id')::uuid;
    if _student_id is not null then
      update public.students set user_id = new.id where id = _student_id and user_id is null;
    end if;
  end if;

  return new;
end;
$$;

-- Replace restrictive SELECT policy with permissive ones for trainer + student
DROP POLICY IF EXISTS "students_select_own" ON public.students;

CREATE POLICY "trainer_select_students"
ON public.students
FOR SELECT
TO authenticated
USING (trainer_id = auth.uid());

CREATE POLICY "student_select_own"
ON public.students
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
