import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, CheckCircle, Search, Shield, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import MapEmbed from "@/components/MapEmbed";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { getCityBySlug, cities } from "@/data/cities";
import { getSeoMeta } from "@/data/seoMeta";
import { usePageContent } from "@/hooks/usePageContent";
import { useCityContent } from "@/hooks/useCityContent";
import { Helmet } from "react-helmet-async";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const creationFaqsByRegion: Record<string, { q: string; a: string }[]> = {
  paris: [
    { q: "Combien coute un site web professionnel a Paris ?", a: "Chez Declic Digital, nos forfaits demarrent avec un premier mois de mise en service puis 50 EUR par mois tout compris : design, hebergement, maintenance et optimisation SEO. Pas de mauvaise surprise." },
    { q: "Combien de temps pour creer mon site ?", a: "Un site vitrine est livre en 2 a 3 semaines. Un site plus avance ou e-commerce peut prendre 4 a 6 semaines. Nous vous tenons informe a chaque etape via votre espace client." },
    { q: "Mon site sera-t-il visible sur Google ?", a: "Oui. Chaque site est optimise pour le referencement local des sa conception : balises SEO, vitesse de chargement, compatibilite mobile, fiche Google Business. Nous travaillons votre positionnement des le premier jour." },
    { q: "Pourrai-je modifier mon site moi-meme ?", a: "Oui, nous vous fournissons un acces simple pour modifier vos textes et images. Pour les modifications plus importantes, notre equipe intervient dans les 48h, inclus dans votre forfait." },
    { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Nous travaillons par etapes avec validation a chaque phase. Vous voyez et approuvez le design avant le developpement. Si le resultat final ne correspond pas au cahier des charges valide, nous corrigeons sans frais supplementaires." },
  ],
  "hauts-de-seine": [
    { q: "Intervenez-vous dans toutes les villes du 92 ?", a: "Oui. Nous accompagnons les TPE et independants dans toutes les communes des Hauts-de-Seine : Boulogne-Billancourt, Nanterre, Issy-les-Moulineaux, Levallois-Perret, et toutes les autres." },
    { q: "Faut-il etre a Paris pour travailler avec vous ?", a: "Non. Nous travaillons principalement a distance via visioconference et notre espace client en ligne. Nous pouvons aussi nous rencontrer dans notre agence a Paris 15e si vous le souhaitez." },
    { q: "Un site web est-il vraiment utile pour une petite entreprise du 92 ?", a: "Plus que jamais. 97% des consommateurs recherchent un professionnel en ligne avant de le contacter. Sans site, vous laissez vos concurrents capter ces clients. Le retour sur investissement est rapide." },
    { q: "Proposez-vous aussi le referencement SEO ?", a: "Oui. Chaque site que nous creons est optimise SEO des la conception. Nous proposons aussi des prestations de referencement avance pour les TPE qui veulent aller plus loin." },
    { q: "Que comprend le forfait mensuel ?", a: "Le forfait de 50 EUR par mois inclut l'hebergement, la maintenance technique, les mises a jour de securite, le support par email, et les modifications mineures de contenu. Tout est compris." },
  ],
};

const VilleCreationSite = () => {
  const { ville } = useParams<{ ville: string }>();
  const city = ville ? getCityBySlug(ville) : undefined;

  if (!city) return <Navigate to="/creation-site-web" replace />;

  const seo = getSeoMeta("creation", city.slug, city.nameShort);

  const { content } = usePageContent(`creation/${city.slug}`, {
    seoTitle: seo.title,
    seoDescription: seo.description,
    seoH1: seo.h1,
    heroIntro: "",
    creationSeoText: [],
    creationWhyText: "",
    seoLocalText: "",
    seoWhyText: "",
    localFact: "",
  });

  const { content: cityData } = useCityContent(city.slug);

  const nearCities = cities
    .filter((c) => c.region === city.region && c.slug !== city.slug)
    .slice(0, 6);
  const faqs = creationFaqsByRegion[city.region] || creationFaqsByRegion.paris;

  const heroIntro = content.heroIntro || cityData.creationIntro;
  const creationWhyText = content.creationWhyText || cityData.creationWhyText;
  const creationSeoText = content.creationSeoText.length ? content.creationSeoText : cityData.creationSeoText;
  const localFact = content.localFact || cityData.localFact;

  // ── custom_html : si defini, remplace tout le contenu de la page ──
  const customHtml = (content.override as any)?.custom_html;

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
        { label: "Creation de site web", href: "/creation-site-web" },
        { label: city.nameShort },
      ]} />

      {/* ── MODE HTML BRUT : si custom_html est defini dans Supabase ── */}
      {customHtml ? (
        <div
          className="page-custom-html"
          dangerouslySetInnerHTML={{ __html: customHtml }}
        />
      ) : (
        <>
          {/* Section 1 - Hero */}
          <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
            <div className="container">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                    Agence web {city.description}
                  </span>
                  <h1 className="mb-6" style={{ color: "#2B1E3F" }}>{content.seoH1}</h1>
                  <div className="mb-8 text-lg leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.75 }}
                    dangerouslySetInnerHTML={{ __html: heroIntro || `Vous etes une TPE ou un independant ${city.description} ? Declic Digital cree votre site internet professionnel, responsive et optimise pour Google.` }} />
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
                    <img src={geoffreyPhoto} alt={`Geoffrey, fondateur Declic Digital - creation site web ${city.nameShort}`}
                      className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" loading="lazy" decoding="async" width={128} height={128} />
                    <p className="font-bold text-lg" style={{ color: "#2B1E3F" }}>Geoffrey</p>
                    <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Expert Produit Google</p>
                    <p className="text-sm mt-2" style={{ color: "#2B1E3F", opacity: 0.6 }}>
                      Fondateur de Declic Digital, j'accompagne les entreprises {city.description} dans leur transformation digitale.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Section 2 - Avantages */}
          <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
            <div className="container">
              <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>
                {`Pourquoi les professionnels de ${city.nameShort} ont besoin d'un site web`}
              </h2>
              <div className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}
                dangerouslySetInnerHTML={{ __html: creationWhyText || `Un site internet professionnel est indispensable pour les entreprises ${city.description}.` }} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Monitor, title: "Design professionnel", desc: `Un site qui reflete le serieux de votre entreprise ${city.description}.` },
                  { icon: Smartphone, title: "100% responsive", desc: "Votre site s'affiche parfaitement sur mobile, tablette et ordinateur." },
                  { icon: TrendingUp, title: "Optimise SEO", desc: `Referencement local pour apparaitre en premiere page Google sur "${city.nameShort}".` },
                  { icon: Zap, title: "Rapide et performant", desc: "Temps de chargement optimise (LCP < 2,5s) pour une meilleure experience." },
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

          {/* Section 3 - Ce que nous livrons */}
          <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
            <div className="container">
              <h2 className="text-center mb-4" style={{ color: "#2B1E3F" }}>Ce que comprend votre site web a {city.nameShort}</h2>
              <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Chaque site est concu sur-mesure, optimise pour le referencement local et livre en 2 a 3 semaines.
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Site vitrine", desc: `Presentez votre activite ${city.description} avec un site elegant et optimise.`, features: ["Design sur mesure", "Formulaire de contact", "Fiche Google Maps integree", "Optimisation SEO local", "Bouton d'appel direct", "Galerie photos / portfolio"] },
                  { title: "Site e-commerce", desc: `Vendez vos produits en ligne depuis ${city.nameShort}. Boutique complete avec paiement securise.`, features: ["Catalogue produits illimite", "Paiement securise (CB, PayPal)", "Gestion des commandes", "Suivi de livraison", "Optimisation conversion", "Statistiques de vente"] },
                  { title: "Site sur mesure", desc: `Un site web unique pour votre entreprise ${city.description}.`, features: ["Fonctionnalites sur mesure", "Espace client / reservation", "Integrations API tierces", "Evolutif et scalable", "Formation a l'utilisation", "Support technique dedie"] },
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

          {/* Section 4 - SEO local + Map */}
          {(creationSeoText.length > 0 || localFact) && (
            <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
              <div className="container">
                <div className="mx-auto max-w-3xl space-y-6">
                  <h2 className="text-center" style={{ color: "#2B1E3F" }}>
                    Referencement local {city.nameShort} : apparaissez dans Google Maps
                  </h2>
                  {creationSeoText.map((text, i) => (
                    <div key={i} className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}
                      dangerouslySetInnerHTML={{ __html: text }} />
                  ))}
                  <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                    Un site web seul ne suffit pas : il doit etre accompagne d'une fiche Google Business Profile optimisee. Nous creons et optimisons votre fiche avec photos professionnelles, categorie adaptee, zone de service et collecte d'avis clients.
                  </p>
                  <div className="pt-4">
                    <MapEmbed title="Declic Digital, votre agence web"
                      subtitle={`Bases a Paris 15e, nous accompagnons les professionnels de ${city.nameShort} dans leur visibilite en ligne.`} />
                  </div>
                  <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                    Decouvrez nos <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>tarifs adaptes aux TPE</Link>, nos <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>realisations</Link> ou demandez un <Link to="/contact" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>audit SEO gratuit</Link>.
                  </p>
                  {localFact && (
                    <div className="rounded-2xl p-6" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: "#4361EE" }}>Le saviez-vous ?</p>
                      <div className="text-sm" style={{ color: "#2B1E3F", opacity: 0.7 }} dangerouslySetInnerHTML={{ __html: localFact }} />
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section 5 - Guide ville */}
          {(cityData.guideCreationTitle || cityData.guideCreationSections.length > 0) && (
            <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
              <div className="container">
                <div className="mx-auto max-w-3xl space-y-6">
                  {cityData.guideCreationTitle && (
                    <h2 className="text-center" style={{ color: "#2B1E3F" }}>{cityData.guideCreationTitle}</h2>
                  )}
                  {cityData.guideCreationSections.map((section, i) => (
                    <div key={i}>
                      {section.heading && <h3 style={{ color: "#2B1E3F" }}>{section.heading}</h3>}
                      <div className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}
                        dangerouslySetInnerHTML={{ __html: section.text }} />
                    </div>
                  ))}
                  <p className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                    Pret a creer votre site web a {city.nameShort} ? <Link to="/rendez-vous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Prenez rendez-vous</Link>, consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> ou decouvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos realisations</Link>.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 6 - Process */}
          <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
            <div className="container">
              <h2 className="text-center mb-10" style={{ color: "#2B1E3F" }}>Comment se deroule votre projet ?</h2>
              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { icon: Search, step: "1", title: "Echange et analyse", desc: "Nous echangeons sur vos besoins, votre activite et vos objectifs pour definir le cahier des charges ideal." },
                  { icon: Monitor, step: "2", title: "Maquette et design", desc: "Nous creons une maquette visuelle que vous validez avant le developpement. Aucune surprise." },
                  { icon: Shield, step: "3", title: "Developpement", desc: "Votre site est developpe avec les meilleures technologies, optimise pour le SEO et la performance." },
                  { icon: Clock, step: "4", title: "Mise en ligne", desc: "Votre site est mis en ligne et indexe sur Google. Formation et suivi technique inclus." },
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
                Questions frequentes sur la creation de site a {city.nameShort}
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
                <Link to="/faq" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Voir toutes les questions frequentes</Link>
              </p>
            </div>
          </section>

          {/* Section 8 - Liens services */}
          <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16">
            <div className="container">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4" style={{ color: "#2B1E3F" }}>Decouvrez aussi nos autres services</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { to: "/referencement-seo", label: "Referencement SEO et GEO" },
                    { to: `/referencement-seo/${city.slug}`, label: `SEO a ${city.nameShort}` },
                    { to: "/contact", label: "Audit SEO gratuit" },
                    { to: "/tarifs", label: "Nos tarifs" },
                    { to: "/nos-metiers", label: "Nos metiers" },
                    { to: "/nos-villes", label: "Toutes nos villes" },
                  ].map((l) => (
                    <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{ border: "1px solid rgba(43,30,63,0.2)", backgroundColor: "#F6F1E9", color: "#2B1E3F" }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 9 - Villes proches */}
          {nearCities.length > 0 && (
            <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
              <div className="container">
                <h2 className="text-center mb-6" style={{ color: "#2B1E3F" }}>
                  Creation de site web pres de {city.nameShort}
                </h2>
                <p className="text-center mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  Nous intervenons egalement dans les villes voisines pour la creation de sites internet professionnels.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {nearCities.map((c) => (
                    <div key={c.slug} className="rounded-2xl p-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px rgba(43,30,63,0.08)" }}>
                      <h3 className="font-bold mb-2" style={{ color: "#2B1E3F" }}>{c.nameShort}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/creation-site-web/${c.slug}`} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                          style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}>
                          Creation de site
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
          )}

          {/* CTA texture */}
          <section data-alternate="skip" className="relative overflow-hidden py-16">
            <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
            <div className="container relative z-10 text-center">
              <h2 className="mb-4" style={{ color: "#2B1E3F" }}>
                Vous etes base(e) a {city.nameShort} ? Parlons de votre projet.
              </h2>
              <p className="mb-8" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                Contactez-nous pour un devis gratuit et personnalise. Premier mois de mise en service + 50 EUR/mois.
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
        </>
      )}
    </PageLayout>
  );
};

export default VilleCreationSite;
