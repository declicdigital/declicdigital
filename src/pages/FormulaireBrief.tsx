import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Plus, X, Upload, FileText, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  full_name: "", company: "", email: "", phone: "",
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
              ? "gradient-primary text-primary-foreground shadow-lg"
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
const FormulaireBrief = () => {
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

  const addTeamMember = () => setTeamMembers(prev => [...prev, { name: "", role: "", bio: "", photo: null }]);
  const removeTeamMember = (idx: number) => setTeamMembers(prev => prev.filter((_, i) => i !== idx));
  const updateTeamMember = (idx: number, field: keyof TeamMember, value: string | File | null) => {
    setTeamMembers(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

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
    setSending(true);
    try {
      const filePaths: string[] = [];
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const path = `${submissionId}/${file.name}`;
        const { error } = await supabase.storage.from("form-files").upload(path, file);
        if (!error) filePaths.push(path);
      }

      if (f.team_enabled && f.team_photos_enabled) {
        for (const member of teamMembers) {
          if (member.photo) {
            const path = `${submissionId}/equipe/${member.photo.name}`;
            const { error } = await supabase.storage.from("form-files").upload(path, member.photo);
            if (!error) filePaths.push(path);
          }
        }
      }

      const teamData = f.team_enabled
        ? teamMembers.map(m => ({ name: m.name, role: m.role, bio: m.bio, photo_name: m.photo?.name || "" }))
        : [];

      // Save as form submission only (no account creation)
      await supabase.from("form_submissions").insert({
        data: { ...f, team: teamData, file_paths: filePaths, submission_id: submissionId, source: "brief-externe" } as any,
        file_paths: filePaths,
        status: "nouveau",
      });

      setSent(true);
      toast({ title: "Formulaire envoye !", description: "Nous reviendrons vers vous rapidement." });
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Une erreur est survenue, veuillez reessayer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-elevated">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4">C'est envoyé !</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Nous avons bien reçu votre projet et reviendrons vers vous avec une proposition personnalisée.
          </p>
          <Button onClick={() => { setSent(false); setF(initial); setFiles([]); }} variant="outline" className="rounded-full">
            Envoyer un autre brief
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress floating bubble */}
      <div className="fixed bottom-8 right-8 z-50 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-primary shadow-elevated cursor-default">
        <span className="text-lg font-black text-primary-foreground leading-none">{pct}%</span>
        <span className="text-[8px] font-bold text-primary-foreground/80 uppercase tracking-wider">complet</span>
      </div>

      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
              Formulaire de brief
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              Parlez-nous de votre projet web
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Quelques minutes de votre temps pour que nous vous préparions une proposition sur mesure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border py-3">
        <div className="container">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Progression</span>
            <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">{pct}%</span>
          </div>
          <div className="h-[3px] rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-16 md:py-24">
        <div className="container">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">

            {/* 1. PROFIL */}
            <SectionCard num="01" title="Votre profil" sub="Pour mieux vous connaître">
              <div className="space-y-5">
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Prénom & nom <span className="text-destructive">*</span></Label>
                    <Input value={f.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Marie Dupont" className="rounded-xl" required />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Entreprise / marque <span className="text-destructive">*</span></Label>
                    <Input value={f.company} onChange={e => set("company", e.target.value)} placeholder="Mon Entreprise" className="rounded-xl" required />
                  </div>
                </FieldGroup>
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Email <span className="text-destructive">*</span></Label>
                    <Input type="email" value={f.email} onChange={e => set("email", e.target.value)} placeholder="vous@entreprise.fr" className="rounded-xl" required />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Telephone</Label>
                    <Input type="tel" value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="06 00 00 00 00" className="rounded-xl" />
                  </div>
                </FieldGroup>
                <FieldGroup cols={2}>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Secteur d'activité <span className="text-destructive">*</span></Label>
                    <select value={f.sector} onChange={e => set("sector", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                      <option value="">Sélectionner…</option>
                      {["Artisan / métier de bouche","BTP / Travaux","Commerce & distribution","E-commerce","Restauration / Hôtellerie","Santé / Bien-être / Beauté","Services aux entreprises (B2B)","Services aux particuliers","Professionnel libéral","Immobilier","Éducation / Formation","Autre"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Taille de l'entreprise</Label>
                    <select value={f.size} onChange={e => set("size", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="">Sélectionner…</option>
                      {["Auto-entrepreneur","1 à 5 salariés","6 à 20 salariés","21 à 50 salariés","Plus de 50"].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </FieldGroup>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Site web actuel (si existant)</Label>
                  <Input type="url" value={f.current_url} onChange={e => set("current_url", e.target.value)} placeholder="https://..." className="rounded-xl" />
                </div>
              </div>
            </SectionCard>

            {/* 2. PROJET */}
            <SectionCard num="02" title="Votre projet" sub="Décrivez ce que vous recherchez">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Type de projet <span className="text-destructive">*</span></Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Site vitrine","Site e-commerce","Refonte de site","Landing page","Blog / portfolio","Application web","Autre"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.pt.includes(v)} onChange={() => toggleArr("pt", v)} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Description du projet <span className="text-destructive">*</span></Label>
                  <Textarea value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Décrivez votre projet en quelques lignes..." className="rounded-xl min-h-[100px]" required />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Sites d'inspiration</Label>
                  <Textarea value={f.inspo} onChange={e => set("inspo", e.target.value)} placeholder="Listez les URLs de sites que vous aimez..." className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Mots-clés cibles</Label>
                  <Input value={f.kw} onChange={e => set("kw", e.target.value)} placeholder="Ex : plombier Paris, création site web..." className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Objectif principal</Label>
                  <select value={f.goal} onChange={e => set("goal", e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Sélectionner…</option>
                    {["Générer des demandes de devis","Vendre en ligne","Présenter mon activité","Développer ma notoriété","Informer / éduquer","Autre"].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            </SectionCard>

            {/* 3. BUDGET */}
            <SectionCard num="03" title="Budget & objectifs" sub="Pour calibrer notre proposition" accent="accent">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Budget envisagé</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Moins de 500€","500 à 1 500€","1 500 à 3 000€","3 000 à 5 000€","Plus de 5 000€","A définir ensemble"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.budget === v} onChange={() => set("budget", v)} type="radio" accent />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Budget mensuel récurrent ?</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Non","Oui, moins de 100€/mois","Oui, 100 à 300€/mois","Oui, plus de 300€/mois"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.recur === v} onChange={() => set("recur", v)} type="radio" accent />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Niveau d'urgence</Label>
                  <ScaleButtons value={f.urgency} onChange={v => set("urgency", v)} leftLabel="Pas pressé" rightLabel="Très urgent" />
                </div>
              </div>
            </SectionCard>

            {/* 4. CONTENU & DESIGN */}
            <SectionCard num="04" title="Contenu & design" sub="Pour préparer les visuels et le contenu">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Avez-vous déjà une identité visuelle ?</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Oui, complète (logo, couleurs, typo)","Partiellement (juste un logo)","Non, à créer","Je ne sais pas"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.brand === v} onChange={() => set("brand", v)} type="radio" />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Contenu disponible</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Textes rédigés","Photos professionnelles","Logo en HD","Vidéos","Rien, à produire"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.cont.includes(v)} onChange={() => toggleArr("cont", v)} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Nombre de pages estimé</Label>
                  <Input value={f.pages} onChange={e => set("pages", e.target.value)} placeholder="Ex : 5 à 10 pages" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Fonctionnalités souhaitées</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Formulaire de contact","Blog","Galerie photo","Prise de RDV en ligne","Avis clients","Chat en direct","Espace membres","Paiement en ligne","Multilingue","Autre"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.feat.includes(v)} onChange={() => toggleArr("feat", v)} />
                    ))}
                  </div>
                  {f.feat.includes("Autre") && (
                    <Input value={f.feat_autre_detail} onChange={e => set("feat_autre_detail", e.target.value)} placeholder="Précisez..." className="rounded-xl mt-3" />
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Ambiance / style</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Moderne & épuré","Coloré & dynamique","Élégant & premium","Naturel & chaleureux","Professionnel & corporate","Créatif & décalé"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.vibe === v} onChange={() => set("vibe", v)} type="radio" />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 5. EQUIPE */}
            <SectionCard num="05" title="Votre équipe" sub="Si vous souhaitez présenter votre équipe sur le site">
              <div className="space-y-5">
                <ChoiceItem label="Je souhaite présenter mon équipe sur le site" checked={f.team_enabled} onChange={() => set("team_enabled", !f.team_enabled)} />
                {f.team_enabled && (
                  <>
                    <ChoiceItem label="Avec photos de chaque membre" checked={f.team_photos_enabled} onChange={() => set("team_photos_enabled", !f.team_photos_enabled)} />
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="rounded-xl border border-border p-5 space-y-3 bg-background">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">Membre {idx + 1}</span>
                          {teamMembers.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeTeamMember(idx)} className="text-destructive h-7 px-2">
                              <Trash2 className="h-3.5 w-3.5 mr-1" /> Retirer
                            </Button>
                          )}
                        </div>
                        <FieldGroup cols={2}>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Nom</Label>
                            <Input value={member.name} onChange={e => updateTeamMember(idx, "name", e.target.value)} placeholder="Prénom Nom" className="rounded-lg h-9 text-sm" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Rôle / poste</Label>
                            <Input value={member.role} onChange={e => updateTeamMember(idx, "role", e.target.value)} placeholder="Ex : Directrice" className="rounded-lg h-9 text-sm" />
                          </div>
                        </FieldGroup>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Bio courte</Label>
                          <Textarea value={member.bio} onChange={e => updateTeamMember(idx, "bio", e.target.value)} placeholder="Quelques mots..." className="rounded-lg text-sm min-h-[60px]" />
                        </div>
                        {f.team_photos_enabled && (
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">Photo</Label>
                            {member.photo ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-primary">{member.photo.name}</span>
                                <Button type="button" variant="ghost" size="sm" onClick={() => updateTeamMember(idx, "photo", null)} className="h-6 px-1"><X className="h-3 w-3" /></Button>
                              </div>
                            ) : (
                              <>
                                <Button type="button" variant="outline" size="sm" onClick={() => teamPhotoRefs.current[idx]?.click()} className="h-8 text-xs">
                                  <Upload className="h-3 w-3 mr-1" /> Choisir
                                </Button>
                                <input
                                  ref={el => { teamPhotoRefs.current[idx] = el; }}
                                  type="file" accept="image/*" className="hidden"
                                  onChange={e => { if (e.target.files?.[0]) updateTeamMember(idx, "photo", e.target.files[0]); }}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addTeamMember} className="rounded-full">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter un membre
                    </Button>
                  </>
                )}
              </div>
            </SectionCard>

            {/* 6. DELAIS */}
            <SectionCard num="06" title="Délais & disponibilité" sub="Pour planifier le projet">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Date de livraison souhaitée</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Le plus vite possible","Dans 1 mois","Dans 2-3 mois","Pas de date précise"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.dl === v} onChange={() => set("dl", v)} type="radio" />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Date clé / événement ?</Label>
                  <Input value={f.kdate} onChange={e => set("kdate", e.target.value)} placeholder="Ex : Salon professionnel le 15 juin" className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Niveau d'autonomie web</Label>
                  <ScaleButtons value={f.wlevel} onChange={v => set("wlevel", v)} leftLabel="Débutant" rightLabel="Expert" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Créneau de disponibilité préféré</Label>
                  <Input value={f.slot} onChange={e => set("slot", e.target.value)} placeholder="Ex : Mardi et jeudi après-midi" className="rounded-xl" />
                </div>
              </div>
            </SectionCard>

            {/* 7. MESSAGE */}
            <SectionCard num="07" title="Message libre" sub="Ajoutez tout ce qui vous semble important">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Votre message</Label>
                  <Textarea value={f.msg} onChange={e => set("msg", e.target.value)} placeholder="Questions, remarques, idées..." className="rounded-xl min-h-[100px]" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Code postal</Label>
                  <Input value={f.cp} onChange={e => set("cp", e.target.value)} placeholder="75015" className="rounded-xl" />
                </div>
              </div>
            </SectionCard>

            {/* 8. FICHIERS */}
            <SectionCard num="08" title="Fichiers & ressources" sub="Joignez vos documents existants" accent="gradient">
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Type de fichiers</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Logo","Charte graphique","Textes","Photos","Cahier des charges","Maquettes","Autre"].map(v => (
                      <ChoiceItem key={v} label={v} checked={f.ftype.includes(v)} onChange={() => toggleArr("ftype", v)} accent />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Lien vers vos fichiers</Label>
                  <Input value={f.file_link} onChange={e => set("file_link", e.target.value)} placeholder="Lien Google Drive, Dropbox..." className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Notes sur les fichiers</Label>
                  <Textarea value={f.file_notes} onChange={e => set("file_notes", e.target.value)} placeholder="Précisions sur les fichiers fournis..." className="rounded-xl" />
                </div>

                <div
                  className="relative rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Glissez vos fichiers ici ou <span className="text-primary font-semibold underline">parcourez</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Max 10 Mo par fichier</p>
                  <input ref={fileRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{(file.size / 1024 / 1024).toFixed(1)} Mo</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeFile(idx)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center pt-4"
            >
              <Button type="submit" size="lg" disabled={sending} className="rounded-full px-12 py-6 text-lg font-bold bg-primary text-primary-foreground shadow-elevated hover:opacity-90">
                {sending ? <><span className="animate-spin mr-2">⏳</span> Envoi en cours...</> : <><Send className="mr-2 h-5 w-5" /> Envoyer mon brief</>}
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Vos données sont sécurisées et traitées conformément au RGPD.
              </p>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormulaireBrief;
