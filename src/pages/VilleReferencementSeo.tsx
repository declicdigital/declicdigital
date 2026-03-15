import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Users, TrendingUp, Search, BarChart3, FileText, Target, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";
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
        <title>{`Référencement SEO ${city.nameShort} - Agence SEO | Déclic Digital`}</title>
        <meta name="description" content={`Agence de référencement SEO ${city.description}. Améliorez votre visibilité sur Google et attirez des clients qualifiés. Audit SEO gratuit.`} />
        <link rel="canonical" href={`https://declicdigital.net/referencement-seo/${city.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Agence SEO {city.description}
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                Référencement SEO à{" "}
                <span className="text-gradient">{city.nameShort}</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                {content?.seoIntro || `Votre entreprise ${city.description} mérite d'être visible sur Google. Notre agence SEO optimise votre site pour attirer des clients qualifiés et développer votre activité grâce au référencement naturel.`}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gradient-primary rounded-full px-8 text-primary-foreground font-semibold shadow-lg hover:opacity-90">
                  <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
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
      <SectionWrapper className="bg-card">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-4">
          Pourquoi investir dans le SEO à {city.nameShort} ?
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
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
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
          Nos services SEO à {city.nameShort}
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
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
        <SectionWrapper className="bg-card">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-extrabold md:text-4xl text-center">
              Le SEO local à {city.nameShort}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{content.seoLocalText}</p>
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
        <SectionWrapper className="bg-card">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl mb-6">
            Référencement SEO près de {city.nameShort}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Notre agence SEO intervient également dans les villes voisines.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {nearCities.map((c) => (
              <Link
                key={c.slug}
                to={`/referencement-seo/${c.slug}`}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
              >
                SEO {c.nameShort}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {nearCities.map((c) => (
              <Link
                key={c.slug}
                to={`/creation-site-web/${c.slug}`}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Site web {c.nameShort}
              </Link>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">
            Améliorez votre visibilité à {city.nameShort}
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Demandez votre audit SEO gratuit et découvrez comment attirer plus de clients depuis Google.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
              <Link to="/audit-seo-gratuit">Audit SEO gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VilleReferencementSeo;
