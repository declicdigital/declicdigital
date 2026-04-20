import { useState } from "react";
import { motion } from "motion/react";
import MapEmbed from "@/components/MapEmbed";
import { Helmet } from "react-helmet-async";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const CONTACT_EMAIL = "contact@declicdigital.net";

const Contact = () => {
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    current_url: "",
    msg: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.msg) return;
    const subject = encodeURIComponent(`Demande de devis - ${form.full_name}${form.company ? ` (${form.company})` : ""}`);
    const body = encodeURIComponent(
      `Nom : ${form.full_name}\n` +
      `Entreprise : ${form.company || "—"}\n` +
      `Email : ${form.email}\n` +
      `Téléphone : ${form.phone || "—"}\n` +
      `Site actuel : ${form.current_url || "—"}\n\n` +
      `Message :\n${form.msg}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
          image: "https://declicdigital.net/og/contact.webp",
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

      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex flex-col justify-center lg:sticky lg:top-32">
              <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
                Parlons de votre projet : devis gratuit sous 24h
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Remplissez le formulaire ci-contre pour recevoir un devis gratuit et personnalisé pour la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link> ou le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO et GEO</Link>. Nous répondons sous 24 à 48 heures ouvrées.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                  { icon: Phone, label: "Téléphone", value: "06.02.22.89.39", href: "tel:0602228939" },
                  { icon: MapPin, label: "Localisation", value: "Paris et Hauts-de-Seine (92)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-semibold hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-semibold">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
                <h2 className="mb-6 text-2xl font-extrabold">Demandez votre devis</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input name="full_name" placeholder="Votre nom" className="rounded-xl" required value={form.full_name} onChange={handleChange} />
                    <Input name="company" placeholder="Nom de votre entreprise" className="rounded-xl" value={form.company} onChange={handleChange} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input name="email" placeholder="Votre email" type="email" className="rounded-xl" required value={form.email} onChange={handleChange} />
                    <Input name="phone" placeholder="Votre téléphone" type="tel" className="rounded-xl" value={form.phone} onChange={handleChange} />
                  </div>
                  <Input name="current_url" placeholder="URL de votre site web (si existant)" type="url" className="rounded-xl" value={form.current_url} onChange={handleChange} />
                  <Textarea name="msg" placeholder="Décrivez votre projet : type de site souhaité, objectifs, fonctionnalités..." className="rounded-xl min-h-[120px]" required value={form.msg} onChange={handleChange} />
                  <Button type="submit" variant="custom" size="lg" className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
                    <CheckCircle size={18} className="mr-2" />
                    Envoyer ma demande
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Le formulaire ouvre votre logiciel email pré-rempli.</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold md:text-4xl">Retrouvez-nous</h2>
          <p className="mt-4 text-muted-foreground">Nous intervenons <Link to="/nos-villes" className="text-primary font-semibold hover:underline">à Paris et dans le 92</Link>, en présentiel ou à distance.</p>
        </div>
        <MapEmbed />
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi faire appel à une agence web pour votre site ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Créer un <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web professionnel</Link> ne se résume pas à assembler quelques pages. Il faut penser à l'expérience utilisateur, au design, à la vitesse de chargement, à l'optimisation pour les moteurs de recherche et à la compatibilité mobile.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour une TPE ou un indépendant, un site web bien conçu est un investissement rentable. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
          </p>
        </div>
      </SectionWrapper>

      <GoogleReviewsSection compact maxReviews={3} />
    </PageLayout>
  );
};

export default Contact;
