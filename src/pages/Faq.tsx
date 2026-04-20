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

interface FaqItem {
  q: string;
  a: React.ReactNode;
  aText: string;
}

const faqItems: FaqItem[] = [
  // --- Création de site ---
  { q: "Combien coûte un site web ?", aText: "Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. Consultez notre page tarifs pour le détail.", a: <>Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. <Link to="/tarifs" className="text-primary font-semibold">Consultez notre page tarifs</Link> pour le détail.</> },
  { q: "Combien de temps pour créer un site ?", aText: "Un site vitrine est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.", a: <>Un <Link to="/creation-site-web" className="text-primary font-semibold">site vitrine</Link> est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.</> },
  { q: "Quelles technologies utilisez-vous ?", aText: "Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet.", a: <>Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet. Découvrez <Link to="/realisations" className="text-primary font-semibold">nos réalisations</Link>.</> },
  { q: "Le site sera-t-il adapté au mobile ?", aText: "Tous nos sites web sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs.", a: <>Tous nos <Link to="/creation-site-web" className="text-primary font-semibold">sites web</Link> sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs. Plus de 70 % des recherches locales se font sur mobile, c'est indispensable.</> },
  { q: "Puis-je modifier mon site moi-même ?", aText: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site.", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en toute autonomie." },
  { q: "Pourquoi faire du référencement SEO ?", aText: "Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google.", a: <>Le <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme.</> },
  { q: "Combien de temps pour apparaître sur Google ?", aText: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois.", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques (vitesse, structure) peuvent avoir un impact plus rapide." },
  { q: "Travaillez-vous uniquement à Paris ?", aText: "Non, nous pouvons accompagner des entreprises partout en France.", a: <>Non, nous pouvons accompagner des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone. Notre expertise en <Link to="/creation-site-web" className="text-primary font-semibold">création de site web</Link> et en <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> s'applique à toutes les localisations.</> },
  { q: "Pourquoi choisir Déclic Digital ?", aText: "Nous sommes spécialisés dans l'accompagnement des TPE.", a: <>Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google. <Link to="/qui-sommes-nous" className="text-primary font-semibold">Découvrez notre histoire</Link>.</> },
  { q: "Qu'est-ce que le GEO (Generative Engine Optimization) ?", aText: "Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité par les IA.", a: <>Le GEO regroupe toutes les techniques qui permettent à votre contenu d'être cité et utilisé par les intelligences artificielles comme ChatGPT, Perplexity ou Google AI Overviews. <Link to="/visibilite-ia" className="text-primary font-semibold">Découvrez notre offre GEO</Link>.</> },
];

const Faq = () => (
  <PageLayout>
    <Helmet>
      <title>FAQ : questions fréquentes sur la création de site et SEO | Déclic Digital</title>
      <meta name="description" content="Toutes les réponses à vos questions sur la création de site web, le référencement SEO et la visibilité IA. Tarifs, délais, méthode : on vous dit tout." />
      <link rel="canonical" href="https://declicdigital.net/faq" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map(item => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.aText },
        })),
      })}</script>
    </Helmet>

    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "FAQ" }]} />

    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-extrabold md:text-5xl mb-4">Questions fréquentes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toutes les réponses sur la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link>, le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link> et la <Link to="/visibilite-ia" className="text-primary font-semibold hover:underline">visibilité IA</Link>.
          </p>
        </motion.div>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Vous ne trouvez pas votre réponse ?</p>
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
            <Link to="/contact">Posez-nous votre question</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>

    <GoogleReviewsSection compact maxReviews={3} />
    <LocationSection />
  </PageLayout>
);

export default Faq;
