import { motion } from "framer-motion";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import heroContact from "@/assets/contact-agence-web.png";
import geoffreyPhoto from "@/assets/geoffrey-fondateur-declic-digital.png";

const Contact = () => (
  <PageLayout>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Parlez-nous de votre <span className="text-gradient">projet</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé pour la <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">création de site web</Link> ou le <Link to="/referencement-seo" className="text-primary font-semibold hover:underline">référencement SEO</Link>. Nous répondons sous 24 à 48 heures ouvrées.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroContact} alt="Contactez Déclic Digital agence web" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Formulaire + infos */}
    <SectionWrapper>
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-6 text-2xl font-extrabold">Demandez votre devis pour <Link to="/creation-site-web" className="text-primary hover:underline">création de site</Link></h2>
          <p className="mb-6 text-muted-foreground">
            Que vous ayez besoin d'un site vitrine, d'un site e-commerce ou d'une refonte complète, nous sommes là pour vous accompagner. Décrivez votre projet et nous vous proposerons une solution adaptée à vos objectifs et à votre budget. Consultez <Link to="/tarifs" className="text-primary font-semibold hover:underline">nos tarifs</Link> pour une première idée.
          </p>
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
            <Button type="submit" size="lg" className="w-full gradient-primary rounded-full text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <CheckCircle size={18} className="mr-2" /> Envoyer ma demande
            </Button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold">Nos coordonnées</h2>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "contact@declicdigital.net" },
              { icon: Phone, label: "Téléphone", value: "06.02.22.89.39" },
              { icon: MapPin, label: "Localisation", value: "Paris et Hauts-de-Seine (92)" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h3 className="mb-2 font-bold">Réponse rapide</h3>
            <p className="text-sm text-muted-foreground">
              Nous répondons à toutes les demandes sous 24 à 48 heures ouvrées. Chaque projet fait l'objet d'un échange personnalisé pour comprendre vos besoins.
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <div className="flex items-center gap-4 mb-4">
              <img src={geoffreyPhoto} alt="Geoffrey, fondateur de Déclic Digital" className="w-14 h-14 rounded-full object-cover shadow-md" />
              <div>
                <p className="font-bold text-sm">Geoffrey</p>
                <p className="text-xs text-muted-foreground">Fondateur, Expert Produit Google</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mb-4">"Chaque projet est unique. Je prends le temps d'échanger avec vous pour comprendre vos besoins et vous proposer la meilleure solution."</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✅ Expert Produit Google certifié</li>
              <li>✅ Spécialistes des PME et petites entreprises</li>
              <li>✅ Sites optimisés SEO dès la conception</li>
              <li>✅ Tarifs adaptés aux petits budgets</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>

    {/* Google Maps */}
    <SectionWrapper className="bg-section-blue">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold md:text-4xl">Retrouvez-nous</h2>
        <p className="mt-4 text-muted-foreground">Nous intervenons <Link to="/nos-villes" className="text-primary font-semibold hover:underline">à Paris et dans le 92</Link>, en présentiel ou à distance.</p>
      </div>
      <div className="mx-auto max-w-3xl rounded-2xl overflow-hidden shadow-card">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.5!2d2.2975!3d48.8386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sChIJsYNdrCdx5kcR89wPMta_l-w!2sD%C3%A9clic%20Digital!5e0!3m2!1sfr!2sfr!4v1"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Déclic Digital - 57 rue d'Alleray 75015 Paris"
        />
      </div>
    </SectionWrapper>

    {/* Contenu SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi faire appel à une agence web pour votre site ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Créer un <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web professionnel</Link> ne se résume pas à assembler quelques pages. Il faut penser à l'expérience utilisateur, au design, à la vitesse de chargement, à l'optimisation pour les moteurs de recherche et à la compatibilité mobile. Une agence web comme Déclic Digital prend en charge l'ensemble de ces aspects pour vous livrer un site qui travaille pour vous.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour une PME ou un indépendant, un site web bien conçu est un investissement rentable. Il vous permet d'être trouvé par vos clients potentiels sur Google, de présenter vos services de manière professionnelle et de générer des demandes de devis automatiquement. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
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
