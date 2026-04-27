import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import imgSeo from "@/assets/seo-analytics-paris-bureau.webp";
import imgAvis from "@/assets/avis-google-5-etoiles-client-paris.webp";
import imgSatisfaction from "@/assets/artisan-client-satisfaction-cafe-paris.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

interface FaqItem { q: string; a: React.ReactNode; aText: string; }

const faqItems: FaqItem[] = [
  { q: "Combien coûte un site web ?", aText: "Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget.", a: <>Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. <Link to="/tarifs" className="text-primary font-semibold">Consultez notre page tarifs</Link> pour le détail.</> },
  { q: "Combien de temps pour créer un site ?", aText: "Un site vitrine est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines.", a: <>Un <Link to="/creation-site-web" className="text-primary font-semibold">site vitrine</Link> est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.</> },
  { q: "Quelles technologies utilisez-vous ?", aText: "Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet.", a: <>Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet. Découvrez <Link to="/realisations" className="text-primary font-semibold">nos réalisations</Link>.</> },
  { q: "Le site sera-t-il adapté au mobile ?", aText: "Tous nos sites web sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs.", a: <>Tous nos <Link to="/creation-site-web" className="text-primary font-semibold">sites web</Link> sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs. Plus de 70 % des recherches locales se font sur mobile, c'est indispensable.</> },
  { q: "Puis-je modifier mon site moi-même ?", aText: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site.", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en toute autonomie." },
  { q: "Pourquoi faire du référencement SEO ?", aText: "Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google.", a: <>Le <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme.</> },
  { q: "Combien de temps pour apparaître sur Google ?", aText: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois.", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques (vitesse, structure) peuvent avoir un impact plus rapide." },
  { q: "Travaillez-vous uniquement à Paris ?", aText: "Non, nous pouvons accompagner des entreprises partout en France.", a: <>Non, nous pouvons accompagner des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone. Notre expertise en <Link to="/creation-site-web" className="text-primary font-semibold">création de site web</Link> et en <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> s'applique à toutes les localisations.</> },
  { q: "Pourquoi choisir Déclic Digital ?", aText: "Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google.", a: <>Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google. <Link to="/qui-sommes-nous" className="text-primary font-semibold">Découvrez notre histoire</Link>.</> },
  { q: "Qu'est-ce que le GEO (Generative Engine Optimization) ?", aText: "Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité par les IA comme ChatGPT ou Perplexity.", a: <>Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité et utilisé par les intelligences artificielles comme ChatGPT, Perplexity ou Google AI Overviews. <Link to="/visibilite-ia" className="text-primary font-semibold">Découvrez notre offre GEO</Link>.</> },
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

    {/* ─── Hero avec image SEO en fond partiel ────────────────────────────── */}
    <section className="gradient-hero py-16 md:py-24 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold md:text-5xl mb-4">Questions fréquentes</h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Toutes les réponses sur la <Link to="/creation-site-web" className="text-primary font-semibold">création de site web</Link>, le <Link to="/referencement-seo" className="text-primary font-semibold">référencement SEO</Link> et la <Link to="/visibilite-ia" className="text-primary font-semibold">visibilité IA</Link>.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl shadow-card group h-64">
              <img src={imgSeo} alt="Analytics SEO - Déclic Digital Paris" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Accordéon FAQ + image avis côté */}
    <SectionWrapper>
      <div className="grid lg:grid-cols-3 gap-12 items-start mx-auto max-w-5xl">
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-4">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center lg:text-left">
            <p className="text-muted-foreground mb-4">Vous ne trouvez pas votre réponse ?</p>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
              <Link to="/contact">Posez-nous votre question</Link>
            </Button>
          </div>
        </div>
        {/* Colonne droite : image avis collante */}
        <div className="hidden lg:flex flex-col gap-6 sticky top-24">
          <div className="relative overflow-hidden rounded-2xl shadow-card group" style={{ aspectRatio: "2/3" }}>
            <img src={imgAvis} alt="Avis Google 5 étoiles - Déclic Digital" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-card text-center">
            <p className="text-2xl font-extrabold text-primary mb-1">4.9 ⭐</p>
            <p className="text-sm text-muted-foreground">Note moyenne sur Google</p>
            <Link to="/realisations" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Voir nos réalisations →</Link>
          </div>
        </div>
      </div>
    </SectionWrapper>

    {/* Section satisfaction avec image overlap */}
    <SectionWrapper>
      <div className="relative mx-auto max-w-5xl">
        <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
          <img src={imgSatisfaction} alt="Client satisfait - Déclic Digital" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)/0.4) 30%, transparent 65%)" }} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-5 py-8">
          <h2 className="text-3xl font-extrabold md:text-4xl">Des clients qui nous font confiance</h2>
          <p className="text-lg text-muted-foreground">Chaque projet démarre par une vraie conversation. On prend le temps de comprendre votre métier, vos clients, vos objectifs — avant de coder la première ligne.</p>
          <p className="text-muted-foreground">Résultat : des sites qui ressemblent à leurs propriétaires, qui plaisent à leurs clients, et qui se trouvent sur Google.</p>
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>

    <GoogleReviewsSection compact maxReviews={3} />
    <LocationSection />

    {/* CTA final avec texture */}
    <section className="relative overflow-hidden py-16">
      <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0" style={{ background: "hsl(263,36%,18%,0.82)" }} />
      <div className="container relative z-10 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-white">Prêt à lancer votre projet ?</h2>
        <p className="mb-8 text-white/80 max-w-xl mx-auto">Audit SEO gratuit, devis en 24h, aucun engagement. On répond à toutes vos questions.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
            <Link to="/contact">Demander un audit SEO gratuit</Link>
          </Button>
          <Link to="/tarifs" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
            Voir nos tarifs
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Faq;
