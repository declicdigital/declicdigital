import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogArticles } from "@/data/blogArticles";
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
  const [post, setPost] = useState<CmsPost | null>(null);
  const [relatedCms, setRelatedCms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("cms_blog_posts").select("*").eq("slug", slug).eq("status", "published").single()
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
  const latest = [
    ...blogArticles.filter(a => a.slug !== post.slug && !relatedSlugs.has(a.slug)).map(a => ({
      slug: a.slug, title: a.title, image: a.image, category: a.category, date: a.date,
    })),
    ...relatedCms.filter(r => r.slug !== post.slug && !relatedSlugs.has(r.slug)).map(r => ({
      slug: r.slug, title: r.title, image: r.cover_image_url || "", category: r.category, date: r.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const processContent = (html: string) => {
    let sanitized = DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'data-cta-style'] });
    sanitized = sanitized.replace(
      /<div class="cta-block"[^>]*data-cta-style="([^"]*)"[^>]*><a href="([^"]*)">(.*?)<\/a><\/div>/g,
      (_, style, href, text) => {
        const isPrimary = style !== "secondary";
        return `<div style="text-align:center;margin:2.5rem 0"><a href="${href}" class="inline-flex items-center gap-2 rounded-full ${isPrimary ? 'gradient-primary btn-glow' : 'border-2 border-primary'} px-8 py-3 font-bold ${isPrimary ? 'text-white' : 'text-primary'} text-lg hover:opacity-90 transition-opacity shadow-lg">${text}</a></div>`;
      }
    );
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
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Retour au blog
            </Link>
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

      {/* A) Related articles — 2 max, compact */}
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30 py-10">
          <div className="container">
            <h2 className="mb-6 text-xl font-bold">Articles similaires</h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="group block">
                  <article className="overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow">
                    {r.cover_image_url && (
                      <div className="aspect-[2/1] overflow-hidden">
                        <img src={r.cover_image_url} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs font-semibold text-primary">{r.category}</span>
                      <h3 className="mt-1 text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">Lire <ArrowRight size={12} /></span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* B) CTA SEO */}
      <section className="gradient-miami py-12">
        <div className="container text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Envie d'un site qui performe ?</h2>
          <p className="mt-3 text-white/80">Demandez votre audit SEO gratuit et découvrez comment améliorer votre visibilité.</p>
          <Link to="/audit-seo-gratuit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 py-3 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow transition-opacity">
            Audit SEO gratuit <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* C) Latest blog articles — 3 articles */}
      <section className="py-12">
        <div className="container">
          <h2 className="mb-6 text-xl font-bold">Le Blog — Nos derniers articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {latest.map((a) => (
              <Link key={a.slug} to={`/blog/${a.slug}`} className="group block">
                <article className="overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow">
                  <div className="aspect-[2/1] overflow-hidden">
                    <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary">{a.category}</span>
                    <h3 className="mt-1 text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">{a.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">Lire <ArrowRight size={12} /></span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CmsBlogArticle;
