import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

const Contact = () => (
  <PageLayout>
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Parlez-nous de votre <span className="text-gradient">projet</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Formulaire + infos */}
    <SectionWrapper>
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-6 text-2xl font-extrabold">Demandez votre devis gratuit</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Votre nom" className="rounded-xl" required />
              <Input placeholder="Nom de votre entreprise" className="rounded-xl" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Votre email" type="email" className="rounded-xl" required />
              <Input placeholder="Votre téléphone" type="tel" className="rounded-xl" />
            </div>
            <Textarea placeholder="Décrivez votre projet..." className="rounded-xl min-h-[120px]" required />
            <Button type="submit" size="lg" className="w-full gradient-primary rounded-full text-primary-foreground font-semibold shadow-lg hover:opacity-90">
              <CheckCircle size={18} className="mr-2" /> Obtenir un devis gratuit
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
              Nous répondons à toutes les demandes sous 24 à 48 heures ouvrées.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default Contact;
