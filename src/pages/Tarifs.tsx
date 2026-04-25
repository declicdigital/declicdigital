import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Check, Star, AlertTriangle } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const renderPlanCard = (plan: any, index: number) => (
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
        const total = Number(plan.monthly) * 12 + Number(String(plan.setup).replace(/\s/g, ""));
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
      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, j: number) => (
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
  </motion.div>
);

const Tarifs = () => {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("cms_tarifs")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => setPlans(data ?? []));
  }, []);

  return (
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

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Tarifs" }]} />

      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Tarifs transparents
            </span>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Nos tarifs création de site web et référencement SEO et GEO pour indépendants et TPE
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Des offres claires et adaptées aux budgets des TPE et indépendants. Chaque prestation, de la{" "}
              <Link to="/creation-site-web" className="font-semibold text-primary hover:underline">
                création de site web
              </Link>{" "}
              au{" "}
              <Link to="/referencement-seo" className="font-semibold text-primary hover:underline">
                référencement SEO et GEO
              </Link>
              , est pensée pour générer un retour sur investissement concret.
            </p>
            <div className="mt-8">
              <Button asChild variant="custom" className="rounded-full gradient-primary btn-glow px-10 py-4 text-lg font-bold text-white shadow-xl hover:opacity-90 h-auto">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionWrapper>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold md:text-3xl">
            Nos formules création de site et référencement SEO et GEO
          </h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => renderPlanCard(plan, i))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <div className="rounded-2xl bg-secondary p-6">
            <h2 className="mb-3 text-xl font-extrabold">Ce qui est toujours inclus dans nos prestations</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Engagement de 6 mois renouvelable. Toutes les prestations peuvent être adaptées selon vos besoins. Chaque
              projet est unique, <Link to="/rendez-vous" className="font-semibold text-primary hover:underline">prenez rendez-vous</Link> pour
              un devis personnalisé. Vous pouvez aussi commencer par un{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                audit SEO gratuit
              </Link>
              .
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
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
            <Link to="/creation-site-web" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Création de site web</Link>
            <Link to="/referencement-seo" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Référencement SEO et GEO</Link>
            <Link to="/contact" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Audit SEO gratuit</Link>
            <Link to="/realisations" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Nos réalisations</Link>
            <Link to="/qui-sommes-nous" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Qui sommes-nous</Link>
            <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Nos villes</Link>
            <Link to="/faq" className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Questions fréquentes</Link>
          </div>
        </div>
      </SectionWrapper>

      <GoogleReviewsSection compact maxReviews={3} />
      <LocationSection />

      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">Une question sur les tarifs ? Parlons-en.</h2>
          <p className="mb-8 text-white/80">Contactez-nous pour discuter de votre projet et recevoir un devis adapté.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Tarifs;
