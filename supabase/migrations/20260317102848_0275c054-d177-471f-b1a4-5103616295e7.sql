CREATE POLICY "Clients can insert tasks on their projects"
ON public.project_tasks
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_tasks.project_id
    AND projects.client_id = auth.uid()
  )
);