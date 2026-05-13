import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { CheckCircle2, Globe, TrendingUp, Bot, ArrowRight } from "lucide-react";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import heroImg from "@/assets/consultant-digital-declicweb-paris.webp";

const services = [
  {
    icon: Globe,
    title: "Création de site web",
    desc: "Sites vitrines rapides, optimisés mobile et pensés dès le départ pour le référencement. Chaque projet est conçu pour convertir vos visiteurs en clients.",
    link: "/creation-site-web",
    label: "Voir nos réalisations",
  },
  {
    icon: TrendingUp,
    title: "Référencement SEO",
    desc: "Audit, optimisation technique, contenu et maillage interne. Nous positionnons votre site sur les requêtes qui amènent de vrais clients, pas juste du trafic.",
    link: "/referencement-seo",
    label: "Découvrir le SEO",
  },
  {
    icon: Bot,
    title: "Visibilité IA (GEO)",
    desc: "Être cité par ChatGPT, Perplexity ou Gemini quand un client cherche votre activité. Le nouveau levier de visibilité que la plupart de vos concurrents ignorent encore.",
    link: "/visibilite-ia",
    label: "En savoir plus",
  },
];

const preuves = [
  "Interventions à Paris et dans toute l'Île-de-France",
  "Spécialistes TPE, artisans et indépendants",
  "Résultats mesurables dès les 3 premiers mois",
  "Pas de jargon, pas d'engagement à vie",
  "Devis gratuit sous 24h",
];

const faqItems = [
  {
    q: "Vous cherchez Déclic Web ? Voici qui nous sommes.",
    a: "Déclic Digital est une agence web et SEO spécialisée dans l'accompagnement des TPE, artisans et indépendants à Paris et en Île-de-France. Si vous avez atterri ici en cherchant Déclic Web, vous êtes probablement à la recherche d'un partenaire digital sérieux. C'est exactement ce que nous faisons.",
  },
  {
    q: "Quelle est la différence entre Déclic Web et Déclic Digital ?",
    a: "Déclic Digital est notre marque, notre site, notre équipe. Nous ne sommes pas affiliés à d'autres structures portant un nom similaire. Si vous avez trouvé notre site en cherchant un prestataire web, c'est souvent le signe que vous avez besoin d'un accompagnement sur votre visibilité en ligne. C'est précisément ce que nous proposons : création de site, SEO et GEO.",
  },
  {
    q: "Vous intervenez dans quelle zone géographique ?",
    a: "Principalement Paris et les Hauts-de-Seine (92) : Asnières-sur-Seine, Boulogne-Billancourt, Neuilly, Levallois, Courbevoie, Suresnes et toutes les communes du 92. Nous travaillons aussi à distance sur toute la France.",
  },
  {
    q: "Combien coute une prestation Déclic Digital ?",
    a: "Nos tarifs sont adaptés aux budgets TPE et indépendants. Un site vitrine démarre à partir de 1 000 euros, un accompagnement SEO à partir de 300 euros par mois. Le mieux est de nous contacter pour un devis gratuit et personnalisé.",
  },
];

const Declicweb = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Déclic Web - Agence SEO et création de site | Déclic Digital Paris</title>
        <meta
          name="description"
          content="Vous cherchez Déclic Web ? Déclic Digital : création de site, SEO et visibilité IA pour TPE et artisans à Paris et dans le 92."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/declicweb" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Déclic Digital",
            description: "Agence web et SEO pour TPE, artisans et indépendants à Paris et dans le 92",
            url: "https://declicdigital.net",
            telephone: "+33602228939",
            email: "contact@declicdigital.net",
            priceRange: "€€",
            address: {
              "@type": "PostalAddress",
              streetAddress: "57 rue d'Alleray",
              addressLocality: "Paris",
              postalCode: "75015",
              addressRegion: "Île-de-France",
              addressCountry: "FR",
            },
            areaServed: [
              { "@type": "City", name: "Paris" },
              { "@type": "AdministrativeArea", name: "Hauts-de-Seine (92)" },
            ],
          })}
        </script>
      </Helmet>

      <PageBreadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Déclic Web" }]}
      />

      {/* ─── Hero — image café parisien ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 min-h-[520px] flex items-center">
        <img
          src={heroImg}
          alt="Consultant digital à Paris - Déclic Digital"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, hsl(263,36%,18%,0.96) 0%, hsl(263,36%,18%,0.82) 50%, hsl(263,36%,18%,0.45) 100%)",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold border border-white/20"
                style={{ color: "rgba(246,241,233,0.8)" }}
              >
                Déclic Web - Déclic Digital
              </span>
              <h1 className="mb-5 leading-tight" style={{ color: "#F6F1E9" }}>
                Vous cherchez Déclic Web ? Vous avez trouvé mieux.
              </h1>
              <p
                className="mb-8 text-lg leading-relaxed"
                style={{ color: "rgba(246,241,233,0.78)" }}
              >
                Déclic Digital accompagne les TPE, artisans et indépendants en{" "}
                <Link
                  to="/creation-site-web"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#F6F1E9" }}
                >
                  création de site web
                </Link>
                ,{" "}
                <Link
                  to="/referencement-seo"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#F6F1E9" }}
                >
                  référencement SEO
                </Link>{" "}
                et{" "}
                <Link
                  to="/visibilite-ia"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "#F6F1E9" }}
                >
                  visibilité IA
                </Link>
                . Basés à Paris, actifs partout en France.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  variant="custom"
                  size="lg"
                  className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow"
                >
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
                <Button
                  asChild
                  variant="custom"
                  size="lg"
                  className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow"
                >
                  <Link to="/contact">Devis gratuit</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Clarification — bloc 1 → #F6F1E9 ───────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#2B1E3F", opacity: 0.5 }}
              >
                Qui sommes-nous
              </p>
              <h2 style={{ color: "#2B1E3F" }}>
                Déclic Digital, pas Déclic Web. La nuance compte.
              </h2>
              <p
                className="mt-5 text-lg leading-relaxed"
                style={{ color: "#2B1E3F", opacity: 0.75 }}
              >
                Si vous avez tapé "Déclic Web" dans Google et que vous êtes ici, c'est
                probablement parce que vous cherchez un prestataire sérieux pour votre
                présence en ligne. Bonne nouvelle : vous l'avez trouvé.
              </p>
              <p
                className="mt-3 leading-relaxed"
                style={{ color: "#2B1E3F", opacity: 0.7 }}
              >
                Déclic Digital est une agence spécialisée dans l'accompagnement des petites
                entreprises, artisans et indépendants qui veulent exister sur le web et
                trouver des clients grâce à Google et aux intelligences artificielles. Nous
                ne sommes pas une grande structure qui vous passera à un junior. Nous sommes
                une équipe à taille humaine, basée à Paris, qui travaille avec des gens
                concrets sur des résultats concrets.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {preuves.map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border"
                    style={{
                      backgroundColor: "#E9F2F4",
                      borderColor: "rgba(43,30,63,0.12)",
                      color: "#2B1E3F",
                    }}
                  >
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Services — bloc 2 → #E9F2F4 ─────────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#2B1E3F", opacity: 0.5 }}
              >
                Ce qu'on fait
              </p>
              <h2 style={{ color: "#2B1E3F" }}>
                Trois leviers pour développer votre activité en ligne
              </h2>
              <p
                className="mt-4 max-w-xl mx-auto"
                style={{ color: "#2B1E3F", opacity: 0.7 }}
              >
                Que vous partiez de zéro ou que vous souhaitiez accélérer une présence
                existante, nous avons une réponse adaptée à votre situation.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl p-6 shadow-card border-t-4 border-primary flex flex-col"
                  style={{ backgroundColor: "#F6F1E9" }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary"
                    style={{ color: "#2B1E3F" }}
                  >
                    <s.icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#2B1E3F" }}>
                    {s.title}
                  </h3>
                  <p
                    className="leading-relaxed flex-1"
                    style={{ color: "#2B1E3F", opacity: 0.7 }}
                  >
                    {s.desc}
                  </p>
                  <Link
                    to={s.link}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    {s.label}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA texture milieu — skip alternance ─────────────────────────────── */}
      <section className="relative overflow-hidden py-14" data-alternate="skip">
        <img
          src={imgTexture}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
            Un projet web ? Parlons-en sans engagement.
          </h2>
          <p
            className="mx-auto mb-6 max-w-xl"
            style={{ color: "#2B1E3F", opacity: 0.75 }}
          >
            Devis gratuit sous 24h. On analyse votre situation et on vous dit
            exactement ce qu'on peut faire pour vous.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              variant="custom"
              size="lg"
              className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow"
            >
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button
              asChild
              variant="custom"
              size="lg"
              className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow"
            >
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Pourquoi nous — bloc 3 → #F6F1E9 ───────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <p
              className="text-xs font-bold uppercase tracking-widest text-center"
              style={{ color: "#2B1E3F", opacity: 0.5 }}
            >
              Pourquoi nous choisir
            </p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              Ce qui nous différencie des autres agences web
            </h2>
            <div className="space-y-0">
              {[
                {
                  titre: "On ne vend pas des sites, on construit des outils qui travaillent pour vous",
                  texte:
                    "Un site vitrine qui ne génère pas de clients, c'est une dépense. Un site bien référencé, rapide et pensé pour convertir, c'est un investissement. Chez Déclic Digital, chaque projet de création de site web est conçu dès le départ pour attirer du trafic qualifié et transformer les visiteurs en prospects.",
                },
                {
                  titre: "Le SEO local, c'est notre terrain de jeu",
                  texte:
                    "Artisan à Asnières, coach à Boulogne-Billancourt, consultant à Levallois - nous connaissons les dynamiques locales du 92 et de Paris. Notre approche du référencement SEO local permet à de petites structures de dominer leurs requêtes géographiques face à des concurrents parfois bien plus gros.",
                },
                {
                  titre: "On intègre l'IA dans votre stratégie avant vos concurrents",
                  texte:
                    "Le GEO - Generative Engine Optimization - est la prochaine frontière de la visibilité en ligne. Être cité par ChatGPT ou Perplexity quand un client cherche votre activité, c'est un avantage que la plupart des agences ne proposent pas encore. Nous oui.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 py-7 border-b last:border-0"
                  style={{ borderColor: "rgba(43,30,63,0.1)" }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-extrabold text-sm mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: "#2B1E3F" }}
                    >
                      {item.titre}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: "#2B1E3F", opacity: 0.7 }}
                    >
                      {item.texte}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Google Reviews — bloc 4 → #E9F2F4 ──────────────────────────────── */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#E9F2F4" />

      {/* ─── FAQ — bloc 5 → #F6F1E9 ──────────────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p
              className="text-xs font-bold uppercase tracking-widest text-center"
              style={{ color: "#2B1E3F", opacity: 0.5 }}
            >
              Questions fréquentes
            </p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              Tout ce que vous voulez savoir
            </h2>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(43,30,63,0.1)" }}
            >
              {faqItems.map((f, i) => (
                <div
                  key={i}
                  className="p-6 border-b last:border-0"
                  style={{
                    borderColor: "rgba(43,30,63,0.1)",
                    backgroundColor: i % 2 === 0 ? "#F6F1E9" : "#E9F2F4",
                  }}
                >
                  <h3
                    className="font-bold mb-3"
                    style={{ color: "#2B1E3F" }}
                  >
                    {f.q}
                  </h3>
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: "#2B1E3F", opacity: 0.72 }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA final texture — skip alternance ──────────────────────────────── */}
      <section className="relative overflow-hidden py-16" data-alternate="skip">
        <img
          src={imgTexture}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
            Prêt à donner un vrai coup d'accélérateur à votre visibilité ?
          </h2>
          <p
            className="mb-8 max-w-xl mx-auto"
            style={{ color: "#2B1E3F", opacity: 0.75 }}
          >
            Site web, SEO, GEO : on construit avec vous la stratégie digitale
            adaptée à votre activité et à votre budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              variant="custom"
              size="lg"
              className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow"
            >
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button
              asChild
              variant="custom"
              size="lg"
              className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow"
            >
              <Link to="/contact">Demander un devis gratuit</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Location — bloc 6 → #E9F2F4 ─────────────────────────────────────── */}
      <LocationSection backgroundColor="#E9F2F4" />
    </PageLayout>
  );
};

export default Declicweb;
