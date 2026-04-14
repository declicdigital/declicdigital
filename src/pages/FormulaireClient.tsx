import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Send, Shield, CheckCircle, Plus, X, Upload, FileText, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImage, UPLOAD_OPTIONS } from "@/lib/imageCompression";

/* ───── types ───── */
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: File | null;
}

interface FormData {
  full_name: string;
  company: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  sector: string;
  size: string;
  current_url: string;
  source: string;
  pt: string[];
  desc: string;
  inspo: string;
  kw: string;
  goal: string;
  csrc: string[];
  budget: string;
  recur: string;
  urgency: string;
  brand: string;
  cont: string[];
  pages: string;
  feat: string[];
  feat_autre_detail: string;
  vibe: string;
  team_enabled: boolean;
  team_photos_enabled: boolean;
  dl: string;
  kdate: string;
  auto: string;
  wlevel: string;
  past: string;
  pastissue: string;
  msg: string;
  cp: string;
  slot: string;
  ftype: string[];
  file_link: string;
  file_notes: string;
}

const initial: FormData = {
  full_name: "", company: "", email: "", phone: "", password: "", password_confirm: "",
  sector: "", size: "",
  current_url: "", source: "", pt: [], desc: "", inspo: "", kw: "", goal: "",
  csrc: [], budget: "", recur: "", urgency: "", brand: "", cont: [], pages: "",
  feat: [], feat_autre_detail: "", vibe: "",
  team_enabled: false, team_photos_enabled: false,
  dl: "", kdate: "", auto: "",
  wlevel: "", past: "", pastissue: "", msg: "", cp: "", slot: "", ftype: [],
  file_link: "", file_notes: "",
};

/* ───── helpers ───── */
const SectionCard = ({ num, title, sub, accent = "primary", children }: {
  num: string; title: string; sub: string; accent?: "primary" | "accent" | "gradient"; children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5 }}
    className="relative rounded-2xl border border-border bg-card p-8 md:p-10 shadow-card overflow-hidden"
  >
    <div className={`absolute top-0 left-10 h-[3px] w-12 rounded-b ${
      accent === "accent" ? "bg-accent" : accent === "gradient" ? "gradient-miami" : "bg-primary"
    }`} />
    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${
        accent === "accent" ? "bg-accent/10 text-accent border border-accent/20" : "bg-primary/10 text-primary border border-primary/20"
      }`}>
        {num}
      </div>
      <div>
        <h2 className="text-lg font-extrabold">{title}</h2>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const ChoiceItem = ({ checked, onChange, label, type = "checkbox", accent = false }: {
  checked: boolean; onChange: () => void; label: string; type?: "checkbox" | "radio"; accent?: boolean;
}) => (
  <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm ${
    checked
      ? accent
        ? "bg-accent/10 border-accent/40 text-accent font-medium"
        : "bg-primary/10 border-primary/40 text-primary font-medium"
      : "border-border hover:bg-primary/5 hover:border-primary/20 text-muted-foreground"
  }`}>
    <input
      type={type}
      checked={checked}
      onChange={onChange}
      className="accent-primary w-4 h-4 shrink-0"
    />
    <span>{label}</span>
  </label>
);

const ScaleButtons = ({ value, onChange, leftLabel, rightLabel }: {
  value: string; onChange: (v: string) => void; leftLabel: string; rightLabel: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-muted-foreground italic hidden sm:block">{leftLabel}</span>
    <div className="flex gap-2 flex-1">
      {["1", "2", "3", "4", "5"].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 h-10 rounded-lg font-bold text-sm transition-all ${
            value === v
              ? "gradient-primary text-white shadow-glow"
              : "border border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
    <span className="text-xs text-muted-foreground italic hidden sm:block">{rightLabel}</span>
  </div>
);

const FieldGroup = ({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 }) => (
  <div className={cols === 2 ? "grid gap-5 sm:grid-cols-2" : "space-y-0"}>
    {children}
  </div>
);

/* ───── MAIN ───── */
const FormulaireClient = () => {
  const [f, setF] = useState<FormData>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", role: "", bio: "", photo: null }]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const teamPhotoRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setF(prev => ({ ...prev, [k]: v }));
  const toggleArr = (k: keyof FormData, v: string) => {
    const arr = f[k] as string[];
    set(k, (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]) as any);
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const valid = Array.from(newFiles).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  // Team members
  const addTeamMember = () => setTeamMembers(prev => [...prev, { name: "", role: "", bio: "", photo: null }]);
  const removeTeamMember = (idx: number) => setTeamMembers(prev => prev.filter((_, i) => i !== idx));
  const updateTeamMember = (idx: number, field: keyof TeamMember, value: string | File | null) => {
    setTeamMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  // Progress
  const FIELDS: (keyof FormData)[] = [
    "full_name","company","email","phone","sector","size","current_url","source",
    "pt","desc","inspo","kw","goal","csrc","budget","recur","urgency",
    "brand","cont","pages","feat","vibe","dl","kdate","auto","wlevel","past","pastissue",
    "msg","cp","slot","ftype","file_link","file_notes",
  ];
  const answered = FIELDS.filter(k => {
    const v = f[k];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" && v.trim() !== "";
  }).length;
  const pct = Math.round((answered / FIELDS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.email.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir au moins votre nom et email.", variant: "destructive" });
      return;
    }
    if (!f.password || f.password.length < 6) {
      toast({ title: "Mot de passe requis", description: "Le mot de passe doit contenir au moins 6 caracteres.", variant: "destructive" });
      return;
    }
    if (f.password !== f.password_confirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      // Upload files
      const filePaths: string[] = [];
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const compressed = file.type.startsWith("image/") ? await compressImage(file) : file;
        const path = `${submissionId}/${compressed.name}`;
        const { error } = await supabase.storage.from("form-files").upload(path, compressed, UPLOAD_OPTIONS);
        if (!error) filePaths.push(path);
      }

      // Upload team photos
      if (f.team_enabled && f.team_photos_enabled) {
        for (const member of teamMembers) {
          if (member.photo) {
            const compressed = await compressImage(member.photo);
            const path = `${submissionId}/equipe/${compressed.name}`;
            const { error } = await supabase.storage.from("form-files").upload(path, compressed, UPLOAD_OPTIONS);
            if (!error) filePaths.push(path);
          }
        }
      }

      // Prepare team data (without File objects)
      const teamData = f.team_enabled
        ? teamMembers.map(m => ({ name: m.name, role: m.role, bio: m.bio, photo_name: m.photo?.name || "" }))
        : [];

      // Send to edge function (creates account + saves form + generates PDF)
      const { data: result, error } = await supabase.functions.invoke("send-form", {
        body: { ...f, form_type: "formulaire", password: f.password, team: teamData, file_paths: filePaths, submission_id: submissionId },
      });

      if (error) throw error;
      setSent(true);
      toast({ title: "Formulaire envoye !", description: "Votre espace client a ete cree. Connectez-vous avec votre email et mot de passe." });
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Une erreur est survenue, veuillez reessayer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <PageLayout>
        <section className="py-24 md:py-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-lg text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-miami shadow-elevated">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-extrabold mb-4">C'est envoye !</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Declic Digital a bien recu votre projet et reviendra vers vous avec une proposition personnalisee.
              </p>
              <p className="text-foreground font-medium mb-8">
                Votre espace client a ete cree. Connectez-vous pour suivre l'avancement de votre projet.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.href = "/connexion"} className="rounded-full gradient-primary btn-glow text-white">
                  Acceder a mon espace client
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="outline" className="rounded-full">
                  Retour a l'accueil
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Progress floating bubble */}
      <div className="fixed bottom-8 right-8 z-50 flex h-16 w-16 flex-col items-center justify-center rounded-full gradient-miami shadow-elevated cursor-default">
        <span className="text-lg font-black text-primary-foreground leading-none">{pct}%</span>
        <span className="text-[8px] font-bold text-primary-foreground/80 uppercase tracking-wider">complet</span>
      </div>

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-xs font-semibold text-accent uppercase tracking-wider mb-6">
              Formulaire de brief client
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              Parlez-nous de votre <span className="text-gradient">projet web</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Quelques minutes de votre temps pour que Déclic Digital vous prépare une proposition sur mesure.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Votre profil", "Votre projet", "Objectifs & budget", "Contenu & design", "L'équipe", "Délais", "Message", "Fichiers"].map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-secondary border border-border px-4 py-2 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress bar */}
      <div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur border-b border-border py-3">
        <div className="container">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1 text-[11px] font-semibold uppercase tracking-wider">
              {["Profil", "Projet", "Objectifs", "Design", "Équipe", "Délais", "Message", "Fichiers"].map((s, i) => (
                <span key={i} className={pct >= ((i + 1) / 8) * 100 ? "text-accent" : pct >= (i / 8) * 100 ? "text-primary" : "text-muted-foreground/50"}>
                  {s}&nbsp;
                </span>
              ))}
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">{pct}%</span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div className="h-full gradient-miami rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="py-16 md:py-24">
        <div className="container">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">

          {/* 1. PROFIL */}
          <SectionCard num="01" title="Votre profil" sub="Pour mieux vous connaître avant de travailler ensemble">
            <div className="space-y-5">
              <FieldGroup cols={2}>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Prénom & nom <span className="text-accent">*</span></Label>
                  <Input value={f.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Marie Dupont" className="rounded-xl" required />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Entreprise / marque <span className="text-accent">*</span></Label>
                  <Input value={f.company} onChange={e => set("company", e.target.value)} placeholder="Boulangerie Le Fournil" className="rounded-xl" required />
                </div>
              </FieldGroup>
              <FieldGroup cols={2}>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Email professionnel <span className="text-accent">*</span></Label>
                  <Input type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="vous@entreprise.fr" className="rounded-xl" required />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Telephone</Label>
                  <Input type="tel" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="06 00 00 00 00" className="rounded-xl" />
                </div>
              </FieldGroup>
              <FieldGroup cols={2}>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Mot de passe <span className="text-accent">*</span></Label>
                  <Input type="password" value={f.password} onChange={e => set("password", e.target.value)} placeholder="Min. 6 caracteres" className="rounded-xl" required minLength={6} />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Confirmer le mot de passe <span className="text-accent">*</span></Label>
                  <Input type="password" value={f.password_confirm} onChange={e => set("password_confirm", e.target.value)} placeholder="Retapez votre mot de passe" className="rounded-xl" required minLength={6} />
                </div>
              </FieldGroup>
              <p className="text-xs text-muted-foreground">Ce mot de passe vous permettra d'acceder a votre espace client pour suivre l'avancement de votre projet.</p>
              <FieldGroup cols={2}>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Secteur d'activité <span className="text-accent">*</span></Label>
                  <select value={f.sector} onChange={e => set("sector", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                    <option value="">Sélectionner…</option>
                    {["Artisan / métier de bouche","BTP / Travaux","Commerce & distribution","E-commerce","Restauration / Hôtellerie","Santé / Bien-être / Beauté","Services aux entreprises (B2B)","Services aux particuliers","Professionnel libéral","Immobilier","Éducation / Formation","Autre"].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Taille de votre structure</Label>
                  <select value={f.size} onChange={e => set("size", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Sélectionner…</option>
                    {["Indépendant / Auto-entrepreneur","2 à 5 collaborateurs","6 à 20 collaborateurs","21 à 50 collaborateurs","50+"].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </FieldGroup>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Site actuel (si existant)</Label>
                <Input type="url" value={f.current_url} onChange={e => set("current_url", e.target.value)} placeholder="https://www.votresite.fr" className="rounded-xl" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Comment nous avez-vous trouvés ?</Label>
                <select value={f.source} onChange={e => set("source", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Sélectionner…</option>
                  {["Google","Réseaux sociaux","Bouche à oreille","Publicité en ligne","Autre"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* 2. PROJET */}
          <SectionCard num="02" title="Votre projet" sub="Ce que vous souhaitez créer ou améliorer" accent="accent">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Type de projet <span className="text-accent">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["vitrine","Site vitrine"],["ecom","Boutique e-commerce"],["refonte","Refonte de site"],
                    ["landing","Landing page"],["seo","SEO uniquement"],["audit","Audit SEO"],
                    ["blog","Blog / Actualités"],["nsp","Je ne sais pas encore"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} checked={f.pt.includes(v)} onChange={() => toggleArr("pt", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Décrivez votre projet <span className="text-accent">*</span>
                  <span className="block text-xs text-muted-foreground/70 mt-1">Quel problème doit résoudre votre site ? Quels résultats attendez-vous ?</span>
                </Label>
                <Textarea value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Ex : Je suis plombier à Lyon, mon site ne génère aucun appel..." className="rounded-xl" rows={5} />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Sites qui vous inspirent
                  <span className="block text-xs text-muted-foreground/70 mt-1">URLs de sites que vous aimez</span>
                </Label>
                <Textarea value={f.inspo} onChange={e => set("inspo", e.target.value)} placeholder="https://site1.com : j'aime leur page d'accueil" className="rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Mots-clés Google visés
                  <span className="block text-xs text-muted-foreground/70 mt-1">Les recherches sur lesquelles vous voulez apparaître</span>
                </Label>
                <Textarea value={f.kw} onChange={e => set("kw", e.target.value)} placeholder='"plombier urgence Lyon", "boulangerie artisanale Paris 15e"…' className="rounded-xl" rows={3} />
              </div>
            </div>
          </SectionCard>

          {/* 3. OBJECTIFS & BUDGET */}
          <SectionCard num="03" title="Objectifs & budget" sub="Pour calibrer notre proposition au plus juste" accent="gradient">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Objectif principal <span className="text-accent">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["leads","Générer des prospects"],["ventes","Vendre en ligne"],["visibilite","Visibilité Google"],
                    ["credibilite","Gagner en crédibilité"],["recruter","Recruter"],["informer","Informer mes clients"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.goal === v} onChange={() => set("goal", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Comment vos clients vous trouvent-ils aujourd'hui ?</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["bouche","Bouche-à-oreille"],["google","Google"],["reseaux","Réseaux sociaux"],
                    ["ads","Publicité payante"],["annuaires","Annuaires"],["physique","Présence physique"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} checked={f.csrc.includes(v)} onChange={() => toggleArr("csrc", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Budget envisagé <span className="text-accent">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["<500","Moins de 500 €"],["500-1k","500 – 1 000 €"],["1k-2k","1 000 – 2 000 €"],
                    [">2k","Plus de 2 000 €"],["nsp","À définir ensemble"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.budget === v} onChange={() => set("budget", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Accompagnement sur la durée ?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["maint","Maintenance mensuelle"],["seo_m","Suivi SEO mensuel"],
                    ["ponct","Projet ponctuel"],["nsp","À voir ensemble"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.recur === v} onChange={() => set("recur", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Niveau d'urgence (1 = pas urgent · 5 = très urgent)</Label>
                <ScaleButtons value={f.urgency} onChange={v => set("urgency", v)} leftLabel="Pas urgent" rightLabel="Très urgent" />
              </div>
            </div>
          </SectionCard>

          {/* 4. CONTENU & DESIGN */}
          <SectionCard num="04" title="Contenu & design" sub="Pour préparer la conception graphique et éditoriale">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Identité visuelle existante ?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["complet","Logo + charte complète"],["logo","Logo seulement"],
                    ["rien","🆕 Tout est à créer"],["refaire","À refaire"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.brand === v} onChange={() => set("brand", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Contenu déjà disponible ?</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["textes","Textes rédigés"],["photos_pro","Photos pro"],["photos_perso","Mes propres photos"],
                    ["videos","Vidéos"],["rien","Rien de prêt"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} checked={f.cont.includes(v)} onChange={() => toggleArr("cont", v)} label={l} accent />
                  ))}
                </div>
                <div className="flex items-start gap-2 mt-3 rounded-xl bg-primary/5 border border-primary/15 p-3 text-sm text-primary">
                  <span>💡</span> Pas de contenu ? Pas de problème, nous gérons la rédaction SEO et la sélection d'images.
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Nombre de pages estimé</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["1-5","1 à 5 pages"],["5-10","5 à 10 pages"],["10-20","10 à 20 pages"],
                    ["20+","20+ pages"],["nsp","Je ne sais pas"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.pages === v} onChange={() => set("pages", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Fonctionnalités souhaitées</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["contact","Formulaire contact"],["rdv","Prise de RDV"],["paiement","Paiement en ligne"],
                    ["blog","Blog / actualités"],["maps","Carte Google Maps"],["chat","Chat en ligne"],
                    ["multilingue","Multilingue"],["membre","Espace membre"],["galerie","Galerie / Portfolio"],
                    ["popup","Pop-up / email"],["avis","Avis clients"],["autre","Autre"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} checked={f.feat.includes(v)} onChange={() => toggleArr("feat", v)} label={l} />
                  ))}
                </div>
                {f.feat.includes("autre") && (
                  <Input value={f.feat_autre_detail} onChange={e => set("feat_autre_detail", e.target.value)} placeholder="Précisez la fonctionnalité souhaitée…" className="rounded-xl mt-3" />
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Ambiance visuelle recherchée
                  <span className="block text-xs text-muted-foreground/70 mt-1">Style, couleurs, ce que vous voulez dégager</span>
                </Label>
                <Textarea value={f.vibe} onChange={e => set("vibe", e.target.value)} placeholder="Ex : Moderne et rassurant, tons bleus et blancs, sobre et professionnel…" className="rounded-xl" rows={3} />
              </div>
            </div>
          </SectionCard>

          {/* 5. L'ÉQUIPE */}
          <SectionCard num="05" title="L'équipe" sub="Présentez les membres clés de votre entreprise" accent="accent">
            <div className="space-y-5">
              <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm ${
                f.team_enabled
                  ? "bg-primary/10 border-primary/40 text-primary font-medium"
                  : "border-border hover:bg-primary/5 hover:border-primary/20 text-muted-foreground"
              }`}>
                <input
                  type="checkbox"
                  checked={f.team_enabled}
                  onChange={() => set("team_enabled", !f.team_enabled)}
                  className="accent-primary w-4 h-4 shrink-0"
                />
                <span>Souhaite mettre en avant l'équipe</span>
              </label>

              <div className={`space-y-5 transition-opacity ${f.team_enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>

                {f.team_enabled && (
                  <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all text-sm ${
                    f.team_photos_enabled
                      ? "bg-accent/10 border-accent/40 text-accent font-medium"
                      : "border-border hover:bg-primary/5 hover:border-primary/20 text-muted-foreground"
                  }`}>
                    <input
                      type="checkbox"
                      checked={f.team_photos_enabled}
                      onChange={() => set("team_photos_enabled", !f.team_photos_enabled)}
                      className="accent-primary w-4 h-4 shrink-0"
                    />
                    <span>Souhaite partager les photos de l'équipe</span>
                  </label>
                )}

                {teamMembers.map((member, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-secondary/30 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">Membre {idx + 1}</span>
                      </div>
                      {teamMembers.length > 1 && (
                        <button type="button" onClick={() => removeTeamMember(idx)} className="text-accent hover:text-accent/80 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Nom complet</Label>
                        <Input
                          value={member.name}
                          onChange={e => updateTeamMember(idx, "name", e.target.value)}
                          placeholder="Prénom Nom"
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Fonction dans l'entreprise</Label>
                        <Input
                          value={member.role}
                          onChange={e => updateTeamMember(idx, "role", e.target.value)}
                          placeholder="Ex : Fondateur, Responsable commercial…"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Courte présentation</Label>
                      <Textarea
                        value={member.bio}
                        onChange={e => updateTeamMember(idx, "bio", e.target.value)}
                        placeholder="Quelques lignes sur cette personne, son parcours, son expertise…"
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>
                    {f.team_photos_enabled && (
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Photo (JPG ou PNG)</Label>
                        <input
                          ref={el => { teamPhotoRefs.current[idx] = el; }}
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            updateTeamMember(idx, "photo", file);
                            e.target.value = "";
                          }}
                        />
                        {member.photo ? (
                          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="truncate max-w-[180px]">{member.photo.name}</span>
                            <span className="text-muted-foreground">({Math.round(member.photo.size / 1024)} Ko)</span>
                            <button type="button" onClick={() => updateTeamMember(idx, "photo", null)} className="ml-auto text-accent hover:text-accent/80">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => teamPhotoRefs.current[idx]?.click()}
                            className="rounded-lg"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choisir une photo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTeamMember}
                  className="rounded-lg w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un membre
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* 6. DÉLAIS */}
          <SectionCard num="06" title="Délais & organisation" sub="Pour planifier votre projet sereinement" accent="accent">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Quand souhaitez-vous lancer ? <span className="text-accent">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["asap","Le plus tôt possible"],["1m","Dans 1 mois"],["3m","Dans 2 à 3 mois"],
                    ["6m","Dans 3 à 6 mois"],["flex","Pas de date précise"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.dl === v} onChange={() => set("dl", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Contrainte ou date clé ?
                  <span className="block text-xs text-muted-foreground/70 mt-1">Ouverture, saison, lancement produit, événement…</span>
                </Label>
                <Input value={f.kdate} onChange={e => set("kdate", e.target.value)} placeholder="Ex : Ouverture de mon restaurant le 15 septembre" className="rounded-xl" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Autonomie souhaitée après livraison</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["seul","Je gère tout seul"],["basic","Mises à jour basiques"],
                    ["vous","Vous gérez tout"],["form","Avec formation incluse"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.auto === v} onChange={() => set("auto", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Votre niveau web & SEO (1 = débutant · 5 = expert)</Label>
                <ScaleButtons value={f.wlevel} onChange={v => set("wlevel", v)} leftLabel="Débutant" rightLabel="Expert" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Expérience avec une agence ou un freelance ?</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["bien","Oui, bonne exp."],["mal","Oui, mauvaise exp."],["non","🆕 Première fois"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} type="radio" checked={f.past === v} onChange={() => set("past", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Si mauvaise expérience, que s'est-il passé ?
                  <span className="block text-xs text-muted-foreground/70 mt-1">Cela nous aide à faire mieux</span>
                </Label>
                <Textarea value={f.pastissue} onChange={e => set("pastissue", e.target.value)} placeholder="Ex : Délais non respectés, résultat décevant…" className="rounded-xl" rows={3} />
              </div>
            </div>
          </SectionCard>

          {/* 7. MESSAGE LIBRE */}
          <SectionCard num="07" title="Message libre" sub="Tout ce que vous n'avez pas pu dire ailleurs" accent="gradient">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Question, précision, contexte particulier ?</Label>
                <Textarea value={f.msg} onChange={e => set("msg", e.target.value)} placeholder="Ajoutez tout ce qui vous semble important…" className="rounded-xl" rows={5} />
              </div>
              <FieldGroup cols={2}>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Canal de contact préféré</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[["email","Email"],["tel","Téléphone"],["visio","Visio"],["wa","WhatsApp"]].map(([v, l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.cp === v} onChange={() => set("cp", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Créneau préféré</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[["mat","Matin"],["am","Après-midi"],["soir","Soir"],["indif","Indifférent"]].map(([v, l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.slot === v} onChange={() => set("slot", v)} label={l} />
                    ))}
                  </div>
                </div>
              </FieldGroup>
            </div>
          </SectionCard>

          {/* 8. FICHIERS */}
          <SectionCard num="08" title="Fichiers & visuels" sub="Partagez vos ressources existantes" accent="accent">
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-3 block">Types de fichiers à transmettre
                  <span className="block text-xs text-muted-foreground/70 mt-1">Cochez ce que vous avez déjà</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ["logo","Logo"],["photos_lieu","Photos du lieu / locaux"],["photos_equipe","Photos équipe"],
                    ["charte","Charte graphique"],["textes","Textes / documents Word"],["videos","Vidéos"],
                    ["plaquette","Plaquettes commerciales"],["produits","Fiches produits"],["rien","Je n'ai rien encore"],
                  ].map(([v, l]) => (
                    <ChoiceItem key={v} checked={f.ftype.includes(v)} onChange={() => toggleArr("ftype", v)} label={l} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Déposez vos fichiers
                  <span className="block text-xs text-muted-foreground/70 mt-1">JPG, PNG, PDF, SVG, MP4, DOCX - 10 Mo max par fichier</span>
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.svg,.docx,.doc,.mp4,.mov"
                  className="hidden"
                  onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                />
                <div
                  className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-primary", "bg-primary/5"); }}
                  onDragLeave={e => { e.currentTarget.classList.remove("border-primary", "bg-primary/5"); }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-primary", "bg-primary/5"); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
                >
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Glissez vos fichiers ici ou</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="rounded-lg">
                    Parcourir mes fichiers
                  </Button>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {files.map((file, idx) => (
                      <div key={idx} className="relative flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <span className="text-muted-foreground">({Math.round(file.size / 1024)} Ko)</span>
                        <button type="button" onClick={() => removeFile(idx)} className="ml-1 text-accent hover:text-accent/80">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Lien de partage (Google Drive, Dropbox, WeTransfer…)
                  <span className="block text-xs text-muted-foreground/70 mt-1">Si vous préférez partager via un lien externe</span>
                </Label>
                <Input type="url" value={f.file_link} onChange={e => set("file_link", e.target.value)} placeholder="https://drive.google.com/..." className="rounded-xl" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Précisions sur les fichiers</Label>
                <Textarea value={f.file_notes} onChange={e => set("file_notes", e.target.value)} placeholder="Ex : Le logo est disponible en version fond blanc et fond noir…" className="rounded-xl" rows={3} />
              </div>
            </div>
          </SectionCard>

          {/* SUBMIT */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-border bg-card p-10 md:p-14 text-center shadow-card overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Réponse sous 24 à 48h</p>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
                Prêt(e) à faire <span className="text-gradient">décoller votre site ?</span>
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Déclic Digital analysera votre situation et reviendra vers vous avec une proposition personnalisée.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="rounded-full gradient-primary btn-glow text-white font-bold text-base px-10 py-6 shadow-elevated hover:opacity-90 transition-opacity"
              >
                <Send className="h-5 w-5 mr-2" />
                {sending ? "Envoi en cours…" : "Envoyer mon projet à Déclic Digital"}
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Données confidentielles</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary" /> Aucun engagement</span>
                <span className="flex items-center gap-1.5"><Plus className="h-4 w-4 text-primary" /> Réponse rapide</span>
              </div>
            </div>
          </motion.div>
        </form>
        </div>
      </section>
    </PageLayout>
  );
};

export default FormulaireClient;
