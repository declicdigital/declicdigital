import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Check } from "lucide-react";
import DOMPurify from "dompurify";

import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ArticleEndBlocks from "@/components/ArticleEndBlocks";
import {
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
  getCategorySlug,
  type BlogPost,
} from "@/data/blogPosts";

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
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar size={14} /> {formattedDate}
      </span>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock size={14} /> {post.readTime} de lecture
      </span>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {post.category}
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

// Process TipTap CTA blocks → real <a> tags before sanitization
const processContent = (html: string) => {
  let processed = html.replace(
    /<div\s+class="cta-block"[^>]*data-cta-style="([^"]*)"[^>]*data-href="([^"]*)"[^>]*data-label="([^"]*)"[^>]*>.*?<\/div>/g,
    (_, style, href, label) => {
      const cls = style === "secondary" ? "cta-secondary" : "cta-primary";
      return `<div class="cta-wrapper"><a href="${href}" class="cta-button ${cls}">${label} →</a></div>`;
    }
  );
  processed = processed.replace(
    /<div\s+class="cta-block"[^>]*?data-href="([^"]*)"[^>]*?data-label="([^"]*)"[^>]*?data-cta-style="([^"]*)"[^>]*>.*?<\/div>/g,
    (_, href, label, style) => {
      const cls = style === "secondary" ? "cta-secondary" : "cta-primary";
      return `<div class="cta-wrapper"><a href="${href}" class="cta-button ${cls}">${label} →</a></div>`;
    }
  );
  processed = processed.replace(
    /<div\s+class="cta-block"[^>]*?data-href="([^"]*)"[^>]*?>.*?<\/div>/g,
    (match, href) => {
      const textMatch = match.match(/>([^<]+)</);
      const label = textMatch ? textMatch[1].trim() : "En savoir plus";
      return `<div class="cta-wrapper"><a href="${href}" class="cta-button cta-primary">${label} →</a></div>`;
    }
  );
  return DOMPurify.sanitize(processed, { ADD_ATTR: ["class"] });
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug?.replace(/\/+$/, "");
  const post = cleanSlug ? getPostBySlug(cleanSlug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post).slice(0, 2);
  const formattedDate = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Latest: exclude current + related, max 3
  const relatedSlugs = new Set(related.map((r) => r.slug));
  const latest = blogPosts
    .filter((a) => a.slug !== post.slug && !relatedSlugs.has(a.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      image: item.coverImageUrl || "",
      category: item.category,
    }));

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category, href: `/blog/categorie/${getCategorySlug(post.category)}` },
          { label: post.title },
        ]}
      />
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://declicdigital.net/blog/${post.slug}`} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        {post.coverImageUrl && <meta property="og:image" content={post.coverImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.date,
            image: post.coverImageUrl,
            author: { "@type": "Person", name: "Geoffrey", jobTitle: "Fondateur de Déclic Digital" },
            publisher: { "@type": "Organization", name: "Déclic Digital", url: "https://declicdigital.net" },
            mainEntityOfPage: `https://declicdigital.net/blog/${post.slug}`,
          })}
        </script>
      </Helmet>

      {/* Hero image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {post.coverImageUrl && (
          <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Retour au blog
            </Link>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl leading-tight max-w-3xl">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <article className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <ShareBar post={post} formattedDate={formattedDate} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="cms-article-content"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
          {post.tags.length > 0 && (
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
          image: r.coverImageUrl || "",
          category: r.category,
        }))}
        latest={latest}
      />
    </PageLayout>
  );
};

export default BlogArticle;
