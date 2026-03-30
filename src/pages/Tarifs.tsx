import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Check, Star, AlertTriangle } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";

type PlanType = "creation" | "seo";

const plans: {
  name: string;
  monthly: string;
  setup: string;
  unit: string;
  description: string;
  highlighted: boolean;
  type: PlanType;
  features: string[];
}[] = [
  {
    name: "Site Vitrine",
    monthly: "50",
    setup: "590",
    unit: "€/mois",
    description: "Pour les TPE et indépendants qui veulent une présence en ligne professionnelle.",
    highlighted: false,
    type: "creation",
    features: [
      "Jusqu'à 5 pages",
      "Design professionnel personnalisé",
      "Responsive mobile et tablette",
      "Formulaire de contact",
      "Intégration Google Maps",
      "Optimisation vitesse de chargement",
      "Formation à l'utilisation",
    ],
  },
  {
    name: "Site Vitrine + SEO",
    monthly: "75",
    setup: "990",
    unit: "€/mois",
    description: "La solution complète pour être visible sur Google et attirer des clients.",
    highlighted: true,
    type: "seo",
    features: [
      "Jusqu'à 8 pages",
      "Design professionnel personnalisé",
      "Responsive mobile et tablette",
      "Optimisation SEO complète",
      "Recherche de mots clés",
      "Rédaction de contenu optimisé",
      "Balises meta et structure Hn",
      "Google Search Console configuré",
      "Google Analytics configuré",
    ],
  },
  {
    name: "Site Avancé",
    monthly: "80",
    setup: "1 500",
    unit: "€/mois",
    description: "Pour les entreprises qui veulent un site complet avec optimisation maximale.",
    highlighted: false,
    type: "creation",
    features: [
      "Pages illimitées",
      "Design sur mesure premium",
      "Responsive tous écrans",
      "SEO technique avancé",
      "Stratégie de contenu complète",
      "Maillage interne optimisé",
      "Données structurées (Schema.org)",
      "Blog intégré",
      "Google Search Console + Analytics",
      "Optimisation pour les IA",
      "Support prioritaire",
    ],
  },
  {
    name: "Landing Page",
    monthly: "50",
    setup: "200",
    unit: "€/mois",
    description: "Idéal pour une page unique de présentation ou une offre spécifique.",
    highlighted: false,
    type: "creation",
    features: [
      "Page unique responsive",
      "Design professionnel sur mesure",
      "Formulaire de contact intégré",
      "Optimisation mobile",
      "Mise en ligne incluse",
    ],
  },
  {
    name: "Domination SEO Locale",
    monthly: "70",
    setup: "150",
    unit: "€/mois",
    description: "Devenez la référence locale sur Google dans votre zone de chalandise.",
    highlighted: false,
    type: "seo",
    features: [
      "Optimisation fiche Google Business",
      "SEO local ciblé par ville / quartier",
      "Gestion des avis Google",
      "Citations NAP sur annuaires clés",
      "Reporting mensuel de positionnement",
      "Suivi Google Maps & Pack Local",
      "Stratégie de contenu local",
      "Analyse concurrentielle locale",
    ],
  },
];

const creationPlans = plans.filter((plan) => plan.type === "creation");
const seoPlans = plans.filter((plan) => plan.type === "seo");

const renderPlanCard = (plan: (typeof plans)[number], index: number) => (
  <motion.div
    key={plan.name}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`relative flex flex-col rounded-2xl p-6 shadow-card ${
      plan.highlighted
        ? "border-2 border-primary bg-card ring-2 ring-primary/20"
        : "border border-border bg-card"
    }`}
  >
    {plan.highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-4 py-1 text-xs font-bold text-white">
          <Star size={12} fill="currentColor" /> Populaire
        </span>
      </div>
    )}

    <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
    <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

    <div className="mb-2">
      <span className="text-xs text-muted-foreground">à partir de</span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold">{plan.monthly}</span>
        <span className="text-lg font-semibold text-muted-foreground">{plan.unit}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">+ {plan.setup}€ la première mensualité</p>
      {(() => {
        const total = Number(plan.monthly) * 12 + Number(plan.setup.replace(/\s/g, ""));
        const discounted = Math.round(total * 0.85);
        return (
          <p className="mt-3 text-sm font-bold text-primary md:text-base">
            ou en 1 fois -15% : {discounted.toLocaleString("fr-FR")}€{" "}
            <span className="font-normal text-muted-foreground line-through">
              {total.toLocaleString("fr-FR")}€
            </span>
          </p>
        );
      })()}
    </div>

    <ul className="mb-8 mt-4 flex-1 space-y-2.5">
      {plan.features.map((feature, j) => (
        <li key={j} className="flex items-start gap-2 text-sm">
          <Check size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      asChild
      className={`w-full rounded-full font-semibold ${
        plan.highlighted ? "gradient-primary text-white shadow-lg hover:opacity-90" : ""
      }`}
      variant={plan.highlighted ? "default" : "outline"}
    >
      <Link to="/contact">Demander un devis</Link>
    </Button>
  </motion.div>
);

const Tarifs = () => (
  <PageLayout>
    <Helmet>
      <title>Tarifs site web et SEO dès 50€/mois | Déclic Digital Paris</title>
      <meta
        name="description"
        content="Tarifs transparents : landing page dès 200€, site vitrine dès 590€, SEO dès 50€/mois. Forfaits adaptés aux TPE et artisans. Sans engagement, devis gratuit."
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/tarifs" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Création de site web et référencement SEO",
          provider: {
            "@type": "LocalBusiness",
            name: "Déclic Digital",
            url: "https://declicdigital.net",
          },
          areaServed: "Île-de-France",
        })}
      </script>
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web", href: "/creation-site-web" }, { label: "Tarifs" }]} />

    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Tarifs transparents
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Nos tarifs création de site web et référencement SEO pour indépendants et TPE
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Des offres claires et adaptées aux budgets des TPE et indépendants. Chaque prestation, de la{" "}
            <Link to="/creation-site-web" className="font-semibold text-primary hover:underline">
              création de site web
            </Link>{" "}
            au{" "}
            <Link to="/referencement-seo" className="font-semibold text-primary hover:underline">
              référencement SEO
            </Link>
            , est pensée pour générer un retour sur investissement concret.
          </p>
          <div className="mt-8">
            <Button asChild className="rounded-full gradient-miami px-10 py-4 text-lg font-bold text-white shadow-xl hover:opacity-90 h-auto opacity-90 saturate-[0.85]">
              <Link to="/contact">Devis gratuit</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-5xl space-y-12">
        <div>
          <h2 className="mb-6 text-center text-2xl font-extrabold md:text-3xl">
            Formules création de site internet pour TPE et artisans
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creationPlans.map((plan, i) => renderPlanCard(plan, i))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-center text-2xl font-extrabold md:text-3xl">
            Formules référencement SEO mensuel
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {seoPlans.map((plan, i) => renderPlanCard(plan, i))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <div className="rounded-2xl bg-secondary p-6">
          <h2 className="mb-3 text-xl font-extrabold">Ce qui est toujours inclus dans nos prestations</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Engagement de 6 mois renouvelable. Toutes les prestations peuvent être adaptées selon vos besoins. Chaque
            projet est unique, <Link to="/contact" className="font-semibold text-primary hover:underline">contactez-nous</Link> pour
            un devis personnalisé. Vous pouvez aussi commencer par un{" "}
            <Link to="/audit-seo-gratuit" className="font-semibold text-primary hover:underline">
              audit SEO gratuit
            </Link>
            .
          </p>
        </div>
      </div>
    </SectionWrapper>

    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-secondary p-8 md:p-10"
        >
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold">Notre engagement de transparence</h3>
              <p className="mt-1 text-muted-foreground">Parce que la confiance se construit sur l'honnêteté.</p>
            </div>
          </div>
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p className="text-lg font-semibold text-foreground">Le référencement local est un marathon, pas un sprint.</p>
            <p>
              Certains de nos clients constatent des améliorations significatives en quelques jours seulement. Mais une{" "}
              <strong className="text-foreground">visibilité stable et dominante</strong> sur votre marché local s'obtient
              généralement entre <strong className="text-foreground">3 et 6 mois</strong> de travail continu.
            </p>
            <p>
              Selon la concurrence dans votre secteur et votre niveau d'implication, les résultats optimaux peuvent prendre
              plus de temps. C'est normal et c'est le signe d'une stratégie sérieuse.
            </p>
            <p className="font-semibold text-foreground">
              Nous construisons une visibilité pérenne et durable, pas un pic de trafic artificiel qui s'effondre le mois
              suivant.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="mb-4 text-2xl font-extrabold">Découvrez nos services</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Référencement SEO
          </Link>
          <Link to="/audit-seo-gratuit" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Audit SEO gratuit
          </Link>
          <Link to="/realisations" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Nos réalisations
          </Link>
          <Link to="/qui-sommes-nous" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Qui sommes-nous
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Nos villes
          </Link>
          <Link to="/faq" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    <GoogleReviewsSection compact maxReviews={3} className="bg-section-blue" />

    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Une question sur les tarifs ? Parlons-en.</h2>
        <p className="mb-8 text-white/80">Contactez-nous pour discuter de votre projet et recevoir un devis adapté.</p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
            <Link to="/contact">Nous contacter</Link>
          </Button>
          <Link
            to="/audit-seo-gratuit"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Audit SEO gratuit
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Tarifs;