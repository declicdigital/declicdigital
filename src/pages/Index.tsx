import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Search, BarChart3, Zap, Eye, Users, TrendingUp, ChevronRight, Monitor, Smartphone, Gauge, CheckCircle, Shield, Clock, Target, Award, MessageSquare, Phone as PhoneIcon, FileText, Rocket, Star } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroDashboard from "@/assets/tableau-bord-seo-professionnel.png";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";


const techLogos = ["WordPress", "Shopify", "Lovable", "Base44", "Claude AI", "Semrush", "Google Analytics", "Search Console"];

const Index = () => {
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
              <span className="mb-4 inline-block rounded-full bg-brand-violet/10 px-4 py-1.5 text-xs font-semibold text-brand-violet">
                Expert Produit Google · Agence digitale
              </span>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                Création de site web à Paris qui vous apporte des{" "}
                <span className="text-gradient">clients</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Votre entreprise mérite d'être trouvée sur Google. Geoffrey, Expert Produit Google, et son équipe créent des <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">sites performants</Link> et optimisés <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">SEO</Link> pour que les PME et indépendants attirent enfin les bons clients, en toute simplicité et sans budget démesuré.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
                </Button>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-foreground hover:bg-secondary transition-colors">
                  Devis création de site
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <img src={heroDashboard} alt="Tableau de bord SEO professionnel pour PME" className="w-full max-w-lg drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Problème */}
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-extrabold md:text-4xl">
            Pourquoi votre site ne vous apporte pas de clients ?
          </h2>
          <p className="mb-8 text-muted-foreground max-w-2xl mx-auto">
            De nombreuses PME investissent dans un site web, mais celui-ci reste invisible sur Google. Sans stratégie de <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement</Link>, sans optimisation technique et sans contenu adapté, votre site ne peut pas attirer de visiteurs qualifiés. Résultat : zéro contact, zéro prospect, zéro retour sur investissement.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-8">
            {[
              { icon: Eye, text: "Site invisible sur Google", detail: "93% des expériences en ligne commencent par un moteur de recherche. Si votre site n'apparaît pas, vos clients vont chez vos concurrents." },
              { icon: Users, text: "Mauvaise expérience utilisateur", detail: "Un site lent, non adapté mobile ou difficile à naviguer fait fuir les visiteurs en quelques secondes." },
              { icon: Search, text: "Absence de stratégie SEO", detail: "Sans optimisation des mots clés, des balises et du contenu, Google ne peut pas comprendre ni classer votre site." },
              { icon: Gauge, text: "Site trop lent", detail: "Un temps de chargement supérieur à 3 secondes augmente le taux de rebond de plus de 50%." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-secondary p-5 text-left shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <item.icon size={22} />
                </div>
                <div>
                  <span className="font-semibold block">{item.text}</span>
                  <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="gradient-primary btn-glow mt-10 rounded-full px-8 text-white font-semibold shadow-glow">
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
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Chez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">Déclic Digital</Link>, nous ne créons pas simplement des sites web. Nous concevons des outils de génération de clients, pensés pour les PME et optimisés pour Google. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> adaptés aux petits budgets.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Monitor, title: "Création de site web", desc: "Nous concevons des sites modernes, rapides et responsive, optimisés pour la conversion et l'expérience utilisateur. Chaque site est pensé pour guider vos visiteurs vers l'action.", link: "/creation-site-web" },
            { icon: TrendingUp, title: "Référencement SEO", desc: "Le SEO est le levier le plus rentable pour attirer des clients. Nous optimisons votre site pour apparaître en première page Google sur les mots clés de vos prospects.", link: "/referencement-seo" },
            { icon: BarChart3, title: "Stratégie digitale", desc: "Analyse de marché, positionnement, contenu, suivi des performances : chaque action est mesurée et orientée résultats pour développer votre visibilité.", link: "/contact" },
          ].map((s, i) => (
            <div key={i} className="group rounded-2xl bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                <s.icon size={26} />
              </div>
              <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              <Link to={s.link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                En savoir plus <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Notre méthode */}
      <SectionWrapper className="bg-section-blue">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">Notre méthode</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et transparent pour vous accompagner de A à Z. Découvrez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre équipe</Link> et <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { step: "1", icon: MessageSquare, title: "Formulaire", desc: "Remplissez notre formulaire de contact pour nous décrire votre projet et vos objectifs." },
            { step: "2", icon: PhoneIcon, title: "Rendez-vous", desc: "Nous échangeons par téléphone pour comprendre vos besoins, votre marché et vos attentes." },
            { step: "3", icon: FileText, title: "Proposition", desc: "Nous vous présentons une solution adaptée à votre activité, vos objectifs et votre budget." },
            { step: "4", icon: Rocket, title: "Création", desc: "Nous concevons et mettons en ligne votre site optimisé SEO, prêt à attirer des clients." },
            { step: "5", icon: BarChart3, title: "Suivi", desc: "Nous suivons les performances et optimisons en continu pour maximiser vos résultats." },
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
          <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
            <Link to="/contact">Démarrer mon projet</Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Avis clients Google */}
      <GoogleReviewsSection />

      {/* Pourquoi un site web est essentiel */}
      <SectionWrapper>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl">Pourquoi un site web est essentiel pour votre entreprise</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "Disponible 24h/24", desc: "Contrairement à un commerce physique, votre site travaille pour vous en permanence. Vos prospects peuvent vous découvrir et vous contacter à tout moment." },
              { icon: Target, title: "Attirez des clients ciblés", desc: "Un site bien référencé attire des visiteurs qui recherchent activement vos services. Ce sont des prospects qualifiés prêts à passer à l'action." },
              { icon: Shield, title: "Renforcez votre crédibilité", desc: "En 2026, ne pas avoir de site web professionnel peut nuire à votre image. Un site soigné rassure vos prospects." },
              { icon: TrendingUp, title: "Rentabilité sur le long terme", desc: "Contrairement à la publicité payante, le référencement naturel génère du trafic durable sans coût par clic." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-primary-foreground">
                  <item.icon size={22} />
                </div>
                <h3 className="mb-2 font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Technologies */}
      <SectionWrapper className="bg-section-blue">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl mb-4">Nos outils et technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous utilisons des outils professionnels reconnus pour <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">créer des sites performants</Link> et optimisés <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">SEO</Link>.
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


      {/* Maillage interne */}
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Explorez nos services</h2>
          <p className="text-muted-foreground mb-6">Découvrez l'ensemble de nos prestations pour développer votre présence en ligne.</p>
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
            <Link to="/qui-sommes-nous" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Qui sommes-nous
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

      {/* Formulaire de contact */}
      <SectionWrapper>
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl">Parlez-nous de votre projet</h2>
            <p className="mt-4 text-muted-foreground">
              Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de votre site web</Link>.
            </p>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Votre nom" className="rounded-xl" required />
              <Input placeholder="Nom de votre entreprise" className="rounded-xl" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Votre email" type="email" className="rounded-xl" required />
              <Input placeholder="Votre téléphone" type="tel" className="rounded-xl" />
            </div>
            <Input placeholder="URL de votre site web (si existant)" type="url" className="rounded-xl" />
            <Textarea placeholder="Décrivez votre projet..." className="rounded-xl min-h-[120px]" required />
            <Button type="submit" size="lg" className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
              <CheckCircle size={18} className="mr-2" /> Envoyer ma demande
            </Button>
          </form>
        </div>
      </SectionWrapper>

      {/* CTA Final */}
      <section className="gradient-miami py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital et Expert Produit Google" className="w-20 h-20 rounded-full object-cover border-2 border-primary-foreground/30 shadow-lg mb-4" />
            <p className="text-sm font-semibold text-primary-foreground mb-1">Geoffrey, Expert Produit Google</p>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Et si votre site devenait votre meilleur commercial ?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl">
              Un site optimisé peut générer des prospects tous les jours. Ne laissez plus vos concurrents capter les clients qui vous cherchent sur Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
                <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
              </Button>
              <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
                Voir nos tarifs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
