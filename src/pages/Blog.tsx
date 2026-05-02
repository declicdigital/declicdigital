import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
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

const categoryColors: Record<string, string> = {
  "Création de site": "bg-violet-500/15 text-violet-700",
  "SEO & Performance": "bg-emerald-500/15 text-emerald-700",
  "Stratégie digitale": "bg-rose-500/15 text-rose-700",
  "GEO, Visibilité IA": "bg-sky-500/15 text-sky-700",
  "Business": "bg-amber-500/15 text-amber-700",
};

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          coverImageUrl: p.coverImageUrl ?? null,
          category: p.category,
          tags: p.tags,
          readTime: p.readTime,
          date: p.date,
        }));

      const remoteArticles: Article[] = (supabaseArticles ?? []).map((a: any) => ({
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
  const newestDate = featured?.date;

  const allCategories = Array.from(new Set([...blogCategories, ...articles.map((a) => a.category)]));

  if (loading) {
    return (
      <PageLayout hideBlogCarousel>
        <div className="container py-20">
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ backgroundColor: "#E9F2F4" }} />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!featured) {
    return (
      <PageLayout hideBlogCarousel>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#2B1E3F" }}>Blog</h1>
          <p className="mt-4" style={{ color: "#2B1E3F", opacity: 0.6 }}>Aucun article pour le moment.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Blog" }]} />
      <Helmet>
        <title>Blog création de site web, SEO et tech | Déclic Digital</title>
        <meta name="description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans. Apprenez à développer votre visibilité en ligne avec le blog Déclic Digital." />
        <link rel="canonical" href="https://declicdigital.net/blog" />
      </Helmet>

      {/* ─── Hero — image Miami plein fond + overlay sombre, skip alternance ─── */}
      <section className="relative overflow-hidden py-20 md:py-28 min-h-[500px] flex items-center">
        <img src={imgMiami} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.88) 0%, hsl(263,36%,18%,0.65) 55%, hsl(183,70%,40%,0.35) 100%)" }} />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full gradient-miami px-4 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "#F6F1E9" }}>Blog</span>
            <h1 className="leading-tight" style={{ color: "#F6F1E9" }}>
              Veille web, SEO, GEO & tech
            </h1>
            <p className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: "rgba(246,241,233,0.75)" }}>
              Des articles pratiques pour comprendre le web, améliorer votre visibilité et faire les bons choix pour votre entreprise.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Article à la une — bloc 1 → #F6F1E9 ────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <Link to={`/blog/${featured.slug}`} className="group block">
            <article className="grid overflow-hidden rounded-2xl md:grid-cols-2 shadow-card border" style={{ backgroundColor: "#E9F2F4", borderColor: "rgba(43,30,63,0.1)" }}>
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden relative">
                {featured.coverImageUrl ? (
                  <img src={featured.coverImageUrl} alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager" width={1280} height={800} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                    <span className="text-4xl font-bold" style={{ color: "#2B1E3F", opacity: 0.2 }}>{featured.title.charAt(0)}</span>
                  </div>
                )}
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-primary px-4 py-1.5 text-xs font-bold shadow-lg" style={{ color: "#2B1E3F" }}>
                  <Sparkles size={14} /> Nouvel article
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className={`mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[featured.category] || "bg-secondary text-secondary-foreground"}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl font-bold leading-snug md:text-3xl group-hover:text-primary transition-colors" style={{ color: "#2B1E3F" }}>{featured.title}</h2>
                <p className="mt-4 leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-sm" style={{ color: "#2B1E3F", opacity: 0.5 }}>
                  <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} />{featured.readTime}</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Lire l'article <ArrowRight size={16} />
                </span>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* ─── Catégories — bloc 2 → #E9F2F4 ──────────────────────────────────── */}
      {allCategories.length > 0 && (
        <section className="py-10" style={{ backgroundColor: "#E9F2F4" }}>
          <div className="container">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#2B1E3F" }}>Parcourir par catégorie</h2>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <Link key={cat} to={`/blog/categorie/${getCategorySlug(cat)}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80 ${categoryColors[cat] || "bg-secondary text-secondary-foreground"}`}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Autres articles — bloc 3 → #F6F1E9 ─────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {rest.map((article) => {
              const isNew = article.date === newestDate;
              return (
                <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                  <article className="overflow-hidden rounded-2xl shadow-card border transition-all hover:-translate-y-1 hover:shadow-xl" style={{ backgroundColor: "#E9F2F4", borderColor: "rgba(43,30,63,0.1)" }}>
                    <div className="aspect-[16/9] overflow-hidden relative">
                      {article.coverImageUrl ? (
                        <img src={article.coverImageUrl} alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy" width={960} height={540} />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                          <span className="text-3xl font-bold" style={{ color: "#2B1E3F", opacity: 0.2 }}>{article.title.charAt(0)}</span>
                        </div>
                      )}
                      {isNew && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full gradient-primary px-3 py-1 text-[11px] font-bold shadow-md" style={{ color: "#2B1E3F" }}>
                          <Sparkles size={12} /> Nouvel article
                        </span>
                      )}
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[article.category] || "bg-secondary text-secondary-foreground"}`}>
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#2B1E3F", opacity: 0.5 }}><Clock size={12} /> {article.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors" style={{ color: "#2B1E3F" }}>{article.title}</h2>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{article.excerpt}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs" style={{ backgroundColor: "#F6F1E9", color: "#2B1E3F", opacity: 0.7 }}>
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5" style={{ color: "#2B1E3F", opacity: 0.5 }}>
                          <Calendar size={14} />
                          {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all">
                          Lire <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA finale texture — skip alternance ─────────────────────────────── */}
      <section className="relative overflow-hidden py-16" data-alternate="skip">
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
