import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { ChevronDown, CheckCircle2, TrendingDown, MessageSquare, Zap, Target, Building2, Hammer, Laptop } from "lucide-react";
import heroGeo from "@/assets/geo-hero-woman.webp";
import imgNuit from "@/assets/bureau-paris-fenetre-tour-eiffel-nuit.webp";
import imgPerf from "@/assets/performance-vitesse-site-web-core-web-vitals.webp";
import imgConsultation from "@/assets/consultation-strategie-digitale-paris-cafe.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";

const stats = [
  { num: "58%", label: "des recherches se terminent sans clic sur Google" },
  { num: "400M+", label: "utilisateurs hebdomadaires de ChatGPT en 2026" },
  { num: "3x", label: "plus de clics quand une IA cite votre site" },
  { num: "2025", label: "l'année où le GEO est devenu incontournable" },
];

const urgencyCards = [
  { icon: TrendingDown, title: "Le trafic organique chute", desc: "Depuis l'introduction des AI Overviews de Google, de nombreux sites observent une baisse de 15 à 40% de leur trafic organique. Les réponses directes éliminent le besoin de cliquer." },
  { icon: MessageSquare, title: "Les IA répondent à la place de Google", desc: "Pour des questions factuelles, des recommandations locales ou des comparatifs, une part croissante des utilisateurs va directement vers ChatGPT ou Perplexity plutôt que Google." },
  { icon: Zap, title: "La fenêtre d'opportunité est ouverte", desc: "La plupart des entreprises n'ont pas encore de stratégie GEO. Se positionner maintenant, c'est avoir une longueur d'avance décisive sur les concurrents de votre secteur." },
  { icon: Target, title: "Un trafic plus qualifié", desc: "Quand une IA vous recommande, l'utilisateur arrive avec une intention forte. Les visites issues de citations IA convertissent significativement mieux que le trafic organique classique." },
];

const audiences = [
  { icon: Building2, title: "TPE & Petites entreprises", desc: "Les IA favorisent les contenus spécialisés et précis — terrain de jeu idéal pour les petites structures expertes.", items: ["Être cité pour votre spécialité de niche", "Concurrencer des marques plus grandes", "Réduire les coûts d'acquisition client", "Générer des leads qualifiés en continu", "Renforcer votre autorité sectorielle"] },
  { icon: Hammer, title: "Artisans & Commerçants", desc: "La recherche locale est l'un des cas d'usage phares des IA génératives. \"Quel électricien à Bordeaux ?\" — soyez la réponse.", items: ["Dominer les recommandations locales IA", "Être cité comme référence de votre métier", "Valoriser votre savoir-faire unique", "Attirer des clients de meilleure qualité", "Réduire la dépendance aux plateformes"] },
  { icon: Laptop, title: "Indépendants & Freelances", desc: "Un freelance bien positionné en GEO peut multiplier ses opportunités sans multiplier son budget marketing.", items: ["Être recommandé pour votre expertise", "Construire une autorité digitale forte", "Attirer des missions sans prospection", "Valoriser votre personal branding", "Générer une notoriété passive"] },
];

const steps = [
  { title: "Créer du contenu structuré en questions-réponses", desc: "Les IA génératives adorent les contenus qui répondent directement à une question précise. Rédigez des pages, articles et FAQ qui suivent le format \"Question puis Réponse claire et complète\". Anticipez les questions que vos clients posent réellement." },
  { title: "Implémenter les données structurées (Schema.org)", desc: "Les balises Schema.org sont le langage que les IA comprennent pour catégoriser votre activité. Ajoutez les schémas LocalBusiness, FAQPage, Article, Review et HowTo selon votre secteur." },
  { title: "Construire votre autorité thématique", desc: "Les IA citent les sources qui font référence dans leur domaine. Produisez régulièrement du contenu expert sur votre métier. Montrez votre expérience concrète avec des études de cas, des résultats réels, des témoignages clients vérifiables." },
  { title: "Multiplier les mentions et citations sur le web", desc: "Les IA apprennent à faire confiance aux sources citées sur d'autres sites de qualité. Visez des mentions dans des annuaires professionnels reconnus, des articles de presse locale, des associations sectorielles, des partenaires." },
  { title: "Optimiser votre présence locale et votre fiche Google Business", desc: "Pour les artisans et TPE locales, une fiche Google Business Profile complète, régulièrement mise à jour et remplie d'avis clients authentiques est un signal fort pour les IA." },
  { title: "Rédiger avec un langage naturel et conversationnel", desc: "Les IA ont été entraînées sur du langage naturel. Rédigez comme vous parlez à vos clients, pas comme vous écririez pour un algorithme. Utilisez des phrases complètes, des explications progressives, du contexte." },
  { title: "Surveiller et mesurer votre visibilité dans les IA", desc: "Testez régulièrement votre présence en posant des questions à ChatGPT, Perplexity et Gemini sur votre secteur et votre zone géographique. Notez si et comment vous êtes cités. Adaptez votre stratégie en conséquence." },
];

const actionTable = [
  { action: "FAQ structurée sur votre site", impact: "Très élevé", difficulty: "Facile", delay: "2 à 4 semaines" },
  { action: "Fiche Google Business complète", impact: "Élevé (local)", difficulty: "Facile", delay: "1 à 3 semaines" },
  { action: "Articles de blog expert (1 000+ mots)", impact: "Très élevé", difficulty: "Moyen", delay: "4 à 8 semaines" },
  { action: "Schema.org LocalBusiness + FAQPage", impact: "Élevé", difficulty: "Moyen", delay: "2 à 6 semaines" },
  { action: "Collecte d'avis clients authentiques", impact: "Élevé", difficulty: "Facile", delay: "3 à 6 semaines" },
  { action: "Citations dans annuaires sectoriels", impact: "Moyen-élevé", difficulty: "Facile", delay: "4 à 8 semaines" },
  { action: "Mentions presse locale / partenaires", impact: "Élevé", difficulty: "Avancé", delay: "6 à 12 semaines" },
  { action: "Page \"À propos\" détaillée et personnelle", impact: "Moyen", difficulty: "Facile", delay: "2 à 4 semaines" },
];

const checklist = [
  "Votre site répond à des questions précises — pas seulement à des mots-clés, mais à de vraies formulations naturelles de vos clients.",
  "Vous avez une page FAQ structurée avec le balisage Schema FAQPage pour que les IA puissent lire et citer vos réponses.",
  "Votre fiche Google Business est complète : horaires, description, catégories, photos, réponses aux avis, et publications régulières.",
  "Votre page \"À propos\" raconte votre expertise réelle avec des faits concrets, une expérience vérifiable et ce qui vous différencie.",
  "Vous avez des témoignages clients détaillés sur votre site et sur Google — les avis sont une source de confiance majeure pour les IA.",
  "Vous publiez régulièrement du contenu expert sur votre métier, votre zone d'intervention, vos projets réalisés.",
  "Votre nom, adresse et téléphone sont identiques sur tous les annuaires, réseaux sociaux et votre site (cohérence NAP).",
  "Vous êtes cité sur au moins 5 plateformes tierces : annuaires professionnels, associations, partenaires, presse locale.",
  "Vous avez testé votre visibilité IA en posant des questions sur votre secteur dans ChatGPT et Perplexity.",
  "Votre site se charge rapidement et est parfaitement lisible sur mobile.",
];

const faqItems = [
  { q: "Qu'est-ce que le GEO exactement ?", a: "Le GEO, ou Generative Engine Optimization, est l'ensemble des stratégies visant à optimiser la présence d'une entreprise ou d'un site web dans les réponses générées par les intelligences artificielles comme ChatGPT, Google Gemini, Perplexity AI ou Claude. Contrairement au SEO qui cible les classements dans les moteurs de recherche traditionnels, le GEO vise à être cité, mentionné ou recommandé directement dans les réponses conversationnelles des IA." },
  { q: "Quelle est la différence entre SEO et GEO ?", a: "Le SEO optimise un site pour apparaître dans une liste de résultats Google. Le GEO optimise le contenu pour être sélectionné et cité dans une réponse directe générée par une IA. Le SEO mesure le classement et le trafic ; le GEO mesure les mentions et citations. Les deux sont complémentaires et partagent de nombreuses bonnes pratiques, mais le GEO nécessite des ajustements spécifiques liés aux particularités des modèles de langage." },
  { q: "Le GEO est-il utile pour une petite entreprise ou un artisan ?", a: "Oui, et c'est même l'une des meilleures opportunités actuelles pour les petites structures. Les IA génératives valorisent l'expertise précise, l'authenticité et les réponses détaillées — des atouts naturels des artisans et indépendants. De plus, la recherche locale est un cas d'usage majeur pour les IA." },
  { q: "Combien de temps faut-il pour voir des résultats en GEO ?", a: "Les premiers effets peuvent être visibles en 4 à 8 semaines pour les actions les plus directes comme la FAQ structurée ou la mise à jour de votre fiche Google Business. La construction d'une autorité thématique et d'une présence solide sur plusieurs plateformes demande 3 à 6 mois." },
  { q: "Est-ce que le GEO remplace le SEO ?", a: "Non. Le GEO ne remplace pas le SEO, il le complète. Google reste le moteur de recherche dominant et continuer à optimiser votre site pour les moteurs traditionnels est toujours nécessaire. Une stratégie digitale complète en 2026 combine SEO, GEO et présence sur les réseaux sociaux." },
  { q: "Comment une IA choisit-elle de citer une entreprise ou un site ?", a: "Les IA génératives sélectionnent leurs sources selon plusieurs critères : la pertinence et la précision du contenu par rapport à la question posée, l'autorité de la source, la structure et la lisibilité du contenu, la présence de données structurées (Schema.org), et la fréquence des citations de cette source par d'autres sites fiables." },
  { q: "Quel budget prévoir pour une stratégie GEO ?", a: "Le GEO peut être démarré avec un budget minimal si vous avez du temps à y consacrer. Les actions de base sont gratuites en temps de travail. Pour déléguer à un prestataire, comptez entre 500 et 2 000 euros par mois selon l'ambition de la stratégie." },
];

const difficultyClass = (d: string) => {
  if (d === "Facile") return "bg-green-100 text-green-700";
  if (d === "Moyen") return "bg-amber-100 text-amber-700";
  return "bg-orange-100 text-orange-700";
};

const Geo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "GEO (Generative Engine Optimization) : Le guide complet pour TPE, artisans et indépendants", description: "Tout comprendre sur le GEO, la nouvelle discipline d'optimisation pour les moteurs génératifs basés sur l'IA.", author: { "@type": "LocalBusiness", name: "Déclic Digital", url: "https://declicdigital.net" }, datePublished: "2026-06-01", mainEntityOfPage: { "@type": "WebPage", "@id": "https://declicdigital.net/visibilite-ia/" } };

  return (
    <PageLayout>
      <Helmet>
        <title>Visibilité IA : apparaître dans ChatGPT et Google AI</title>
        <meta name="description" content="Optimisez votre présence dans les IA génératives. Déclic Digital vous aide à être cité par ChatGPT, Perplexity et Gemini. Audit gratuit." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/visibilite-ia/" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Visibilité IA" }]} />

      {/* ─── Hero : image nuit tour Eiffel en fond ────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 min-h-[500px] flex items-center">
        <img src={imgNuit} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.93) 0%, hsl(263,36%,18%,0.78) 55%, hsl(183,70%,40%,0.55) 100%)" }} />
        <div className="container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 border border-white/20">Visibilité IA · GEO</span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl text-white leading-tight">
                Le GEO : quand l'IA devient votre meilleur commercial
              </h1>
              <p className="mb-8 text-lg text-white/75 leading-relaxed">
                Generative Engine Optimization — la stratégie qui permet à votre entreprise d'être citée par ChatGPT, Gemini et Perplexity. Indispensable pour les TPE, artisans et indépendants.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                <Link to="/contact">Demander un audit SEO gratuit</Link>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group w-full max-w-lg">
                <img src={heroGeo} alt="Bureau avec analyses et graphiques pour optimisation GEO" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" width={512} height={341} loading="lazy" decoding="async" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(263,36%,18%,0.3), hsl(183,70%,63%,0.15))" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[hsl(263,36%,18%)] py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <span className="block text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-blue via-brand-violet to-brand-pink bg-clip-text text-transparent">{s.num}</span>
                <p className="mt-2 text-xs md:text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sommaire */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">📑 Sommaire</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {["Qu'est-ce que le GEO ?", "SEO vs GEO", "Pourquoi c'est urgent", "TPE, artisans, indépendants", "Comment appliquer le GEO", "Plan d'action", "Checklist", "FAQ"].map((item, i) => (
                <a key={i} href={`#section-${i + 1}`} className="text-primary hover:underline">{i + 1}. {item}</a>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 01 - Définition */}
      <SectionWrapper id="section-1">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">01 - Définition</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">Qu'est-ce que le GEO (Generative Engine Optimization) ?</h2>
          <div className="rounded-2xl border-l-4 border-primary bg-background p-6 shadow-card">
            <p className="text-lg leading-relaxed">Le <strong className="text-primary">GEO, ou Generative Engine Optimization</strong>, désigne l'ensemble des stratégies et techniques permettant d'optimiser la présence d'un site web ou d'une entreprise dans les réponses générées par les <strong className="text-primary">intelligences artificielles conversationnelles</strong> : ChatGPT, Google Gemini, Perplexity AI, Claude (Anthropic), Microsoft Copilot, et tous leurs successeurs.</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">En termes simples : là où le <strong>SEO</strong> vous fait apparaître dans les résultats de Google, le <strong>GEO</strong> vous fait citer, mentionner ou recommander par les IA quand un utilisateur pose une question dans leur interface. Le GEO est un complément naturel du <Link to="/referencement-seo" className="text-primary font-semibold">référencement SEO classique</Link>.</p>
          <p className="text-muted-foreground leading-relaxed">Imaginez qu'un client potentiel tape dans ChatGPT : <em>"Quel est le meilleur plombier chauffagiste à Lyon ?"</em> Le GEO est ce qui détermine si votre nom apparaît dans la réponse… ou si c'est celui de votre concurrent.</p>
          <div className="rounded-2xl border border-amber-300/30 bg-amber-50/50 p-5">
            <p className="font-bold text-amber-700 mb-2">⚡ Pourquoi ce terme est-il encore méconnu ?</p>
            <p className="text-muted-foreground">Le GEO est une discipline émergente formalisée par des chercheurs de Princeton en 2023. Il est encore peu maîtrisé, ce qui représente une <strong>opportunité majeure</strong> pour les entreprises qui s'y mettent dès maintenant.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* 02 - SEO vs GEO */}
      <SectionWrapper id="section-2">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">02 - Comparaison</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">SEO traditionnel vs GEO : quelles différences concrètes ?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-background p-6 shadow-card">
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">SEO classique</span>
              <h3 className="text-xl font-bold mb-4">Google Search</h3>
              <ul className="space-y-3 text-muted-foreground">
                {["Classement dans une liste de liens", "Optimisation pour des mots-clés", "Backlinks et autorité de domaine", "L'utilisateur choisit un lien à cliquer", "Position 1 à 10 dans les SERP", "Mesure : trafic organique, CTR"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-muted-foreground/50 shrink-0">→</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-card">
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white mb-4">GEO nouveau</span>
              <h3 className="text-xl font-bold mb-4">IA génératives</h3>
              <ul className="space-y-3 text-muted-foreground">
                {["Mention dans une réponse directe", "Optimisation pour des questions naturelles", "Autorité thématique et citations", "L'IA sélectionne et synthétise les sources", "Être cité ou non cité", "Mesure : mentions, trafic référent IA"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary shrink-0">→</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 03 - Urgence avec image performance */}
      <SectionWrapper id="section-3">
        <div className="mx-auto max-w-4xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">03 - Urgence</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi le GEO devient urgent en 2026 ?</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {urgencyCards.map((c, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card hover:shadow-elevated transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white"><c.icon size={22} /></div>
                <h3 className="mb-2 font-bold text-lg">{c.title}</h3>
                <p className="text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
          {/* Image performance avec citation en overlay */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            <img src={imgPerf} alt="Performance web Core Web Vitals" className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 flex items-center" style={{ background: "linear-gradient(to right, hsl(263,36%,18%,0.95) 0%, hsl(263,36%,18%,0.75) 55%, transparent 100%)" }}>
              <div className="p-8 max-w-lg">
                <span className="text-6xl font-extrabold text-primary/30 leading-none select-none">"</span>
                <p className="text-lg text-white/90 italic leading-relaxed -mt-4">Dans cinq ans, les entreprises qui auront investi dans le GEO aujourd'hui domineront leur secteur.</p>
                <p className="text-white/40 text-sm mt-2">Analyse tendance — Marketing digital, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 04 - Pour qui */}
      <SectionWrapper id="section-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">04 - Pour qui ?</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">GEO pour les TPE, artisans et indépendants : pourquoi c'est fait pour vous</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {audiences.map((a, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-card border-t-4 border-primary">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-miami text-white"><a.icon size={22} /></div>
                <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                <p className="text-muted-foreground mb-4">{a.desc}</p>
                <ul className="space-y-2">
                  {a.items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-muted-foreground"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Image portrait + texte avec overlap */}
      <SectionWrapper>
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            {/* Image en fond côté droit */}
            <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
              <img src={imgConsultation} alt="Consultation stratégie digitale Paris café" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background)/0.4) 35%, transparent 70%)" }} />
            </div>
            {/* Texte qui chevauche */}
            <div className="relative z-10 max-w-2xl space-y-5 py-8">
              <h2 className="text-3xl font-extrabold md:text-4xl">Pourquoi le GEO est un avantage concurrentiel pour les TPE</h2>
              <p className="text-muted-foreground leading-relaxed">Les grandes entreprises investissent des millions dans le SEO classique. Mais le GEO change la donne : les IA génératives ne cherchent pas la plus grosse marque, elles cherchent la <strong className="text-foreground">réponse la plus pertinente</strong>.</p>
              <p className="text-muted-foreground leading-relaxed">Un artisan qui documente ses techniques, un consultant qui partage son expertise, une TPE qui répond avec précision aux questions de ses clients — c'est exactement ce que ChatGPT, Gemini et Perplexity mettent en avant.</p>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA 1 avec texture */}
      <section className="relative overflow-hidden py-14">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">Vous voulez être cité par les IA ?</h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">Nos experts analysent votre visibilité dans ChatGPT, Gemini et Perplexity et vous donnent un plan d'action concret.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-semibold text-[hsl(263,36%,18%)] shadow-glow">
              <Link to="/contact">Audit SEO gratuit</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="rounded-full border-2 border-white/40 bg-transparent px-8 font-semibold text-[hsl(263,36%,18%)] hover:bg-white/10 transition-colors">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
          </div>
        </div>
      </section>

      <GoogleReviewsSection compact maxReviews={3} />

      {/* 05 - Méthode */}
      <SectionWrapper id="section-5">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">05 - Méthode</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Comment appliquer le GEO concrètement : les 7 piliers</h2>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 py-7 border-b border-border last:border-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold text-lg">{i + 1}</div>
                <div><h3 className="font-bold text-lg mb-2">{s.title}</h3><p className="text-muted-foreground leading-relaxed">{s.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 06 - Plan d'action */}
      <SectionWrapper id="section-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">06 - Plan d'action</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Tableau de bord : vos actions GEO par priorité</h2>
          <div className="overflow-x-auto rounded-2xl border bg-background shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(263,36%,18%)] text-[hsl(263,36%,18%)]">
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Action</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Impact GEO</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Difficulté</th>
                  <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Délai résultat</th>
                </tr>
              </thead>
              <tbody>
                {actionTable.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{row.action}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.impact}</td>
                    <td className="px-5 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${difficultyClass(row.difficulty)}`}>{row.difficulty}</span></td>
                    <td className="px-5 py-3 text-muted-foreground">{row.delay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* 07 - Checklist */}
      <SectionWrapper id="section-7">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">07 - Checklist</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">La checklist GEO pour démarrer dès aujourd'hui</h2>
          <ul className="space-y-0">
            {checklist.map((item, i) => (
              <li key={i} className="flex gap-4 py-4 border-b border-border last:border-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold mt-0.5">✓</div>
                <p className="text-muted-foreground leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      {/* CTA checklist avec texture */}
      <section className="relative overflow-hidden py-14">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">Besoin d'aide pour cocher toutes ces cases ?</h2>
          <p className="mb-6 text-muted-foreground max-w-xl mx-auto">On s'occupe de tout. De l'audit à la mise en place, notre équipe vous accompagne sur le SEO et le GEO.</p>
          <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-semibold text-[hsl(263,36%,18%)] shadow-glow">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
        </div>
      </section>

      {/* 08 - FAQ */}
      <SectionWrapper id="section-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">08 - Questions fréquentes</p>
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">FAQ : toutes vos questions sur le GEO</h2>
          <div className="space-y-0">
            {faqItems.map((f, i) => (
              <div key={i} className="border-b border-border first:border-t">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <h3 className="font-bold">{f.q}</h3>
                  <ChevronDown size={18} className={`shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA final avec texture */}
      <section className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-extrabold ">Passez à l'action sur votre visibilité IA</h2>
          <p className="mb-8 text-muted-foreground max-w-xl mx-auto">Votre entreprise mérite d'être citée par les intelligences artificielles. Nos experts vous accompagnent pour construire une stratégie GEO sur mesure.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-semibold text-[hsl(263,36%,18%)] shadow-glow">
              <Link to="/contact">Demander un audit SEO gratuit</Link>
            </Button>
            <Link to="/rendez-vous" className="inline-flex items-center justify-center rounded-full border-2 border-[hsl(263,36%,18%)] bg-transparent px-8 py-3 font-semibold text-[hsl(263,36%,18%)] hover:bg-[hsl(263,36%,18%)/0.1] transition-colors">
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>

      <LocationSection />
    </PageLayout>
  );
};

export default Geo;
