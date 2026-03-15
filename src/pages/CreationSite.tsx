import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, Building2, User, Wrench, ShoppingCart, CheckCircle, Search, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroCreation from "@/assets/screenshot-declic-digital.png";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";
import { cities } from "@/data/cities";

const CreationSite = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Création de site web à Paris qui <span className="text-gradient">attire des clients</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Nous concevons des sites modernes, rapides et optimisés <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">SEO</Link> pour les PME et indépendants. Un site bien conçu est votre meilleur outil pour générer des prospects. Découvrez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou demandez un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link>.
            </p>
            <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <Link to="/contact">Devis création de site</Link>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroCreation} alt="Création de site internet professionnel pour PME" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Avantages */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Les avantages d'un site professionnel</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Un site web professionnel ne se limite pas à une simple vitrine en ligne. C'est un outil stratégique qui renforce votre crédibilité, attire de nouveaux clients grâce au <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement naturel</Link> et vous différencie de vos concurrents.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Monitor, title: "Design professionnel", desc: "Une identité visuelle soignée qui inspire confiance dès la première seconde. Vos visiteurs jugent votre entreprise en moins de 3 secondes." },
          { icon: Smartphone, title: "Site responsive", desc: "Plus de 60% du trafic web vient du mobile. Votre site s'adapte parfaitement à tous les écrans : smartphone, tablette et desktop." },
          { icon: TrendingUp, title: "Optimisation SEO", desc: "Le référencement naturel est intégré dès la conception. Structure des pages, balises, vitesse : tout est pensé pour Google." },
          { icon: Zap, title: "Vitesse optimale", desc: "Un site rapide convertit mieux. Nous optimisons chaque élément pour un temps de chargement minimal et une expérience fluide." },
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

    {/* Comment se déroule la création */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Comment se déroule la création de votre site</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nous avons développé un processus clair et structuré pour vous accompagner du premier échange à la mise en ligne de votre site.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "1. Échange et analyse", desc: "Nous commençons par comprendre votre activité, vos objectifs et votre cible. Cette étape est essentielle pour créer un site adapté." },
          { icon: Monitor, title: "2. Maquette et design", desc: "Nous créons une maquette visuelle de votre site. Vous validez le design avant le développement pour être sûr du résultat." },
          { icon: Zap, title: "3. Développement", desc: "Nous développons votre site avec les meilleures technologies. Chaque page est optimisée pour le SEO, la vitesse et le mobile." },
          { icon: CheckCircle, title: "4. Mise en ligne et suivi", desc: "Après vos retours et validations, nous mettons votre site en ligne. Nous assurons ensuite un suivi pour garantir ses performances." },
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

    {/* Pour qui */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Pour qui ?</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nos solutions s'adaptent à tous les profils d'entreprises. Que vous soyez artisan, commerçant, profession libérale ou dirigeant de PME, nous concevons un site adapté à votre métier.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Building2, title: "PME", desc: "Développez votre présence en ligne et positionnez-vous comme un acteur de référence dans votre secteur." },
          { icon: User, title: "Indépendants", desc: "Présentez vos services de manière professionnelle et générez des prises de contact qualifiées." },
          { icon: Wrench, title: "Artisans", desc: "Attirez des clients locaux grâce à un site optimisé pour le référencement local et Google Maps." },
          { icon: ShoppingCart, title: "E-commerce", desc: "Vendez vos produits en ligne avec un site sécurisé, rapide et pensé pour la conversion." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl bg-background p-5 shadow-card">
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

    {/* Contenu SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Qu'est-ce qu'un bon site web pour une PME ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Un bon site web pour une PME, c'est avant tout un site qui remplit son objectif : attirer des visiteurs et les convertir en clients. Il ne suffit pas d'avoir un site "joli". Il doit être rapide, bien structuré, adapté aux mobiles et surtout visible sur Google.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Chaque page doit être pensée pour répondre à une intention de recherche précise. Par exemple, si vous êtes plombier à Bordeaux, votre site doit apparaître quand un internaute tape "plombier Bordeaux" dans Google. C'est le rôle du <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement naturel</Link>, et c'est ce que nous intégrons dès la conception de chaque projet.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Chez Déclic Digital, nous créons des sites orientés résultats. Cela signifie que chaque élément, le design, les textes, les appels à l'action, la navigation, est conçu pour maximiser vos chances de transformer un visiteur en prospect. Nous ne livrons pas simplement un site, nous livrons un outil commercial.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Nos sites incluent systématiquement : un design professionnel sur mesure, une <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">optimisation SEO complète</Link>, une compatibilité mobile parfaite, une vitesse de chargement optimisée, et un formulaire de contact pour capturer vos prospects. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> pour en savoir plus.
        </p>
      </div>
    </SectionWrapper>

    {/* Villes maillage */}
    <SectionWrapper className="bg-card">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
        Création de site web par ville
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        Nous intervenons à Paris et dans les Hauts-de-Seine pour la <Link to="/nos-villes" className="text-primary font-semibold hover:underline">création de sites web professionnels</Link>.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {cities.slice(0, 12).map((c) => (
          <Link
            key={c.slug}
            to={`/creation-site-web/${c.slug}`}
            className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
          >
            Site web {c.nameShort}
          </Link>
        ))}
        <Link
          to="/nos-villes"
          className="rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Voir toutes les villes →
        </Link>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container flex flex-col items-center text-center">
        <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital et Expert Produit Google" className="w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30 shadow-lg mb-3" />
        <p className="text-sm font-semibold text-primary-foreground mb-2">Geoffrey, Expert Produit Google</p>
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Prêt à lancer votre projet ?</h2>
        <p className="mb-8 text-primary-foreground/80">Demandez un devis gratuit et sans engagement pour la création de votre site web.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
            <Link to="/contact">Devis création de site</Link>
          </Button>
          <Link to="/faq" className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default CreationSite;
