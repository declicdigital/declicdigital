import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { cities } from "@/data/cities";
import { blogArticles } from "@/data/blogArticles";

const links = [
  { label: "Accueil", to: "/" },
  { label: "Création de site web", to: "/creation-site-web" },
  { label: "Référencement SEO", to: "/referencement-seo" },
  { label: "Audit SEO gratuit", to: "/audit-seo-gratuit" },
  { label: "Nos tarifs", to: "/tarifs" },
  { label: "Réalisations", to: "/realisations" },
  { label: "Nos villes", to: "/nos-villes" },
  { label: "Qui sommes-nous", to: "/qui-sommes-nous" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "Blog", to: "/blog" },
  { label: "Formulaire client", to: "/formulaire-client" },
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
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            Plan du <span className="text-gradient">site</span>
          </h1>
        </motion.div>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Pages principales</h2>
        <ul className="space-y-3 mb-10">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-card font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span className="h-2 w-2 rounded-full gradient-primary shrink-0" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-4">Création de site web par ville</h2>
        <ul className="space-y-2 mb-10">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                to={`/creation-site-web/${city.slug}`}
                className="flex items-center gap-3 rounded-lg bg-card p-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full gradient-primary shrink-0" />
                Création site web {city.nameShort}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-4">Référencement SEO par ville</h2>
        <ul className="space-y-2">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                to={`/referencement-seo/${city.slug}`}
                className="flex items-center gap-3 rounded-lg bg-card p-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full gradient-primary shrink-0" />
                Référencement SEO {city.nameShort}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-4 mt-10">Articles de blog</h2>
        <ul className="space-y-2 mb-10">
          {blogArticles.map((article) => (
            <li key={article.slug}>
              <Link
                to={`/blog/${article.slug}`}
                className="flex items-center gap-3 rounded-lg bg-card p-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full gradient-primary shrink-0" />
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default PlanDuSite;
