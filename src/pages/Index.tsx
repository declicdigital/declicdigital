import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, BarChart3, Eye, Users, TrendingUp, ChevronRight, Monitor, Gauge, CheckCircle, Shield, Clock, Target, MessageSquare, Phone as PhoneIcon, FileText, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";
import imgBureau from "@/assets/agence-web-paris-bureau-laptop.webp";
import imgProbleme from "@/assets/independant-zero-contact-formulaire.webp";
import imgProcessus from "@/assets/consultante-agence-digitale-paris-bureau.webp";
import imgParis from "@/assets/paris-vue-aerienne-hauts-de-seine.webp";
import imgTexture from "@/assets/texture-fond-section-violet-turquoise.webp";
import logoWordpress from "@/assets/logos/wordpress.webp";
import logoShopify from "@/assets/logos/shopify.webp";
import logoLovable from "@/assets/logos/lovable.webp";
import logoClaude from "@/assets/logos/claude.svg";
import logoSemrush from "@/assets/logos/semrush.webp";
import logoSearchConsole from "@/assets/logos/search-console.webp";
import logoGemini from "@/assets/logos/gemini.png";
import logoLinkedin from "@/assets/logos/linkedin.png";
import { supabase } from "@/integrations/supabase/client";

const GoogleReviewsSection = lazy(() => import("@/components/GoogleReviewsSection"));
const LocationSection = lazy(() => import("@/components/LocationSection"));

const techLogos = [
  { name: "WordPress", src: logoWordpress },
  { name: "Shopify", src: logoShopify },
  { name: "Lovable", src: logoLovable },
  { name: "Claude AI", src: logoClaude },
  { name: "Semrush", src: logoSemrush },
  { name: "Gemini", src: logoGemini },
  { name: "LinkedIn", src: logoLinkedin },
  { name: "Search Console", src: logoSearchConsole },
];

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

const INK = "#2B1E3F";
const CREAM = "#F6F1E9";

const Index = () => {
  const [form, setForm] = useState({
    full_name: "", company: "", email: "", phone: "", current_url: "", msg: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.msg) return;
    setSending(true);
    setError("");
    try {
      await supabase.from("contact_submissions").insert({
        full_name: form.full_name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        current_url: form.current_url,
        message: form.msg,
        status: "new",
      });

      await sendBrevoEmail(
        { email: form.email, name: form.full_name },
        "Votre message a bien été reçu - Déclic Digital",
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#3d1a6e,#4fc3c3);padding:24px;border-radius:12px;margin-bottom:24px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Message reçu ! ✅</h1>
          </div>
          <p style="color:#333;font-size:16px;">Bonjour <strong>${form.full_name}</strong>,</p>
          <p style="color:#555;line-height:1.6;">Merci pour votre message. Nous l'avons bien reçu et vous répondrons sous 24 à 48h ouvrées.</p>
          <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#666;font-size:13px;">Votre message :</p>
            <p style="margin:8px 0 0;color:#333;white-space:pre-wrap;">${form.msg}</p>
          </div>
          <p style="color:#999;font-size:13px;text-align:center;margin-top:32px;">Déclic Digital - declicdigital.net</p>
        </div>`
      );

      await sendBrevoEmail(
        { email: CONTACT_EMAIL, name: "Geoffrey" },
        `📬 Nouveau contact - ${form.full_name}${form.company ? ` (${form.company})` : ""}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
          <div style="background:linear-gradient(135deg,#3d1a6e,#4fc3c3);padding:20px 24px;border-radius:12px;margin-bottom:20px;">
            <h1 style="color:white;margin:0;font-size:20px;">📬 Nouveau message de contact</h1>
          </div>
          <div style="background:white;border-radius:12px;padding:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;width:120px;">Nom</td><td style="font-weight:bold;font-size:13px;">${form.full_name}</td></tr>
              <tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Email</td><td style="font-size:13px;"><a href="mailto:${form.email}" style="color:#4fc3c3;">${form.email}</a></td></tr>
              ${form.phone ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Téléphone</td><td style="font-size:13px;"><a href="tel:${form.phone}">${form.phone}</a></td></tr>` : ""}
              ${form.company ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Entreprise</td><td style="font-size:13px;">${form.company}</td></tr>` : ""}
              ${form.current_url ? `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;">Site actuel</td><td style="font-size:13px;"><a href="${form.current_url}" style="color:#4fc3c3;">${form.current_url}</a></td></tr>` : ""}
            </table>
            <div style="margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:3px solid #4fc3c3;">
              <p style="margin:0 0 6px;color:#888;font-size:12px;">Message :</p>
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

  return (
    <PageLayout>
      <Helmet>
        <title>Création site internet, SEO &amp; GEO | Paris et Hauts-de-Seine</title>
        <meta name="description" content="Agence web à Paris (92) — création de site internet, SEO et visibilité IA pour TPE et artisans. Audit SEO gratuit, devis en 24h. Expert Produit Google." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://declicdigital.net/#organization",
            name: "Déclic Digital",
            description: "Agence web et SEO pour TPE, artisans et indépendants en Île-de-France",
            url: "https://declicdigital.net",
            telephone: "+33602228939",
            email: "contact@declicdigital.net",
            image: "https://declicdigital.net/og/default.webp",
            priceRange: "€€",
            currenciesAccepted: "EUR",
            paymentAccepted: "Virement bancaire, Carte bancaire",
            address: { "@type": "PostalAddress", streetAddress: "57 rue d'Alleray", addressLocality: "Paris", postalCode: "75015", addressRegion: "Île-de-France", addressCountry: "FR" },
            geo: { "@type": "GeoCoordinates", latitude: 48.8396, longitude: 2.3004 },
            areaServed: [
              { "@type": "City", name: "Paris", sameAs: "https://fr.wikipedia.org/wiki/Paris" },
              { "@type": "AdministrativeArea", name: "Hauts-de-Seine (92)", sameAs: "https://fr.wikipedia.org/wiki/Hauts-de-Seine" },
            ],
            openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
            founder: { "@type": "Person", name: "Geoffrey", jobTitle: "Expert Produit Google" },
            sameAs: ["https://share.google/8Ifh8V9cpPGinQXkY"],
          })}
        </script>
      </Helmet>

      {/* ─── Hero — skip alternance ─────────────────────────────────────────── */}
      <section className="gradient-hero relative overflow-hidden" data-alternate="skip">
        <div className="container pt-6 pb-16 md:pt-8 md:pb-24 lg:pt-10 lg:pb-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span
                className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: "rgba(67,97,238,0.12)", color: "#4361EE" }}
              >
                Expert Produit Google · Agence digitale
              </span>
              <h1 className="mb-6 leading-tight">
                On crée votre site web à Paris et dans le 92 pour briller sur Google et l'IA
              </h1>
              <p className="mb-8 max-w-lg text-lg md:text-xl leading-relaxed" style={{ color: INK, opacity: 0.75 }}>
                Votre entreprise mérite d'être trouvée sur Google. Geoffrey, Expert Produit Google, et son équipe créent des{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>sites performants</Link>{" "}
                et optimisés{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO et GEO</Link>{" "}
                pour que les TPE et indépendants de Paris et du 92 attirent enfin les bons clients.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/contact">Demander un audit SEO gratuit</Link>
                </Button>
                <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-2xl group" style={{ boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <img src={imgBureau} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px" alt="Agence web Déclic Digital - bureau Paris avec analytics" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" width={640} height={256} fetchPriority="high" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(15,10,46,0.3), rgba(79,195,195,0.15))" }} />
              </div>
              <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <img src={geoffreyPhoto} alt="Geoffrey, fondateur Déclic Digital - Expert Produit Google" className="h-16 w-16 rounded-full object-cover shrink-0" width={64} height={64} fetchPriority="high" />
                <div>
                  <p className="font-bold" style={{ color: INK }}>Geoffrey</p>
                  <p className="text-sm" style={{ color: INK, opacity: 0.65 }}>Expert Produit Google</p>
                  <p className="text-xs mt-1" style={{ color: INK, opacity: 0.55 }}>Fondateur de Déclic Digital, j'accompagne les TPE et indépendants à Paris et dans le 92.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problème — #E9F2F4 ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute left-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
              <img src={imgProbleme} sizes="(max-width: 1024px) 0vw, 42vw" alt="Indépendant frustré par son site sans clients" className="w-full h-full object-cover" width={560} height={560} loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to left, #E9F2F4 0%, rgba(233,242,244,0.4) 30%, transparent 65%)" }} />
            </div>
            <div className="relative z-10 ml-auto max-w-2xl">
              <h2 className="mb-6">Vous n'avez pas de site, ou il ne génère aucun client ?</h2>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                De nombreuses TPE investissent dans un site web, mais celui-ci reste invisible sur Google. Sans stratégie de{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement</Link>,
                sans optimisation technique et sans contenu adapté, votre site ne peut pas attirer de visiteurs qualifiés. Résultat : zéro contact, zéro prospect, zéro retour sur investissement.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Eye, text: "Site invisible sur Google", detail: "93% des expériences en ligne commencent par un moteur de recherche. Si votre site n'apparaît pas, vos clients vont chez vos concurrents." },
                  { icon: Users, text: "Mauvaise expérience utilisateur", detail: "Un site lent, non adapté mobile ou difficile à naviguer fait fuir les visiteurs en quelques secondes." },
                  { icon: Search, text: "Absence de stratégie SEO", detail: "Sans optimisation des mots clés, des balises et du contenu, Google ne peut pas comprendre ni classer votre site." },
                  { icon: Gauge, text: "Site trop lent", detail: "Un temps de chargement supérieur à 3 secondes augmente le taux de rebond de plus de 50%." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-xl p-5 text-left" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-primary" style={{ color: INK }}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <span className="font-semibold block" style={{ color: INK }}>{item.text}</span>
                      <p className="text-sm mt-1" style={{ color: INK, opacity: 0.65 }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/contact">Demander un audit SEO gratuit</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services — #F6F1E9 ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" />
            <div className="absolute inset-0" style={{ background: "rgba(246,241,233,0.88)" }} />
            <div className="relative z-10 py-8">
              <div className="text-center mb-12">
                <h2>Création de site web professionnel pour indépendants</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: INK, opacity: 0.7 }}>
                  Chez <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Déclic Digital</Link>, nous concevons des outils de génération de clients, pensés pour les TPE et optimisés pour Google. Consultez <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos tarifs</Link> adaptés aux petits budgets.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Monitor, title: "Création de site web", desc: "Nous concevons des sites modernes, rapides et responsive, optimisés pour la conversion et l'expérience utilisateur.", link: "/creation-site-web" },
                  { icon: TrendingUp, title: "Référencement SEO", desc: "Le SEO est le levier le plus rentable pour attirer des clients. Nous optimisons votre site pour apparaître en première page Google.", link: "/referencement-seo" },
                  { icon: Eye, title: "Visibilité IA (GEO)", desc: "Apparaissez dans les réponses de ChatGPT, Perplexity et Gemini. La nouvelle frontière de la visibilité digitale pour les TPE.", link: "/visibilite-ia" },
                  { icon: BarChart3, title: "Stratégie digitale", desc: "Analyse de marché, positionnement, contenu, suivi des performances : chaque action est mesurée et orientée résultats.", link: "/contact" },
                ].map((s, i) => (
                  <div key={i} className="group rounded-2xl p-8 transition-all hover:-translate-y-1" style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary" style={{ color: INK }}>
                      <s.icon size={26} />
                    </div>
                    <h3 className="mb-3">{s.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: INK, opacity: 0.65 }}>{s.desc}</p>
                    <Link to={s.link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: "#4361EE" }}>
                      En savoir plus <ChevronRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Processus — #E9F2F4 ────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute right-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
              <img src={imgProcessus} sizes="(max-width: 1024px) 0vw, 42vw" alt="Consultante agence digitale Paris - Déclic Digital" className="w-full h-full object-cover" width={560} height={560} loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #E9F2F4 0%, rgba(233,242,244,0.4) 30%, transparent 65%)" }} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="mb-4">Référencement naturel Google : soyez visible localement</h2>
              <p className="text-lg mb-10 leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Un processus simple et transparent pour vous accompagner de A à Z. Découvrez <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>notre équipe</Link> et <Link to="/realisations" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>nos réalisations</Link>.
              </p>
              <div className="space-y-6">
                {[
                  { step: "1", icon: MessageSquare, title: "Formulaire", desc: "Remplissez notre formulaire de contact pour nous décrire votre projet et vos objectifs." },
                  { step: "2", icon: PhoneIcon, title: "Rendez-vous", desc: "Nous échangeons par téléphone pour comprendre vos besoins, votre marché et vos attentes." },
                  { step: "3", icon: FileText, title: "Proposition", desc: "Nous vous présentons une solution adaptée à votre activité, vos objectifs et votre budget." },
                  { step: "4", icon: Rocket, title: "Création", desc: "Nous concevons et mettons en ligne votre site optimisé SEO, prêt à attirer des clients." },
                  { step: "5", icon: BarChart3, title: "Suivi", desc: "Nous suivons les performances et optimisons en continu pour maximiser vos résultats." },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold" style={{ color: INK }}>
                      {p.step}
                    </div>
                    <div>
                      <h3 style={{ color: INK }}>{p.title}</h3>
                      <p className="text-sm" style={{ color: INK, opacity: 0.65 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Avis Google — #F6F1E9 ──────────────────────────────────────────── */}
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        <GoogleReviewsSection backgroundColor="#F6F1E9" />
      </Suspense>

      {/* ─── Pourquoi nous — #E9F2F4 ────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2>Pourquoi choisir Déclic Digital pour votre projet web ?</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Clock, title: "Disponible 24h/24", desc: "Contrairement à un commerce physique, votre site travaille pour vous en permanence. Vos prospects peuvent vous découvrir et vous contacter à tout moment." },
                { icon: Target, title: "Attirez des clients ciblés", desc: "Un site bien référencé attire des visiteurs qui recherchent activement vos services. Ce sont des prospects qualifiés prêts à passer à l'action." },
                { icon: Shield, title: "Renforcez votre crédibilité", desc: "En 2026, ne pas avoir de site web professionnel peut nuire à votre image. Un site soigné rassure vos prospects." },
                { icon: TrendingUp, title: "Rentabilité sur le long terme", desc: "Contrairement à la publicité payante, le référencement naturel génère du trafic durable sans coût par clic." },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary" style={{ color: INK }}>
                    <item.icon size={22} />
                  </div>
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: INK, opacity: 0.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Paris — #F6F1E9 ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-4">Paris et Hauts-de-Seine : notre terrain de jeu</h2>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Basés à Paris 15e, nous accompagnons les TPE, artisans et indépendants de Paris intra-muros et de tout le département du 92 : Boulogne-Billancourt, Nanterre, Issy-les-Moulineaux, Levallois-Perret, Asnières-sur-Seine, Courbevoie, et toutes les villes des Hauts-de-Seine.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Paris","Boulogne-Billancourt","Nanterre","Issy-les-Moulineaux","Levallois-Perret","Asnières-sur-Seine","Courbevoie","Neuilly-sur-Seine"].map((ville) => (
                  <span key={ville} className="rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)", color: INK }}>{ville}</span>
                ))}
              </div>
              <Link to="/nos-villes" className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: "#4361EE" }}>
                Voir toutes nos villes <ChevronRight size={16} />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-2xl group" style={{ boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
              <img src={imgParis} sizes="(max-width: 768px) 100vw, 50vw" alt="Paris vue aérienne Hauts-de-Seine - zone d'intervention Déclic Digital" className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" width={640} height={320} loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,46,0.85) 0%, transparent 55%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-bold text-lg" style={{ color: CREAM }}>Paris · Hauts-de-Seine · 92</p>
                <p className="text-sm" style={{ color: "rgba(246,241,233,0.7)" }}>Boulogne · Neuilly · Levallois · Issy · Nanterre</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Logos tech — #E9F2F4 ───────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Nos réalisations pour des TPE et artisans parisiens</h2>
            <p className="max-w-2xl mx-auto" style={{ color: INK, opacity: 0.7 }}>
              Nous utilisons des outils professionnels reconnus pour <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>créer des sites performants</Link> et optimisés <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>SEO et GEO</Link>.
            </p>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-scroll-left gap-10 md:gap-14 w-max">
              {[...techLogos, ...techLogos].map((t, i) => (
                <div key={`${t.name}-${i}`} className="flex flex-col items-center gap-3 shrink-0">
                  <div className="rounded-2xl p-5" style={{ backgroundColor: "#F6F1E9", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                    <img src={t.src} alt={t.name} className="h-16 w-16 md:h-20 md:w-20 object-contain" loading="lazy" decoding="async" width={80} height={80} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: INK, opacity: 0.65 }}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Audit SEO — #F6F1E9 ────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2>Demandez votre audit SEO gratuit dès aujourd'hui</h2>
            </div>
            <div className="space-y-6">
              <p className="text-base md:text-lg" style={{ color: INK, opacity: 0.7 }}>
                Créer un <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>site internet</Link> ne se résume pas à assembler quelques pages et publier du contenu. Chez <Link to="/qui-sommes-nous" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Déclic Digital</Link>, nous accompagnons les TPE, artisans et indépendants de <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>Paris et des Hauts-de-Seine</Link> dans la conception de sites web qui génèrent réellement des contacts qualifiés.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                  <h3 className="mb-2">Un site pensé pour convertir</h3>
                  <p className="text-base leading-relaxed" style={{ color: INK, opacity: 0.65 }}>
                    Chaque élément de votre site est pensé pour guider le visiteur vers une action précise : demande de devis, appel téléphonique, prise de rendez-vous.
                  </p>
                </div>
                <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                  <h3 className="mb-2">Le SEO au cœur de la conception</h3>
                  <p className="text-base leading-relaxed" style={{ color: INK, opacity: 0.65 }}>
                    Le <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>référencement</Link> est intégré dès la phase de conception : architecture, balisage sémantique, vitesse, maillage interne, contenu optimisé.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#E9F2F4", boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <h3 className="mb-3">Ce qui fait la différence avec Déclic Digital</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Audit SEO complet offert avant chaque projet",
                    "Suivi personnalisé via votre espace client dédié",
                    "Expertise Google certifiée (Expert Produit Google)",
                    "Sites rapides : score PageSpeed supérieur à 90",
                    "Accompagnement sur-mesure, pas de template générique",
                    "Tarifs adaptés aux budgets des TPE et indépendants",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <CheckCircle size={16} className="text-brand-violet mt-0.5 shrink-0" />
                      <span style={{ color: INK, opacity: 0.7 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Liens services — #E9F2F4 ───────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#E9F2F4" }}>
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            {/* h3 → h2 conformément à la règle titres de section */}
            <h2 className="mb-4">Explorez nos services</h2>
            <p className="text-lg mb-6" style={{ color: INK, opacity: 0.7 }}>Découvrez l'ensemble de nos prestations pour développer votre présence en ligne.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { to: "/creation-site-web", label: "Création de site web" },
                { to: "/referencement-seo", label: "Référencement SEO et GEO" },
                { to: "/contact", label: "Audit SEO gratuit" },
                { to: "/tarifs", label: "Nos tarifs" },
                { to: "/realisations", label: "Nos réalisations" },
                { to: "/qui-sommes-nous", label: "Qui sommes-nous" },
                { to: "/nos-villes", label: "Nos villes" },
                { to: "/faq", label: "Questions fréquentes" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="rounded-full border px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: INK, borderColor: "rgba(43,30,63,0.25)", backgroundColor: "#F6F1E9" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Formulaire — #F6F1E9 ───────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: "#F6F1E9" }}>
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              {/* h3 → h2 conformément à la règle titres de section */}
              <h2>Parlez-nous de votre projet</h2>
              <p className="mt-4 text-lg" style={{ color: INK, opacity: 0.7 }}>
                Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>création de votre site web</Link>.
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
                <Button
                  type="button"
                  variant="custom"
                  size="lg"
                  disabled={sending}
                  onClick={handleSubmit}
                  className="w-full gradient-miami btn-glow rounded-full font-bold shadow-glow"
                >
                  {sending ? <Loader2 size={18} className="mr-2 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
                  {sending ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Localisation — #E9F2F4 ─────────────────────────────────────────── */}
      <Suspense fallback={<div style={{ minHeight: 300 }} />}>
        <LocationSection backgroundColor="#E9F2F4" />
      </Suspense>

      {/* ─── CTA final texture — skip alternance ────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24" data-alternate="skip">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center">
            <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital et Expert Produit Google" className="w-20 h-20 rounded-full object-cover border-2 shadow-lg mb-4" style={{ borderColor: "rgba(43,30,63,0.3)" }} width={80} height={80} loading="lazy" />
            <p className="text-sm font-semibold mb-1" style={{ color: INK }}>Geoffrey, Expert Produit Google</p>
            <h3 className="mb-4" style={{ color: INK }}>Et si votre site devenait votre meilleur commercial ?</h3>
            <p className="mb-8 text-lg max-w-2xl" style={{ color: INK, opacity: 0.7 }}>
              Un site optimisé peut générer des prospects tous les jours. Ne laissez plus vos concurrents capter les clients qui vous cherchent sur Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/contact">Demander un audit SEO gratuit</Link>
              </Button>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/tarifs">Voir nos tarifs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </PageLayout>
  );
};

export default Index;
