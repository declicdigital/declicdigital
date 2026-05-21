import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { ChevronDown, CheckCircle2, Building2, Hammer, Laptop } from "lucide-react";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import heroSeo from "@/assets/seo-hero-businessman.webp";
import imgSearchConsole from "@/assets/google-search-console-resultats-seo.webp";
import imgGoogleMaps from "@/assets/seo-local-google-maps-boulogne-billancourt.webp";

const stats = [
  { num: "93%", label: "des expériences en ligne commencent par un moteur de recherche" },
  { num: "0 EUR", label: "de cout par clic une fois positionné en SEO" },
  { num: "x3", label: "le taux de conversion du SEO vs la publicité payante" },
  { num: "76%", label: "des recherches locales aboutissent à une visite ou un appel sous 24h" },
];

const pillars = [
  { num: "1", title: "La technique", desc: "Votre site se charge rapidement, s'affiche bien sur mobile, est correctement sécurisé (HTTPS) et peut être lu et indexé par les robots de Google sans obstacle." },
  { num: "2", title: "Le contenu", desc: "Vos pages répondent avec précision aux questions de vos clients. Chaque page cible un sujet, utilise les bons mots-clés, et prouve votre expertise de façon concrète." },
  { num: "3", title: "L'autorité", desc: "D'autres sites parlent de vous, vous recommandent, ou vous citent comme référence. Ces liens entrants (backlinks) sont des votes de confiance aux yeux de Google." },
];

const benefits = [
  { num: "01", title: "Vous captez des clients qui cherchent exactement ce que vous offrez", desc: "Un internaute qui tape \"électricien Asnières-sur-Seine tableau électrique\" cherche précisément ce que vous proposez. C'est un prospect chaud, prêt à agir. Le SEO vous met face à lui au bon moment." },
  { num: "02", title: "C'est un investissement rentable sur le long terme", desc: "Contrairement à la publicité qui s'arrête dès que vous coupez le budget, une page bien référencée continue d'attirer des visiteurs pendant des mois, voire des années, sans cout supplémentaire." },
  { num: "03", title: "Le SEO local nivelle le terrain en votre faveur", desc: "Sur les recherches \"[métier] + [ville]\", un artisan local avec un bon SEO et de bons avis Google peut régulièrement devancer des grandes enseignes. Google valorise la proximité et la pertinence." },
  { num: "04", title: "Votre expertise de niche est un avantage SEO énorme", desc: "Vous êtes le seul menuisier spécialisé dans l'escalier sur mesure à Boulogne-Billancourt ? Cette spécialité, si elle est bien communiquée sur votre site, est un formidable levier SEO." },
  { num: "05", title: "Ca crédibilise votre entreprise durablement", desc: "Être en première page de Google, c'est envoyer un signal fort à vos prospects : cette entreprise est sérieuse, établie, reconnue. Le SEO construit votre réputation numérique." },
  { num: "06", title: "Vous réduisez votre dépendance aux plateformes tierces", desc: "Leboncoin, Pages Jaunes, ManoMano, Malt - utiles, mais vous ne maîtrisez pas ces canaux. Avec votre propre SEO, vous construisez un actif numérique qui vous appartient." },
];

const compareRows = [
  { criteria: "Cout par lead", seo: "Très faible (long terme)", ads: "Élevé (5-30 EUR/clic)", social: "Variable, souvent moyen", seoWin: true },
  { criteria: "Durée des effets", seo: "Permanent tant qu'entretenu", ads: "S'arrête avec le budget", social: "Faible portée organique", seoWin: true },
  { criteria: "Délai résultats", seo: "3-6 mois", ads: "Immédiat", social: "Court terme", seoWin: false },
  { criteria: "Qualité des leads", seo: "Très élevée (intention forte)", ads: "Élevée", social: "Moyenne (découverte passive)", seoWin: true },
  { criteria: "Dépendance externe", seo: "Faible (vous maîtrisez)", ads: "Totale (Google fixe les prix)", social: "Totale (algo change)", seoWin: true },
  { criteria: "Adapté budget serré", seo: "Oui, si investi en temps", ads: "Non (budget quotidien requis)", social: "Partiellement", seoWin: true },
  { criteria: "Crédibilité perçue", seo: "Très forte (résultat mérité)", ads: "Moyenne (étiquette annonce)", social: "Dépend de la communauté", seoWin: true },
];

const profiles = [
  {
    icon: Hammer, title: "Artisan", sub: "Plombier - Électricien - Menuisier - Peintre",
    items: ["Capter les urgences locales 24h/24", "Afficher des avis Google en évidence", "Cibler chaque ville de votre zone d'intervention", "Montrer vos réalisations en photos (SEO image)", "Dominer \"[métier] + [ville]\" sur Google Maps"],
  },
  {
    icon: Laptop, title: "Indépendant", sub: "Consultant SEO - Graphiste - Coach - Comptable",
    items: ["Positionner votre expertise sur des mots-clés de niche", "Attirer des clients au-delà de votre réseau", "Publier des articles qui démontrent votre valeur", "Réduire la dépendance aux plateformes freelance", "Construire une autorité thématique reconnue"],
  },
  {
    icon: Building2, title: "TPE", sub: "Commerce local - Agence - Studio - Boutique",
    items: ["Concurrencer des acteurs nationaux sur le local", "Créer des pages dédiées par service et par zone", "Attirer du trafic qualifié sans augmenter les couts fixes", "Générer des leads récurrents sans agence pub", "Construire un actif numérique valorisable"],
  },
];

const myths = [
  { myth: "\"Le SEO c'est trop compliqué, c'est pour les grandes entreprises\"", mythDesc: "Beaucoup de petits entrepreneurs renoncent avant même d'essayer, persuadés que le SEO nécessite une équipe et un gros budget.", reality: "Les bases du SEO local sont accessibles à tous", realityDesc: "Optimiser sa fiche Google Business, bien rédiger ses pages de services, collecter des avis clients - ces actions simples suffisent souvent à démarrer et à prendre une longueur d'avance sur vos concurrents locaux." },
  { myth: "\"Mon site web suffit, je n'ai pas besoin de SEO\"", mythDesc: "Avoir un site internet ne suffit plus. Un site sans SEO, c'est une vitrine ouverte dans une ruelle sans passants.", reality: "Un site non optimisé est invisible sur Google", realityDesc: "98% des internautes ne vont jamais à la page 2 des résultats. Sans optimisation SEO, votre site est techniquement introuvable pour quiconque ne connaît pas déjà votre nom." },
  { myth: "\"Le SEO ca prend des années avant de servir à quelque chose\"", mythDesc: "L'idée que le référencement naturel est trop lent pour être utile à court terme décourage beaucoup de petits entrepreneurs.", reality: "Des résultats visibles dès 4 à 8 semaines pour le SEO local", realityDesc: "Une fiche Google Business optimisée, une page de service bien structurée, quelques avis clients collectés : ces actions produisent des effets mesurables rapidement, surtout sur des marchés locaux peu concurrentiels." },
  { myth: "\"Il faut écrire des dizaines d'articles par mois pour être visible\"", mythDesc: "La quantité de contenu est souvent perçue comme une barrière insurmontable pour un entrepreneur qui travaille seul.", reality: "Quelques pages de qualité valent mieux que cent articles médiocres", realityDesc: "Google privilégie la pertinence et la profondeur sur le volume. Un artisan qui rédige 4 à 6 pages de services très bien optimisées peut outperformer un concurrent qui publie à la chaîne du contenu générique." },
];

const steps = [
  { title: "Revendiquer et optimiser votre fiche Google Business", desc: "C'est la première chose à faire. Votre fiche Google Business est votre vitrine locale : elle apparaît dans Google Maps et dans les résultats locaux. Renseignez tout - catégorie, horaires, description, photos, zone d'intervention. Et répondez à chaque avis, même les négatifs." },
  { title: "Identifier vos 5 à 10 mots-clés prioritaires", desc: "Réfléchissez à ce que vos clients tapent vraiment dans Google. Pas le jargon technique de votre métier - les mots qu'utilise quelqu'un qui ne s'y connaît pas. Utilisez Google lui-même (suggestions de recherche, aussi recherché) ou des outils gratuits comme Ubersuggest ou Google Keyword Planner." },
  { title: "Créer ou optimiser une page par service clé", desc: "Chaque service mérite sa propre page : pose de carrelage, rénovation salle de bain, dépannage chaudière... Ces pages doivent répondre aux questions courantes, intégrer naturellement vos mots-clés, et inciter au contact." },
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
  { q: "Combien de temps avant de voir des résultats SEO ?", a: "En SEO local (sur des recherches de type [métier] + [ville]), les premières améliorations peuvent se voir en 4 à 8 semaines, notamment grâce à l'optimisation de votre fiche Google Business et à la collecte d'avis. Pour un positionnement solide et stable sur des mots-clés plus compétitifs, comptez 3 à 6 mois." },
  { q: "Est-ce que le SEO est vraiment utile pour un artisan ou un indépendant ?", a: "Oui, et c'est même l'un des canaux les plus efficaces pour ce profil. Les artisans et indépendants ont deux atouts SEO majeurs : une expertise précise (valorisée par Google) et une zone géographique délimitée (peu concurrencée). Un artisan avec un bon SEO local peut régulièrement apparaître avant de grandes enseignes." },
  { q: "Combien coute une stratégie SEO pour une TPE ou un artisan ?", a: "Les actions de base sont gratuites en temps : optimiser votre fiche Google Business, rédiger de bonnes pages de services, collecter des avis. Si vous souhaitez déléguer à un professionnel, comptez entre 400 et 1 200 EUR par mois pour une stratégie SEO locale sérieuse. Consultez nos tarifs pour nos forfaits." },
  { q: "Vous êtes une agence SEO dans le 92 ou à Paris ?", a: "Oui, Déclic Digital est basée à Paris 15e et intervient dans toute l'Île-de-France, avec une expertise particulière sur les Hauts-de-Seine (92). Nous accompagnons des artisans, commerçants et indépendants à Asnières-sur-Seine, Boulogne-Billancourt, Levallois-Perret, Neuilly-sur-Seine, Clichy, Nanterre, Suresnes, Courbevoie et dans tout le 92. Notre connaissance du tissu économique local est un vrai avantage pour votre référencement naturel." },
  { q: "Qu'est-ce que le référencement Google local et comment l'obtenir ?", a: "Le référencement Google local désigne le positionnement de votre entreprise dans les résultats géolocalisés de Google, notamment le pack de 3 résultats qui apparaît avec une carte. Pour l'obtenir : optimisez votre fiche Google Business Profile, collectez des avis clients, créez des pages de services géolocalisées, et assurez-vous que votre NAP (nom, adresse, téléphone) est identique partout en ligne." },
  { q: "Quelle est la différence entre SEO et GEO ?", a: "Le SEO optimise votre visibilité sur Google et les moteurs de recherche traditionnels. Le GEO (Generative Engine Optimization) optimise votre présence dans les réponses des intelligences artificielles comme ChatGPT, Perplexity ou Gemini. Les deux sont complémentaires : un site bien optimisé pour le SEO a de meilleures chances d'être cité par les IA. Nous proposons les deux approches pour maximiser votre visibilité en 2026." },
  { q: "Faut-il tenir un blog pour faire du SEO ?", a: "Un blog est un excellent outil SEO mais n'est pas obligatoire pour commencer. Vous pouvez déjà obtenir de bons résultats avec des pages de services bien optimisées, une fiche Google Business complète et une présence sur les annuaires. Si vous avez du temps pour rédiger, un article de fond par mois peut considérablement renforcer votre autorité thématique." },
];

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
    headline: "Agence SEO Paris et 92 : référencement naturel pour TPE, artisans et indépendants",
    description: "Guide complet sur le référencement naturel pour les petites entreprises, artisans et freelances à Paris et dans les Hauts-de-Seine.",
    author: { "@type": "LocalBusiness", name: "Déclic Digital", url: "https://declicdigital.net" },
    datePublished: "2026-01-01",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://declicdigital.net/referencement-seo" },
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Agence SEO Paris et 92 : référencement naturel TPE et artisans</title>
        <meta name="description" content="Agence SEO Paris et Hauts-de-Seine (92) : référencement naturel, consultant SEO local et GEO pour artisans, TPE et indépendants. Audit gratuit 48h. Résultats mesurables en 3 à 6 mois." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/referencement-seo" />
        <meta property="og:title" content="Agence SEO Paris et 92 : référencement naturel TPE et artisans" />
        <meta property="og:description" content="Agence SEO Paris et Hauts-de-Seine (92) : référencement naturel, consultant SEO local et GEO pour artisans, TPE et indépendants. Audit gratuit 48h." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Référencement SEO" },
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
        <img
          src={heroSeo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          width={1200}
          height={600}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }} />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold border border-white/20" style={{ color: "rgba(246,241,233,0.8)" }}>
              Référencement naturel · SEO · GEO · Paris et Hauts-de-Seine (92)
            </span>
            <h1 className="mb-6 leading-tight" style={{ color: "#F6F1E9" }}>
              Agence SEO Paris et 92 : référencement naturel pour artisans, TPE et indépendants
            </h1>
            <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(246,241,233,0.75)" }}>
              Consultant SEO local basé à Paris 15e, Déclic Digital accompagne les TPE et artisans des Hauts-de-Seine à dominer Google dans leur zone de chalandise. De{" "}
              <Link to="/agence-web-asnieres-sur-seine" className="font-semibold underline" style={{ color: "rgba(246,241,233,0.9)" }}>Asnières-sur-Seine</Link>{" "}
              à{" "}
              <Link to="/referencement-seo/boulogne-billancourt" className="font-semibold underline" style={{ color: "rgba(246,241,233,0.9)" }}>Boulogne-Billancourt</Link>,
              nous transformons votre expertise locale en visibilité Google durable.
            </p>
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Demander un audit SEO gratuit</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10" style={{ backgroundColor: "hsl(263,36%,18%)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-blue via-brand-violet to-brand-pink bg-clip-text text-transparent">{s.num}</span>
                <p className="mt-2 text-xs md:text-sm" style={{ color: "rgba(246,241,233,0.6)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 Définition */}
      <section id="definition" className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2B1E3F", opacity: 0.5 }}>01 - Comprendre les bases</p>
            <h2 style={{ color: "#2B1E3F" }}>Qu'est-ce que le référencement naturel (SEO) pour une TPE ou un artisan ?</h2>
            <div className="rounded-2xl border-l-4 border-primary p-6 shadow-card" style={{ backgroundColor: "#E9F2F4" }}>
              <p className="text-lg leading-relaxed italic" style={{ color: "#2B1E3F" }}>
                Le <strong className="text-primary">SEO (Search Engine Optimization)</strong> désigne l'ensemble des techniques qui permettent à votre site d'apparaître en tête des résultats Google lorsqu'un client potentiel tape une recherche liée à votre activité, sans payer de publicité.
              </p>
            </div>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Imaginez un{" "}
              <Link to="/creation-site-web/metier/plombier" className="text-primary font-semibold">plombier à Asnières-sur-Seine</Link>.
              Quand quelqu'un tape "plombier urgence Asnières" sur Google à 22h, il y a deux façons d'apparaître : payer Google Ads pour chaque clic, ou être là naturellement grâce au{" "}
              <Link to="/blog/referencement-naturel-independant-2026" className="text-primary font-semibold">référencement naturel</Link>.
              Le premier coûte à chaque fois. Le second, une fois en place, travaille pour vous 24h/24.
            </p>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>Le SEO repose sur trois piliers fondamentaux que Google évalue en permanence :</p>
            <div className="space-y-0 rounded-2xl overflow-hidden shadow-card">
              {pillars.map((p, i) => (
                <div key={i} className="flex border-b last:border-0" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="flex h-auto w-16 shrink-0 items-center justify-center font-extrabold text-lg" style={{ backgroundColor: "hsl(263,36%,18%)", color: "#F6F1E9" }}>
                    {p.num}
                  </div>
                  <div className="p-5" style={{ backgroundColor: "#fff" }}>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#2B1E3F" }}>{p.title}</h3>
                    <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02 Pourquoi */}
      <section id="pourquoi" className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#2B1E3F", opacity: 0.5 }}>02 - Le coeur du sujet</p>
            <h2 style={{ color: "#2B1E3F" }}>Pourquoi le SEO local est particulièrement adapté aux TPE, artisans et indépendants du 92</h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Les grandes entreprises ont des budgets publicitaires que vous ne pourrez jamais égaler. Mais en{" "}
              <Link to="/blog/seo-local-paris-artisan-google-maps" className="text-primary font-semibold">référencement naturel</Link>,
              la taille ne fait pas la loi - la pertinence, si. Et sur ce terrain, vous avez des atouts considérables.
            </p>
            <div className="rounded-2xl border-l-4 border-primary pl-6 py-2">
              <p className="text-xl font-extrabold leading-snug" style={{ color: "#2B1E3F" }}>Un artisan qui maitrise son SEO local peut surclasser une enseigne nationale sur ses propres mots-clés. Google préfère le résultat le plus pertinent, pas le plus riche.</p>
            </div>
            <div className="space-y-0 rounded-2xl overflow-hidden shadow-card">
              {benefits.map((b, i) => (
                <div key={i} className="flex border-b last:border-0" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="flex h-auto w-16 shrink-0 items-center justify-center font-extrabold text-sm" style={{ backgroundColor: "hsl(263,36%,18%)", color: "#F6F1E9" }}>
                    {b.num}
                  </div>
                  <div className="p-5" style={{ backgroundColor: "#F6F1E9" }}>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#2B1E3F" }}>{b.title}</h3>
                    <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-green-300/30 bg-green-50/50 p-5">
              <p className="font-bold text-green-700 mb-2">Le chiffre qui convainc</p>
              <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Les leads issus du SEO ont un taux de conversion moyen de <strong>14,6%</strong> contre 1,7% pour les leads issus de la publicité outbound classique. Les gens qui vous trouvent via Google sont bien plus enclins à devenir clients que ceux qui voient une annonce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA texture 1 */}
      <section className="relative overflow-hidden py-14" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Prêt à attirer vos premiers clients via Google ?</h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>Nos experts analysent votre site et identifient les quick wins SEO pour votre activité à Paris ou dans les Hauts-de-Seine.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SearchConsole overlap */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="relative min-h-[320px] flex items-center">
              <div className="hidden lg:block absolute left-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
                <img src={imgSearchConsole} alt="Google Search Console résultats SEO en hausse - agence SEO Paris 92" className="w-full h-full object-cover" loading="lazy" width={500} height={320} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to left, #F6F1E9 0%, rgba(246,241,233,0.3) 40%, transparent 70%)" }} />
              </div>
              <div className="relative z-10 ml-auto max-w-xl space-y-5 py-10">
                <h2 style={{ color: "#2B1E3F" }}>Suivez vos résultats en temps réel avec Google Search Console</h2>
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Le référencement SEO n'est pas une boîte noire. Grâce aux outils d'analyse, vous suivez chaque progression : mots-clés qui montent, trafic organique, demandes de devis générées par votre{" "}
                  <Link to="/creation-site-web" className="text-primary font-semibold">site web professionnel</Link>.
                  Chaque action est mesurable, chaque gain est visible - c'est ce qui fait du SEO un investissement rationnel pour une TPE à budget limité.
                </p>
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Un bon{" "}
                  <Link to="/blog/audit-seo-gratuit-ce-quon-analyse" className="text-primary font-semibold">audit SEO</Link>{" "}
                  commence toujours par une analyse Search Console : c'est là que se cachent les opportunités les plus rapides à saisir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Comparaison */}
      <section id="comparaison" className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>03 - Mise en perspective</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>SEO contre les autres canaux : ce que les chiffres disent</h2>
            <p className="text-center max-w-2xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>Pour un artisan ou un indépendant avec un budget limité, chaque euro investi en marketing doit travailler. Voici une comparaison honnête des principaux canaux d'acquisition.</p>
            <div className="overflow-x-auto rounded-2xl border shadow-card" style={{ backgroundColor: "#F6F1E9" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "hsl(263,36%,18%)" }}>
                    <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: "#F6F1E9" }}>Critère</th>
                    <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: "#F6F1E9", backgroundColor: "rgba(67,97,238,0.6)" }}>SEO (naturel)</th>
                    <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: "#F6F1E9" }}>Google Ads</th>
                    <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider" style={{ color: "#F6F1E9" }}>Réseaux sociaux</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 transition-colors hover:bg-white/50" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                      <td className="px-5 py-3 font-bold text-sm" style={{ color: "#2B1E3F" }}>{row.criteria}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: row.seoWin ? "#15803d" : "#2B1E3F", opacity: row.seoWin ? 1 : 0.6, fontStyle: row.seoWin ? "italic" : "normal", fontWeight: row.seoWin ? 500 : 400 }}>{row.seoWin ? "✓ " : ""}{row.seo}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>{row.ads}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>{row.social}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-50/50 p-5">
              <p className="font-bold text-amber-700 mb-2">Google Ads n'est pas votre ennemi</p>
              <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Google Ads reste utile pour lancer une activité ou capter de la demande en urgence. Le combo idéal pour une TPE : <strong>SEO pour le long terme + Google Ads en appoint ponctuel</strong> pendant la montée en puissance du référencement naturel. Nos{" "}
                <Link to="/tarifs" className="text-primary font-semibold">forfaits SEO</Link>{" "}
                sont conçus pour s'intégrer dans un budget de TPE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Profils */}
      <section id="profils" className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>04 - Cas concrets</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>Ce que le référencement SEO change concrètement selon votre profil</h2>
            <p className="text-center max-w-2xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>Le SEO ne se déploie pas de la même façon selon que vous êtes artisan, consultant SEO freelance ou dirigeant de TPE. Voici les opportunités spécifiques à chaque profil.</p>
            <div className="grid gap-6 md:grid-cols-3">
              {profiles.map((p, i) => (
                <div key={i} className="rounded-2xl p-6 shadow-card border-t-4 border-primary" style={{ backgroundColor: "#E9F2F4" }}>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: "#2B1E3F" }}>{p.title}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2B1E3F", opacity: 0.5 }}>{p.sub}</p>
                  <ul className="space-y-2">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-1" />
                        <span style={{ color: "#2B1E3F", opacity: 0.7 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mt-4">
              <p className="font-bold text-primary mb-2">Votre métier a sa propre page</p>
              <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Nous créons des{" "}
                <Link to="/creation-site-web" className="text-primary font-semibold">sites web</Link>{" "}
                et des stratégies SEO adaptés à chaque activité :{" "}
                <Link to="/creation-site-web/metier/plombier" className="text-primary font-semibold">plombier</Link>,{" "}
                <Link to="/creation-site-web/metier/electricien" className="text-primary font-semibold">électricien</Link>,{" "}
                <Link to="/creation-site-web/metier/coach-sportif" className="text-primary font-semibold">coach sportif</Link>,{" "}
                <Link to="/creation-site-web/metier/decorateur-interieur" className="text-primary font-semibold">décorateur d'intérieur</Link>,{" "}
                <Link to="/creation-site-web/metier/climaticien" className="text-primary font-semibold">climaticien</Link>{" "}
                et bien d'autres sur notre page{" "}
                <Link to="/nos-metiers" className="text-primary font-semibold">nos métiers</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GoogleReviews */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#E9F2F4" />

      {/* 05 Mythes */}
      <section id="idees-recues" className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>05 - Idées reçues</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>Les 4 fausses croyances qui freinent les artisans et indépendants</h2>
            <div className="space-y-5">
              {myths.map((m, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-0 rounded-2xl border shadow-card overflow-hidden" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="p-6 bg-red-50/50 border-b md:border-b-0 md:border-r" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                    <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-700 mb-3">Mythe</span>
                    <h4 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{m.myth}</h4>
                    <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{m.mythDesc}</p>
                  </div>
                  <div className="p-6" style={{ backgroundColor: "#E9F2F4" }}>
                    <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-green-700 mb-3">Réalité</span>
                    <h4 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{m.reality}</h4>
                    <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{m.realityDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA texture 2 */}
      <section className="relative overflow-hidden py-14" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Vous vous reconnaissez dans ces freins ?</h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>On démystifie le référencement SEO et on vous accompagne pas à pas. Premier diagnostic gratuit en 48h.</p>
          <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/contact">Demander un audit SEO gratuit</Link>
          </Button>
        </div>
      </section>

      {/* 06 Comment démarrer */}
      <section id="demarrer" className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>06 - Passer à l'action</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>Par où commencer le référencement Google quand on est artisan ou indépendant ?</h2>
            <p className="text-center max-w-2xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>La bonne nouvelle : les premières actions SEO ne coutent que du temps. Voici la progression logique pour démarrer efficacement votre référencement naturel.</p>
            <div className="space-y-0">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-5 py-7 border-b last:border-0" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: "#2B1E3F" }}>{s.title}</h3>
                    <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="font-bold text-primary mb-2">Conseil pratique</p>
              <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Avant tout investissement SEO, vérifiez que votre{" "}
                <Link to="/creation-site-web" className="text-primary font-semibold">site web</Link>{" "}
                se charge en moins de 3 secondes sur mobile. Les{" "}
                <Link to="/blog/core-web-vitals-google-experience-utilisateur" className="text-primary font-semibold">Core Web Vitals</Link>{" "}
                sont devenus un critère de classement Google à part entière, et un site lent perd des positions indépendamment de la qualité de son contenu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GoogleMaps overlap */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="relative min-h-[360px] flex items-center">
              <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
                <img
                  src={imgGoogleMaps}
                  alt="SEO local Google Maps Boulogne-Billancourt Hauts-de-Seine 92"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={500}
                  height={360}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #F6F1E9 0%, rgba(246,241,233,0.3) 40%, transparent 70%)" }} />
              </div>
              <div className="relative z-10 max-w-xl space-y-5 py-10">
                <h2 style={{ color: "#2B1E3F" }}>Agence SEO et consultant référencement dans le 92 et à Paris</h2>
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Les recherches "près de moi" ont explosé de 500% en 5 ans. Nous accompagnons les professionnels de{" "}
                  <Link to="/agence-web-asnieres-sur-seine" className="text-primary font-semibold">Asnières-sur-Seine</Link>,{" "}
                  <Link to="/referencement-seo/boulogne-billancourt" className="text-primary font-semibold">Boulogne-Billancourt</Link>,{" "}
                  <Link to="/referencement-seo/neuilly-sur-seine" className="text-primary font-semibold">Neuilly-sur-Seine</Link>,{" "}
                  <Link to="/referencement-seo/levallois-perret" className="text-primary font-semibold">Levallois-Perret</Link>,{" "}
                  <Link to="/referencement-seo/clichy" className="text-primary font-semibold">Clichy</Link>,{" "}
                  <Link to="/referencement-seo/nanterre" className="text-primary font-semibold">Nanterre</Link>,{" "}
                  <Link to="/referencement-seo/suresnes" className="text-primary font-semibold">Suresnes</Link>{" "}
                  et{" "}
                  <Link to="/referencement-seo/courbevoie" className="text-primary font-semibold">Courbevoie</Link>{" "}
                  à dominer les résultats locaux de Google.
                </p>
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Agence SEO Hauts-de-Seine, nous combinons référencement naturel classique et{" "}
                  <Link to="/visibilite-ia" className="text-primary font-semibold">visibilité IA (GEO)</Link>{" "}
                  pour une présence maximale sur tous les moteurs. Les{" "}
                  <Link to="/blog/geo-ia-independant-asnieres-boulogne-billancourt" className="text-primary font-semibold">indépendants du 92</Link>{" "}
                  qui combinent les deux approches captent une audience que leurs concurrents n'atteignent pas encore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 Checklist */}
      <section id="checklist" className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>07 - Auto-évaluation</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>Votre checklist référencement SEO de départ</h2>
            <p className="text-center" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Chaque point non coché est une opportunité d'amélioration concrète. Un{" "}
              <Link to="/blog/comment-faire-audit-seo" className="text-primary font-semibold">audit SEO</Link>{" "}
              permet d'identifier précisément où vous en êtes sur chacun de ces points.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border p-4 shadow-card" style={{ backgroundColor: "#F6F1E9", borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-green-100 text-green-700 text-xs font-bold mt-0.5">✓</div>
                  <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA texture 3 */}
      <section className="relative overflow-hidden py-14" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Votre référencement SEO peut travailler pour vous dès aujourd'hui</h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>Nos experts analysent votre site, identifient les quick wins SEO et construisent une stratégie adaptée à votre activité, votre ville dans le 92 et votre budget.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/tarifs">Voir nos tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 08 FAQ */}
      <section id="faq" className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#2B1E3F", opacity: 0.5 }}>08 - Questions fréquentes</p>
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>Vos questions sur le référencement SEO et GEO, nos réponses honnêtes</h2>
            <div className="space-y-0">
              {faqItems.map((f, i) => (
                <div key={i} className="border-b first:border-t" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <h3 className="font-bold" style={{ color: "#2B1E3F" }}>{f.q}</h3>
                    <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: "#2B1E3F", opacity: 0.5 }} />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{f.a}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center">
              <Link to="/faq" className="text-primary font-semibold hover:underline">Voir toutes les questions fréquentes</Link>
            </p>
          </div>
        </div>
      </section>

      {/* GEO encart */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <h2 style={{ color: "#2B1E3F" }}>Au-delà du SEO : la visibilité dans les moteurs IA (GEO)</h2>
              <p className="leading-relaxed mt-3" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                ChatGPT, Perplexity, Gemini : ces{" "}
                <Link to="/visibilite-ia" className="text-primary font-semibold">moteurs génératifs</Link>{" "}
                deviennent un canal d'acquisition incontournable. Un artisan ou un indépendant qui apparaît dans les réponses IA gagne une visibilité que ses concurrents n'ont pas encore. La{" "}
                <Link to="/blog/geo-generative-engine-optimization-chatgpt-perplexity" className="text-primary font-semibold">Generative Engine Optimization</Link>{" "}
                est l'évolution naturelle du SEO pour 2026 et au-delà.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zones d'intervention */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>Agence SEO Hauts-de-Seine : nos zones d'intervention</h2>
          <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Nous proposons un{" "}
            <Link to="/nos-villes" className="text-primary font-semibold">référencement SEO local</Link>{" "}
            à Paris et dans toutes les communes des Hauts-de-Seine (92).
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/agence-web-asnieres-sur-seine", label: "SEO Asnières-sur-Seine" },
              { to: "/referencement-seo/boulogne-billancourt", label: "SEO Boulogne-Billancourt" },
              { to: "/referencement-seo/neuilly-sur-seine", label: "SEO Neuilly-sur-Seine" },
              { to: "/referencement-seo/levallois-perret", label: "SEO Levallois-Perret" },
              { to: "/referencement-seo/clichy", label: "SEO Clichy" },
              { to: "/referencement-seo/nanterre", label: "SEO Nanterre" },
              { to: "/referencement-seo/issy-les-moulineaux", label: "SEO Issy-les-Moulineaux" },
              { to: "/referencement-seo/courbevoie", label: "SEO Courbevoie" },
              { to: "/referencement-seo/suresnes", label: "SEO Suresnes" },
              { to: "/referencement-seo/la-garenne-colombes", label: "SEO La Garenne-Colombes" },
              { to: "/referencement-seo/rueil-malmaison", label: "SEO Rueil-Malmaison" },
              { to: "/referencement-seo/montrouge", label: "SEO Montrouge" },
              { to: "/referencement-seo/antony", label: "SEO Antony" },
              { to: "/referencement-seo/clamart", label: "SEO Clamart" },
              { to: "/referencement-seo/paris-1er", label: "SEO Paris 1er" },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: "#E9F2F4", color: "#2B1E3F", borderColor: "rgba(43,30,63,0.2)" }}
              >
                {c.label}
              </Link>
            ))}
            <Link
              to="/nos-villes"
              className="rounded-full btn-glow px-4 py-2 text-sm font-semibold gradient-primary"
              style={{ color: "#2B1E3F" }}
            >
              Voir toutes les villes →
            </Link>
          </div>
        </div>
      </section>

      {/* LocationSection */}
      <LocationSection backgroundColor="#E9F2F4" />
    </PageLayout>
  );
};

export default ReferencementSeo;
