import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import LocationSection from "@/components/LocationSection";
import { motion } from "motion/react";
import { Monitor, Smartphone, TrendingUp, Zap, Building2, User, Wrench, ShoppingCart, CheckCircle, Search, Loader2 } from "lucide-react";
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

const CreationSite = () => {
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
        full_name: form.full_name, company: form.company, email: form.email,
        phone: form.phone, current_url: form.current_url, message: form.msg, status: "new",
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
          <p style="color:#999;font-size:13px;text-align:center;margin-top:32px;">Déclic Digital — declicdigital.net</p>
        </div>`
      );
      await sendBrevoEmail(
        { email: CONTACT_EMAIL, name: "Geoffrey" },
        `📬 Nouveau contact - ${form.full_name}${form.company ? ` (${form.company})` : ""}`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f5f5;padding:20px;">
          <div style="background:linear-gradient(135deg,#3d1a6e,#4fc3c3);padding:20px 24px;border-radius:12px;margin-bottom:20px;">
            <h1 style="color:white;margin:0;font-size:20px;">📬 Nouveau contact — CreationSite</h1>
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

  const BEIGE = "#F6F1E9";
  const BLEU  = "#E9F2F4";
  const INK   = "#2B1E3F";
  const LINK  = "#4361EE";

  return (
    <PageLayout>
      <Helmet>
        <title>Création de site internet sur-mesure pour TPE | Déclic Digital Paris</title>
        <meta name="description" content="Site vitrine, e-commerce ou landing page pour TPE et artisans. Design responsive, optimisé SEO, livré en 2 semaines. Devis gratuit en 24h." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/creation-site-web" />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Création de site internet",provider:{"@type":"LocalBusiness",name:"Déclic Digital",url:"https://declicdigital.net"},areaServed:"Île-de-France"})}</script>
      </Helmet>

      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Création de site web" }]} />

      {/* ─── Hero — bloc 1 → BEIGE ─── */}
      <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 rounded-2xl overflow-hidden">
              <img src={imgRefonte} alt="Refonte site web avant après - Déclic Digital" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${BEIGE} 0%, rgba(246,241,233,0.5) 25%, transparent 60%)` }} />
            </div>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-2xl">
              <h1 className="mb-6" style={{ color: INK }}>Création de site internet sur-mesure pour les artisans, TPE et indépendants à Paris</h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: INK }}>
                Nous concevons des sites modernes, rapides et optimisés{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>SEO</Link>{" "}
                pour les TPE et indépendants. Un site bien conçu est votre meilleur outil pour générer des prospects. Découvrez{" "}
                <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>nos tarifs</Link>{" "}
                ou demandez un{" "}
                <Link to="/contact" className="font-semibold hover:underline" style={{ color: LINK }}>audit SEO gratuit</Link>.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-miami btn-glow rounded-full px-8 font-bold shadow-glow">
                <Link to="/rendez-vous">Prendre rendez-vous</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Avantages — bloc 2 → BLEU ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Pourquoi votre activité a besoin d'un site web professionnel</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Un site web professionnel ne se limite pas à une simple vitrine en ligne. C'est un outil stratégique qui renforce votre crédibilité, attire de nouveaux clients grâce au{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement naturel</Link>{" "}
            et vous différencie de vos concurrents.
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

      {/* ─── Processus — bloc 3 → BEIGE ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Un site vitrine ou e-commerce adapté à votre métier</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Nous avons développé un processus clair et structuré pour vous accompagner du premier échange à la mise en ligne de votre site.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "1. Échange et analyse", desc: "Nous commençons par comprendre votre activité, vos objectifs et votre cible. Cette étape est essentielle pour créer un site adapté." },
              { icon: Monitor, title: "2. Conception et design", desc: "Nous définissons l'arborescence, le design et la structure de votre site. Vous validez chaque étape avant le développement." },
              { icon: Zap, title: "3. Développement", desc: "Nous développons votre site avec les meilleures technologies. Chaque page est optimisée pour le SEO, la vitesse et le mobile." },
              { icon: CheckCircle, title: "4. Mise en ligne et suivi", desc: "Après vos retours et validations, nous mettons votre site en ligne. Nous assurons ensuite un suivi pour garantir ses performances." },
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

      {/* ─── Pour qui — bloc 4 → BLEU ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: INK }}>Notre méthode : de la maquette à la mise en ligne</h2>
          <p className="text-center max-w-2xl mx-auto mb-10" style={{ color: INK, opacity: 0.7 }}>
            Nos solutions s'adaptent à tous les profils d'entreprises. Que vous soyez artisan, commerçant, profession libérale ou dirigeant de TPE, nous concevons un site adapté à votre métier et optimisé pour le{" "}
            <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement Google</Link>.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "TPE", desc: "Développez votre présence en ligne et positionnez-vous comme un acteur de référence dans votre secteur." },
              { icon: User, title: "Indépendants", desc: "Présentez vos services de manière professionnelle et générez des prises de contact qualifiées." },
              { icon: Wrench, title: "Artisans", desc: "Attirez des clients locaux grâce à un site optimisé pour le référencement local et Google Maps." },
              { icon: ShoppingCart, title: "E-commerce", desc: "Vendez vos produits en ligne avec un site sécurisé, rapide et pensé pour la conversion." },
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

      {/* ─── Image développeur — bloc 5 → BEIGE ─── */}
      <section className="py-12 md:py-16 overflow-hidden" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <div className="relative">
            <div className="hidden lg:block absolute left-0 top-0 h-full w-5/12 rounded-2xl overflow-hidden">
              <img src={imgDev} alt="Développeur web code site artisan - Déclic Digital" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${BEIGE} 0%, rgba(246,241,233,0.4) 30%, transparent 65%)` }} />
            </div>
            <div className="relative z-10 ml-auto max-w-2xl space-y-6 py-8">
              <h2 style={{ color: INK }}>Site web rapide, mobile et optimisé pour Google</h2>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Un bon site web pour une TPE, c'est avant tout un site qui remplit son objectif : attirer des visiteurs et les convertir en clients. Il ne suffit pas d'avoir un site "joli". Il doit être rapide, bien structuré, adapté aux mobiles et surtout visible sur Google.
              </p>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Chaque page doit être pensée pour répondre à une intention de recherche précise. C'est le rôle du{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement naturel</Link>,
                et c'est ce que nous intégrons dès la conception de chaque projet.
              </p>
              <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
                Nos sites incluent systématiquement : un design professionnel sur mesure, une{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>optimisation SEO complète</Link>,
                une compatibilité mobile parfaite, une vitesse de chargement optimisée, et un formulaire de contact pour capturer vos prospects. Consultez{" "}
                <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>nos tarifs</Link>{" "}
                pour en savoir plus.
              </p>
              <div className="relative overflow-hidden rounded-2xl group" style={{ boxShadow: "0 4px 24px -4px rgba(43,30,63,0.08)" }}>
                <img src={imgResponsive} alt="Site web responsive mobile artisan - Déclic Digital" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(43,30,63,0.3), rgba(99,215,180,0.15))" }} />
                <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6">
                  <p className="font-semibold text-sm" style={{ color: "#F6F1E9" }}>+70% des recherches locales se font sur mobile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contenu SEO — bloc 6 → BLEU ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-center" style={{ color: INK }}>Création de site web pour artisan à Paris : pourquoi c'est indispensable</h2>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              En tant qu'artisan ou indépendant à Paris, votre visibilité en ligne détermine directement votre volume de clients. 97% des consommateurs recherchent un professionnel local sur internet avant de le contacter. Sans site web, vous êtes invisible pour cette audience. Avec un site bien conçu et optimisé pour le{" "}
              <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: LINK }}>référencement local</Link>,
              vous captez des demandes de devis chaque semaine.
            </p>
            <h3 style={{ color: INK }}>Un site vitrine qui inspire confiance et génère des contacts</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Votre site web est votre vitrine 24h/24. Il doit présenter clairement vos services, afficher vos réalisations, et faciliter la prise de contact. Nous concevons chaque site avec un objectif commercial précis : transformer les visiteurs en prospects qualifiés.
            </p>
            <h3 style={{ color: INK }}>Technologies modernes pour des performances optimales</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Nous utilisons les technologies les plus adaptées selon votre projet : WordPress pour les sites éditoriaux, Shopify pour le e-commerce, ou des solutions sur-mesure pour les besoins spécifiques. Quel que soit l'outil, nous garantissons un site rapide (score PageSpeed supérieur à 90), sécurisé (HTTPS), et conforme aux standards d'accessibilité.
            </p>
            <h3 style={{ color: INK }}>Combien coûte la création d'un site internet pour une TPE ?</h3>
            <p className="leading-relaxed" style={{ color: INK, opacity: 0.7 }}>
              Chez Déclic Digital, nous proposons des{" "}
              <Link to="/tarifs" className="font-semibold hover:underline" style={{ color: LINK }}>tarifs adaptés aux budgets des TPE</Link> :
              une landing page dès 200€ de mise en service + 50€/mois, un site vitrine complet dès 590€ + 50€/mois. Ces forfaits incluent le design, le développement, l'hébergement, la maintenance et l'optimisation SEO de base.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Villes — bloc 7 → BEIGE ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BEIGE }}>
        <div className="container">
          <h2 className="text-center mb-6" style={{ color: INK }}>Création de site internet à Paris et dans les Hauts-de-Seine</h2>
          <p className="text-center mb-8" style={{ color: INK, opacity: 0.7 }}>
            Nous intervenons à Paris et dans les Hauts-de-Seine pour la{" "}
            <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: LINK }}>création de sites web professionnels</Link>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.slice(0, 12).map((c) => (
              <Link key={c.slug} to={`/creation-site-web/${c.slug}`} className="rounded-full border px-4 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: BLEU, color: INK, borderColor: "rgba(43,30,63,0.25)" }}>
                Site web {c.nameShort}
              </Link>
            ))}
            <Link to="/nos-villes" className="rounded-full px-4 py-2 text-sm font-semibold btn-glow gradient-primary" style={{ color: INK }}>
              Voir toutes les villes →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── GoogleReviews — bloc 8 → BLEU ─── */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor={BLEU} />

      {/* ─── LocationSection — bloc 9 → BEIGE ─── */}
      <LocationSection backgroundColor={BEIGE} />

      {/* ─── Formulaire — bloc 10 → BLEU ─── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: BLEU }}>
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h2 style={{ color: INK }}>Parlez-nous de votre projet</h2>
              <p className="mt-4 text-lg" style={{ color: INK, opacity: 0.7 }}>
                Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: LINK }}>création de votre site web</Link>.
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

      {/* ─── CTA texture — skip alternance ─── */}
      <section className="relative overflow-hidden py-16">
        <img src={imgTexture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital et Expert Produit Google"
            className="w-32 h-32 rounded-full object-cover border-2 shadow-lg mb-4"
            style={{ borderColor: "rgba(43,30,63,0.3)" }} loading="lazy" />
          <p className="text-sm font-semibold mb-2" style={{ color: INK }}>Geoffrey, Expert Produit Google</p>
          <h2 className="mb-4" style={{ color: INK }}>Prêt à lancer votre site web ?</h2>
          <p className="mb-8 max-w-xl" style={{ color: INK, opacity: 0.7 }}>Demandez un devis gratuit pour la création de votre site web professionnel. Réponse sous 24h.</p>
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
