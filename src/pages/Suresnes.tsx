import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, HelpCircle, Eye, Users, BarChart3, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const faqs = [
  {
    q: "Combien coute un site web professionnel a Suresnes ?",
    a: "Nos forfaits demarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design, hebergement, maintenance et optimisation SEO locale. Pas de frais caches, pas de mauvaise surprise."
  },
  {
    q: "Combien de temps avant de voir des resultats SEO a Suresnes ?",
    a: "Les premieres ameliorations de positions sont visibles entre 3 et 6 mois. Le SEO local a Suresnes est moins concurrentiel qu'a Paris, ce qui accelere souvent les resultats. Pour des mots cles competitifs dans le 92, comptez 6 a 12 mois pour des positions stables et durables."
  },
  {
    q: "Je suis artisan a Suresnes, est-ce qu'un site web peut vraiment m'apporter des clients ?",
    a: "Oui, et c'est meme l'un des leviers les plus rentables pour un artisan local. 97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Un plombier, un electricien ou un peintre bien positionne sur Google a Suresnes peut recevoir 5 a 15 appels supplementaires par semaine uniquement depuis son site."
  },
  {
    q: "Travaillez-vous uniquement avec des entreprises de Suresnes ?",
    a: "Non. Declic Digital accompagne des clients dans tout le departement des Hauts-de-Seine et a Paris. Notre ancrage local dans le 92 est un avantage pour comprendre votre marche de proximite et cibler precisement les requetes de vos clients potentiels."
  },
  {
    q: "Quelle difference entre le SEO et Google Ads pour une entreprise a Suresnes ?",
    a: "Google Ads donne des resultats immediats mais facture chaque clic : des que vous coupez le budget, vous disparaissez. Le referencement naturel demande plus de temps mais cree une visibilite durable et gratuite sur le long terme. Nous recommandons souvent les deux en complement au demarrage."
  },
  {
    q: "Comment apparaitre dans Google Maps a Suresnes ?",
    a: "Il faut optimiser votre fiche Google Business Profile : photos recentes, categorie precise, description avec vos services et votre ville, horaires a jour, et collecte d'avis clients reguliere. C'est le levier le plus rapide pour apparaitre dans le pack local Google Maps a Suresnes."
  },
];

const Suresnes = () => (
  <PageLayout>
    <Helmet>
      <title>Agence SEO et web à Suresnes | Déclic Digital</title>
      <meta name="description" content="Agence SEO et création de site web à Suresnes (92). Référencement Google local, audit SEO gratuit, site internet professionnel pour TPE et artisans de Suresnes." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/agence-web-suresnes" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      })}</script>
    </Helmet>

    <PageBreadcrumb items={[
      { label: "Accueil", href: "/" },
      { label: "Nos villes", href: "/nos-villes" },
      { label: "Suresnes" }
    ]} />

    {/* Section 1 - Hero */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
              Agence web et SEO - Suresnes (92)
            </span>
            <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
              Agence SEO et création de site web à Suresnes
            </h1>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
              Votre entreprise à Suresnes mérite d'être trouvée sur Google. Déclic Digital crée votre <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web professionnel</Link> et optimise votre <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement local</Link> pour attirer des clients qualifiés en continu, sans budget publicitaire variable.
            </p>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>
              Geoffrey, Expert Produit Google certifié, accompagne les TPE, artisans et indépendants de Suresnes et des Hauts-de-Seine depuis notre agence parisienne. Audit SEO offert, réponse en 48h.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/contact">Audit SEO gratuit</Link>
              </Button>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <div className="rounded-2xl p-8 text-center max-w-sm" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
              <img src={geoffreyPhoto} alt="Geoffrey, expert SEO et création de site web Suresnes"
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
              <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
              <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                J'accompagne les entreprises de Suresnes et du 92 pour conquérir la première page Google et attirer les bons clients.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 - Chiffres */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Le SEO local, le levier numéro un pour les entreprises de Suresnes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "46%", label: "des recherches Google ont une intention locale" },
            { stat: "76%", label: "des internautes visitent un commerce trouvé sur Google dans les 24h" },
            { stat: "8x", label: "meilleur taux de conversion SEO vs réseaux sociaux" },
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

    {/* Section 3 - Création de site web */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Création de site web à Suresnes
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Suresnes est une ville de 50 000 habitants entre La Défense et le Bois de Boulogne, avec une forte densité de TPE, d'artisans et de professionnels indépendants. Un site web rapide, optimisé pour le mobile et bien positionné sur Google est la base pour exister face à vos concurrents locaux et capter les clients qui cherchent vos services en ligne.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Design professionnel", desc: "Un site qui reflète le sérieux de votre entreprise à Suresnes, livré en 2 à 3 semaines." },
            { icon: Smartphone, title: "100% responsive", desc: "Affiché parfaitement sur mobile : plus de 70% des recherches locales se font depuis un smartphone." },
            { icon: TrendingUp, title: "Optimisé SEO local", desc: "Chaque page conçue pour apparaître sur les requêtes de vos clients à Suresnes et dans le 92." },
            { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement inférieur à 2,5s. Google pénalise les sites lents : les nôtres passent PageSpeed au-dessus de 90." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {[
            { title: "Site vitrine", desc: "Présentez votre activité à Suresnes avec un site élégant et optimisé pour Google Maps.",
              features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps intégrée", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"] },
            { title: "Site e-commerce", desc: "Vendez vos produits en ligne depuis Suresnes. Boutique complète avec paiement sécurisé.",
              features: ["Catalogue produits illimité", "Paiement sécurisé (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"] },
            { title: "Site sur mesure", desc: "Un site web unique pour votre entreprise à Suresnes, avec les fonctionnalités dont vous avez besoin.",
              features: ["Fonctionnalités sur mesure", "Espace client / réservation", "Intégrations API tierces", "Évolutif et scalable", "Formation à l'utilisation", "Support technique dédié"] },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-8" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
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

    {/* Section 4 - SEO */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Référencement Google à Suresnes : notre méthode
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Suresnes est bien desservie par les transports (ligne L, Mont-Valérien, proximité La Défense) et attire une population active avec un fort pouvoir d'achat. Les entreprises locales qui captent le plus de clients sont celles qui apparaissent en tête des résultats Google sur leurs requêtes de proximité. Notre stratégie combine <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement technique</Link>, contenu géolocalisé et optimisation Google Maps.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Search, title: "Audit SEO complet", desc: "Analyse de votre site actuel : technique, contenu, mots clés locaux Suresnes, concurrence dans le 92.", features: ["Analyse technique du site", "Étude de mots clés locaux Suresnes", "Analyse de la concurrence locale 92", "Plan d'action priorisé sur 3 mois"] },
            { icon: FileText, title: "Optimisation on-page", desc: "Chaque page retravaillée pour cibler les bons mots clés et offrir la meilleure expérience utilisateur.", features: ["Balises title et meta descriptions", "Optimisation du contenu existant", "Maillage interne stratégique", "Données structurées Schema.org"] },
            { icon: Target, title: "SEO local renforcé", desc: "Stratégie pour dominer les résultats Google à Suresnes : Google Business Profile, avis clients, citations locales.", features: ["Google Business Profile optimisé", "Stratégie de collecte d'avis", "Citations dans les annuaires locaux", "Pages géolocalisées ciblées"] },
            { icon: BarChart3, title: "Suivi et reporting", desc: "Tableau de bord avec vos positions, votre trafic et vos conversions. Progression visible mois par mois.", features: ["Suivi des positions en temps réel", "Rapports Google Analytics", "Rapports mensuels détaillés", "Recommandations continues"] },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-8" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
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

    {/* Section 5 - Contenu local + Map */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center" style={{ color: "#2B1E3F" }}>
            Apparaître sur Google Maps à Suresnes
          </h2>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Suresnes dispose d'un tissu économique local dense avec de nombreuses TPE, artisans, professions libérales et commerces de proximité. Plombiers, électriciens, coaches sportifs, ostéopathes, restaurateurs : tous se disputent la visibilité sur Google Maps auprès des 50 000 habitants de la ville. Le pack local (les trois établissements affichés avec une carte en haut des résultats Google) capte entre 60 et 75% des clics sur les requêtes locales. Y figurer, c'est capter la majorité des contacts sans dépenser un euro en publicité.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            La proximité de Suresnes avec La Défense, Puteaux et Courbevoie crée également une opportunité de rayonnement géographique. Les professionnels de Suresnes peuvent capter des clients depuis ces zones voisines à fort potentiel grâce à des pages dédiées et un contenu géolocalisé bien structuré. Le <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement dans les moteurs IA</Link> comme ChatGPT et Perplexity suit les mêmes logiques d'autorité locale : travailler votre présence Google renforce aussi votre citation dans ces nouveaux canaux de recherche.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Pour un artisan ou un indépendant à Suresnes, la combinaison d'un site web optimisé et d'une fiche Google Business Profile active est le meilleur investissement digital possible. Le <Link to="/blog/seo-local-paris-artisan-google-maps" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO local pour les artisans</Link> génère un flux de contacts prévisible qui ne dépend pas d'un budget publicitaire variable.
          </p>
          <div className="pt-4">
            <MapEmbed
              title="Déclic Digital - agence web et SEO"
              subtitle="Basés à Paris 15e, nous accompagnons les professionnels de Suresnes et du 92 dans leur visibilité en ligne." />
          </div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
            <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Suresnes abrite le Mémorial de la France combattante sur le Mont-Valérien, site historique parmi les plus visités du 92. La ville est aussi connue pour son vignoble municipal, l'un des derniers vignobles urbains d'Ile-de-France. Ce contexte culturel et résidentiel fort attire une population à fort pouvoir d'achat, sensible à la qualité des prestataires locaux qu'elle trouve sur Google.
            </p>
          </div>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link> pour évaluer ce que nous pouvons faire pour votre activité à Suresnes.
          </p>
        </div>
      </div>
    </section>

    {/* Section 6 - Process */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se déroule votre projet ?</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous analysons votre activité, vos concurrents à Suresnes et vos objectifs pour définir le plan d'action optimal." },
            { icon: Monitor, step: "2", title: "Maquette et design", desc: "Vous validez la maquette visuelle avant le développement. Aucune surprise sur le résultat final." },
            { icon: Shield, step: "3", title: "Développement et SEO", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le référencement local dès la conception." },
            { icon: Clock, step: "4", title: "Mise en ligne et suivi", desc: "Mise en ligne, indexation Google, optimisation continue. Formation et support technique inclus." },
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

    {/* Section 7 - FAQ */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
          Questions fréquentes - agence web et SEO à Suresnes
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
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

    {/* Section 8 - Liens services */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nos services à Suresnes et dans le 92</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/creation-site-web", label: "Création de site web" },
              { to: "/referencement-seo", label: "Référencement SEO et GEO" },
              { to: "/visibilite-ia", label: "Visibilité IA (GEO)" },
              { to: "/contact", label: "Audit SEO gratuit" },
              { to: "/tarifs", label: "Nos tarifs" },
              { to: "/realisations", label: "Nos réalisations" },
              { to: "/nos-villes", label: "Toutes nos villes" },
            ].map(l => (
              <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#F6F1E9", color: "#2B1E3F" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Section 9 - Villes voisines */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
          Nous intervenons aussi dans les villes voisines
        </h2>
        <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Notre zone d'intervention couvre tout l'ouest des Hauts-de-Seine et Paris.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Puteaux", slug: "puteaux" },
            { name: "Courbevoie", slug: "courbevoie" },
            { name: "Nanterre", slug: "nanterre" },
            { name: "Rueil-Malmaison", slug: "rueil-malmaison" },
            { name: "Boulogne-Billancourt", slug: "boulogne-billancourt" },
            { name: "Levallois-Perret", slug: "levallois-perret", dedicated: "/agence-web-levallois-perret" },
          ].map(c => (
            <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
              <h3 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{c.name}</h3>
              <div className="flex flex-wrap gap-2">
                {c.dedicated ? (
                  <Link to={c.dedicated} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                    Agence web et SEO
                  </Link>
                ) : (
                  <>
                    <Link to={`/creation-site-web/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                      Création de site
                    </Link>
                    <Link to={`/referencement-seo/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>
                      SEO
                    </Link>
                  </>
                )}
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
          Vous êtes à Suresnes ? Parlons de votre projet.
        </h2>
        <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Audit SEO gratuit, devis en 48h. Premier mois de mise en service + 50 EUR/mois tout compris.
        </p>
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
  </PageLayout>
);

export default Suresnes;
