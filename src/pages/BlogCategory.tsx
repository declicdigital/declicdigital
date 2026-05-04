import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowRight, Tag, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogPosts, blogCategories, getCategorySlug } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

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
  "Création de site":   { bg: "#6D28D9", color: "#FFFFFF" },
  "SEO & Performance":  { bg: "#059669", color: "#FFFFFF" },
  "Stratégie digitale": { bg: "#E11D48", color: "#FFFFFF" },
  "GEO, Visibilité IA": { bg: "#0284C7", color: "#FFFFFF" },
  "Business":           { bg: "#D97706", color: "#FFFFFF" },
};
const getBadge = (cat: string) => categoryBadge[cat] ?? { bg: "#2B1E3F", color: "#F6F1E9" };

const BlogCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = blogCategories.find((c) => getCategorySlug(c) === categorySlug);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    // Charge les statiques immédiatement
    const staticFiltered: Article[] = blogPosts
      .filter((a) => a.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((p) => ({
        slug: p.slug, title: p.title, excerpt: p.excerpt,
        coverImageUrl: p.coverImageUrl ?? null, category: p.category,
        tags: p.tags, readTime: p.readTime, date: p.date,
      }));
    setArticles(staticFiltered);
    setLoading(false);

    // Enrichit avec Supabase
    supabase
      .from("cms_blog_posts")
      .select("slug, title, excerpt, cover_image_url, category, tags, read_time, created_at")
      .eq("status", "published")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) return;

        const supabaseSlugs = new Set(data.map((a) => a.slug));
        const staticOnly = staticFiltered.filter((a) => !supabaseSlugs.has(a.slug));

        const remoteArticles: Article[] = data.map((a) => ({
          slug: a.slug, title: a.title, excerpt: a.excerpt,
          coverImageUrl: a.cover_image_url ?? null, category: a.category,
          tags: a.tags ?? [], readTime: a.read_time, date: a.created_at,
        }));

        const all = [...remoteArticles, ...staticOnly].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setArticles(all);
      });
  }, [category]);

  if (!category) return <Navigate to="/blog" replace />;

  const otherCategories = blogCategories.filter((c) => c !== category);

  return (
    <PageLayout hideBlogCarousel>
      <Helmet>
        <title>{category} - Blog | Déclic Digital</title>
        <meta name="description" content={`Tous nos articles dans la catégorie ${category}. Conseils et guides pratiques par Déclic Digital.`} />
        <link rel="canonical" href={`https://declicdigital.net/blog/categorie/${categorySlug}`} />
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: category },
      ]} />

      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">

          {/* Header */}
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#4361EE" }}
          >
            <ArrowLeft size={14} /> Tous les articles
          </Link>

          <h1 className="mt-2 mb-2" style={{ color: "#2B1E3F" }}>{category}</h1>
          <p className="mb-8 text-sm" style={{ color: "#2B1E3F", opacity: 0.5 }}>
            {articles.length} article{articles.length > 1 ? "s" : ""} dans cette catégorie
          </p>

          {/* Autres catégories */}
          {otherCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {otherCategories.map((c) => {
                const s = getBadge(c);
                return (
                  <Link
                    key={c}
                    to={`/blog/categorie/${getCategorySlug(c)}`}
                    className="transition-all hover:opacity-80 hover:-translate-y-0.5"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      backgroundColor: s.bg,
                      color: s.color,
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      boxShadow: "2px 2px 0px rgba(43,30,63,0.12)",
                    }}
                  >
                    {c}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Grille articles */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ border: "2px solid rgba(43,30,63,0.10)" }}>
                  <div style={{ aspectRatio: "16/9", backgroundColor: "#E9F2F4" }} />
                  <div className="p-6 space-y-3">
                    <div className="h-4 rounded" style={{ backgroundColor: "#E9F2F4", width: "70%" }} />
                    <div className="h-3 rounded" style={{ backgroundColor: "#E9F2F4", width: "90%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <p style={{ color: "#2B1E3F", opacity: 0.5 }}>Aucun article dans cette catégorie.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => {
                const s = getBadge(article.category);
                return (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                    <article
                      className="overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "2px solid rgba(43,30,63,0.12)",
                        boxShadow: "3px 3px 0px rgba(43,30,63,0.10)",
                      }}
                    >
                      <div className="aspect-[16/9] overflow-hidden relative">
                        {article.coverImageUrl ? (
                          <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: "#E9F2F4" }}>
                            <span className="text-4xl font-bold" style={{ color: "#2B1E3F", opacity: 0.1 }}>{article.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span style={{
                            display: "inline-flex", alignItems: "center",
                            backgroundColor: s.bg, color: s.color,
                            fontSize: "11px", padding: "3px 10px",
                            borderRadius: "999px", fontWeight: 700,
                            whiteSpace: "nowrap", width: "fit-content",
                          }}>
                            {article.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                            <Clock size={12} /> {article.readTime}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold leading-snug" style={{ color: "#2B1E3F" }}>{article.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>{article.excerpt}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                              style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F" }}>
                              <Tag size={9} /> {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5" style={{ color: "#2B1E3F", opacity: 0.4 }}>
                            <Calendar size={13} />
                            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold group-hover:gap-2 transition-all" style={{ color: "#4361EE" }}>
                            Lire <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogCategory;
