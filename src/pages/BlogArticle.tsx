import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import ArticleEndBlocks from "@/components/ArticleEndBlocks";
import { blogArticles, getArticleBySlug, getRelatedArticles, getCategorySlug, type BlogArticle as BlogArticleType } from "@/data/blogArticles";

const getShareUrl = (slug: string) =>
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-meta?path=/blog/${slug}`;

const ShareBar = ({ article, formattedDate }: { article: BlogArticleType; formattedDate: string }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(article.slug);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-border pb-6">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar size={14} /> {formattedDate}
      </span>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock size={14} /> {article.readTime} de lecture
      </span>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {article.category}
      </span>
      <button
        onClick={handleCopy}
        className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/80 transition-colors"
        title="Copier le lien de partage"
      >
        {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
        {copied ? "Lien copié !" : "Partager"}
      </button>
    </div>
  );
};

const CmsBlogArticle = lazy(() => import("./CmsBlogArticle"));

const BlogArticleInner = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const [latestCms, setLatestCms] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("cms_blog_posts")
      .select("id, title, slug, cover_image_url, category, read_time, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setLatestCms(data); });
  }, []);

  // If no static article found, try CMS
  if (!article) {
    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <CmsBlogArticle />
      </Suspense>
    );
  }

  const related = getRelatedArticles(article).slice(0, 2);
  const formattedDate = new Date(article.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Simple markdown-like rendering for h2, h3, bold, lists
  const renderContent = (content: string) => {
    return content
      .trim()
      .split("\n")
      .map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        const ctaMatch = trimmed.match(/^\[CTA:(.+):(.+)\]$/);
        if (ctaMatch) {
          const [, ctaText, ctaUrl] = ctaMatch;
          return (
            <div key={i} className="my-10 text-center">
              <Link
                to={ctaUrl}
                className="inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-8 py-3 font-bold text-white text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                {ctaText} <ArrowRight size={18} />
              </Link>
            </div>
          );
        }
        if (trimmed === "[MAP]") {
          return (
            <div key={i} className="my-10">
              <MapEmbed title="Notre fiche Google Maps" subtitle="Déclic Digital — 57 Rue d'Alleray, Paris 15e" />
            </div>
          );
        }
        if (trimmed.startsWith("#### "))
          return (
            <h4 key={i} className="mt-6 mb-2 text-lg font-bold text-foreground">
              {trimmed.slice(5)}
            </h4>
          );
        if (trimmed.startsWith("### "))
          return (
            <h3 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">
              {trimmed.slice(4)}
            </h3>
          );
        if (trimmed.startsWith("## "))
          return (
            <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-foreground">
              {trimmed.slice(3)}
            </h2>
          );
        if (trimmed.startsWith("- "))
          return (
            <li key={i} className="ml-4 list-disc text-muted-foreground leading-relaxed">
              {renderInline(trimmed.slice(2))}
            </li>
          );
        return (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">
            {renderInline(trimmed)}
          </p>
        );
      });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        const isExternal = url.startsWith("http");
        return (
          <Link
            key={i}
            to={url}
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {linkText}
          </Link>
        );
      }
      return part;
    });
  };

  // Build latest articles (mix static + CMS, exclude current, exclude related)
  const relatedSlugs = new Set(related.map(r => r.slug));
  const latest = [
    ...blogArticles.filter(a => a.slug !== article.slug && !relatedSlugs.has(a.slug)).map(a => ({
      slug: a.slug, title: a.title, image: a.image, category: a.category, date: a.date,
    })),
    ...latestCms.filter(c => c.slug !== article.slug && !relatedSlugs.has(c.slug)).map(c => ({
      slug: c.slug, title: c.title, image: c.cover_image_url || "", category: c.category, date: c.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: article.category, href: `/blog/categorie/${getCategorySlug(article.category)}` }, { label: article.title }]} />
      <Helmet>
        <title>{article.metaTitle}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={`https://declicdigital.net/blog/${article.slug}`} />
        <meta property="og:title" content={article.metaTitle} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={article.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.metaTitle} />
        <meta name="twitter:description" content={article.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.metaDescription,
            datePublished: article.date,
            image: article.image,
            author: { "@type": "Person", name: "Geoffrey", jobTitle: "Fondateur de Déclic Digital" },
            publisher: { "@type": "Organization", name: "Déclic Digital", url: "https://declicdigital.net" },
            mainEntityOfPage: `https://declicdigital.net/blog/${article.slug}`,
          })}
        </script>
      </Helmet>

      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Retour au blog
            </Link>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl leading-tight max-w-3xl">
              {article.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <article className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <ShareBar article={article} formattedDate={formattedDate} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="prose-custom">
            {renderContent(article.content)}
          </motion.div>
          <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
            {article.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <ArticleEndBlocks related={related} latest={latest} />
    </PageLayout>
  );
};

const BlogArticle = BlogArticleInner;
export default BlogArticle;
