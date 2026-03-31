import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
const GoogleReviewsSection = lazy(() => import("@/components/GoogleReviewsSection"));
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import portfolioOffg from "@/assets/site-vitrine-artiste-musical.webp";
import portfolioAploz from "@/assets/site-aploz-agence-video-publicitaire.webp";
import portfolioNjPhoto from "@/assets/site-photographe-professionnelle.webp";
import portfolioTracker from "@/assets/site-artisan-tracker-solaire.jpg";

const projects = [
  {
    name: "Un-Artisan.com",
    description: "Site vitrine pour un artisan spécialisé dans les trackers solaires. Design moderne avec présentation des solutions et réalisations.",
    url: "https://un-artisan-com.lovable.app",
    image: portfolioTracker,
    tags: ["Site vitrine", "Artisan", "Énergie solaire"],
  },
  {
    name: "Aploz",
    description: "Site vitrine pour une agence vidéo publicitaire. Design sombre et immersif avec showreel intégré et études de cas clients.",
    url: "https://aploz.lovable.app/",
    image: portfolioAploz,
    tags: ["Site vitrine", "Vidéo", "Publicité"],
  },
  {
    name: "Off G",
    description: "Site vitrine pour un artiste musical. Design sombre et immersif avec intégration Spotify.",
    url: "https://offg.lovable.app/",
    image: portfolioOffg,
    tags: ["Site vitrine", "Musique"],
  },
  {
    name: "NJ Photography",
    description: "Site vitrine pour une photographe professionnelle. Design élégant et immersif avec portfolio visuel.",
    url: "https://njphotography.lovable.app/",
    image: portfolioNjPhoto,
    tags: ["Site vitrine", "Photographie"],
  },
];

const Realisations = () => (
  <PageLayout>
    <Helmet>
      <title>Portfolio : sites web créés pour TPE et artisans | Déclic Digital</title>
      <meta name="description" content="Découvrez nos réalisations : sites vitrines, e-commerce et landing pages pour artisans et TPE. Projets concrets avec résultats mesurables." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/realisations" />
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web", href: "/creation-site-web" }, { label: "Réalisations" }]} />
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Portfolio
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Nos réalisations : sites web professionnels créés pour des artisans et TPE en Île-de-France
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Découvrez les sites que nous avons créés pour nos clients. Chaque projet est unique, conçu pour répondre aux besoins spécifiques de chaque entreprise et optimisé pour le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>.
          </p>
          <div className="mt-6">
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
              <Link to="/contact">Demander un devis</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Projects grid */}
    <SectionWrapper>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={`Réalisation site web ${project.name}`}
                className="aspect-video w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>

    {/* Maillage */}
    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Nos services</h2>
        <p className="text-muted-foreground mb-6">Vous aussi, vous voulez un site qui attire des clients ? Découvrez nos solutions.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Référencement SEO
          </Link>
          <Link to="/audit-seo-gratuit" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Audit SEO gratuit
          </Link>
          <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos tarifs
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
          <Link to="/faq" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    {/* Avis clients */}
    <Suspense fallback={null}><GoogleReviewsSection compact maxReviews={3} /></Suspense>

    {/* CTA */}
    <section className="gradient-miami py-16 text-center">
      <div className="container">
        <h2 className="mb-4 text-3xl font-extrabold text-white">
          Votre projet sera le prochain ?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-white/80">
          Contactez-nous pour discuter de votre projet et obtenir un devis.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/contact">Devis création de site</Link>
          </Button>
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Realisations;
