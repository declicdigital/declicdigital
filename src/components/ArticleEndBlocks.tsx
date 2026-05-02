import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

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
    <article
      className="h-full overflow-hidden rounded-xl transition-shadow"
      style={{
        backgroundColor: "#F6F1E9",
        border: "1px solid rgba(43,30,63,0.1)",
        boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)",
      }}
    >
      <div className="aspect-[2.4/1] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold" style={{ color: "#4361EE" }}>{article.category}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold" style={{ color: "#2B1E3F" }}>
          {article.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#4361EE" }}>
          Lire <ArrowRight size={12} />
        </span>
      </div>
    </article>
  </Link>
);

const ArticleEndBlocks = ({ related, latest }: ArticleEndBlocksProps) => {
  return (
    <>
      {/* Articles similaires */}
      {related.length > 0 && (
        <section
          className="py-8 md:py-10"
          style={{ backgroundColor: "#E9F2F4", borderTop: "1px solid rgba(43,30,63,0.08)" }}
        >
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-5 text-xl font-bold" style={{ color: "#2B1E3F" }}>Articles similaires</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {related.slice(0, 2).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA texture — skip alternance */}
      <section className="relative overflow-hidden py-12 md:py-14" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "#2B1E3F" }}>
            Envie d'un site qui performe ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Demandez votre audit SEO gratuit et découvrez comment améliorer votre visibilité.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/creation-site-web">Création de site web</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Derniers articles */}
      <section className="py-10 md:py-12" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold" style={{ color: "#2B1E3F" }}>Nos derniers articles</h2>
              <Link
                to="/blog"
                className="text-sm font-semibold hover:underline flex items-center gap-1"
                style={{ color: "#4361EE" }}
              >
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
