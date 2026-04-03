import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleCardItem {
  slug: string;
  title: string;
  image: string;
  category: string;
}

interface ArticleEndBlocksProps {
  related: ArticleCardItem[];
  latest: ArticleCardItem[];
}

const ArticleCard = ({ article }: { article: ArticleCardItem }) => (
  <Link to={`/blog/${article.slug}`} className="group block h-full">
    <article className="h-full overflow-hidden rounded-xl bg-card shadow-card transition-shadow hover:shadow-elevated">
      <div className="aspect-[2.4/1] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary">{article.category}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Lire <ArrowRight size={12} />
        </span>
      </div>
    </article>
  </Link>
);

const ArticleEndBlocks = ({ related, latest }: ArticleEndBlocksProps) => {
  return (
    <>
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30 py-8 md:py-10">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-5 text-xl font-bold">Articles similaires</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {related.slice(0, 2).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="gradient-miami py-10 md:py-12">
        <div className="container text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Envie d'un site qui performe ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Demandez votre audit SEO gratuit et découvrez comment améliorer votre visibilité.
          </p>
          <Link
            to="/audit-seo-gratuit"
            className="mt-6 inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-8 py-3 font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
          >
            Audit SEO gratuit <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Nos derniers articles</h2>
              <Link to="/blog" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Tous les articles <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {latest.slice(0, 6).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticleEndBlocks;
