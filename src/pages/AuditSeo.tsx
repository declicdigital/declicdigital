import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, FileText, Users, Lightbulb, CheckCircle, Loader2 } from "lucide-react";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import heroAudit from "@/assets/audit-seo-gratuit-site-web.webp";

const SUPABASE_URL = "https://iskxljribvfypkyappku.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3hsanJpYnZmeXBreWFwcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjQ0MzMsImV4cCI6MjA5MjI0MDQzM30.OgWh7kKknHgdG4JMTFbNC_XdZhncnEqzJQA0GbRI_uY";

const AuditSeo = () => {
  const [form, setForm] = useState({
    full_name: "", company: "", current_url: "", email: "", phone: "", msg: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.current_url) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": ANON_KEY,
          "Authorization": `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ ...form, form_type: "audit" }),
      });

      if (!res.ok) throw new Error("Erreur envoi");
      setSent(true);
      setForm({ full_name: "", company: "", current_url: "", email: "", phone: "", msg: "" });
    } catch {
      setError("Une erreur est survenue. Réessayez ou contactez-nous directement.");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Audit SEO gratuit de votre site web en 48h | Déclic Digital</title>
        <meta name="description" content="Demandez votre audit SEO gratuit : analyse technique, mots clés, concurrence et recommandations personnalisées. Résultats envoyés sous 48 heures." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://declicdigital.net/audit-seo-gratuit" />
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
                Découvrez pourquoi votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link> n'apparaît pas sur Google et recevez des recommandations concrètes.
              </p>
              <Button asChild variant="custom" size="lg" className="gradient-primary btn-glow rounded-full px-8 text-white font-semibold shadow-glow">
                <a href="#formulaire-audit">Demander mon audit SEO</a>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <img src={heroAudit} alt="Audit SEO gratuit" className="w-full max-w-lg drop-shadow-2xl" width={512} height={512} loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold md:text-4xl">Qu'est-ce qu'un audit SEO ?</h2>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Notre audit SEO est une analyse approfondie de votre <Link to="/creation-site-web" className="text-primary font-semibold hover:underline">site web</Link>.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, title: "Analyse SEO technique", desc: "Performance, vitesse, compatibilité mobile, architecture, erreurs d'indexation." },
            { icon: FileText, title: "Analyse des mots clés", desc: "Positionnement actuel et identification des mots clés à fort potentiel." },
            { icon: Users, title: "Analyse concurrentielle", desc: "Comparaison avec vos concurrents directs pour identifier les stratégies gagnantes." },
            { icon: Lightbulb, title: "Recommandations concrètes", desc: "Plan d'action priorisé avec des actions précises à mettre en place." },
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
          <h2 className="mb-4 text-center text-3xl font-extrabold">Demandez votre audit : réponse en 48h</h2>
          <p className="text-center text-muted-foreground mb-8">
            Remplissez le formulaire et recevez votre audit SEO personnalisé sous 48 heures.
          </p>

          {sent ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Demande envoyée !</h3>
              <p className="text-muted-foreground">Nous analyserons votre site et vous enverrons l'audit sous 48h.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input name="full_name" placeholder="Votre nom" className="rounded-xl" required value={form.full_name} onChange={handleChange} />
              <Input name="company" placeholder="Nom de votre entreprise" className="rounded-xl" value={form.company} onChange={handleChange} />
              <Input name="current_url" placeholder="URL de votre site web" type="url" className="rounded-xl" required value={form.current_url} onChange={handleChange} />
              <Input name="email" placeholder="Votre email" type="email" className="rounded-xl" required value={form.email} onChange={handleChange} />
              <Input name="phone" placeholder="Votre téléphone (optionnel)" type="tel" className="rounded-xl" value={form.phone} onChange={handleChange} />
              <Textarea name="msg" placeholder="Votre message (optionnel)" className="rounded-xl min-h-[100px]" value={form.msg} onChange={handleChange} />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" variant="custom" size="lg" disabled={sending}
                className="w-full gradient-primary btn-glow rounded-full text-white font-semibold shadow-glow">
                {sending ? <Loader2 size={18} className="mr-2 animate-spin" /> : <CheckCircle size={18} className="mr-2" />}
                {sending ? "Envoi en cours..." : "Recevoir mon audit SEO gratuit"}
              </Button>
            </form>
          )}
        </div>
      </SectionWrapper>
    </PageLayout>
  );
};

export default AuditSeo;
