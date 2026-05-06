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

const Badge = ({ cat, small = false }: { cat: string; small?: boolean }) => {
  const s = getBadge(cat);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      backgroundColor: s.bg, color: s.color,
      fontSize: small ? "10px" : "11px",
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: "999px", fontWeight: 700,
      letterSpacing: "0.02em", width: "fit-content",
      maxWidth: "fit-content", whiteSpace: "nowrap",
    }}>
      {cat}
    </span>
  );
};

// Précharge une image dans le cache navigateur
const preloadImg = (src: string | null) => {
  if (!src) return;
  const img = new window.Image();
  img.src = src;
};

const toArticles = (posts: typeof staticPosts): Article[] =>
  posts.map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    coverImageUrl: p.coverImageUrl ?? null, category: p.category,
    tags: p.tags, readTime: p.readTime, date: p.date,
  }));

// Card latérale — toujours montée dans le DOM, src toujours défini
const SideCard = ({ article }: { article: Article }) => (
  <Link to={`/blog/${article.slug}`} className="block group flex-shrink-0" style={{ width: "27%" }}>
    <article className="h-full overflow-hidden rounded-2xl"
      style={{
        backgroundColor: "#F6F1E9",
        border: "1.5px solid rgba(43,30,63,0.10)",
        boxShadow: "2px 2px 0px rgba(43,30,63,0.07)",
        opacity: 0.72,
        transform: "scale(0.93)",
      }}>
      <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {article.coverImageUrl
          ? <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" loading="eager" decoding="async" width={380} height={214} />
          : <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}><span style={{ color: "#2B1E3F", opacity: 0.1, fontSize: "2rem", fontWeight: 700 }}>{article.title.charAt(0)}</span></div>
        }
      </div>
      <div style={{ padding: "12px 14px" }}>
        <Badge cat={article.category} small />
        <h3 className="mt-2 font-bold leading-snug line-clamp-2" style={{ color: "#2B1E3F", fontSize: "12px" }}>{article.title}</h3>
        <div className="mt-3 flex items-center justify-between" style={{ fontSize: "11px", color: "#2B1E3F", opacity: 0.4 }}>
          <span className="flex items-center gap-1"><Calendar size={10} />{new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 font-semibold" style={{ fontSize: "11px", color: "#4361EE" }}>Lire <ArrowRight size={10} /></span>
      </div>
    </article>
  </Link>
);

// Card centrale — crossfade quand le slug change
const CenterCard = ({ article }: { article: Article }) => {
  const [displayed, setDisplayed] = useState(article);
  const [fading, setFading] = useState(false);
  const prevSlug = useRef(article.slug);

  useEffect(() => {
    if (article.slug === prevSlug.current) return;
    // Précharge d'abord la nouvelle image
    preloadImg(article.coverImageUrl);
    setFading(true);
    const t = setTimeout(() => {
      setDisplayed(article);
      prevSlug.current = article.slug;
      setFading(false);
    }, 120); // crossfade très court : 120ms
    return () => clearTimeout(t);
  }, [article]);

  return (
    <Link to={`/blog/${displayed.slug}`} className="block group flex-shrink-0" style={{ width: "42%" }}>
      <article
        className="h-full overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#F6F1E9",
          border: "2px solid rgba(43,30,63,0.18)",
          boxShadow: "4px 4px 0px rgba(43,30,63,0.12), 8px 8px 0px rgba(43,30,63,0.05)",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.12s ease",
        }}
      >
        <div className="overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
          {displayed.coverImageUrl
            ? <img src={displayed.coverImageUrl} alt={displayed.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" decoding="async" width={600} height={338} />
            : <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}><span style={{ color: "#2B1E3F", opacity: 0.1, fontSize: "3rem", fontWeight: 700 }}>{displayed.title.charAt(0)}</span></div>
          }
        </div>
        <div style={{ padding: "16px 20px" }}>
          <Badge cat={displayed.category} />
          <h3 className="mt-2 font-bold leading-snug line-clamp-2" style={{ color: "#2B1E3F", fontSize: "15px" }}>{displayed.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.6 }}>{displayed.excerpt}</p>
          <div className="mt-3 flex items-center justify-between" style={{ fontSize: "11px", color: "#2B1E3F", opacity: 0.4 }}>
            <span className="flex items-center gap-1"><Calendar size={10} />{new Date(displayed.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{displayed.readTime}</span>
          </div>
          <span className="mt-2 inline-flex items-center gap-1 font-semibold group-hover:gap-2 transition-all" style={{ fontSize: "11px", color: "#4361EE" }}>Lire <ArrowRight size={10} /></span>
        </div>
      </article>
    </Link>
  );
};

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>(() => toArticles(staticPosts));
  const [enriching, setEnriching] = useState(true);
  const [idx, setIdx] = useState(0);
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
        setArticles(all);
      } catch { /* fallback */ } finally { setEnriching(false); }
    }
    enrichWithSupabase();
  }, []);

  const featured = articles[0];
  const pool = articles.slice(1);
  const len = pool.length;
  const allCategories = Array.from(new Set([...blogCategories, ...articles.map((a) => a.category)]));

  const centerArticle = len > 0 ? pool[idx % len] : null;
  const prevArticle   = len > 1 ? pool[(idx - 1 + len) % len] : (len === 1 ? pool[0] : null);
  const nextArticle   = len > 1 ? pool[(idx + 1) % len] : (len === 1 ? pool[0] : null);

  // Précharge les voisins à chaque changement d'index
  useEffect(() => {
    if (len === 0) return;
    preloadImg(pool[(idx + 1) % len]?.coverImageUrl ?? null);
    preloadImg(pool[(idx + 2) % len]?.coverImageUrl ?? null);
    preloadImg(pool[(idx - 1 + len) % len]?.coverImageUrl ?? null);
  }, [idx, len]);

  const slide = (dir: "left" | "right") =>
    setIdx((i) => dir === "right" ? (i + 1) % len : (i - 1 + len) % len);

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
            <span style={{ color: "#2B1E3F", opacity: 0.35, fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Déclic Digital</span>
            <h1 className="mt-1" style={{ color: "#2B1E3F" }}>Blog</h1>
            <p className="mt-2 text-lg max-w-xl" style={{ color: "#2B1E3F", opacity: 0.6 }}>Veille web, SEO, GEO & tech - des articles pour développer votre visibilité en ligne.</p>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const s = getBadge(cat);
                return (
                  <Link key={cat} to={`/blog/categorie/${getCategorySlug(cat)}`}
                    className="transition-all hover:opacity-80 hover:-translate-y-0.5"
                    style={{ display: "inline-flex", alignItems: "center", backgroundColor: s.bg, color: s.color, fontSize: "12px", padding: "5px 14px", borderRadius: "999px", fontWeight: 700, whiteSpace: "nowrap", border: `1px solid ${s.color}30`, boxShadow: "1px 1px 0px rgba(43,30,63,0.08)" }}>
                    {cat}
                  </Link>
                );
              })}
            </div>
          )}

          {featured && (
            <Link to={`/blog/${featured.slug}`} className="block group">
              <article className="overflow-hidden rounded-2xl grid md:grid-cols-2 transition-all hover:-translate-y-1"
                style={{ backgroundColor: "#FFFFFF", border: "2px solid rgba(43,30,63,0.12)", boxShadow: "4px 4px 0px rgba(43,30,63,0.10), 8px 8px 0px rgba(43,30,63,0.05)" }}>
                <div className="overflow-hidden relative" style={{ minHeight: "280px" }}>
                  {featured.coverImageUrl
                    ? <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" width={800} height={500} />
                    : <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}><span className="text-5xl font-bold" style={{ color: "#2B1E3F", opacity: 0.1 }}>{featured.title.charAt(0)}</span></div>
                  }
                  <span style={{ position: "absolute", top: "12px", left: "12px", display: "inline-flex", alignItems: "center", backgroundColor: "#2B1E3F", color: "#F6F1E9", fontSize: "10px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>À la une</span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Badge cat={featured.category} />
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#2B1E3F" }}>{featured.title}</h2>
                  <p className="mt-3 leading-relaxed text-sm" style={{ color: "#2B1E3F", opacity: 0.65 }}>{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                    <span className="flex items-center gap-1.5"><Calendar size={12} />{new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />{featured.readTime}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: "#4361EE" }}>Lire l'article <ArrowRight size={14} /></span>
                </div>
              </article>
            </Link>
          )}
        </div>
      </section>

      {/* Section 2 — Carousel 3 slots fixes */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ color: "#2B1E3F" }}>Tous les articles</h2>
            {len > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => slide("left")} className="flex h-9 w-9 items-center justify-center rounded-full transition-all" style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}><ChevronLeft size={18} /></button>
                <button onClick={() => slide("right")} className="flex h-9 w-9 items-center justify-center rounded-full transition-all" style={{ backgroundColor: "#F6F1E9", border: "1.5px solid rgba(43,30,63,0.18)", color: "#2B1E3F" }}><ChevronRight size={18} /></button>
                <span className="text-xs ml-1" style={{ color: "#2B1E3F", opacity: 0.35 }}>{idx + 1} / {len}</span>
              </div>
            )}
          </div>

          {enriching && pool.length === 0 ? (
            <div className="flex gap-4 items-stretch justify-center">
              {[27, 42, 27].map((w, i) => (
                <div key={i} className="flex-shrink-0 rounded-2xl overflow-hidden animate-pulse" style={{ width: `${w}%`, border: "1.5px solid rgba(43,30,63,0.08)" }}>
                  <div style={{ aspectRatio: "16/9", backgroundColor: "#E9F2F4" }} />
                  <div className="p-4 space-y-2"><div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "45%" }} /><div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "80%" }} /></div>
                </div>
              ))}
            </div>
          ) : centerArticle ? (
            <div className="flex gap-4 items-center justify-center">
              {prevArticle && <SideCard article={prevArticle} />}
              {!prevArticle && <div style={{ width: "27%" }} />}
              <CenterCard article={centerArticle} />
              {nextArticle && <SideCard article={nextArticle} />}
              {!nextArticle && <div style={{ width: "27%" }} />}
            </div>
          ) : null}

          {len > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {pool.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all"
                  style={{ width: i === idx ? "20px" : "7px", height: "7px", backgroundColor: i === idx ? "#2B1E3F" : "rgba(43,30,63,0.22)" }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Besoin d'un site performant et bien référencé ?</h2>
          <p className="mt-4 text-lg max-w-xl mx-auto mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>Nous créons des sites web rapides, optimisés SEO et conçus pour convertir vos visiteurs en clients.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow"><Link to="/contact">Demander un audit SEO gratuit</Link></Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow"><Link to="/creation-site-web">Création de site web</Link></Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
