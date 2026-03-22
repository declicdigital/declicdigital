import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";
import { getCityBySlug, cities } from "@/data/cities";
import { cityContent } from "@/data/cityContent";
import { Helmet } from "react-helmet-async";

const VilleCreationSite = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/creation-site-web" replace />;

  const content = cityContent[city.slug];
  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);

  return (
    <PageLayout>
      <Helmet>
        <title>{
          city.slug === "paris-1er" ? "Création site internet Paris 1er — TPE & artisans" :
          city.slug === "paris-3eme" ? "Création site internet Paris 3ème — artisans & TPE" :
          city.slug === "boulogne-billancourt" ? "Création site internet Boulogne-Billancourt — TPE" :
          `Création site internet ${city.nameShort} — artisans & TPE`
        }</title>
        <meta name="description" content={
          city.slug === "paris-1er" ? "Créez votre site web professionnel dans le 1er arrondissement de Paris. Déclic Digital accompagne les indépendants et TPE. Devis gratuit." :
          city.slug === "paris-3eme" ? "Votre site web professionnel dans le Marais. Déclic Digital accompagne les artisans et TPE du 3ème arrondissement de Paris. Devis gratuit." :
          city.slug === "boulogne-billancourt" ? "Agence web à Boulogne-Billancourt pour TPE et artisans. Déclic Digital crée votre site professionnel et améliore votre visibilité Google." :
          `Agence web pour les TPE et artisans de ${city.nameShort}. Déclic Digital crée votre site professionnel et améliore votre référencement Google local.`
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/${city.slug}`} />
      </Helmet>

      {/* Breadcrumb */}
      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Création de site web", href: "/creation-site-web" },
        { label: city.nameShort },
      ]} />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence web {city.description}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                {city.slug === "paris-1er" ? "Création de site internet pour les TPE et artisans du Paris 1er" :
                 city.slug === "paris-3eme" ? "Création de site web pour les artisans et TPE du Paris 3ème (Le Marais)" :
                 city.slug === "boulogne-billancourt" ? "Création de site internet pour les TPE et artisans de Boulogne-Billancourt" :
                 `Création de site internet pour les artisans et TPE de ${city.nameShort}`}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                {content?.creationIntro || `Vous êtes une PME ou un indépendant ${city.description} ? Déclic Digital crée votre site internet professionnel, responsive et optimisé pour Google. Attirez enfin les bons clients grâce à un site qui travaille pour vous.`}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/contact">Devis création de site</Link>
                </Button>
                <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-foreground hover:bg-secondary transition-colors">
                  Audit SEO gratuit
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="rounded-2xl bg-card p-8 shadow-card text-center max-w-sm">
                <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Déclic Digital - création site web ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">Fondateur de Déclic Digital, j'accompagne les entreprises {city.description} dans leur transformation digitale.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pourquoi un site web */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          {`Pourquoi les professionnels de ${city.nameShort} ont besoin d'un site web`}
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          {content?.creationWhyText || `Un site internet professionnel est indispensable pour les entreprises ${city.description}. Il vous permet d'être trouvé par vos clients locaux et de vous démarquer de la concurrence.`}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Design professionnel", desc: `Un site qui reflète le sérieux de votre entreprise ${city.description}. Première impression décisive.` },
            { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur. Plus de 60% du trafic est mobile." },
            { icon: TrendingUp, title: "Optimisé SEO", desc: `Référencement local pour apparaître en première page Google sur "${city.nameShort}" et vos mots clés métier.` },
            { icon: Zap, title: "Rapide et performant", desc: "Un temps de chargement optimisé pour une meilleure expérience utilisateur et un meilleur positionnement Google." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-background p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Types de sites */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Un site web livré en 3 semaines, adapté à votre métier
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Site vitrine", desc: `Présentez votre activité ${city.description} avec un site élégant et optimisé. Idéal pour les artisans, professions libérales et commerces locaux.`, features: ["Design sur mesure", "Formulaire de contact", "Google Maps intégré", "Optimisation SEO local"] },
            { title: "Site e-commerce", desc: `Vendez vos produits en ligne depuis ${city.nameShort}. Boutique en ligne complète avec paiement sécurisé et gestion des stocks.`, features: ["Catalogue produits", "Paiement sécurisé", "Gestion des commandes", "Optimisation conversion"] },
            { title: "Site sur mesure", desc: `Un site web unique et personnalisé pour votre entreprise ${city.description}. Fonctionnalités avancées selon vos besoins.`, features: ["Fonctionnalités sur mesure", "Espace client", "Intégrations API", "Évolutif et scalable"] },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-8 shadow-card">
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground mb-4">{item.desc}</p>
              <ul className="space-y-2">
                {item.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-primary shrink-0" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Contenu SEO unique */}
      {content && (
        <SectionWrapper className="bg-section-blue">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl text-center">
              Référencement local {city.nameShort} : apparaissez dans Google Maps
            </h2>
            {content.creationSeoText.map((text, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{text}</p>
            ))}
            <p className="text-muted-foreground leading-relaxed">
              Découvrez nos <Link to="/tarifs" className="text-primary font-semibold hover:underline">tarifs adaptés aux PME</Link>, nos <Link to="/realisations" className="text-primary font-semibold hover:underline">réalisations</Link> ou demandez un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link> pour évaluer votre visibilité actuelle.
            </p>
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <p className="text-sm font-semibold text-primary mb-1">Le saviez-vous ?</p>
              <p className="text-muted-foreground text-sm">{content.localFact}</p>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Process */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Comment se déroule votre projet ?
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous échangeons sur vos besoins, votre activité et vos objectifs pour définir le cahier des charges." },
            { icon: Monitor, step: "2", title: "Maquette et design", desc: "Nous créons une maquette visuelle que vous validez avant le développement." },
            { icon: Shield, step: "3", title: "Développement", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le SEO et la performance." },
            { icon: Clock, step: "4", title: "Mise en ligne", desc: "Votre site est mis en ligne. Nous assurons la formation et le suivi technique." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white font-bold text-xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Liens services */}
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Découvrez aussi nos autres services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Référencement SEO
            </Link>
            <Link to={`/referencement-seo/${city.slug}`} className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              SEO à {city.nameShort}
            </Link>
            <Link to="/audit-seo-gratuit" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Audit SEO gratuit
            </Link>
            <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos tarifs
            </Link>
            <Link to="/realisations" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos réalisations
            </Link>
            <Link to="/faq" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Questions fréquentes
            </Link>
            <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Toutes nos villes
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Maillage interne - autres villes */}
      {nearCities.length > 0 && (
        <SectionWrapper>
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Création de site web près de {city.nameShort}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Nous intervenons également dans les villes voisines pour la création de sites internet professionnels.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearCities.map((c) => (
              <div key={c.slug} className="rounded-2xl bg-card p-4 shadow-card">
                <h3 className="font-bold mb-2">{c.nameShort}</h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/creation-site-web/${c.slug}`}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    Création de site
                  </Link>
                  <Link
                    to={`/referencement-seo/${c.slug}`}
                    className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  >
                    SEO
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">
            Vous êtes basé(e) à {city.nameShort} ? Parlons de votre projet.
          </h2>
          <p className="mb-8 text-white/80">
            Contactez-nous pour un devis gratuit et personnalisé. Premier mois de mise en service + 50€/mois.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
              <Link to="/contact">Demander un devis</Link>
            </Button>
            <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
              Audit SEO gratuit
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VilleCreationSite;
