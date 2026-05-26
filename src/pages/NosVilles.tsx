import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { cities } from "@/data/cities";
import { Helmet } from "react-helmet-async";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import heroVilles from "@/assets/nos-villes-paris-hauts-de-seine-92.webp";

const parisCities = cities.filter((c) => c.region === "paris");
const hdsCities = cities.filter((c) => c.region === "hauts-de-seine");

// Pages dédiées — remplacent les deux liens création + SEO dans la grille
// Clé = slug exact de cities.ts (ou slug manuel pour les villes hors cities.ts)
const dedicatedPages: Record<string, { to: string; label: string }> = {
  "asnieres-sur-seine": { to: "/agence-web-asnieres-sur-seine", label: "Agence web et SEO Asnières" },
  "levallois-perret": { to: "/agence-web-levallois-perret", label: "Agence web et SEO Levallois-Perret" },
};

// Villes avec page dédiée qui ne sont PAS dans cities.ts (ajout manuel)
const extraCities = [
  {
    slug: "asnieres-sur-seine",
    name: "Asnières-sur-Seine",
    description: "à Asnières-sur-Seine (92), aux portes de Paris - 90 000 habitants, ligne 13",
  },
];

// On fusionne : extraCities + hdsCities, triés alphabétiquement par name
const allHdsCities = [
  ...extraCities.map((c) => ({ ...c, region: "hauts-de-seine" as const, postalCode: "", nameShort: c.name })),
  ...hdsCities,
].sort((a, b) => a.name.localeCompare(b.name, "fr"));

const NosVilles = () => (
  <PageLayout>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web", href: "/creation-site-web" }, { label: "Nos villes" }]} />
    <Helmet>
      <title>Agence web Paris et Hauts-de-Seine (92) | Déclic Digital par ville</title>
      <meta name="description" content="Création de site internet et SEO local à Paris et dans le 92 (Boulogne, Neuilly, Issy...). Retrouvez nos pages dédiées par ville et arrondissement." />
      <link rel="canonical" href="https://declicdigital.net/nos-villes" />
    </Helmet>

    {/* Section 1 - Hero */}
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
      <img src={heroVilles} alt="Agence web Paris et Hauts-de-Seine 92 - Déclic Digital" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }} />
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold border"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(246,241,233,0.8)" }}>
            Zone d'intervention
          </span>
          <h1 className="mb-4 leading-tight" style={{ color: "#F6F1E9" }}>
            Création de site web et SEO / GEO à Paris et dans le 92
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(246,241,233,0.75)" }}>
            Notre agence accompagne les TPE et indépendants à Paris et dans les Hauts-de-Seine pour la création de sites internet professionnels et le référencement SEO et GEO. Découvrez nos interventions par ville.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Section 2 - Paris */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-4 text-center" style={{ color: "#2B1E3F" }}>
          <MapPin className="inline-block mr-2" size={28} style={{ color: "#4361EE" }} />
          Paris - Arrondissements
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Nous intervenons dans les principaux arrondissements de Paris pour la création de sites web professionnels et l'optimisation SEO locale.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parisCities.map((city, i) => (
            <motion.div key={city.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#E9F2F4", border: "1px solid rgba(43,30,63,0.1)", boxShadow: "0 4px 16px rgba(43,30,63,0.07)" }}>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#2B1E3F" }}>{city.name}</h3>
              <p className="text-sm mb-4" style={{ color: "#2B1E3F", opacity: 0.6 }}>{city.description}</p>
              <div className="flex flex-wrap gap-2">
                <Link to={`/creation-site-web/${city.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>Création de site</Link>
                <Link to={`/referencement-seo/${city.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>SEO et GEO</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Section 3 - Hauts-de-Seine */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-4 text-center" style={{ color: "#2B1E3F" }}>
          <MapPin className="inline-block mr-2" size={28} style={{ color: "#4361EE" }} />
          Hauts-de-Seine (92)
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Nous accompagnons les entreprises des Hauts-de-Seine pour développer leur visibilité en ligne avec des sites web performants et un référencement SEO et GEO ciblé.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allHdsCities.map((city, i) => {
            const dedicated = dedicatedPages[city.slug];
            return (
              <motion.div key={city.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#F6F1E9", border: dedicated ? "2px solid rgba(67,97,238,0.25)" : "1px solid rgba(43,30,63,0.1)", boxShadow: "0 4px 16px rgba(43,30,63,0.07)" }}>
                {dedicated && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star size={13} style={{ color: "#4361EE" }} />
                    <span className="text-xs font-semibold" style={{ color: "#4361EE" }}>Page dédiée</span>
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2" style={{ color: "#2B1E3F" }}>{city.name}</h3>
                <p className="text-sm mb-4" style={{ color: "#2B1E3F", opacity: 0.6 }}>{city.description}</p>
                <div className="flex flex-wrap gap-2">
                  {dedicated ? (
                    <Link to={dedicated.to} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(67,97,238,0.15)", color: "#4361EE", border: "1px solid rgba(67,97,238,0.3)" }}>
                      {dedicated.label}
                    </Link>
                  ) : (
                    <>
                      <Link to={`/creation-site-web/${city.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>Création de site</Link>
                      <Link to={`/referencement-seo/${city.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                        style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>SEO et GEO</Link>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Section 4 - Contenu SEO */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold md:text-4xl text-center" style={{ color: "#2B1E3F" }}>Pourquoi le référencement local est essentiel ?</h2>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement local</Link>{" "}
            permet à votre entreprise d'apparaître dans les résultats de recherche quand un internaute effectue une recherche géolocalisée. Par exemple, "plombier Boulogne-Billancourt" ou "restaurant Paris 15". C'est un levier puissant pour les TPE qui ciblent une clientèle de proximité.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Chez Déclic Digital, nous optimisons chaque{" "}
            <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web</Link>{" "}
            pour le référencement local : fiche Google Business Profile, pages dédiées par ville, contenu géolocalisé et citations sur les annuaires locaux. Demandez votre{" "}
            <Link to="/contact" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>audit SEO gratuit</Link>{" "}
            pour évaluer votre situation.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Que vous soyez situé à Paris, Boulogne-Billancourt, Issy-les-Moulineaux ou Neuilly-sur-Seine, nous adaptons notre stratégie à votre marché local. Consultez{" "}
            <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link>{" "}
            ou découvrez{" "}
            <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>notre équipe</Link>.
          </p>
        </div>
      </div>
    </section>

    {/* Section 5 - Liens services */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl mb-6" style={{ color: "#2B1E3F" }}>Nos services</h2>
          <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Découvrez l'ensemble de nos prestations pour développer votre présence en ligne.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/creation-site-web">Création de site web</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/referencement-seo">Référencement SEO et GEO</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* CTA texture */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold" style={{ color: "#2B1E3F" }}>Vous êtes à Paris ou dans le 92 ?</h2>
        <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Contactez-nous pour un devis gratuit. Nous intervenons dans toutes les villes listées ci-dessus.
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

export default NosVilles;
