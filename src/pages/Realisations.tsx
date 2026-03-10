import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import portfolioOffg from "@/assets/portfolio-offg.png";
import portfolioDomidel from "@/assets/portfolio-domidel.png";
import portfolioSaucisson from "@/assets/portfolio-saucisson.png";

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

const testimonials = [
  { name: "Sophie Martin", role: "Gérante, Salon de coiffure", text: "Nous avions un site qui ne générait aucun contact. Après la refonte et le SEO, nous recevons plusieurs demandes par semaine." },
  { name: "Thomas Durand", role: "Artisan plombier", text: "Je n'avais aucune présence en ligne. Déclic Digital m'a créé un site qui apparaît en première page Google sur ma ville." },
  { name: "Marie Lefèvre", role: "E-commerce bijoux", text: "Mon trafic a doublé en 3 mois. Les commandes arrivent naturellement grâce au référencement." },
  { name: "Pierre Moreau", role: "Cabinet comptable", text: "Un investissement rentabilisé en quelques mois. Nous recevons des demandes de devis chaque semaine." },
  { name: "Julie Bernard", role: "Coach sportif", text: "Mon ancien site était invisible. Aujourd'hui, 80% de mes clients me trouvent via Google." },
  { name: "François Petit", role: "Restaurant", text: "Depuis la refonte, nos réservations en ligne ont augmenté de 60%. Le site est moderne et rapide." },
  { name: "Isabelle Roux", role: "Agence immobilière", text: "L'équipe a su comprendre nos besoins. Le site est professionnel et génère des contacts qualifiés." },
  { name: "Marc Dubois", role: "Consultant IT", text: "Je recommande Déclic Digital. Approche méthodique, résultats concrets et suivi régulier." },
  { name: "Caroline Simon", role: "Fleuriste", text: "Un site magnifique qui reflète parfaitement mon activité. Les clients me disent souvent qu'ils m'ont trouvée sur Google." },
  { name: "Laurent Garcia", role: "PME industrielle", text: "Notre visibilité a considérablement augmenté. L'audit SEO initial nous a ouvert les yeux sur nos lacunes." },
];

const Realisations = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const nextTestimonial = () => setCurrentTestimonial((p) => (p + 2 >= testimonials.length ? 0 : p + 2));
  const prevTestimonial = () => setCurrentTestimonial((p) => (p - 2 < 0 ? testimonials.length - 2 : p - 2));

  return (
    <PageLayout>
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
                  alt={`Site ${project.name}`}
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

      {/* Témoignages */}
      <SectionWrapper className="bg-card">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">Ce que disent nos clients</h2>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.slice(currentTestimonial, currentTestimonial + 2).map((t, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card">
                <div className="mb-3 flex gap-1 text-accent">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-4 text-muted-foreground italic">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={prevTestimonial} className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Précédent">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button onClick={nextTestimonial} className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Suivant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="gradient-miami py-16 text-center">
        <div className="container">
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">
            Votre projet sera le prochain ?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
            Contactez-nous pour discuter de votre projet et obtenir un devis gratuit.
          </p>
          <a
            href="/contact"
            className="inline-block gradient-primary rounded-full px-8 py-3 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            Demander un devis
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default Realisations;
