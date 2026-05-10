import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, Users, TrendingUp, Search, BarChart3, FileText, Target, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { getCityBySlug, cities } from "@/data/cities";
import { cityContent } from "@/data/cityContent";
import { getCityGuide } from "@/data/cityGuideContent";
import { getSeoMeta } from "@/data/seoMeta";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const seoFaqsByCity: Record<string, { q: string; a: string }[]> = {
  "asnieres-sur-seine": [
    { q: "Combien de temps faut-il pour voir des résultats SEO ?", a: "Le SEO est un investissement sur le moyen terme. Les premières améliorations de positions sont généralement visibles entre 3 et 6 mois après le début des travaux. Pour des mots-clés compétitifs à Asnières ou dans les Hauts-de-Seine, comptez 6 à 12 mois pour atteindre les premières positions et les maintenir durablement." },
    { q: "Mon site est déjà en ligne. Peut-il être optimisé sans refonte ?", a: "Dans la grande majorité des cas, oui. Nous travaillons sur votre site existant : optimisation des balises, amélioration du contenu, correction des erreurs techniques, ajout de données structurées. Une refonte complète n'est nécessaire que si la structure du site est fondamentalement problématique." },
    { q: "Quelle est la différence entre SEO et SEA ?", a: "Le SEA (Google Ads) génère du trafic immédiat mais payant - dès que vous coupez le budget, la visibilité disparaît. Le SEO (référencement naturel) demande plus de temps mais crée une présence durable et gratuite à long terme. Nous recommandons souvent une approche complémentaire : SEA pour l'urgence, SEO pour la rentabilité durable." },
    { q: "Travaillez-vous uniquement avec des entreprises d'Asnières ?", a: "Non. Déclic Digital accompagne des clients dans tout le département des Hauts-de-Seine (Boulogne-Billancourt, Nanterre, Suresnes, Courbevoie, Levallois-Perret...) et en Île-de-France. Mais notre ancrage local dans le 92 est un vrai plus pour comprendre votre marché de proximité." },
  ],
};

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
    { q: "Quel budget prévoir pour le SEO local dans les Hauts-de-Seine ?", a: "Nos forfaits SEO commencent à 50€ par mois et incluent l'optimisation technique, le contenu et le suivi. C'est un investissement très rentable par rapport à la publicité traditionnelle." },
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
  const faqs = seoFaqsByCity[city.slug] || seoFaqsByRegion[city.region] || seoFaqsByRegion.paris;
  const seo = getSeoMeta("seo", city.slug, city.nameShort);

  return (
    <PageLayout>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://declicdigital.net/referencement-seo/${city.slug}`} />
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
        { label: "Référencement SEO et GEO", href: "/referencement-seo" },
        { label: city.nameShort },
      ]} />

      {/* Section 1 — Hero #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                Agence SEO {city.description}
              </span>
              <h1 className="mb-6" style={{ color: "#2B1E3F" }}>
                {seo.h1}
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}>
                {content?.seoIntro || `Votre entreprise ${city.description} mérite d'être visible sur Google. Notre agence SEO optimise votre site pour attirer des clients qualifiés et développer votre activité grâce au référencement naturel.`}
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
                <img src={geoffreyPhoto} alt={`Geoffrey, expert SEO - référencement ${city.nameShort}`} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
                <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
                <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>J'accompagne les entreprises {city.description} pour conquérir la première page Google.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — Stats #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Le SEO local en chiffres</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "46%", label: "des recherches Google ont une intention locale" },
              { stat: "76%", label: "des personnes qui cherchent un commerce local le visitent dans les 24h" },
              { stat: "8x", label: "meilleur taux de conversion du SEO vs réseaux sociaux" },
              { stat: "0€", label: "par clic, contrairement à Google Ads" },
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

      {/* Section 3 — Bénéfices #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
            Pourquoi le SEO local est indispensable à {city.nameShort}
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            {content?.seoWhyText || `Le référencement local est essentiel pour les entreprises ${city.description}. Il vous permet d'apparaître devant vos clients au moment où ils recherchent vos services.`}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Eye, title: "Visibilité locale", desc: `Apparaissez en première page Google lorsque vos prospects recherchent vos services à ${city.nameShort} et aux alentours. Le pack local (les 3 résultats Google Maps) capte 42% des clics.` },
              { icon: Users, title: "Clients qualifiés", desc: "Attirez des visiteurs qui recherchent activement vos services. Le trafic SEO convertit 8x mieux que les réseaux sociaux car l'intention d'achat est déjà présente." },
              { icon: TrendingUp, title: "Croissance durable", desc: "Contrairement à la publicité payante, le SEO génère des résultats qui s'amplifient avec le temps. Chaque mois, vos positions se renforcent sans augmenter votre budget." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: "#2B1E3F" }}>
                  <item.icon size={26} />
                </div>
                <h3 className="mb-3 text-xl font-bold" style={{ color: "#2B1E3F" }}>{item.title}</h3>
                <p style={{ color: "#2B1E3F", opacity: 0.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Services SEO #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Notre méthode de référencement pour {city.nameShort}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Search, title: "Audit SEO complet", desc: `Analyse approfondie de votre site : technique, contenu, mots clés, concurrence. Nous identifions tous les leviers pour améliorer votre positionnement à ${city.nameShort}.`, features: ["Analyse technique du site", "Étude de mots clés locaux", "Analyse de la concurrence locale", "Plan d'action priorisé sur 3 mois"] },
              { icon: FileText, title: "Optimisation on-page", desc: "Chaque page de votre site est retravaillée pour cibler les bons mots clés et offrir la meilleure expérience utilisateur possible.", features: ["Balises title et meta descriptions", "Optimisation du contenu existant", "Maillage interne stratégique", "Données structurées Schema.org"] },
              { icon: Target, title: "SEO local renforcé", desc: `Stratégie de référencement local pour dominer les résultats Google à ${city.nameShort} : fiche Google Business, avis clients, citations dans les annuaires locaux.`, features: ["Google Business Profile optimisé", "Stratégie de collecte d'avis", "Citations dans les annuaires locaux", "Pages géolocalisées ciblées"] },
              { icon: BarChart3, title: "Suivi et reporting", desc: "Tableau de bord avec vos positions, votre trafic et vos conversions. Vous suivez votre progression mois par mois.", features: ["Suivi des positions en temps réel", "Rapports Google Analytics", "Rapports mensuels détaillés", "Recommandations d'amélioration continue"] },
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

      {/* Section 5 — SEO local + Map #F6F1E9 */}
      {content && (
        <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-6">
              <h2 className="text-center" style={{ color: "#2B1E3F" }}>
                Apparaître dans Google Maps et les recherches locales à {city.nameShort}
              </h2>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{content.seoLocalText}</p>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Pour apparaître dans le pack local Google Maps, votre fiche Google Business doit être complète et optimisée : photos de qualité, catégorie correcte, description riche en mots clés, horaires à jour et surtout des avis clients positifs. C'est ce triptyque site + fiche Google + avis qui vous propulse dans les 3 premiers résultats locaux.
              </p>
              <div className="pt-4">
                <MapEmbed title="Notre agence à Paris 15e" subtitle={`Nous accompagnons les TPE et indépendants de ${city.nameShort} depuis notre agence parisienne.`} />
              </div>
              <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Complétez votre stratégie avec un <Link to={`/creation-site-web/${city.slug}`} className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site web professionnel à {city.nameShort}</Link>. Consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
              </p>
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }}>{content.localFact}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 6 — Guide ville #E9F2F4 */}
      {(() => {
        const guide = getCityGuide(city.slug);
        if (!guide) return null;
        return (
          <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
            <div className="container">
              <div className="mx-auto max-w-3xl space-y-6">
                <h2 className="text-center" style={{ color: "#2B1E3F" }}>{guide.seo.title}</h2>
                {guide.seo.sections.map((section, i) => (
                  <div key={i}>
                    <h3 style={{ color: "#2B1E3F" }}>{section.heading}</h3>
                    <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>{section.text}</p>
                  </div>
                ))}
                <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Améliorez votre visibilité Google à {city.nameShort} dès maintenant. <Link to="/contact" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Demandez votre audit SEO gratuit</Link>, consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Section 7 — FAQ #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>
            Questions fréquentes sur le SEO à {city.nameShort}
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

      {/* Section 8 — Liens services #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Découvrez aussi nos autres services</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: `/creation-site-web/${city.slug}`, label: `Site web à ${city.nameShort}` },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/realisations", label: "Nos réalisations" },
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

      {/* Section 9 — Villes proches #F6F1E9 */}
      {nearCities.length > 0 && (
        <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
              Référencement SEO et GEO près de {city.nameShort}
            </h2>
            <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Notre agence SEO intervient également dans les villes voisines.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearCities.map((c) => (
                <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                  <h3 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{c.nameShort}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/referencement-seo/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                      SEO
                    </Link>
                    <Link to={`/creation-site-web/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(156,79,255,0.12)", color: "#9C4FFF" }}>
                      Création de site
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA texture — skip alternance */}
      <section data-alternate="skip" className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
            Demandez votre audit SEO gratuit : réponse en 48h
          </h2>
          <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Découvrez comment attirer plus de clients à {city.nameShort} grâce au référencement Google.
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
};

export default VilleReferencementSeo;
