
-- Add drive_url to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS drive_url text DEFAULT '';

-- Allow updating task_attachments (for renaming)
CREATE POLICY "Users can update own task attachments"
ON public.task_attachments
FOR UPDATE
TO authenticated
USING (
  uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)
);

-- Allow anon to update task attachments (shared view)
CREATE POLICY "Anon can update task attachments"
ON public.task_attachments
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
