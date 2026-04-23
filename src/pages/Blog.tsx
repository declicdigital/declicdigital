import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { blogPosts, blogCategories, getCategorySlug } from "@/data/blogPosts";

const categoryColors: Record<string, string> = {
  "Création de site": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "SEO & Performance": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Stratégie digitale": "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  "GEO, Visibilité IA": "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  "Business": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const Blog = () => {
  const allArticles = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = allArticles[0];
  const rest = allArticles.slice(1);
  const newestDate = featured?.date;

  if (!featured) {
    return (
      <PageLayout hideBlogCarousel>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-4 text-muted-foreground">Aucun article pour le moment.</p>
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
        <meta property="og:title" content="Blog web, SEO et tech pour TPE | Déclic Digital" />
        <meta property="og:description" content="Guides pratiques, tendances web design et conseils SEO pour les TPE et artisans." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Blog Déclic Digital",
            description: "Guides pratiques, tendances web design et conseils SEO pour TPE",
            url: "https://declicdigital.net/blog",
            publisher: { "@type": "Organization", name: "Déclic Digital" },
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "hsl(263, 36%, 18%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full gradient-miami px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Blog</span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl text-white">
              Veille web, SEO, GEO<br /><span className="text-gradient">& tech</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
              Des articles pratiques pour comprendre le web, améliorer votre visibilité et faire les bons choix pour votre entreprise.
            </p>
          </div>
        </div>
      </section>

      {/* Featured article */}
      <section className="container -mt-12 relative z-10 mb-16">
        <Link to={`/blog/${featured.slug}`} className="group block">
          <article className="grid overflow-hidden rounded-2xl bg-card shadow-elevated md:grid-cols-2">
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden relative">
              {featured.coverImageUrl ? (
                <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" decoding="async" fetchPriority="high" width={1280} height={800} />
              ) : (
                <div className="h-full w-full bg-secondary flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/30">{featured.title.charAt(0)}</span>
                </div>
              )}
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full gradient-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                <Sparkles size={14} /> Nouvel article
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className={`mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[featured.category] || "bg-secondary text-secondary-foreground"}`}>
                {featured.category}
              </span>
              <h2 className="text-2xl font-bold leading-snug md:text-3xl group-hover:text-primary transition-colors">{featured.title}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />{featured.readTime}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                Lire l'article <ArrowRight size={16} />
              </span>
            </div>
          </article>
        </Link>
      </section>

      {/* Categories */}
      {blogCategories.length > 0 && (
        <section className="container mb-10">
          <h2 className="text-lg font-bold mb-4">Parcourir par catégorie</h2>
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
              <Link
                key={cat}
                to={`/blog/categorie/${getCategorySlug(cat)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80 ${categoryColors[cat] || "bg-secondary text-secondary-foreground"}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other articles */}
      <section className="container pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {rest.map((article) => {
            const isNew = article.date === newestDate;
            return (
              <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                <article className="overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-shadow">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    {article.coverImageUrl ? (
                      <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" width={960} height={540} />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary/30">{article.title.charAt(0)}</span>
                      </div>
                    )}
                    {isNew && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full gradient-primary px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        <Sparkles size={12} /> Nouvel article
                      </span>
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
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold md:text-4xl text-white">Besoin d'un site performant et bien référencé ?</h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            Nous créons des sites web rapides, optimisés SEO et conçus pour convertir vos visiteurs en clients.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-8 py-3 font-semibold text-white shadow-glow transition-opacity"
          >
            Demander un audit SEO gratuit <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;
