import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Check, Star, AlertTriangle } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import imgTarifs from "@/assets/tarifs-creation-site-web-declic-digital.webp";

const renderPlanCard = (plan: any, index: number) => (
  <motion.div
    key={plan.name}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`relative flex flex-col rounded-2xl p-6 shadow-card ${
      plan.highlighted
        ? "border-2 border-primary ring-2 ring-primary/20"
        : "border"
    }`}
    style={{ backgroundColor: "#F6F1E9", borderColor: plan.highlighted ? undefined : "rgba(43,30,63,0.1)" }}
  >
    {plan.highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 rounded-full gradient-primary px-4 py-1 text-xs font-bold" style={{ color: "#2B1E3F" }}>
          <Star size={12} fill="currentColor" /> Populaire
        </span>
      </div>
    )}

    <h3 className="mb-2 text-xl font-bold" style={{ color: "#2B1E3F" }}>{plan.name}</h3>
    <p className="mb-4 text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>{plan.description}</p>

    <div className="mb-2">
      <span className="text-xs" style={{ color: "#2B1E3F", opacity: 0.5 }}>à partir de</span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold" style={{ color: "#2B1E3F" }}>{plan.monthly}</span>
        <span className="text-lg font-semibold" style={{ color: "#2B1E3F", opacity: 0.5 }}>{plan.unit}</span>
      </div>
      <p className="mt-1 text-xs" style={{ color: "#2B1E3F", opacity: 0.5 }}>+ {plan.setup}€ la première mensualité</p>
      {(() => {
        const total = Number(plan.monthly) * 12 + Number(String(plan.setup).replace(/\s/g, ""));
        const discounted = Math.round(total * 0.85);
        return (
          <p className="mt-3 text-sm font-bold text-primary md:text-base">
            ou en 1 fois -15% : {discounted.toLocaleString("fr-FR")}€{" "}
            <span className="font-normal line-through" style={{ color: "#2B1E3F", opacity: 0.4 }}>
              {total.toLocaleString("fr-FR")}€
            </span>
          </p>
        );
      })()}
    </div>

    <ul className="mb-8 mt-4 flex-1 space-y-2.5">
      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, j: number) => (
        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "#2B1E3F", opacity: 0.8 }}>
          <Check size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      asChild
      variant="custom"
      className="w-full rounded-full font-bold gradient-miami btn-glow shadow-glow"
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

      {/* ─── Hero — image plein fond + overlay beige, bloc 1 ────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
        <img src={imgTarifs} alt="Tarifs création de site web - Déclic Digital" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(246,241,233,0.97) 0%, rgba(246,241,233,0.85) 50%, rgba(246,241,233,0.55) 100%)" }} />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Tarifs transparents
            </span>
            <h1 className="mb-4" style={{ color: "#2B1E3F" }}>
              Nos tarifs création de site web et référencement SEO et GEO pour indépendants et TPE
            </h1>
            <p className="max-w-2xl text-lg" style={{ color: "#2B1E3F", opacity: 0.7 }}>
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
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Formules — bloc 2 → #E9F2F4 ────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center font-extrabold" style={{ color: "#2B1E3F" }}>
              Nos formules création de site et référencement SEO et GEO
            </h2>
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, i) => renderPlanCard(plan, i))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl text-center">
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#F6F1E9" }}>
              <h2 className="mb-3 text-xl font-extrabold" style={{ color: "#2B1E3F" }}>Ce qui est toujours inclus dans nos prestations</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
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
        </div>
      </section>

      {/* ─── Engagement transparence — bloc 3 → #F6F1E9 ─────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border p-8 md:p-10"
              style={{ backgroundColor: "#E9F2F4", borderColor: "rgba(43,30,63,0.1)" }}
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold" style={{ color: "#2B1E3F" }}>Notre engagement de transparence</h3>
                  <p className="mt-1" style={{ color: "#2B1E3F", opacity: 0.6 }}>Parce que la confiance se construit sur l'honnêteté.</p>
                </div>
              </div>
              <div className="space-y-4 leading-relaxed">
                <p className="text-lg font-semibold" style={{ color: "#2B1E3F" }}>Le référencement local est un marathon, pas un sprint.</p>
                <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Certains de nos clients constatent des améliorations significatives en quelques jours seulement. Mais une{" "}
                  <strong style={{ color: "#2B1E3F" }}>visibilité stable et dominante</strong> sur votre marché local s'obtient
                  généralement entre <strong style={{ color: "#2B1E3F" }}>3 et 6 mois</strong> de travail continu.
                </p>
                <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Selon la concurrence dans votre secteur et votre niveau d'implication, les résultats optimaux peuvent prendre
                  plus de temps. C'est normal et c'est le signe d'une stratégie sérieuse.
                </p>
                <p className="font-semibold" style={{ color: "#2B1E3F" }}>
                  Nous construisons une visibilité pérenne et durable, pas un pic de trafic artificiel qui s'effondre le mois
                  suivant.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Découvrir nos services — bloc 4 → #E9F2F4 ───────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-4 text-2xl font-extrabold" style={{ color: "#2B1E3F" }}>Découvrez nos services</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: "/referencement-seo", label: "Référencement SEO et GEO" },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/realisations", label: "Nos réalisations" },
                { to: "/qui-sommes-nous", label: "Qui sommes-nous" },
                { to: "/nos-villes", label: "Nos villes" },
                { to: "/faq", label: "Questions fréquentes" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#F6F1E9", color: "#2B1E3F", borderColor: "rgba(43,30,63,0.15)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GoogleReviews — bloc 5 → #F6F1E9 ───────────────────────────────── */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#F6F1E9" />

      {/* ─── LocationSection — bloc 6 → #E9F2F4 ─────────────────────────────── */}
      <LocationSection backgroundColor="#E9F2F4" />

      {/* ─── CTA finale texture — skip alternance ─────────────────────────────── */}
      <section className="relative overflow-hidden py-16" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Une question sur les tarifs ? Parlons-en.</h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>Contactez-nous pour discuter de votre projet et recevoir un devis adapté.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Tarifs;
