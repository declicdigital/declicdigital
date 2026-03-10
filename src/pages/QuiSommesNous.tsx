import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Target, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroAbout from "@/assets/hero-about.png";

const QuiSommesNous = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              L'histoire de <span className="text-gradient">Déclic Digital</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Une agence fondée par la passion du web et la conviction que chaque entreprise mérite d'être visible.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroAbout} alt="L'équipe Déclic Digital" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Storytelling */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Déclic Digital</strong> a été fondé par <strong className="text-foreground">Geoffrey</strong>, 28 ans, diplômé d'une licence en marketing digital et intelligence artificielle.
        </p>
        <p>
          Passionné par le web depuis plus de 8 ans, il a commencé en aidant son père à développer la visibilité de son entreprise de BTP. Puis il a accompagné un artiste dans la création de son site internet.
        </p>
        <p>
          Ces expériences lui ont donné une conviction :
        </p>
        <blockquote className="border-l-4 border-primary pl-6 py-2 text-xl font-semibold text-foreground italic">
          "Les petites entreprises ont besoin d'outils simples et efficaces pour trouver des clients en ligne."
        </blockquote>
        <p>
          Aujourd'hui, Déclic Digital accompagne les PME et indépendants partout en France.
        </p>
      </div>
    </SectionWrapper>

    {/* Mission */}
    <SectionWrapper className="bg-card">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl">Notre mission</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {[
          { icon: Heart, title: "Passion", desc: "Le web est notre métier et notre passion depuis toujours." },
          { icon: Target, title: "Résultats", desc: "Chaque action est orientée vers la génération de clients." },
          { icon: Rocket, title: "Accessibilité", desc: "Des solutions adaptées aux budgets des PME." },
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

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Parlons de votre projet</h2>
        <p className="mb-8 text-primary-foreground/80">Nous serions ravis d'échanger sur vos besoins.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/contact">Parler de votre projet</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default QuiSommesNous;
