import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroFaq from "@/assets/questions-frequentes-creation-site.png";

const faqItems = [
  { q: "Combien coûte un site web ?", a: <>Nos tarifs commencent à partir de 50€ par mois + un premier mois de mise en service. Chaque devis est adapté à vos besoins et votre budget. <Link to="/tarifs" className="text-primary font-semibold hover:underline">Consultez notre page tarifs</Link> pour le détail.</> },
  { q: "Combien de temps pour créer un site ?", a: "Un site vitrine est livré en 1 à 2 semaines. Un site plus avancé ou e-commerce peut prendre 2 à 4 semaines selon le nombre de pages et fonctionnalités." },
  { q: "Pourquoi faire du référencement SEO ?", a: <>Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme. <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">En savoir plus sur le SEO</Link>.</> },
  { q: "Combien de temps pour apparaître sur Google ?", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques peuvent avoir un impact plus rapide." },
  { q: "Un site peut-il vraiment générer des clients ?", a: <>Absolument. Un site bien conçu et bien référencé devient un véritable outil commercial qui attire des prospects qualifiés 24h/24. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.</> },
  { q: "Quelle est la différence entre SEO et SEA ?", a: "Le SEO est le référencement naturel (gratuit mais long terme). Le SEA correspond aux publicités payantes sur Google (résultats immédiats mais coûteux)." },
  { q: "Mon site actuel peut-il être amélioré ?", a: <>Dans la plupart des cas, oui. Notre <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">audit gratuit</Link> analyse votre site et identifie les axes d'amélioration prioritaires.</> },
  { q: "Proposez-vous la maintenance du site ?", a: "Oui, nous proposons des forfaits de maintenance incluant les mises à jour, la sécurité et le suivi des performances." },
  { q: "Travaillez-vous avec des PME de toute la France ?", a: <>Oui, nous accompagnons des entreprises partout en France. Nous intervenons principalement à <Link to="/nos-villes" className="text-primary font-semibold hover:underline">Paris et dans le 92</Link>. Nos échanges se font par visioconférence, email et téléphone.</> },
  { q: "Quelles technologies utilisez-vous ?", a: "Nous utilisons WordPress, Shopify, Lovable, Base44 et des technologies sur mesure selon les besoins du projet. Chaque solution est choisie pour ses performances." },
  { q: "Le site sera-t-il adapté au mobile ?", a: "Tous nos sites sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs de bureau." },
  { q: "Que comprend l'audit SEO gratuit ?", a: <>L'audit inclut une analyse technique, une étude des mots clés, une analyse concurrentielle et des recommandations concrètes d'amélioration. <Link to="/audit-seo-gratuit" className="text-primary font-semibold hover:underline">Demandez le vôtre</Link>.</> },
  { q: "Puis-je modifier mon site moi-même ?", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en autonomie." },
  { q: "Comment mesurez-vous les résultats SEO ?", a: "Nous utilisons Google Analytics, Search Console et des outils professionnels pour suivre le trafic, le positionnement et les conversions." },
  { q: "Faut-il un nom de domaine ?", a: "Oui, un nom de domaine est nécessaire. Nous pouvons vous accompagner dans le choix et l'achat de votre nom de domaine." },
  { q: "Qu'est-ce qu'un bon site web ?", a: <>Un bon site web est rapide, responsive, bien référencé, avec un design professionnel et une navigation intuitive qui guide vers la conversion. <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">Découvrez nos solutions</Link>.</> },
  { q: "Proposez-vous la création de contenu ?", a: "Oui, nous pouvons rédiger des textes optimisés SEO pour votre site, vos pages de services et vos articles de blog." },
  { q: "Comment se passe la collaboration ?", a: <>Nous commençons par un échange pour comprendre vos besoins. Puis nous proposons une maquette, développons le site et l'optimisons pour le SEO. <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">En savoir plus sur notre équipe</Link>.</> },
  { q: "Pourquoi choisir Déclic Digital ?", a: <>Nous sommes spécialisés dans l'accompagnement des PME. Notre fondateur est Expert Produit Google. Approche transparente, orientée résultats et adaptée aux petits budgets. <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">Découvrez notre histoire</Link>.</> },
  { q: "Y a-t-il un engagement de durée ?", a: "Oui, nous proposons un engagement de 6 mois renouvelable. Cette durée permet de mettre en place une stratégie efficace et d'obtenir des résultats concrets." },
];

const Faq = () => (
  <PageLayout>
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Questions <span className="text-gradient">fréquentes</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Retrouvez les réponses aux questions les plus posées sur la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link> et le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroFaq} alt="Questions fréquentes sur la création de site web" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
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
    </SectionWrapper>

    {/* Maillage */}
    <SectionWrapper className="bg-card">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Découvrez nos services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Référencement SEO
          </Link>
          <Link to="/audit-seo-gratuit" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Audit SEO gratuit
          </Link>
          <Link to="/tarifs" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos tarifs
          </Link>
          <Link to="/realisations" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos réalisations
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Vous avez d'autres questions ?</h2>
        <p className="mb-8 text-primary-foreground/80">Contactez-nous, nous serons ravis de vous répondre.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
            <Link to="/contact">Nous contacter</Link>
          </Button>
          <Link to="/audit-seo-gratuit" className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 py-3 font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            Audit SEO gratuit
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Faq;
