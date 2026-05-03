import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";

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

      {/* Section 1 — Hero calendrier #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-8 md:py-10">
        <div className="container">
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}
              >
                <Calendar size={14} className="inline mr-1.5 -mt-0.5" />
                Rendez-vous gratuit
              </span>
              <h1 className="mb-2" style={{ color: "#2B1E3F" }}>
                Échangeons sur votre projet
              </h1>
              <p className="text-base max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Choisissez un créneau pour discuter de votre{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web</Link>,{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO</Link>{" "}ou{" "}
                <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>visibilité IA</Link>.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(43,30,63,0.12)",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 24px rgba(43,30,63,0.08)",
              }}
            >
              <iframe
                src={CAL_URL}
                title="Réserver un rendez-vous avec Déclic Digital"
                style={{ width: "100%", height: 520, border: "none" }}
                loading="lazy"
              />
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
            {[
              { icon: Mail, value: "contact@declicdigital.net" },
              { icon: Phone, value: "06.02.22.89.39" },
              { icon: MapPin, value: "Paris & Hauts-de-Seine (92)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                <item.icon size={15} style={{ color: "#4361EE" }} />
                <span className="font-medium" style={{ color: "#2B1E3F" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Réassurance #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-10 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center" style={{ color: "#2B1E3F" }}>Ce que vous obtenez</h2>
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
                  className="rounded-2xl p-6 flex flex-col items-start gap-3"
                  style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Maillage #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-10 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nos services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: "/referencement-seo", label: "Référencement SEO" },
                { to: "/visibilite-ia", label: "Visibilité IA (GEO)" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/realisations", label: "Réalisations" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#E9F2F4", color: "#2B1E3F" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default RendezVous;
