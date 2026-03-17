
-- Create task_attachments table
CREATE TABLE public.task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Users can see attachments on tasks they can see
CREATE POLICY "Users see attachments on their tasks"
ON public.task_attachments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM project_tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = task_attachments.task_id
    AND (p.client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- Users can insert attachments on their tasks
CREATE POLICY "Users can insert attachments on their tasks"
ON public.task_attachments
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM project_tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = task_attachments.task_id
    AND (p.client_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- Admins can delete attachments
CREATE POLICY "Admins can delete attachments"
ON public.task_attachments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid());
