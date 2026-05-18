import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Monitor, Smartphone, TrendingUp, Zap,
  Eye, Users, Search, BarChart3, FileText, Target,
  CheckCircle, HelpCircle, Shield, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const faqs = [
  {
    q: "Combien coute un site web professionnel a Asnieres-sur-Seine ?",
    a: "Chez Declic Digital, nos forfaits demarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design, hebergement, maintenance et optimisation SEO locale. Pas de mauvaise surprise.",
  },
  {
    q: "Combien de temps pour creer mon site web a Asnieres ?",
    a: "Un site vitrine est livre en 2 a 3 semaines. Un site plus avance peut prendre 4 a 6 semaines. Nous vous tenons informe a chaque etape via votre espace client.",
  },
  {
    q: "Combien de temps faut-il pour voir des resultats SEO a Asnieres-sur-Seine ?",
    a: "Les premieres ameliorations de positions sont generalement visibles entre 3 et 6 mois. Pour des mots-cles competitifs dans les Hauts-de-Seine, comptez 6 a 12 mois pour atteindre les premieres positions durablement.",
  },
  {
    q: "Intervenez-vous uniquement a Asnieres-sur-Seine ?",
    a: "Non. Nous accompagnons les TPE et independants dans tout le 92 : Clichy, Colombes, Levallois-Perret, Gennevilliers, Boulogne-Billancourt. Notre ancrage local dans les Hauts-de-Seine est un vrai plus pour comprendre votre marche de proximite.",
  },
  {
    q: "Mon site existant peut-il etre optimise SEO sans refonte ?",
    a: "Dans la grande majorite des cas, oui. Nous travaillons sur votre site existant : optimisation des balises, amelioration du contenu, correction des erreurs techniques, ajout de donnees structurees Schema.org.",
  },
];

const AsnièresSurSeine = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Agence Web et SEO Asnières-sur-Seine (92) | Déclic Digital</title>
        <meta name="description" content="Création de site web et référencement SEO à Asnières-sur-Seine (92600). Consultant SEO freelance pour TPE, artisans et indépendants. Ligne 13, 10 min de Paris. Devis gratuit." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/agence-web-asnieres-sur-seine" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Déclic Digital",
          "description": "Agence web et consultant SEO freelance à Asnières-sur-Seine - création de site internet professionnel et référencement naturel pour TPE et indépendants des Hauts-de-Seine",
          "url": "https://declicdigital.net/agence-web-asnieres-sur-seine",
          "areaServed": { "@type": "City", "name": "Asnières-sur-Seine", "postalCode": "92600" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services digitaux Asnières-sur-Seine",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Création site internet professionnel Asnières-sur-Seine" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consultant SEO freelance Asnières-sur-Seine" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visibilité IA et GEO Hauts-de-Seine" } },
            ]
          }
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
        { label: "Nos villes", href: "/nos-villes" },
        { label: "Asnières-sur-Seine" },
      ]} />

      {/* Section 1 - Hero */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                Agence web à Asnières-sur-Seine (92), aux portes de Paris
              </span>
              <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
                Création de site web et référencement SEO à Asnières-sur-Seine
              </h1>
              <div className="mb-8 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
                Asnières-sur-Seine, 90 000 habitants, ligne 13 à 10 minutes de Paris. Votre entreprise mérite une{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>présence en ligne</Link>{" "}
                professionnelle et un{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement naturel</Link>{" "}
                qui convertit. Déclic Digital accompagne les TPE, artisans et indépendants asnièrois dans leur{" "}
                <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>transformation digitale</Link>.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
                <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/contact">Audit SEO gratuit</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="rounded-2xl p-8 text-center max-w-sm" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <img src={geoffreyPhoto} alt="Geoffrey, fondateur Déclic Digital - agence web et consultant SEO Asnières-sur-Seine"
                  className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
                <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
                <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                  Consultant SEO freelance basé dans le 92, j'accompagne les entreprises à Asnières-sur-Seine dans leur visibilité Google et leur création de site internet professionnel.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 - Avantages création site */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
            Pourquoi les professionnels d'Asnières-sur-Seine ont besoin d'un site web
          </h2>
          <div className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Les habitants d'Asnières recherchent leurs{" "}
            <Link to="/nos-metiers" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>prestataires locaux</Link>{" "}
            sur Google avant tout contact : plombier à Asnières-sur-Seine, coiffeur asnières, avocat 92600, photographe asnières...
            Sans site web optimisé, vous laissez ces clients à vos concurrents.
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, title: "Design professionnel", desc: "Un site qui reflète le sérieux de votre entreprise à Asnières-sur-Seine (92600)." },
              { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur." },
              { icon: TrendingUp, title: "Optimisé SEO local", desc: "Référencement local pour apparaître en première page Google sur Asnières et le 92." },
              { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement optimisé (LCP < 2,5s) pour une meilleure expérience utilisateur." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                  <item.icon size={26} />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 - Contenu SEO Asnières */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              Création de site internet professionnel à Asnières-sur-Seine
            </h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Du centre-ville d'Asnières aux Grésillons en passant par le quartier Bac-Bécon et les bords de Seine,
              Asnières-sur-Seine offre un tissu commercial varié. Les commerces du centre-ville autour de la mairie,
              les restaurants des bords de Seine, les{" "}
              <Link to="/nos-metiers" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>services de proximité</Link>{" "}
              des quartiers résidentiels et les entreprises de la zone des Grésillons constituent un marché local
              diversifié que votre site web peut cibler avec précision.
            </p>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Nous créons des{" "}
              <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>sites internet professionnels</Link>{" "}
              adaptés à l'identité d'Asnières : modernes pour refléter le dynamisme de la ville, avec un contenu ancré
              dans les réalités locales. Que vous soyez artisan, professions libérale, restaurateur ou commerçant,
              chaque projet intègre un{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement local</Link>{" "}
              ciblé sur les requêtes de vos clients asnièrois.
              Consultez nos{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs création site internet professionnel</Link>{" "}
              et nos{" "}
              <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>réalisations</Link>.
            </p>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Asnières-sur-Seine est la 4ème ville des Hauts-de-Seine avec 90 000 habitants, directement connectée
                à Paris par le métro ligne 13 en moins de 15 minutes, et connue pour ses bords de Seine et ses régates historiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Ce que comprend votre site */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>Ce que comprend votre site web à Asnières-sur-Seine</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Chaque site est conçu sur-mesure, optimisé pour le référencement local et livré en 2 à 3 semaines.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Site vitrine",
                desc: "Présentez votre activité à Asnières-sur-Seine avec un site élégant et optimisé.",
                features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps intégrée", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"],
              },
              {
                title: "Site e-commerce",
                desc: "Vendez vos produits en ligne depuis Asnières. Boutique complète avec paiement sécurisé.",
                features: ["Catalogue produits illimité", "Paiement sécurisé (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"],
              },
              {
                title: "Site sur mesure",
                desc: "Un site web unique pour votre entreprise à Asnières-sur-Seine (92600).",
                features: ["Fonctionnalités sur mesure", "Espace client / réservation", "Intégrations API tierces", "Évolutif et scalable", "Formation à l'utilisation", "Support technique dédié"],
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <h3 className="mb-3 text-xl font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p className="mb-4" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="shrink-0" style={{ color: "#4361EE" }} />
                      <span style={{ color: "#2B1E3F", opacity: 0.7 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - SEO local Asnières */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              Consultant SEO freelance à Asnières-sur-Seine : votre visibilité Google locale
            </h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Votre entreprise est implantée à Asnières-sur-Seine et vous souhaitez développer votre visibilité sur Google ?
              Déclic Digital est votre{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>consultant SEO freelance</Link>{" "}
              dans le 92, spécialisé dans le référencement naturel, le GEO et le netlinking pour les TPE et indépendants
              des Hauts-de-Seine. Avec 90 000 habitants connectés et une forte culture de consommation locale, Asnières
              est un territoire où le{" "}
              <Link to="/blog/referencement-naturel-independant-2026" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement naturel</Link>{" "}
              offre un excellent retour sur investissement.
            </p>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Les 90 000 habitants d'Asnières-sur-Seine utilisent Google comme premier réflexe pour trouver leurs
              prestataires locaux. Les requêtes "plombier Asnières-sur-Seine", "serrurier asnières sur seine",
              "coiffeur asnières", "avocat asnières sur seine", "agence immobilière asnières" ou "photographe asnières"
              sont effectuées chaque jour par des centaines d'Asnièrois.
              Se positionner sur ces requêtes, c'est capter un{" "}
              <Link to="/blog/seo-local-paris-artisan-google-maps" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>trafic qualifié</Link>{" "}
              prêt à passer à l'action.
            </p>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Notre stratégie SEO pour Asnières-sur-Seine cible les zones structurantes de la ville : le centre-ville
              autour de la mairie et de la rue de Belfort pour les commerces de proximité, les bords de Seine et le
              quartier de la gare pour la restauration et les loisirs, le quartier Bac-Bécon pour les services
              résidentiels, et les Grésillons pour les activités économiques. La ville est également attractive pour
              les habitants de Bois-Colombes, Colombes et Clichy qui cherchent des{" "}
              <Link to="/nos-metiers" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>services professionnels</Link>{" "}
              dans leur zone de proximité.
            </p>
            <div className="pt-4">
              <MapEmbed
                title="Déclic Digital, votre agence web et SEO"
                subtitle="Basés dans le 92, nous accompagnons les professionnels d'Asnières-sur-Seine dans leur visibilité en ligne." />
            </div>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Découvrez nos{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs adaptés aux TPE</Link>,
              nos{" "}
              <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>réalisations</Link>{" "}
              ou demandez un{" "}
              <Link to="/contact" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>audit SEO gratuit</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 - Stats SEO */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Le référencement local en chiffres</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "46%", label: "des recherches Google ont une intention locale" },
              { stat: "76%", label: "des personnes qui cherchent un commerce local le visitent dans les 24h" },
              { stat: "8x", label: "meilleur taux de conversion du SEO vs réseaux sociaux" },
              { stat: "0 EUR", label: "par clic, contrairement à Google Ads" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <p className="text-3xl font-extrabold mb-2 text-gradient">{item.stat}</p>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 - Notre méthode SEO */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Notre méthode de référencement pour Asnières-sur-Seine
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Search,
                title: "Audit SEO complet",
                desc: "Analyse approfondie de votre site : technique, contenu, mots-clés, concurrence locale à Asnières-sur-Seine et dans le 92.",
                features: ["Analyse technique du site", "Étude de mots-clés locaux 92600", "Analyse de la concurrence locale", "Plan d'action priorisé sur 3 mois"],
              },
              {
                icon: FileText,
                title: "Optimisation on-page",
                desc: "Chaque page de votre site est retravaillée pour cibler les bons mots-clés et offrir la meilleure expérience utilisateur.",
                features: ["Balises title et meta descriptions", "Optimisation du contenu existant", "Maillage interne stratégique", "Données structurées Schema.org"],
              },
              {
                icon: Target,
                title: "SEO local renforcé",
                desc: "Stratégie pour dominer les résultats Google à Asnières-sur-Seine : fiche Google Business, avis clients, citations locales.",
                features: ["Google Business Profile optimisé", "Stratégie de collecte d'avis", "Citations dans les annuaires locaux", "Pages géolocalisées ciblées"],
              },
              {
                icon: BarChart3,
                title: "Suivi et reporting",
                desc: "Tableau de bord avec vos positions, votre trafic et vos conversions. Vous suivez votre progression mois par mois.",
                features: ["Suivi des positions en temps réel", "Rapports Google Analytics", "Rapports mensuels détaillés", "Recommandations d'amélioration continue"],
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                </div>
                <p className="mb-4" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="shrink-0" style={{ color: "#4361EE" }} />
                      <span style={{ color: "#2B1E3F", opacity: 0.7 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 - Process création */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se déroule votre projet à Asnières ?</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous échangeons sur vos besoins, votre activité à Asnières-sur-Seine et vos objectifs pour définir le cahier des charges." },
              { icon: Monitor, step: "2", title: "Maquette et design", desc: "Nous créons une maquette visuelle que vous validez avant le développement. Aucune surprise." },
              { icon: Shield, step: "3", title: "Développement", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le SEO local et la performance." },
              { icon: Clock, step: "4", title: "Mise en ligne", desc: "Votre site est mis en ligne et indexé sur Google. Formation et suivi technique inclus." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full gradient-primary font-bold text-xl" style={{ color: "#2B1E3F" }}>
                  {item.step}
                </div>
                <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.65 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9 - Visibilité IA */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: "#2B1E3F" }}>
              GEO - Visibilité IA à Asnières-sur-Seine
            </h2>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Avec l'essor de l'IA générative (ChatGPT, Perplexity, Google SGE), les comportements de recherche évoluent.
              Les habitants d'Asnières-sur-Seine et des Hauts-de-Seine utilisent de plus en plus ces outils pour trouver
              des prestataires locaux. Déclic Digital intègre les nouvelles pratiques de{" "}
              <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>visibilité IA et GEO</Link>{" "}
              pour que votre marque soit citée et recommandée par ces outils - un levier différenciant que la plupart
              des agences ignorent encore.
            </p>
            <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Pour les artisans du 92 - plombier, serrurier, expert comptable - la combinaison SEO classique + GEO
              représente un avantage concurrentiel décisif sur un marché local compétitif. Découvrez notre{" "}
              <Link to="/blog/geo-generative-engine-optimization-chatgpt-perplexity" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>guide sur le GEO</Link>{" "}
              et notre article sur{" "}
              <Link to="/blog/geo-ia-independant-asnieres-boulogne-billancourt" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>la visibilité IA pour les indépendants du 92</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10 - FAQ */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Questions fréquentes - Agence web et SEO Asnières-sur-Seine
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
            <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Voir toutes les questions fréquentes</Link>
          </p>
        </div>
      </section>

      {/* Section 11 - Liens services */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Découvrez aussi nos autres services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: "/referencement-seo", label: "Référencement SEO et GEO" },
                { to: "/visibilite-ia", label: "Visibilité IA" },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/nos-metiers", label: "Nos métiers" },
                { to: "/nos-villes", label: "Toutes nos villes" },
                { to: "/realisations", label: "Nos réalisations" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium"
                  style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#E9F2F4", color: "#2B1E3F" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 12 - Villes voisines */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
            Agence web et SEO près d'Asnières-sur-Seine
          </h2>
          <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Nous intervenons également dans les villes voisines des Hauts-de-Seine.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slug: "clichy", name: "Clichy" },
              { slug: "colombes", name: "Colombes" },
              { slug: "levallois-perret", name: "Levallois-Perret" },
              { slug: "gennevilliers", name: "Gennevilliers" },
              { slug: "bois-colombes", name: "Bois-Colombes" },
              { slug: "boulogne-billancourt", name: "Boulogne-Billancourt" },
            ].map((c) => (
              <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <h3 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{c.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/creation-site-web/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                    Création de site
                  </Link>
                  <Link to={`/referencement-seo/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>
                    SEO
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA texture */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
            Vous êtes basé(e) à Asnières-sur-Seine ? Parlons de votre projet.
          </h2>
          <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Création de site internet professionnel ou référencement SEO - devis gratuit et personnalisé sous 24h.
            Premier mois de mise en service + 50 EUR/mois.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AsnièresSurSeine;
