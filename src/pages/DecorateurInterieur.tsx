import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, HelpCircle, Camera, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const faqs = [
  {
    q: "Combien coute un site web pour un décorateur d'intérieur ?",
    a: "Nos forfaits démarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design portfolio sur-mesure, hébergement, maintenance et optimisation SEO. Pas de frais cachés. Le retour sur investissement est rapide : un seul projet décroché via votre site rembourse plusieurs années d'abonnement."
  },
  {
    q: "En combien de temps mon site sera-t-il en ligne ?",
    a: "Un site vitrine portfolio est livré en 2 à 3 semaines. Nous travaillons par étapes avec validation à chaque phase : brief, maquette, développement, mise en ligne. Vous suivez l'avancement dans votre espace client."
  },
  {
    q: "Mon site sera-t-il trouvé sur Google par des clients à Paris ou dans le 92 ?",
    a: "C'est notre priorité. Chaque page est optimisée pour les requêtes locales : décorateur intérieur Paris, décoratrice intérieur 92, home staging Boulogne-Billancourt... Nous optimisons aussi votre fiche Google Business Profile pour apparaître dans Google Maps."
  },
  {
    q: "Puis-je montrer mes projets avant/après sur mon site ?",
    a: "Absolument, c'est la force d'un site portfolio décorateur. Nous créons des galeries photos comparatives avant/après par projet, avec description du brief client, des contraintes et de vos choix créatifs. C'est votre meilleur argument commercial."
  },
  {
    q: "Puis-je intégrer la prise de rendez-vous en ligne ?",
    a: "Oui. Nous intégrons un système de réservation (Calendly, SimplyBook) directement sur votre site pour que vos prospects prennent rendez-vous de première consultation 24h/24. Cela professionnalise votre approche et filtre les demandes sérieuses."
  },
  {
    q: "Quelle différence entre un site portfolio et une page Instagram ?",
    a: "Instagram vous appartient tant que la plateforme existe et vous distribue. Votre site vous appartient définitivement : vous contrôlez le contenu, le référencement, le message. Un site bien positionné sur Google capte des clients qui ne vous auraient jamais trouvé sur Instagram."
  },
];

const DecorateurInterieur = () => (
  <PageLayout>
    <Helmet>
      <title>Création de site web pour décorateur d'intérieur | Déclic Digital Paris</title>
      <meta name="description" content="Vous êtes décorateur d'intérieur à Paris ou dans le 92 ? Déclic Digital crée votre site web portfolio et optimise votre référencement Google pour attirer plus de clients." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/site-web-decorateur-interieur" />
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
      { label: "Nos métiers", href: "/nos-metiers" },
      { label: "Décorateur d'intérieur" }
    ]} />

    {/* Section 1 - Hero */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
              🛋️ Site web pour décorateur d'intérieur
            </span>
            <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
              Création de site web pour décorateur d'intérieur à Paris et dans le 92
            </h1>
            <p className="mb-4 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
              Votre talent mérite d'être vu. Un site portfolio professionnel transforme vos projets avant/après en machine à attirer des clients. Déclic Digital crée des sites web pensés pour les décorateurs d'intérieur : visuels, rapides, optimisés pour <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>le référencement Google local</Link> à Paris et dans les Hauts-de-Seine.
            </p>
            <p className="mb-8 text-base leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.65 }}>
              Particuliers qui cherchent un décorateur d'intérieur à Paris, promoteurs qui ont besoin de home staging, entreprises qui rénovent leurs bureaux : vos futurs clients sont sur Google. Vous devez y être aussi.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Devis gratuit</Link>
              </Button>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/contact">Audit SEO gratuit</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <div className="rounded-2xl p-8 text-center max-w-sm" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
              <img src={geoffreyPhoto} alt="Geoffrey, expert création site web décorateur intérieur Paris"
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
              <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
              <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                J'accompagne les décorateurs d'intérieur de Paris et du 92 pour que leurs projets soient trouvés par les bons clients sur Google.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Section 2 - Pourquoi un site */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Pourquoi un décorateur d'intérieur a besoin d'un site web en 2026
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Instagram montre vos réalisations à vos abonnés. Google les montre aux personnes qui cherchent activement un décorateur d'intérieur à Paris ou dans le 92 en ce moment même. Ce ne sont pas les mêmes audiences, et la deuxième convertit infiniment mieux.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Camera, title: "Portfolio qui convertit", desc: "Des galeries avant/après par projet qui racontent votre processus créatif et convainquent vos futurs clients en quelques secondes." },
            { icon: Search, title: "Visible sur Google", desc: "Apparaissez quand un particulier cherche 'décorateur intérieur Paris' ou 'décoratrice intérieur 92'. Le référencement local est intégré dès la conception." },
            { icon: Star, title: "Crédibilité immédiate", desc: "Un site professionnel vous positionne comme un acteur sérieux face aux grandes agences de décoration. La première impression est décisive." },
            { icon: Users, title: "Clients qualifiés", desc: "Un visiteur qui arrive via Google cherche activement vos services. Il convertit 8 fois mieux qu'un follower Instagram." },
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

    {/* Section 3 - Ce qu'on livre */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
          Ce que comprend votre site de décorateur d'intérieur
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Chaque site est conçu sur-mesure pour refléter votre identité visuelle et votre positionnement. Livré en 2 à 3 semaines, optimisé pour Google dès le premier jour.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Portfolio visuel",
              desc: "Vos projets mis en scène pour séduire et convaincre.",
              features: [
                "Galeries avant/après par projet",
                "Présentation du brief et de votre approche",
                "Filtres par style (contemporain, scandinave...)",
                "Zoom haute définition sur les détails",
                "Intégration photos et vidéos",
                "Page projet avec description complète",
              ]
            },
            {
              title: "Site vitrine optimisé SEO",
              desc: "Trouvé par vos clients sur Google, à Paris comme dans le 92.",
              features: [
                "Pages géolocalisées Paris et Hauts-de-Seine",
                "Fiche Google Business optimisée",
                "Balises SEO sur-mesure par page",
                "Temps de chargement inférieur à 2,5s",
                "Compatible mobile (70% des recherches)",
                "Données structurées Schema.org",
              ]
            },
            {
              title: "Outil de conversion",
              desc: "Transformez vos visiteurs en prospects qualifiés.",
              features: [
                "Formulaire de prise de contact qualifié",
                "Prise de rendez-vous en ligne (Calendly)",
                "Page tarifs et prestations claire",
                "Témoignages clients intégrés",
                "Bouton d'appel direct sur mobile",
                "Newsletter pour fidéliser",
              ]
            },
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

    {/* Section 4 - Contenu local + maillage */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center" style={{ color: "#2B1E3F" }}>
            Décorateur d'intérieur à Paris et dans le 92 : comment Google peut remplir votre agenda
          </h2>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Le marché de la décoration d'intérieur en Ile-de-France est dynamique. Les particuliers qui rénovent leur appartement à Paris, les propriétaires de maisons à <Link to="/agence-web-levallois-perret" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Levallois-Perret</Link>, à <Link to="/agence-web-suresnes" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Suresnes</Link> ou à <Link to="/agence-web-asnieres-sur-seine" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Asnières-sur-Seine</Link> cherchent un décorateur d'intérieur de proximité sur Google. Ils tapent "décorateur intérieur Paris", "décoratrice intérieur 92" ou "home staging Boulogne-Billancourt" et cliquent sur les premiers résultats. Si vous n'y êtes pas, un confrère prend le client.
          </p>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Un <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web professionnel</Link> bien référencé change la donne. Il travaille 24h/24 pour vous, capte des demandes pendant que vous êtes en consultation ou sur un chantier, et présente vos projets avec la qualité visuelle que votre métier exige. Le <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement local</Link> permet d'apparaître sur les requêtes géolocalisées : votre zone d'intervention, vos villes de prédilection, vos spécialités (appartement haussmannien, open space, home staging).
          </p>
          <h3 style={{ color: "#2B1E3F" }}>Le prix d'un décorateur d'intérieur : un sujet SEO majeur</h3>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Les requêtes "prix décorateur intérieur", "tarif décoratrice intérieur" et "devis décorateur intérieur" génèrent des milliers de recherches mensuelles avec une intention d'achat très forte. Une page tarifs bien construite sur votre site vous positionne sur ces requêtes et attire des prospects déjà décidés à investir. C'est aussi un excellent outil de qualification : les clients qui vous contactent après avoir lu vos tarifs sont des clients sérieux. Consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> pour votre site web décorateur.
          </p>
          <h3 style={{ color: "#2B1E3F" }}>La visibilité IA, nouveau levier pour les décorateurs</h3>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            De plus en plus de particuliers demandent directement à ChatGPT ou Perplexity "trouve-moi un décorateur d'intérieur à Paris". La <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>visibilité sur les moteurs IA</Link> suit les mêmes logiques que le SEO Google : autorité du site, contenu de qualité, citations locales. Travailler votre référencement Google renforce automatiquement votre présence dans ces nouveaux canaux.
          </p>
          <div className="pt-4">
            <MapEmbed
              title="Déclic Digital - agence web et SEO Paris"
              subtitle="Basés à Paris 15e, nous accompagnons les décorateurs d'intérieur de Paris et du 92 dans leur visibilité en ligne." />
          </div>
          <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link> ou consultez la <Link to="/creation-site-web/metier/decorateur-interieur" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>page dédiée à la création de site pour décorateur</Link> pour aller plus loin.
          </p>
        </div>
      </div>
    </section>

    {/* Section 5 - Process */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se déroule votre projet ?</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: Search, step: "1", title: "Brief et stratégie", desc: "Nous analysons votre positionnement, vos cibles et vos concurrents locaux pour définir la structure et le contenu idéal de votre site." },
            { icon: Monitor, step: "2", title: "Design sur-mesure", desc: "Une maquette qui reflète votre identité visuelle. Vous validez chaque écran avant le développement. Aucune surprise." },
            { icon: Shield, step: "3", title: "Développement et SEO", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le référencement local dès la conception." },
            { icon: Clock, step: "4", title: "Mise en ligne et suivi", desc: "Mise en ligne, indexation Google, formation. Votre site évolue avec votre activité. Support inclus." },
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

    {/* Section 6 - FAQ */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
          Questions fréquentes - site web décorateur d'intérieur
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

    {/* Section 7 - Liens métiers et villes */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Nos services pour les créatifs et les indépendants</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/creation-site-web/metier/decorateur-interieur", label: "Site décorateur intérieur" },
              { to: "/creation-site-web/metier/architecte", label: "Site architecte" },
              { to: "/creation-site-web/metier/photographe", label: "Site photographe" },
              { to: "/creation-site-web/metier/graphiste", label: "Site graphiste" },
              { to: "/referencement-seo/boulogne-billancourt", label: "SEO Boulogne-Billancourt" },
              { to: "/agence-web-levallois-perret", label: "Agence web Levallois" },
              { to: "/agence-web-suresnes", label: "Agence web Suresnes" },
              { to: "/agence-web-asnieres-sur-seine", label: "Agence web Asnières" },
              { to: "/tarifs", label: "Nos tarifs" },
              { to: "/nos-metiers", label: "Tous nos métiers" },
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

    {/* CTA texture */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
          Prêt à transformer votre portfolio en machine à clients ?
        </h2>
        <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Devis gratuit en 24h. Premier mois de mise en service + 50 EUR/mois tout compris.
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

export default DecorateurInterieur;
