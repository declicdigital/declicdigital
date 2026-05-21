import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { Monitor, Smartphone, TrendingUp, Zap, Building2, User, Wrench, ShoppingCart, CheckCircle, Search, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import { cities } from "@/data/cities";
import imgRefonte from "@/assets/refonte-site-web-avant-apres.webp";
import imgResponsive from "@/assets/site-web-responsive-mobile-artisan.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import imgDev from "@/assets/developpeur-web-code-site-artisan.webp";
import { supabase } from "@/integrations/supabase/client";

const CONTACT_EMAIL = "contact@declicdigital.net";
const BREVO_API_KEY = "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";

const sendBrevoEmail = async (to: { email: string; name: string }, subject: string, htmlContent: string) => {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Déclic Digital", email: CONTACT_EMAIL },
      to: [to],
      subject,
      htmlContent,
    }),
  });
};

const BEIGE = "#F6F1E9";
const BLEU  = "#E9F2F4";
const INK   = "#2B1E3F";
const LINK  = "#4361EE";

const faqItems = [
  {
    q: "Combien coute la création d'un site web pour une TPE ou un artisan ?",
    a: "Chez Déclic Digital, une landing page démarre à 200 euros de mise en service + 50 euros par mois. Un site vitrine complet est disponible à partir de 590 euros + 50 euros par mois. Ces forfaits incluent le design, le développement, l'hébergement, la maintenance et l'optimisation SEO de base. Pour une estimation précise selon votre projet, consultez notre page tarifs ou demandez un devis gratuit.",
  },
  {
    q: "Quel est le délai de livraison d'un site web ?",
    a: "Pour un site vitrine standard, comptez 2 à 3 semaines entre le premier échange et la mise en ligne. Ce délai peut varier selon la complexité du projet, le nombre de pages et la rapidité de vos retours. Nous travaillons en mode itératif : vous validez chaque étape avant que nous passions à la suivante.",
  },
  {
    q: "Quelle est la différence entre un site vitrine et un site e-commerce ?",
    a: "Un site vitrine présente votre activité, vos services et vos coordonnées. Son objectif est de générer des prises de contact : appels, emails, formulaires. Un site e-commerce permet la vente en ligne avec panier, paiement sécurisé et gestion des stocks. Pour la plupart des artisans et indépendants, un site vitrine bien référencé est largement suffisant pour développer leur clientèle.",
  },
  {
    q: "Vous créez des sites pour quels métiers d'artisans ?",
    a: "Nous créons des sites web pour tous types d'artisans et de professionnels indépendants : plombiers, électriciens, peintres en bâtiment, maçons, couvreurs, menuisiers, carreleurs, jardiniers-paysagistes, fleuristes, coiffeurs, ostéopathes, coaches sportifs, décorateurs d'intérieur, climaticiens et bien d'autres. Chaque site est adapté au métier, à la zone géographique et aux mots clés recherchés par vos clients potentiels.",
  },
  {
    q: "Est-ce que vous vous occupez du référencement SEO du site ?",
    a: "Oui, le SEO de base est intégré dans tous nos projets : structure des pages, balises title et meta description, optimisation des images, vitesse de chargement et compatibilité mobile. Pour un référencement plus poussé avec une stratégie de contenu et un suivi mensuel, nous proposons des accompagnements SEO dédiés.",
  },
  {
    q: "Vous intervenez dans quelles villes ?",
    a: "Nous créons des sites web pour des professionnels basés à Paris et dans les Hauts-de-Seine (92) : Asnières-sur-Seine, Boulogne-Billancourt, Neuilly-sur-Seine, Levallois-Perret, Clichy, Nanterre, Courbevoie, Issy-les-Moulineaux, Suresnes et toutes les communes du 92. Nous travaillons aussi à distance pour toute la France.",
  },
  {
    q: "Proposez-vous aussi le référencement SEO pour les TPE à Paris ?",
    a: "Oui. En plus de la création de site web, Déclic Digital propose des prestations de référencement naturel (SEO) et de visibilité IA (GEO) pour les TPE et indépendants à Paris et dans les Hauts-de-Seine. Nos clients bénéficient d'un accompagnement complet : site web optimisé + stratégie SEO locale pour dominer Google dans leur zone de chalandise.",
  },
];

const CreationSite = () => {
  const [form, setForm] = useState({
    full_name: "", company: "", email: "", phone: "", current_url: "", msg: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.msg) return;
    setSending(true);
    setError("");
    try {
      await supabase.from("contact_submissions").insert({
        full_name: form.full_name, company: form.company, email: form.email,
        phone: form.phone, current_url: form.current_url, message: form.msg, status: "new",
      });
      await sendBrevoEmail(
        { email: form.email, name: form.full_name },
        "Votre message a bien été reçu - Déclic Digital",
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#3d1a6e,#4fc3c3);padding:24px;border-radius:12px;margin-bottom:24px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Message reçu !</h1>
          </div>
          <p style="color:#333;font-size:16px;">Bonjour <strong>${form.full_name}</strong>,</p>
          <p style="color:#555;line-height:1.6;">Merci pour votre message. Nous l'avons bien reçu et vous répondrons sous 24 à 48h ouvrées.</p>
          <p style="color:#999;font-size:13px;text-align:center;margin-top:32px;">Déclic Digital - declicdigital.net</p>
        </div>`
      );
      await sendBrevoEmail(
        { email: CONTACT_EMAIL, name: "Geoffrey" },
        `Nouveau contact - ${form.full_name}${form.company ? ` (${form.company})` : ""}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
          <div style="background:linear-gradient(135deg,#3d1a6e,#4fc3c3);padding:20px 24px;border-radius:12px;margin-bottom:20px;">
            <h1 style="color:white;margin:0;font-size:20px;">Nouveau contact - CreationSite</h1>
          </div>
          <div style="background:white;border-radius:12px;padding:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;width:120px;">Nom</td><td style="font-weight:bold;font-size:13px;">${form.full_name}</td></tr>
              <tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Email</td><td><a href="mailto:${form.email}" style="color:#4fc3c3;">${form.email}</a></td></tr>
              ${form.phone ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Téléphone</td><td>${form.phone}</td></tr>` : ""}
              ${form.company ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Entreprise</td><td>${form.company}</td></tr>` : ""}
            </table>
            <div style="margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:3px solid #4fc3c3;">
              <p style="margin:0;color:#333;white-space:pre-wrap;font-size:13px;">${form.msg}</p>
            </div>
          </div>
        </div>`
      );
      setSent(true);
      setForm({ full_name: "", company: "", email: "", phone: "", current_url: "", msg: "" });
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessayez ou contactez-nous directement.");
    } finally {
      setSending(false);
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site web",
    description: "Création de sites vitrines, e-commerce et landing pages pour TPE, artisans et indépendants à Paris et dans les Hauts-de-Seine (92). Agence web Paris et 92.",
    provider: {
      "@type": "LocalBusiness",
      name: "Déclic Digital",
      url: "https://declicdigital.net",
      telephone: "+33602228939",
      email: "contact@declicdigital.net",
      address: {
        "@type": "PostalAddress",
        streetAddress: "57 rue d'Alleray",
        addressLocality: "Paris",
        postalCode: "75015",
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
      priceRange: "€€",
    },
    areaServed: [
      { "@type": "City", name: "Paris" },
      { "@type": "AdministrativeArea", name: "Hauts-de-Seine (92)" },
      { "@type": "City", name: "Asnières-sur-Seine" },
      { "@type": "City", name: "Boulogne-Billancourt" },
      { "@type": "City", name: "Neuilly-sur-Seine" },
      { "@type": "City", name: "Levallois-Perret" },
      { "@type": "City", name: "Nanterre" },
      { "@type": "City", name: "Clichy" },
      { "@type": "City", name: "Suresnes" },
      { "@type": "City", name: "Courbevoie" },
    ],
    serviceType: ["Site vitrine", "Site e-commerce", "Landing page", "Refonte de site web", "Site internet artisan", "Création site internet professionnel"],
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "200",
      highPrice: "5000",
      priceCurrency: "EUR",
      offerCount: "3",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://declicdigital.net" },
      { "@type": "ListItem", position: 2, name: "Création de site web", item: "https://declicdigital.net/creation-site-web" },
    ],
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Création site web Paris et 92 : artisans, TPE et indépendants</title>
        <meta name="description" content="Agence web Paris et Hauts-de-Seine (92) : création site internet professionnel pour artisans, TPE et indépendants. Site vitrine responsive, SEO inclus, livré en 2 semaines. Devis gratuit 24h." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/creation-site-web" />
        <meta property="og:title" content="Création site web Paris et 92 : artisans, TPE et indépendants" />
        <meta property="og:description" content="Agence web Paris et Hauts-de-Seine (92) : création site internet professionnel pour artisans, TPE et indépendants. Site vitrine responsive, SEO inclus, livré en 2 semaines. Devis gratuit 24h." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web" }]} />

      {/* Hero */}
      <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
              <img
                src={imgRefonte}
                alt="Refonte site web avant après - agence web Paris et 92 Déclic Digital"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="sync"
                width={640}
                height={600}
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${BEIGE} 0%, rgba(246,241,233,0.5) 25%, transparent 60%)` }} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="mb-6" style={{ color: INK }}>
                Création de site web à Paris et dans le 92 : artisans, TPE et indépendants
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: INK }}>
                Agence web Paris et Hauts-de-Seine, nous concevons des{" "}
                <Link to="/creation-site-web/metier/plombier" className="font-semibold hover:underline" style={{ color: LINK }}>sites internet professionnels</Link>{" "}
                pour les TPE, artisans et indépendants. Du{" "}
                <Link to="/creation-site-web/metier/decorateur-interieur" className="font-semibold hover:underline" style={{ color: LINK }}>décorateur d'intérieur</Link>{" "}
                au{" "}
                <Link to="/creation-site-web/metier/climaticien" className="font-semibold hover:underline" style={{ color: LINK }}>climaticien</Link>,
                chaque projet est conçu pour générer des prospects. Découvrez{" "}
                <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>nos tarifs</Link>{" "}
                ou demandez un{" "}
                <Link to="/contact" className="font-semibold hover:underline" style={{ color: LINK }}>devis gratuit</Link>.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Pourquoi votre activité a besoin d'un site internet professionnel</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Un site internet professionnel ne se limite pas à une simple vitrine en ligne. C'est un outil stratégique qui renforce votre crédibilité, attire de nouveaux clients grâce au{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement naturel</Link>{" "}
            et vous différencie de vos concurrents à{" "}
            <Link to="/agence-web-asnieres-sur-seine" className="font-semibold hover:underline" style={{ color: LINK }}>Asnières-sur-Seine</Link>,{" "}
            <Link to="/creation-site-web/boulogne-billancourt" className="font-semibold hover:underline" style={{ color: LINK }}>Boulogne-Billancourt</Link>{" "}
            et dans tout le 92.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, title: "Design professionnel", desc: "Une identité visuelle soignée qui inspire confiance dès la première seconde. Vos visiteurs jugent votre entreprise en moins de 3 secondes." },
              { icon: Smartphone, title: "Site responsive", desc: "Plus de 60% du trafic web vient du mobile. Votre site s'adapte parfaitement à tous les écrans : smartphone, tablette et desktop." },
              { icon: TrendingUp, title: "Optimisation SEO", desc: "Le référencement naturel est intégré dès la conception. Structure des pages, balises, vitesse : tout est pensé pour Google." },
              { icon: Zap, title: "Vitesse optimale", desc: "Un site rapide convertit mieux. Nous optimisons chaque élément pour un temps de chargement minimal et une expérience fluide." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 text-center" style={{ backgroundColor: BEIGE, boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: INK }}>
                  <item.icon size={26} />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: INK }}>{item.title}</h3>
                <p className="text-sm" style={{ color: INK, opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Création site internet professionnel : notre méthode en 4 étapes</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Nous avons développé un processus clair et structuré pour vous accompagner du premier échange à la mise en ligne de votre site. Livraison en 2 à 3 semaines pour un site vitrine standard.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "1. Échange et analyse", desc: "Nous commençons par comprendre votre activité, vos objectifs et votre cible. Cette étape est essentielle pour créer un site adapté à votre métier et votre zone géographique." },
              { icon: Monitor, title: "2. Conception et design", desc: "Nous définissons l'arborescence, le design et la structure de votre site. Vous validez chaque étape avant le développement." },
              { icon: Zap, title: "3. Développement", desc: "Votre site est développé avec les meilleures technologies. Chaque page est optimisée pour le SEO local, la vitesse et le mobile." },
              { icon: CheckCircle, title: "4. Mise en ligne et suivi", desc: "Après vos retours et validations, nous mettons votre site en ligne. Nous assurons ensuite un suivi pour garantir ses performances sur Google." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: BLEU, boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary" style={{ color: INK }}>
                  <item.icon size={22} />
                </div>
                <h3 className="mb-2 font-bold" style={{ color: INK }}>{item.title}</h3>
                <p className="text-sm" style={{ color: INK, opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Agence web Paris et Hauts-de-Seine : pour qui ?</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Nos solutions s'adaptent à tous les profils d'entreprises. Que vous soyez artisan, commerçant, profession libérale ou dirigeant de TPE à Paris ou dans le 92, nous concevons un site adapté à votre métier et optimisé pour le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement Google local</Link>.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "TPE", desc: "Développez votre présence en ligne et positionnez-vous comme un acteur de référence dans votre secteur à Paris et dans les Hauts-de-Seine." },
              { icon: User, title: "Indépendants", desc: "Présentez vos services de manière professionnelle et générez des prises de contact qualifiées. Idéal pour les consultants SEO freelance et professions libérales." },
              { icon: Wrench, title: "Artisans", desc: "Attirez des clients locaux grâce à un site optimisé pour le référencement local et Google Maps dans votre ville du 92." },
              { icon: ShoppingCart, title: "E-commerce", desc: "Vendez vos produits en ligne avec un site sécurisé, rapide et pensé pour la conversion. Boutique complète avec paiement sécurisé." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl p-5" style={{ backgroundColor: BEIGE, boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary" style={{ color: INK }}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: INK }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: INK, opacity: 0.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image développeur */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute left-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
              <img src={imgDev} alt="Développeur web code site artisan - agence web Hauts-de-Seine Déclic Digital"
                className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${BEIGE} 0%, rgba(246,241,233,0.4) 30%, transparent 65%)` }} />
            </div>
            <div className="relative z-10 ml-auto max-w-2xl space-y-6 py-8">
              <h2 style={{ color: INK }}>Site web rapide, mobile et optimisé SEO pour les TPE du 92</h2>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Un bon site internet professionnel pour une TPE, c'est avant tout un site qui remplit son objectif : attirer des visiteurs et les convertir en clients. Il ne suffit pas d'avoir un site "joli". Il doit être rapide, bien structuré, adapté aux mobiles et surtout visible sur Google dans votre ville des Hauts-de-Seine.
              </p>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Les{" "}
                <Link to="/blog/core-web-vitals-google-experience-utilisateur" className="font-semibold hover:underline" style={{ color: LINK }}>Core Web Vitals</Link>{" "}
                sont devenus un critère de classement Google à part entière. Chaque page doit être pensée pour répondre à une intention de recherche précise - c'est le rôle du{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement naturel</Link>,
                et c'est ce que nous intégrons dès la conception de chaque projet.
              </p>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Nos sites incluent systématiquement : un design professionnel sur mesure, une optimisation SEO complète, une compatibilité mobile parfaite, une vitesse de chargement optimisée, et un formulaire de contact pour capturer vos prospects. Consultez{" "}
                <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>nos tarifs</Link>{" "}
                pour en savoir plus.
              </p>
              <div className="relative overflow-hidden rounded-2xl group" style={{ boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <img src={imgResponsive} alt="Site web responsive mobile artisan Paris 92 - Déclic Digital"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" decoding="async" width={640} height={400} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(43,30,63,0.3), rgba(99,215,180,0.15))" }} />
                <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6">
                  <p className="font-semibold text-sm" style={{ color: "#F6F1E9" }}>+70% des recherches locales se font sur mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu SEO */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: INK }}>Agence web Hauts-de-Seine : création de site internet pour artisans et TPE du 92</h2>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              En tant qu'artisan ou indépendant à Paris ou dans les Hauts-de-Seine, votre visibilité en ligne détermine directement votre volume de clients. 97% des consommateurs recherchent un professionnel local sur internet avant de le contacter. Sans site web, vous êtes invisible pour cette audience. Avec un site bien conçu et optimisé pour le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement local</Link>,
              vous captez des demandes de devis chaque semaine. Notre page dédiée{" "}
              <Link to="/agence-web-asnieres-sur-seine" className="font-semibold hover:underline" style={{ color: LINK }}>agence web Asnières-sur-Seine</Link>{" "}
              vous donne un exemple concret de notre approche locale.
            </p>

            <h3 style={{ color: INK }}>Un site vitrine qui inspire confiance et génère des contacts</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Votre site web est votre vitrine 24h/24. Il doit présenter clairement vos services, afficher vos réalisations, et faciliter la prise de contact. Nous concevons chaque site avec un objectif commercial précis : transformer les visiteurs en prospects qualifiés. La{" "}
              <Link to="/blog/presence-en-ligne-artisan-leviers-clients" className="font-semibold hover:underline" style={{ color: LINK }}>présence en ligne des artisans</Link>{" "}
              est devenue un levier d'acquisition incontournable, et{" "}
              <Link to="/blog/comment-generer-clients-site-web-independant" className="font-semibold hover:underline" style={{ color: LINK }}>générer des clients via son site web</Link>{" "}
              est accessible à toutes les TPE avec la bonne approche.
            </p>

            <h3 style={{ color: INK }}>Création site internet pour tous les métiers : décorateur, climaticien, paysagiste et plus</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Nous créons des sites pour tous les corps de métier :{" "}
              <Link to="/creation-site-web/metier/plombier" className="font-semibold hover:underline" style={{ color: LINK }}>plombiers</Link>,{" "}
              <Link to="/creation-site-web/metier/electricien" className="font-semibold hover:underline" style={{ color: LINK }}>électriciens</Link>,{" "}
              <Link to="/creation-site-web/metier/peintre-en-batiment" className="font-semibold hover:underline" style={{ color: LINK }}>peintres en bâtiment</Link>,{" "}
              <Link to="/creation-site-web/metier/maconnerie" className="font-semibold hover:underline" style={{ color: LINK }}>maçons</Link>,{" "}
              <Link to="/creation-site-web/metier/couvreur" className="font-semibold hover:underline" style={{ color: LINK }}>couvreurs</Link>,{" "}
              <Link to="/creation-site-web/metier/jardinier-paysagiste" className="font-semibold hover:underline" style={{ color: LINK }}>jardiniers-paysagistes</Link>,{" "}
              <Link to="/creation-site-web/metier/climaticien" className="font-semibold hover:underline" style={{ color: LINK }}>climaticiens</Link>,{" "}
              <Link to="/creation-site-web/metier/decorateur-interieur" className="font-semibold hover:underline" style={{ color: LINK }}>décorateurs d'intérieur</Link>,{" "}
              <Link to="/creation-site-web/metier/fleuriste" className="font-semibold hover:underline" style={{ color: LINK }}>fleuristes</Link>,{" "}
              <Link to="/creation-site-web/metier/coach-sportif" className="font-semibold hover:underline" style={{ color: LINK }}>coachs sportifs</Link>{" "}
              et bien d'autres. Chaque site est pensé pour les mots clés de votre activité et de votre zone géographique. Retrouvez{" "}
              <Link to="/nos-metiers" className="font-semibold hover:underline" style={{ color: LINK }}>tous nos métiers</Link>.
            </p>

            <h3 style={{ color: INK }}>SEO pour TPE Paris et 92 : référencement Google inclus</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>SEO pour TPE à Paris</Link>{" "}
              et dans le 92 est au coeur de chaque projet. Nous optimisons votre site pour les requêtes locales. Notre approche combine{" "}
              <Link to="/blog/referencement-naturel-independant-2026" className="font-semibold hover:underline" style={{ color: LINK }}>référencement naturel</Link>{" "}
              et{" "}
              <Link to="/visibilite-ia" className="font-semibold hover:underline" style={{ color: LINK }}>visibilité IA (GEO)</Link>{" "}
              pour vous positionner durablement sur Google et les moteurs IA.
            </p>

            <h3 style={{ color: INK }}>Combien coute la création d'un site internet professionnel ?</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Chez Déclic Digital, nous proposons des{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>tarifs adaptés aux budgets des TPE</Link> :
              une landing page dès 200 euros de mise en service + 50 euros par mois, un site vitrine complet dès 590 euros + 50 euros par mois. Ces forfaits incluent le design, le développement, l'hébergement, la maintenance et l'optimisation SEO de base. Le{" "}
              <Link to="/blog/combien-coute-creation-site-web-tpe-2026" className="font-semibold hover:underline" style={{ color: LINK }}>cout de création d'un site web</Link>{" "}
              varie selon les prestataires - nos tarifs sont conçus pour être accessibles sans compromis sur la qualité.
            </p>
          </div>
        </div>
      </section>

      {/* Métiers artisans encart */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <h2 className="mb-4" style={{ color: INK }}>Votre métier mérite un site taillé sur mesure</h2>
              <p className="leading-relaxed mb-6" style={{ color: INK, opacity: 0.7 }}>
                Un <Link to="/creation-site-web/metier/plombier" className="font-semibold" style={{ color: LINK }}>site pour plombier</Link> ne ressemble pas à un{" "}
                <Link to="/creation-site-web/metier/coach-sportif" className="font-semibold" style={{ color: LINK }}>site pour coach sportif</Link>,
                ni à un{" "}
                <Link to="/creation-site-web/metier/decorateur-interieur" className="font-semibold" style={{ color: LINK }}>site pour décorateur d'intérieur</Link>.
                Les mots clés, la structure, les pages de service, les photos et les appels à l'action sont différents selon votre activité. Nous créons des sites adaptés à chaque métier, optimisés pour les recherches locales de vos clients dans le 92 et à Paris. Un{" "}
                <Link to="/blog/site-web-artisan-paris-pourquoi-il-ne-rapporte-pas" className="font-semibold" style={{ color: LINK }}>site artisan qui ne rapporte pas</Link>{" "}
                est souvent un site générique qui ne parle pas à sa cible.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { slug: "plombier", label: "Plombier" },
                  { slug: "electricien", label: "Électricien" },
                  { slug: "peintre-en-batiment", label: "Peintre" },
                  { slug: "maconnerie", label: "Maçon" },
                  { slug: "couvreur", label: "Couvreur" },
                  { slug: "jardinier-paysagiste", label: "Paysagiste" },
                  { slug: "climaticien", label: "Climaticien" },
                  { slug: "decorateur-interieur", label: "Décorateur d'intérieur" },
                  { slug: "fleuriste", label: "Fleuriste" },
                  { slug: "coach-sportif", label: "Coach sportif" },
                  { slug: "osteopathe", label: "Ostéopathe" },
                  { slug: "coiffeur", label: "Coiffeur" },
                  { slug: "photographe", label: "Photographe" },
                  { slug: "restaurateur", label: "Restaurateur" },
                ].map((m) => (
                  <Link
                    key={m.slug}
                    to={`/creation-site-web/metier/${m.slug}`}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10"
                    style={{ backgroundColor: BLEU, color: INK, borderColor: "rgba(43,30,63,0.2)" }}
                  >
                    {m.label}
                  </Link>
                ))}
                <Link
                  to="/nos-metiers"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold gradient-primary btn-glow"
                  style={{ color: INK }}
                >
                  Tous les métiers →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Villes */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <h2 className="text-center mb-6" style={{ color: INK }}>Création de site internet à Paris et dans les Hauts-de-Seine (92)</h2>
          <p className="text-center mb-8" style={{ color: INK, opacity: 0.7 }}>
            Agence web{" "}
            <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: LINK }}>Paris et Hauts-de-Seine</Link>,
            nous intervenons dans toutes les communes du 92. De{" "}
            <Link to="/agence-web-asnieres-sur-seine" className="font-semibold hover:underline" style={{ color: LINK }}>Asnières-sur-Seine</Link>{" "}
            à{" "}
            <Link to="/creation-site-web/boulogne-billancourt" className="font-semibold hover:underline" style={{ color: LINK }}>Boulogne-Billancourt</Link>,
            de{" "}
            <Link to="/creation-site-web/clichy" className="font-semibold hover:underline" style={{ color: LINK }}>Clichy</Link>{" "}
            à{" "}
            <Link to="/creation-site-web/levallois-perret" className="font-semibold hover:underline" style={{ color: LINK }}>Levallois-Perret</Link>,
            nous connaissons le tissu économique local du 92.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/agence-web-asnieres-sur-seine", label: "Site web Asnières-sur-Seine" },
              { to: "/creation-site-web/boulogne-billancourt", label: "Site web Boulogne-Billancourt" },
              { to: "/creation-site-web/neuilly-sur-seine", label: "Site web Neuilly-sur-Seine" },
              { to: "/creation-site-web/levallois-perret", label: "Site web Levallois-Perret" },
              { to: "/creation-site-web/clichy", label: "Site web Clichy" },
              { to: "/creation-site-web/nanterre", label: "Site web Nanterre" },
              { to: "/creation-site-web/issy-les-moulineaux", label: "Site web Issy-les-Moulineaux" },
              { to: "/creation-site-web/courbevoie", label: "Site web Courbevoie" },
              { to: "/creation-site-web/suresnes", label: "Site web Suresnes" },
              { to: "/creation-site-web/la-garenne-colombes", label: "Site web La Garenne-Colombes" },
              { to: "/creation-site-web/rueil-malmaison", label: "Site web Rueil-Malmaison" },
              { to: "/creation-site-web/montrouge", label: "Site web Montrouge" },
            ].map((c) => (
              <Link key={c.to} to={c.to}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: BEIGE, color: INK, borderColor: "rgba(43,30,63,0.25)" }}>
                {c.label}
              </Link>
            ))}
            <Link to="/nos-villes" className="rounded-full px-4 py-2 text-sm font-semibold btn-glow gradient-primary" style={{ color: INK }}>
              Voir toutes les villes →
            </Link>
          </div>
        </div>
      </section>

      {/* GoogleReviews */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor={BEIGE} />

      {/* FAQ */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: INK, opacity: 0.5 }}>Questions fréquentes</p>
            <h2 className="text-center" style={{ color: INK }}>Tout ce que vous voulez savoir sur la création de site web</h2>
            <div className="space-y-0">
              {faqItems.map((f, i) => (
                <div key={i} className="border-b first:border-t" style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <h3 className="font-bold" style={{ color: INK }}>{f.q}</h3>
                    <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: INK, opacity: 0.5 }} />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 leading-relaxed" style={{ color: INK, opacity: 0.7 }}>{f.a}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center">
              <Link to="/faq" className="font-semibold hover:underline" style={{ color: LINK }}>Voir toutes les questions fréquentes</Link>
            </p>
          </div>
        </div>
      </section>

      {/* LocationSection */}
      <LocationSection backgroundColor={BEIGE} />

      {/* Formulaire */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h2 style={{ color: INK }}>Demandez votre devis création site internet professionnel</h2>
              <p className="mt-4 text-lg" style={{ color: INK, opacity: 0.7 }}>
                Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: LINK }}>création de votre site web</Link>{" "}
                à Paris ou dans les Hauts-de-Seine. Réponse sous 24h.
              </p>
            </div>
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ color: INK }}>Message envoyé !</h3>
                <p style={{ color: INK, opacity: 0.6 }}>Nous vous répondrons dans les 24 heures ouvrées.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="full_name" placeholder="Votre nom" className="rounded-xl" required value={form.full_name} onChange={handleChange} />
                  <Input name="company" placeholder="Nom de votre entreprise" className="rounded-xl" value={form.company} onChange={handleChange} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="email" placeholder="Votre email" type="email" className="rounded-xl" required value={form.email} onChange={handleChange} />
                  <Input name="phone" placeholder="Votre téléphone" type="tel" className="rounded-xl" value={form.phone} onChange={handleChange} />
                </div>
                <Input name="current_url" placeholder="URL de votre site web (si existant)" type="url" className="rounded-xl" value={form.current_url} onChange={handleChange} />
                <Textarea name="msg" placeholder="Décrivez votre projet..." className="rounded-xl min-h-[120px]" required value={form.msg} onChange={handleChange} />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="button" variant="custom" size="lg" disabled={sending} onClick={handleSubmit}
                  className="w-full gradient-miami btn-glow rounded-full font-bold shadow-glow">
                  {sending ? <Loader2 size={18} className="mr-2 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
                  {sending ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA texture */}
      <section className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital - agence web Paris et 92"
            className="w-32 h-32 rounded-full object-cover border-2 shadow-lg mb-4"
            style={{ borderColor: "rgba(43,30,63,0.3)" }} loading="lazy" width={128} height={128} />
          <p className="text-sm font-semibold mb-2" style={{ color: INK }}>Geoffrey, Expert Produit Google</p>
          <h2 className="mb-4" style={{ color: INK }}>Prêt à lancer votre site web à Paris ou dans le 92 ?</h2>
          <p className="mb-8 max-w-xl" style={{ color: INK, opacity: 0.7 }}>
            Demandez un devis gratuit pour la création de votre site internet professionnel. Réponse sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
              <Link to="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow" style={{ color: "#F6F1E9" }}>
              <Link to="/faq">Questions fréquentes</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CreationSite;
