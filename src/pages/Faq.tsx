import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroFaq from "@/assets/questions-frequentes-creation-site.png";

const faqItems = [
  { q: "Combien coûte un site web ?", a: "Le prix varie selon la complexité du projet. Un site vitrine professionnel commence à partir de quelques centaines d'euros. Nous adaptons chaque devis à vos besoins et votre budget." },
  { q: "Combien de temps pour créer un site ?", a: "En moyenne, un site vitrine est livré en 2 à 4 semaines. Un site e-commerce peut prendre 4 à 8 semaines selon le nombre de produits et fonctionnalités." },
  { q: "Pourquoi faire du référencement SEO ?", a: "Le SEO permet d'attirer des visiteurs qualifiés gratuitement depuis Google. C'est un investissement durable qui génère des clients sur le long terme." },
  { q: "Combien de temps pour apparaître sur Google ?", a: "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois. Certaines améliorations techniques peuvent avoir un impact plus rapide." },
  { q: "Un site peut-il vraiment générer des clients ?", a: "Absolument. Un site bien conçu et bien référencé devient un véritable outil commercial qui attire des prospects qualifiés 24h/24." },
  { q: "Quelle est la différence entre SEO et SEA ?", a: "Le SEO est le référencement naturel (gratuit mais long terme). Le SEA correspond aux publicités payantes sur Google (résultats immédiats mais coûteux)." },
  { q: "Mon site actuel peut-il être amélioré ?", a: "Dans la plupart des cas, oui. Notre audit gratuit analyse votre site et identifie les axes d'amélioration prioritaires." },
  { q: "Proposez-vous la maintenance du site ?", a: "Oui, nous proposons des forfaits de maintenance incluant les mises à jour, la sécurité et le suivi des performances." },
  { q: "Travaillez-vous avec des PME de toute la France ?", a: "Oui, nous accompagnons des entreprises partout en France. Nos échanges se font par visioconférence, email et téléphone." },
  { q: "Quelles technologies utilisez-vous ?", a: "Nous utilisons WordPress, Shopify, Lovable, Base44 et des technologies sur mesure selon les besoins du projet. Chaque solution est choisie pour ses performances." },
  { q: "Le site sera-t-il adapté au mobile ?", a: "Tous nos sites sont responsive : ils s'adaptent parfaitement aux smartphones, tablettes et ordinateurs de bureau." },
  { q: "Que comprend l'audit SEO gratuit ?", a: "L'audit inclut une analyse technique, une étude des mots clés, une analyse concurrentielle et des recommandations concrètes d'amélioration." },
  { q: "Puis-je modifier mon site moi-même ?", a: "Oui, nous créons des sites faciles à gérer. Nous vous formons à l'utilisation de votre site pour que vous puissiez le mettre à jour en autonomie." },
  { q: "Comment mesurez-vous les résultats SEO ?", a: "Nous utilisons Google Analytics, Search Console et des outils professionnels pour suivre le trafic, le positionnement et les conversions." },
  { q: "Faut-il un nom de domaine ?", a: "Oui, un nom de domaine est nécessaire. Nous pouvons vous accompagner dans le choix et l'achat de votre nom de domaine." },
  { q: "Qu'est-ce qu'un bon site web ?", a: "Un bon site web est rapide, responsive, bien référencé, avec un design professionnel et une navigation intuitive qui guide vers la conversion." },
  { q: "Proposez-vous la création de contenu ?", a: "Oui, nous pouvons rédiger des textes optimisés SEO pour votre site, vos pages de services et vos articles de blog." },
  { q: "Comment se passe la collaboration ?", a: "Nous commençons par un échange pour comprendre vos besoins. Puis nous proposons une maquette, développons le site et l'optimisons pour le SEO." },
  { q: "Pourquoi choisir Déclic Digital ?", a: "Nous sommes spécialisés dans l'accompagnement des PME. Notre fondateur est Expert Produit Google. Approche transparente, orientée résultats et adaptée aux petits budgets." },
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
              Retrouvez les réponses aux questions les plus posées sur la création de site web et le référencement SEO.
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

    {/* CTA */}
    <section className="gradient-miami py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground">Vous avez d'autres questions ?</h2>
        <p className="mb-8 text-primary-foreground/80">Contactez-nous, nous serons ravis de vous répondre.</p>
        <Button asChild size="lg" className="rounded-full bg-card px-8 font-semibold text-foreground shadow-lg hover:bg-card/90">
          <Link to="/contact">Nous contacter</Link>
        </Button>
      </div>
    </section>
  </PageLayout>
);

export default Faq;
