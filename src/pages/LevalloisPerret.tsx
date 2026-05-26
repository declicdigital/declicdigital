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
    q: "Combien coute un site web professionnel a Levallois-Perret ?",
    a: "Nos forfaits demarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design, hebergement, maintenance et optimisation SEO locale. Pas de frais caches."
  },
  {
    q: "Combien de temps avant de voir des resultats SEO a Levallois ?",
    a: "Les premieres ameliorations de positions sont visibles entre 3 et 6 mois. Le SEO local a Levallois-Perret est moins concurrentiel qu'a Paris intra-muros, ce qui accelere souvent les resultats. Pour des mots cles competitifs, comptez 6 a 12 mois pour des positions stables."
  },
  {
    q: "Travaillez-vous uniquement avec des entreprises de Levallois-Perret ?",
    a: "Non. Declic Digital accompagne des clients dans tout le departement des Hauts-de-Seine , notamment Boulogne-Billancourt, Nanterre, Clichy, Neuilly-sur-Seine et Courbevoie, et a Paris. Notre ancrage local dans le 92 est un avantage pour comprendre votre marche de proximite."
  },
  {
    q: "Mon site est deja en ligne, peut-il etre optimise sans refonte ?",
    a: "Dans la grande majorite des cas, oui. Nous travaillons sur votre site existant : balises SEO, contenu, corrections techniques, donnees structurees. Une refonte n'est necessaire que si la structure est fondamentalement problematique."
  },
  {
    q: "Quelle difference entre le SEO et Google Ads pour une entreprise a Levallois ?",
    a: "Google Ads donne des resultats immediats mais facture chaque clic : des que vous coupez le budget, vous disparaissez. Le referencement naturel demande plus de temps mais cree une visibilite durable et gratuite sur le long terme. Nous recommandons souvent les deux en complement au demarrage."
  },
  {
    q: "Pouvez-vous m'aider a apparaitre sur Google Maps a Levallois-Perret ?",
    a: "Oui, c'est meme notre priorite numero un pour les commerces et services locaux. Nous optimisons votre fiche Google Business Profile : photos, categorie, description geolocalise, collecte d'avis clients. C'est le levier le plus rapide pour apparaitre dans le pack local Google Maps."
  },
];

const LevalloisPerret = () => (
  <PageLayout>
    <Helmet>
      <title>Agence SEO et web Levallois-Perret | Déclic Digital</title>
      <meta name="description" content="Agence SEO et création de site web à Levallois-Perret. Référencement Google local, audit SEO gratuit, site internet professionnel pour TPE et artisans du 92." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/agence-web-levallois-perret" />
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
      { label: "Levallois-Perret" }
    ]} />

    {/* ── Section 1 - Hero ─────────────────────────────────────── */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
              Agence web et SEO - Levallois-Perret (92)
            </span>
            <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
              Agence SEO et création de site web à Levallois-Perret
            </h1>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
              Votre entreprise à Levallois-Perret mérite d'être trouvée sur Google. Declic Digital crée votre <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web professionnel</Link> et optimise votre <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement local</Link> pour attirer des clients qualifiés en continu, sans budget publicitaire variable.
            </p>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>
              Geoffrey, Expert Produit Google certifié, accompagne les TPE, artisans et indépendants de Levallois-Perret et des Hauts-de-Seine depuis notre agence parisienne. Audit SEO offert, réponse en 48h.
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
              <img src={geoffreyPhoto} alt="Geoffrey, expert SEO et création de site web Levallois-Perret"
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
              <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
              <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                J'accompagne les entreprises de Levallois-Perret et du 92 pour conquérir la première page Google et attirer les bons clients.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Section 2 - Chiffres SEO ─────────────────────────────── */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Pourquoi le référencement local change tout à Levallois</h2>
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

    {/* ── Section 3 - Création de site web ─────────────────────── */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Création de site web à Levallois-Perret
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Levallois-Perret concentre une forte densité d'entreprises et de professionnels indépendants dans un périmètre restreint. La concurrence pour capter des clients en ligne est réelle. Un site rapide, mobile-first et optimisé pour les requêtes locales est la base pour exister sur Google face à vos concurrents levalloisiens.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Monitor, title: "Design professionnel", desc: "Un site qui reflète le sérieux de votre entreprise à Levallois-Perret, livré en 2 à 3 semaines." },
            { icon: Smartphone, title: "100% responsive", desc: "Affiché parfaitement sur mobile : 70% des des recherches locales se font depuis un smartphone." },
            { icon: TrendingUp, title: "Optimisé SEO local", desc: "Chaque page est conçue pour apparaître sur les requêtes de vos clients à Levallois et dans le 92." },
            { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement < 2,5s. Google pénalise les sites lents : les nôtres passent PageSpeed > 90." },
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

        {/* Offres */}
        <div className="grid gap-6 md:grid-cols-3 mt-10">
          {[
            { title: "Site vitrine", desc: "Présentez votre activité à Levallois-Perret avec un site élégant et optimisé pour Google Maps.",
              features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps intégrée", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"] },
            { title: "Site e-commerce", desc: "Vendez vos produits en ligne depuis Levallois. Boutique complète avec paiement sécurisé.",
              features: ["Catalogue produits illimité", "Paiement sécurisé (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"] },
            { title: "Site sur mesure", desc: "Un site web unique pour votre entreprise à Levallois-Perret, avec les fonctionnalités dont vous avez besoin.",
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

    {/* ── Section 4 - SEO Levallois ─────────────────────────────── */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Référencement Google à Levallois-Perret : notre méthode
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Le marché de Levallois-Perret est dense et les entreprises qui captent le plus de clients locaux sont celles qui apparaissent en tête des résultats Google sur leurs requêtes de proximité. Notre stratégie combine référencement technique, contenu géolocalisé et optimisation de votre présence sur Google Maps.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Search, title: "Audit SEO complet", desc: "Analyse approfondie de votre site actuel : technique, contenu, mots clés levalloisiens, concurrence locale.", features: ["Analyse technique du site", "Étude de mots clés locaux Levallois", "Analyse de la concurrence locale 92", "Plan d'action priorisé sur 3 mois"] },
            { icon: FileText, title: "Optimisation on-page", desc: "Chaque page retravaillée pour cibler les bons mots clés et offrir la meilleure expérience utilisateur.", features: ["Balises title et meta descriptions", "Optimisation du contenu existant", "Maillage interne stratégique", "Données structurées Schema.org"] },
            { icon: Target, title: "SEO local renforcé", desc: "Stratégie pour dominer les résultats Google à Levallois : Google Business Profile, avis clients, citations locales.", features: ["Google Business Profile optimisé", "Stratégie de collecte d'avis", "Citations dans les annuaires locaux", "Pages géolocalisées ciblées"] },
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

    {/* ── Section 5 - Contenu local + Map ──────────────────────── */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center" style={{ color: "#2B1E3F" }}>
            Apparaître sur Google Maps à Levallois-Perret
          </h2>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Levallois-Perret est l'une des villes les plus denses de France avec près de 70 000 habitants sur 2,4 km². Cette concentration crée un bassin de clients potentiels exceptionnellement proche, mais aussi une concurrence locale réelle entre les professionnels du même secteur. Le pack local Google Maps (les trois établissements affichés avec une carte en haut des résultats) capte entre 60 et 75% des clics sur les requêtes locales. Être dans ce pack, c'est capter la majorité des contacts sans dépenser un euro en publicité.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Pour y apparaître, votre fiche Google Business Profile doit être complète et active : photos récentes de vos locaux ou réalisations, catégorie principale précise, description qui mentionne naturellement Levallois-Perret et vos services, horaires à jour, et surtout des avis clients réguliers. Les établissements qui publient un Google Post par semaine sont systématiquement favorisés par l'algorithme de classement local. La <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>visibilité sur les moteurs IA</Link> comme ChatGPT et Perplexity suit les mêmes logiques d'autorité locale : travailler votre présence Google renforce aussi votre citation dans ces nouveaux canaux.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            La proximité de Levallois-Perret avec Neuilly-sur-Seine, Clichy et Courbevoie crée aussi une opportunité de maillage géographique : des pages dédiées à chacune de ces communes voisines permettent d'étendre votre visibilité au-delà de Levallois sur des requêtes de type "plombier Clichy" ou "électricien Neuilly" sans créer de nouveau site. C'est une stratégie que nous mettons en place dans chaque <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>accompagnement SEO local</Link>.
          </p>
          <div className="pt-4">
            <MapEmbed
              title="Déclic Digital - agence web et SEO"
              subtitle="Basés à Paris 15e, nous accompagnons les professionnels de Levallois-Perret et du 92 dans leur visibilité en ligne." />
          </div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
            <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Levallois-Perret est la commune la plus densément peuplée de France hors Paris avec environ 27 000 habitants au km². Cette densité est un avantage pour les professionnels locaux : votre clientèle potentielle est littéralement à portée de marche, et une bonne visibilité sur Google Maps vous place au moment précis où elle a besoin de vous.
            </p>
          </div>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Les entreprises qui investissent tôt dans leur <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement naturel à Levallois</Link> construisent un avantage concurrentiel difficile à rattraper. Consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link> pour évaluer ce que nous pouvons faire pour votre activité.
          </p>
        </div>
      </div>
    </section>

    {/* ── Section 6 - Process ───────────────────────────────────── */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se déroule votre projet ?</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous analysons votre activité, vos concurrents à Levallois et vos objectifs pour définir le plan d'action optimal." },
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

    {/* ── Section 7 - FAQ ───────────────────────────────────────── */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
          Questions fréquentes - agence web et SEO à Levallois-Perret
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

    {/* ── Section 8 - Liens services ───────────────────────────── */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nos services à Levallois-Perret et dans le 92</h2>
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

    {/* ── Section 9 - Villes voisines ──────────────────────────── */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
          Nous intervenons aussi dans les villes voisines
        </h2>
        <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Notre zone d'intervention couvre tout le nord des Hauts-de-Seine et Paris.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Clichy", slug: "clichy" },
            { name: "Neuilly-sur-Seine", slug: "neuilly-sur-seine" },
            { name: "Courbevoie", slug: "courbevoie" },
            { name: "Nanterre", slug: "nanterre" },
            { name: "La Garenne-Colombes", slug: "la-garenne-colombes" },
            { name: "Asnières-sur-Seine", slug: "asnieres-sur-seine" },
          ].map(c => (
            <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
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

    {/* ── CTA texture ──────────────────────────────────────────── */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
          Vous êtes à Levallois-Perret ? Parlons de votre projet.
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

export default LevalloisPerret;
