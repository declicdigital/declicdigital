import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Heart, Target, Rocket, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import PageBreadcrumb from "@/components/PageBreadcrumb";

import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";

const QuiSommesNous = () => (
  <PageLayout>
    <Helmet>
      <title>Qui sommes-nous | Agence web & SEO Paris | Déclic Digital</title>
      <meta name="description" content="Déclic Digital, agence web et SEO freelance à Paris. Spécialisée dans l'accompagnement des TPE, artisans et indépendants en Île-de-France. Découvrez l'équipe." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/qui-sommes-nous" />
    </Helmet>

    {/* Breadcrumb */}
    <PageBreadcrumb items={[
      { label: "Accueil", href: "/" },
      { label: "Qui sommes-nous" },
    ]} />

    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Expert Produit Google
            </span>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Déclic Digital : votre agence web et SEO freelance spécialisée TPE à Paris
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une agence fondée par un Expert Produit Google, avec la conviction que chaque entreprise, quelle que soit sa taille, mérite d'être visible en ligne et d'attirer des clients grâce à un <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web professionnel</Link>.
            </p>
          </motion.div>
      </div>
    </section>

    {/* Storytelling */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
        <div className="flex flex-col items-center mb-8">
          <img
            src={geoffreyPhoto}
            alt="Geoffrey, fondateur de Déclic Digital, Expert Produit Google"
            className="w-40 h-40 rounded-2xl object-cover shadow-card mb-3"
          />
          <p className="font-bold text-foreground text-lg">Geoffrey</p>
          <p className="text-sm text-muted-foreground">Fondateur de Déclic Digital</p>
        </div>
        <p>
          <strong className="text-foreground">Déclic Digital</strong> a été fondé par <strong className="text-foreground">Geoffrey</strong>, 28 ans, diplômé d'une licence en marketing digital et intelligence artificielle, et certifié <strong className="text-foreground">Expert Produit Google</strong>.
        </p>
        <p>
          Passionné par le web depuis plus de 8 ans, il a commencé en aidant son père à développer la visibilité de son entreprise de BTP. Puis il a accompagné un artiste dans la création de son site internet. Ces deux expériences lui ont fait prendre conscience d'un constat : la plupart des petites entreprises n'ont pas les moyens ni les connaissances pour créer un site qui génère réellement des clients.
        </p>
        <p>
          C'est de ce constat qu'est née Déclic Digital : une agence web pensée pour les TPE, les artisans et les indépendants. L'idée est simple : proposer des <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">sites web professionnels</Link>, performants et optimisés pour le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement Google</Link>, à des <Link to="/tarifs" className="text-primary font-semibold hover:underline">tarifs accessibles</Link>.
        </p>
        <div className="rounded-2xl bg-card p-6 shadow-card flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-white">
            <Award size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1">Expert Produit Google</h3>
            <p className="text-base">
              Geoffrey est certifié Expert Produit Google, une reconnaissance officielle de ses compétences sur l'écosystème Google (Search, Business Profile, Analytics). Cette expertise garantit à nos clients des stratégies alignées avec les meilleures pratiques Google.
            </p>
          </div>
        </div>
        <blockquote className="border-l-4 border-primary pl-6 py-2 text-xl font-semibold text-foreground italic">
          "Les petites entreprises ont besoin d'outils simples et efficaces pour trouver des clients en ligne."
        </blockquote>
        <p>
          Aujourd'hui, Déclic Digital accompagne des TPE et indépendants <Link to="/nos-villes" className="text-primary font-semibold hover:underline">à Paris et dans les Hauts-de-Seine</Link>. Chaque projet est abordé avec la même rigueur et la même passion : comprendre les besoins du client, concevoir un site qui lui ressemble, l'optimiser pour Google et mesurer les résultats.
        </p>
        <p>
          Notre force, c'est la proximité. Nous ne sommes pas une grande agence impersonnelle. Nous prenons le temps d'échanger avec chaque client, de comprendre son métier et de proposer des solutions sur mesure. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
        </p>
      </div>
    </SectionWrapper>

    {/* Mission */}
    <SectionWrapper className="bg-section-blue">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl">Notre mission</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Rendre la visibilité en ligne accessible à toutes les entreprises grâce à la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de sites web</Link> et le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>. Nous croyons que chaque TPE mérite un site qui attire des clients.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {[
          { icon: Heart, title: "Passion", desc: "Le web est notre métier et notre passion depuis toujours. Nous aimons ce que nous faisons et cela se reflète dans la qualité de chaque projet." },
          { icon: Target, title: "Résultats", desc: "Chaque action est orientée vers un objectif concret : générer des clients pour votre entreprise. Nous mesurons tout pour optimiser en continu." },
          { icon: Rocket, title: "Accessibilité", desc: "Des solutions adaptées aux budgets des TPE et indépendants. Des explications claires, pas de surprise. Des prix transparents et un accompagnement humain." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
              <item.icon size={26} />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* Nos valeurs */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Nos valeurs</h2>
        <p className="text-muted-foreground leading-relaxed">
          Chez <Link to="/faq" className="text-primary font-semibold hover:underline">Déclic Digital</Link>, nous croyons en la transparence totale. Pas de contrat obscur, pas de termes compliqués, pas de promesses irréalistes. Nous vous expliquons clairement ce que nous faisons, pourquoi nous le faisons, et quels résultats vous pouvez attendre. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nous croyons aussi que la technologie doit être au service de l'humain. Un site web n'est qu'un outil. Ce qui compte, c'est ce qu'il apporte à votre entreprise et à vos clients.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Enfin, nous croyons en la relation de long terme. Nous ne disparaissons pas après la mise en ligne. Nous restons à vos côtés pour suivre les performances, ajuster la stratégie et vous accompagner dans la durée.
        </p>
      </div>
    </SectionWrapper>

    {/* Avis clients Google */}
    <GoogleReviewsSection className="bg-section-blue" />

    {/* Notre agence - Google Maps */}
    <LocationSection />

    {/* Maillage */}
    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Nos services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Référencement SEO
          </Link>
          <Link to="/audit-seo-gratuit" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Audit SEO gratuit
          </Link>
          <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos tarifs
          </Link>
          <Link to="/realisations" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos réalisations
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
          <Link to="/faq" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Parlons de votre projet</h2>
        <p className="mb-8 text-white/80">Nous serions ravis d'échanger sur vos besoins et de vous accompagner dans votre transformation digitale.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
            <Link to="/contact">Parler de votre projet</Link>
          </Button>
          <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Voir nos tarifs
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default QuiSommesNous;
