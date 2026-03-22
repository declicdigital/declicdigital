import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, Settings, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import seoImage from "@/assets/referencement-seo-google.png";
import { cities } from "@/data/cities";

const ReferencementSeo = () => (
  <PageLayout>
    <Helmet>
      <title>Référencement SEO local pour TPE & artisans — Paris</title>
      <meta name="description" content="Améliorez votre visibilité sur Google avec notre agence SEO freelance. Référencement naturel local pour TPE et artisans en Île-de-France. Résultats mesurables." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/referencement-seo" />
      <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Référencement SEO",provider:{"@type":"LocalBusiness",name:"Déclic Digital",url:"https://declicdigital.net"},areaServed:"Île-de-France"})}</script>
    </Helmet>

    {/* Breadcrumb */}
    <PageBreadcrumb items={[
      { label: "Accueil", href: "/" },
      { label: "Référencement SEO" },
    ]} />

    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
            Référencement naturel Google (SEO) pour les TPE, artisans et indépendants à Paris
          </h1>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            Le référencement SEO est le levier le plus rentable pour attirer des clients qualifiés. Nous optimisons votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link> pour qu'il apparaisse en première page Google. Commencez par un <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit gratuit</Link>.
          </p>
          <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
            <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
          </Button>
        </motion.div>
      </div>
    </section>
    {/* Bénéfices */}
    <SectionWrapper className="bg-section-blue">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Pourquoi le SEO local est essentiel pour votre activité</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Le référencement naturel est la stratégie la plus rentable pour développer votre activité en ligne. Contrairement à la publicité payante, les résultats du SEO sont durables. Découvrez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou consultez <Link to="/faq" className="text-primary font-semibold hover:underline">notre FAQ</Link>.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Eye, title: "Plus de visibilité", desc: "Apparaissez en première page Google sur les requêtes clés de votre activité. 75% des internautes ne consultent jamais la deuxième page." },
          { icon: Users, title: "Trafic qualifié", desc: "Attirez des visiteurs qui recherchent activement vos services. Ce sont des prospects chauds, prêts à passer à l'action." },
          { icon: TrendingUp, title: "Clients réguliers", desc: "Générez des demandes de manière continue et pérenne. Le SEO crée un flux constant de prospects sans coût par clic." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-8 shadow-card text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
              <item.icon size={26} />
            </div>
            <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* Qu'est-ce que le SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center mb-10">Agence SEO freelance : une approche personnalisée et transparente</h2>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Le SEO (Search Engine Optimization) regroupe l'ensemble des techniques qui permettent d'améliorer la position de votre site web dans les résultats des moteurs de recherche comme Google. L'objectif est simple : faire en sorte que votre site apparaisse quand vos clients potentiels recherchent vos services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Le référencement naturel repose sur trois piliers fondamentaux. Le premier est la technique : vitesse de chargement, architecture du site, compatibilité mobile, sécurité HTTPS. Le deuxième est le contenu : des textes pertinents, bien structurés et optimisés pour les mots clés recherchés par votre cible. Le troisième est la popularité : les liens provenant d'autres sites qui renforcent l'autorité de votre domaine aux yeux de Google.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Pour une TPE, le SEO est particulièrement puissant car il permet de rivaliser avec des entreprises plus grandes en se positionnant sur des mots clés locaux ou de niche. Découvrez <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">nos offres de création de site</Link> intégrant le SEO dès la conception.
            </p>
          </div>
          <div className="flex justify-center">
            <img src={seoImage} alt="Référencement SEO Google pour améliorer la visibilité des TPE" className="w-full max-w-md rounded-2xl shadow-card" />
          </div>
        </div>
      </div>
    </SectionWrapper>

    {/* Méthode */}
    <SectionWrapper className="bg-section-blue">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">Notre méthode de référencement naturel en 4 étapes</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Notre approche est méthodique et transparente. Découvrez <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre équipe</Link> et notre processus éprouvé pour optimiser votre visibilité sur Google.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Audit SEO", desc: "Analyse complète de votre site : technique, contenu, mots clés, concurrence. Nous identifions toutes les opportunités d'amélioration." },
          { icon: Settings, title: "Optimisation technique", desc: "Correction des erreurs techniques, amélioration de la vitesse, optimisation de l'architecture et des balises pour faciliter l'indexation." },
          { icon: FileText, title: "Contenu optimisé", desc: "Création et optimisation de contenus pertinents pour vos mots clés stratégiques. Chaque page est pensée pour répondre à une intention de recherche." },
          { icon: BarChart3, title: "Suivi et rapports", desc: "Rapports réguliers sur l'évolution de votre positionnement, du trafic et des conversions. Ajustements continus pour maximiser les résultats." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-6 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-miami text-white">
              <item.icon size={22} />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* SEO vs SEA */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">SEO local : apparaître dans Google Maps et les recherches de proximité</h2>
        <p className="text-muted-foreground leading-relaxed">
          La publicité payante (Google Ads, Facebook Ads) peut générer du trafic rapidement, mais elle s'arrête dès que vous coupez le budget. Le SEO, en revanche, est un investissement qui continue de porter ses fruits sur le long terme. Une fois bien positionné, votre site attire des visiteurs gratuitement, jour après jour.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour les TPE avec des budgets marketing limités, le SEO est souvent la stratégie la plus rentable. Les premiers résultats apparaissent généralement entre 3 et 6 mois, mais les gains s'accumulent et se renforcent avec le temps. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou <Link to="/faq" className="text-primary font-semibold hover:underline">notre FAQ</Link> pour en savoir plus.
        </p>
      </div>
    </SectionWrapper>

    {/* Villes maillage */}
    <SectionWrapper className="bg-section-blue">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
        Combien de temps avant de voir des résultats SEO ?
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        Nous proposons un <Link to="/nos-villes" className="text-primary font-semibold hover:underline">référencement SEO local</Link> à Paris et dans les Hauts-de-Seine.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {cities.slice(0, 12).map((c) => (
          <Link
            key={c.slug}
            to={`/referencement-seo/${c.slug}`}
            className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
          >
            SEO {c.nameShort}
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

    {/* Avis clients */}
    <GoogleReviewsSection compact maxReviews={3} className="bg-section-blue" />

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Demandez votre audit SEO gratuit</h2>
        <p className="mb-8 text-white/80">Recevez un audit gratuit de votre site en 48h et découvrez comment améliorer votre référencement.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
            <Link to="/audit-seo-gratuit">Demander un audit SEO gratuit</Link>
          </Button>
          <Link to="/qui-sommes-nous" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Qui sommes-nous
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default ReferencementSeo;
