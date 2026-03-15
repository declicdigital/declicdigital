import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import heroContact from "@/assets/contact-agence-web.png";

const Contact = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Parlez-nous de votre <span className="text-gradient">projet</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé. Nous répondons sous 24 à 48 heures ouvrées.
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
          <h2 className="mb-6 text-2xl font-extrabold">Demandez votre devis pour création de site</h2>
          <p className="mb-6 text-muted-foreground">
            Que vous ayez besoin d'un site vitrine, d'un site e-commerce ou d'une refonte complète, nous sommes là pour vous accompagner. Décrivez votre projet et nous vous proposerons une solution adaptée à vos objectifs et à votre budget.
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
              { icon: MapPin, label: "Localisation", value: "France entière" },
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
            <h3 className="mb-2 font-bold">Pourquoi nous choisir ?</h3>
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

    {/* Google Maps + Fiche Google */}
    <SectionWrapper className="bg-card">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold md:text-4xl">Retrouvez-nous</h2>
        <p className="mt-4 text-muted-foreground">Nous intervenons partout en France, en présentiel ou à distance.</p>
      </div>
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl overflow-hidden shadow-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.0!2d2.3004!3d48.8393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6703e9c3fb8a5%3A0x0!2s57+Rue+d&#39;Alleray%2C+75015+Paris!5e0!3m2!1sfr!2sfr"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Déclic Digital — 57 rue d'Alleray 75015 Paris"
          />
        </div>
        <div className="rounded-2xl bg-background p-6 shadow-card flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Notre fiche Google</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Retrouvez toutes nos informations, nos avis clients et nos coordonnées directement sur Google.
          </p>
          <a
            href="https://share.google/w9cwHP0IYLAg7tBaA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block gradient-primary rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            Voir notre fiche Google
          </a>
          <a
            href="https://share.google/w9cwHP0IYLAg7tBaA"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full border border-border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors text-center"
          >
            Voir nos avis Google
          </a>
        </div>
      </div>
    </SectionWrapper>

    {/* Contenu SEO */}
    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold md:text-4xl text-center">Pourquoi faire appel à une agence web pour votre site ?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Créer un site web professionnel ne se résume pas à assembler quelques pages. Il faut penser à l'expérience utilisateur, au design, à la vitesse de chargement, à l'optimisation pour les moteurs de recherche et à la compatibilité mobile. Une agence web comme Déclic Digital prend en charge l'ensemble de ces aspects pour vous livrer un site qui travaille pour vous.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pour une PME ou un indépendant, un site web bien conçu est un investissement rentable. Il vous permet d'être trouvé par vos clients potentiels sur Google, de présenter vos services de manière professionnelle et de générer des demandes de devis automatiquement.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Chez Déclic Digital, nous comprenons les contraintes des petites entreprises. C'est pourquoi nous proposons des solutions accessibles, sans jargon technique, avec un accompagnement humain à chaque étape. Du premier échange à la mise en ligne, en passant par le référencement SEO, nous sommes à vos côtés pour faire de votre présence en ligne un véritable levier de croissance.
        </p>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default Contact;
