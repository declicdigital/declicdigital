import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Target, Rocket, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroAbout from "@/assets/agence-creation-site-web.png";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";

const QuiSommesNous = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Expert Produit Google
            </span>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              L'histoire de <span className="text-gradient">Déclic Digital</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une agence fondée par un Expert Produit Google, avec la conviction que chaque entreprise, quelle que soit sa taille, mérite d'être visible en ligne et d'attirer des clients grâce à un site web professionnel.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroAbout} alt="Agence création de site web Déclic Digital" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Geoffrey */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <img
              src={geoffreyPhoto}
              alt="Geoffrey, fondateur de Déclic Digital, Expert Produit Google"
              className="w-40 h-40 rounded-2xl object-cover shadow-card border-4 border-primary/20"
            />
            <p className="text-center mt-3 font-bold text-foreground">Geoffrey</p>
            <p className="text-center text-xs text-muted-foreground">Fondateur, Expert Produit Google</p>
          </motion.div>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Déclic Digital</strong> a été fondé par <strong className="text-foreground">Geoffrey</strong>, 28 ans, diplômé d'une licence en marketing digital et intelligence artificielle, et certifié <strong className="text-foreground">Expert Produit Google</strong>.
            </p>
            <p>
              Passionné par le web depuis plus de 8 ans, il a commencé en aidant son père à développer la visibilité de son entreprise de BTP. Puis il a accompagné un artiste dans la création de son site internet. Ces deux expériences lui ont fait prendre conscience d'un constat : la plupart des petites entreprises n'ont pas les moyens ni les connaissances pour créer un site qui génère réellement des clients.
            </p>
          </div>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            C'est de ce constat qu'est née Déclic Digital : une agence web pensée pour les PME, les artisans et les indépendants. L'idée est simple : proposer des sites web professionnels, performants et optimisés pour le référencement Google, à des tarifs accessibles.
          </p>
          <div className="rounded-2xl bg-card p-6 shadow-card flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
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
            Aujourd'hui, Déclic Digital accompagne des PME et indépendants partout en France. Chaque projet est abordé avec la même rigueur et la même passion : comprendre les besoins du client, concevoir un site qui lui ressemble, l'optimiser pour Google et mesurer les résultats.
          </p>
          <p>
            Notre force, c'est la proximité. Nous ne sommes pas une grande agence impersonnelle. Nous prenons le temps d'échanger avec chaque client, de comprendre son métier et de proposer des solutions sur mesure.
          </p>
        </div>
      </div>
    </SectionWrapper>

    {/* Mission */}
    <SectionWrapper className="bg-card">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl">Notre mission</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Rendre la visibilité en ligne accessible à toutes les entreprises. Nous croyons que chaque PME mérite un site web qui travaille pour elle et qui attire des clients de manière régulière.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {[
          { icon: Heart, title: "Passion", desc: "Le web est notre métier et notre passion depuis toujours. Nous aimons ce que nous faisons et cela se reflète dans la qualité de chaque projet." },
          { icon: Target, title: "Résultats", desc: "Chaque action est orientée vers un objectif concret : générer des clients pour votre entreprise. Nous mesurons tout pour optimiser en continu." },
          { icon: Rocket, title: "Accessibilité", desc: "Des solutions adaptées aux budgets des PME et petites entreprises. Pas de jargon, pas de surprise. Des prix clairs et un accompagnement humain." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
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
          Chez Déclic Digital, nous croyons en la transparence totale. Pas de contrat obscur, pas de jargon incompréhensible, pas de promesses irréalistes. Nous vous expliquons clairement ce que nous faisons, pourquoi nous le faisons, et quels résultats vous pouvez attendre.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nous croyons aussi que la technologie doit être au service de l'humain. Un site web n'est qu'un outil. Ce qui compte, c'est ce qu'il apporte à votre entreprise et à vos clients.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Enfin, nous croyons en la relation de long terme. Nous ne disparaissons pas après la mise en ligne. Nous restons à vos côtés pour suivre les performances, ajuster la stratégie et vous accompagner dans la durée.
        </p>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Parlons de votre projet</h2>
        <p className="mb-8 text-primary-foreground/80">Nous serions ravis d'échanger sur vos besoins et de vous accompagner dans votre transformation digitale.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/contact">Parler de votre projet</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default QuiSommesNous;
