import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { supabase } from "@/integrations/supabase/client";

import portfolioOffg from "@/assets/site-vitrine-artiste-musical.webp";
import portfolioAploz from "@/assets/site-aploz-agence-video-publicitaire.webp";
import portfolioTracker from "@/assets/site-artisan-tracker-solaire.jpg";
import portfolioLudovic from "@/assets/site-athlete-ludovic-delpuech.png";
import portfolioConciergerie from "@/assets/site-conciergerie-5-etoiles.png";
import imgDev from "@/assets/creation-site-web-developpement-code.webp";
import imgConsult from "@/assets/consultation-client-agence-web-paris.webp";
import imgBoulevard from "@/assets/boulevard-hauts-de-seine-commerces-locaux.webp";
import imgCoiffeur from "@/assets/coiffeur-salon-beaute-paris.webp";
import imgMenuisier from "@/assets/menuisier-atelier-boulogne-billancourt.webp";
import imgChef from "@/assets/chef-cuisinier-restaurant-paris.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

interface Realisation {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url: string;
  tags: string[];
  ordre: number;
  visible: boolean;
}

// Projets statiques en fallback
const STATIC_PROJECTS: Realisation[] = [
  { id: "ludovic-delpuech", name: "Ludovic Delpuech", description: "Site vitrine pour un athlète demi-fond et cross. Design dynamique et immersif avec palmarès, galerie photos, actualités et espace partenaires.", url: "https://ludovicdelpuech.lovable.app", image_url: portfolioLudovic, tags: ["Site vitrine", "Sport", "Athlétisme"], ordre: 0, visible: true },
  { id: "aploz", name: "Aploz", description: "Site vitrine pour une agence vidéo publicitaire. Design sombre et immersif avec showreel intégré et études de cas clients.", url: "https://aploz.lovable.app/", image_url: portfolioAploz, tags: ["Site vitrine", "Vidéo", "Publicité"], ordre: 1, visible: true },
  { id: "conciergerie-5-etoiles", name: "Conciergerie 5 Étoiles", description: "Site vitrine pour une conciergerie Airbnb haut de gamme sur la Côte d'Azur. Design luxueux avec présentation des services de gestion locative.", url: "https://conciergerie5etoiles.lovable.app", image_url: portfolioConciergerie, tags: ["Site vitrine", "Conciergerie", "Luxe"], ordre: 2, visible: true },
  { id: "offg", name: "Off G", description: "Site vitrine pour un artiste musical. Design sombre et immersif avec intégration Spotify.", url: "https://offg.lovable.app/", image_url: portfolioOffg, tags: ["Site vitrine", "Musique"], ordre: 3, visible: true },
  { id: "un-artisan", name: "Un-Artisan.com", description: "Site vitrine pour un artisan spécialisé dans les trackers solaires. Design moderne avec présentation des solutions et réalisations.", url: "https://un-artisan-com.lovable.app", image_url: portfolioTracker, tags: ["Site vitrine", "Artisan", "Energie solaire"], ordre: 4, visible: true },
];

const secteurs = [
  { img: imgCoiffeur, label: "Beauté & Bien-être", desc: "Salons de coiffure, instituts, esthéticiennes, spas" },
  { img: imgMenuisier, label: "Artisanat & BTP", desc: "Menuisiers, plombiers, électriciens, peintres" },
  { img: imgChef, label: "Restauration", desc: "Restaurants, traiteurs, food trucks, cafés" },
];

const ProjectCard = ({ project }: { project: Realisation }) => (
  <motion.a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={false}
    className="group block overflow-hidden rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    style={{ backgroundColor: "#E9F2F4", borderColor: "rgba(43,30,63,0.1)" }}
  >
    <div className="relative overflow-hidden">
      <img
        src={project.image_url}
        alt={`Réalisation site web ${project.name}`}
        className="aspect-video w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        style={{ background: "rgba(43,30,63,0.5)" }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold" style={{ color: "hsl(263,36%,18%)" }}>
          <ExternalLink size={16} /> Voir le site
        </div>
      </div>
    </div>
    <div className="p-6">
      <h2 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors" style={{ color: "#2B1E3F" }}>
        {project.name}
      </h2>
      <p className="mb-4 text-sm leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags?.map((tag) => (
          <span key={tag} className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: "#F6F1E9", color: "#2B1E3F" }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.a>
);

const Realisations = () => {
  const [projects, setProjects] = useState<Realisation[]>(STATIC_PROJECTS);

  useEffect(() => {
    async function fetchRealisations() {
      const { data } = await supabase
        .from("realisations")
        .select("*")
        .eq("visible", true)
        .order("ordre", { ascending: true });

      if (data && data.length > 0) {
        setProjects(data);
      }
    }
    fetchRealisations();
  }, []);

  return (
    <PageLayout>
      <Helmet>
        <title>Portfolio : sites web créés pour TPE et artisans | Déclic Digital</title>
        <meta name="description" content="Découvrez nos réalisations : sites vitrines, e-commerce et landing pages pour artisans et TPE. Projets concrets avec résultats mesurables." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/realisations" />
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Création de site web", href: "/creation-site-web" },
        { label: "Réalisations" },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
        <img src={imgDev} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(246,241,233,0.97) 0%, rgba(246,241,233,0.85) 50%, rgba(246,241,233,0.55) 100%)" }} />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
              Portfolio
            </span>
            <h1 className="mb-4" style={{ color: "#2B1E3F" }}>
              Nos réalisations : sites web pour artisans et TPE en Île-de-France
            </h1>
            <p className="mb-8 text-lg" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Chaque projet est unique, conçu pour répondre aux besoins spécifiques de chaque entreprise et optimisé pour le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>
                référencement SEO
              </Link>.
            </p>
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Secteurs */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nous créons des sites pour tous les secteurs</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Artisans, commerçants, professions de services, santé, restauration - chaque site est pensé pour votre métier.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {secteurs.map((s, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl group h-64">
                <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, hsl(263,36%,18%,0.85) 0%, hsl(263,36%,18%,0.3) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-bold text-lg" style={{ color: "#F6F1E9" }}>{s.label}</h3>
                  <p className="text-sm mt-1" style={{ color: "rgba(246,241,233,0.7)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/nos-metiers" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
              style={{ color: "#4361EE" }}>
              Voir tous nos métiers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Boulevard */}
      <section className="relative overflow-hidden py-16" data-alternate="skip">
        <img src={imgBoulevard} alt="Boulevard Hauts-de-Seine commerces locaux"
          className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.88) 0%, hsl(263,36%,18%,0.65) 60%, hsl(183,70%,40%,0.5) 100%)" }} />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h2 className="mb-4" style={{ color: "#F6F1E9" }}>Paris et Hauts-de-Seine : nos clients locaux</h2>
            <p className="text-lg mb-6" style={{ color: "rgba(246,241,233,0.8)" }}>
              Nous accompagnons les commerçants et artisans de tout le 92 - Boulogne-Billancourt, Neuilly, Levallois, Issy - à se faire trouver sur Google et dans les IA.
            </p>
            <Link to="/nos-villes"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 transition-colors"
              style={{ color: "#F6F1E9" }}>
              Voir toutes nos villes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl group h-72">
              <img src={imgConsult} alt="Consultation client agence web Paris"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(43,30,63,0.3), rgba(99,215,180,0.15))" }} />
            </div>
            <div className="space-y-5">
              <h2 style={{ color: "#2B1E3F" }}>Notre approche : sur-mesure, pas template</h2>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Chaque site commence par une vraie conversation. On apprend votre métier, vos clients, ce qui vous différencie. Puis on conçoit quelque chose qui vous ressemble - pas une page standard copiée-collée.
              </p>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Le SEO est intégré dès la conception, pas ajouté après. Résultat : des sites qui se trouvent sur Google dès leur mise en ligne.
              </p>
              <Link to="/qui-sommes-nous" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                style={{ color: "#4361EE" }}>
                Découvrir notre équipe <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avis */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#E9F2F4" />

      {/* Maillage */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nos services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: "/referencement-seo", label: "Référencement SEO" },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/nos-villes", label: "Nos villes" },
                { to: "/faq", label: "Questions fréquentes" },
              ].map((l) => (
                <Link key={l.to} to={l.to}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F", borderColor: "rgba(43,30,63,0.15)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Votre projet sera le prochain ?</h2>
          <p className="mx-auto mb-8 max-w-lg" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Contactez-nous pour discuter de votre projet et obtenir un devis gratuit sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Realisations;
