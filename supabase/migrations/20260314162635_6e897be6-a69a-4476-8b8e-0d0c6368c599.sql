
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'form-files',
  'form-files',
  false,
  10485760,
  ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','application/pdf','video/mp4','video/quicktime','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

CREATE POLICY "Anyone can upload form files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'form-files');

CREATE POLICY "Anyone can read form files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'form-files');

ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS file_paths text[] DEFAULT '{}'::text[];
