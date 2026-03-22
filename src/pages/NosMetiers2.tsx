import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { trades, tradeCategories } from "@/data/trades";

const NosMetiers = () => (
  <PageLayout>
    <Helmet>
      <title>Création de site web par métier | Déclic Digital Paris</title>
      <meta name="description" content="Création de site internet professionnel pour tous les métiers indépendants : artisans, commerçants, consultants, professions libérales. Solutions adaptées à chaque activité." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/nos-metiers" />
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Nos métiers" }]} />

    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Solutions par métier
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Un site web adapté à <span className="text-gradient">chaque métier</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Chaque profession a ses spécificités. Nous créons des sites internet sur-mesure, optimisés pour le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement Google</Link>, adaptés à votre activité et à vos clients.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Métiers par catégorie */}
    {tradeCategories.map((cat) => {
      const catTrades = trades.filter((t) => t.category === cat.key);
      if (catTrades.length === 0) return null;
      return (
        <SectionWrapper key={cat.key} className={tradeCategories.indexOf(cat) % 2 === 0 ? "" : "bg-section-blue"}>
          <h2 className="text-2xl font-extrabold md:text-3xl mb-6">{cat.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catTrades.map((trade) => (
              <Link
                key={trade.slug}
                to={`/creation-site-web/metier/${trade.slug}`}
                className="group flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5"
              >
                <span className="text-2xl">{trade.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-bold group-hover:text-primary transition-colors">{trade.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{trade.whyWebsite.slice(0, 100)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      );
    })}

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Votre métier n'est pas listé ?</h2>
        <p className="mb-8 text-white/80 max-w-xl mx-auto">
          Nous accompagnons tous les indépendants et TPE, quel que soit votre secteur. Contactez-nous pour un devis adapté à votre activité.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
            <Link to="/contact">Demander un devis gratuit</Link>
          </Button>
          <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Voir nos tarifs
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default NosMetiers;
