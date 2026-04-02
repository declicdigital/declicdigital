import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import { getArticleBySlug, getRelatedArticles, getCategorySlug, type BlogArticle as BlogArticleType } from "@/data/blogArticles";

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

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) return <Navigate to="/blog" replace />;

  const related = getRelatedArticles(article);
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
    // Split on **bold** and [link](url) patterns
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

  return (
    <PageLayout>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: article.category, href: `/blog/categorie/${getCategorySlug(article.category)}` }, { label: article.title }]} />
      <Helmet>
        <title>{article.metaTitle}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={`https://declic-digital.fr/blog/${article.slug}`} />
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
            author: {
              "@type": "Person",
              name: "Geoffrey",
              jobTitle: "Fondateur de Déclic Digital",
            },
            publisher: {
              "@type": "Organization",
              name: "Déclic Digital",
              url: "https://declic-digital.fr",
            },
            mainEntityOfPage: `https://declic-digital.fr/blog/${article.slug}`,
          })}
        </script>
      </Helmet>

      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
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
          {/* Meta bar */}
          <ShareBar article={article} formattedDate={formattedDate} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose-custom"
          >
            {renderContent(article.content)}
          </motion.div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30 py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold">Articles similaires</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="group block">
                  <article className="overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-shadow">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-primary">{r.category}</span>
                      <h3 className="mt-2 text-lg font-bold group-hover:text-primary transition-colors">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Lire <ArrowRight size={14} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="gradient-miami py-14">
        <div className="container text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Envie d'un site qui performe ?</h2>
          <p className="mt-3 text-white/80">
            Demandez votre audit SEO gratuit et découvrez comment améliorer votre visibilité.
          </p>
          <Link
            to="/audit-seo-gratuit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 py-3 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow transition-opacity"
          >
            Audit SEO gratuit <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogArticle;
