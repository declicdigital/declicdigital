import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Send, Shield, CheckCircle, Plus, X, Upload, FileText, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMember { name: string; role: string; bio: string; photo: File | null; }

interface FormData {
  full_name: string; company: string; email: string; phone: string;
  sector: string; size: string; current_url: string; source: string;
  pt: string[]; desc: string; inspo: string; kw: string; goal: string;
  csrc: string[]; budget: string; recur: string; urgency: string;
  brand: string; cont: string[]; pages: string; feat: string[];
  feat_autre_detail: string; vibe: string; team_enabled: boolean;
  team_photos_enabled: boolean; dl: string; kdate: string; auto: string;
  wlevel: string; past: string; pastissue: string; msg: string; cp: string;
  slot: string; ftype: string[]; file_link: string; file_notes: string;
}

const initial: FormData = {
  full_name: "", company: "", email: "", phone: "",
  sector: "", size: "", current_url: "", source: "", pt: [], desc: "",
  inspo: "", kw: "", goal: "", csrc: [], budget: "", recur: "", urgency: "",
  brand: "", cont: [], pages: "", feat: [], feat_autre_detail: "", vibe: "",
  team_enabled: false, team_photos_enabled: false, dl: "", kdate: "", auto: "",
  wlevel: "", past: "", pastissue: "", msg: "", cp: "", slot: "", ftype: [],
  file_link: "", file_notes: "",
};

const HERO_STEP_LABELS = ["Votre profil", "Votre projet", "Objectifs & budget", "Contenu & design", "L'équipe", "Délais", "Message", "Fichiers"];
const STEP_LABELS_COMPACT = ["Profil", "Projet", "Objectifs", "Design", "Équipe", "Délais", "Message", "Fichiers"];

const BREVO_API_KEY = "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";

const sendBrevoEmail = async (to: { email: string; name: string }, subject: string, htmlContent: string) => {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Déclic Digital", email: "contact@declicdigital.net" },
      to: [to],
      subject,
      htmlContent,
    }),
  });
};

const SectionCard = ({ num, title, sub, accent = "primary", children }: {
  num: string; title: string; sub: string; accent?: "primary" | "accent" | "gradient"; children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "200px 0px -20px 0px" }} transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8 md:p-10"
  >
    <div className={`absolute top-0 left-10 h-[3px] w-12 rounded-b ${accent === "accent" ? "bg-accent" : accent === "gradient" ? "gradient-miami" : "bg-primary"}`} />
    <div className="mb-8 flex items-start gap-4 border-b border-border pb-6 sm:items-center">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${accent === "accent" ? "border border-accent/20 bg-accent/10 text-accent" : "border border-primary/20 bg-primary/10 text-primary"}`}>
        {num}
      </div>
      <div className="min-w-0">
        <h2 className="break-words text-lg font-extrabold leading-tight">{title}</h2>
        <p className="break-words text-sm leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const ChoiceItem = ({ checked, onChange, label, type = "checkbox", accent = false }: {
  checked: boolean; onChange: () => void; label: string; type?: "checkbox" | "radio"; accent?: boolean;
}) => (
  <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-snug transition-all ${checked ? accent ? "border-accent/40 bg-accent/10 font-medium text-accent" : "border-primary/40 bg-primary/10 font-medium text-primary" : "border-border text-muted-foreground hover:border-primary/20 hover:bg-primary/5"}`}>
    <input type={type} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
    <span className="min-w-0 break-normal text-left">{label}</span>
  </label>
);

const ScaleButtons = ({ value, onChange, leftLabel, rightLabel }: {
  value: string; onChange: (v: string) => void; leftLabel: string; rightLabel: string;
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
    <span className="hidden text-xs italic text-muted-foreground sm:block">{leftLabel}</span>
    <div className="flex flex-1 gap-2">
      {["1", "2", "3", "4", "5"].map(v => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`h-10 flex-1 rounded-lg text-sm font-bold transition-all ${value === v ? "gradient-primary text-white shadow-glow" : "border border-border text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"}`}>
          {v}
        </button>
      ))}
    </div>
    <span className="hidden text-xs italic text-muted-foreground sm:block">{rightLabel}</span>
  </div>
);

const FieldGroup = ({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 }) => (
  <div className={cols === 2 ? "grid gap-5 sm:grid-cols-2" : "space-y-0"}>{children}</div>
);

const FormulaireClient = () => {
  const [f, setF] = useState<FormData>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", role: "", bio: "", photo: null }]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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

  const addTeamMember = () => setTeamMembers(prev => [...prev, { name: "", role: "", bio: "", photo: null }]);
  const removeTeamMember = (idx: number) => setTeamMembers(prev => prev.filter((_, i) => i !== idx));
  const updateTeamMember = (idx: number, field: keyof TeamMember, value: string | File | null) => {
    setTeamMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const FIELDS: (keyof FormData)[] = ["full_name","company","email","phone","sector","size","current_url","source","pt","desc","inspo","kw","goal","csrc","budget","recur","urgency","brand","cont","pages","feat","vibe","dl","kdate","auto","wlevel","past","pastissue","msg","cp","slot","ftype","file_link","file_notes"];
  const answered = FIELDS.filter(k => { const v = f[k]; if (Array.isArray(v)) return v.length > 0; return typeof v === "string" && v.trim() !== ""; }).length;
  const pct = Math.round((answered / FIELDS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.email.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir au moins votre nom et email.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      // 1. Upload fichiers dans Supabase Storage
      const filePaths: string[] = [];
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const path = `${submissionId}/${file.name}`;
        const { error } = await supabase.storage.from("form-files").upload(path, file);
        if (!error) filePaths.push(path);
      }

      const teamData = f.team_enabled
        ? teamMembers.map(m => ({ name: m.name, role: m.role, bio: m.bio, photo_name: m.photo?.name || "" }))
        : [];

      // 2. INSERT dans brief_submissions
      await supabase.from("brief_submissions").insert({
        full_name: f.full_name, company: f.company, email: f.email, phone: f.phone,
        sector: f.sector, size: f.size, current_url: f.current_url, source: f.source,
        project_types: f.pt, description: f.desc, inspiration: f.inspo, keywords: f.kw,
        goal: f.goal, acquisition_sources: f.csrc, budget: f.budget, recurrence: f.recur,
        urgency: f.urgency, brand: f.brand, content_available: f.cont, pages_count: f.pages,
        features: f.feat, features_other: f.feat_autre_detail, vibe: f.vibe,
        team_enabled: f.team_enabled, team_data: teamData, deadline: f.dl, key_date: f.kdate,
        autonomy: f.auto, web_level: f.wlevel, past_experience: f.past, past_issue: f.pastissue,
        message: f.msg || f.desc, contact_pref: f.cp, time_slot: f.slot, file_types: f.ftype,
        file_link: f.file_link, file_notes: f.file_notes, file_paths: filePaths,
        submission_id: submissionId, status: "new",
      });

      // 3. Email de confirmation au prospect
      await sendBrevoEmail(
        { email: f.email, name: f.full_name },
        "Brief reçu — Déclic Digital vous répond sous 24-48h",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4fc3c3, #9b59b6); padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Brief bien reçu ! 🎉</h1>
          </div>
          <p style="color: #333; font-size: 16px;">Bonjour <strong>${f.full_name}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">Merci pour votre brief. Nous l'avons bien reçu et nous vous répondrons sous 24 à 48h avec une proposition personnalisée.</p>
          <p style="color: #999; font-size: 13px; text-align: center; margin-top: 32px;">Déclic Digital — declicdigital.net</p>
        </div>
        `
      );

      // 4. Notification à Geoffrey
      await sendBrevoEmail(
        { email: "contact@declicdigital.net", name: "Geoffrey" },
        `🆕 Nouveau brief — ${f.full_name} (${f.company || f.email})`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4fc3c3, #9b59b6); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 20px;">🆕 Nouveau brief client</h1>
          </div>
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666; width: 140px;">Nom</td><td style="font-weight: bold;">${f.full_name}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Email</td><td><a href="mailto:${f.email}" style="color: #4fc3c3;">${f.email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Téléphone</td><td>${f.phone || "—"}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Entreprise</td><td>${f.company || "—"}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Secteur</td><td>${f.sector || "—"}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Budget</td><td>${f.budget || "—"}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Type de site</td><td>${f.pt.join(", ") || "—"}</td></tr>
              ${f.current_url ? `<tr><td style="padding: 6px 0; color: #666;">Site actuel</td><td><a href="${f.current_url}" style="color: #4fc3c3;">${f.current_url}</a></td></tr>` : ""}
            </table>
          </div>
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px;">
            <h3 style="margin: 0 0 8px; color: #333; font-size: 15px;">Description du projet</h3>
            <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${f.desc || f.msg || "—"}</p>
          </div>
          ${f.msg ? `
          <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-top: 16px;">
            <h3 style="margin: 0 0 8px; color: #333; font-size: 15px;">Message libre</h3>
            <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${f.msg}</p>
          </div>` : ""}
        </div>
        `
      );

      setSent(true);
      toast({ title: "Brief envoyé !", description: "Nous reviendrons vers vous sous 24-48h." });
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Une erreur est survenue, veuillez réessayer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <PageLayout>
        <section className="py-24 md:py-32">
          <div className="container">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-miami shadow-elevated">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-extrabold mb-4">Brief reçu ! 🎉</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Nous avons bien reçu votre brief et vous répondrons sous 24 à 48h avec une proposition personnalisée.
              </p>
              <p className="text-foreground font-medium mb-8">
                Un email de confirmation vous sera envoyé à <strong>{f.email}</strong>.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={() => window.location.href = "/"} className="rounded-full gradient-primary btn-glow text-white">
                  Retour à l'accueil →
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
      <div className="fixed bottom-8 right-8 z-50 hidden h-16 w-16 flex-col items-center justify-center rounded-full gradient-miami shadow-elevated cursor-default md:flex">
        <span className="text-lg font-black text-primary-foreground leading-none">{pct}%</span>
        <span className="text-[8px] font-bold text-primary-foreground/80 uppercase tracking-wider">complet</span>
      </div>

      <section className="gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Formulaire de brief client
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              Parlez-nous de votre <span className="text-gradient">projet web</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Quelques minutes de votre temps pour que Déclic Digital vous prépare une proposition sur mesure.
            </p>
            <div className="hidden flex-wrap justify-center gap-3 md:flex">
              {HERO_STEP_LABELS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-[80px] z-40 bg-background/95 backdrop-blur border-b border-border py-3">
        <div className="container">
          <div className="mb-2 flex items-center justify-between">
            <div className="hidden flex-wrap gap-x-2 text-[11px] font-semibold uppercase tracking-wide sm:flex">
              {STEP_LABELS_COMPACT.map((s, i) => (
                <span key={i} className={pct >= ((i + 1) / 8) * 100 ? "text-accent" : pct >= (i / 8) * 100 ? "text-primary" : "text-muted-foreground/50"}>{s}</span>
              ))}
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">{pct}%</span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div className="h-full gradient-miami rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">

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
                    <Label className="text-sm text-muted-foreground mb-2 block">Téléphone</Label>
                    <Input type="tel" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="06 00 00 00 00" className="rounded-xl" />
                  </div>
                </FieldGroup>
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Secteur d'activité <span className="text-accent">*</span></Label>
                    <select value={f.sector} onChange={e => set("sector", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                      <option value="">Sélectionnez…</option>
                      {["Commerce & distribution","Services aux entreprises (B2B)","Services aux particuliers (B2C)","Santé & bien-être","Restauration & hôtellerie","Artisanat & BTP","Immobilier","Éducation & formation","Culture & divertissement","Sport & loisirs","Tech & numérique","Mode & beauté","Autre"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Taille de l'entreprise</Label>
                    <select value={f.size} onChange={e => set("size", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Sélectionnez…</option>
                      {["Indépendant / Auto-entrepreneur","2 à 5 collaborateurs","6 à 20 collaborateurs","21 à 50 collaborateurs","Plus de 50 collaborateurs"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </FieldGroup>
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Site web actuel (si existant)</Label>
                    <Input type="url" value={f.current_url} onChange={e => set("current_url", e.target.value)} placeholder="https://monsite.fr" className="rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Comment avez-vous connu Déclic Digital ?</Label>
                    <select value={f.source} onChange={e => set("source", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Sélectionnez…</option>
                      {[["google","Google / Recherche"],["reseaux","Réseaux sociaux"],["bouche","Bouche à oreille"],["evenement","Événement / Salon"],["Autre","Autre"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </FieldGroup>
              </div>
            </SectionCard>

            <SectionCard num="02" title="Votre projet" sub="Décrivez ce que vous souhaitez créer ou améliorer" accent="accent">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Type de site souhaité</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["vitrine","Site vitrine"],["ecommerce","E-commerce"],["landing","Landing page"],["blog","Blog / portfolio"],["seo","Site + SEO"],["app","Application web"]].map(([v,l]) => (
                      <ChoiceItem key={v} checked={f.pt.includes(v)} onChange={() => toggleArr("pt", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Description du projet <span className="text-accent">*</span></Label>
                  <Textarea value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Décrivez votre activité, vos clients cibles, ce que vous attendez du site…" className="rounded-xl" rows={5} required />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Sites d'inspiration</Label>
                  <Textarea value={f.inspo} onChange={e => set("inspo", e.target.value)} placeholder="https://exemple.com — J'aime le design épuré…" className="rounded-xl" rows={3} />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Mots-clés SEO ciblés</Label>
                  <Textarea value={f.kw} onChange={e => set("kw", e.target.value)} placeholder="plombier Paris, dépannage urgent 75…" className="rounded-xl" rows={3} />
                </div>
              </div>
            </SectionCard>

            <SectionCard num="03" title="Objectifs & budget" sub="Pour calibrer la solution la plus adaptée">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Objectif principal</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["leads","Générer des leads"],["ventes","Vendre en ligne"],["credibilite","Renforcer la crédibilité"],["recrutement","Recruter"],["notoriete","Développer la notoriété"],["autre","Autre"]].map(([v,l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.goal === v} onChange={() => set("goal", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Canal d'acquisition principal</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["seo","SEO / Google"],["reseaux","Réseaux sociaux"],["bouche","Bouche à oreille"],["pub","Publicité payante"],["email","Email marketing"],["autre","Autre"]].map(([v,l]) => (
                      <ChoiceItem key={v} checked={f.csrc.includes(v)} onChange={() => toggleArr("csrc", v)} label={l} />
                    ))}
                  </div>
                </div>
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Budget estimé</Label>
                    <select value={f.budget} onChange={e => set("budget", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Sélectionnez…</option>
                      {[["<500","Moins de 500€"],["500-1000","500€ – 1 000€"],["1000-2500","1 000€ – 2 500€"],["2500-5000","2 500€ – 5 000€"],[">5000","Plus de 5 000€"],["nsp","Je ne sais pas encore"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Récurrence souhaitée</Label>
                    <select value={f.recur} onChange={e => set("recur", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Sélectionnez…</option>
                      {[["one","Mission ponctuelle"],["mensuel","Accompagnement mensuel"],["nsp","Je ne sais pas encore"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </FieldGroup>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Degré d'urgence (1 = pas urgent · 5 = très urgent)</Label>
                  <ScaleButtons value={f.urgency} onChange={v => set("urgency", v)} leftLabel="Pas urgent" rightLabel="Très urgent" />
                </div>
              </div>
            </SectionCard>

            <SectionCard num="04" title="Contenu & design" sub="Ce que vous avez déjà, ce que vous souhaitez">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Charte graphique</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[["complet","Charte complète"],["logo","Logo uniquement"],["rien","Rien encore"]].map(([v,l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.brand === v} onChange={() => set("brand", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Contenu disponible</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["textes","Textes rédigés"],["photos_perso","Photos personnelles"],["photos_pro","Photos professionnelles"],["videos","Vidéos"],["logo","Logo"],["rien","Rien encore"]].map(([v,l]) => (
                      <ChoiceItem key={v} checked={f.cont.includes(v)} onChange={() => toggleArr("cont", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Nombre de pages estimé</Label>
                  <select value={f.pages} onChange={e => set("pages", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Sélectionnez…</option>
                    {[["1-5","1 à 5 pages"],["6-10","6 à 10 pages"],["11-20","11 à 20 pages"],[">20","Plus de 20 pages"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Fonctionnalités souhaitées</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["contact","Formulaire de contact"],["rdv","Prise de RDV en ligne"],["blog","Blog"],["galerie","Galerie photos/vidéos"],["avis","Avis clients"],["paiement","Paiement en ligne"],["multi","Multilingue"],["chat","Chat / messagerie"],["autre","Autre"]].map(([v,l]) => (
                      <ChoiceItem key={v} checked={f.feat.includes(v)} onChange={() => toggleArr("feat", v)} label={l} />
                    ))}
                  </div>
                </div>
                {f.feat.includes("autre") && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Précisez la fonctionnalité "Autre"</Label>
                    <Input value={f.feat_autre_detail} onChange={e => set("feat_autre_detail", e.target.value)} placeholder="Ex : CMS, espace membre, carte interactive…" className="rounded-xl" />
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Ambiance visuelle souhaitée</Label>
                  <Textarea value={f.vibe} onChange={e => set("vibe", e.target.value)} placeholder="Moderne, épuré, coloré, luxueux, chaleureux… décrivez l'atmosphère voulue" className="rounded-xl" rows={3} />
                </div>
              </div>
            </SectionCard>

            <SectionCard num="05" title="L'équipe" sub="Présentez les personnes à mettre en avant (optionnel)" accent="accent">
              <div className="space-y-5">
                <ChoiceItem checked={f.team_enabled} onChange={() => set("team_enabled", !f.team_enabled)} label="Je veux présenter mon équipe sur le site" />
                {f.team_enabled && (
                  <div className="space-y-4">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="rounded-xl border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-primary" /> Membre {idx + 1}</div>
                          {teamMembers.length > 1 && (
                            <button type="button" onClick={() => removeTeamMember(idx)} className="text-accent hover:text-accent/80"><Trash2 className="h-4 w-4" /></button>
                          )}
                        </div>
                        <FieldGroup cols={2}>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Nom</Label>
                            <Input value={member.name} onChange={e => updateTeamMember(idx, "name", e.target.value)} placeholder="Jean Dupont" className="rounded-xl" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Rôle / poste</Label>
                            <Input value={member.role} onChange={e => updateTeamMember(idx, "role", e.target.value)} placeholder="Fondateur, Directeur…" className="rounded-xl" />
                          </div>
                        </FieldGroup>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Bio courte</Label>
                          <Textarea value={member.bio} onChange={e => updateTeamMember(idx, "bio", e.target.value)} placeholder="Quelques mots sur cette personne…" className="rounded-xl" rows={2} />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addTeamMember} className="rounded-lg">
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un membre
                    </Button>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard num="06" title="Délais & contexte" sub="Pour planifier au mieux votre projet">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Délai souhaité</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[["asap","Dès que possible"],["1mois","Dans le mois"],["3mois","Sous 3 mois"],["flex","Flexible"]].map(([v,l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.dl === v} onChange={() => set("dl", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Date clé (lancement, événement…)</Label>
                  <Input value={f.kdate} onChange={e => set("kdate", e.target.value)} placeholder="Ex : Ouverture prévue le 1er juin" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Autonomie souhaitée après livraison</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[["seul","Je gère seul(e)"],["basic","Mises à jour basiques"],["full","Accompagnement complet"]].map(([v,l]) => (
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
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[["bien","Oui, bonne exp."],["mal","Oui, mauvaise exp."],["non","🆕 Première fois"]].map(([v,l]) => (
                      <ChoiceItem key={v} type="radio" checked={f.past === v} onChange={() => set("past", v)} label={l} />
                    ))}
                  </div>
                </div>
                {f.past === "mal" && (
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Que s'est-il passé ?</Label>
                    <Textarea value={f.pastissue} onChange={e => set("pastissue", e.target.value)} placeholder="Ex : Délais non respectés, résultat décevant…" className="rounded-xl" rows={3} />
                  </div>
                )}
              </div>
            </SectionCard>

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
                      {[["email","Email"],["tel","Téléphone"],["visio","Visio"],["wa","WhatsApp"]].map(([v,l]) => (
                        <ChoiceItem key={v} type="radio" checked={f.cp === v} onChange={() => set("cp", v)} label={l} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-3 block">Créneau préféré</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[["mat","Matin"],["am","Après-midi"],["soir","Soir"],["indif","Indifférent"]].map(([v,l]) => (
                        <ChoiceItem key={v} type="radio" checked={f.slot === v} onChange={() => set("slot", v)} label={l} />
                      ))}
                    </div>
                  </div>
                </FieldGroup>
              </div>
            </SectionCard>

            <SectionCard num="08" title="Fichiers & visuels" sub="Partagez vos ressources existantes" accent="accent">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Types de fichiers à transmettre</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[["logo","Logo"],["photos_lieu","Photos du lieu"],["photos_equipe","Photos équipe"],["charte","Charte graphique"],["textes","Textes / Word"],["videos","Vidéos"],["plaquette","Plaquettes"],["produits","Fiches produits"],["rien","Je n'ai rien encore"]].map(([v,l]) => (
                      <ChoiceItem key={v} checked={f.ftype.includes(v)} onChange={() => toggleArr("ftype", v)} label={l} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Déposez vos fichiers
                    <span className="block text-xs text-muted-foreground/70 mt-1">JPG, PNG, PDF, SVG, MP4, DOCX — 10 Mo max par fichier</span>
                  </Label>
                  <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.svg,.docx,.doc,.mp4,.mov" className="hidden"
                    onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
                  <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); }} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}>
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Glissez vos fichiers ici ou</p>
                    <Button type="button" variant="outline" size="sm" className="rounded-lg">Parcourir mes fichiers</Button>
                  </div>
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <span className="text-muted-foreground">({Math.round(file.size / 1024)} Ko)</span>
                          <button type="button" onClick={() => removeFile(idx)} className="ml-1 text-accent hover:text-accent/80"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Lien de partage (Drive, Dropbox, WeTransfer…)</Label>
                  <Input type="url" value={f.file_link} onChange={e => set("file_link", e.target.value)} placeholder="https://drive.google.com/..." className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Précisions sur les fichiers</Label>
                  <Textarea value={f.file_notes} onChange={e => set("file_notes", e.target.value)} placeholder="Ex : Le logo est disponible en version fond blanc et fond noir…" className="rounded-xl" rows={3} />
                </div>
              </div>
            </SectionCard>

            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-card sm:p-8 md:p-14">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Réponse sous 24 à 48h</p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
                  Prêt(e) à faire <span className="text-gradient">décoller votre site ?</span>
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Déclic Digital analysera votre situation et reviendra vers vous avec une proposition personnalisée.
                </p>
                <Button type="submit" size="lg" disabled={sending}
                  className="h-auto min-h-14 w-full max-w-full whitespace-normal break-normal rounded-full px-5 py-4 text-center text-base font-bold leading-tight text-white shadow-elevated transition-opacity hover:opacity-90 sm:w-auto sm:max-w-[32rem] sm:px-8 sm:py-5 gradient-primary btn-glow">
                  <Send className="mr-2 h-5 w-5 shrink-0 self-center" />
                  <span>{sending ? "Envoi en cours…" : "Envoyer mon brief"}</span>
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
