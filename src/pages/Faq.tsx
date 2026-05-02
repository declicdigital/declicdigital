import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import imgSeo from "@/assets/faq-questions-frequentes-declic-digital.webp";
import imgAvis from "@/assets/avis-google-5-etoiles-client-paris.webp";
import imgSatisfaction from "@/assets/artisan-client-satisfaction-cafe-paris.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

interface FaqItem { q: string; a: React.ReactNode; aText: string; }

const faqItems: FaqItem[] = [
  { q: "Combien coûte un site web ?", aText: "Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget.", a: <>Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Consultez notre page tarifs</Link> pour le détail.</> },
  { q: "Combien de temps pour créer un site ?", aText: "Un site vitrine est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines.", a: <>Un <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site vitrine</Link> est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.</> },
  { q: "Quelles technologies utilisez-vous ?", aText: "Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet.", a: <>Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet. Découvrez <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.</> },
  { q: "Le site sera-t-il adapté au mobile ?", aText: "Tous nos sites web sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs.", a: <>Tous nos <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>sites web</Link> sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs. Plus de 70 % des recherches locales se font sur mobile, c'est indispensable.</> },
  { q: "Puis-je modifier mon site moi-même ?", aText: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site.", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en toute autonomie." },
  { q: "Pourquoi faire du référencement SEO ?", aText: "Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google.", a: <>Le <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO</Link> permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme.</> },
  { q: "Combien de temps pour apparaître sur Google ?", aText: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois.", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques (vitesse, structure) peuvent avoir un impact plus rapide." },
  { q: "Travaillez-vous uniquement à Paris ?", aText: "Non, nous pouvons accompagner des entreprises partout en France.", a: <>Non, nous pouvons accompagner des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone. Notre expertise en <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>création de site web</Link> et en <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO</Link> s'applique à toutes les localisations.</> },
  { q: "Pourquoi choisir Déclic Digital ?", aText: "Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google.", a: <>Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google. <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Découvrez notre histoire</Link>.</> },
  { q: "Qu'est-ce que le GEO (Generative Engine Optimization) ?", aText: "Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité par les IA comme ChatGPT ou Perplexity.", a: <>Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité et utilisé par les intelligences artificielles comme ChatGPT, Perplexity ou Google AI Overviews. <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Découvrez notre offre GEO</Link>.</> },
];

const Faq = () => (
  <PageLayout>
    <Helmet>
      <title>FAQ : questions fréquentes sur la création de site et SEO | Déclic Digital</title>
      <meta name="description" content="Toutes les réponses à vos questions sur la création de site web, le référencement SEO et la visibilité IA. Tarifs, délais, méthode : on vous dit tout." />
      <link rel="canonical" href="https://declicdigital.net/faq" />
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.aText } })) })}</script>
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "FAQ" }]} />

    {/* Section 1 — Hero sombre fond image, texte centré — skip alternance */}
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
      <img
        src={imgSeo}
        alt="Analytics SEO - Déclic Digital Paris"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold border"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(246,241,233,0.8)" }}
          >
            Questions fréquentes
          </span>
          <h1 className="mb-4 leading-tight" style={{ color: "#F6F1E9" }}>
            Questions fréquentes
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(246,241,233,0.75)" }}>
            Toutes les réponses sur la{" "}
            <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#F6F1E9" }}>création de site web</Link>,
            le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#F6F1E9" }}>référencement SEO</Link>{" "}
            et la{" "}
            <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: "#F6F1E9" }}>visibilité IA</Link>.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Section 2 — FAQ accordéon + image avis collante #F6F1E9 */}
    <section style={{ backgroundColor: "#F6F1E9" }} className="py-12 md:py-16">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-12 items-start mx-auto max-w-5xl">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-xl px-4"
                  style={{ backgroundColor: "#E9F2F4", border: "1px solid rgba(43,30,63,0.1)" }}
                >
                  <AccordionTrigger
                    className="text-left text-base font-semibold hover:no-underline"
                    style={{ color: "#2B1E3F" }}
                  >
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-10 text-center lg:text-left">
              <p className="mb-4" style={{ color: "#2B1E3F", opacity: 0.6 }}>Vous ne trouvez pas votre réponse ?</p>
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/contact">Posez-nous votre question</Link>
              </Button>
            </div>
          </div>
          {/* Colonne droite : image avis collante */}
          <div className="hidden lg:flex flex-col gap-6 sticky top-24">
            <div
              className="relative overflow-hidden rounded-2xl group"
              style={{ aspectRatio: "2/3", boxShadow: "0 8px 40px rgba(43,30,63,0.15)" }}
            >
              <img
                src={imgAvis}
                alt="Avis Google 5 étoiles - Déclic Digital"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(15,10,46,0.3), rgba(79,195,195,0.15))" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section 3 — Satisfaction image overlap DROITE #E9F2F4 */}
    <section style={{ backgroundColor: "#E9F2F4" }} className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="relative mx-auto max-w-5xl min-h-[320px] flex items-center">
          {/* Image qui déborde à droite avec fondu vers #E9F2F4 */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
            <img
              src={imgSatisfaction}
              alt="Client satisfait - Déclic Digital"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, #E9F2F4 0%, rgba(233,242,244,0.4) 30%, transparent 70%)" }}
            />
          </div>
          {/* Texte à gauche */}
          <div className="relative z-10 max-w-2xl space-y-5 py-8">
            <h2 style={{ color: "#2B1E3F" }}>Des clients qui nous font confiance</h2>
            <p className="text-lg" style={{ color: "#2B1E3F" }}>
              Chaque projet démarre par une vraie conversation. On prend le temps de comprendre votre métier, vos clients, vos objectifs - avant de coder la première ligne.
            </p>
            <p style={{ color: "#2B1E3F", opacity: 0.7 }}>
              Résultat : des sites qui ressemblent à leurs propriétaires, qui plaisent à leurs clients, et qui se trouvent sur Google.
            </p>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Section 4 — GoogleReviews #F6F1E9 */}
    <GoogleReviewsSection compact maxReviews={3} backgroundColor="#F6F1E9" />

    {/* Section 5 — LocationSection #E9F2F4 */}
    <LocationSection backgroundColor="#E9F2F4" />

    {/* CTA texture — skip alternance */}
    <section data-alternate="skip" className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold" style={{ color: "#2B1E3F" }}>Prêt à lancer votre projet ?</h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>
          Audit SEO gratuit, devis en 24h, aucun engagement. On répond à toutes vos questions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/contact">Demander un audit SEO gratuit</Link>
          </Button>
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
            <Link to="/tarifs">Voir nos tarifs</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Faq;
