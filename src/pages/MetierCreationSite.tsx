import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, Users, Target, BarChart3, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import metierComptable from "@/assets/metier-expert-comptable.webp";
import { getTradeBySlug, trades, tradeCategories } from "@/data/trades";
import { tradeGuideContent } from "@/data/tradeGuideContent";
import { Helmet } from "react-helmet-async";

const tradeFaqs: Record<string, { q: string; a: string }[]> = {
  artisanat: [
    { q: "Combien coûte un site web pour un artisan ?", a: "Nos forfaits démarrent avec un premier mois de mise en service puis 50€/mois tout compris : design sur-mesure, hébergement, maintenance et optimisation SEO. Pas de frais cachés." },
    { q: "Mon site sera-t-il visible sur Google ?", a: "Oui. Chaque site est optimisé pour le référencement local dès la conception. Nous ciblons les mots clés que vos clients tapent : 'plombier Paris', 'électricien 92', etc." },
    { q: "Puis-je montrer mes réalisations sur mon site ?", a: "Absolument. Nous intégrons un portfolio / galerie photos de vos chantiers. C'est votre meilleur argument commercial : vos clients veulent voir vos réalisations avant de vous contacter." },
    { q: "Faut-il être à l'aise avec l'informatique ?", a: "Pas du tout. Nous gérons tout : conception, mise en ligne, maintenance. Vous pouvez modifier vos textes simplement, et pour le reste, notre équipe s'en charge." },
  ],
  services: [
    { q: "Comment mettre en avant mes prestations sur mon site ?", a: "Nous créons des pages dédiées à chaque service que vous proposez, avec des descriptions détaillées, des tarifs et des appels à l'action clairs pour convertir les visiteurs en clients." },
    { q: "Puis-je intégrer la prise de rendez-vous en ligne ?", a: "Oui. Nous pouvons intégrer un système de réservation en ligne (Calendly, SimplyBook, etc.) directement sur votre site pour que vos clients prennent rendez-vous 24h/24." },
    { q: "Comment collecter des avis clients ?", a: "Nous mettons en place une stratégie de collecte d'avis Google et les affichons sur votre site. Les avis sont le facteur n°1 de confiance pour les nouveaux clients." },
    { q: "Mon site sera-t-il adapté au mobile ?", a: "100%. Tous nos sites sont responsive et pensés mobile-first. Plus de 70% des recherches locales se font sur smartphone." },
  ],
  sante: [
    { q: "Puis-je intégrer la prise de rendez-vous (Doctolib, etc.) ?", a: "Oui. Nous intégrons votre module de prise de rendez-vous (Doctolib, Crenolibre, etc.) directement sur votre site pour simplifier la prise de contact par vos patients." },
    { q: "Mon site doit-il respecter des réglementations ?", a: "Nous connaissons les contraintes réglementaires des professions de santé. Votre site respectera les règles déontologiques et RGPD applicables à votre profession." },
    { q: "Comment rassurer mes futurs patients en ligne ?", a: "En présentant votre parcours, vos spécialités, votre approche thérapeutique et des témoignages de patients. Un site bien conçu lève les freins et facilite le premier contact." },
    { q: "Le SEO est-il important pour un praticien de santé ?", a: "Essentiel. Vos patients vous cherchent sur Google : 'ostéopathe Paris 15', 'psychologue près de moi'. Un bon référencement local remplit votre agenda." },
  ],
  commerce: [
    { q: "Puis-je vendre en ligne avec mon site ?", a: "Oui. Nous créons des boutiques en ligne complètes avec catalogue produits, paiement sécurisé et gestion des commandes. Idéal pour compléter votre activité physique." },
    { q: "Comment attirer plus de clients dans mon commerce ?", a: "Un site optimisé SEO local + une fiche Google Business bien gérée vous rendent visible dans les recherches 'près de moi'. C'est le duo gagnant pour le commerce de proximité." },
    { q: "Puis-je mettre mon menu / carte en ligne ?", a: "Bien sûr. Nous créons des pages de menu interactives et faciles à mettre à jour. Vos clients consultent votre carte avant de venir, c'est devenu un réflexe." },
    { q: "Comment gérer les avis négatifs ?", a: "Nous vous aidons à mettre en place une stratégie de gestion des avis : collecte proactive, réponses aux avis négatifs et mise en valeur des retours positifs sur votre site." },
  ],
  conseil: [
    { q: "Comment montrer mon expertise sur mon site ?", a: "En publiant des études de cas, des articles de blog et des témoignages clients. Votre site devient une vitrine de votre savoir-faire qui génère de la confiance avant même le premier contact." },
    { q: "Puis-je intégrer un blog ?", a: "Oui, et nous le recommandons fortement. Un blog positionné sur vos mots clés métier attire du trafic qualifié et démontre votre expertise. C'est un investissement SEO majeur." },
    { q: "Comment me différencier des grandes entreprises ?", a: "Votre atout est la proximité et la personnalisation. Un site qui met en avant votre parcours, votre approche et vos résultats concrets vous positionne comme l'alternative de confiance." },
    { q: "Faut-il être présent sur LinkedIn ET avoir un site ?", a: "Oui. LinkedIn est votre réseau, votre site est votre vitrine. Le site vous appartient, vous contrôlez le contenu et le référencement. C'est la base de votre présence digitale." },
  ],
};

const getDefaultFaqs = () => [
  { q: "Combien coûte la création de mon site ?", a: "Nos forfaits démarrent avec un premier mois de mise en service puis 50€/mois tout compris : design, hébergement, maintenance et SEO." },
  { q: "En combien de temps mon site sera-t-il en ligne ?", a: "Un site vitrine est livré en 2 à 3 semaines. Nous vous tenons informé à chaque étape." },
  { q: "Mon site sera-t-il optimisé pour Google ?", a: "Oui. Le SEO local est intégré dès la conception : balises, vitesse, mobile, fiche Google Business." },
  { q: "Pourrai-je modifier mon site ?", a: "Oui. Vous pouvez modifier vos textes facilement. Pour le reste, notre équipe intervient sous 48h." },
];

const MetierCreationSite = () => {
  const { metier } = useParams<{ metier: string }>();
  const trade = metier ? getTradeBySlug(metier) : undefined;

  if (!trade) return <Navigate to="/nos-metiers" replace />;

  const relatedTrades = trades
    .filter((t) => t.category === trade.category && t.slug !== trade.slug)
    .slice(0, 6);

  const faqs = tradeFaqs[trade.category] || getDefaultFaqs();

  // Vary content per category for uniqueness
  const benefitVariants: Record<string, { title: string; items: string[] }> = {
    artisanat: { title: "Les avantages concrets d'un site web pour votre activité artisanale", items: [
      "Vos chantiers en photos : le portfolio est votre meilleur commercial",
      "Devis en ligne : recevez des demandes 24h/24, même le week-end",
      "Zones d'intervention claires : vos clients savent si vous intervenez chez eux",
      "Certifications et labels mis en avant : Qualibat, RGE, etc.",
      "Témoignages clients vérifiés qui rassurent les nouveaux prospects",
    ]},
    services: { title: "Comment un site web développe votre clientèle de services", items: [
      "Réservation en ligne : vos clients prennent rendez-vous à toute heure",
      "Galerie avant/après : montrez la transformation que vous apportez",
      "Tarifs transparents : les clients savent à quoi s'attendre",
      "Avis Google intégrés : la preuve sociale qui convertit",
      "Blog conseils : positionnez-vous comme expert de votre domaine",
    ]},
    sante: { title: "Un site web au service de vos patients", items: [
      "Prise de rendez-vous en ligne intégrée (Doctolib, etc.)",
      "Présentation de vos spécialités et de votre approche thérapeutique",
      "Informations pratiques : accès, horaires, tarifs, remboursements",
      "Contenu éducatif qui rassure et informe vos patients",
      "Respect des règles déontologiques et RGPD",
    ]},
    commerce: { title: "Boostez votre commerce avec un site web performant", items: [
      "Click & Collect : commande en ligne et retrait en boutique",
      "Menu / carte en ligne toujours à jour",
      "Horaires, adresse et itinéraire Google Maps intégrés",
      "Livraison locale : élargissez votre zone de chalandise",
      "Programme fidélité et newsletter pour garder le contact",
    ]},
    conseil: { title: "Votre site web, vitrine de votre expertise", items: [
      "Études de cas détaillées qui démontrent vos résultats",
      "Blog expert qui attire du trafic qualifié",
      "Formulaire de prise de contact qualifié",
      "Intégration LinkedIn et réseaux professionnels",
      "Pages de services détaillées par domaine d'intervention",
    ]},
  };

  const benefits = benefitVariants[trade.category] || benefitVariants.conseil;

  return (
    <PageLayout>
      <Helmet>
        <title>{`Création site internet ${trade.nameShort} | Déclic Digital Paris`}</title>
        <meta name="description" content={`Création de site web professionnel pour ${trade.name.toLowerCase()}. ${trade.whyWebsite.slice(0, 100)}. Devis gratuit en 24h.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/metier/${trade.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: `Création de site internet pour ${trade.name.toLowerCase()}`,
          provider: { "@type": "LocalBusiness", name: "Déclic Digital", url: "https://declicdigital.net" },
          areaServed: [{ "@type": "City", name: "Paris" }, { "@type": "AdministrativeArea", name: "Hauts-de-Seine" }],
        })}</script>
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Création de site web", href: "/creation-site-web" },
        { label: "Nos métiers", href: "/nos-metiers" },
        { label: trade.nameShort },
      ]} />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                {trade.icon} Site web pour {trade.name.toLowerCase()}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                Création de site internet pour {trade.name.toLowerCase()} : attirez plus de clients
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                {trade.whyWebsite} Déclic Digital crée des sites web professionnels et optimisés <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">SEO</Link> spécifiquement adaptés aux {trade.name.toLowerCase()}s à Paris et dans les Hauts-de-Seine (92). <Link to="/tarifs" className="text-primary font-semibold hover:underline">Consultez nos tarifs</Link>.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/contact">Devis gratuit {trade.nameShort.toLowerCase()}</Link>
                </Button>
                <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-foreground hover:bg-secondary transition-colors">
                  Audit SEO gratuit
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="rounded-2xl bg-card p-8 shadow-card text-center max-w-sm">
                <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Déclic Digital - site web ${trade.nameShort.toLowerCase()}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">J'accompagne les {trade.name.toLowerCase()}s dans leur visibilité en ligne avec des sites performants et un référencement ciblé.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pourquoi un site web */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          Pourquoi un {trade.name.toLowerCase()} a besoin d'un site internet en 2026
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Sans site web, vous êtes invisible pour ces clients potentiels qui tapent "{trade.clientSearch.split(",")[0]}" dans Google.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Vitrine professionnelle 24h/24", desc: `Présentez vos services ${trade.description} avec un design qui inspire confiance. Première impression décisive en moins de 3 secondes.` },
            { icon: Smartphone, title: "Clients mobiles captés", desc: "Plus de 70% des recherches locales se font sur mobile. Votre site responsive s'adapte à tous les écrans pour ne perdre aucun prospect." },
            { icon: TrendingUp, title: "SEO local optimisé", desc: `Apparaissez en première page Google quand un client cherche "${trade.seoKeywords[0]}". Le référencement local est intégré dès la conception.` },
            { icon: Zap, title: "Prospects qualifiés", desc: "Formulaire de contact, bouton d'appel, demande de devis : chaque visiteur peut devenir un client en quelques clics." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Avantages spécifiques au métier */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold md:text-4xl text-center mb-8">
            {benefits.title}
          </h2>
          <div className="space-y-3">
            {benefits.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-card">
                <CheckCircle size={20} className="text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Contenu SEO long */}
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">
            Comment un site web transforme l'activité d'un {trade.name.toLowerCase()}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            En tant que {trade.name.toLowerCase()} indépendant, votre carnet de commandes dépend de votre capacité à être trouvé par les bonnes personnes au bon moment. Aujourd'hui, ce moment se passe sur Google. Quand un prospect tape "{trade.clientSearch.split(",")[0]}", il s'attend à trouver un professionnel avec un site clair, des références et un moyen de contact simple.
          </p>
          <h3 className="text-xl font-bold">Vos clients vous cherchent sur Google</h3>
          <p className="text-muted-foreground leading-relaxed">
            Les recherches fréquentes pour votre métier incluent : {trade.seoKeywords.map(k => `"${k}"`).join(", ")}. Si votre site n'apparaît pas sur ces requêtes, vos concurrents récupèrent ces clients à votre place. Un site bien optimisé pour le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement naturel</Link> vous positionne durablement sur ces mots clés.
          </p>
          <h3 className="text-xl font-bold">Apparaître dans Google Maps</h3>
          <p className="text-muted-foreground leading-relaxed">
            Pour un {trade.name.toLowerCase()}, le pack local Google Maps (les 3 résultats avec la carte) est crucial. 42% des clics vont vers ces résultats. Pour y apparaître, vous avez besoin d'un site web optimisé, d'une fiche Google Business complète et d'avis clients positifs. Nous mettons tout cela en place pour vous.
          </p>

          {/* Map embed */}
          <div className="pt-2">
            <MapEmbed
              title="Notre agence à Paris 15e"
              subtitle={`Nous accompagnons les ${trade.name.toLowerCase()}s de Paris et du 92 dans leur visibilité en ligne.`}
            />
          </div>

          <h3 className="text-xl font-bold">Un investissement rentable pour un {trade.name.toLowerCase()}</h3>
          <p className="text-muted-foreground leading-relaxed">
            Un site web professionnel coûte bien moins cher qu'une campagne publicitaire et génère des résultats durables. Chez Déclic Digital, nos <Link to="/tarifs" className="text-primary font-semibold hover:underline">forfaits démarrent à 50€/mois</Link> et incluent le design, l'hébergement, la maintenance et l'optimisation SEO. En moyenne, nos clients {trade.description} obtiennent leurs premières demandes de contact dans les 2 à 4 semaines suivant la mise en ligne.
          </p>
          <h3 className="text-xl font-bold">Ce que nous incluons dans votre site de {trade.name.toLowerCase()}</h3>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "Design professionnel sur-mesure adapté à votre métier",
              "Pages de services détaillées et optimisées SEO",
              "Galerie photos / portfolio de vos réalisations",
              "Formulaire de contact et bouton d'appel direct",
              "Fiche Google Business optimisée",
              "Compatibilité mobile et vitesse de chargement optimale",
              "Référencement local sur vos mots clés métier",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      {/* Guide unique par métier */}
      {tradeGuideContent[trade.slug] && (
        <SectionWrapper>
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl text-center">
              {tradeGuideContent[trade.slug].title}
            </h2>
            {tradeGuideContent[trade.slug].sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold">{section.heading}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
              </div>
            ))}
            <p className="text-muted-foreground leading-relaxed">
              Prêt à passer à l'action ? <Link to="/contact" className="text-primary font-semibold hover:underline">Demandez votre devis gratuit</Link>, consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
            </p>
          </div>
        </SectionWrapper>
      )}

      {/* Process */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Notre processus en 4 étapes pour votre site de {trade.name.toLowerCase()}</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Un accompagnement personnalisé de A à Z. Découvrez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre équipe</Link>.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, title: "1. Échange et stratégie", desc: "Nous analysons votre activité, votre zone de chalandise et vos concurrents pour définir la meilleure stratégie digitale." },
            { icon: Monitor, title: "2. Design sur-mesure", desc: `Un design professionnel qui reflète l'image de votre activité ${trade.description}. Vous validez chaque maquette.` },
            { icon: Zap, title: "3. Développement & SEO", desc: "Développement rapide, optimisation SEO intégrée, compatibilité mobile. Votre site est prêt en 1 à 2 semaines." },
            { icon: BarChart3, title: "4. Mise en ligne & suivi", desc: "Publication, indexation Google, et suivi de vos performances. Nous restons disponibles pour les ajustements." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-white">
                <item.icon size={22} />
              </div>
              <h3 className="mb-2 font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Questions fréquentes : site web pour {trade.name.toLowerCase()}
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl bg-background p-6 shadow-card">
              <summary className="flex cursor-pointer items-center gap-3 font-bold text-foreground list-none">
                <HelpCircle size={18} className="text-primary shrink-0" />
                {faq.q}
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed pl-8">{faq.a}</p>
            </details>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link to="/faq" className="text-primary font-semibold hover:underline">Voir toutes les questions fréquentes →</Link>
        </p>
      </SectionWrapper>

      {/* Avis */}
      <GoogleReviewsSection compact maxReviews={3} />

      {/* Métiers liés */}
      {relatedTrades.length > 0 && (
        <SectionWrapper className="bg-section-blue">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Sites web pour d'autres métiers {tradeCategories.find(c => c.key === trade.category)?.label.toLowerCase()}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {relatedTrades.map((t) => (
              <Link
                key={t.slug}
                to={`/creation-site-web/metier/${t.slug}`}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
              >
                {t.icon} Site web {t.nameShort}
              </Link>
            ))}
            <Link to="/nos-metiers" className="rounded-full gradient-primary btn-glow px-4 py-2 text-sm font-semibold text-white shadow-glow">
              Voir tous les métiers →
            </Link>
          </div>
        </SectionWrapper>
      )}

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container flex flex-col items-center text-center">
          <img src={geoffreyPhoto} alt="Geoffrey, fondateur Déclic Digital" className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg mb-3" loading="lazy" />
          <p className="text-sm font-semibold text-white mb-2">Geoffrey, Expert Produit Google</p>
          <h2 className="mb-4 text-3xl font-extrabold text-white">Prêt à lancer votre site de {trade.name.toLowerCase()} ?</h2>
          <p className="mb-8 text-white/80">Recevez un devis personnalisé gratuit sous 24h. Sans engagement.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
              <Link to="/contact">Demander un devis gratuit</Link>
            </Button>
            <Link to="/realisations" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MetierCreationSite;
