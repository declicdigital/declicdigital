import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, FileText, Users, Lightbulb, CheckCircle } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import heroAudit from "@/assets/audit-seo-gratuit-site-web.png";

const AuditSeo = () => (
  <PageLayout>
    <Helmet>
      <title>Audit SEO gratuit pour votre site — Déclic Digital</title>
      <meta name="description" content="Recevez un audit SEO complet et gratuit de votre site web. Déclic Digital analyse votre visibilité Google et vous propose un plan d'action concret. Sans engagement." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://declicdigital.net/audit-seo-gratuit" />
      <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Audit SEO gratuit",provider:{"@type":"LocalBusiness",name:"Déclic Digital",url:"https://declicdigital.net"},areaServed:"Île-de-France"})}</script>
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Audit SEO gratuit" }]} />
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              Audit SEO gratuit · Analyse complète de votre site
            </span>
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Audit SEO gratuit : analysez la visibilité Google de votre site en 48h
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Découvrez pourquoi votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link> n'apparaît pas sur Google et recevez des recommandations concrètes pour améliorer votre visibilité. Notre audit est complet et personnalisé. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link>.
            </p>
            <Button asChild size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
              <a href="#formulaire-audit">Demander mon audit SEO</a>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroAudit} alt="Audit SEO gratuit pour site web PME" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Contenu audit */}
    <SectionWrapper className="bg-section-blue">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold md:text-4xl">Qu'est-ce qu'un audit SEO et à quoi ça sert ?</h2>
      </div>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Notre audit SEO est une analyse approfondie de votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link>. Il couvre tous les aspects qui influencent votre positionnement sur Google et vous donne une feuille de route claire. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: "Analyse SEO technique", desc: "Performance, vitesse de chargement, compatibilité mobile, architecture du site, erreurs d'indexation et sécurité HTTPS." },
          { icon: FileText, title: "Analyse des mots clés", desc: "Étude de votre positionnement actuel et identification des mots clés à fort potentiel pour votre activité." },
          { icon: Users, title: "Analyse concurrentielle", desc: "Comparaison avec vos concurrents directs pour identifier les stratégies qui fonctionnent dans votre secteur." },
          { icon: Lightbulb, title: "Recommandations concrètes", desc: "Plan d'action priorisé avec des actions précises à mettre en place pour améliorer votre visibilité rapidement." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
              <item.icon size={26} />
            </div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>

    {/* Comment fonctionne un audit SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Ce que comprend votre audit SEO gratuit</h2>
        <p className="text-muted-foreground leading-relaxed">
          Un audit SEO est une analyse complète de votre site web qui évalue sa capacité à être bien référencé sur Google. Il identifie les points forts, les faiblesses et les opportunités d'amélioration de votre présence en ligne.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Concrètement, nous analysons la structure technique de votre site (vitesse, mobile, sécurité), la qualité de votre contenu (mots clés, balises, textes), et votre positionnement par rapport à vos concurrents. À l'issue de l'audit, vous recevez un rapport détaillé avec des recommandations classées par priorité.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          L'audit est la première étape indispensable pour toute stratégie de <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link> efficace. Sans diagnostic précis, il est impossible de savoir quelles actions vont réellement améliorer votre visibilité. C'est pourquoi nous proposons cet audit gratuitement : nous voulons que chaque PME puisse comprendre sa situation et prendre les bonnes décisions.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Après avoir reçu votre audit, vous pouvez choisir de mettre en oeuvre les recommandations vous-même ou de nous confier l'optimisation de votre site. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> pour découvrir nos offres. Dans tous les cas, l'audit vous appartient et vous n'avez aucune obligation.
        </p>
      </div>
    </SectionWrapper>

    {/* Pourquoi c'est gratuit */}
    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-6">En quoi votre site perd-il des clients chaque jour ?</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Nous croyons que chaque entreprise mérite de comprendre pourquoi son site ne génère pas de résultats. L'audit gratuit est notre façon de vous montrer <Link to="/qui-sommes-nous" className="text-primary font-semibold hover:underline">notre expertise</Link> et de vous aider à y voir plus clair, sans aucun engagement.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          C'est aussi un premier pas vers une relation de confiance. Si nos recommandations vous convainquent, vous pouvez choisir de nous confier la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création ou l'optimisation de votre site</Link>.
        </p>
      </div>
    </SectionWrapper>

    {/* Maillage */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Découvrez nos services</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/creation-site-web" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Création de site web
          </Link>
          <Link to="/referencement-seo" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Référencement SEO
          </Link>
          <Link to="/tarifs" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos tarifs
          </Link>
          <Link to="/realisations" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos réalisations
          </Link>
          <Link to="/faq" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Questions fréquentes
          </Link>
          <Link to="/nos-villes" className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
        </div>
      </div>
    </SectionWrapper>

    {/* Avis clients */}
    <GoogleReviewsSection compact maxReviews={3} />

    {/* Formulaire */}
    <SectionWrapper className="bg-section-blue" id="formulaire-audit">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-4 text-center text-3xl font-extrabold">Demandez votre audit gratuit</h2>
        <p className="text-center text-muted-foreground mb-8">
          Remplissez le formulaire ci-dessous et recevez votre audit SEO personnalisé sous 48 heures.
        </p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input placeholder="Votre nom" className="rounded-xl" required />
          <Input placeholder="Nom de votre entreprise" className="rounded-xl" required />
          <Input placeholder="URL de votre site web" type="url" className="rounded-xl" required />
          <Input placeholder="Votre email" type="email" className="rounded-xl" required />
          <Input placeholder="Votre téléphone (optionnel)" type="tel" className="rounded-xl" />
          <Textarea placeholder="Votre message (optionnel)" className="rounded-xl min-h-[100px]" />
          <Button type="submit" size="lg" className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
            <CheckCircle size={18} className="mr-2" /> Recevoir mon audit SEO gratuit
          </Button>
        </form>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default AuditSeo;
