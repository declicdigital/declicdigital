import { motion } from "framer-motion";
import { Search, FileText, Users, Lightbulb, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroAudit from "@/assets/hero-audit.png";

const AuditSeo = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              100% gratuit · Sans engagement
            </span>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Recevez votre <span className="text-gradient">audit SEO gratuit</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Découvrez pourquoi votre site n'apparaît pas sur Google et comment améliorer votre visibilité.
            </p>
            <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <a href="#formulaire-audit">Demander mon audit SEO</a>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroAudit} alt="Audit SEO gratuit" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Contenu audit */}
    <SectionWrapper className="bg-card">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl">Ce que contient votre audit</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Analyse SEO technique", desc: "Performance, vitesse, erreurs techniques de votre site." },
          { icon: FileText, title: "Analyse des mots clés", desc: "Positionnement actuel et opportunités de mots clés." },
          { icon: Users, title: "Analyse concurrentielle", desc: "Comparaison avec vos concurrents directs." },
          { icon: Lightbulb, title: "Recommandations concrètes", desc: "Actions prioritaires pour améliorer votre visibilité." },
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

    {/* Formulaire */}
    <SectionWrapper id="formulaire-audit">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-8 text-center text-3xl font-extrabold">Demandez votre audit gratuit</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Votre nom" className="rounded-xl" required />
          <Input placeholder="Nom de votre entreprise" className="rounded-xl" required />
          <Input placeholder="URL de votre site web" type="url" className="rounded-xl" required />
          <Input placeholder="Votre email" type="email" className="rounded-xl" required />
          <Textarea placeholder="Votre message (optionnel)" className="rounded-xl min-h-[100px]" />
          <Button type="submit" size="lg" className="w-full gradient-primary rounded-full text-primary-foreground font-semibold shadow-lg hover:opacity-90">
            <CheckCircle size={18} className="mr-2" /> Recevoir mon audit SEO gratuit
          </Button>
        </form>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default AuditSeo;
