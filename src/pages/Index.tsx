import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.webp";

const IndexBelow = lazy(() => import("./IndexBelow"));

const Index = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Création site internet & SEO à Paris (92) | Déclic Digital</title>
        <meta
          name="description"
          content="Déclic Digital, agence web à Paris et dans les Hauts-de-Seine (92). Création de site internet professionnel et référencement SEO pour TPE et artisans. Audit gratuit, devis en 24h."
        />
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
            address: {
              "@type": "PostalAddress",
              streetAddress: "57 rue d'Alleray",
              addressLocality: "Paris",
              postalCode: "75015",
              addressRegion: "Île-de-France",
              addressCountry: "FR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 48.8396,
              longitude: 2.3004,
            },
            areaServed: [
              { "@type": "City", name: "Paris", sameAs: "https://fr.wikipedia.org/wiki/Paris" },
              { "@type": "AdministrativeArea", name: "Hauts-de-Seine (92)", sameAs: "https://fr.wikipedia.org/wiki/Hauts-de-Seine" },
            ],
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "18:00",
            },
            founder: { "@type": "Person", name: "Geoffrey", jobTitle: "Expert Produit Google" },
            sameAs: ["https://share.google/8Ifh8V9cpPGinQXkY"],
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-brand-violet/10 px-4 py-1.5 text-xs font-semibold text-brand-violet">
                Expert Produit Google · Agence digitale
              </span>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                On crée votre site web à Paris et dans le 92 pour briller sur Google et l'IA
              </h1>
              <p className="mb-8 max-w-lg text-lg md:text-xl text-muted-foreground leading-relaxed">
                Votre entreprise mérite d'être trouvée sur Google. Geoffrey, Expert Produit Google, et son équipe créent des <Link to="/creation-site-web" className="text-primary font-semibold">sites performants</Link> et optimisés <Link to="/referencement-seo" className="text-primary font-semibold">SEO et GEO</Link> pour que les TPE et indépendants de Paris et du 92 attirent enfin les bons clients, en toute simplicité et sans budget démesuré.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                  <Link to="/contact">Demander un audit SEO gratuit</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-[hsl(263,36%,18%)] px-8 font-semibold text-[hsl(263,36%,18%)] hover:bg-[hsl(263,36%,18%)] hover:text-white transition-colors">
                  <Link to="/rendez-vous">Prendre rendez-vous</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-2xl bg-card p-8 shadow-card text-center max-w-sm">
                <img src={geoffreyPhoto} alt="Geoffrey, fondateur Déclic Digital - Expert Produit Google" className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" width={128} height={128} fetchPriority="high" />
                <p className="font-bold text-lg">Geoffrey</p>
                <p className="text-sm text-muted-foreground">Expert Produit Google</p>
                <p className="text-sm text-muted-foreground mt-2">Fondateur de Déclic Digital, j'accompagne les TPE et indépendants à Paris et dans le 92 dans leur transformation digitale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Below the fold - lazy loaded */}
      <Suspense fallback={<div style={{ minHeight: 800 }} />}>
        <IndexBelow />
      </Suspense>
    </PageLayout>
  );
};

export default Index;
