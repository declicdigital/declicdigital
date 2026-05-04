import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogPosts as staticPosts, blogCategories, getCategorySlug } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  isFromSupabase?: boolean;
}

const categoryBadge: Record<string, { bg: string; color: string }> = {
  "Création de site":   { bg: "#6D28D9", color: "#FFFFFF" },
  "SEO & Performance":  { bg: "#059669", color: "#FFFFFF" },
  "Stratégie digitale": { bg: "#E11D48", color: "#FFFFFF" },
  "GEO, Visibilité IA": { bg: "#0284C7", color: "#FFFFFF" },
  "Business":           { bg: "#D97706", color: "#FFFFFF" },
};
const getBadge = (cat: string) => categoryBadge[cat] ?? { bg: "#2B1E3F", color: "#F6F1E9" };

// Badge compact pour les cards
const Badge = ({ cat, small = false }: { cat: string; small?: boolean }) => {
  const s = getBadge(cat);
  return (
    <span
      className="inline-block rounded-full font-bold"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: small ? "10px" : "11px",
        padding: small ? "2px 8px" : "3px 10px",
        letterSpacing: "0.02em",
      }}
    >
      {cat}
    </span>
  );
};

// ── Carousel card — 3 slots : petit | GRAND | petit ──
const CarouselCard = ({ article, size }: { article: Article; size: "sm" | "lg" }) => {
  const isLg = size === "lg";
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="block group flex-shrink-0 transition-all duration-300"
      style={{
        width: isLg ? "42%" : "26%",
        opacity: isLg ? 1 : 0.72,
        transform: isLg ? "scale(1)" : "scale(0.94)",
      }}
    >
      <article
        className="h-full overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#F6F1E9",
          border: isLg ? "2px solid rgba(43,30,63,0.2)" : "1.5px solid rgba(43,30,63,0.12)",
          boxShadow: isLg
            ? "4px 4px 0px rgba(43,30,63,0.15), 8px 8px 0px rgba(43,30,63,0.06)"
            : "2px 2px 0px rgba(43,30,63,0.08)",
        }}
      >
        <div className="overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              width={isLg ? 600 : 380}
              height={isLg ? 338 : 214}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
              <span style={{ color: "#2B1E3F", opacity: 0.1, fontSize: isLg ? "3rem" : "2rem", fontWeight: 700 }}>
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div style={{ padding: isLg ? "16px 20px" : "12px 14px" }}>
          <Badge cat={article.category} small={!isLg} />
          <h3
            className="mt-2 font-bold leading-snug line-clamp-2"
            style={{ color: "#2B1E3F", fontSize: isLg ? "15px" : "12px" }}
          >
            {article.title}
          </h3>
          {isLg && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.6 }}>
              {article.excerpt}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between" style={{ fontSize: "11px", color: "#2B1E3F", opacity: 0.4 }}>
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
          </div>
          <span
            className="mt-2 inline-flex items-center gap-1 font-semibold group-hover:gap-2 transition-all"
            style={{ fontSize: "11px", color: "#4361EE" }}
          >
            Lire <ArrowRight size={10} />
          </span>
        </div>
      </article>
    </Link>
  );
};

const CardSkeleton = ({ size }: { size: "sm" | "lg" }) => (
  <div
    className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse"
    style={{
      width: size === "lg" ? "42%" : "26%",
      border: "1.5px solid rgba(43,30,63,0.10)",
      opacity: size === "lg" ? 1 : 0.7,
    }}
  >
    <div style={{ aspectRatio: "16/9", backgroundColor: "#E9F2F4" }} />
    <div className="p-4 space-y-2">
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "45%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "80%" }} />
    </div>
  </div>
);

const toArticles = (posts: typeof staticPosts): Article[] =>
  posts.map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    coverImageUrl: p.coverImageUrl ?? null, category: p.category,
    tags: p.tags, readTime: p.readTime, date: p.date,
  }));

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>(() => toArticles(staticPosts));
  const [enriching, setEnriching] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function enrichWithSupabase() {
      try {
        const { data, error } = await supabase
          .from("cms_blog_posts")
          .select("slug, title, excerpt, cover_image_url, category, tags, read_time, created_at")
          .eq("status", "published")
          .order("created_at", { ascending: false });
        if (error || !data || data.length === 0) return;
        const supabaseSlugs = new Set(data.map((a: any) => a.slug));
        const staticFiltered = toArticles(staticPosts.filter((p) => !supabaseSlugs.has(p.slug)));
        const remoteArticles: Article[] = data.map((a: any) => ({
          slug: a.slug, title: a.title, excerpt: a.excerpt,
          coverImageUrl: a.cover_image_url ?? null, category: a.category,
          tags: a.tags ?? [], readTime: a.read_time, date: a.created_at, isFromSupabase: true,
        }));
        const all = [...remoteArticles, ...staticFiltered].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setArticles(all);
      } catch { /* fallback statique */ } finally { setEnriching(false); }
    }
    enrichWithSupabase();
  }, []);

  const featured = articles[0];
  const carouselArticles = articles.slice(1);
  const maxIndex = Math.max(0, carouselArticles.length - 1);
  const allCategories = Array.from(new Set([...blogCategories, ...articles.map((a) => a.category)]));

  // 3 articles visibles : prev | center (featured) | next
  const getVisible = () => {
    const prev = carouselArticles[carouselIndex - 1] ?? null;
    const center = carouselArticles[carouselIndex] ?? null;
    const next = carouselArticles[carouselIndex + 1] ?? null;
    return { prev, center, next };
  };
  const { prev, center, next } = getVisible();

  const slide = (dir: "left" | "right") => {
    setCarouselIndex((i) =>
      dir === "right" ? Math.min(i + 1, maxIndex) : Math.max(i - 1, 0)
    );
  };

  return (
    <PageLayout hideBlogCarousel>
      <Helmet>
        <title>Blog création de site web, SEO et tech | Déclic Digital</title>
        <meta name="description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital." />
        <link rel="canonical" href="https://declicdigital.net/blog" />
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog" }]} />

      {/* Section 1 — Titre + Catégories + Featured ── #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">

          {/* Titre */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2B1E3F", opacity: 0.35 }}>
              Déclic Digital
            </span>
            <h1 className="mt-1" style={{ color: "#2B1E3F" }}>Blog</h1>
            <p className="mt-2 text-lg max-w-xl" style={{ color: "#2B1E3F", opacity: 0.6 }}>
              Veille web, SEO, GEO & tech - des articles pour développer votre visibilité en ligne.
            </p>
          </div>

          {/* Catégories — directement sous le titre, sans alternance */}
          {allCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const s = getBadge(cat);
                return (
                  <Link
                    key={cat}
                    to={`/blog/categorie/${getCategorySlug(cat)}`}
                    className="rounded-full font-bold transition-all hover:opacity-80 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: s.bg,
                      color: s.color,
                      fontSize: "12px",
                      padding: "5px 14px",
                      boxShadow: "2px 2px 0px rgba(43,30,63,0.12)",
                    }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Article à la une */}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className="block group">
              <article
                className="overflow-hidden rounded-2xl grid md:grid-cols-2 transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid rgba(43,30,63,0.15)",
                  boxShadow: "4px 4px 0px rgba(43,30,63,0.12), 8px 8px 0px rgba(43,30,63,0.06)",
                }}
              >
                <div className="overflow-hidden relative" style={{ minHeight: "280px" }}>
                  {featured.coverImageUrl ? (
                    <img
                      src={featured.coverImageUrl}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                      width={800}
                      height={500}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                      <span className="text-5xl font-bold" style={{ color: "#2B1E3F", opacity: 0.1 }}>{featured.title.charAt(0)}</span>
                    </div>
                  )}
                  {/* Badge "À la une" — petit et discret */}
                  <span
                    className="absolute top-3 left-3 rounded-full font-bold"
                    style={{ backgroundColor: "#2B1E3F", color: "#F6F1E9", fontSize: "10px", padding: "3px 10px", letterSpacing: "0.05em" }}
                  >
                    À la une
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Badge cat={featured.category} />
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#2B1E3F" }}>
                    {featured.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-sm" style={{ color: "#2B1E3F", opacity: 0.65 }}>{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{featured.readTime}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: "#4361EE" }}>
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Link>
          )}
        </div>
      </section>

      {/* Section 2 — Carousel 3 articles #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ color: "#2B1E3F" }}>Tous les articles</h2>
            {carouselArticles.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => slide("left")}
                  disabled={carouselIndex === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-25"
                  style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => slide("right")}
                  disabled={carouselIndex >= maxIndex}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-25"
                  style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}
                >
                  <ChevronRight size={18} />
                </button>
                <span className="text-xs ml-1" style={{ color: "#2B1E3F", opacity: 0.35 }}>
                  {carouselIndex + 1} / {maxIndex + 1}
                </span>
              </div>
            )}
          </div>

          {/* Track — 3 articles : sm | LG | sm */}
          {enriching && carouselArticles.length === 0 ? (
            <div className="flex gap-4 items-center justify-center">
              <CardSkeleton size="sm" />
              <CardSkeleton size="lg" />
              <CardSkeleton size="sm" />
            </div>
          ) : (
            <div className="flex gap-4 items-center justify-center overflow-hidden">
              {/* Gauche */}
              {prev ? (
                <CarouselCard article={prev} size="sm" />
              ) : (
                <div style={{ width: "26%" }} />
              )}
              {/* Centre */}
              {center && <CarouselCard article={center} size="lg" />}
              {/* Droite */}
              {next ? (
                <CarouselCard article={next} size="sm" />
              ) : (
                <div style={{ width: "26%" }} />
              )}
            </div>
          )}

          {/* Dots */}
          {carouselArticles.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {carouselArticles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === carouselIndex ? "20px" : "7px",
                    height: "7px",
                    backgroundColor: i === carouselIndex ? "#2B1E3F" : "rgba(43,30,63,0.22)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA texture */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Besoin d'un site performant et bien référencé ?</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Nous créons des sites web rapides, optimisés SEO et conçus pour convertir vos visiteurs en clients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Demander un audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/creation-site-web">Création de site web</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
