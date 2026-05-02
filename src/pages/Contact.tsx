import { useState } from "react";
import { motion } from "motion/react";
import MapEmbed from "@/components/MapEmbed";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumb from "@/components/PageBreadcrumb";
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

const Contact = () => {
  const [form, setForm] = useState({
    full_name: "", company: "", email: "", phone: "", current_url: "", msg: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <title>Contact et devis gratuit en 24h | Déclic Digital Paris</title>
        <meta name="description" content="Besoin d'un site internet ou d'un boost SEO ? Contactez Déclic Digital par téléphone, email ou formulaire. Devis personnalisé gratuit, réponse sous 24h." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/contact" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://declicdigital.net/#organization",
          name: "Déclic Digital",
          description: "Agence web et SEO pour TPE à Paris et Hauts-de-Seine",
          url: "https://declicdigital.net",
          telephone: "+33602228939",
          email: CONTACT_EMAIL,
          priceRange: "€€",
          address: {
            "@type": "PostalAddress",
            streetAddress: "57 rue d'Alleray",
            addressLocality: "Paris",
            postalCode: "75015",
            addressRegion: "Île-de-France",
            addressCountry: "FR",
          },
          geo: { "@type": "GeoCoordinates", latitude: 48.8396, longitude: 2.3004 },
          areaServed: [
            { "@type": "City", name: "Paris" },
            { "@type": "AdministrativeArea", name: "Hauts-de-Seine (92)" },
          ],
        })}</script>
      </Helmet>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      {/* Section 1 — Hero clair #F6F1E9 */}
      <section style={{ backgroundColor: "#F6F1E9" }} className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center lg:sticky lg:top-32"
            >
              <h1 className="mb-4" style={{ color: "#2B1E3F" }}>
                Parlons de votre projet : devis gratuit sous 24h
              </h1>
              <p className="text-lg mb-6" style={{ color: "#2B1E3F" }}>
                Remplissez le formulaire ci-contre pour recevoir un devis gratuit et personnalisé pour la{" "}
                <Link to="/creation-site-web" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>
                  création de site web
                </Link>{" "}
                ou le{" "}
                <Link to="/referencement-seo" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>
                  référencement SEO et GEO
                </Link>
                . Nous répondons sous 24 à 48 heures ouvrées.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                  { icon: Phone, label: "Téléphone", value: "06.02.22.89.39", href: "tel:0602228939" },
                  { icon: MapPin, label: "Localisation", value: "Paris et Hauts-de-Seine (92)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary"
                      style={{ color: "#2B1E3F" }}
                    >
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-semibold hover:underline transition-colors"
                          style={{ color: "#2B1E3F" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-semibold" style={{ color: "#2B1E3F" }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(43,30,63,0.12)",
                  boxShadow: "0 4px 24px rgba(43,30,63,0.08)",
                }}
              >
                <h2 className="mb-6" style={{ color: "#2B1E3F" }}>Demandez votre devis</h2>
                {sent ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#2B1E3F" }}>Message envoyé !</h3>
                    <p style={{ color: "#2B1E3F", opacity: 0.6 }}>Nous vous répondrons dans les 24 heures ouvrées.</p>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — #E9F2F4 */}
      <section style={{ backgroundColor: "#E9F2F4" }} className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-8">
            <h2 style={{ color: "#2B1E3F" }}>Retrouvez-nous</h2>
            <p className="mt-4" style={{ color: "#2B1E3F" }}>
              Nous intervenons{" "}
              <Link to="/nos-villes" className="font-semibold hover:underline" style={{ color: "#4361EE" }}>
                à Paris et dans le 92
              </Link>
              , en présentiel ou à distance.
            </p>
          </div>
          <MapEmbed />
        </div>
      </section>

      {/* Section 3 — GoogleReviews #F6F1E9 */}
      <GoogleReviewsSection compact maxReviews={3} backgroundColor="#F6F1E9" />
    </PageLayout>
  );
};

export default Contact;
