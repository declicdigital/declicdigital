import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Loader2, BarChart3, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import metierComptable from "@/assets/metier-expert-comptable.webp";
import metierPlombier from "@/assets/metier-plombier.webp";
import metierElectricien from "@/assets/metier-electricien.webp";
import { getTradeBySlug, trades, tradeCategories } from "@/data/trades";
import { getTradeSeoMeta } from "@/data/tradeSeoMeta";
import imgPlombierPortrait from "@/assets/plombier-paris-11-salle-de-bain.webp";
import imgArtisanBoutique from "@/assets/artisan-ebeniste-paris-boutique.webp";
import imgChefPortrait from "@/assets/chef-cuisinier-portrait-cuisine-paris.webp";
import imgEsteticienne from "@/assets/estheticienne-beaute-paris-independante.webp";
import imgGraphiste from "@/assets/graphiste-creation-site-web-iMac.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import { Helmet } from "react-helmet-async";

type GuideData = { title: string; sections: { heading: string; text: string }[] } | null;

const TradeGuideSection = ({ tradeSlug }: { tradeSlug: string }) => {
  const [guide, setGuide] = useState<GuideData>(null);
  useEffect(() => {
    import("@/data/tradeGuideContent").then((m) => {
      const data = m.tradeGuideContent[tradeSlug];
      if (data) setGuide(data);
    });
  }, [tradeSlug]);
  if (!guide) return null;
  return (
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center" style={{ color: "#2B1E3F" }}>{guide.title}</h2>
          {guide.sections.map((section, i) => (
            <div key={i}>
              <h3 style={{ color: "#2B1E3F" }}>{section.heading}</h3>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{section.text}</p>
            </div>
          ))}
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Prêt à passer à l'action ? <Link to="/rendez-vous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Prenez rendez-vous</Link>, consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
          </p>
        </div>
      </div>
    </section>
  );
};

const tradeFaqs: Record<string, { q: string; a: string }[]> = {
  artisanat: [
    { q: "Combien coûte un site web pour un artisan ?", a: "Nos forfaits démarrent avec un premier mois de mise en service puis 50€ par mois tout compris : design sur-mesure, hébergement, maintenance et optimisation SEO. Pas de frais cachés." },
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
  { q: "Combien coûte la création de mon site ?", a: "Nos forfaits démarrent avec un premier mois de mise en service puis 50€ par mois tout compris : design, hébergement, maintenance et SEO." },
  { q: "En combien de temps mon site sera-t-il en ligne ?", a: "Un site vitrine est livré en 2 à 3 semaines. Nous vous tenons informé à chaque étape." },
  { q: "Mon site sera-t-il optimisé pour Google ?", a: "Oui. Le SEO local est intégré dès la conception : balises, vitesse, mobile, fiche Google Business." },
  { q: "Pourrai-je modifier mon site ?", a: "Oui. Vous pouvez modifier vos textes facilement. Pour le reste, notre équipe intervient sous 48h." },
];

const MetierCreationSite = () => {
  const { metier } = useParams<{ metier: string }>();
  const trade = metier ? getTradeBySlug(metier) : undefined;

  if (!trade) return <Navigate to="/nos-metiers" replace />;

  const seo = getTradeSeoMeta(trade);

  const relatedTrades = trades
    .filter((t) => t.category === trade.category && t.slug !== trade.slug)
    .slice(0, 6);

  const faqs = tradeFaqs[trade.category] || getDefaultFaqs();

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
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="index, follow" />
        {/* Canonical sans trailing slash */}
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/metier/${trade.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: `Création de site internet pour ${trade.name.toLowerCase()}`,
          provider: { "@type": "LocalBusiness", name: "Déclic Digital", url: "https://declicdigital.net" },
          areaServed: [{ "@type": "City", name: "Paris" }, { "@type": "AdministrativeArea", name: "Hauts-de-Seine" }],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Création de site web", href: "/creation-site-web" },
        { label: "Nos métiers", href: "/nos-metiers" },
        { label: trade.nameShort },
      ]} />

      {/* Section 1 — Hero #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                {trade.icon} Site web pour {trade.name.toLowerCase()}
              </span>
              <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
                Création de site internet pour {trade.name.toLowerCase()} : attirez plus de clients
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
                {trade.whyWebsite} Déclic Digital crée des sites web professionnels et optimisés <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO</Link> spécifiquement adaptés aux {trade.name.toLowerCase()}s à Paris et dans les Hauts-de-Seine (92). <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Consultez nos tarifs</Link>.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/rendez-vous">Devis gratuit {trade.nameShort.toLowerCase()}</Link>
                </Button>
                <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/contact">Audit SEO gratuit</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              {(() => {
                const categoryImages: Record<string, string> = {
                  artisanat: imgPlombierPortrait,
                  services: imgEsteticienne,
                  sante: imgEsteticienne,
                  commerce: imgChefPortrait,
                  conseil: imgGraphiste,
                  tech: imgGraphiste,
                  immobilier: imgArtisanBoutique,
                  transport: imgArtisanBoutique,
                };
                const heroImg = ({"expert-comptable": metierComptable, "plombier": metierPlombier, "electricien": metierElectricien} as Record<string, string>)[trade.slug] || categoryImages[trade.category];
                return heroImg ? (
                  <div className="relative overflow-hidden rounded-2xl group w-full max-w-md" style={{ aspectRatio: "3/4", maxHeight: "480px", boxShadow: "0 8px 40px rgba(43,30,63,0.15)" }}>
                    <img src={heroImg} alt={`${trade.name} - création site web professionnel`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(15,10,46,0.3), rgba(79,195,195,0.15))" }} />
                  </div>
                ) : (
                  <div className="rounded-2xl p-8 text-center max-w-sm" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                    <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Déclic Digital - site web ${trade.nameShort.toLowerCase()}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
                    <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
                    <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — Pourquoi un site #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
            Pourquoi un {trade.name.toLowerCase()} a besoin d'un site internet en 2026
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Sans site web, vous êtes invisible pour ces clients potentiels qui tapent "{trade.clientSearch.split(",")[0]}" dans Google.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, title: "Vitrine professionnelle 24h/24", desc: `Présentez vos services ${trade.description} avec un design qui inspire confiance. Première impression décisive en moins de 3 secondes.` },
              { icon: Smartphone, title: "Clients mobiles captés", desc: "Plus de 70% des recherches locales se font sur mobile. Votre site responsive s'adapte à tous les écrans pour ne perdre aucun prospect." },
              { icon: TrendingUp, title: "SEO local optimisé", desc: `Apparaissez en première page Google quand un client cherche "${trade.seoKeywords[0]}". Le référencement local est intégré dès la conception.` },
              { icon: Zap, title: "Prospects qualifiés", desc: "Formulaire de contact, bouton d'appel, demande de devis : chaque visiteur peut devenir un client en quelques clics." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                  <item.icon size={26} />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Avantages métier #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center mb-8" style={{ color: "#2B1E3F" }}>{benefits.title}</h2>
            <div className="space-y-3">
              {benefits.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                  <CheckCircle size={20} className="mt-0.5 shrink-0" style={{ color: "#4361EE" }} />
                  <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Contenu SEO + Map #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              Comment un site web transforme l'activité d'un {trade.name.toLowerCase()}
            </h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              En tant que {trade.name.toLowerCase()} indépendant, votre carnet de commandes dépend de votre capacité à être trouvé par les bonnes personnes au bon moment. Aujourd'hui, ce moment se passe sur Google. Quand un prospect tape "{trade.clientSearch.split(",")[0]}", il s'attend à trouver un professionnel avec un site clair, des références et un moyen de contact simple.
            </p>
            <h3 style={{ color: "#2B1E3F" }}>Vos clients vous cherchent sur Google</h3>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Les recherches fréquentes pour votre métier incluent : {trade.seoKeywords.map((k: string) => `"${k}"`).join(", ")}. Si votre site n'apparaît pas sur ces requêtes, vos concurrents récupèrent ces clients à votre place. Un site bien optimisé pour le <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement naturel</Link> vous positionne durablement sur ces mots clés.
            </p>
            <h3 style={{ color: "#2B1E3F" }}>Apparaître dans Google Maps</h3>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Pour un {trade.name.toLowerCase()}, le pack local Google Maps (les 3 résultats avec la carte) est crucial. 42% des clics vont vers ces résultats. Pour y apparaître, vous avez besoin d'un site web optimisé, d'une fiche Google Business complète et d'avis clients positifs. Nous mettons tout cela en place pour vous.
            </p>
            <div className="pt-2">
              <MapEmbed title="Notre agence à Paris 15e" subtitle={`Nous accompagnons les ${trade.name.toLowerCase()}s de Paris et du 92 dans leur visibilité en ligne.`} />
            </div>
            <h3 style={{ color: "#2B1E3F" }}>Un investissement rentable pour un {trade.name.toLowerCase()}</h3>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Un site web professionnel coûte bien moins cher qu'une campagne publicitaire et génère des résultats durables. Chez Déclic Digital, nos <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>forfaits démarrent à 50€/mois</Link> et incluent le design, l'hébergement, la maintenance et l'optimisation SEO.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — Guide métier (lazy) */}
      <TradeGuideSection tradeSlug={trade.slug} />

      {/* Section 6 — Process #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>Notre processus en 4 étapes pour votre site de {trade.name.toLowerCase()}</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Un accompagnement personnalisé de A à Z. Découvrez <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>notre équipe</Link>.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "1. Échange et stratégie", desc: "Nous analysons votre activité, votre zone de chalandise et vos concurrents pour définir la meilleure stratégie digitale." },
              { icon: Monitor, title: "2. Design sur-mesure", desc: `Un design professionnel qui reflète l'image de votre activité ${trade.description}. Vous validez chaque maquette.` },
              { icon: Zap, title: "3. Développement & SEO", desc: "Développement rapide, optimisation SEO intégrée, compatibilité mobile. Votre site est prêt en 1 à 2 semaines." },
              { icon: BarChart3, title: "4. Mise en ligne & suivi", desc: "Publication, indexation Google, et suivi de vos performances. Nous restons disponibles pour les ajustements." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami" style={{ color: "#2B1E3F" }}>
                  <item.icon size={22} />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — FAQ #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Questions fréquentes : site web pour {trade.name.toLowerCase()}
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl p-6" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <summary className="flex cursor-pointer items-center gap-3 font-bold list-none" style={{ color: "#2B1E3F" }}>
                  <HelpCircle size={18} className="shrink-0" style={{ color: "#4361EE" }} />
                  {faq.q}
                </summary>
                <p className="mt-3 leading-relaxed pl-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center mt-6">
            <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Voir toutes les questions fréquentes →</Link>
          </p>
        </div>
      </section>

      {/* Section 8 — Avis Google #F6F1E9 */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#F6F1E9" />

      {/* Section 9 — Métiers liés #E9F2F4 */}
      {relatedTrades.length > 0 && (
        <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
              Sites web pour d'autres métiers {tradeCategories.find((c: any) => c.key === trade.category)?.label.toLowerCase()}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTrades.map((t: any) => (
                <Link key={t.slug} to={`/creation-site-web/metier/${t.slug}`} className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#F6F1E9", color: "#2B1E3F" }}>
                  {t.icon} Site web {t.nameShort}
                </Link>
              ))}
              <Link to="/nos-metiers" className="rounded-full gradient-primary btn-glow px-4 py-2 text-sm font-bold shadow-glow" style={{ color: "#2B1E3F" }}>
                Voir tous les métiers →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA texture — skip alternance */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <img src={geoffreyPhoto} alt="Geoffrey, fondateur Déclic Digital" className="w-32 h-32 rounded-full object-cover border-2 shadow-lg mb-4" style={{ borderColor: "rgba(43,30,63,0.3)" }} loading="lazy" />
          <p className="text-sm font-semibold mb-2" style={{ color: "#2B1E3F" }}>Geoffrey, Expert Produit Google</p>
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Prêt à lancer votre site de {trade.name.toLowerCase()} ?</h2>
          <p className="mb-8 max-w-xl" style={{ color: "#2B1E3F", opacity: 0.7 }}>Recevez un devis personnalisé gratuit sous 24h. Sans engagement.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/realisations">Voir nos réalisations</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MetierCreationSite;
