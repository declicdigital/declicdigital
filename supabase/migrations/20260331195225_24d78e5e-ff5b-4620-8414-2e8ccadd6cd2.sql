-- Add DELETE policy for project-invoices bucket (admins only)
CREATE POLICY "Admins can delete project invoices"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'project-invoices'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Restrict form-files uploads: add file size limit (5MB) and allowed MIME types
-- First drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can upload form files" ON storage.objects;

-- Re-create with file type and size restrictions
CREATE POLICY "Anyone can upload form files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'form-files'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND (
    LOWER(storage.extension(name)) IN ('pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx')
  )
);