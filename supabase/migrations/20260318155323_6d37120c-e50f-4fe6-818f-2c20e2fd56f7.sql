
-- Allow authenticated users to update their own project documents (name only)
CREATE POLICY "Users can update own project documents"
ON public.project_documents
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id
    AND (projects.client_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_documents.project_id
    AND (projects.client_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);
