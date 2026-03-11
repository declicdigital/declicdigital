import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, Settings, FileText, BarChart3, Target, Shield, Lightbulb, Globe } from "lucide-react";
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
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Le référencement SEO est le levier le plus rentable pour attirer des clients qualifiés. Nous optimisons votre site pour qu'il apparaisse en première page Google sur les mots clés recherchés par vos prospects. Le SEO, c'est un investissement durable qui travaille pour vous 24h/24.
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
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Les bénéfices du SEO pour les PME</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Le référencement naturel est la stratégie la plus rentable pour développer votre activité en ligne. Contrairement à la publicité payante, les résultats du SEO sont durables et s'amplifient avec le temps.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Eye, title: "Plus de visibilité", desc: "Apparaissez en première page Google sur les requêtes clés de votre activité. 75% des internautes ne consultent jamais la deuxième page." },
          { icon: Users, title: "Trafic qualifié", desc: "Attirez des visiteurs qui recherchent activement vos services. Ce sont des prospects chauds, prêts à passer à l'action." },
          { icon: TrendingUp, title: "Clients réguliers", desc: "Générez des demandes de manière continue et pérenne. Le SEO crée un flux constant de prospects sans coût par clic." },
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

    {/* Qu'est-ce que le SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Qu'est-ce que le référencement SEO ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Le SEO (Search Engine Optimization) regroupe l'ensemble des techniques qui permettent d'améliorer la position de votre site web dans les résultats des moteurs de recherche comme Google. L'objectif est simple : faire en sorte que votre site apparaisse quand vos clients potentiels recherchent vos services.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Le référencement naturel repose sur trois piliers fondamentaux. Le premier est la technique : vitesse de chargement, architecture du site, compatibilité mobile, sécurité HTTPS. Le deuxième est le contenu : des textes pertinents, bien structurés et optimisés pour les mots clés recherchés par votre cible. Le troisième est la popularité : les liens provenant d'autres sites qui renforcent l'autorité de votre domaine aux yeux de Google.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour une PME, le SEO est particulièrement puissant car il permet de rivaliser avec des entreprises plus grandes en se positionnant sur des mots clés locaux ou de niche. Un plombier à Lyon, un coach sportif à Nantes ou un restaurant à Marseille peuvent tous apparaître en première page Google grâce à une stratégie SEO bien menée.
        </p>
      </div>
    </SectionWrapper>

    {/* Méthode */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Notre méthode SEO</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Notre approche est méthodique et transparente. Nous suivons un processus éprouvé pour optimiser votre visibilité sur Google et vous accompagnons à chaque étape.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Audit SEO", desc: "Analyse complète de votre site : technique, contenu, mots clés, concurrence. Nous identifions toutes les opportunités d'amélioration." },
          { icon: Settings, title: "Optimisation technique", desc: "Correction des erreurs techniques, amélioration de la vitesse, optimisation de l'architecture et des balises pour faciliter l'indexation." },
          { icon: FileText, title: "Contenu optimisé", desc: "Création et optimisation de contenus pertinents pour vos mots clés stratégiques. Chaque page est pensée pour répondre à une intention de recherche." },
          { icon: BarChart3, title: "Suivi & rapports", desc: "Rapports réguliers sur l'évolution de votre positionnement, du trafic et des conversions. Ajustements continus pour maximiser les résultats." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-6 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-primary-foreground">
              <item.icon size={22} />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* SEO vs SEA */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">SEO vs publicité payante : pourquoi choisir le référencement naturel ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          La publicité payante (Google Ads, Facebook Ads) peut générer du trafic rapidement, mais elle s'arrête dès que vous coupez le budget. Le SEO, en revanche, est un investissement qui continue de porter ses fruits sur le long terme. Une fois bien positionné, votre site attire des visiteurs gratuitement, jour après jour.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour les PME avec des budgets marketing limités, le SEO est souvent la stratégie la plus rentable. Les premiers résultats apparaissent généralement entre 3 et 6 mois, mais les gains s'accumulent et se renforcent avec le temps. C'est un cercle vertueux : plus votre site est optimisé, plus il attire de trafic, plus Google le considère comme pertinent.
        </p>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Prêt à booster votre visibilité ?</h2>
        <p className="mb-8 text-primary-foreground/80">Recevez un audit gratuit de votre site en 48h et découvrez comment améliorer votre référencement.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default ReferencementSeo;
