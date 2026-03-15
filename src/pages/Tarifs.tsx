import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

const plans = [
  {
    name: "Landing Page",
    monthly: "50",
    setup: "200",
    unit: "€/mois",
    description: "Idéal pour une page unique de présentation ou une offre spécifique.",
    highlighted: false,
    features: [
      "Page unique responsive",
      "Design professionnel sur mesure",
      "Formulaire de contact intégré",
      "Optimisation mobile",
      "Mise en ligne incluse",
    ],
  },
  {
    name: "Site Vitrine",
    monthly: "50",
    setup: "590",
    unit: "€/mois",
    description: "Pour les PME et indépendants qui veulent une présence en ligne professionnelle.",
    highlighted: false,
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
    name: "Domination SEO Locale",
    monthly: "70",
    setup: "150",
    unit: "€/mois",
    description: "Devenez la référence locale sur Google dans votre zone de chalandise.",
    highlighted: false,
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

const Tarifs = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            Tarifs transparents
          </span>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Nos <span className="text-gradient">tarifs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Des offres claires et adaptées aux budgets des PME et indépendants. Chaque prestation, de la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link> au <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>, est pensée pour générer un retour sur investissement concret.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Grille tarifs */}
    <SectionWrapper>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 shadow-card flex flex-col ${
              plan.highlighted
                ? "border-2 border-primary bg-card ring-2 ring-primary/20"
                : "border border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  <Star size={12} fill="currentColor" /> Populaire
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <div className="mb-2">
              <span className="text-xs text-muted-foreground">à partir de</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.monthly}</span>
                <span className="text-lg font-semibold text-muted-foreground">{plan.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+ {plan.setup}€ la première mensualité</p>
            </div>
            <ul className="space-y-2.5 mb-8 mt-4 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`w-full rounded-full font-semibold ${
                plan.highlighted
                  ? "gradient-primary text-primary-foreground shadow-lg hover:opacity-90"
                  : ""
              }`}
              variant={plan.highlighted ? "default" : "outline"}
            >
              <Link to="/contact">Demander un devis</Link>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 mx-auto max-w-2xl text-center">
        <div className="rounded-2xl bg-secondary p-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Engagement de 6 mois renouvelable. Toutes les prestations peuvent être adaptées selon vos besoins. Chaque projet est unique, <Link to="/contact" className="text-primary font-semibold hover:underline">contactez-nous</Link> pour un devis personnalisé. Vous pouvez aussi commencer par un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link>.
          </p>
        </div>
      </div>
    </SectionWrapper>

    {/* Transparence */}
    <SectionWrapper className="bg-card">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-secondary p-8 md:p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Notre engagement de transparence</h2>
              <p className="text-muted-foreground mt-1">Parce que la confiance se construit sur l'honnêteté.</p>
            </div>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground text-lg">Le référencement local est un marathon, pas un sprint.</p>
            <p>
              Certains de nos clients constatent des améliorations significatives en quelques jours seulement. 
              Mais une <strong className="text-foreground">visibilité stable et dominante</strong> sur votre marché local s'obtient généralement entre <strong className="text-foreground">3 et 6 mois</strong> de travail continu.
            </p>
            <p>
              Selon la concurrence dans votre secteur et votre niveau d'implication, les résultats optimaux peuvent prendre plus de temps. 
              C'est normal et c'est le signe d'une stratégie sérieuse.
            </p>
            <p className="font-semibold text-foreground">
              Nous construisons une visibilité pérenne et durable, pas un pic de trafic artificiel qui s'effondre le mois suivant.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>

    {/* Maillage */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Découvrez nos services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Référencement SEO
          </Link>
          <Link to="/audit-seo-gratuit" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Audit SEO gratuit
          </Link>
          <Link to="/realisations" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos réalisations
          </Link>
          <Link to="/qui-sommes-nous" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Qui sommes-nous
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
          <Link to="/faq" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Vous avez un projet en tête ?</h2>
        <p className="mb-8 text-primary-foreground/80">Contactez-nous pour discuter de votre projet et recevoir un devis adapté.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
            <Link to="/contact">Nous contacter</Link>
          </Button>
          <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            Audit SEO gratuit
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Tarifs;
