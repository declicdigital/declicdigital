-- Fix 1: Restrict user_roles UPDATE policy to prevent admins from changing role values
-- Drop the existing overly permissive UPDATE policy
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

-- Recreate with WITH CHECK that prevents changing the role column
-- Admins can update rows but the role value must remain unchanged
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND role = (SELECT ur.role FROM public.user_roles ur WHERE ur.id = public.user_roles.id)
);

-- Fix 2: Add INSERT policy on profiles so users can create their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);