
-- 1. Remove the permissive open INSERT policy on form_submissions
DROP POLICY IF EXISTS "Anyone can submit form" ON public.form_submissions;

-- 2. Replace with service_role-only INSERT policy (edge function uses service role key)
CREATE POLICY "Only service role can insert submissions"
ON public.form_submissions
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- 3. Add admin DELETE policy for form-files storage bucket
CREATE POLICY "Admins can delete form files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'form-files'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
