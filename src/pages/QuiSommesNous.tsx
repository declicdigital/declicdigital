import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Heart, Target, Rocket, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import imgEquipe from "@/assets/equipe-agence-web-paris-collaboration.webp";
import imgFenetre from "@/assets/fenetre-haussmannienne-bureau-paris.webp";
import imgConsultante from "@/assets/consultante-agence-digitale-paris-bureau.webp";
import heroQSN from "@/assets/qui-sommes-nous-agence-declic-digital.webp";

const QuiSommesNous = () => (
  <PageLayout>
    <Helmet>
      <title>Expert Produit Google, fondateur de Déclic Digital | Qui sommes-nous</title>
      <meta name="description" content="Geoffrey, Expert Produit Google, a fondé Déclic Digital pour rendre le web accessible aux TPE. Agence freelance spécialisée site internet et SEO à Paris." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/qui-sommes-nous" />
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Qui sommes-nous" }]} />

    {/* Section 1 — Hero sombre fond image, texte à DROITE — skip alternance */}
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
      <img
        src={heroQSN}
        alt="Geoffrey, fondateur de Déclic Digital, agence web SEO Paris"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl ml-auto"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold border"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(246,241,233,0.8)" }}
          >
            Expert Produit Google
          </span>
          <h1 className="mb-6 leading-tight" style={{ color: "#F6F1E9" }}>
            Déclic Digital : votre agence web et SEO freelance spécialisée TPE à Paris
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(246,241,233,0.75)" }}>
            Une agence fondée par un Expert Produit Google, avec la conviction que chaque entreprise, quelle que soit sa taille, mérite d'être visible en ligne et d'attirer des clients grâce à un{" "}
            <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#F6F1E9" }}>
              site web professionnel
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </section>

    {/* Section 2 — Storytelling #F6F1E9 — image fenêtre overlap DROITE */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="relative min-h-[480px] flex items-center">
          {/* Image fenêtre qui déborde à droite avec fondu vers #F6F1E9 */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
            <img
              src={imgFenetre}
              alt="Bureau parisien vue haussmannienne - Déclic Digital"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, #F6F1E9 0%, rgba(246,241,233,0.5) 30%, transparent 70%)" }}
            />
          </div>

          {/* Texte à gauche */}
          <div className="relative z-10 max-w-2xl space-y-6 text-lg leading-relaxed">
            <p style={{ color: "#2B1E3F" }}>
              <strong>Déclic Digital</strong> a été fondé par <strong>Geoffrey</strong>, 28 ans, diplômé d'une licence en marketing digital et intelligence artificielle, et certifié <strong>Expert Produit Google</strong>.
            </p>
            <p style={{ color: "#2B1E3F" }}>
              Passionné par le web depuis plus de 8 ans, il a commencé en aidant son père à développer la visibilité de son entreprise de BTP. Puis il a accompagné un artiste dans la création de son site internet. Ces deux expériences lui ont fait prendre conscience d'un constat : la plupart des petites entreprises n'ont pas les moyens ni les connaissances pour créer un site qui génère réellement des clients.
            </p>
            <p style={{ color: "#2B1E3F" }}>
              C'est de ce constat qu'est née Déclic Digital : une agence web pensée pour les TPE, les artisans et les indépendants. L'idée est simple : proposer des{" "}
              <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>sites web professionnels</Link>,{" "}
              performants et optimisés pour le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement Google</Link>,{" "}
              à des{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs accessibles</Link>.
            </p>
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: "#2B1E3F" }}>Expert Produit Google</h3>
                <p className="text-base" style={{ color: "#2B1E3F" }}>
                  Geoffrey est certifié Expert Produit Google, une reconnaissance officielle de ses compétences sur l'écosystème Google (Search, Business Profile, Analytics). Cette expertise garantit à nos clients des stratégies alignées avec les meilleures pratiques Google.
                </p>
              </div>
            </div>
            <blockquote
              className="pl-6 py-2 text-xl font-semibold italic"
              style={{ borderLeft: "4px solid #4361EE", color: "#2B1E3F" }}
            >
              "Les petites entreprises ont besoin d'outils simples et efficaces pour trouver des clients en ligne."
            </blockquote>
            <p style={{ color: "#2B1E3F" }}>
              Aujourd'hui, Déclic Digital accompagne des TPE et indépendants{" "}
              <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>à Paris et dans les Hauts-de-Seine</Link>.{" "}
              Chaque projet est abordé avec la même rigueur et la même passion : comprendre les besoins du client, concevoir un site qui lui ressemble, l'optimiser pour Google et mesurer les résultats.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Section 3 — Équipe #E9F2F4 — image overlap GAUCHE, texte droite */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="relative min-h-[320px] flex items-center">
            {/* Image qui déborde à gauche avec fondu vers #E9F2F4 */}
            <div className="hidden lg:block absolute left-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
              <img
                src={imgEquipe}
                alt="Équipe Déclic Digital - agence web Paris"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to left, #E9F2F4 0%, rgba(233,242,244,0.3) 40%, transparent 70%)" }}
              />
            </div>
            {/* Texte à droite */}
            <div className="relative z-10 ml-auto max-w-xl space-y-5 py-10">
              <h2 style={{ color: "#2B1E3F" }}>Une équipe à taille humaine, des résultats concrets</h2>
              <p className="text-lg" style={{ color: "#2B1E3F" }}>
                Nous ne sommes pas une grande agence impersonnelle. Nous prenons le temps d'échanger avec chaque client, de comprendre son métier et de proposer des solutions sur mesure.
              </p>
              <p style={{ color: "#2B1E3F" }}>
                Chaque projet est suivi de A à Z avec le même interlocuteur. Pas de sous-traitance, pas de turnover, juste une équipe soudée et passionnée. Découvrez{" "}
                <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section 4 — Mission #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 style={{ color: "#2B1E3F" }}>Notre mission</h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#2B1E3F" }}>
            Rendre la visibilité en ligne accessible à toutes les entreprises grâce à la{" "}
            <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>création de sites web</Link>{" "}
            et le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement SEO et GEO</Link>.
            Nous croyons que chaque TPE mérite un site qui attire des clients.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            { icon: Heart, title: "Passion", desc: "Le web est notre métier et notre passion depuis toujours. Nous aimons ce que nous faisons et cela se reflète dans la qualité de chaque projet." },
            { icon: Target, title: "Résultats", desc: "Chaque action est orientée vers un objectif concret : générer des clients pour votre entreprise. Nous mesurons tout pour optimiser en continu." },
            { icon: Rocket, title: "Accessibilité", desc: "Des solutions adaptées aux budgets des TPE et indépendants. Des explications claires, pas de surprise. Des prix transparents et un accompagnement humain." },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Section 5 — Nos valeurs #E9F2F4 — image overlap DROITE, texte gauche */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="relative min-h-[400px] flex items-center">
            {/* Image qui déborde à droite avec fondu vers #E9F2F4 */}
            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
              <img
                src={imgConsultante}
                alt="Consultante bureau parisien - Déclic Digital"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, #E9F2F4 0%, rgba(233,242,244,0.3) 40%, transparent 70%)" }}
              />
            </div>
            {/* Texte à gauche */}
            <div className="relative z-10 max-w-xl space-y-6 py-10">
              <h2 style={{ color: "#2B1E3F" }}>Nos valeurs</h2>
              <p className="leading-relaxed" style={{ color: "#2B1E3F" }}>
                Chez{" "}
                <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Déclic Digital</Link>,{" "}
                nous croyons en la transparence totale. Pas de contrat obscur, pas de termes compliqués, pas de promesses irréalistes. Nous vous expliquons clairement ce que nous faisons, pourquoi nous le faisons, et quels résultats vous pouvez attendre. Consultez{" "}
                <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link>.
              </p>
              <p className="leading-relaxed" style={{ color: "#2B1E3F" }}>
                Nous croyons aussi que la technologie doit être au service de l'humain. Un site web n'est qu'un outil. Ce qui compte, c'est ce qu'il apporte à votre entreprise et à vos clients.
              </p>
              <p className="leading-relaxed" style={{ color: "#2B1E3F" }}>
                Enfin, nous croyons en la relation de long terme. Nous ne disparaissons pas après la mise en ligne. Nous restons à vos côtés pour suivre les performances, ajuster la stratégie et vous accompagner dans la durée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section 6 — GoogleReviews #F6F1E9 */}
    <GoogleReviewsSection backgroundColor="#F6F1E9" />

    {/* Section 7 — LocationSection #E9F2F4 */}
    <LocationSection backgroundColor="#E9F2F4" />

    {/* Section 8 — Maillage #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: "#2B1E3F" }}>Nos services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/creation-site-web", label: "Création de site web" },
              { to: "/referencement-seo", label: "Référencement SEO et GEO" },
              { to: "/contact", label: "Audit SEO gratuit" },
              { to: "/tarifs", label: "Nos tarifs" },
              { to: "/realisations", label: "Nos réalisations" },
              { to: "/nos-villes", label: "Nos villes" },
              { to: "/faq", label: "Questions fréquentes" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#E9F2F4", color: "#2B1E3F" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA texture — skip alternance */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold" style={{ color: "#2B1E3F" }}>Parlons de votre projet</h2>
        <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Nous serions ravis d'échanger sur vos besoins et de vous accompagner dans votre transformation digitale.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/tarifs">Voir nos tarifs</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default QuiSommesNous;
