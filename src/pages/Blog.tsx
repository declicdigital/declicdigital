import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogPosts as staticPosts, blogCategories, getCategorySlug } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";
import imgMiami from "@/assets/blog-seo-digital-miami-declic-digital.webp";
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

// Couleurs hex littérales — lisibles sur toutes les images et fonds
const categoryStyle: Record<string, { bg: string; color: string }> = {
  "Création de site":   { bg: "rgba(109,40,217,0.13)", color: "#5B21B6" },
  "SEO & Performance":  { bg: "rgba(5,150,105,0.13)",  color: "#065F46" },
  "Stratégie digitale": { bg: "rgba(225,29,72,0.13)",  color: "#9F1239" },
  "GEO, Visibilité IA": { bg: "rgba(2,132,199,0.13)",  color: "#0C4A6E" },
  "Business":           { bg: "rgba(217,119,6,0.13)",  color: "#78350F" },
};

const getCategoryStyle = (cat: string) =>
  categoryStyle[cat] ?? { bg: "rgba(43,30,63,0.10)", color: "#2B1E3F" };

// Badge catégorie visible sur fond image (overlay sombre)
const CategoryBadgeOnImage = ({ cat }: { cat: string }) => (
  <span
    className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-md"
    style={{ backgroundColor: "rgba(246,241,233,0.92)", color: "#2B1E3F" }}
  >
    {cat}
  </span>
);

// Badge catégorie sur fond clair (liens catégories)
const CategoryBadgeLink = ({ cat }: { cat: string }) => {
  const s = getCategoryStyle(cat);
  return (
    <Link
      to={`/blog/categorie/${getCategorySlug(cat)}`}
      className="rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-80 hover:-translate-y-0.5"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        border: "1.5px solid rgba(43,30,63,0.12)",
        boxShadow: "2px 2px 0px rgba(43,30,63,0.10)",
      }}
    >
      {cat}
    </Link>
  );
};

const VintageCard = ({ article, featured = false }: { article: Article; featured?: boolean }) => (
  <article
    className="overflow-hidden rounded-2xl transition-all hover:-translate-y-1 group"
    style={{
      backgroundColor: "#F6F1E9",
      border: "2px solid rgba(43,30,63,0.18)",
      boxShadow: "4px 4px 0px rgba(43,30,63,0.18), 8px 8px 0px rgba(43,30,63,0.08)",
    }}
  >
    <div className="overflow-hidden relative aspect-[16/9]">
      {article.coverImageUrl ? (
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={featured ? 1280 : 640}
          height={featured ? 720 : 360}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
          <span className="text-4xl font-bold" style={{ color: "#2B1E3F", opacity: 0.15 }}>{article.title.charAt(0)}</span>
        </div>
      )}
      <CategoryBadgeOnImage cat={article.category} />
    </div>
    <div className="p-5 md:p-6">
      <h2
        className={`font-bold leading-snug ${featured ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}
        style={{ color: "#2B1E3F" }}
      >
        {article.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>{article.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F" }}
          >
            <Tag size={9} /> {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: "#2B1E3F", opacity: 0.5 }}>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1.5"><Clock size={12} />{article.readTime}</span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all" style={{ color: "#4361EE" }}>
        Lire l'article <ArrowRight size={14} />
      </span>
    </div>
  </article>
);

// Skeleton d'une card
const CardSkeleton = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{ border: "2px solid rgba(43,30,63,0.12)", boxShadow: "4px 4px 0px rgba(43,30,63,0.10)" }}
  >
    <div className="aspect-[16/9]" style={{ backgroundColor: "#E9F2F4" }} />
    <div className="p-5 space-y-3">
      <div className="h-4 rounded" style={{ backgroundColor: "#E9F2F4", width: "80%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "60%" }} />
      <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "90%" }} />
    </div>
  </div>
);

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchAll() {
      const { data: supabaseArticles } = await supabase
        .from("cms_blog_posts")
        .select("slug, title, excerpt, cover_image_url, category, tags, read_time, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      const supabaseSlugs = new Set((supabaseArticles ?? []).map((a: any) => a.slug));

      const staticArticles: Article[] = staticPosts
        .filter((p) => !supabaseSlugs.has(p.slug))
        .map((p) => ({
          slug: p.slug, title: p.title, excerpt: p.excerpt,
          coverImageUrl: p.coverImageUrl ?? null, category: p.category,
          tags: p.tags, readTime: p.readTime, date: p.date,
        }));

      const remoteArticles: Article[] = (supabaseArticles ?? []).map((a: any) => ({
        slug: a.slug, title: a.title, excerpt: a.excerpt,
        coverImageUrl: a.cover_image_url ?? null, category: a.category,
        tags: a.tags ?? [], readTime: a.read_time, date: a.created_at, isFromSupabase: true,
      }));

      const all = [...remoteArticles, ...staticArticles].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setArticles(all);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);
  const allCategories = Array.from(new Set([...blogCategories, ...articles.map((a) => a.category)]));

  // ── Helmet et breadcrumb toujours rendus (pas dans le skeleton) ──
  return (
    <PageLayout hideBlogCarousel>
      <Helmet>
        <title>Blog création de site web, SEO et tech | Déclic Digital</title>
        <meta name="description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital." />
        <link rel="canonical" href="https://declicdigital.net/blog" />
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28 min-h-[500px] flex items-center">
        <img src={imgMiami} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.88) 0%, hsl(263,36%,18%,0.65) 55%, hsl(183,70%,40%,0.35) 100%)" }} />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full gradient-miami px-4 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "#F6F1E9" }}>Blog</span>
            <h1 className="leading-tight" style={{ color: "#F6F1E9" }}>Veille web, SEO, GEO & tech</h1>
            <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: "rgba(246,241,233,0.75)" }}>
              Des articles pratiques pour comprendre le web, améliorer votre visibilité et faire les bons choix pour votre entreprise.
            </p>
          </div>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Contenu chargé */}
      {!loading && featured && (
        <>
          {/* Article à la une */}
          <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
            <div className="container">
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full gradient-miami px-4 py-1.5 text-xs font-bold" style={{ color: "#F6F1E9" }}>
                  <Sparkles size={12} /> À la une
                </span>
              </div>
              <Link to={`/blog/${featured.slug}`} className="block">
                <VintageCard article={featured} featured />
              </Link>
            </div>
          </section>

          {/* Catégories */}
          {allCategories.length > 0 && (
            <section style={{ backgroundColor: "#E9F2F4" }} className="py-8">
              <div className="container">
                <p className="text-sm font-bold mb-3" style={{ color: "#2B1E3F", opacity: 0.5 }}>PARCOURIR PAR CATÉGORIE</p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => <CategoryBadgeLink key={cat} cat={cat} />)}
                </div>
              </div>
            </section>
          )}

          {/* Grille articles */}
          <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
            <div className="container">
              <h2 className="text-2xl font-bold mb-8" style={{ color: "#2B1E3F" }}>Tous les articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="block">
                    <VintageCard article={article} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
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
