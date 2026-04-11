import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Check, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ArticleEndBlocks from "@/components/ArticleEndBlocks";
import { blogArticles } from "@/data/blogArticles";
import { mergeBlogArticles } from "@/lib/blog";
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
  related_slugs: string[];
}

const ShareBar = ({ post, formattedDate }: { post: CmsPost; formattedDate: string }) => {
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
      <button onClick={handleCopy} className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/80 transition-colors" title="Copier le lien de partage">
        {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
        {copied ? "Lien copié !" : "Partager"}
      </button>
    </div>
  );
};

const CmsBlogArticle = () => {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [relatedCms, setRelatedCms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const cleanSlug = slug.replace(/\/+$/, "");
    supabase.from("cms_blog_posts").select("*").eq("slug", cleanSlug).eq("status", "published").single()
      .then(({ data }) => { setPost(data as CmsPost | null); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    supabase.from("cms_blog_posts").select("id, title, slug, excerpt, cover_image_url, category, read_time, created_at")
      .eq("status", "published").neq("slug", post.slug).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setRelatedCms(data); });
  }, [post]);

  if (loading) return <PageLayout><div className="min-h-screen" /></PageLayout>;
  if (!post) return <Navigate to="/blog" replace />;

  const formattedDate = new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  // Related: same category first, max 2
  const sameCategory = relatedCms.filter(p => p.category === post.category);
  const others = relatedCms.filter(p => p.category !== post.category);
  const related = [...sameCategory, ...others].slice(0, 2);

  // Latest: mix static + CMS, exclude current + related
  const relatedSlugs = new Set(related.map(r => r.slug));
  const latest = mergeBlogArticles(
    blogArticles.filter((a) => a.slug !== post.slug && !relatedSlugs.has(a.slug)),
    relatedCms.filter((r) => r.slug !== post.slug && !relatedSlugs.has(r.slug))
  )
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      image: item.image,
      category: item.category,
    }));

  const processContent = (html: string) => {
    // Pre-process CTA blocks BEFORE sanitization:
    // TipTap renders: <div class="cta-block" data-cta-style="..." data-href="..." data-label="..."><span>text</span></div>
    // Convert to proper <a> tags before DOMPurify strips data-* attributes
    let processed = html.replace(
      /<div\s+class="cta-block"[^>]*data-cta-style="([^"]*)"[^>]*data-href="([^"]*)"[^>]*data-label="([^"]*)"[^>]*>.*?<\/div>/g,
      (_, style, href, label) => {
        const cls = style === "secondary" ? "cta-secondary" : "cta-primary";
        return `<div class="cta-wrapper"><a href="${href}" class="cta-button ${cls}">${label} →</a></div>`;
      }
    );
    // Also handle when data attributes are in different order
    processed = processed.replace(
      /<div\s+class="cta-block"[^>]*?data-href="([^"]*)"[^>]*?data-label="([^"]*)"[^>]*?data-cta-style="([^"]*)"[^>]*>.*?<\/div>/g,
      (_, href, label, style) => {
        const cls = style === "secondary" ? "cta-secondary" : "cta-primary";
        return `<div class="cta-wrapper"><a href="${href}" class="cta-button ${cls}">${label} →</a></div>`;
      }
    );
    // Fallback: any remaining cta-block divs with data-href
    processed = processed.replace(
      /<div\s+class="cta-block"[^>]*?data-href="([^"]*)"[^>]*?>.*?<\/div>/g,
      (_, href) => {
        // Extract text content from inside the div
        const textMatch = _.match(/>([^<]+)</);
        const label = textMatch ? textMatch[1].trim() : "En savoir plus";
        return `<div class="cta-wrapper"><a href="${href}" class="cta-button cta-primary">${label} →</a></div>`;
      }
    );

    const sanitized = DOMPurify.sanitize(processed, { ADD_ATTR: ['class'] });
    return sanitized;
  };

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.category }, { label: post.title }]} />
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <link rel="canonical" href={`https://declicdigital.net/blog/${post.slug}`} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "BlogPosting",
            headline: post.title, description: post.meta_description || post.excerpt,
            datePublished: post.created_at, image: post.cover_image_url,
            author: { "@type": "Person", name: "Geoffrey", jobTitle: "Fondateur de Déclic Digital" },
            publisher: { "@type": "Organization", name: "Déclic Digital", url: "https://declicdigital.net" },
            mainEntityOfPage: `https://declicdigital.net/blog/${post.slug}`,
          })}
        </script>
      </Helmet>

      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {post.cover_image_url && <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-between mb-4">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
                <ArrowLeft size={14} /> Retour au blog
              </Link>
              {isAdmin && (
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white hover:bg-white/30 transition-colors"
                >
                  <Pencil size={14} /> Modifier
                </Link>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl leading-tight max-w-3xl">{post.title}</h1>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <article className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <ShareBar post={post} formattedDate={formattedDate} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="cms-article-content" dangerouslySetInnerHTML={{ __html: processContent(post.content) }} />
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
        related={related.map((r) => ({
          slug: r.slug,
          title: r.title,
          image: r.cover_image_url || "",
          category: r.category,
        }))}
        latest={latest.map((a) => ({
          slug: a.slug,
          title: a.title,
          image: a.image,
          category: a.category,
        }))}
      />
    </PageLayout>
  );
};

export default CmsBlogArticle;
