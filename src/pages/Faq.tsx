import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const FaqAiChatSidebar = lazy(() => import("@/components/FaqAiChat").then(m => ({ default: m.FaqAiChatSidebar })));

interface FaqItem {
  q: string;
  a: React.ReactNode;
  aText: string; // plain text for JSON-LD
}

const faqItems: FaqItem[] = [
  // --- Création de site ---
  { q: "Combien coûte un site web ?", aText: "Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. Consultez notre page tarifs pour le détail.", a: <>Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. <Link to="/tarifs" className="text-primary font-semibold">Consultez notre page tarifs</Link> pour le détail.</> },
  { q: "Combien de temps pour créer un site ?", aText: "Un site vitrine est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.", a: <>Un <Link to="/creation-site-web" className="text-primary font-semibold">site vitrine</Link> est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités.</> },
  { q: "Quelles technologies utilisez-vous ?", aText: "Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet. Le choix dépend de vos objectifs et de votre budget.", a: <>Nous utilisons WordPress, Shopify, Lovable et des technologies sur mesure selon les besoins du projet. Le choix dépend de vos objectifs et de votre budget. Découvrez <Link to="/realisations" className="text-primary font-semibold">nos réalisations</Link>.</> },
  { q: "Le site sera-t-il adapté au mobile ?", aText: "Tous nos sites web sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs. Plus de 70 % des recherches locales se font sur mobile, c'est indispensable.", a: <>Tous nos <Link to="/creation-site-web" className="text-primary font-semibold">sites web</Link> sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs. Plus de 70 % des recherches locales se font sur mobile, c'est indispensable.</> },
  { q: "Puis-je modifier mon site moi-même ?", aText: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en toute autonomie.", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en toute autonomie." },
  { q: "Qu'est-ce qu'un bon site web ?", aText: "Un bon site web est rapide, responsive, bien référencé, avec un design professionnel et une navigation intuitive qui guide vers la conversion.", a: <>Un bon site web est rapide, responsive, bien référencé, avec un design professionnel et une navigation intuitive qui guide vers la conversion. <Link to="/creation-site-web" className="text-primary font-semibold">Découvrez nos solutions</Link>.</> },
  { q: "Faut-il un nom de domaine ?", aText: "Oui, un nom de domaine est nécessaire pour votre identité en ligne. Nous pouvons vous accompagner dans le choix et l'achat de votre nom de domaine.", a: <>Oui, un nom de domaine est nécessaire pour votre identité en ligne. Nous pouvons vous accompagner dans le choix et l'achat de votre nom de domaine. <Link to="/rendez-vous" className="text-primary font-semibold">Contactez-nous</Link>.</> },
  { q: "Proposez-vous la création de contenu ?", aText: "Oui, nous pouvons rédiger des textes optimisés SEO pour votre site, vos pages de services et vos articles de blog. Un contenu de qualité est essentiel pour le référencement.", a: <>Oui, nous pouvons rédiger des textes optimisés <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> pour votre site, vos pages de services et vos articles de blog. Un contenu de qualité est essentiel pour le référencement.</> },
  { q: "Que comprend la création d'un site vitrine ?", aText: "Un site vitrine inclut généralement une page d'accueil, une page de services, une page contact, les mentions légales et l'optimisation SEO de base.", a: <>Un site vitrine inclut généralement une page d'accueil, une page de services, une page contact, les mentions légales et l'optimisation SEO de base. <Link to="/tarifs" className="text-primary font-semibold">Voir nos offres détaillées</Link>.</> },
  { q: "Pouvez-vous refaire mon site existant ?", aText: "Oui, nous proposons des refontes de sites. Nous analysons votre site actuel via un audit gratuit pour identifier ce qui fonctionne et ce qu'il faut améliorer.", a: <>Oui, nous proposons des refontes de sites. Nous analysons votre site actuel via un <Link to="/contact" className="text-primary font-semibold">audit gratuit</Link> pour identifier ce qui fonctionne et ce qu'il faut améliorer.</> },
  { q: "Mon site sera-t-il sécurisé (HTTPS) ?", aText: "Absolument. Tous nos sites sont livrés avec un certificat SSL (HTTPS), indispensable pour la sécurité des visiteurs et le référencement Google.", a: <>Absolument. Tous nos sites sont livrés avec un certificat SSL (HTTPS), indispensable pour la sécurité des visiteurs et le <Link to="/referencement-seo" className="text-primary font-semibold">référencement Google</Link>.</> },
  { q: "Créez-vous des sites e-commerce ?", aText: "Oui, nous réalisons des boutiques en ligne avec Shopify ou WooCommerce. Le choix de la plateforme dépend de votre catalogue et de vos besoins.", a: <>Oui, nous réalisons des boutiques en ligne avec Shopify ou WooCommerce. Le choix de la plateforme dépend de votre catalogue et de vos besoins. <Link to="/rendez-vous" className="text-primary font-semibold">Parlons-en</Link>.</> },
  { q: "Que se passe-t-il après la mise en ligne ?", aText: "Après la livraison, nous assurons un suivi technique et pouvons vous accompagner avec un forfait de maintenance. Nous restons disponibles pour toute question ou modification.", a: <>Après la livraison, nous assurons un suivi technique et pouvons vous accompagner avec un forfait de maintenance. Nous restons disponibles pour toute question ou modification. <Link to="/tarifs" className="text-primary font-semibold">Voir nos forfaits</Link>.</> },

  // --- SEO ---
  { q: "Pourquoi faire du référencement SEO ?", aText: "Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme.", a: <>Le <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme.</> },
  { q: "Combien de temps pour apparaître sur Google ?", aText: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques (vitesse, structure) peuvent avoir un impact plus rapide.", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques (vitesse, structure) peuvent avoir un impact plus rapide." },
  { q: "Quelle est la différence entre SEO et SEA ?", aText: "Le SEO est le référencement naturel (gratuit, long terme). Le SEA correspond aux publicités payantes Google Ads (résultats immédiats mais coûteux à chaque clic).", a: <>Le <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> est le référencement naturel (gratuit, long terme). Le SEA correspond aux publicités payantes Google Ads (résultats immédiats mais coûteux à chaque clic).</> },
  { q: "Que comprend l'audit SEO gratuit ?", aText: "L'audit inclut une analyse technique, une étude de mots-clés, une analyse concurrentielle et des recommandations concrètes d'amélioration.", a: <>L'audit inclut une analyse technique, une étude de mots-clés, une analyse concurrentielle et des recommandations concrètes d'amélioration. <Link to="/contact" className="text-primary font-semibold">Demandez le vôtre</Link>.</> },
  { q: "Comment mesurez-vous les résultats SEO ?", aText: "Nous utilisons Google Analytics, Search Console et des outils professionnels pour suivre le trafic, le positionnement et les conversions.", a: <>Nous utilisons Google Analytics, Search Console et des outils professionnels pour suivre le trafic, le positionnement et les conversions. En savoir plus sur notre <Link to="/referencement-seo" className="text-primary font-semibold">méthode SEO</Link>.</> },
  { q: "Le SEO local, c'est quoi ?", aText: "Le SEO local optimise votre visibilité pour les recherches géolocalisées (plombier Paris 15, coiffeur Boulogne). C'est essentiel pour les artisans et commerces de proximité.", a: <>Le SEO local optimise votre visibilité pour les recherches géolocalisées ("plombier Paris 15", "coiffeur Boulogne"). C'est essentiel pour les artisans et commerces de proximité. <Link to="/nos-villes" className="text-primary font-semibold">Voir nos zones d'intervention</Link>.</> },
  { q: "Google My Business, c'est important ?", aText: "Oui, votre fiche Google Business Profile est cruciale pour le SEO local. Elle apparaît dans Google Maps et les résultats locaux. Nous pouvons vous aider à l'optimiser.", a: <>Oui, votre fiche Google Business Profile est cruciale pour le SEO local. Elle apparaît dans Google Maps et les résultats locaux. Nous pouvons vous aider à l'optimiser dans le cadre de notre <Link to="/referencement-seo" className="text-primary font-semibold">accompagnement SEO</Link>.</> },
  { q: "Faut-il un blog sur son site pour le SEO ?", aText: "Un blog est un excellent levier SEO : il permet de cibler de nouveaux mots-clés, de montrer votre expertise et d'attirer du trafic qualifié.", a: <>Un blog est un excellent levier SEO : il permet de cibler de nouveaux mots-clés, de montrer votre expertise et d'attirer du trafic qualifié. <Link to="/blog" className="text-primary font-semibold">Voir notre blog</Link> pour des exemples.</> },
  { q: "Les avis Google aident-ils le référencement ?", aText: "Oui, les avis Google renforcent votre crédibilité et améliorent votre classement dans les résultats locaux. Plus vous avez d'avis positifs, plus Google vous met en avant.", a: <>Oui, les avis Google renforcent votre crédibilité et améliorent votre classement dans les résultats locaux. Plus vous avez d'avis positifs, plus Google vous met en avant.</> },

  // --- Général / Agence ---
  { q: "Un site peut-il vraiment générer des clients ?", aText: "Absolument. Un site bien conçu et bien référencé devient un véritable outil commercial qui attire des prospects qualifiés 24h/24.", a: <>Absolument. Un site bien conçu et bien référencé devient un véritable outil commercial qui attire des prospects qualifiés 24h/24. Découvrez <Link to="/realisations" className="text-primary font-semibold">nos réalisations</Link>.</> },
  { q: "Mon site actuel peut-il être amélioré ?", aText: "Dans la plupart des cas, oui. Notre audit gratuit analyse votre site et identifie les axes d'amélioration prioritaires.", a: <>Dans la plupart des cas, oui. Notre <Link to="/contact" className="text-primary font-semibold">audit gratuit</Link> analyse votre site et identifie les axes d'amélioration prioritaires.</> },
  { q: "Proposez-vous la maintenance du site ?", aText: "Oui, nos forfaits de maintenance incluent les mises à jour, la sécurité et le suivi des performances.", a: <>Oui, nos forfaits de maintenance incluent les mises à jour, la sécurité et le suivi des performances. <Link to="/tarifs" className="text-primary font-semibold">Consultez nos tarifs</Link>.</> },
  { q: "Travaillez-vous uniquement à Paris ?", aText: "Non, nous pouvons accompagner des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone. Nous avons simplement une expertise renforcée sur Paris et les Hauts-de-Seine (92).", a: <>Non, nous pouvons accompagner des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone. Notre expertise en <Link to="/creation-site-web" className="text-primary font-semibold">création de site web</Link> et en <Link to="/referencement-seo" className="text-primary font-semibold">SEO</Link> s'applique à toutes les localisations. Nous avons simplement une expertise renforcée sur <Link to="/nos-villes" className="text-primary font-semibold">Paris et les Hauts-de-Seine (92)</Link>.</> },
  { q: "Comment se passe la collaboration ?", aText: "Nous commençons par un échange pour comprendre vos besoins. Puis nous proposons une maquette, développons le site et l'optimisons pour le SEO.", a: <>Nous commençons par un échange pour comprendre vos besoins. Puis nous proposons une maquette, développons le <Link to="/creation-site-web" className="text-primary font-semibold">site</Link> et l'optimisons pour le SEO. <Link to="/qui-sommes-nous" className="text-primary font-semibold">En savoir plus sur notre équipe</Link>.</> },
  { q: "Pourquoi choisir Déclic Digital ?", aText: "Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google. Approche transparente, orientée résultats et adaptée aux petits budgets.", a: <>Nous sommes spécialisés dans l'accompagnement des TPE. Notre fondateur est Expert Produit Google. Approche transparente, orientée résultats et adaptée aux petits budgets. <Link to="/qui-sommes-nous" className="text-primary font-semibold">Découvrez notre histoire</Link>.</> },
  { q: "Y a-t-il un engagement de durée ?", aText: "Oui, nous proposons un engagement de 6 mois renouvelable. Cette durée permet de mettre en place une stratégie efficace et de mesurer les premiers résultats.", a: <>Oui, nous proposons un engagement de 6 mois renouvelable. Cette durée permet de mettre en place une stratégie efficace et de mesurer les premiers résultats. <Link to="/tarifs" className="text-primary font-semibold">Consulter nos tarifs</Link>.</> },
  { q: "Quels sont vos délais de réponse ?", aText: "Nous répondons généralement sous 24 à 48h. Pour les demandes d'audit SEO, vous recevez un retour détaillé sous 48h.", a: <>Nous répondons généralement sous 24 à 48h. Pour les demandes d'audit SEO, vous recevez un retour détaillé sous 48h. <Link to="/rendez-vous" className="text-primary font-semibold">Contactez-nous</Link>.</> },
  { q: "Puis-je voir des exemples de sites réalisés ?", aText: "Bien sûr ! Consultez notre page réalisations pour voir des exemples concrets de sites créés pour nos clients.", a: <>Bien sûr ! Consultez notre page <Link to="/realisations" className="text-primary font-semibold">réalisations</Link> pour voir des exemples concrets de sites créés pour nos clients.</> },
  { q: "Proposez-vous des facilités de paiement ?", aText: "Oui, nos formules mensuelles à partir de 50€/mois permettent de lisser l'investissement. Pas de gros montant à avancer.", a: <>Oui, nos formules mensuelles à partir de 50€/mois permettent de lisser l'investissement. Pas de gros montant à avancer. <Link to="/tarifs" className="text-primary font-semibold">Voir les détails</Link>.</> },

  // --- Artisans / TPE spécifique ---
  { q: "Je suis artisan, ai-je vraiment besoin d'un site ?", aText: "Plus de 70 % des clients cherchent un artisan sur Google. Sans site, vous êtes invisible face à vos concurrents. Un site bien fait travaille pour vous 24h/24.", a: <>Plus de 70 % des clients cherchent un artisan sur Google. Sans site, vous êtes invisible face à vos concurrents. Un site bien fait travaille pour vous 24h/24. <Link to="/blog/site-web-artisan-paris-pourquoi-il-ne-rapporte-pas" className="text-primary font-semibold">Lire notre article dédié</Link>.</> },
  { q: "Mon site ne génère aucun appel, pourquoi ?", aText: "Les raisons les plus fréquentes : absence de SEO, site trop lent, pas de bouton d'appel visible, contenu trop vague. Notre audit gratuit identifie précisément ce qui bloque.", a: <>Les raisons les plus fréquentes : absence de SEO, site trop lent, pas de bouton d'appel visible, contenu trop vague. Notre <Link to="/contact" className="text-primary font-semibold">audit gratuit</Link> identifie précisément ce qui bloque.</> },
  { q: "Combien de temps pour avoir un retour sur investissement ?", aText: "Avec un site bien optimisé, les premiers contacts arrivent généralement sous 2 à 4 mois. Le ROI dépend de votre secteur et de la concurrence locale.", a: <>Avec un site bien optimisé, les premiers contacts arrivent généralement sous 2 à 4 mois. Le ROI dépend de votre secteur et de la concurrence locale. <Link to="/realisations" className="text-primary font-semibold">Voir nos études de cas</Link>.</> },
  { q: "La vitesse de mon site est-elle importante ?", aText: "Oui, 53 % des visiteurs quittent un site qui met plus de 3 secondes à charger. La vitesse impacte aussi votre classement Google.", a: <>Oui, 53 % des visiteurs quittent un site qui met plus de 3 secondes à charger. La vitesse impacte aussi votre classement Google. <Link to="/blog/vitesse-site-web-impact-chiffre-affaires" className="text-primary font-semibold">En savoir plus</Link>.</> },
];

const Faq = () => {
  const faqSchemaItems = faqItems.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.aText,
    }
  }));

  return (
    <PageLayout>
      <Helmet>
        <title>FAQ : questions sur la création de site web et le SEO | Déclic Digital</title>
        <meta name="description" content="Combien coûte un site web ? Combien de temps pour apparaitre sur Google ? Retrouvez toutes les réponses sur la création de site et le SEO pour TPE et artisans." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/faq" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSchemaItems
        })}</script>
      </Helmet>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Qui sommes-nous", href: "/qui-sommes-nous" }, { label: "FAQ" }]} />

      {/* Hero sans image */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Questions fréquentes sur la création de site internet et le SEO
            </h1>
            <p className="text-lg text-muted-foreground">
              Retrouvez les réponses aux questions les plus posées sur la <Link to="/creation-site-web" className="text-primary font-semibold">création de site web</Link>, le <Link to="/referencement-seo" className="text-primary font-semibold">référencement SEO et GEO</Link> et nos services pour les TPE et artisans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ + AI Sidebar */}
      <SectionWrapper>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* FAQ Accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border bg-card px-6 shadow-card">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* AI Sidebar */}
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <FaqAiChatSidebar />
            </Suspense>
          </div>
        </div>

        {/* Mobile AI chat */}
        <div className="mt-10 lg:hidden">
          <Suspense fallback={null}>
            <FaqAiChatSidebar />
          </Suspense>
        </div>
      </SectionWrapper>

      {/* Maillage */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-4">Découvrez nos services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/creation-site-web" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Création de site web</Link>
            <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Référencement SEO</Link>
            <Link to="/visibilite-ia" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Visibilité IA (GEO)</Link>
            <Link to="/contact" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Audit SEO gratuit</Link>
            <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Nos tarifs</Link>
            <Link to="/realisations" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Nos réalisations</Link>
            <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Nos villes</Link>
            <Link to="/blog" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">Blog</Link>
          </div>
        </div>
      </SectionWrapper>

      <GoogleReviewsSection compact maxReviews={3} className="bg-section-blue" />

      <LocationSection />

      {/* CTA */}
      <section className="gradient-miami py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white">Vous avez d'autres questions ?</h2>
          <p className="mb-8 text-white/80">Contactez-nous, nous serons ravis de vous répondre.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="rounded-full bg-[#f6f1e9] hover:bg-[#ede6d8] px-8 font-semibold text-[hsl(263,36%,18%)] shadow-lg btn-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-8 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
              Audit SEO gratuit
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Faq;
