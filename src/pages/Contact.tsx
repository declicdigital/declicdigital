import { motion } from "framer-motion";
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
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";

const Contact = () => (
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
        email: "contact@declicdigital.net",
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
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33602228939",
          contactType: "customer service",
          email: "contact@declicdigital.net",
          availableLanguage: ["French"],
        },
      })}</script>
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
    {/* Hero + Formulaire */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex flex-col justify-center lg:sticky lg:top-32">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Parlons de votre projet : devis gratuit sous 24h
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Remplissez le formulaire ci-contre pour recevoir un devis gratuit et personnalisé pour la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link> ou le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>. Nous répondons sous 24 à 48 heures ouvrées.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "contact@declicdigital.net" },
                { icon: Phone, label: "Téléphone", value: "06.02.22.89.39" },
                { icon: MapPin, label: "Localisation", value: "Paris et Hauts-de-Seine (92)" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <h2 className="mb-6 text-2xl font-extrabold">Demandez votre devis</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Votre nom" className="rounded-xl" required />
                  <Input placeholder="Nom de votre entreprise" className="rounded-xl" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Votre email" type="email" className="rounded-xl" required />
                  <Input placeholder="Votre téléphone" type="tel" className="rounded-xl" />
                </div>
                <Input placeholder="URL de votre site web (si existant)" type="url" className="rounded-xl" />
                <Textarea placeholder="Décrivez votre projet : type de site souhaité, objectifs, fonctionnalités..." className="rounded-xl min-h-[120px]" required />
                <Button type="submit" size="lg" className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
                  <CheckCircle size={18} className="mr-2" /> Envoyer ma demande
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>



    {/* Google Maps */}
    <SectionWrapper className="bg-section-blue">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold md:text-4xl">Retrouvez-nous</h2>
        <p className="mt-4 text-muted-foreground">Nous intervenons <Link to="/nos-villes" className="text-primary font-semibold hover:underline">à Paris et dans le 92</Link>, en présentiel ou à distance.</p>
      </div>
      <MapEmbed />
    </SectionWrapper>

    {/* Contenu SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi faire appel à une agence web pour votre site ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Créer un <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web professionnel</Link> ne se résume pas à assembler quelques pages. Il faut penser à l'expérience utilisateur, au design, à la vitesse de chargement, à l'optimisation pour les moteurs de recherche et à la compatibilité mobile. Une agence web comme Déclic Digital prend en charge l'ensemble de ces aspects pour vous livrer un site qui travaille pour vous.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour une TPE ou un indépendant, un site web bien conçu est un investissement rentable. Il vous permet d'être trouvé par vos clients potentiels sur Google, de présenter vos services de manière professionnelle et de générer des demandes de devis automatiquement. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Chez Déclic Digital, nous comprenons les contraintes des petites entreprises. C'est pourquoi nous proposons des solutions accessibles, avec des explications simples et un accompagnement humain à chaque étape. Du premier échange à la mise en ligne, en passant par le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>, nous sommes à vos côtés pour faire de votre présence en ligne un véritable levier de croissance.
        </p>
      </div>
    </SectionWrapper>

    {/* Avis clients */}
    <GoogleReviewsSection compact maxReviews={3} />

    {/* Maillage */}
    <SectionWrapper className="bg-section-blue">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold mb-4">Nos services</h2>
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
          <Link to="/nos-villes" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Nos villes
          </Link>
          <Link to="/faq" className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
            Questions fréquentes
          </Link>
        </div>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default Contact;
