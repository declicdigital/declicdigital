import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { getCityBySlug, cities } from "@/data/cities";
import { cityContent } from "@/data/cityContent";
import { getCityGuide } from "@/data/cityGuideContent";
import { Helmet } from "react-helmet-async";

const creationFaqsByRegion: Record<string, { q: string; a: string }[]> = {
  paris: [
    { q: "Combien coûte un site web professionnel à Paris ?", a: "Chez Déclic Digital, nos forfaits démarrent avec un premier mois de mise en service puis 50€/mois tout compris : design, hébergement, maintenance et optimisation SEO. Pas de mauvaise surprise." },
    { q: "Combien de temps pour créer mon site ?", a: "Un site vitrine est livré en 2 à 3 semaines. Un site e-commerce ou sur-mesure peut prendre 4 à 6 semaines. Nous vous tenons informé à chaque étape via votre espace client." },
    { q: "Mon site sera-t-il visible sur Google ?", a: "Oui. Chaque site est optimisé pour le référencement local dès sa conception : balises SEO, vitesse de chargement, compatibilité mobile, fiche Google Business. Nous travaillons votre positionnement dès le premier jour." },
    { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui, nous vous fournissons un accès simple pour modifier vos textes et images. Pour les modifications plus importantes, notre équipe intervient dans les 48h, inclus dans votre forfait." },
    { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Nous travaillons par étapes avec validation à chaque phase. Vous voyez et approuvez le design avant le développement. Si le résultat final ne correspond pas au cahier des charges validé, nous corrigeons sans frais supplémentaires." },
  ],
  "hauts-de-seine": [
    { q: "Intervenez-vous dans toutes les villes du 92 ?", a: "Oui. Nous accompagnons les TPE et indépendants dans toutes les communes des Hauts-de-Seine : Boulogne-Billancourt, Nanterre, Issy-les-Moulineaux, Levallois-Perret, et toutes les autres." },
    { q: "Faut-il être à Paris pour travailler avec vous ?", a: "Non. Nous travaillons principalement à distance via visioconférence et notre espace client en ligne. Nous pouvons aussi nous rencontrer dans notre agence à Paris 15e si vous le souhaitez." },
    { q: "Un site web est-il vraiment utile pour une petite entreprise du 92 ?", a: "Plus que jamais. 97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Sans site, vous laissez vos concurrents capter ces clients. Le retour sur investissement est rapide." },
    { q: "Proposez-vous aussi le référencement SEO ?", a: "Oui. Chaque site que nous créons est optimisé SEO dès la conception. Nous proposons aussi des prestations de référencement avancé pour les TPE qui veulent aller plus loin." },
    { q: "Que comprend le forfait mensuel ?", a: "Le forfait de 50€/mois inclut l'hébergement, la maintenance technique, les mises à jour de sécurité, le support par email, et les modifications mineures de contenu. Tout est compris." },
  ],
};

const VilleCreationSite = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/creation-site-web" replace />;

  const content = cityContent[city.slug];
  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);
  const faqs = creationFaqsByRegion[city.region] || creationFaqsByRegion.paris;

  return (
    <PageLayout>
      <Helmet>
        <title>{
          city.slug === "paris-1er" ? "Création site internet Paris 1er | TPE & artisans" :
          city.slug === "paris-3eme" ? "Création site internet Paris 3ème | artisans & TPE" :
          city.slug === "boulogne-billancourt" ? "Création site internet Boulogne-Billancourt | TPE" :
          `Création site internet ${city.nameShort} | artisans & TPE`
        }</title>
        <meta name="description" content={
          city.slug === "paris-1er" ? "Créez votre site web professionnel dans le 1er arrondissement de Paris. Déclic Digital accompagne les indépendants et TPE. Devis gratuit." :
          city.slug === "paris-3eme" ? "Votre site web professionnel dans le Marais. Déclic Digital accompagne les artisans et TPE du 3ème arrondissement de Paris. Devis gratuit." :
          city.slug === "boulogne-billancourt" ? "Agence web à Boulogne-Billancourt pour TPE et artisans. Déclic Digital crée votre site professionnel et améliore votre visibilité Google." :
          `Agence web pour les TPE et artisans de ${city.nameShort}. Déclic Digital crée votre site professionnel et améliore votre référencement Google local.`
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/${city.slug}`} />
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Création de site web", href: "/creation-site-web" },
        { label: city.nameShort },
      ]} />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence web {city.description}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                {`Création de site internet pour les artisans et TPE de ${city.nameShort}`}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                {content?.creationIntro || `Vous êtes une TPE ou un indépendant ${city.description} ? Déclic Digital crée votre site internet professionnel, responsive et optimisé pour Google. Attirez enfin les bons clients grâce à un site qui travaille pour vous.`}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/contact">Devis création de site</Link>
                </Button>
                <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-foreground hover:bg-secondary transition-colors">
                  Audit SEO gratuit
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="rounded-2xl bg-card p-8 shadow-card text-center max-w-sm">
                <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Déclic Digital - création site web ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">Fondateur de Déclic Digital, j'accompagne les entreprises {city.description} dans leur transformation digitale.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pourquoi un site web */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          {`Pourquoi les professionnels de ${city.nameShort} ont besoin d'un site web`}
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          {content?.creationWhyText || `Un site internet professionnel est indispensable pour les entreprises ${city.description}. Il vous permet d'être trouvé par vos clients locaux et de vous démarquer de la concurrence.`}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Design professionnel", desc: `Un site qui reflète le sérieux de votre entreprise ${city.description}. Première impression décisive en moins de 3 secondes.` },
            { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur. Plus de 70% du trafic web est mobile." },
            { icon: TrendingUp, title: "Optimisé SEO", desc: `Référencement local pour apparaître en première page Google sur "${city.nameShort}" et vos mots clés métier.` },
            { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement optimisé (LCP < 2,5s) pour une meilleure expérience et un meilleur positionnement Google." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-background p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Ce que nous livrons */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          Ce que comprend votre site web à {city.nameShort}
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Chaque site est conçu sur-mesure, optimisé pour le référencement local et livré en 2 à 3 semaines.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Site vitrine", desc: `Présentez votre activité ${city.description} avec un site élégant et optimisé. Idéal pour les artisans, professions libérales et commerces locaux.`, features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps intégrée", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"] },
            { title: "Site e-commerce", desc: `Vendez vos produits en ligne depuis ${city.nameShort}. Boutique en ligne complète avec paiement sécurisé et gestion des stocks.`, features: ["Catalogue produits illimité", "Paiement sécurisé (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"] },
            { title: "Site sur mesure", desc: `Un site web unique pour votre entreprise ${city.description}. Fonctionnalités avancées selon vos besoins spécifiques.`, features: ["Fonctionnalités sur mesure", "Espace client / réservation", "Intégrations API tierces", "Évolutif et scalable", "Formation à l'utilisation", "Support technique dédié"] },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-8 shadow-card">
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground mb-4">{item.desc}</p>
              <ul className="space-y-2">
                {item.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-primary shrink-0" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Contenu SEO unique + Map */}
      {content && (
        <SectionWrapper className="bg-section-blue">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl text-center">
              Référencement local {city.nameShort} : apparaissez dans Google Maps
            </h2>
            {content.creationSeoText.map((text, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{text}</p>
            ))}
            <p className="text-muted-foreground leading-relaxed">
              Un site web seul ne suffit pas : il doit être accompagné d'une fiche Google Business Profile optimisée pour apparaître dans le pack local Google Maps. Nous créons et optimisons votre fiche avec photos professionnelles, catégorie adaptée, zone de service et collecte d'avis clients.
            </p>

            {/* Map embed */}
            <div className="pt-4">
              <MapEmbed
                title="Déclic Digital, votre agence web"
                subtitle={`Basés à Paris 15e, nous accompagnons les professionnels de ${city.nameShort} dans leur visibilité en ligne.`}
              />
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Découvrez nos <Link to="/tarifs" className="text-primary font-semibold hover:underline">tarifs adaptés aux TPE</Link>, nos <Link to="/realisations" className="text-primary font-semibold hover:underline">réalisations</Link> ou demandez un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link> pour évaluer votre visibilité actuelle.
            </p>
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <p className="text-sm font-semibold text-primary mb-1">Le saviez-vous ?</p>
              <p className="text-muted-foreground text-sm">{content.localFact}</p>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Guide SEO long - ville création */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">
            Tout savoir sur la création de site internet à {city.nameShort}
          </h2>

          <h3 className="text-xl font-bold">Pourquoi un site web est devenu indispensable pour les entreprises de {city.nameShort}</h3>
          <p className="text-muted-foreground leading-relaxed">
            En 2026, la présence en ligne n'est plus une option pour les professionnels {city.description}. Les études montrent que 97% des consommateurs effectuent une recherche sur internet avant de contacter un prestataire local. Que vous soyez artisan, commerçant, profession libérale ou consultant, vos clients potentiels vous cherchent sur Google en tapant des requêtes comme {content?.targetKeywords?.slice(0, 2).map(k => `"${k}"`).join(" ou ") || `"création site web ${city.nameShort}"`}. Sans site web professionnel, ces prospects contactent directement vos concurrents qui, eux, sont visibles en ligne. Un <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site internet bien conçu</Link> transforme cette visibilité en demandes de devis, en appels et en clients fidèles.
          </p>

          <h3 className="text-xl font-bold">Le tissu économique de {city.nameShort} et les opportunités digitales</h3>
          <p className="text-muted-foreground leading-relaxed">
            {city.region === "paris"
              ? `${city.nameShort} est un arrondissement avec une forte densité de commerces, de professions libérales et d'artisans. La concurrence y est vive, mais les opportunités sont immenses pour ceux qui investissent dans leur présence digitale. Les résidents et les travailleurs du quartier utilisent quotidiennement Google pour trouver des services de proximité : plombier, coiffeur, restaurant, avocat, comptable. Chaque recherche est une opportunité de gagner un nouveau client.`
              : `${city.nameShort} fait partie des villes les plus dynamiques des Hauts-de-Seine. Son tissu économique diversifié, composé de TPE, d'artisans, de professions libérales et de commerces de proximité, crée un environnement concurrentiel où la visibilité en ligne fait la différence. Les habitants de ${city.nameShort} et des communes voisines recherchent activement des prestataires locaux sur Google. Être présent avec un site web optimisé, c'est capter cette demande avant vos concurrents.`
            }
          </p>

          <h3 className="text-xl font-bold">Les critères d'un site web performant à {city.nameShort}</h3>
          <p className="text-muted-foreground leading-relaxed">
            Un site web efficace pour une entreprise {city.description} doit répondre à plusieurs exigences techniques et marketing. Côté technique, il doit être rapide (temps de chargement inférieur à 2,5 secondes), responsive (adapté à tous les écrans, notamment les smartphones qui représentent plus de 75% du trafic local), et sécurisé (certificat SSL, protocole HTTPS). Côté marketing, il doit présenter clairement vos services, afficher vos coordonnées de manière visible, proposer un formulaire de contact ou un bouton d'appel direct, et intégrer des témoignages clients pour rassurer les visiteurs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Chez Déclic Digital, nous allons plus loin en intégrant dès la conception une stratégie de <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement naturel (SEO)</Link> adaptée à {city.nameShort}. Chaque page est optimisée pour les mots clés que vos clients utilisent réellement, le balisage technique est soigné (Schema.org, meta tags, sitemap XML) et votre fiche Google Business Profile est créée ou optimisée pour maximiser votre visibilité dans Google Maps.
          </p>

          <h3 className="text-xl font-bold">Le référencement local : votre meilleur allié à {city.nameShort}</h3>
          <p className="text-muted-foreground leading-relaxed">
            Le <Link to={`/referencement-seo/${city.slug}`} className="text-primary font-semibold hover:underline">SEO local à {city.nameShort}</Link> est la stratégie qui vous permet d'apparaître dans les résultats de recherche géolocalisés. Quand un internaute tape une requête comme "plombier {city.nameShort}" ou "restaurant près de moi" depuis {city.nameShort}, Google lui propose les entreprises les plus pertinentes à proximité. Le "pack local" (les 3 résultats affichés avec la carte Google Maps) capte 42% des clics. Pour y figurer, votre site doit être techniquement irréprochable, associé à une fiche Google Business complète et enrichi d'avis clients positifs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Notre approche du SEO local pour {city.nameShort} combine l'optimisation on-page de votre site, la gestion de votre fiche Google Business, la création de contenus géolocalisés et la collecte stratégique d'avis clients. Cette méthode éprouvée permet à nos clients d'obtenir leurs premières demandes de contact dans les 2 à 6 semaines suivant la mise en ligne, avec une progression constante au fil des mois.
          </p>

          <h3 className="text-xl font-bold">Combien coûte un site web professionnel à {city.nameShort} ?</h3>
          <p className="text-muted-foreground leading-relaxed">
            La question du budget est légitime. Beaucoup de freelances et agences proposent des sites à plusieurs milliers d'euros, souvent sans garantie de résultat. Chez Déclic Digital, nous avons choisi un modèle transparent et accessible : un premier mois de mise en service pour la conception et le développement de votre site, puis <Link to="/tarifs" className="text-primary font-semibold hover:underline">50€/mois tout compris</Link>. Ce forfait mensuel inclut l'hébergement sur des serveurs performants, la maintenance technique, les mises à jour de sécurité, le support par email et les modifications mineures de contenu. Aucun frais caché, aucune mauvaise surprise.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Ce modèle d'abonnement présente un avantage majeur : il n'y a pas de gros investissement initial qui freine les TPE et indépendants. Vous bénéficiez immédiatement d'un site professionnel sans grever votre trésorerie. Et contrairement aux solutions "gratuites" type Wix ou WordPress.com, votre site est véritablement optimisé pour le référencement, sans publicité parasite et avec un accompagnement humain.
          </p>

          <h3 className="text-xl font-bold">Pourquoi choisir Déclic Digital plutôt qu'une autre agence ?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Déclic Digital est une agence spécialisée dans l'accompagnement des TPE et indépendants à Paris et dans les Hauts-de-Seine. Notre fondateur, Geoffrey, est Expert Produit Google, ce qui nous donne une compréhension approfondie des algorithmes de recherche et des meilleures pratiques SEO. Nous ne faisons pas de sites web "génériques" : chaque projet est pensé comme un outil de croissance pour votre activité. Notre proximité géographique avec {city.nameShort} nous permet de comprendre les spécificités de votre marché local et d'adapter notre stratégie en conséquence. Découvrez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre équipe</Link>, consultez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link> ou demandez un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit SEO gratuit</Link> pour évaluer votre situation actuelle.
          </p>
        </div>
      </SectionWrapper>

      {/* Process */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Comment se déroule votre projet ?
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous échangeons sur vos besoins, votre activité et vos objectifs pour définir le cahier des charges idéal." },
            { icon: Monitor, step: "2", title: "Maquette et design", desc: "Nous créons une maquette visuelle que vous validez avant le développement. Aucune surprise." },
            { icon: Shield, step: "3", title: "Développement", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le SEO et la performance." },
            { icon: Clock, step: "4", title: "Mise en ligne", desc: "Votre site est mis en ligne et indexé sur Google. Formation et suivi technique inclus." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white font-bold text-xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Questions fréquentes sur la création de site à {city.nameShort}
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

      {/* Liens services */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Découvrez aussi nos autres services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Référencement SEO
            </Link>
            <Link to={`/referencement-seo/${city.slug}`} className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              SEO à {city.nameShort}
            </Link>
            <Link to="/audit-seo-gratuit" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Audit SEO gratuit
            </Link>
            <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos tarifs
            </Link>
            <Link to="/nos-metiers" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos métiers
            </Link>
            <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Toutes nos villes
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Maillage interne */}
      {nearCities.length > 0 && (
        <SectionWrapper className="bg-section-blue">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Création de site web près de {city.nameShort}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Nous intervenons également dans les villes voisines pour la création de sites internet professionnels.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearCities.map((c) => (
              <div key={c.slug} className="rounded-2xl bg-background p-4 shadow-card">
                <h3 className="font-bold mb-2">{c.nameShort}</h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/creation-site-web/${c.slug}`}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    Création de site
                  </Link>
                  <Link
                    to={`/referencement-seo/${c.slug}`}
                    className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  >
                    SEO
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">
            Vous êtes basé(e) à {city.nameShort} ? Parlons de votre projet.
          </h2>
          <p className="mb-8 text-white/80">
            Contactez-nous pour un devis gratuit et personnalisé. Premier mois de mise en service + 50€/mois.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
              <Link to="/contact">Demander un devis</Link>
            </Button>
            <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
              Audit SEO gratuit
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VilleCreationSite;
