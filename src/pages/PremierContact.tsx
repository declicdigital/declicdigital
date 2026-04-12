import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RAISONS = ["Création de site", "SEO / GEO"];
const SOURCES = [
  "Recherche Google",
  "Réseaux sociaux",
  "Publicité",
  "Bouche à oreille",
  "IA",
];

const PremierContact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    entreprise: "",
    site_internet: "",
    raison: "",
    source: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.entreprise || !form.raison || !form.source) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-form", {
        body: {
          full_name: `${form.prenom} ${form.nom}`,
          company: form.entreprise,
          current_url: form.site_internet,
          source: form.source,
          pt: [form.raison],
          form_type: "premier_contact",
        },
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "Merci !", description: "Vos informations ont bien été envoyées." });
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue, réessayez.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-extrabold">Merci pour ces informations !</h1>
          <p className="text-muted-foreground">
            Nous avons bien reçu votre fiche. Notre équipe prendra connaissance de vos réponses avant le rendez-vous.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Premier contact | Déclic Digital</title>
        <meta name="description" content="Complétez vos informations suite à votre prise de rendez-vous avec Déclic Digital." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl border border-border bg-card shadow-card p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold">Une dernière étape !</h1>
              <p className="text-sm text-muted-foreground">
                Merci d'avoir réservé un créneau. Remplissez ces quelques informations pour que nous puissions préparer au mieux notre échange.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input id="nom" name="nom" value={form.nom} onChange={handleChange} required placeholder="Dupont" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} required placeholder="Jean" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="entreprise">Nom de l'entreprise *</Label>
                <Input id="entreprise" name="entreprise" value={form.entreprise} onChange={handleChange} required placeholder="Mon Entreprise" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="site_internet">Site internet (si existant)</Label>
                <Input id="site_internet" name="site_internet" value={form.site_internet} onChange={handleChange} placeholder="https://mon-site.fr" />
              </div>

              <div className="space-y-1.5">
                <Label>Raison du contact *</Label>
                <div className="flex flex-wrap gap-2">
                  {RAISONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, raison: r }))}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.raison === r
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Comment nous avez-vous connu ? *</Label>
                <div className="flex flex-wrap gap-2">
                  {SOURCES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, source: s }))}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.source === s
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background hover:bg-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Envoyer
              </Button>

              <p className="text-[11px] text-muted-foreground text-center">
                Tous les champs marqués d'un * sont obligatoires.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PremierContact;
