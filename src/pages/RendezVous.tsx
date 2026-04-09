import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
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
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 flex flex-col justify-center lg:sticky lg:top-32"
            >
              <span className="mb-4 inline-block rounded-full bg-brand-violet/10 px-4 py-1.5 text-xs font-semibold text-brand-violet">
                <Calendar size={14} className="inline mr-1.5 -mt-0.5" />
                Rendez-vous gratuit
              </span>
              <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
                Réservez votre rendez-vous gratuit
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Choisissez un créneau qui vous convient pour échanger sur votre projet de{" "}
                <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">
                  création de site web
                </Link>
                ,{" "}
                <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">
                  référencement SEO
                </Link>{" "}
                ou{" "}
                <Link to="/visibilite-ia" className="text-primary font-semibold hover:underline">
                  visibilité IA
                </Link>
                . C'est gratuit et sans engagement.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "contact@declicdigital.net" },
                  { icon: Phone, label: "Téléphone", value: "06.02.22.89.39" },
                  { icon: MapPin, label: "Localisation", value: "Paris et Hauts-de-Seine (92)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cal.com embed */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                <iframe
                  src={CAL_URL}
                  title="Réserver un rendez-vous avec Déclic Digital"
                  style={{ width: "100%", height: 700, border: "none" }}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Pourquoi prendre rendez-vous ?</h2>
          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            {[
              { title: "100% gratuit", desc: "Aucun engagement, aucun frais. Un simple échange pour comprendre vos besoins." },
              { title: "Conseil personnalisé", desc: "Geoffrey, Expert Produit Google, analyse votre situation et vous recommande les meilleures actions." },
              { title: "Devis sous 24h", desc: "Après notre échange, recevez une proposition détaillée et adaptée à votre budget." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-card p-6 shadow-card">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
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
