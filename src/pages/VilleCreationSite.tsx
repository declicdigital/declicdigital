import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";
import { getCityBySlug, cities } from "@/data/cities";
import { Helmet } from "react-helmet-async";

const VilleCreationSite = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/creation-site-web" replace />;

  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);

  return (
    <PageLayout>
      <Helmet>
        <title>{`Création de site web ${city.nameShort} - Agence web | Déclic Digital`}</title>
        <meta name="description" content={`Création de site internet professionnel ${city.description}. Agence web spécialisée PME. Site vitrine, e-commerce, responsive et optimisé SEO. Devis gratuit.`} />
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/${city.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence web {city.description}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                Création de site web à{" "}
                <span className="text-gradient">{city.nameShort}</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Vous êtes une PME ou un indépendant {city.description} ? Déclic Digital crée votre site internet professionnel, responsive et optimisé pour Google. Attirez enfin les bons clients grâce à un site qui travaille pour vous.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
                  <Link to="/contact">Devis création de site</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
                  <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
                </Button>
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
      <SectionWrapper className="bg-card">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          Pourquoi créer un site web à {city.nameShort} ?
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Un site internet professionnel est indispensable pour les entreprises {city.description}. Il vous permet d'être trouvé par vos clients locaux et de vous démarquer de la concurrence.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Design professionnel", desc: `Un site qui reflète le sérieux de votre entreprise ${city.description}. Première impression décisive.` },
            { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur. Plus de 60% du trafic est mobile." },
            { icon: TrendingUp, title: "Optimisé SEO", desc: `Référencement local pour apparaître en première page Google sur "${city.nameShort}" et vos mots clés métier.` },
            { icon: Zap, title: "Rapide et performant", desc: "Un temps de chargement optimisé pour une meilleure expérience utilisateur et un meilleur positionnement Google." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-background p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
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
          Nos solutions de création de site à {city.nameShort}
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

      {/* Process */}
      <SectionWrapper className="bg-card">
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
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold text-xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
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
          <div className="flex flex-wrap justify-center gap-3">
            {nearCities.map((c) => (
              <Link
                key={c.slug}
                to={`/creation-site-web/${c.slug}`}
                className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
              >
                Création site web {c.nameShort}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {nearCities.map((c) => (
              <Link
                key={c.slug}
                to={`/referencement-seo/${c.slug}`}
                className="rounded-full border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                SEO {c.nameShort}
              </Link>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">
            Prêt à créer votre site web à {city.nameShort} ?
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Contactez-nous pour un devis gratuit et personnalisé. Premier mois de mise en service + 50€/mois.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
              <Link to="/contact">Demander un devis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VilleCreationSite;
