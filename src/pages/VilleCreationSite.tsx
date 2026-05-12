import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { getCityBySlug, cities } from "@/data/cities";
import { cityContent } from "@/data/cityContent";
import { getCityGuide } from "@/data/cityGuideContent";
import { getSeoMeta } from "@/data/seoMeta";
import { usePageContent } from "@/hooks/usePageContent";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const creationFaqsByRegion: Record<string, { q: string; a: string }[]> = {
  paris: [
    { q: "Combien coute un site web professionnel a Paris ?", a: "Chez Déclic Digital, nos forfaits démarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design, hébergement, maintenance et optimisation SEO. Pas de mauvaise surprise." },
    { q: "Combien de temps pour créer mon site ?", a: "Un site vitrine est livré en 2 a 3 semaines. Un site plus avancé ou e-commerce peut prendre 4 a 6 semaines. Nous vous tenons informé a chaque étape via votre espace client." },
    { q: "Mon site sera-t-il visible sur Google ?", a: "Oui. Chaque site est optimisé pour le référencement local dès sa conception : balises SEO, vitesse de chargement, compatibilité mobile, fiche Google Business. Nous travaillons votre positionnement dès le premier jour." },
    { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui, nous vous fournissons un accès simple pour modifier vos textes et images. Pour les modifications plus importantes, notre équipe intervient dans les 48h, inclus dans votre forfait." },
    { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Nous travaillons par étapes avec validation a chaque phase. Vous voyez et approuvez le design avant le développement. Si le résultat final ne correspond pas au cahier des charges validé, nous corrigeons sans frais supplémentaires." },
  ],
  "hauts-de-seine": [
    { q: "Intervenez-vous dans toutes les villes du 92 ?", a: "Oui. Nous accompagnons les TPE et indépendants dans toutes les communes des Hauts-de-Seine : Boulogne-Billancourt, Nanterre, Issy-les-Moulineaux, Levallois-Perret, et toutes les autres." },
    { q: "Faut-il être a Paris pour travailler avec vous ?", a: "Non. Nous travaillons principalement a distance via visioconférence et notre espace client en ligne. Nous pouvons aussi nous rencontrer dans notre agence a Paris 15e si vous le souhaitez." },
    { q: "Un site web est-il vraiment utile pour une petite entreprise du 92 ?", a: "Plus que jamais. 97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Sans site, vous laissez vos concurrents capter ces clients. Le retour sur investissement est rapide." },
    { q: "Proposez-vous aussi le référencement SEO ?", a: "Oui. Chaque site que nous créons est optimisé SEO dès la conception. Nous proposons aussi des prestations de référencement avancé pour les TPE qui veulent aller plus loin." },
    { q: "Que comprend le forfait mensuel ?", a: "Le forfait de 50 EUR par mois inclut l'hébergement, la maintenance technique, les mises a jour de sécurité, le support par email, et les modifications mineures de contenu. Tout est compris." },
  ],
};

const VilleCreationSite = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/creation-site-web" replace />;

  const staticContent = cityContent[city.slug];
  const seo = getSeoMeta("creation", city.slug, city.nameShort);

  const { content } = usePageContent(`creation/${city.slug}`, {
    seoTitle: seo.title,
    seoDescription: seo.description,
    seoH1: seo.h1,
    heroIntro: staticContent?.creationIntro ?? "",
    creationSeoText: staticContent?.creationSeoText ?? [],
    creationWhyText: staticContent?.creationWhyText ?? "",
    seoLocalText: staticContent?.seoLocalText ?? "",
    seoWhyText: staticContent?.seoWhyText ?? "",
    localFact: staticContent?.localFact ?? "",
  });

  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);
  const faqs = creationFaqsByRegion[city.region] || creationFaqsByRegion.paris;

  return (
    <PageLayout>
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.seoDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/creation-site-web/${city.slug}`} />
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
        { label: "Création de site web", href: "/creation-site-web" },
        { label: city.nameShort },
      ]} />

      {/* Section 1 - Hero #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                Agence web {city.description}
              </span>
              <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
                {content.seoH1}
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
                {content.heroIntro || `Vous êtes une TPE ou un indépendant ${city.description} ? Déclic Digital crée votre site internet professionnel, responsive et optimisé pour Google.`}
              </p>
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
                <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Déclic Digital - création site web ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
                <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
                <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>Fondateur de Déclic Digital, j'accompagne les entreprises {city.description} dans leur transformation digitale.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 - Avantages #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
            {`Pourquoi les professionnels de ${city.nameShort} ont besoin d'un site web`}
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            {content.creationWhyText || `Un site internet professionnel est indispensable pour les entreprises ${city.description}.`}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, title: "Design professionnel", desc: `Un site qui reflète le sérieux de votre entreprise ${city.description}. Première impression décisive en moins de 3 secondes.` },
              { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur. Plus de 70% du trafic web est mobile." },
              { icon: TrendingUp, title: "Optimisé SEO", desc: `Référencement local pour apparaître en première page Google sur "${city.nameShort}" et vos mots clés métier.` },
              { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement optimisé (LCP < 2,5s) pour une meilleure expérience et un meilleur positionnement Google." },
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

      {/* Section 3 - Ce que nous livrons #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
            Ce que comprend votre site web a {city.nameShort}
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Chaque site est conçu sur-mesure, optimisé pour le référencement local et livré en 2 a 3 semaines.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Site vitrine", desc: `Présentez votre activité ${city.description} avec un site élégant et optimisé. Idéal pour les artisans, professions libérales et commerces locaux.`, features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps intégrée", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"] },
              { title: "Site e-commerce", desc: `Vendez vos produits en ligne depuis ${city.nameShort}. Boutique en ligne complète avec paiement sécurisé et gestion des stocks.`, features: ["Catalogue produits illimité", "Paiement sécurisé (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"] },
              { title: "Site sur mesure", desc: `Un site web unique pour votre entreprise ${city.description}. Fonctionnalités avancées selon vos besoins spécifiques.`, features: ["Fonctionnalités sur mesure", "Espace client / réservation", "Intégrations API tierces", "Evolutif et scalable", "Formation a l'utilisation", "Support technique dédié"] },
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

      {/* Section 4 - SEO local + Map #E9F2F4 */}
      {(content.creationSeoText.length > 0 || content.localFact) && (
        <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-center" style={{ color: "#2B1E3F" }}>
                Référencement local {city.nameShort} : apparaissez dans Google Maps
              </h2>
              {content.creationSeoText.map((text, i) => (
                <p key={i} className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{text}</p>
              ))}
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Un site web seul ne suffit pas : il doit être accompagné d'une fiche Google Business Profile optimisée pour apparaître dans le pack local Google Maps. Nous créons et optimisons votre fiche avec photos professionnelles, catégorie adaptée, zone de service et collecte d'avis clients.
              </p>
              <div className="pt-4">
                <MapEmbed title="Déclic Digital, votre agence web" subtitle={`Basés a Paris 15e, nous accompagnons les professionnels de ${city.nameShort} dans leur visibilité en ligne.`} />
              </div>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Découvrez nos <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs adaptés aux TPE</Link>, nos <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>réalisations</Link> ou demandez un <Link to="/contact" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>audit SEO gratuit</Link>.
              </p>
              {content.localFact && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
                  <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{content.localFact}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Section 5 - Guide ville #F6F1E9 */}
      {(() => {
        const guide = getCityGuide(city.slug);
        if (!guide) return null;
        return (
          <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
            <div className="container">
              <div className="mx-auto max-w-3xl space-y-6">
                <h2 className="text-center" style={{ color: "#2B1E3F" }}>{guide.creation.title}</h2>
                {guide.creation.sections.map((section, i) => (
                  <div key={i}>
                    <h3 style={{ color: "#2B1E3F" }}>{section.heading}</h3>
                    <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{section.text}</p>
                  </div>
                ))}
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Prêt a créer votre site web a {city.nameShort} ? <Link to="/rendez-vous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Prenez rendez-vous</Link>, consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Section 6 - Process #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se déroule votre projet ?</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { icon: Search, step: "1", title: "Échange et analyse", desc: "Nous échangeons sur vos besoins, votre activité et vos objectifs pour définir le cahier des charges idéal." },
              { icon: Monitor, step: "2", title: "Maquette et design", desc: "Nous créons une maquette visuelle que vous validez avant le développement. Aucune surprise." },
              { icon: Shield, step: "3", title: "Développement", desc: "Votre site est développé avec les meilleures technologies, optimisé pour le SEO et la performance." },
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

      {/* Section 7 - FAQ #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Questions fréquentes sur la création de site a {city.nameShort}
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
            <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Voir toutes les questions fréquentes -&gt;</Link>
          </p>
        </div>
      </section>

      {/* Section 8 - Liens services #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Découvrez aussi nos autres services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/referencement-seo", label: "Référencement SEO et GEO" },
                { to: `/referencement-seo/${city.slug}`, label: `SEO a ${city.nameShort}` },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/nos-metiers", label: "Nos métiers" },
                { to: "/nos-villes", label: "Toutes nos villes" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                  style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#F6F1E9", color: "#2B1E3F" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 9 - Villes proches #F6F1E9 */}
      {nearCities.length > 0 && (
        <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
              Création de site web pres de {city.nameShort}
            </h2>
            <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Nous intervenons également dans les villes voisines pour la création de sites internet professionnels.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearCities.map((c) => (
                <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                  <h3 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{c.nameShort}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/creation-site-web/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                      Création de site
                    </Link>
                    <Link to={`/referencement-seo/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>
                      SEO
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA texture */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
            Vous êtes basé(e) a {city.nameShort} ? Parlons de votre projet.
          </h2>
          <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Contactez-nous pour un devis gratuit et personnalisé. Premier mois de mise en service + 50 EUR/mois.
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

export default VilleCreationSite;
