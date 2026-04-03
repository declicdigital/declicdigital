
-- Blog posts table for CMS
CREATE TABLE public.cms_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft',
  category text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  read_time text NOT NULL DEFAULT '5 min',
  related_slugs text[] NOT NULL DEFAULT '{}',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published posts
CREATE POLICY "Anyone can read published posts"
  ON public.cms_blog_posts FOR SELECT
  TO public
  USING (status = 'published');

-- Admins can read all posts (including drafts)
CREATE POLICY "Admins can read all posts"
  ON public.cms_blog_posts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert posts
CREATE POLICY "Admins can insert posts"
  ON public.cms_blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update posts
CREATE POLICY "Admins can update posts"
  ON public.cms_blog_posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete posts
CREATE POLICY "Admins can delete posts"
  ON public.cms_blog_posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Page blocks table for CMS
CREATE TABLE public.cms_page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  block_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_page_blocks ENABLE ROW LEVEL SECURITY;

-- Everyone can read page blocks
CREATE POLICY "Anyone can read page blocks"
  ON public.cms_page_blocks FOR SELECT
  TO public
  USING (true);

-- Admins can insert blocks
CREATE POLICY "Admins can insert blocks"
  ON public.cms_page_blocks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update blocks
CREATE POLICY "Admins can update blocks"
  ON public.cms_page_blocks FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete blocks
CREATE POLICY "Admins can delete blocks"
  ON public.cms_page_blocks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read CMS images (public bucket)
CREATE POLICY "Anyone can read cms images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'cms-images');

-- Admins can upload CMS images
CREATE POLICY "Admins can upload cms images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete CMS images
CREATE POLICY "Admins can delete cms images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));
