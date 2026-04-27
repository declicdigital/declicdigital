import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, Building2, User, Wrench, ShoppingCart, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { cities } from "@/data/cities";
import imgRefonte from "@/assets/refonte-site-web-avant-apres.webp";
import imgResponsive from "@/assets/site-web-responsive-mobile-artisan.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import imgDev from "@/assets/developpeur-web-code-site-artisan.webp";

const CreationSite = () => (
  <PageLayout>
    <Helmet>
      <title>Création de site internet sur-mesure pour TPE | Déclic Digital Paris</title>
      <meta name="description" content="Site vitrine, e-commerce ou landing page pour TPE et artisans. Design responsive, optimisé SEO, livré en 2 semaines. Devis gratuit en 24h." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/creation-site-web" />
      <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Création de site internet",provider:{"@type":"LocalBusiness",name:"Déclic Digital",url:"https://declicdigital.net"},areaServed:"Île-de-France"})}</script>
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web" }]} />

    {/* ─── Hero : image refonte avec overlap texte ──────────────────────────── */}
    <section className="gradient-hero py-16 md:py-24 overflow-hidden">
      <div className="container">
        <div className="relative">
          {/* Image côté droit en fond */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
            <img src={imgRefonte} alt="Refonte site web avant après - Déclic Digital" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)/0.5) 25%, transparent 60%)" }} />
          </div>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-2xl">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">Création de site internet sur-mesure pour les artisans, TPE et indépendants à Paris</h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Nous concevons des sites modernes, rapides et optimisés <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> pour les TPE et indépendants. Un site bien conçu est votre meilleur outil pour générer des prospects. Découvrez <Link to="/tarifs" className="text-primary font-semibold">nos tarifs</Link> ou demandez un <Link to="/contact" className="text-primary font-semibold">audit SEO gratuit</Link>.
            </p>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-[hsl(263,36%,18%)] font-semibold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ─── Avantages avec texture ───────────────────────────────────────────── */}
    <SectionWrapper>
      <div className="relative rounded-3xl overflow-hidden">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
        <div className="absolute inset-0" style={{ background: "hsl(var(--background)/0.88)" }} />
        <div className="relative z-10 py-8">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Pourquoi votre activité a besoin d'un site web professionnel</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Un site web professionnel ne se limite pas à une simple vitrine en ligne. C'est un outil stratégique qui renforce votre crédibilité, attire de nouveaux clients grâce au <Link to="/referencement-seo" className="text-primary font-semibold">référencement naturel</Link> et vous différencie de vos concurrents.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, title: "Design professionnel", desc: "Une identité visuelle soignée qui inspire confiance dès la première seconde. Vos visiteurs jugent votre entreprise en moins de 3 secondes." },
              { icon: Smartphone, title: "Site responsive", desc: "Plus de 60% du trafic web vient du mobile. Votre site s'adapte parfaitement à tous les écrans : smartphone, tablette et desktop." },
              { icon: TrendingUp, title: "Optimisation SEO", desc: "Le référencement naturel est intégré dès la conception. Structure des pages, balises, vitesse : tout est pensé pour Google." },
              { icon: Zap, title: "Vitesse optimale", desc: "Un site rapide convertit mieux. Nous optimisons chaque élément pour un temps de chargement minimal et une expérience fluide." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-[hsl(263,36%,18%)]">
                  <item.icon size={26} />
                </div>
                <h3 className="mb-2 font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>

    {/* ─── Processus ────────────────────────────────────────────────────────── */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Un site vitrine ou e-commerce adapté à votre métier</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nous avons développé un processus clair et structuré pour vous accompagner du premier échange à la mise en ligne de votre site.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "1. Échange et analyse", desc: "Nous commençons par comprendre votre activité, vos objectifs et votre cible. Cette étape est essentielle pour créer un site adapté." },
          { icon: Monitor, title: "2. Conception et design", desc: "Nous définissons l'arborescence, le design et la structure de votre site. Vous validez chaque étape avant le développement." },
          { icon: Zap, title: "3. Développement", desc: "Nous développons votre site avec les meilleures technologies. Chaque page est optimisée pour le SEO, la vitesse et le mobile." },
          { icon: CheckCircle, title: "4. Mise en ligne et suivi", desc: "Après vos retours et validations, nous mettons votre site en ligne. Nous assurons ensuite un suivi pour garantir ses performances." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-card p-6 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-[hsl(263,36%,18%)]">
              <item.icon size={22} />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* ─── Pour qui ─────────────────────────────────────────────────────────── */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Notre méthode : de la maquette à la mise en ligne</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Nos solutions s'adaptent à tous les profils d'entreprises. Que vous soyez artisan, commerçant, profession libérale ou dirigeant de TPE, nous concevons un site adapté à votre métier et optimisé pour le <Link to="/referencement-seo" className="text-primary font-semibold">référencement Google</Link>.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Building2, title: "TPE", desc: "Développez votre présence en ligne et positionnez-vous comme un acteur de référence dans votre secteur." },
          { icon: User, title: "Indépendants", desc: "Présentez vos services de manière professionnelle et générez des prises de contact qualifiées." },
          { icon: Wrench, title: "Artisans", desc: "Attirez des clients locaux grâce à un site optimisé pour le référencement local et Google Maps." },
          { icon: ShoppingCart, title: "E-commerce", desc: "Vendez vos produits en ligne avec un site sécurisé, rapide et pensé pour la conversion." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl bg-background p-5 shadow-card">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-miami text-[hsl(263,36%,18%)]">
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

    {/* ─── SEO : image développeur overlap côté gauche ──────────────────────── */}
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="relative">
          {/* Image développeur côté gauche */}
          <div className="hidden lg:block absolute left-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
            <img src={imgDev} alt="Développeur web code site artisan - Déclic Digital" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background)/0.4) 30%, transparent 65%)" }} />
          </div>
          {/* Texte depuis la droite */}
          <div className="relative z-10 ml-auto max-w-2xl space-y-6 py-8">
            <h2 className="text-3xl font-extrabold md:text-4xl">Site web rapide, mobile et optimisé pour Google</h2>
            <p className="text-muted-foreground leading-relaxed">
              Un bon site web pour une TPE, c'est avant tout un site qui remplit son objectif : attirer des visiteurs et les convertir en clients. Il ne suffit pas d'avoir un site "joli". Il doit être rapide, bien structuré, adapté aux mobiles et surtout visible sur Google.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Chaque page doit être pensée pour répondre à une intention de recherche précise. C'est le rôle du <Link to="/referencement-seo" className="text-primary font-semibold">référencement naturel</Link>, et c'est ce que nous intégrons dès la conception de chaque projet.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nos sites incluent systématiquement : un design professionnel sur mesure, une <Link to="/referencement-seo" className="text-primary font-semibold">optimisation SEO complète</Link>, une compatibilité mobile parfaite, une vitesse de chargement optimisée, et un formulaire de contact pour capturer vos prospects. Consultez <Link to="/tarifs" className="text-primary font-semibold">nos tarifs</Link> pour en savoir plus.
            </p>
            {/* Image responsive avec effet hover */}
            <div className="relative overflow-hidden rounded-2xl shadow-card group">
              <img src={imgResponsive} alt="Site web responsive mobile artisan - Déclic Digital" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
              {/* Citation overlay au survol */}
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6">
                <p className="text-white font-semibold text-sm">+70% des recherches locales se font sur mobile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ─── Contenu SEO texte ────────────────────────────────────────────────── */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Création de site web pour artisan à Paris : pourquoi c'est indispensable</h2>
        <p className="text-muted-foreground leading-relaxed">
          En tant qu'artisan ou indépendant à Paris, votre visibilité en ligne détermine directement votre volume de clients. 97% des consommateurs recherchent un professionnel local sur internet avant de le contacter. Sans site web, vous êtes invisible pour cette audience. Avec un site bien conçu et optimisé pour le <Link to="/referencement-seo" className="text-primary font-semibold">référencement local</Link>, vous captez des demandes de devis chaque semaine.
        </p>
        <h3 className="text-xl font-bold">Un site vitrine qui inspire confiance et génère des contacts</h3>
        <p className="text-muted-foreground leading-relaxed">
          Votre site web est votre vitrine 24h/24. Il doit présenter clairement vos services, afficher vos réalisations, et faciliter la prise de contact. Nous concevons chaque site avec un objectif commercial précis : transformer les visiteurs en prospects qualifiés. Formulaire de contact, bouton d'appel, témoignages clients — chaque élément est pensé pour la conversion.
        </p>
        <h3 className="text-xl font-bold">Technologies modernes pour des performances optimales</h3>
        <p className="text-muted-foreground leading-relaxed">
          Nous utilisons les technologies les plus adaptées selon votre projet : WordPress pour les sites éditoriaux, Shopify pour le e-commerce, ou des solutions sur-mesure pour les besoins spécifiques. Quel que soit l'outil, nous garantissons un site rapide (score PageSpeed supérieur à 90), sécurisé (HTTPS), et conforme aux standards d'accessibilité. Consultez nos <Link to="/realisations" className="text-primary font-semibold">réalisations récentes</Link> pour voir des exemples concrets.
        </p>
        <h3 className="text-xl font-bold">Combien coûte la création d'un site internet pour une TPE ?</h3>
        <p className="text-muted-foreground leading-relaxed">
          Chez Déclic Digital, nous proposons des <Link to="/tarifs" className="text-primary font-semibold">tarifs adaptés aux budgets des TPE</Link> : une landing page dès 200€ de mise en service + 50€/mois, un site vitrine complet dès 590€ + 50€/mois. Ces forfaits incluent le design, le développement, l'hébergement, la maintenance et l'optimisation SEO de base. Vous avez une question ? Consultez <Link to="/faq" className="text-primary font-semibold">notre FAQ</Link> ou <Link to="/rendez-vous" className="text-primary font-semibold">prenez rendez-vous</Link>.
        </p>
      </div>
    </SectionWrapper>

    {/* ─── Villes ───────────────────────────────────────────────────────────── */}
    <SectionWrapper>
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">Création de site internet à Paris et dans les Hauts-de-Seine</h2>
      <p className="text-center text-muted-foreground mb-8">
        Nous intervenons à Paris et dans les Hauts-de-Seine pour la <Link to="/nos-villes" className="text-primary font-semibold">création de sites web professionnels</Link>.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {cities.slice(0, 12).map((c) => (
          <Link key={c.slug} to={`/creation-site-web/${c.slug}`} className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Site web {c.nameShort}
          </Link>
        ))}
        <Link to="/nos-villes" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-4 py-2 text-sm font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
          Voir toutes les villes →
        </Link>
      </div>
    </SectionWrapper>

    <GoogleReviewsSection compact maxReviews={3} />
    <LocationSection />

    {/* ─── CTA avec texture ─────────────────────────────────────────────────── */}
    <section className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 flex flex-col items-center text-center">
        <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital et Expert Produit Google" className="w-16 h-16 rounded-full object-cover border-2 border-[hsl(263,36%,18%)]/30 shadow-lg mb-3" loading="lazy" />
        <p className="text-sm font-semibold text-[hsl(263,36%,18%)] mb-2">Geoffrey, Expert Produit Google</p>
        <h2 className="mb-4 text-3xl font-extrabold ">Prêt à lancer votre site web ?</h2>
        <p className="mb-8 text-muted-foreground max-w-xl">Demandez un devis gratuit pour la création de votre site web professionnel. Réponse sous 24h.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-semibold text-[hsl(263,36%,18%)] shadow-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Link to="/faq" className="inline-flex items-center justify-center rounded-full border-2 border-[hsl(263,36%,18%)] bg-transparent px-8 py-3 font-semibold text-[hsl(263,36%,18%)] hover:bg-[hsl(263,36%,18%)/0.1] transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default CreationSite;
