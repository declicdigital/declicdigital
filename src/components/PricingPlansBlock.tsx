import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    type: "creation",
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

interface PricingPlansBlockProps {
  heading?: string;
}

const PricingPlansBlock = ({ heading = "Nos formules création de site et référencement SEO et GEO" }: PricingPlansBlockProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold md:text-3xl">{heading}</h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
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
                  variant="custom"
                  className="w-full rounded-full font-semibold gradient-primary text-white shadow-lg btn-glow"
                >
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlansBlock;
