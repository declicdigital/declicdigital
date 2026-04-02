
-- Create a SECURITY DEFINER function to safely mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_project_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the caller owns the project or is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id
    AND (client_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.project_messages
  SET is_read = true
  WHERE project_id = p_project_id
    AND user_id != p_user_id
    AND is_read = false;
END;
$$;

-- Drop the overpermissive client UPDATE policy
DROP POLICY IF EXISTS "Clients can update is_read on their project messages" ON public.project_messages;
