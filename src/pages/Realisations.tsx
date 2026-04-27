import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
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

const projects = [
  { id: "ludovic-delpuech", name: "Ludovic Delpuech", description: "Site vitrine pour un athlète demi-fond et cross. Design dynamique et immersif avec palmarès, galerie photos, actualités et espace partenaires.", url: "https://ludovicdelpuech.lovable.app", image: portfolioLudovic, tags: ["Site vitrine", "Sport", "Athlétisme"] },
  { id: "aploz", name: "Aploz", description: "Site vitrine pour une agence vidéo publicitaire. Design sombre et immersif avec showreel intégré et études de cas clients.", url: "https://aploz.lovable.app/", image: portfolioAploz, tags: ["Site vitrine", "Vidéo", "Publicité"] },
  { id: "conciergerie-5-etoiles", name: "Conciergerie 5 Étoiles", description: "Site vitrine pour une conciergerie Airbnb haut de gamme sur la Côte d'Azur. Design luxueux avec présentation des services de gestion locative.", url: "https://conciergerie5etoiles.lovable.app", image: portfolioConciergerie, tags: ["Site vitrine", "Conciergerie", "Luxe"] },
  { id: "offg", name: "Off G", description: "Site vitrine pour un artiste musical. Design sombre et immersif avec intégration Spotify.", url: "https://offg.lovable.app/", image: portfolioOffg, tags: ["Site vitrine", "Musique"] },
  { id: "un-artisan", name: "Un-Artisan.com", description: "Site vitrine pour un artisan spécialisé dans les trackers solaires. Design moderne avec présentation des solutions et réalisations.", url: "https://un-artisan-com.lovable.app", image: portfolioTracker, tags: ["Site vitrine", "Artisan", "Énergie solaire"] },
];

// Secteurs avec images
const secteurs = [
  { img: imgCoiffeur, label: "Beauté & Bien-être", desc: "Salons de coiffure, instituts, esthéticiennes, spas" },
  { img: imgMenuisier, label: "Artisanat & BTP", desc: "Menuisiers, plombiers, électriciens, peintres" },
  { img: imgChef, label: "Restauration", desc: "Restaurants, traiteurs, food trucks, cafés" },
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

    {/* ─── Hero : image dev en fond avec overlap ───────────────────────────── */}
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container">
        <div className="relative">
          {/* Image développement côté droit en fond */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
            <img src={imgDev} alt="Création site web développement code" className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)/0.5) 30%, transparent 70%)" }} />
          </div>
          {/* Texte hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">Portfolio</span>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Nos réalisations : sites web pour artisans et TPE en Île-de-France
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Chaque projet est unique, conçu pour répondre aux besoins spécifiques de chaque entreprise et optimisé pour le <Link to="/referencement-seo" className="text-primary font-semibold">référencement SEO</Link>.
            </p>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ─── Portfolio grid ──────────────────────────────────────────────────── */}
    <SectionWrapper>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer" initial={false}
            className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden">
              <img src={project.image} alt={`Réalisation site web ${project.name}`} className="aspect-video w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: "hsl(263,36%,18%,0.5)" }}>
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[hsl(263,36%,18%)]">
                  <ExternalLink size={16} /> Voir le site
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h2>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{tag}</span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>

    {/* ─── Secteurs avec images côte à côte ────────────────────────────────── */}
    <SectionWrapper>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-4">Nous créons des sites pour tous les secteurs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Artisans, commerçants, professions de services, santé, restauration — chaque site est pensé pour votre métier.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {secteurs.map((s, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl shadow-card group h-64">
            <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "linear-gradient(to top, hsl(263,36%,18%,0.85) 0%, hsl(263,36%,18%,0.3) 60%, transparent 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-bold text-white text-lg">{s.label}</h3>
              <p className="text-white/70 text-sm mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/nos-metiers" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
          Voir tous nos métiers <ArrowRight size={16} />
        </Link>
      </div>
    </SectionWrapper>

    {/* ─── Section Paris avec image boulevard en fond ───────────────────────── */}
    <section className="relative overflow-hidden py-16">
      <img src={imgBoulevard} alt="Boulevard Hauts-de-Seine commerces locaux" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.88) 0%, hsl(263,36%,18%,0.65) 60%, hsl(183,70%,40%,0.5) 100%)" }} />
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold md:text-4xl text-white mb-4">Paris et Hauts-de-Seine : nos clients locaux</h2>
          <p className="text-white/80 text-lg mb-6">Nous accompagnons les commerçants et artisans de tout le 92 — Boulogne-Billancourt, Neuilly, Levallois, Issy — à se faire trouver sur Google et dans les IA.</p>
          <Link to="/nos-villes" className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 px-6 py-3 text-white font-semibold hover:bg-white/20 transition-colors">
            Voir toutes nos villes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* ─── Section approche avec image consultation ─────────────────────────── */}
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-12 items-center mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl shadow-card group h-72">
          <img src={imgConsult} alt="Consultation client agence web Paris" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
        </div>
        <div className="space-y-5">
          <h2 className="text-3xl font-extrabold md:text-4xl">Notre approche : sur-mesure, pas template</h2>
          <p className="text-muted-foreground leading-relaxed">Chaque site commence par une vraie conversation. On apprend votre métier, vos clients, ce qui vous différencie. Puis on conçoit quelque chose qui vous ressemble — pas une page standard copiée-collée.</p>
          <p className="text-muted-foreground leading-relaxed">Le SEO est intégré dès la conception, pas ajouté après. Résultat : des sites qui se trouvent sur Google dès leur mise en ligne.</p>
          <Link to="/qui-sommes-nous" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            Découvrir notre équipe <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </SectionWrapper>

    <GoogleReviewsSection compact maxReviews={3} />

    {/* Maillage */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Nos services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { to: "/creation-site-web", label: "Création de site web" },
            { to: "/referencement-seo", label: "Référencement SEO" },
            { to: "/contact", label: "Audit SEO gratuit" },
            { to: "/tarifs", label: "Nos tarifs" },
            { to: "/nos-villes", label: "Nos villes" },
            { to: "/faq", label: "Questions fréquentes" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
    </SectionWrapper>

    {/* CTA final avec texture */}
    <section className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0" style={{ background: "hsl(263,36%,18%,0.82)" }} />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Votre projet sera le prochain ?</h2>
        <p className="mx-auto mb-8 max-w-lg text-white/80">Contactez-nous pour discuter de votre projet et obtenir un devis gratuit sous 24h.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Link to="/qui-sommes-nous" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Qui sommes-nous
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Realisations;
