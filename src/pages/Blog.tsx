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
}

const categoryBadge: Record<string, { bg: string; color: string }> = {
  "Création de site":   { bg: "rgba(43,30,63,0.12)", color: "#2B1E3F" },
  "SEO & Performance":  { bg: "rgba(92,225,230,0.18)", color: "#0C7B80" },
  "Stratégie digitale": { bg: "rgba(203,108,230,0.15)", color: "#7B2D9E" },
  "GEO, Visibilité IA": { bg: "rgba(255,102,196,0.14)", color: "#A0205E" },
  "Business":           { bg: "rgba(67,97,238,0.13)", color: "#2B4AAB" },
};
const getBadge = (cat: string) => categoryBadge[cat] ?? { bg: "rgba(43,30,63,0.10)", color: "#2B1E3F" };

const Badge = ({ cat }: { cat: string }) => {
  const s = getBadge(cat);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      backgroundColor: s.bg, color: s.color,
      fontSize: "11px", padding: "3px 10px",
      borderRadius: "999px", fontWeight: 700,
      letterSpacing: "0.02em", width: "fit-content", whiteSpace: "nowrap",
    }}>
      {cat}
    </span>
  );
};

const toArticles = (posts: typeof staticPosts): Article[] =>
  posts.map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    coverImageUrl: p.coverImageUrl ?? null, category: p.category,
    tags: p.tags, readTime: p.readTime, date: p.date,
  }));

const PER_PAGE = 6;

// Skeletons pour le premier rendu
const ArticleSkeleton = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse" style={{ border: "1.5px solid rgba(43,30,63,0.08)" }}>
    <div style={{ aspectRatio: "16/9", backgroundColor: "#F6F1E9" }} />
    <div className="p-5 space-y-3">
      <div className="h-3 rounded" style={{ backgroundColor: "#F6F1E9", width: "40%" }} />
      <div className="h-4 rounded" style={{ backgroundColor: "#F6F1E9", width: "85%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "#F6F1E9", width: "65%" }} />
    </div>
  </div>
);

export default function Blog() {
  const [allArticles, setAllArticles] = useState<Article[]>(() => toArticles(staticPosts));
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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
          tags: a.tags ?? [], readTime: a.read_time, date: a.created_at,
        }));
        const all = [...remoteArticles, ...staticFiltered].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllArticles(all);
      } catch { /* fallback statique */ } finally {
        setLoading(false);
      }
    }
    enrichWithSupabase();
  }, []);

  const featured = allArticles[0];
  const rest = allArticles.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const pageArticles = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allCategories = Array.from(new Set([...blogCategories, ...allArticles.map((a) => a.category)]));

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <PageLayout hideBlogCarousel>
      <Helmet>
        <title>Blog création de site web, SEO et tech | Déclic Digital</title>
        <meta name="description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital." />
        <link rel="canonical" href="https://declicdigital.net/blog" />
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog" }]} />

      {/* Section 1 — Header + Catégories + Featured */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mb-6">
            <span style={{ color: "#2B1E3F", opacity: 0.35, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Déclic Digital
            </span>
            <h1 className="mt-1" style={{ color: "#2B1E3F" }}>Blog</h1>
            <p className="mt-2 text-lg max-w-xl" style={{ color: "#2B1E3F", opacity: 0.6 }}>
              Veille web, SEO, GEO & tech - des articles pour développer votre visibilité en ligne.
            </p>
          </div>

          {/* Catégories */}
          {allCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const s = getBadge(cat);
                return (
                  <Link key={cat} to={`/blog/categorie/${getCategorySlug(cat)}`}
                    className="transition-all hover:opacity-80 hover:-translate-y-0.5"
                    style={{
                      display: "inline-flex", alignItems: "center",
                      backgroundColor: s.bg, color: s.color,
                      fontSize: "12px", padding: "5px 14px",
                      borderRadius: "999px", fontWeight: 700, whiteSpace: "nowrap",
                      border: `1px solid ${s.color}30`,
                      boxShadow: "1px 1px 0px rgba(43,30,63,0.08)",
                    }}>
                    {cat}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Article à la une */}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className="block group">
              <article className="overflow-hidden rounded-2xl grid md:grid-cols-2 transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid rgba(43,30,63,0.12)",
                  boxShadow: "4px 4px 0px rgba(43,30,63,0.10), 8px 8px 0px rgba(43,30,63,0.05)",
                }}>
                <div className="overflow-hidden relative" style={{ minHeight: "280px" }}>
                  {featured.coverImageUrl
                    ? <img src={featured.coverImageUrl} alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="eager" fetchPriority="high" width={800} height={500} />
                    : <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                        <span className="text-5xl font-bold" style={{ color: "#2B1E3F", opacity: 0.1 }}>{featured.title.charAt(0)}</span>
                      </div>
                  }
                  <span style={{
                    position: "absolute", top: "12px", left: "12px",
                    display: "inline-flex", alignItems: "center",
                    backgroundColor: "#2B1E3F", color: "#F6F1E9",
                    fontSize: "10px", padding: "3px 10px",
                    borderRadius: "999px", fontWeight: 700,
                    letterSpacing: "0.05em", whiteSpace: "nowrap",
                  }}>
                    À la une
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Badge cat={featured.category} />
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#2B1E3F" }}>
                    {featured.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-sm" style={{ color: "#2B1E3F", opacity: 0.65 }}>
                    {featured.excerpt}
                  </p>
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

      {/* Section 2 — Grille paginée */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ color: "#2B1E3F" }}>Tous les articles</h2>
            <span className="text-sm" style={{ color: "#2B1E3F", opacity: 0.45 }}>
              {rest.length} article{rest.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Hauteur minimale fixe — évite le CLS pendant le chargement Supabase */}
          <div style={{ minHeight: "800px" }}>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageArticles.map((article, i) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                    <article
                      className="overflow-hidden rounded-2xl h-full transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: "#F6F1E9",
                        border: "2px solid rgba(43,30,63,0.10)",
                        boxShadow: "3px 3px 0px rgba(43,30,63,0.08), 6px 6px 0px rgba(43,30,63,0.04)",
                      }}
                    >
                      <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        {article.coverImageUrl
                          ? <img
                              src={article.coverImageUrl}
                              alt={article.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading={i < 3 ? "eager" : "lazy"}
                              decoding="async"
                              width={600} height={338}
                            />
                          : <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                              <span style={{ color: "#2B1E3F", opacity: 0.1, fontSize: "3rem", fontWeight: 700 }}>
                                {article.title.charAt(0)}
                              </span>
                            </div>
                        }
                      </div>
                      <div className="p-5 flex flex-col">
                        <Badge cat={article.category} />
                        <h3 className="mt-3 font-bold leading-snug line-clamp-2 text-base" style={{ color: "#2B1E3F" }}>
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                          {article.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} />
                            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1.5"><Clock size={11} />{article.readTime}</span>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all" style={{ color: "#4361EE" }}>
                          Lire l'article <ArrowRight size={13} />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-25"
                style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="text-sm" style={{ color: "#2B1E3F", opacity: 0.3 }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all"
                    style={{
                      backgroundColor: p === page ? "#2B1E3F" : "#F6F1E9",
                      color: p === page ? "#F6F1E9" : "#2B1E3F",
                      border: p === page ? "none" : "1.5px solid rgba(43,30,63,0.18)",
                    }}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-all disabled:opacity-25"
                style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA texture */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
