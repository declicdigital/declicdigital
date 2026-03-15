import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Search, BarChart3, Zap, Eye, Users, TrendingUp, ChevronRight, Monitor, Smartphone, Gauge, CheckCircle, Shield, Clock, Target, Award, MessageSquare, Phone as PhoneIcon, FileText, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroDashboard from "@/assets/tableau-bord-seo-professionnel.png";

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
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Expert Produit Google · Agence digitale
              </span>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                Un site web qui vous apporte des{" "}
                <span className="text-gradient">clients</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Votre entreprise mérite d'être trouvée sur Google. Déclic Digital crée des sites web qui convertissent et des stratégies SEO qui génèrent des prospects, tous les jours. Fondée par un Expert Produit Google, notre agence est le partenaire digital des PME ambitieuses.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
                  <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
                  <Link to="/contact">Devis création de site</Link>
                </Button>
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
      <SectionWrapper className="bg-card">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-extrabold md:text-4xl">
            Pourquoi votre site ne vous apporte pas de clients ?
          </h2>
          <p className="mb-8 text-muted-foreground max-w-2xl mx-auto">
            De nombreuses PME investissent dans un site web, mais celui-ci reste invisible sur Google. Sans stratégie de référencement, sans optimisation technique et sans contenu adapté, votre site ne peut pas attirer de visiteurs qualifiés. Résultat : zéro contact, zéro prospect, zéro retour sur investissement.
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
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Chez Déclic Digital, nous ne créons pas simplement des sites web. Nous concevons des outils de génération de clients, pensés pour les PME et optimisés pour Google.
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
      <SectionWrapper className="bg-card">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold md:text-4xl">Notre méthode</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et transparent pour vous accompagner de A à Z dans la réussite de votre projet digital.
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
          <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
            <Link to="/contact">Démarrer mon projet</Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Pourquoi un site web est essentiel */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl">Pourquoi un site web est essentiel pour votre entreprise</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Clock, title: "Disponible 24h/24", desc: "Contrairement à un commerce physique, votre site travaille pour vous en permanence. Vos prospects peuvent vous découvrir et vous contacter à tout moment." },
              { icon: Target, title: "Attirez des clients ciblés", desc: "Un site bien référencé attire des visiteurs qui recherchent activement vos services. Ce sont des prospects qualifiés prêts à passer à l'action." },
              { icon: Shield, title: "Renforcez votre crédibilité", desc: "En 2026, ne pas avoir de site web professionnel peut nuire à votre image. Un site soigné rassure vos prospects et vous positionne comme un acteur sérieux." },
              { icon: TrendingUp, title: "Rentabilité sur le long terme", desc: "Contrairement à la publicité payante, le référencement naturel génère du trafic durable. Une fois bien positionné, votre site attire des visiteurs sans coût supplémentaire." },
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
      <SectionWrapper className="bg-card">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl mb-4">Nos outils et technologies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous utilisons des outils professionnels reconnus pour créer des sites performants et optimisés SEO.
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

      {/* Avis clients */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl">Ce que disent nos clients</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Des PME et indépendants qui nous ont fait confiance pour leur site web et leur référencement SEO.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-5xl overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[
              { name: "Sophie L.", activity: "Ostéopathe", text: "Mon ancien site ne générait aucun contact. Depuis la refonte avec Déclic Digital, je reçois 3 à 5 demandes par semaine via Google." },
              { name: "Marc D.", activity: "Plombier", text: "En 3 mois, mon site est passé en première page Google sur mes mots clés principaux. Les appels ont doublé." },
              { name: "Julie R.", activity: "Boulangerie artisanale", text: "Un site magnifique, livré rapidement et parfaitement adapté à mon activité. Mes clients adorent commander en ligne." },
              { name: "Thomas B.", activity: "Coach sportif", text: "Déclic Digital a compris mon besoin dès le premier échange. Le site est pro, rapide et les inscriptions ont explosé." },
              { name: "Nadia K.", activity: "Architecte d'intérieur", text: "Le portfolio en ligne m'a permis de décrocher des projets que je n'aurais jamais eus sans visibilité web." },
              { name: "Pierre M.", activity: "Restaurant", text: "Grâce au référencement local, on apparaît en premier sur Google Maps. La fréquentation a augmenté de 40%." },
              { name: "Camille F.", activity: "Formatrice", text: "Le site vitrine et le blog m'apportent une crédibilité énorme auprès de mes prospects. Investissement très rentable." },
              { name: "Antoine G.", activity: "Électricien", text: "Service réactif, prix très correct pour une PME. Mon site me ramène des chantiers toutes les semaines." },
              { name: "Émilie S.", activity: "Boutique déco", text: "La boutique e-commerce fonctionne parfaitement. Le SEO nous amène des clients qu'on n'aurait jamais touchés autrement." },
              { name: "David P.", activity: "Avocat", text: "Un site sobre, professionnel et bien référencé. Exactement ce qu'il me fallait pour inspirer confiance à mes clients." },
              { name: "Sophie L.", activity: "Ostéopathe", text: "Mon ancien site ne générait aucun contact. Depuis la refonte avec Déclic Digital, je reçois 3 à 5 demandes par semaine via Google." },
              { name: "Marc D.", activity: "Plombier", text: "En 3 mois, mon site est passé en première page Google sur mes mots clés principaux. Les appels ont doublé." },
              { name: "Julie R.", activity: "Boulangerie artisanale", text: "Un site magnifique, livré rapidement et parfaitement adapté à mon activité. Mes clients adorent commander en ligne." },
              { name: "Thomas B.", activity: "Coach sportif", text: "Déclic Digital a compris mon besoin dès le premier échange. Le site est pro, rapide et les inscriptions ont explosé." },
              { name: "Nadia K.", activity: "Architecte d'intérieur", text: "Le portfolio en ligne m'a permis de décrocher des projets que je n'aurais jamais eus sans visibilité web." },
            ].map((review, i) => (
              <div key={i} className="min-w-[320px] max-w-[360px] shrink-0 rounded-2xl bg-card p-6 shadow-card border border-border">
                <div className="flex items-center gap-1 mb-3 text-primary">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.activity}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Fiche Google CTA */}
        <div className="mt-10 mx-auto max-w-md text-center">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">Retrouvez notre fiche et nos avis vérifiés sur Google.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://share.google/8Ifh8V9cpPGinQXkY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block gradient-primary rounded-full px-6 py-2.5 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity text-sm"
              >
                Voir notre fiche Google
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Formulaire de contact */}
      <SectionWrapper className="bg-card">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl">Parlez-nous de votre projet</h2>
            <p className="mt-4 text-muted-foreground">
              Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la création de votre site web.
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
            <Button type="submit" size="lg" className="w-full gradient-primary rounded-full text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <CheckCircle size={18} className="mr-2" /> Envoyer ma demande
            </Button>
          </form>
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
              Un site optimisé peut générer des prospects tous les jours. Ne laissez plus vos concurrents capter les clients qui vous cherchent sur Google.
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
