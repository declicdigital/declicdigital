
-- Drop all existing permissive policies on form_submissions
DROP POLICY IF EXISTS "Anyone can delete submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Anyone can read submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.form_submissions;

-- Allow anyone (anon + authenticated) to INSERT (public form)
CREATE POLICY "Anyone can submit form"
ON public.form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can SELECT
CREATE POLICY "Admins can read submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can UPDATE
CREATE POLICY "Admins can update submissions"
ON public.form_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can DELETE
CREATE POLICY "Admins can delete submissions"
ON public.form_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
