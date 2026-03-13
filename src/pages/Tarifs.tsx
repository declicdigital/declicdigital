import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

const plans = [
  {
    name: "Landing Page",
    price: "300",
    unit: "€",
    description: "Idéal pour une page unique de présentation ou une offre spécifique.",
    highlighted: false,
    features: [
      "Page unique responsive",
      "Design professionnel sur mesure",
      "Formulaire de contact intégré",
      "Optimisation mobile",
      "Mise en ligne incluse",
      "Hébergement 1 an inclus",
    ],
  },
  {
    name: "Site Vitrine",
    price: "590",
    unit: "€",
    description: "Pour les PME et indépendants qui veulent une présence en ligne professionnelle.",
    highlighted: false,
    features: [
      "Jusqu'à 5 pages",
      "Design professionnel personnalisé",
      "Responsive mobile et tablette",
      "Formulaire de contact",
      "Intégration Google Maps",
      "Optimisation vitesse de chargement",
      "Hébergement 1 an inclus",
      "Formation à l'utilisation",
    ],
  },
  {
    name: "Site Vitrine + SEO",
    price: "990",
    unit: "€",
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
      "Hébergement 1 an inclus",
      "Suivi SEO 3 mois inclus",
    ],
  },
  {
    name: "Site Avancé",
    price: "1 500",
    unit: "€+",
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
      "Hébergement 1 an inclus",
      "Suivi SEO 6 mois inclus",
      "Support prioritaire",
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
            Des offres claires et adaptées aux budgets des PME et indépendants. Chaque prestation est pensée pour générer un retour sur investissement concret.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Grille tarifs */}
    <SectionWrapper>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-lg font-semibold text-muted-foreground">{plan.unit}</span>
            </div>
            <ul className="space-y-2.5 mb-8 flex-1">
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
            Toutes les prestations peuvent être adaptées et réalisées sur mesure selon vos besoins. Chaque projet est unique, contactez-nous pour un devis personnalisé.
          </p>
        </div>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Vous avez un projet en tête ?</h2>
        <p className="mb-8 text-primary-foreground/80">Contactez-nous pour discuter de votre projet et recevoir un devis adapté.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/contact">Nous contacter</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default Tarifs;
