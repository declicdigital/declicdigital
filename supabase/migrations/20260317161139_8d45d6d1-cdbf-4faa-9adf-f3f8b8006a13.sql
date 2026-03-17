
-- Allow clients to update task status on their own project tasks
CREATE POLICY "Clients can update tasks on their projects"
ON public.project_tasks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.client_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_tasks.project_id
    AND projects.client_id = auth.uid()
  )
);
