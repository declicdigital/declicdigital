import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, Building2, User, Wrench, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroCreation from "@/assets/hero-creation-site.png";

const CreationSite = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Créez un site web qui <span className="text-gradient">attire des clients</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Nous concevons des sites modernes, rapides et optimisés SEO pour les PME et indépendants.
            </p>
            <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <Link to="/contact">Devis création de site</Link>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroCreation} alt="Création de site web professionnel" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Avantages */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">Les avantages d'un site professionnel</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Monitor, title: "Design professionnel", desc: "Une identité visuelle qui inspire confiance." },
          { icon: Smartphone, title: "Site responsive", desc: "Parfaitement adapté mobile, tablette et desktop." },
          { icon: TrendingUp, title: "Optimisation SEO", desc: "Référencement intégré dès la conception." },
          { icon: Zap, title: "Vitesse rapide", desc: "Temps de chargement optimisé pour convertir." },
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

    {/* Pour qui */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">Pour qui ?</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Building2, title: "PME", desc: "Développez votre présence en ligne." },
          { icon: User, title: "Indépendants", desc: "Présentez vos services efficacement." },
          { icon: Wrench, title: "Artisans", desc: "Attirez des clients locaux." },
          { icon: ShoppingCart, title: "E-commerce", desc: "Vendez vos produits en ligne." },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-card">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-miami text-primary-foreground">
              <item.icon size={22} />
            </div>
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Prêt à lancer votre projet ?</h2>
        <p className="mb-8 text-primary-foreground/80">Demandez un devis gratuit et sans engagement.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/contact">Devis création de site</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default CreationSite;
