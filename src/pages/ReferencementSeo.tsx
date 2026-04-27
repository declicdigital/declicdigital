import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { ChevronDown, CheckCircle2, Building2, Hammer, Laptop } from "lucide-react";
import { cities } from "@/data/cities";
import heroSeo from "@/assets/seo-hero-businessman.webp";
import seoDashboard from "@/assets/seo-dashboard-analytics.webp";

const stats = [
  { num: "93%", label: "des expériences en ligne commencent par un moteur de recherche" },
  { num: "0€", label: "de coût par clic une fois positionné en SEO" },
  { num: "x3", label: "le taux de conversion du SEO vs la publicité payante" },
  { num: "76%", label: "des recherches locales aboutissent à une visite ou un appel sous 24h" },
];

const pillars = [
  { num: "1", title: "La technique", desc: "Votre site se charge rapidement, s'affiche bien sur mobile, est correctement sécurisé (HTTPS) et peut être lu et indexé par les robots de Google sans obstacle." },
  { num: "2", title: "Le contenu", desc: "Vos pages répondent avec précision aux questions de vos clients. Chaque page cible un sujet, utilise les bons mots-clés, et prouve votre expertise de façon concrète." },
  { num: "3", title: "L'autorité", desc: "D'autres sites parlent de vous, vous recommandent, ou vous citent comme référence. Ces \"liens entrants\" (backlinks) sont des votes de confiance aux yeux de Google." },
];

const benefits = [
  { num: "01", title: "Vous captez des clients qui cherchent exactement ce que vous offrez", desc: "Un internaute qui tape \"électricien Bordeaux tableau électrique\" cherche précisément ce que vous proposez. C'est un prospect chaud, prêt à agir. Le SEO vous met face à lui au bon moment." },
  { num: "02", title: "C'est un investissement rentable sur le long terme", desc: "Contrairement à la publicité qui s'arrête dès que vous coupez le budget, une page bien référencée continue d'attirer des visiteurs pendant des mois, voire des années, sans coût supplémentaire." },
  { num: "03", title: "Le SEO local nivelle le terrain en votre faveur", desc: "Sur les recherches \"[métier] + [ville]\", un artisan local avec un bon SEO et de bons avis Google peut régulièrement devancer des grandes enseignes ou des franchises. Google valorise la proximité et la pertinence." },
  { num: "04", title: "Votre expertise de niche est un avantage SEO énorme", desc: "Vous êtes le seul menuisier spécialisé dans l'escalier sur mesure à Lyon ? Cette spécialité, si elle est bien communiquée sur votre site, est un formidable levier SEO." },
  { num: "05", title: "Ça crédibilise votre entreprise durablement", desc: "Être en première page de Google, c'est envoyer un signal fort à vos prospects : \"cette entreprise est sérieuse, établie, reconnue.\" Le SEO construit votre réputation numérique." },
  { num: "06", title: "Vous réduisez votre dépendance aux plateformes tierces", desc: "Leboncoin, Pages Jaunes, ManoMano, Malt - utiles, mais vous ne maîtrisez pas ces canaux. Avec votre propre SEO, vous construisez un actif numérique qui vous appartient." },
];

const compareRows = [
  { criteria: "Coût par lead", seo: "Très faible (long terme)", ads: "Élevé (5-30€/clic)", social: "Variable, souvent moyen", seoWin: true },
  { criteria: "Durée des effets", seo: "Permanent tant qu'entretenu", ads: "S'arrête avec le budget", social: "Faible portée organique", seoWin: true },
  { criteria: "Délai résultats", seo: "3-6 mois", ads: "Immédiat", social: "Court terme", seoWin: false },
  { criteria: "Qualité des leads", seo: "Très élevée (intention forte)", ads: "Élevée", social: "Moyenne (découverte passive)", seoWin: true },
  { criteria: "Dépendance externe", seo: "Faible (vous maîtrisez)", ads: "Totale (Google fixe les prix)", social: "Totale (algo change)", seoWin: true },
  { criteria: "Adapté budget serré", seo: "Oui, si investi en temps", ads: "Non (budget quotidien requis)", social: "Partiellement", seoWin: true },
  { criteria: "Crédibilité perçue", seo: "Très forte (résultat \"mérité\")", ads: "Moyenne (étiquette \"annonce\")", social: "Dépend de la communauté", seoWin: true },
];

const profiles = [
  {
    icon: Hammer, title: "Artisan", sub: "Plombier - Électricien - Menuisier - Peintre…",
    items: ["Capter les urgences locales 24h/24", "Afficher des avis Google en évidence", "Cibler chaque ville de votre zone d'intervention", "Montrer vos réalisations en photos (SEO image)", "Dominer \"[métier] + [ville]\" sur Google Maps"],
  },
  {
    icon: Laptop, title: "Indépendant", sub: "Consultant - Graphiste - Coach - Comptable…",
    items: ["Positionner votre expertise sur des mots-clés de niche", "Attirer des clients au-delà de votre réseau", "Publier des articles qui démontrent votre valeur", "Réduire la dépendance aux plateformes freelance", "Construire une autorité thématique reconnue"],
  },
  {
    icon: Building2, title: "TPE", sub: "Commerce local - Agence - Studio - Boutique…",
    items: ["Concurrencer des acteurs nationaux sur le local", "Créer des pages dédiées par service et par zone", "Attirer du trafic qualifié sans augmenter les coûts fixes", "Générer des leads récurrents sans agence pub", "Construire un actif numérique valorisable"],
  },
];

const myths = [
  { myth: "\"Le SEO c'est trop compliqué, c'est pour les grandes entreprises\"", mythDesc: "Beaucoup de petits entrepreneurs renoncent avant même d'essayer, persuadés que le SEO nécessite une équipe et un gros budget.", reality: "Les bases du SEO local sont accessibles à tous", realityDesc: "Optimiser sa fiche Google Business, bien rédiger ses pages de services, collecter des avis clients - ces actions simples suffisent souvent à démarrer et à prendre une longueur d'avance sur vos concurrents locaux." },
  { myth: "\"Mon site web suffit, je n'ai pas besoin de SEO\"", mythDesc: "Avoir un site internet ne suffit plus. Un site sans SEO, c'est une vitrine ouverte dans une ruelle sans passants.", reality: "Un site non optimisé est invisible sur Google", realityDesc: "98 % des internautes ne vont jamais à la page 2 des résultats. Sans optimisation SEO, votre site est techniquement introuvable pour quiconque ne connaît pas déjà votre nom." },
  { myth: "\"Le SEO ça prend des années avant de servir à quelque chose\"", mythDesc: "L'idée que le référencement naturel est trop lent pour être utile à court terme décourage beaucoup de petits entrepreneurs.", reality: "Des résultats visibles dès 4 à 8 semaines pour le SEO local", realityDesc: "Une fiche Google Business optimisée, une page de service bien structurée, quelques avis clients collectés : ces actions produisent des effets mesurables rapidement, surtout sur des marchés locaux peu concurrentiels." },
  { myth: "\"Il faut écrire des dizaines d'articles par mois pour être visible\"", mythDesc: "La quantité de contenu est souvent perçue comme une barrière insurmontable pour un entrepreneur qui travaille seul.", reality: "Quelques pages de qualité valent mieux que cent articles médiocres", realityDesc: "Google privilégie la pertinence et la profondeur sur le volume. Un artisan qui rédige 4 à 6 pages de services très bien optimisées peut outperformer un concurrent qui publie à la chaîne du contenu générique." },
];

const steps = [
  { title: "Revendiquer et optimiser votre fiche Google Business", desc: "C'est la première chose à faire. Votre fiche Google Business est votre vitrine locale : elle apparaît dans Google Maps et dans les résultats locaux. Renseignez tout - catégorie, horaires, description, photos, zone d'intervention. Et répondez à chaque avis, même les négatifs." },
  { title: "Identifier vos 5 à 10 mots-clés prioritaires", desc: "Réfléchissez à ce que vos clients tapent vraiment dans Google. Pas le jargon technique de votre métier - les mots qu'utilise quelqu'un qui ne s'y connaît pas. Utilisez Google lui-même (suggestions de recherche, \"aussi recherché\") ou des outils gratuits comme Ubersuggest ou Google Keyword Planner." },
  { title: "Créer ou optimiser une page par service clé", desc: "Chaque service mérite sa propre page : \"pose de carrelage\", \"rénovation salle de bain\", \"dépannage chaudière\"… Ces pages doivent répondre aux questions courantes, intégrer naturellement vos mots-clés, et inciter au contact." },
  { title: "Collecter des avis clients sur Google", desc: "Les avis sont un signal de confiance majeur pour Google. Demandez systématiquement à vos clients satisfaits de laisser un avis : un SMS avec le lien direct, une carte de visite avec QR code, un email de suivi. 5 avis honnêtes valent plus que 50 contacts froids." },
  { title: "Publier du contenu expert régulièrement", desc: "Même un article de blog par mois peut faire une vraie différence. Répondez aux questions que vos clients vous posent souvent. Ces contenus attirent des visiteurs qualifiés et renforcent votre autorité." },
  { title: "Suivre ses positions et ajuster", desc: "Installez Google Search Console (gratuit) pour suivre vos mots-clés et votre trafic organique. Identifiez ce qui fonctionne, renforcez-le. Le SEO n'est pas une action ponctuelle mais un processus d'amélioration continue." },
];

const checklist = [
  "Fiche Google Business complète : horaires, photos, catégorie principale, description avec mots-clés",
  "Site optimisé mobile : s'affiche parfaitement sur smartphone et se charge en moins de 3s",
  "Pages de services séparées : une page dédiée par service, avec titre H1, description et CTA",
  "5 avis Google minimum avec des réponses de votre part à chacun d'entre eux",
  "Mots-clés locaux dans vos textes : ville(s), département, zone d'intervention clairement mentionnés",
  "Google Search Console activée pour suivre vos positions et indexer votre site correctement",
  "Numéro de téléphone cliquable sur mobile : l'appel en un clic sur smartphone est crucial pour les artisans",
  "Une page ou section FAQ : répondez aux 5 à 10 questions que vos clients posent toujours",
  "Nom / adresse / téléphone identiques partout : site, Google Business, annuaires (cohérence NAP)",
  "Présent sur les annuaires locaux clés : Pages Jaunes, Yelp, Houzz, annuaires de votre secteur ou mairie",
];

const faqItems = [
  { q: "Qu'est-ce que le SEO exactement ?", a: "Le SEO, ou Search Engine Optimization (référencement naturel en français), désigne l'ensemble des techniques permettant à un site web d'apparaître en bonne position dans les résultats naturels des moteurs de recherche - Google en tête - sans payer de publicité. Il repose sur trois piliers : la technique (votre site est rapide, sécurisé, lisible par Google), le contenu (vos pages répondent aux questions de vos clients avec des mots-clés pertinents) et l'autorité (d'autres sites web reconnus font référence au vôtre)." },
  { q: "Combien de temps avant de voir des résultats SEO ?", a: "En SEO local (sur des recherches de type \"[métier] + [ville]\"), les premières améliorations peuvent se voir en 4 à 8 semaines, notamment grâce à l'optimisation de votre fiche Google Business et à la collecte d'avis. Pour un positionnement solide et stable sur des mots-clés plus compétitifs, comptez 3 à 6 mois." },
  { q: "Est-ce que le SEO est vraiment utile pour un artisan ou un indépendant ?", a: "Oui, et c'est même l'un des canaux les plus efficaces pour ce profil. Les artisans et indépendants ont deux atouts SEO majeurs : une expertise précise (valorisée par Google) et une zone géographique délimitée (peu concurrencée). Un artisan avec un bon SEO local peut régulièrement apparaître avant de grandes enseignes." },
  { q: "Combien coûte une stratégie SEO pour une TPE ou un artisan ?", a: "Les actions de base sont gratuites en temps : optimiser votre fiche Google Business, rédiger de bonnes pages de services, collecter des avis. Si vous souhaitez déléguer à un professionnel, comptez entre 400 et 1 200 € par mois pour une stratégie SEO locale sérieuse." },
  { q: "Le SEO local est-il vraiment efficace pour les artisans ?", a: "Oui, c'est l'un des segments les plus rentables du SEO. Les recherches locales ont une intention d'achat très forte : quelqu'un qui tape \"plombier urgence Nantes\" cherche à agir maintenant. Selon Google, 76 % des recherches locales sur mobile aboutissent à une visite ou un appel dans les 24 heures." },
  { q: "Faut-il tenir un blog pour faire du SEO ?", a: "Un blog est un excellent outil SEO mais n'est pas obligatoire pour commencer. Vous pouvez déjà obtenir de bons résultats avec des pages de services bien optimisées, une fiche Google Business complète et une présence sur les annuaires. Si vous avez du temps pour rédiger, un article de fond par mois peut considérablement renforcer votre autorité thématique." },
];

const kwPrimary = ["SEO artisan", "référencement naturel TPE", "SEO indépendant", "SEO pour petite entreprise", "référencement local artisan"];
const kwSecondary = ["optimisation Google artisan", "visibilité web TPE", "premier page Google artisan", "SEO local freelance", "comment attirer clients internet artisan", "référencement site web indépendant", "Google Business artisan", "avis Google TPE", "SEO sans agence", "mots-clés locaux petite entreprise"];
const kwQuestions = ["est-ce que le SEO est utile pour un artisan", "combien coûte le SEO pour une TPE", "comment se référencer sur Google artisan", "SEO ou Google Ads pour petite entreprise", "pourquoi faire du SEO quand on est indépendant"];

const ReferencementSeo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "SEO pour TPE, artisans et indépendants : pourquoi c'est votre meilleur investissement",
    description: "Guide complet sur le référencement naturel pour les petites entreprises, artisans et freelances.",
    author: { "@type": "LocalBusiness", name: "Déclic Digital", url: "https://declicdigital.net" },
    datePublished: "2026-01-01",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://declicdigital.net/referencement-seo/" },
  };

  return (
    <PageLayout>
      <Helmet>
        <title>SEO pour TPE, artisans et indépendants : pourquoi c'est votre meilleur investissement | Déclic Digital</title>
        <meta name="description" content="Le SEO (référencement naturel) est l'outil le plus puissant pour qu'un artisan, un indépendant ou une TPE attire des clients sans payer de publicité. Découvrez pourquoi et comment en 2026." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/referencement-seo/" />
        <meta property="og:title" content="SEO pour TPE et artisans : pourquoi c'est votre meilleur investissement digital" />
        <meta property="og:description" content="Tout ce qu'un artisan, un indépendant ou une TPE doit savoir sur le SEO pour attirer des clients en ligne sans budget publicitaire." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Référencement SEO" },
      ]} />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24 overflow-hidden">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Référencement naturel</p>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl gradient-text">
                Le SEO : le meilleur allié de l'entrepreneur solo
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed italic">
                Vous n'avez pas le budget d'une multinationale. Vous n'avez pas une équipe marketing. Mais vous avez quelque chose qu'aucune grande entreprise ne peut acheter : une vraie expertise, un vrai territoire, une vraie relation client. Le SEO est l'outil qui transforme ça en visibilité.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                <Link to="/contact">Demander un audit SEO gratuit</Link>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl gradient-miami opacity-20 blur-2xl" />
                <img src={heroSeo} alt="Dashboard analytics SEO pour TPE et artisans" className="relative w-full max-w-lg rounded-2xl shadow-2xl" width={512} height={341} loading="lazy" decoding="async" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[hsl(263,36%,18%)] py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-blue via-brand-violet to-brand-pink bg-clip-text text-transparent">{s.num}</span>
                <p className="mt-2 text-xs md:text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 - Définition */}
      <SectionWrapper id="definition">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">01 - Comprendre les bases</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">Qu'est-ce que le SEO, concrètement ?</h2>
          <div className="rounded-2xl border-l-4 border-primary bg-background p-6 shadow-card">
            <p className="text-lg leading-relaxed italic">
              Le <strong className="text-primary">SEO (Search Engine Optimization)</strong> - ou référencement naturel en français - désigne l'ensemble des techniques qui permettent à votre site d'apparaître en tête des résultats Google lorsqu'un client potentiel tape une recherche liée à votre activité. Sans payer de publicité.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Imaginez un plombier à Strasbourg. Quand quelqu'un tape « plombier urgence Strasbourg » sur Google à 22h, il y a deux façons d'apparaître dans les résultats : payer Google Ads pour chaque clic - ou être là naturellement, grâce au SEO. Le premier coûte à chaque fois. Le second, une fois en place, travaille pour vous 24h/24.
          </p>
          <p className="text-muted-foreground leading-relaxed">Le SEO repose sur trois piliers fondamentaux que Google évalue en permanence :</p>
          <div className="space-y-0">
            {pillars.map((p, i) => (
              <div key={i} className="flex border-b border-border last:border-0">
                <div className="flex h-auto w-16 shrink-0 items-center justify-center bg-[hsl(263,36%,18%)] text-white font-extrabold text-lg">
                  {p.num}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                  <p className="text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 02 - Pourquoi */}
      <SectionWrapper id="pourquoi">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">02 - Le cœur du sujet</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">Pourquoi le SEO est particulièrement adapté aux TPE, artisans et indépendants</h2>
          <p className="text-muted-foreground leading-relaxed">Les grandes entreprises ont des budgets publicitaires que vous ne pourrez jamais égaler. Mais en SEO, la taille ne fait pas la loi - la pertinence, si. Et sur ce terrain, vous avez des atouts considérables.</p>

          <div className="relative rounded-2xl border-l-4 border-primary pl-6 py-2">
            <p className="text-xl font-extrabold leading-snug">Un artisan qui maîtrise son SEO local peut surclasser une enseigne nationale sur ses propres mots-clés. Google préfère le résultat le plus pertinent, pas le plus riche.</p>
          </div>

          <div className="space-y-0">
            {benefits.map((b, i) => (
              <div key={i} className="flex border-b border-border last:border-0">
                <div className="flex h-auto w-16 shrink-0 items-center justify-center bg-[hsl(263,36%,18%)] text-white font-extrabold text-sm">
                  {b.num}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{b.title}</h3>
                  <p className="text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-green-300/30 bg-green-50/50 p-5">
            <p className="font-bold text-green-700 mb-2">💡 Le chiffre qui convainc</p>
            <p className="text-muted-foreground">Les leads issus du SEO ont un taux de conversion moyen de <strong>14,6 %</strong> contre 1,7 % pour les leads issus de la publicité outbound classique (flyers, cold call, affichage). Source : Search Engine Journal. Autrement dit : les gens qui vous trouvent via Google sont bien plus enclins à devenir clients.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA 1 avec texture */}
      <section className="relative overflow-hidden py-14">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "hsl(263,36%,18%,0.82)" }} />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Prêt à attirer vos premiers clients via Google ?</h2>
          <p className="mb-6 text-white/80 max-w-xl mx-auto">Nos experts analysent votre site et identifient les quick wins SEO pour votre activité.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="rounded-full border-2 border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10 transition-colors">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Image + texte */}
      <SectionWrapper>
        <div className="mx-auto max-w-5xl grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl gradient-miami opacity-15 blur-2xl" />
            <img src={seoDashboard} alt="Dashboard analytics SEO pour suivre les performances" className="relative w-full rounded-2xl shadow-2xl" width={512} height={341} loading="lazy" decoding="async" />
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl font-extrabold md:text-4xl">Suivez vos résultats en temps réel</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le SEO n'est pas une boîte noire. Grâce aux outils d'analyse, vous suivez chaque progression : mots-clés qui montent, trafic organique, demandes de devis générées par votre <Link to="/creation-site-web" className="text-primary font-semibold">site web</Link>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              C'est cette transparence qui fait du SEO un investissement mesurable, contrairement à bien d'autres canaux marketing.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 03 - Comparaison */}
      <SectionWrapper id="comparaison">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">03 - Mise en perspective</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">SEO contre les autres canaux : ce que les chiffres disent</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">Pour un artisan ou un indépendant avec un budget limité, chaque euro investi en marketing doit travailler. Voici une comparaison honnête des principaux canaux d'acquisition.</p>
          <div className="overflow-x-auto rounded-2xl border bg-background shadow-card">
            <table className="w-full">
              <thead>
                <tr className="bg-[hsl(263,36%,18%)] text-white">
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Critère</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider bg-primary/80">SEO (naturel)</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Google Ads</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Réseaux sociaux</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-bold text-sm">{row.criteria}</td>
                    <td className={`px-5 py-3 text-sm ${row.seoWin ? "text-green-700 italic font-medium" : "text-muted-foreground"}`}>{row.seoWin ? "✓ " : ""}{row.seo}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{row.ads}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{row.social}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-amber-300/30 bg-amber-50/50 p-5">
            <p className="font-bold text-amber-700 mb-2">⚠️ Google Ads n'est pas votre ennemi</p>
            <p className="text-muted-foreground">Google Ads reste un outil utile, notamment pour lancer une activité ou capter de la demande en urgence. Mais il ne construit rien de durable. Le combo idéal pour une TPE : <strong>SEO pour le long terme + Google Ads en appoint ponctuel</strong> pendant la montée en puissance du référencement naturel. Découvrez <Link to="/tarifs" className="text-primary font-semibold">nos tarifs</Link>.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* 04 - Profils */}
      <SectionWrapper id="profils">
        <div className="mx-auto max-w-4xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">04 - Cas concrets</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Ce que le SEO change concrètement selon votre profil</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">Le SEO ne se déploie pas de la même façon selon que vous êtes artisan, freelance ou dirigeant de TPE. Voici les opportunités spécifiques à chaque profil.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {profiles.map((p, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card border-t-4 border-primary">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(263,36%,18%)] text-white">
                  <p.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{p.sub}</p>
                <ul className="space-y-2">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-muted-foreground">
                      <CheckCircle2 size={14} className="text-primary shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <GoogleReviewsSection compact maxReviews={3} />

      {/* 05 - Mythes */}
      <SectionWrapper id="idees-recues">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">05 - Idées reçues</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Les 4 fausses croyances qui freinent les artisans et indépendants</h2>
          <div className="space-y-5">
            {myths.map((m, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-0 rounded-2xl border bg-background shadow-card overflow-hidden">
                <div className="p-6 bg-red-50/50 border-b md:border-b-0 md:border-r border-border">
                  <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-700 mb-3">Mythe</span>
                  <h4 className="font-bold mb-2">{m.myth}</h4>
                  <p className="text-muted-foreground">{m.mythDesc}</p>
                </div>
                <div className="p-6">
                  <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-green-700 mb-3">Réalité</span>
                  <h4 className="font-bold mb-2">{m.reality}</h4>
                  <p className="text-muted-foreground">{m.realityDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA 2 avec texture */}
      <section className="relative overflow-hidden py-14">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "hsl(263,36%,18%,0.82)" }} />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">Vous vous reconnaissez dans ces freins ?</h2>
          <p className="mb-6 text-white/80 max-w-xl mx-auto">On démystifie le SEO et on vous accompagne pas à pas. Premier diagnostic gratuit en 48h.</p>
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/contact">Demander un audit SEO gratuit</Link>
          </Button>
        </div>
      </section>

      {/* 06 - Comment démarrer */}
      <SectionWrapper id="demarrer">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">06 - Passer à l'action</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Par où commencer quand on est artisan ou indépendant ?</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">La bonne nouvelle : les premières actions SEO ne coûtent que du temps. Voici la progression logique pour démarrer efficacement.</p>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 py-7 border-b border-border last:border-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-bold text-primary mb-2">📌 Conseil pratique</p>
            <p className="text-muted-foreground">Avant tout investissement SEO, vérifiez que votre <Link to="/creation-site-web" className="text-primary font-semibold">site web</Link> se charge en moins de 3 secondes sur mobile et qu'il est responsive. Un site lent est pénalisé par Google et fait fuir vos visiteurs. Testez avec <strong>PageSpeed Insights</strong> de Google - c'est gratuit et prend 30 secondes. Consultez aussi notre article sur <Link to="/blog/vitesse-site-web-impact-chiffre-affaires" className="text-primary font-semibold">l'impact de la vitesse sur votre chiffre d'affaires</Link>.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* 07 - Checklist */}
      <SectionWrapper id="checklist">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">07 - Auto-évaluation</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Votre checklist SEO de départ</h2>
          <p className="text-center text-muted-foreground">Chaque point non coché est une opportunité d'amélioration concrète.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border bg-background p-4 shadow-card">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-green-100 text-green-700 text-xs font-bold mt-0.5">✓</div>
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA 3 avec texture + image overlap */}
      <section className="relative overflow-hidden py-14">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "hsl(263,36%,18%,0.82)" }} />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">Votre SEO peut travailler pour vous dès aujourd'hui</h2>
              <p className="mb-6 text-white/80">Nos experts analysent votre site, identifient les quick wins SEO et construisent une stratégie adaptée à votre activité, votre zone et votre budget.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
                  <Link to="/contact">Audit SEO gratuit</Link>
                </Button>
                <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
                  Voir nos tarifs
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative overflow-hidden rounded-2xl group" style={{ aspectRatio: "3/4", maxHeight: "400px" }}>
              <img src={imgArtisanSatisfait} alt="Client satisfait agence digitale Paris" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* 08 - FAQ */}
      <SectionWrapper id="faq">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">08 - Questions fréquentes</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Vos questions sur le SEO, nos réponses honnêtes</h2>
          <div className="space-y-0">
            {faqItems.map((f, i) => (
              <div key={i} className="border-b border-border first:border-t">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <h3 className="font-bold">{f.q}</h3>
                  <ChevronDown size={18} className={`shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* GEO encart */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="text-2xl font-extrabold mb-3">Au-delà du SEO : la visibilité dans les moteurs IA</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Au-delà du SEO traditionnel, nous vous aidons aussi à apparaître dans les réponses des intelligences artificielles. ChatGPT, Perplexity, Gemini : ces moteurs génératifs deviennent un canal d'acquisition incontournable. Découvrez notre stratégie d'<Link to="/visibilite-ia" className="text-primary font-semibold">optimisation pour les moteurs IA (GEO)</Link>.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Zones d'intervention SEO */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">Nos zones d'intervention SEO</h2>
        <p className="text-center text-muted-foreground mb-8">
          Nous proposons un <Link to="/nos-villes" className="text-primary font-semibold">référencement SEO local</Link> à Paris et dans les Hauts-de-Seine.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { slug: "paris-1er", label: "SEO Paris 1er" },
            { slug: "boulogne-billancourt", label: "SEO Boulogne-Billancourt" },
            { slug: "neuilly-sur-seine", label: "SEO Neuilly-sur-Seine" },
            { slug: "levallois-perret", label: "SEO Levallois-Perret" },
            { slug: "issy-les-moulineaux", label: "SEO Issy-les-Moulineaux" },
            { slug: "courbevoie", label: "SEO Courbevoie" },
            { slug: "nanterre", label: "SEO Nanterre" },
            { slug: "rueil-malmaison", label: "SEO Rueil-Malmaison" },
            { slug: "montrouge", label: "SEO Montrouge" },
            { slug: "asnieres-sur-seine", label: "SEO Asnières-sur-Seine" },
          ].map((c) => (
            <Link
              key={c.slug}
              to={`/referencement-seo/${c.slug}`}
              className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
            >
              {c.label}
            </Link>
          ))}
          <Link
            to="/nos-villes"
            className="rounded-full gradient-primary btn-glow px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Voir toutes les villes →
          </Link>
        </div>
      </SectionWrapper>

      <LocationSection />
    </PageLayout>
  );
};

export default ReferencementSeo;
