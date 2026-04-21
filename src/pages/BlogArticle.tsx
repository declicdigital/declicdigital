import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Check } from "lucide-react";
import DOMPurify from "dompurify";

import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ArticleEndBlocks from "@/components/ArticleEndBlocks";
import { supabase } from "@/integrations/supabase/client";
import {
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
  getCategorySlug,
  type BlogPost as StaticBlogPost,
} from "@/data/blogPosts";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  status: string;
  category: string;
  tags: string[];
  read_time: string;
  related_slugs: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

const ShareBar = ({ post, formattedDate }: { post: BlogPost; formattedDate: string }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://declicdigital.net/blog/${post.slug}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-border pb-6">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Calendar size={14} /> {formattedDate}</span>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock size={14} /> {post.read_time} de lecture</span>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
      <button onClick={handleCopy}
        className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/80 transition-colors"
        title="Copier le lien">
        {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
        {copied ? "Lien copié !" : "Partager"}
      </button>
    </div>
  );
};

const processContent = (html: string) => {
  let processed = html.replace(
    /<div\s+class="cta-block"[^>]*data-cta-style="([^"]*)"[^>]*data-href="([^"]*)"[^>]*data-label="([^"]*)"[^>]*>.*?<\/div>/g,
    (_, style, href, label) => {
      const cls = style === "secondary" ? "cta-secondary" : "cta-primary";
      return `<div class="cta-wrapper"><a href="${href}" class="cta-button ${cls}">${label} →</a></div>`;
    }
  );
  return DOMPurify.sanitize(processed, { ADD_ATTR: ["class"] });
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug?.replace(/\/+$/, "");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!cleanSlug) { setNotFound(true); setLoading(false); return; }

      // 1. Chercher dans Supabase d'abord
      const { data } = await supabase
        .from("cms_blog_posts")
        .select("*")
        .eq("slug", cleanSlug)
        .eq("status", "published")
        .single();

      if (data) {
        setPost(data);
        setLoading(false);
        return;
      }

      // 2. Fallback sur les articles en dur
      const staticPost = getPostBySlug(cleanSlug);
      if (staticPost) {
        setPost({
          id: staticPost.slug,
          title: staticPost.title,
          slug: staticPost.slug,
          content: staticPost.content,
          excerpt: staticPost.excerpt,
          cover_image_url: staticPost.coverImageUrl ?? null,
          status: "published",
          category: staticPost.category,
          tags: staticPost.tags,
          read_time: staticPost.readTime,
          related_slugs: staticPost.relatedSlugs ?? [],
          meta_title: staticPost.metaTitle,
          meta_description: staticPost.metaDescription,
          created_at: staticPost.date,
          updated_at: staticPost.date,
        });
        setLoading(false);
        return;
      }

      setNotFound(true);
      setLoading(false);
    }
    fetchPost();
  }, [cleanSlug]);

  if (loading) return <PageLayout hideBlogCarousel><div className="min-h-screen" /></PageLayout>;
  if (notFound || !post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts({ slug: post.slug, category: post.category, relatedSlugs: post.related_slugs } as any).slice(0, 2);
  const formattedDate = new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const relatedSlugs = new Set(related.map((r) => r.slug));
  const latest = blogPosts
    .filter((a) => a.slug !== post.slug && !relatedSlugs.has(a.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((item) => ({ slug: item.slug, title: item.title, image: item.coverImageUrl || "", category: item.category }));

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.category, href: `/blog/categorie/${getCategorySlug(post.category)}` },
        { label: post.title },
      ]} />
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <link rel="canonical" href={`https://declicdigital.net/blog/${post.slug}`} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.meta_description || post.excerpt,
          datePublished: post.created_at,
          image: post.cover_image_url,
          author: { "@type": "Person", name: "Geoffrey", jobTitle: "Fondateur de Déclic Digital" },
          publisher: { "@type": "Organization", name: "Déclic Digital", url: "https://declicdigital.net" },
          mainEntityOfPage: `https://declicdigital.net/blog/${post.slug}`,
        })}</script>
      </Helmet>

      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Retour au blog
            </Link>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl leading-tight max-w-3xl">{post.title}</h1>
          </motion.div>
        </div>
      </div>

      <article className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <ShareBar post={post} formattedDate={formattedDate} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="cms-article-content"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }} />
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      <ArticleEndBlocks
        related={related.map((r) => ({ slug: r.slug, title: r.title, image: r.coverImageUrl || "", category: r.category }))}
        latest={latest}
      />
    </PageLayout>
  );
}
