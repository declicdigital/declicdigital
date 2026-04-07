-- Fix 1: Add caller guard to has_role function
-- Users can only check their own role, service_role can check any user
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role (used by edge functions) and internal RLS policy evaluation
  -- For authenticated users, only allow checking their own role
  IF auth.uid() IS NOT NULL AND auth.uid() != _user_id THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Fix 2: Replace the ALL policy on user_roles with explicit per-command policies
-- Drop the existing ALL policy
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Admins can read roles
CREATE POLICY "Admins can read roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Users can read their own roles (needed for client-side role check)
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Block all direct INSERT from client — roles are assigned via service_role in edge functions
CREATE POLICY "Service role can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);
