
-- Project milestones table
CREATE TABLE public.project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  due_date date,
  completed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see milestones of their projects" ON public.project_milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_milestones.project_id 
    AND (projects.client_id = auth.uid() OR has_role(auth.uid(), 'admin')))
  );

CREATE POLICY "Admins can insert milestones" ON public.project_milestones
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update milestones" ON public.project_milestones
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete milestones" ON public.project_milestones
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Project invoices table
CREATE TABLE public.project_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'facture',
  file_path text NOT NULL,
  amount decimal(10,2),
  status text NOT NULL DEFAULT 'en_attente',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see invoices of their projects" ON public.project_invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_invoices.project_id 
    AND (projects.client_id = auth.uid() OR has_role(auth.uid(), 'admin')))
  );

CREATE POLICY "Admins can insert invoices" ON public.project_invoices
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can insert invoices" ON public.project_invoices
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_invoices.project_id 
    AND projects.client_id = auth.uid())
  );

CREATE POLICY "Admins can update invoices" ON public.project_invoices
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete invoices" ON public.project_invoices
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Storage bucket for invoices
INSERT INTO storage.buckets (id, name, public) VALUES ('project-invoices', 'project-invoices', false);

CREATE POLICY "Users can view their project invoices" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-invoices' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can upload invoices" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-invoices' AND auth.role() = 'authenticated');
