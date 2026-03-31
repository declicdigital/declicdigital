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

      {/* Guide unique par ville */}
      {(() => {
        const guide = getCityGuide(city.slug);
        if (!guide) return null;
        return (
          <SectionWrapper>
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-3xl font-extrabold md:text-4xl text-center">
                {guide.creation.title}
              </h2>
              {guide.creation.sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
              <p className="text-muted-foreground leading-relaxed">
                Prêt à créer votre site web à {city.nameShort} ? <Link to="/contact" className="text-primary font-semibold hover:underline">Demandez votre devis gratuit</Link>, consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> ou découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
              </p>
            </div>
          </SectionWrapper>
        );
      })()}

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
              Référencement SEO et GEO
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
            <Button asChild size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
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
