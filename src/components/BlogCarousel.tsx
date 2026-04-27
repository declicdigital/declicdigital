import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

// Skeleton card pendant le chargement
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl bg-card animate-pulse"
    style={{ border: "2px solid rgba(0,0,0,0.10)", boxShadow: "3px 3px 0px rgba(0,0,0,0.10)" }}>
    <div className="aspect-[16/9] bg-muted" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-2 bg-muted rounded w-full mt-3" />
      <div className="h-2 bg-muted rounded w-4/5" />
    </div>
  </div>
);

const BlogCarousel = () => {
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      const { data } = await supabase
        .from("cms_blog_posts")
        .select("slug, title, excerpt, cover_image_url, read_time, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(4);

      const supabaseSlugs = new Set((data ?? []).map((a: any) => a.slug));

      const supabaseArticles = (data ?? []).map((a: any) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        coverImageUrl: a.cover_image_url ?? null,
        readTime: a.read_time,
        date: a.created_at,
      }));

      const staticArticles = blogPosts
        .filter((p) => !supabaseSlugs.has(p.slug))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const all = [...supabaseArticles, ...staticArticles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

      setLatest(all);
      setLoading(false);
    }
    fetchLatest();
  }, []);

  const newestDate = latest[0]?.date;

  return (
    <section className="py-16 bg-muted/30 border-t border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="mb-2 inline-block rounded-full gradient-miami px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              Le Blog
            </span>
            <h2 className="text-2xl font-extrabold md:text-3xl mt-2">Nos derniers articles</h2>
          </div>
          <Link to="/blog" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : latest.map((article, i) => {
                const isNewest = article.date === newestDate;
                return (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                    <motion.article
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="overflow-hidden rounded-xl bg-card transition-all h-full flex flex-col"
                      style={{ border: "2px solid rgba(0,0,0,0.15)", boxShadow: "3px 3px 0px rgba(0,0,0,0.20)" }}>
                      <div className="aspect-[16/9] overflow-hidden relative">
                        {article.coverImageUrl ? (
                          <img src={article.coverImageUrl} alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy" decoding="async" width={640} height={360} />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-3xl font-bold text-muted-foreground/30">{article.title.charAt(0)}</span>
                          </div>
                        )}
                        {isNewest && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-md">
                            <Sparkles size={12} /> Nouvel article
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">{article.excerpt}</p>
                        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
