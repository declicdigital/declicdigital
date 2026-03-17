
-- Add share_token to projects
ALTER TABLE public.projects ADD COLUMN share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');

-- Generate tokens for existing projects that don't have one
UPDATE public.projects SET share_token = encode(gen_random_bytes(16), 'hex') WHERE share_token IS NULL;

-- Allow anonymous read access to projects via share_token
CREATE POLICY "Anyone can read project by share_token"
ON public.projects
FOR SELECT
TO anon
USING (share_token IS NOT NULL);

-- Allow anon to read tasks of shared projects
CREATE POLICY "Anon can read tasks via share_token"
ON public.project_tasks
FOR SELECT
TO anon
USING (true);

-- Allow anon to insert tasks
CREATE POLICY "Anon can insert tasks"
ON public.project_tasks
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to update task status
CREATE POLICY "Anon can update task status"
ON public.project_tasks
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow anon to read task comments
CREATE POLICY "Anon can read task comments"
ON public.task_comments
FOR SELECT
TO anon
USING (true);

-- Allow anon to read task attachments
CREATE POLICY "Anon can read task attachments"
ON public.task_attachments
FOR SELECT
TO anon
USING (true);

-- Allow anon to insert task attachments
CREATE POLICY "Anon can insert task attachments"
ON public.task_attachments
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to read documents of shared projects
CREATE POLICY "Anon can read project documents"
ON public.project_documents
FOR SELECT
TO anon
USING (true);

-- Allow anon to insert documents
CREATE POLICY "Anon can insert project documents"
ON public.project_documents
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon to read milestones
CREATE POLICY "Anon can read milestones"
ON public.project_milestones
FOR SELECT
TO anon
USING (true);
