import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Search, BarChart3, Zap, Eye, Users, TrendingUp, ChevronRight, Star, Monitor, Smartphone, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroDashboard from "@/assets/hero-dashboard.png";
import { useState } from "react";

const testimonials = [
  { name: "Sophie Martin", role: "Gérante, Salon de coiffure", text: "Nous avions un site qui ne générait aucun contact. Après la refonte et le SEO, nous recevons plusieurs demandes par semaine." },
  { name: "Thomas Durand", role: "Artisan plombier", text: "Je n'avais aucune présence en ligne. Déclic Digital m'a créé un site qui apparaît en première page Google sur ma ville." },
  { name: "Marie Lefèvre", role: "E-commerce bijoux", text: "Mon trafic a doublé en 3 mois. Les commandes arrivent naturellement grâce au référencement." },
  { name: "Pierre Moreau", role: "Cabinet comptable", text: "Un investissement rentabilisé en quelques mois. Nous recevons des demandes de devis chaque semaine." },
  { name: "Julie Bernard", role: "Coach sportif", text: "Mon ancien site était invisible. Aujourd'hui, 80% de mes clients me trouvent via Google." },
  { name: "François Petit", role: "Restaurant", text: "Depuis la refonte, nos réservations en ligne ont augmenté de 60%. Le site est moderne et rapide." },
  { name: "Isabelle Roux", role: "Agence immobilière", text: "L'équipe a su comprendre nos besoins. Le site est professionnel et génère des contacts qualifiés." },
  { name: "Marc Dubois", role: "Consultant IT", text: "Je recommande Déclic Digital. Approche méthodique, résultats concrets et suivi régulier." },
  { name: "Caroline Simon", role: "Fleuriste", text: "Un site magnifique qui reflète parfaitement mon activité. Les clients me disent souvent qu'ils m'ont trouvée sur Google." },
  { name: "Laurent Garcia", role: "PME industrielle", text: "Notre visibilité a considérablement augmenté. L'audit SEO initial nous a ouvert les yeux sur nos lacunes." },
];

const techLogos = ["WordPress", "Shopify", "Lovable", "Base44", "Claude AI", "Semrush", "Google Analytics", "Search Console"];

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => setCurrentTestimonial((p) => (p + 2 >= testimonials.length ? 0 : p + 2));
  const prevTestimonial = () => setCurrentTestimonial((p) => (p - 2 < 0 ? testimonials.length - 2 : p - 2));

  return (
    <PageLayout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence digitale spécialisée PME
              </span>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                Un site web qui vous apporte des{" "}
                <span className="text-gradient">clients</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Déclic Digital aide les PME et petites entreprises à obtenir plus de visibilité et plus de prospects grâce à la création de sites performants et au référencement SEO.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
                  <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
                  <Link to="/contact">Obtenir un devis gratuit</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <img src={heroDashboard} alt="Dashboard SEO professionnel" className="w-full max-w-lg drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problème */}
      <SectionWrapper className="bg-card">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-extrabold md:text-4xl">
            Pourquoi votre site ne vous apporte pas de clients ?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 mt-8">
            {[
              { icon: Eye, text: "Site invisible sur Google" },
              { icon: Users, text: "Mauvaise expérience utilisateur" },
              { icon: Search, text: "Absence de stratégie SEO" },
              { icon: Gauge, text: "Site trop lent" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-secondary p-5 text-left shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <item.icon size={22} />
                </div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="gradient-primary mt-10 rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
            <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Solutions */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Notre mission : transformer votre site en{" "}
            <span className="text-gradient">machine à clients</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Monitor, title: "Création de site web", desc: "Sites modernes optimisés conversion et expérience utilisateur." },
            { icon: TrendingUp, title: "Référencement SEO", desc: "Amélioration du positionnement Google pour attirer des clients." },
            { icon: BarChart3, title: "Stratégie digitale", desc: "Accompagnement pour développer votre visibilité en ligne." },
          ].map((s, i) => (
            <div key={i} className="group rounded-2xl bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                <s.icon size={26} />
              </div>
              <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
              <Link to={i === 0 ? "/creation-site-web" : i === 1 ? "/referencement-seo" : "/contact"} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                En savoir plus <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Technologies */}
      <SectionWrapper className="bg-card">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl mb-4">Nos outils et technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous utilisons des outils professionnels pour créer des sites performants et optimisés SEO.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {techLogos.map((t) => (
            <div key={t} className="rounded-xl bg-secondary px-6 py-4 text-sm font-semibold text-foreground shadow-card">
              {t}
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Processus */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">Comment nous travaillons</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { step: "1", title: "Audit", desc: "Analyse de votre situation actuelle" },
            { step: "2", title: "Stratégie", desc: "Définition du plan d'action" },
            { step: "3", title: "Création", desc: "Design et développement du site" },
            { step: "4", title: "SEO", desc: "Optimisation du référencement" },
            { step: "5", title: "Suivi", desc: "Amélioration continue" },
          ].map((p, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-miami text-primary-foreground text-lg font-bold">
                {p.step}
              </div>
              <h3 className="mb-1 font-bold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
            <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Témoignages */}
      <SectionWrapper className="bg-card">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">Ce que disent nos clients</h2>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.slice(currentTestimonial, currentTestimonial + 2).map((t, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card">
                <div className="mb-3 flex gap-1 text-accent">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-4 text-muted-foreground italic">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={prevTestimonial} className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Précédent">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button onClick={nextTestimonial} className="rounded-full bg-secondary p-2 hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Suivant">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Final */}
      <section className="gradient-miami py-16 md:py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Et si votre site devenait votre meilleur commercial ?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              Un site optimisé peut générer des prospects tous les jours.
            </p>
            <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
              <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
