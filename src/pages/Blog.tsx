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

const Badge = ({ cat }: { cat: string }) => {
  const s = getBadge(cat);
  return (
    <span className="inline-block rounded-full px-3 py-1 text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {cat}
    </span>
  );
};

const CarouselCard = ({ article }: { article: Article }) => (
  <Link to={`/blog/${article.slug}`} className="block group flex-shrink-0" style={{ width: "calc(25% - 12px)" }}>
    <article className="h-full overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
      style={{ backgroundColor: "#F6F1E9", border: "2px solid rgba(43,30,63,0.15)", boxShadow: "3px 3px 0px rgba(43,30,63,0.12)" }}>
      <div className="overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
        {article.coverImageUrl ? (
          <img src={article.coverImageUrl} alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" width={400} height={225} />
        ) : (
          <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
            <span className="text-3xl font-bold" style={{ color: "#2B1E3F", opacity: 0.12 }}>{article.title.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Badge cat={article.category} />
        <h3 className="mt-2 text-sm font-bold leading-snug line-clamp-2" style={{ color: "#2B1E3F" }}>{article.title}</h3>
        <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "#2B1E3F", opacity: 0.45 }}>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </span>
          <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#4361EE" }}>
          Lire <ArrowRight size={11} />
        </span>
      </div>
    </article>
  </Link>
);

const CardSkeleton = () => (
  <div className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse"
    style={{ width: "calc(25% - 12px)", border: "2px solid rgba(43,30,63,0.10)" }}>
    <div style={{ aspectRatio: "16/9", backgroundColor: "#E9F2F4" }} />
    <div className="p-4 space-y-2">
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "50%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "85%" }} />
    </div>
  </div>
);

// Convertit les posts statiques en Article[]
const toArticles = (posts: typeof staticPosts): Article[] =>
  posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImageUrl: p.coverImageUrl ?? null,
    category: p.category,
    tags: p.tags,
    readTime: p.readTime,
    date: p.date,
  }));

export default function Blog() {
  // ── Articles statiques chargés immédiatement ──
  const [articles, setArticles] = useState<Article[]>(() => toArticles(staticPosts));
  const [enriching, setEnriching] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
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

        const staticFiltered = toArticles(
          staticPosts.filter((p) => !supabaseSlugs.has(p.slug))
        );

        const remoteArticles: Article[] = data.map((a: any) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          coverImageUrl: a.cover_image_url ?? null,
          category: a.category,
          tags: a.tags ?? [],
          readTime: a.read_time,
          date: a.created_at,
          isFromSupabase: true,
        }));

        const all = [...remoteArticles, ...staticFiltered].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setArticles(all);
      } catch {
        // Supabase indisponible - articles statiques déjà affichés
      } finally {
        setEnriching(false);
      }
    }

    enrichWithSupabase();
  }, []);

  const featured = articles[0];
  const carouselArticles = articles.slice(1);
  const VISIBLE = 4;
  const maxIndex = Math.max(0, carouselArticles.length - VISIBLE);
  const allCategories = Array.from(
    new Set([...blogCategories, ...articles.map((a) => a.category)])
  );

  const slide = (dir: "left" | "right") => {
    setAnimDir(dir);
    setTimeout(() => {
      setCarouselIndex((prev) =>
        dir === "right" ? Math.min(prev + 1, maxIndex) : Math.max(prev - 1, 0)
      );
      setAnimDir(null);
    }, 180);
  };

  return (
    <PageLayout hideBlogCarousel>
      <Helmet>
        <title>Blog création de site web, SEO et tech | Déclic Digital</title>
        <meta name="description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital." />
        <link rel="canonical" href="https://declicdigital.net/blog" />
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog" }]} />

      {/* Section 1 — Titre + Featured */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2B1E3F", opacity: 0.4 }}>
              Déclic Digital
            </span>
            <h1 className="mt-1" style={{ color: "#2B1E3F" }}>Blog</h1>
            <p className="mt-2 text-lg max-w-xl" style={{ color: "#2B1E3F", opacity: 0.65 }}>
              Veille web, SEO, GEO & tech - des articles pour développer votre visibilité en ligne.
            </p>
          </div>

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
                      <span className="text-5xl font-bold" style={{ color: "#2B1E3F", opacity: 0.1 }}>
                        {featured.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span
                    className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{ backgroundColor: "#2B1E3F", color: "#F6F1E9" }}
                  >
                    ✦ À la une
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Badge cat={featured.category} />
                  <h2 className="mt-4 text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#2B1E3F" }}>
                    {featured.title}
                  </h2>
                  <p className="mt-3 leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>
                    {featured.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-sm" style={{ color: "#2B1E3F", opacity: 0.45 }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(featured.date).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />{featured.readTime}
                    </span>
                  </div>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                    style={{ color: "#4361EE" }}
                  >
                    Lire l'article <ArrowRight size={15} />
                  </span>
                </div>
              </article>
            </Link>
          )}
        </div>
      </section>

      {/* Section 2 — Carousel */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ color: "#2B1E3F" }}>Tous les articles</h2>
            {carouselArticles.length > VISIBLE && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => slide("left")}
                  disabled={carouselIndex === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-30"
                  style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.2)", color: "#2B1E3F" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => slide("right")}
                  disabled={carouselIndex >= maxIndex}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-30"
                  style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.2)", color: "#2B1E3F" }}
                >
                  <ChevronRight size={18} />
                </button>
                <span className="text-sm ml-1" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                  {carouselIndex + 1} / {maxIndex + 1}
                </span>
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            {enriching && carouselArticles.length === 0 ? (
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <div
                className="flex gap-4"
                style={{
                  transform: `translateX(calc(-${carouselIndex * (100 / VISIBLE)}% - ${carouselIndex * 4}px))`,
                  transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
                  opacity: animDir ? 0.85 : 1,
                }}
              >
                {carouselArticles.map((article) => (
                  <CarouselCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>

          {carouselArticles.length > VISIBLE && (
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAnimDir("right");
                    setTimeout(() => { setCarouselIndex(i); setAnimDir(null); }, 180);
                  }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === carouselIndex ? "20px" : "8px",
                    height: "8px",
                    backgroundColor: i === carouselIndex ? "#2B1E3F" : "rgba(43,30,63,0.25)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3 — Catégories */}
      {allCategories.length > 0 && (
        <section style={{ backgroundColor: "#F6F1E9" }} className="py-8 md:py-10">
          <div className="container">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2B1E3F", opacity: 0.4 }}>
              Parcourir par catégorie
            </p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const s = getBadge(cat);
                return (
                  <Link
                    key={cat}
                    to={`/blog/categorie/${getCategorySlug(cat)}`}
                    className="rounded-full px-4 py-2 text-sm font-bold transition-all hover:opacity-85 hover:-translate-y-0.5"
                    style={{ backgroundColor: s.bg, color: s.color, boxShadow: "2px 2px 0px rgba(43,30,63,0.15)" }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
