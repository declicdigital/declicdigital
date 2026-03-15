import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import portfolioOffg from "@/assets/site-vitrine-artiste-musical.png";
import portfolioDomidel from "@/assets/site-professionnel-entreprise-construction.png";
import portfolioSaucisson from "@/assets/site-ecommerce-produits-artisanaux.png";

const projects = [
  {
    name: "Off G",
    description: "Site vitrine pour un artiste musical. Design sombre et immersif avec intégration Spotify.",
    url: "https://offg.lovable.app/",
    image: portfolioOffg,
    tags: ["Site vitrine", "Musique", "Lovable"],
  },
  {
    name: "Domidel & Didier",
    description: "Site professionnel pour une entreprise de construction en Aquitaine. Calculateur de projet intégré.",
    url: "https://domideldidier.base44.app/",
    image: portfolioDomidel,
    tags: ["Site vitrine", "BTP", "Base44"],
  },
  {
    name: "El Saucisson",
    description: "Site e-commerce pour un producteur de saucissons artisanaux des Landes. Design audacieux et identitaire.",
    url: "https://el-saucisson-landes.base44.app/",
    image: portfolioSaucisson,
    tags: ["E-commerce", "Alimentaire", "Base44"],
  },
];

const Realisations = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Portfolio
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Nos <span className="text-gradient">réalisations</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Découvrez les sites que nous avons créés pour nos clients. Chaque projet est unique et conçu pour répondre aux besoins spécifiques de chaque entreprise.
          </p>
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
                <ExternalLink className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
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


    {/* CTA */}
    <section className="gradient-miami py-16 text-center">
      <div className="container">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">
          Votre projet sera le prochain ?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
          Contactez-nous pour discuter de votre projet et obtenir un devis.
        </p>
        <a
          href="/contact"
          className="inline-block gradient-primary rounded-full px-8 py-3 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          Devis création de site
        </a>
      </div>
    </section>
  </PageLayout>
);

export default Realisations;
