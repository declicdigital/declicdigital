import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";

// Client dédié pointant vers le projet qui contient cms_blog_posts
const supabaseBlog = createClient(
  "https://iskxljribvfypkyappku.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3hsanJpYnZmeXBreWFwcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjQ0MzMsImV4cCI6MjA5MjI0MDQzM30.OgWh7kKknHgdG4JMTFbNC_XdZhncnEqzJQA0GbRI_uY"
);

const SkeletonCard = () => (
  <div
    className="overflow-hidden rounded-xl animate-pulse"
    style={{
      backgroundColor: "#F6F1E9",
      border: "2px solid rgba(43,30,63,0.12)",
      boxShadow: "3px 3px 0px rgba(43,30,63,0.12)",
      height: "280px",
    }}
  >
    <div className="aspect-[16/9]" style={{ backgroundColor: "#E9F2F4" }} />
    <div className="p-4 space-y-2">
      <div className="h-3 rounded w-3/4" style={{ backgroundColor: "#E9F2F4" }} />
      <div className="h-3 rounded w-1/2" style={{ backgroundColor: "#E9F2F4" }} />
      <div className="h-2 rounded w-full mt-3" style={{ backgroundColor: "#E9F2F4" }} />
    </div>
  </div>
);

interface BlogCarouselProps {
  backgroundColor: string;
}

const BlogCarousel = ({ backgroundColor }: BlogCarouselProps) => {
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchLatest() {
      const { data } = await supabaseBlog
        .from("cms_blog_posts")
        .select("slug, title, excerpt, cover_image_url, read_time, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(4);

      const supabaseSlugs = new Set((data ?? []).map((a: any) => a.slug));

      const supabaseArticles = (data ?? []).map((a: any) => ({
        slug: a.slug, title: a.title, excerpt: a.excerpt,
        coverImageUrl: a.cover_image_url ?? null,
        readTime: a.read_time, date: a.created_at,
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
    <section className="py-16 border-t border-border" style={{ backgroundColor }}>
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span
              className="mb-2 inline-block rounded-full gradient-miami px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: "#F6F1E9" }}
            >
              Le Blog
            </span>
            <h2 className="text-2xl font-extrabold md:text-3xl mt-2" style={{ color: "#2B1E3F" }}>
              Nos derniers articles
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : latest.map((article, i) => {
                const isNewest = article.date === newestDate;
                return (
                  <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                    <article
                      className="overflow-hidden rounded-xl flex flex-col h-full transition-all group-hover:-translate-y-1"
                      style={{
                        backgroundColor: "#F6F1E9",
                        border: "2px solid rgba(43,30,63,0.15)",
                        boxShadow: "3px 3px 0px rgba(43,30,63,0.15), 6px 6px 0px rgba(43,30,63,0.06)",
                        animation: `fadeInUp 0.35s ease ${i * 0.08}s both`,
                      }}
                    >
                      <div className="aspect-[16/9] overflow-hidden relative">
                        {article.coverImageUrl ? (
                          <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            width={640}
                            height={360}
                          />
                        ) : (
                          <div
                            className="h-full w-full flex items-center justify-center"
                            style={{ backgroundColor: "#E9F2F4" }}
                          >
                            <span className="text-3xl font-bold" style={{ color: "#2B1E3F", opacity: 0.15 }}>
                              {article.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {isNewest && (
                          <span
                            className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full gradient-miami px-3 py-1 text-[11px] font-bold shadow-md"
                            style={{ color: "#F6F1E9" }}
                          >
                            <Sparkles size={12} /> Nouvel article
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3
                          className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2"
                          style={{ color: "#2B1E3F" }}
                        >
                          {article.title}
                        </h3>
                        <p
                          className="mt-2 text-xs leading-relaxed line-clamp-2 flex-1"
                          style={{ color: "#2B1E3F", opacity: 0.6 }}
                        >
                          {article.excerpt}
                        </p>
                        <div
                          className="mt-3 flex items-center gap-3 text-[11px]"
                          style={{ color: "#2B1E3F", opacity: 0.45 }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {article.readTime}
                          </span>
                        </div>
                      </div>
                    </article>
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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="fadeInUp"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default BlogCarousel;
