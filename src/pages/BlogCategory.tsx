import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag, ArrowLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogPosts, blogCategories, getCategorySlug } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

const categoryColors: Record<string, string> = {
  "Création de site": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "SEO & Performance": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Stratégie digitale": "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  "GEO, Visibilité IA": "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  "Business": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const BlogCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Trouve la catégorie depuis les articles statiques (comportement original)
  const category = blogCategories.find((c) => getCategorySlug(c) === categorySlug);

  // Articles statiques (comportement original)
  const staticArticles = category
    ? blogPosts
        .filter((a) => a.category === category)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Articles Supabase en plus
  const [supabaseArticles, setSupabaseArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!category) return;
    supabase
      .from("cms_blog_posts")
      .select("slug, title, excerpt, cover_image_url, category, tags, read_time, created_at")
      .eq("status", "published")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        // Exclure les slugs déjà dans les articles statiques
        const staticSlugs = new Set(staticArticles.map((a) => a.slug));
        const newOnes = data
          .filter((a) => !staticSlugs.has(a.slug))
          .map((a) => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            coverImageUrl: a.cover_image_url ?? null,
            category: a.category,
            tags: a.tags ?? [],
            readTime: a.read_time,
            date: a.created_at,
          }));
        setSupabaseArticles(newOnes);
      });
  }, [category]);

  if (!category) return <Navigate to="/blog" replace />;

  // Merger : articles Supabase en premier (plus récents), puis statiques
  const allArticles = [...supabaseArticles, ...staticArticles];

  return (
    <PageLayout hideBlogCarousel>
      <PageBreadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: category },
        ]}
      />
      <Helmet>
        <title>{category} - Blog | Déclic Digital</title>
        <meta name="description" content={`Tous nos articles dans la catégorie ${category}. Conseils et guides pratiques par Déclic Digital.`} />
        <link rel="canonical" href={`https://declicdigital.net/blog/categorie/${categorySlug}`} />
      </Helmet>

      <section className="container py-12 md:py-16">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Tous les articles
        </Link>
        <h1 className="text-3xl font-extrabold md:text-4xl mb-4">{category}</h1>
        <p className="text-muted-foreground mb-8">{allArticles.length} article{allArticles.length > 1 ? "s" : ""} dans cette catégorie</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {blogCategories.filter((c) => c !== category).map((c) => (
            <Link
              key={c}
              to={`/blog/categorie/${getCategorySlug(c)}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors hover:opacity-80 ${categoryColors[c] || "bg-secondary text-secondary-foreground"}`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {allArticles.map((article, i) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  {article.coverImageUrl ? (
                    <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[article.category] || "bg-secondary text-secondary-foreground"}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> {article.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">{article.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar size={14} />
                      {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all">
                      Lire <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogCategory;
