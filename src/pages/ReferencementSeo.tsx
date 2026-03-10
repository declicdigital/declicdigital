import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, Settings, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroSeo from "@/assets/hero-seo.png";

const ReferencementSeo = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Soyez <span className="text-gradient">visible sur Google</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Le référencement SEO permet d'attirer des clients qui recherchent vos services. Développez votre visibilité durablement.
            </p>
            <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroSeo} alt="Référencement SEO Google" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Bénéfices */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">Les bénéfices du SEO</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Eye, title: "Plus de visibilité", desc: "Apparaissez en première page des résultats Google." },
          { icon: Users, title: "Trafic qualifié", desc: "Attirez des visiteurs qui recherchent vos services." },
          { icon: TrendingUp, title: "Clients réguliers", desc: "Générez des demandes de manière continue et pérenne." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-8 shadow-card text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
              <item.icon size={26} />
            </div>
            <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* Méthode */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">Notre méthode SEO</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Audit SEO", desc: "Analyse complète de votre site et positionnement." },
          { icon: Settings, title: "Optimisation technique", desc: "Correction des erreurs et amélioration de la performance." },
          { icon: FileText, title: "Contenu optimisé", desc: "Création de contenus pertinents pour vos mots clés." },
          { icon: BarChart3, title: "Suivi des performances", desc: "Rapports réguliers et ajustements continus." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-card p-6 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-primary-foreground">
              <item.icon size={22} />
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
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Prêt à booster votre visibilité ?</h2>
        <p className="mb-8 text-primary-foreground/80">Recevez un audit gratuit de votre site en 48h.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ReferencementSeo;
