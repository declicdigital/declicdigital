import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import { cities } from "@/data/cities";
import { Helmet } from "react-helmet-async";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const parisCities = cities.filter((c) => c.region === "paris");
const hdsCities = cities.filter((c) => c.region === "hauts-de-seine");

const NosVilles = () => (
  <PageLayout>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web", href: "/creation-site-web" }, { label: "Nos villes" }]} />
    <Helmet>
      <title>Agence web Paris et Hauts-de-Seine (92) | Déclic Digital par ville</title>
      <meta name="description" content="Création de site internet et SEO local à Paris et dans le 92 (Boulogne, Neuilly, Issy...). Retrouvez nos pages dédiées par ville et arrondissement." />
      <link rel="canonical" href="https://declicdigital.net/nos-villes" />
    </Helmet>

    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Zone d'intervention
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Création de site web et SEO / GEO à{" "}
            <span className="text-gradient">Paris et dans le 92</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Notre agence accompagne les TPE et indépendants à Paris et dans les Hauts-de-Seine pour la création de sites internet professionnels et le référencement SEO et GEO. Découvrez nos interventions par ville.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Paris */}
    <SectionWrapper className="bg-section-blue">
      <h2 className="text-3xl font-extrabold md:text-4xl mb-4 text-center">
        <MapPin className="inline-block mr-2 text-primary" size={28} />
        Paris - Arrondissements
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nous intervenons dans les principaux arrondissements de Paris pour la création de sites web professionnels et l'optimisation SEO locale.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parisCities.map((city, i) => (
          <motion.div
            key={city.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-background p-6 shadow-card"
          >
            <h3 className="font-bold text-lg mb-2">{city.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{city.description}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/creation-site-web/${city.slug}`}
                className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                Création de site
              </Link>
              <Link
                to={`/referencement-seo/${city.slug}`}
                className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
              >
                SEO et GEO
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>

    {/* Hauts-de-Seine */}
    <SectionWrapper>
      <h2 className="text-3xl font-extrabold md:text-4xl mb-4 text-center">
        <MapPin className="inline-block mr-2 text-primary" size={28} />
        Hauts-de-Seine (92)
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nous accompagnons les entreprises des Hauts-de-Seine pour développer leur visibilité en ligne avec des sites web performants et un référencement SEO et GEO ciblé.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hdsCities.map((city, i) => (
          <motion.div
            key={city.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-card p-6 shadow-card"
          >
            <h3 className="font-bold text-lg mb-2">{city.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{city.description}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/creation-site-web/${city.slug}`}
                className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                Création de site
              </Link>
              <Link
                to={`/referencement-seo/${city.slug}`}
                className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
              >
                SEO et GEO
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>

    {/* Contenu SEO */}
    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi le référencement local est essentiel ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement local</Link> permet à votre entreprise d'apparaître dans les résultats de recherche quand un internaute effectue une recherche géolocalisée. Par exemple, "plombier Boulogne-Billancourt" ou "restaurant Paris 15". C'est un levier puissant pour les TPE qui ciblent une clientèle de proximité.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Chez Déclic Digital, nous optimisons chaque <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link> pour le référencement local : fiche Google Business Profile, pages dédiées par ville, contenu géolocalisé et citations sur les annuaires locaux. Cette approche vous permet de dominer les résultats Google dans votre zone de chalandise. Demandez votre <Link to="/contact" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link> pour évaluer votre situation.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Que vous soyez situé à Paris, Boulogne-Billancourt, Issy-les-Moulineaux ou Neuilly-sur-Seine, nous adaptons notre stratégie à votre marché local. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou découvrez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre équipe</Link>.
        </p>
      </div>
    </SectionWrapper>

    {/* Liens services */}
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-6">Nos services</h2>
        <p className="text-muted-foreground mb-8">
          Découvrez l'ensemble de nos prestations pour développer votre présence en ligne.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
            <Link to="/creation-site-web">Création de site web</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-[hsl(263,36%,18%)] px-8 font-semibold text-[hsl(263,36%,18%)] hover:bg-[hsl(263,36%,18%)] hover:text-white transition-colors">
            <Link to="/referencement-seo">Référencement SEO et GEO</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-[hsl(263,36%,18%)] px-8 font-semibold text-[hsl(263,36%,18%)] hover:bg-[hsl(263,36%,18%)] hover:text-white transition-colors">
            <Link to="/contact">Audit SEO gratuit</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">
          Vous êtes à Paris ou dans le 92 ?
        </h2>
        <p className="mb-8 text-white/80">
          Contactez-nous pour un devis gratuit. Nous intervenons dans toutes les villes listées ci-dessus.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Voir nos tarifs
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default NosVilles;
