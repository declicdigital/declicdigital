import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { cities } from "@/data/cities";
import heroPlan from "@/assets/plan-du-site-sitemap-declic-digital.webp";

const links = [
  { label: "Accueil", to: "/" },
  { label: "Création de site web", to: "/creation-site-web" },
  { label: "Référencement SEO et GEO", to: "/referencement-seo" },
  { label: "Audit SEO gratuit", to: "/audit-seo-gratuit" },
  { label: "Visibilité IA (GEO)", to: "/visibilite-ia" },
  { label: "Nos tarifs", to: "/tarifs" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Nos villes", to: "/nos-villes" },
  { label: "Nos métiers", to: "/nos-metiers" },
  { label: "Qui sommes-nous", to: "/qui-sommes-nous" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Blog", to: "/blog" },
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Politique de confidentialité", to: "/politique-de-confidentialite" },
  { label: "Plan du site", to: "/plan-du-site" },
];

const PlanDuSite = () => (
  <PageLayout>
    <Helmet>
      <title>Plan du site | Déclic Digital</title>
      <meta name="description" content="Retrouvez toutes les pages du site Déclic Digital : création de site web, référencement SEO, tarifs, réalisations, blog et pages par ville." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://declicdigital.net/plan-du-site" />
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Plan du site" }]} />

    {/* Section 1 — Hero sombre fond image, skip alternance */}
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[300px] flex items-center">
      <img
        src={heroPlan}
        alt="Plan du site Déclic Digital - sitemap"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 style={{ color: "#F6F1E9" }}>Plan du site</h1>
        </motion.div>
      </div>
    </section>

    {/* Section 2 — Contenu #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl">

          <h2 className="text-2xl font-bold mb-4" style={{ color: "#2B1E3F" }}>Pages principales</h2>
          <ul className="space-y-3 mb-10">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-3 rounded-xl p-4 font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}
                >
                  <span className="h-2 w-2 rounded-full gradient-primary shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-4" style={{ color: "#2B1E3F" }}>Création de site web par ville</h2>
          <ul className="space-y-2 mb-10">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  to={`/creation-site-web/${city.slug}`}
                  className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full gradient-primary shrink-0" />
                  Création site web {city.nameShort}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-4" style={{ color: "#2B1E3F" }}>Référencement SEO et GEO par ville</h2>
          <ul className="space-y-2">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  to={`/referencement-seo/${city.slug}`}
                  className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full gradient-primary shrink-0" />
                  Référencement SEO et GEO {city.nameShort}
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  </PageLayout>
);

export default PlanDuSite;
