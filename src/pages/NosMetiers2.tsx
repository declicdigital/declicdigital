import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import heroMetiers from "@/assets/nos-metiers-artisans-tpe-independants-paris.webp";
import { trades, tradeCategories } from "@/data/trades";

const bgAlternance = ["#F6F1E9", "#E9F2F4"];

const NosMetiers = () => (
  <PageLayout>
    <Helmet>
      <title>Création de site web par métier | Déclic Digital Paris</title>
      <meta name="description" content="Création de site internet professionnel pour tous les métiers indépendants : artisans, commerçants, consultants, professions libérales. Solutions adaptées à chaque activité." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/nos-metiers" />
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web", href: "/creation-site-web" }, { label: "Nos métiers" }]} />

    {/* Section 1 — Hero sombre fond image, texte centré — skip alternance */}
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
      <img
        src={heroMetiers}
        alt="Création de site web pour artisans, TPE et indépendants à Paris - Déclic Digital"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold border"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(246,241,233,0.8)" }}
          >
            Solutions par métier
          </span>
          <h1 className="mb-4 leading-tight" style={{ color: "#F6F1E9" }}>
            Un site web adapté à chaque métier
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(246,241,233,0.75)" }}>
            Chaque profession a ses spécificités. Nous créons des sites internet sur-mesure, optimisés pour le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#F6F1E9" }}>
              référencement Google
            </Link>
            , adaptés à votre activité et à vos clients.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Métiers par catégorie — alternance à partir de #F6F1E9 */}
    {tradeCategories.map((cat, catIndex) => {
      const catTrades = trades.filter((t) => t.category === cat.key);
      if (catTrades.length === 0) return null;
      const bg = bgAlternance[catIndex % 2];
      const cardBg = bg === "#F6F1E9" ? "#E9F2F4" : "#F6F1E9";
      return (
        <section key={cat.key} style={{ backgroundColor: bg }} className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-2xl font-extrabold md:text-3xl mb-6" style={{ color: "#2B1E3F" }}>{cat.label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catTrades.map((trade) => (
                <Link
                  key={trade.slug}
                  to={`/creation-site-web/metier/${trade.slug}`}
                  className="group flex items-start gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: cardBg,
                    border: "1px solid rgba(43,30,63,0.1)",
                    boxShadow: "0 4px 16px rgba(43,30,63,0.07)",
                  }}
                >
                  <span className="text-2xl">{trade.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold transition-colors" style={{ color: "#2B1E3F" }}>{trade.name}</h3>
                    <p className="text-sm mt-1 line-clamp-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                      {trade.whyWebsite.slice(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    })}

    {/* CTA texture — skip alternance */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold" style={{ color: "#2B1E3F" }}>Votre métier n'est pas listé ?</h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Nous accompagnons tous les indépendants et TPE, quel que soit votre secteur. Contactez-nous pour un devis adapté à votre activité.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/tarifs">Voir nos tarifs</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default NosMetiers;
