
-- Allow anonymous uploads to project-documents bucket
CREATE POLICY "Anon can upload to project-documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'project-documents');

-- Allow anonymous to read from project-documents (for signed URLs)
CREATE POLICY "Anon can read project-documents"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'project-documents');
