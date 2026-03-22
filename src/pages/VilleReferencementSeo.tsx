import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, BarChart3, FileText, Target, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { getCityBySlug, cities } from "@/data/cities";
import { cityContent } from "@/data/cityContent";
import { Helmet } from "react-helmet-async";

const VilleReferencementSeo = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/referencement-seo" replace />;

  const content = cityContent[city.slug];
  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);

  return (
    <PageLayout>
      <Helmet>
        <title>{
          city.slug === "boulogne-billancourt" ? "SEO local Boulogne-Billancourt | TPE & artisans" :
          `Référencement SEO ${city.nameShort} | TPE & artisans`
        }</title>
        <meta name="description" content={
          city.slug === "boulogne-billancourt" ? "Référencement Google local pour les TPE et artisans de Boulogne-Billancourt. Déclic Digital booste votre visibilité en Île-de-France. Audit gratuit." :
          `Boostez votre visibilité Google à ${city.nameShort}. Déclic Digital, agence SEO locale pour TPE, artisans et indépendants en Île-de-France. Audit gratuit.`
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/referencement-seo/${city.slug}`} />
      </Helmet>

      <PageBreadcrumb items={[
        { label: "Accueil", href: "/" },
        { label: "Référencement SEO", href: "/referencement-seo" },
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
                {city.slug === "boulogne-billancourt" ? "Référencement SEO local pour les artisans et TPE de Boulogne-Billancourt" :
                 `Référencement SEO local pour les artisans et TPE de ${city.nameShort}`}
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
                <img src={geoffreyPhoto} alt={`Geoffrey, expert SEO - référencement ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">J'accompagne les entreprises {city.description} pour conquérir la première page Google.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
            { icon: Eye, title: "Visibilité locale", desc: `Apparaissez en première page Google lorsque vos prospects recherchent vos services à ${city.nameShort} et aux alentours.` },
            { icon: Users, title: "Clients qualifiés", desc: "Attirez des visiteurs qui recherchent activement vos services. Le trafic SEO convertit 8x mieux que les réseaux sociaux." },
            { icon: TrendingUp, title: "Croissance durable", desc: "Contrairement à la publicité payante, le SEO génère des résultats qui s'amplifient avec le temps sans coût par clic." },
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
            { icon: Search, title: "Audit SEO complet", desc: `Analyse approfondie de votre site : technique, contenu, mots clés, concurrence. Nous identifions tous les leviers pour améliorer votre positionnement à ${city.nameShort}.`, features: ["Analyse technique", "Étude de mots clés", "Analyse concurrentielle", "Plan d'action priorisé"] },
            { icon: FileText, title: "Optimisation on-page", desc: "Optimisation de vos pages existantes : balises, contenus, structure, maillage interne. Chaque page est travaillée pour cibler les bons mots clés.", features: ["Balises title et meta", "Optimisation du contenu", "Maillage interne", "Données structurées"] },
            { icon: Target, title: "SEO local", desc: `Stratégie de référencement local pour dominer les résultats Google à ${city.nameShort} : Google Business Profile, avis clients, citations locales.`, features: ["Google Business Profile", "Gestion des avis", "Citations locales", "Pages géolocalisées"] },
            { icon: BarChart3, title: "Suivi et reporting", desc: "Tableau de bord avec vos positions, votre trafic et vos conversions. Rapports mensuels détaillés et recommandations d'amélioration.", features: ["Suivi des positions", "Google Analytics", "Rapports mensuels", "Recommandations continues"] },
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

      {/* Contenu SEO unique */}
      {content && (
        <SectionWrapper className="bg-section-blue">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl text-center">
              Apparaître dans Google Maps et les recherches locales à {city.nameShort}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{content.seoLocalText}</p>
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

      {/* Liens services */}
      <SectionWrapper>
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
            <Link to="/faq" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Questions fréquentes
            </Link>
            <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Toutes nos villes
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Maillage interne */}
      {nearCities.length > 0 && (
        <SectionWrapper className="bg-section-blue">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Référencement SEO près de {city.nameShort}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Notre agence SEO intervient également dans les villes voisines.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearCities.map((c) => (
              <div key={c.slug} className="rounded-2xl bg-background p-4 shadow-card">
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
            Demandez votre audit SEO gratuit — réponse en 48h
          </h2>
          <p className="mb-8 text-white/80">
            Demandez votre audit SEO gratuit et découvrez comment attirer plus de clients depuis Google.
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
