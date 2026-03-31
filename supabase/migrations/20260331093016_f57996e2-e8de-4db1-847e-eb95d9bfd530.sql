
-- ============================================================
-- 1. Drop all dangerous anon SELECT policies on child tables
-- ============================================================
DROP POLICY IF EXISTS "Anon can read tasks via share_token" ON public.project_tasks;
DROP POLICY IF EXISTS "Anon can read milestones" ON public.project_milestones;
DROP POLICY IF EXISTS "Anon can read project documents" ON public.project_documents;
DROP POLICY IF EXISTS "Anon can read task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Anon can read task comments" ON public.task_comments;

-- Drop dangerous anon WRITE policies
DROP POLICY IF EXISTS "Anon can insert tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Anon can update task status" ON public.project_tasks;
DROP POLICY IF EXISTS "Anon can insert project documents" ON public.project_documents;
DROP POLICY IF EXISTS "Anon can insert task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Anon can read task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Anon can update task attachments" ON public.task_attachments;

-- ============================================================
-- 2. Create SECURITY DEFINER RPCs for share-token access
-- ============================================================

-- Get tasks by share token
CREATE OR REPLACE FUNCTION public.get_tasks_by_share_token(p_token text)
RETURNS SETOF public.project_tasks
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT t.* FROM public.project_tasks t
  JOIN public.projects p ON p.id = t.project_id
  WHERE p.share_token = p_token
  ORDER BY t.sort_order ASC;
$$;

-- Get milestones by share token
CREATE OR REPLACE FUNCTION public.get_milestones_by_share_token(p_token text)
RETURNS SETOF public.project_milestones
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT m.* FROM public.project_milestones m
  JOIN public.projects p ON p.id = m.project_id
  WHERE p.share_token = p_token
  ORDER BY m.sort_order ASC;
$$;

-- Get documents by share token
CREATE OR REPLACE FUNCTION public.get_documents_by_share_token(p_token text)
RETURNS SETOF public.project_documents
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT d.* FROM public.project_documents d
  JOIN public.projects p ON p.id = d.project_id
  WHERE p.share_token = p_token
  ORDER BY d.created_at DESC;
$$;

-- Get comments by share token
CREATE OR REPLACE FUNCTION public.get_comments_by_share_token(p_token text)
RETURNS TABLE(id uuid, task_id uuid, user_id uuid, content text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.id, c.task_id, c.user_id, c.content, c.created_at
  FROM public.task_comments c
  JOIN public.project_tasks t ON t.id = c.task_id
  JOIN public.projects p ON p.id = t.project_id
  WHERE p.share_token = p_token
  ORDER BY c.created_at ASC;
$$;

-- Get attachments by share token
CREATE OR REPLACE FUNCTION public.get_attachments_by_share_token(p_token text)
RETURNS TABLE(id uuid, task_id uuid, file_name text, file_path text, uploaded_by uuid, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.id, a.task_id, a.file_name, a.file_path, a.uploaded_by, a.created_at
  FROM public.task_attachments a
  JOIN public.project_tasks t ON t.id = a.task_id
  JOIN public.projects p ON p.id = t.project_id
  WHERE p.share_token = p_token
  ORDER BY a.created_at DESC;
$$;

-- Insert task via share token
CREATE OR REPLACE FUNCTION public.add_task_by_share_token(p_token text, p_title text, p_sort_order int)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_project_id uuid;
BEGIN
  SELECT id INTO v_project_id FROM public.projects WHERE share_token = p_token;
  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Invalid share token';
  END IF;
  INSERT INTO public.project_tasks (project_id, title, status, sort_order)
  VALUES (v_project_id, p_title, 'a_faire_dd', p_sort_order);
END;
$$;

-- Update task status via share token
CREATE OR REPLACE FUNCTION public.update_task_status_by_share_token(p_token text, p_task_id uuid, p_status task_status)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.project_tasks t
    JOIN public.projects p ON p.id = t.project_id
    WHERE p.share_token = p_token AND t.id = p_task_id
  ) THEN
    RAISE EXCEPTION 'Task not found or invalid token';
  END IF;
  UPDATE public.project_tasks SET status = p_status WHERE id = p_task_id;
END;
$$;

-- Insert document via share token
CREATE OR REPLACE FUNCTION public.add_document_by_share_token(p_token text, p_name text, p_file_path text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_project_id uuid;
BEGIN
  SELECT id INTO v_project_id FROM public.projects WHERE share_token = p_token;
  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Invalid share token';
  END IF;
  INSERT INTO public.project_documents (project_id, name, file_path)
  VALUES (v_project_id, p_name, p_file_path);
END;
$$;

-- Insert task attachment via share token
CREATE OR REPLACE FUNCTION public.add_attachment_by_share_token(p_token text, p_task_id uuid, p_file_name text, p_file_path text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.project_tasks t
    JOIN public.projects p ON p.id = t.project_id
    WHERE p.share_token = p_token AND t.id = p_task_id
  ) THEN
    RAISE EXCEPTION 'Task not found or invalid token';
  END IF;
  INSERT INTO public.task_attachments (task_id, file_name, file_path, uploaded_by)
  VALUES (p_task_id, p_file_name, p_file_path, '00000000-0000-0000-0000-000000000000');
END;
$$;

-- Rename attachment via share token
CREATE OR REPLACE FUNCTION public.rename_attachment_by_share_token(p_token text, p_attachment_id uuid, p_new_name text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.task_attachments a
    JOIN public.project_tasks t ON t.id = a.task_id
    JOIN public.projects p ON p.id = t.project_id
    WHERE p.share_token = p_token AND a.id = p_attachment_id
  ) THEN
    RAISE EXCEPTION 'Attachment not found or invalid token';
  END IF;
  UPDATE public.task_attachments SET file_name = p_new_name WHERE id = p_attachment_id;
END;
$$;

-- ============================================================
-- 3. Fix storage policies
-- ============================================================

-- Drop dangerous anon storage policies on project-documents
DROP POLICY IF EXISTS "Anon can read project-documents" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload to project-documents" ON storage.objects;

-- Drop unscoped authenticated storage policies
DROP POLICY IF EXISTS "Users can view their project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their project invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload invoices" ON storage.objects;

-- Scoped authenticated storage policy for project-documents: read
CREATE POLICY "Scoped read project-documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-documents'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id::text = (string_to_array(name, '/'))[1]
      AND client_id = auth.uid()
    )
  )
);

-- Scoped authenticated storage policy for project-documents: upload
CREATE POLICY "Scoped upload project-documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id::text = (string_to_array(name, '/'))[1]
      AND client_id = auth.uid()
    )
  )
);

-- Scoped authenticated storage policy for project-invoices: read
CREATE POLICY "Scoped read project-invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-invoices'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id::text = (string_to_array(name, '/'))[1]
      AND client_id = auth.uid()
    )
  )
);

-- Scoped authenticated storage policy for project-invoices: upload
CREATE POLICY "Scoped upload project-invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-invoices'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id::text = (string_to_array(name, '/'))[1]
      AND client_id = auth.uid()
    )
  )
);

-- Signed URL generation function for share-token users (documents & attachments)
CREATE OR REPLACE FUNCTION public.get_signed_url_by_share_token(p_token text, p_bucket text, p_path text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_project_id uuid;
  v_url text;
BEGIN
  SELECT id INTO v_project_id FROM public.projects WHERE share_token = p_token;
  IF v_project_id IS NULL THEN
    RAISE EXCEPTION 'Invalid share token';
  END IF;
  -- Verify the file path starts with the project id
  IF NOT (p_path LIKE v_project_id::text || '/%') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  -- Generate signed URL using storage API
  SELECT storage.foldername(p_path) INTO v_url; -- placeholder, actual signed URL must be done via edge function
  RETURN '';
END;
$$;

-- Drop the signed URL function as it can't generate signed URLs from SQL
DROP FUNCTION IF EXISTS public.get_signed_url_by_share_token(text, text, text);
