import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";

const sortedArticles = [...blogArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const BlogCarousel = () => {
  const latest = sortedArticles.slice(0, 4);
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
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((article, i) => {
            const isNewest = article.date === newestDate;
            return (
              <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-all h-full flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={225}
                    />
                    {isNewest && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-md">
                        <Sparkles size={12} /> Nouvel article
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {article.readTime}
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
