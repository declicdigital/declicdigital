import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import SectionWrapper from "@/components/SectionWrapper";

const CAL_URL = "https://cal.com/declic-digital/rendez-vous?embed=true&layout=month_view&theme=light";

const RendezVous = () => {

  return (
    <PageLayout>
      <Helmet>
        <title>Prendre rendez-vous | Déclic Digital Paris</title>
        <meta
          name="description"
          content="Réservez un créneau avec Geoffrey, Expert Produit Google chez Déclic Digital. Rendez-vous gratuit pour discuter de votre projet web, SEO ou visibilité IA."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/rendez-vous" />
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Prendre rendez-vous" }]} />

      {/* Hero */}
      <section className="gradient-hero py-8 md:py-10">
        <div className="container">
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-3 inline-block rounded-full bg-brand-violet/10 px-4 py-1.5 text-xs font-semibold text-brand-violet">
                <Calendar size={14} className="inline mr-1.5 -mt-0.5" />
                Rendez-vous gratuit
              </span>
              <h1 className="text-3xl font-extrabold md:text-4xl mb-2">
                Échangeons sur votre projet
              </h1>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Choisissez un créneau pour discuter de votre{" "}
                <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link>,{" "}
                <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">SEO</Link>{" "}ou{" "}
                <Link to="/visibilite-ia" className="text-primary font-semibold hover:underline">visibilité IA</Link>.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <iframe
                src={CAL_URL}
                title="Réserver un rendez-vous avec Déclic Digital"
                style={{ width: "100%", height: 520, border: "none" }}
                loading="lazy"
              />
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
            {[
              { icon: Mail, value: "contact@declicdigital.net" },
              { icon: Phone, value: "06.02.22.89.39" },
              { icon: MapPin, value: "Paris & Hauts-de-Seine (92)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon size={15} className="text-primary" />
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <SectionWrapper className="bg-section-blue py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold mb-6 text-center">Ce que vous obtenez</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Lightbulb, title: "Audit express offert", desc: "On analyse votre présence en ligne et on identifie vos axes d'amélioration prioritaires." },
              { icon: CheckCircle2, title: "Recommandations concrètes", desc: "Vous repartez avec un plan d'action clair, adapté à votre activité et votre budget." },
              { icon: Clock, title: "Devis détaillé sous 24h", desc: "Après notre échange, recevez une proposition chiffrée et personnalisée par email." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card p-6 shadow-card flex flex-col items-start gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white">
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Maillage */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Nos services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/creation-site-web" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Création de site web
            </Link>
            <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Référencement SEO
            </Link>
            <Link to="/visibilite-ia" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Visibilité IA (GEO)
            </Link>
            <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos tarifs
            </Link>
            <Link to="/realisations" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Réalisations
            </Link>
            <Link to="/contact" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
};

export default RendezVous;
