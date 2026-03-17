CREATE POLICY "Clients can update is_read on their project messages"
ON public.project_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_messages.project_id
    AND projects.client_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_messages.project_id
    AND projects.client_id = auth.uid()
  )
);