import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, BarChart3, FileText, Target, CheckCircle, HelpCircle, MessageSquare } from "lucide-react";
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

const seoFaqsByRegion: Record<string, { q: string; a: string }[]> = {
  paris: [
    { q: "Combien de temps faut-il pour voir des résultats SEO ?", a: "Les premiers résultats apparaissent généralement entre 3 et 6 mois. Le SEO est un investissement à moyen terme qui s'amplifie avec le temps : les positions gagnées restent durables." },
    { q: "Le SEO local est-il vraiment utile pour un indépendant parisien ?", a: "Absolument. 46% des recherches Google ont une intention locale. Quand un client tape 'plombier Paris 15' ou 'ostéopathe près de moi', seuls les sites bien référencés localement apparaissent." },
    { q: "Quelle différence entre SEO et publicité Google Ads ?", a: "Google Ads donne des résultats immédiats mais coûte à chaque clic. Le SEO demande plus de temps mais génère du trafic gratuit et durable. L'idéal est souvent de combiner les deux au démarrage." },
    { q: "Faut-il un blog pour améliorer son référencement ?", a: "Un blog est un excellent levier SEO. Il permet de cibler des mots clés longue traîne, de démontrer votre expertise et d'attirer du trafic qualifié. Nous recommandons 2 articles par mois minimum." },
  ],
  "hauts-de-seine": [
    { q: "Le SEO fonctionne-t-il pour les entreprises du 92 ?", a: "Oui, et c'est même un avantage. La concurrence SEO dans le 92 est souvent moins féroce qu'à Paris intra-muros, ce qui permet de se positionner plus rapidement sur des mots clés locaux." },
    { q: "Comment apparaître dans Google Maps pour ma ville du 92 ?", a: "Il faut optimiser votre fiche Google Business Profile : photos, catégorie, description, horaires, et surtout collecter des avis clients. C'est le levier n°1 pour le pack local Google Maps." },
    { q: "Quel budget prévoir pour le SEO local dans les Hauts-de-Seine ?", a: "Nos forfaits SEO commencent à 50€/mois et incluent l'optimisation technique, le contenu et le suivi. C'est un investissement très rentable par rapport à la publicité traditionnelle." },
    { q: "Puis-je être visible à la fois dans ma ville et à Paris ?", a: "Oui. Nous travaillons votre référencement pour votre ville du 92 ET Paris grâce à des pages géolocalisées, un maillage interne intelligent et une fiche Google Business bien paramétrée." },
  ],
};

const VilleReferencementSeo = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/referencement-seo" replace />;

  const content = cityContent[city.slug];
  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);
  const faqs = seoFaqsByRegion[city.region] || seoFaqsByRegion.paris;

  return (
    <PageLayout>
      <Helmet>
        <title>{
          city.slug === "boulogne-billancourt" ? "SEO local Boulogne-Billancourt | TPE & artisans" :
          `Référencement SEO et GEO ${city.nameShort} | TPE & artisans`
        }</title>
        <meta name="description" content={
          city.slug === "boulogne-billancourt" ? "Référencement Google local pour les TPE et artisans de Boulogne-Billancourt. Déclic Digital booste votre visibilité à Paris et dans le 92. Audit gratuit." :
          `Boostez votre visibilité Google à ${city.nameShort}. Déclic Digital, agence SEO locale pour TPE, artisans et indépendants à Paris et dans les Hauts-de-Seine (92). Audit gratuit.`
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/referencement-seo/${city.slug}`} />
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Référencement SEO et GEO", href: "/referencement-seo" },
        { label: city.nameShort },
      ]} />

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence SEO {city.description}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                {`Référencement SEO et GEO local pour les artisans et TPE de ${city.nameShort}`}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                {content?.seoIntro || `Votre entreprise ${city.description} mérite d'être visible sur Google. Notre agence SEO optimise votre site pour attirer des clients qualifiés et développer votre activité grâce au référencement naturel.`}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
                </Button>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-foreground hover:bg-secondary transition-colors">
                  Nous contacter
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="rounded-2xl bg-card p-8 shadow-card text-center max-w-sm">
                <img src={geoffreyPhoto} alt={`Geoffrey, expert SEO - référencement ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">J'accompagne les entreprises {city.description} pour conquérir la première page Google.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">Le SEO local en chiffres</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: "46%", label: "des recherches Google ont une intention locale" },
            { stat: "76%", label: "des personnes qui cherchent un commerce local le visitent dans les 24h" },
            { stat: "8x", label: "meilleur taux de conversion du SEO vs réseaux sociaux" },
            { stat: "0€", label: "par clic, contrairement à Google Ads" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-6 shadow-card text-center">
              <p className="text-3xl font-extrabold text-gradient mb-2">{item.stat}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Bénéfices SEO local */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          Pourquoi le SEO local est indispensable à {city.nameShort}
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          {content?.seoWhyText || `Le référencement local est essentiel pour les entreprises ${city.description}. Il vous permet d'apparaitre devant vos clients au moment où ils recherchent vos services.`}
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Eye, title: "Visibilité locale", desc: `Apparaissez en première page Google lorsque vos prospects recherchent vos services à ${city.nameShort} et aux alentours. Le pack local (les 3 résultats Google Maps) capte 42% des clics.` },
            { icon: Users, title: "Clients qualifiés", desc: "Attirez des visiteurs qui recherchent activement vos services. Le trafic SEO convertit 8x mieux que les réseaux sociaux car l'intention d'achat est déjà présente." },
            { icon: TrendingUp, title: "Croissance durable", desc: "Contrairement à la publicité payante, le SEO génère des résultats qui s'amplifient avec le temps. Chaque mois, vos positions se renforcent sans augmenter votre budget." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-background p-8 shadow-card text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
                <item.icon size={26} />
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Services SEO */}
      <SectionWrapper>
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Notre méthode de référencement pour {city.nameShort}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Search, title: "Audit SEO complet", desc: `Analyse approfondie de votre site : technique, contenu, mots clés, concurrence. Nous identifions tous les leviers pour améliorer votre positionnement à ${city.nameShort}.`, features: ["Analyse technique du site", "Étude de mots clés locaux", "Analyse de la concurrence locale", "Plan d'action priorisé sur 3 mois"] },
            { icon: FileText, title: "Optimisation on-page", desc: "Chaque page de votre site est retravaillée pour cibler les bons mots clés et offrir la meilleure expérience utilisateur possible.", features: ["Balises title et meta descriptions", "Optimisation du contenu existant", "Maillage interne stratégique", "Données structurées Schema.org"] },
            { icon: Target, title: "SEO local renforcé", desc: `Stratégie de référencement local pour dominer les résultats Google à ${city.nameShort} : fiche Google Business, avis clients, citations dans les annuaires locaux.`, features: ["Google Business Profile optimisé", "Stratégie de collecte d'avis", "Citations dans les annuaires locaux", "Pages géolocalisées ciblées"] },
            { icon: BarChart3, title: "Suivi et reporting", desc: "Tableau de bord avec vos positions, votre trafic et vos conversions. Vous suivez votre progression mois par mois.", features: ["Suivi des positions en temps réel", "Rapports Google Analytics", "Rapports mensuels détaillés", "Recommandations d'amélioration continue"] },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl bg-card p-8 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white">
                  <item.icon size={20} />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
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
              Apparaître dans Google Maps et les recherches locales à {city.nameShort}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{content.seoLocalText}</p>
            <p className="text-muted-foreground leading-relaxed">
              Pour apparaître dans le pack local Google Maps, votre fiche Google Business doit être complète et optimisée : photos de qualité, catégorie correcte, description riche en mots clés, horaires à jour et surtout des avis clients positifs. C'est ce triptyque site + fiche Google + avis qui vous propulse dans les 3 premiers résultats locaux.
            </p>

            {/* Map embed */}
            <div className="pt-4">
              <MapEmbed
                title="Notre agence à Paris 15e"
                subtitle={`Nous accompagnons les TPE et indépendants de ${city.nameShort} depuis notre agence parisienne.`}
              />
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Complétez votre stratégie avec un <Link to={`/creation-site-web/${city.slug}`} className="text-primary font-semibold hover:underline">site web professionnel à {city.nameShort}</Link>. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
            </p>
            <div className="rounded-2xl bg-background p-6 shadow-card">
              <p className="text-sm font-semibold text-primary mb-1">Le saviez-vous ?</p>
              <p className="text-muted-foreground text-sm">{content.localFact}</p>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Guide unique par ville */}
      {(() => {
        const guide = getCityGuide(city.slug);
        if (!guide) return null;
        return (
          <SectionWrapper>
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-3xl font-extrabold md:text-4xl text-center">
                {guide.seo.title}
              </h2>
              {guide.seo.sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
              <p className="text-muted-foreground leading-relaxed">
                Améliorez votre visibilité Google à {city.nameShort} dès maintenant. <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">Demandez votre audit SEO gratuit</Link>, consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
              </p>
            </div>
          </SectionWrapper>
        );
      })()}

      {/* FAQ */}
      <SectionWrapper className="bg-section-blue">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-10">
          Questions fréquentes sur le SEO à {city.nameShort}
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl bg-card p-6 shadow-card">
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
      <SectionWrapper className="bg-section-blue">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Découvrez aussi nos autres services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/creation-site-web" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Création de site web
            </Link>
            <Link to={`/creation-site-web/${city.slug}`} className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Site web à {city.nameShort}
            </Link>
            <Link to="/audit-seo-gratuit" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Audit SEO gratuit
            </Link>
            <Link to="/tarifs" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos tarifs
            </Link>
            <Link to="/realisations" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos réalisations
            </Link>
            <Link to="/nos-metiers" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Nos métiers
            </Link>
            <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Toutes nos villes
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Maillage interne */}
      {nearCities.length > 0 && (
        <SectionWrapper>
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Référencement SEO près de {city.nameShort}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Notre agence SEO intervient également dans les villes voisines.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearCities.map((c) => (
              <div key={c.slug} className="rounded-2xl bg-card p-4 shadow-card">
                <h3 className="font-bold mb-2">{c.nameShort}</h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/referencement-seo/${c.slug}`}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    SEO
                  </Link>
                  <Link
                    to={`/creation-site-web/${c.slug}`}
                    className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  >
                    Création de site
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
            Demandez votre audit SEO gratuit : réponse en 48h
          </h2>
          <p className="mb-8 text-white/80">
            Découvrez comment attirer plus de clients à {city.nameShort} grâce au référencement Google.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-foreground shadow-lg hover:bg-white/90">
              <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
            </Button>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VilleReferencementSeo;
