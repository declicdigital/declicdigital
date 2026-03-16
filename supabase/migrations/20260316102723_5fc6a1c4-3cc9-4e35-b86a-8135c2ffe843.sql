ALTER TABLE public.form_submissions ADD COLUMN status text NOT NULL DEFAULT 'en_attente';

CREATE POLICY "Anyone can update submissions" ON public.form_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete submissions" ON public.form_submissions FOR DELETE TO anon, authenticated USING (true);