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
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import imgEquipe from "@/assets/equipe-agence-web-paris-collaboration.webp";
import imgFenetre from "@/assets/fenetre-haussmannienne-bureau-paris.webp";
import imgConsultante from "@/assets/consultante-agence-digitale-paris-bureau.webp";

const QuiSommesNous = () => (
  <PageLayout>
    <Helmet>
      <title>Expert Produit Google, fondateur de Déclic Digital | Qui sommes-nous</title>
      <meta name="description" content="Geoffrey, Expert Produit Google, a fondé Déclic Digital pour rendre le web accessible aux TPE. Agence freelance spécialisée site internet et SEO à Paris." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/qui-sommes-nous" />
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Qui sommes-nous" }]} />

    {/* Section 1 — Hero clair #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}
          >
            Expert Produit Google
          </span>
          <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
            Déclic Digital : votre agence web et SEO freelance spécialisée TPE à Paris
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#2B1E3F" }}>
            Une agence fondée par un Expert Produit Google, avec la conviction que chaque entreprise, quelle que soit sa taille, mérite d'être visible en ligne et d'attirer des clients grâce à un{" "}
            <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>
              site web professionnel
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </section>

    {/* Section 2 — Storytelling #E9F2F4 */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="relative">
          {/* Image fenêtre en fond côté droit — visible desktop uniquement */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
            <img
              src={imgFenetre}
              alt="Bureau parisien vue haussmannienne - Déclic Digital"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, #E9F2F4 0%, rgba(233,242,244,0.5) 30%, transparent 70%)" }}
            />
          </div>

          {/* Texte qui chevauche l'image */}
          <div className="relative z-10 max-w-2xl space-y-6 text-lg leading-relaxed" style={{ color: "#2B1E3F" }}>
            <div className="flex flex-col items-start mb-8">
              <img
                src={geoffreyPhoto}
                alt="Geoffrey, fondateur de Déclic Digital, Expert Produit Google"
                className="w-32 h-32 rounded-2xl object-cover mb-3"
                style={{ boxShadow: "0 4px 24px rgba(43,30,63,0.12)" }}
              />
              <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Fondateur de Déclic Digital</p>
            </div>
            <p style={{ color: "#2B1E3F" }}>
              <strong>Déclic Digital</strong> a été fondé par <strong>Geoffrey</strong>, 28 ans, diplômé d'une licence en marketing digital et intelligence artificielle, et certifié <strong>Expert Produit Google</strong>.
            </p>
            <p style={{ color: "#2B1E3F" }}>
              Passionné par le web depuis plus de 8 ans, il a commencé en aidant son père à développer la visibilité de son entreprise de BTP. Puis il a accompagné un artiste dans la création de son site internet. Ces deux expériences lui ont fait prendre conscience d'un constat : la plupart des petites entreprises n'ont pas les moyens ni les connaissances pour créer un site qui génère réellement des clients.
            </p>
            <p style={{ color: "#2B1E3F" }}>
              C'est de ce constat qu'est née Déclic Digital : une agence web pensée pour les TPE, les artisans et les indépendants. L'idée est simple : proposer des{" "}
              <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>sites web professionnels</Link>,
              performants et optimisés pour le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement Google</Link>,
              à des{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs accessibles</Link>.
            </p>
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary"
                style={{ color: "#2B1E3F" }}
              >
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
              <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>à Paris et dans les Hauts-de-Seine</Link>.
              Chaque projet est abordé avec la même rigueur et la même passion : comprendre les besoins du client, concevoir un site qui lui ressemble, l'optimiser pour Google et mesurer les résultats.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Section 3 — Image équipe pattern screenshot #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center mx-auto max-w-5xl">
          {/* Image à gauche — pattern comme screenshot : déborde légèrement, ombre card */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(43,30,63,0.15)" }}
            >
              <img
                src={imgEquipe}
                alt="Équipe Déclic Digital - agence web Paris"
                className="w-full object-cover"
                style={{ maxHeight: "360px" }}
                loading="lazy"
              />
            </div>
            {/* Décoration derrière l'image */}
            <div
              className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl -z-10"
              style={{ backgroundColor: "rgba(67,97,238,0.08)" }}
            />
          </div>
          {/* Texte à droite */}
          <div>
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Une équipe à taille humaine, des résultats concrets</h2>
            <p className="text-lg mb-4" style={{ color: "#2B1E3F" }}>
              Nous ne sommes pas une grande agence impersonnelle. Nous prenons le temps d'échanger avec chaque client, de comprendre son métier et de proposer des solutions sur mesure.
            </p>
            <p style={{ color: "#2B1E3F" }}>
              Chaque projet est suivi de A à Z avec le même interlocuteur. Pas de sous-traitance, pas de turnover, juste une équipe soudée et passionnée. Découvrez{" "}
              <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Section 4 — Mission #E9F2F4 */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
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
              style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary"
                style={{ color: "#2B1E3F" }}
              >
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Section 5 — Nos valeurs pattern screenshot #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center mx-auto max-w-5xl">
          {/* Texte à gauche */}
          <div className="space-y-6">
            <h2 style={{ color: "#2B1E3F" }}>Nos valeurs</h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F" }}>
              Chez{" "}
              <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Déclic Digital</Link>,
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
          {/* Image à droite — même pattern */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(43,30,63,0.15)", aspectRatio: "2/3", maxHeight: "460px" }}
            >
              <img
                src={imgConsultante}
                alt="Consultante bureau parisien - Déclic Digital"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10"
              style={{ backgroundColor: "rgba(156,79,255,0.08)" }}
            />
          </div>
        </div>
      </div>
    </section>

    {/* Section 6 — GoogleReviews #E9F2F4 */}
    <GoogleReviewsSection backgroundColor="#E9F2F4" />

    {/* Section 7 — LocationSection #F6F1E9 */}
    <LocationSection backgroundColor="#F6F1E9" />

    {/* Section 8 — Maillage #E9F2F4 */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
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
                style={{
                  border: "1px solid rgba(43,30,63,0.2)",
                  backgroundColor: "#F6F1E9",
                  color: "#2B1E3F",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA texture — skip alternance */}
    <section
      data-alternate="skip"
      className="relative overflow-hidden py-16"
    >
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
