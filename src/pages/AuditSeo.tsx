import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, FileText, Users, Lightbulb, CheckCircle } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import heroAudit from "@/assets/audit-seo-gratuit-site-web.webp";

const CONTACT_EMAIL = "contact@declicdigital.net";

const AuditSeo = () => {
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    current_url: "",
    email: "",
    phone: "",
    msg: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.current_url) return;
    const subject = encodeURIComponent(`Demande d'audit SEO gratuit - ${form.full_name}`);
    const body = encodeURIComponent(
      `Nom : ${form.full_name}\n` +
      `Entreprise : ${form.company || "—"}\n` +
      `URL du site : ${form.current_url}\n` +
      `Email : ${form.email}\n` +
      `Téléphone : ${form.phone || "—"}\n\n` +
      `Message :\n${form.msg || "—"}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Audit SEO gratuit de votre site web en 48h | Déclic Digital</title>
        <meta name="description" content="Demandez votre audit SEO gratuit : analyse technique, mots clés, concurrence et recommandations personnalisées. Résultats envoyés sous 48 heures." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/audit-seo-gratuit" />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"Service",serviceType:"Audit SEO gratuit",provider:{"@type":"LocalBusiness",name:"Déclic Digital",url:"https://declicdigital.net"},areaServed:"Île-de-France"})}</script>
      </Helmet>
      <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Référencement SEO", href: "/referencement-seo" }, { label: "Audit SEO gratuit" }]} />

      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                Audit SEO gratuit · Analyse complète de votre site
              </span>
              <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
                Audit SEO gratuit : analysez la visibilité Google de votre site en 48h
              </h1>
              <p className="mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Découvrez pourquoi votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link> n'apparaît pas sur Google et recevez des recommandations concrètes pour améliorer votre visibilité.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                <a href="#formulaire-audit">Demander mon audit SEO</a>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <img src={heroAudit} alt="Audit SEO gratuit pour site web TPE" className="w-full max-w-lg drop-shadow-2xl" width={512} height={512} loading="lazy" decoding="async" />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold md:text-4xl">Qu'est-ce qu'un audit SEO et à quoi ça sert ?</h2>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Notre audit SEO est une analyse approfondie de votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link>. Découvrez <Link to="/realisations" className="text-primary font-semibold hover:underline">nos réalisations</Link>.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, title: "Analyse SEO technique", desc: "Performance, vitesse de chargement, compatibilité mobile, architecture du site, erreurs d'indexation et sécurité HTTPS." },
            { icon: FileText, title: "Analyse des mots clés", desc: "Étude de votre positionnement actuel et identification des mots clés à fort potentiel pour votre activité." },
            { icon: Users, title: "Analyse concurrentielle", desc: "Comparaison avec vos concurrents directs pour identifier les stratégies qui fonctionnent dans votre secteur." },
            { icon: Lightbulb, title: "Recommandations concrètes", desc: "Plan d'action priorisé avec des actions précises à mettre en place pour améliorer votre visibilité rapidement." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-background p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-white">
                <item.icon size={26} />
              </div>
              <h3 className="mb-2 font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <GoogleReviewsSection compact maxReviews={3} />

      <SectionWrapper id="formulaire-audit">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-center text-3xl font-extrabold">Demandez votre audit maintenant : réponse en 48h</h2>
          <p className="text-center text-muted-foreground mb-8">
            Remplissez le formulaire ci-dessous et recevez votre audit SEO personnalisé sous 48 heures.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="full_name" placeholder="Votre nom" className="rounded-xl" required value={form.full_name} onChange={handleChange} />
            <Input name="company" placeholder="Nom de votre entreprise" className="rounded-xl" value={form.company} onChange={handleChange} />
            <Input name="current_url" placeholder="URL de votre site web" type="url" className="rounded-xl" required value={form.current_url} onChange={handleChange} />
            <Input name="email" placeholder="Votre email" type="email" className="rounded-xl" required value={form.email} onChange={handleChange} />
            <Input name="phone" placeholder="Votre téléphone (optionnel)" type="tel" className="rounded-xl" value={form.phone} onChange={handleChange} />
            <Textarea name="msg" placeholder="Votre message (optionnel)" className="rounded-xl min-h-[100px]" value={form.msg} onChange={handleChange} />
            <Button type="submit" variant="custom" size="lg" className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
              <CheckCircle size={18} className="mr-2" />
              Recevoir mon audit SEO gratuit
            </Button>
            <p className="text-xs text-muted-foreground text-center">Le formulaire ouvre votre logiciel email pré-rempli.</p>
          </form>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
};

export default AuditSeo;
