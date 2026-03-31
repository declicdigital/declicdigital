
-- Drop the broken policy
DROP POLICY IF EXISTS "Anyone can read project by share_token" ON public.projects;

-- Create a secure RPC to fetch a project by share_token
CREATE OR REPLACE FUNCTION public.get_project_by_share_token(p_token text)
RETURNS SETOF public.projects
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.projects WHERE share_token = p_token LIMIT 1;
$$;
