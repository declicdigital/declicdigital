import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import DOMPurify from "dompurify";

interface CmsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  read_time: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
}

const CmsBlogArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("cms_blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data }) => {
        setPost(data as CmsPost | null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <PageLayout><div className="min-h-screen" /></PageLayout>;
  if (!post) return <Navigate to="/blog" replace />;

  const date = new Date(post.created_at).toLocaleDateString("fr-FR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <PageLayout>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <link rel="canonical" href={`https://declicdigital.net/blog/${post.slug}`} />
      </Helmet>

      <article className="mx-auto max-w-3xl px-4 py-12">
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="w-full rounded-xl mb-8 aspect-video object-cover" />
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.read_time}</span>
          {post.category && (
            <span className="flex items-center gap-1.5"><Tag size={14} /> {post.category}</span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">{post.title}</h1>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        <div className="mt-12 pt-6 border-t">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={16} /> Retour au blog
          </Link>
        </div>
      </article>
    </PageLayout>
  );
};

export default CmsBlogArticle;
