import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, Calendar, User, Building2, Mail, ChevronRight, Download, Copy, Check, Trash2, Clock, Eye, CheckCircle2, Search, ClipboardList, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// jsPDF loaded dynamically in downloadPdf()
import logoImg from "@/assets/logo-declic-digital-new.webp";
import AdminBar from "@/components/admin/AdminBar";

const generateBriefPrompt = (d: any): string => {
  const lines: string[] = [];
  lines.push(`Agis comme un directeur UX, copywriter senior, expert SEO et web designer. Tu dois créer un site web complet pour le client suivant.\n`);
  lines.push(`CLIENT`);
  if (d.company) lines.push(`Entreprise : ${d.company}`);
  if (d.email) lines.push(`Email : ${d.email}`);
  if (d.phone) lines.push(`Téléphone : ${d.phone}`);
  if (d.sector) lines.push(`Secteur d'activité : ${d.sector}`);
  lines.push('');
  const pt = Array.isArray(d.pt) ? d.pt.join(", ") : d.pt;
  if (pt) lines.push(`TYPE DE PROJET\n${pt}\n`);
  if (d.desc) lines.push(`DESCRIPTION DU PROJET\n${d.desc}\n`);
  if (d.goal) lines.push(`OBJECTIF PRINCIPAL\n${d.goal}\n`);
  if (d.kw) lines.push(`MOTS-CLES SEO CIBLES\nIntègre ces mots-clés dans la structure du site, les titres, le contenu et les meta descriptions :\n${d.kw}\n`);
  if (d.pages) lines.push(`NOMBRE DE PAGES SOUHAITE\n${d.pages}\n`);
  const feat = Array.isArray(d.feat) ? d.feat.join(", ") : d.feat;
  if (feat) {
    lines.push(`FONCTIONNALITES REQUISES`);
    lines.push(feat);
    if (d.feat_autre_detail) lines.push(`Détail supplémentaire : ${d.feat_autre_detail}`);
    lines.push('');
  }
  if (d.brand) lines.push(`IDENTITE VISUELLE EXISTANTE\n${d.brand}\n`);
  if (d.vibe) lines.push(`AMBIANCE VISUELLE SOUHAITEE\n${d.vibe}\n`);
  if (d.inspo) lines.push(`SITES D'INSPIRATION\nAnalyse ces sites et inspire-toi de leurs points forts :\n${d.inspo}\n`);
  const cont = Array.isArray(d.cont) ? d.cont.join(", ") : d.cont;
  if (cont) lines.push(`CONTENU DISPONIBLE\n${cont}\n`);
  if (d.msg) lines.push(`MESSAGE LIBRE DU CLIENT\n${d.msg}\n`);
  lines.push(`INSTRUCTIONS DE REALISATION`);
  lines.push(`- Le site doit être responsive mobile et desktop avec une UX moderne.`);
  lines.push(`- Optimisation SEO : structure logique, mots-clés intégrés, balises Hn cohérentes, meta descriptions.`);
  lines.push(`- Chaque section : titres H1/H2, paragraphes courts, bullet points, CTA visibles.`);
  lines.push(`- Design : professionnel, moderne, sections aérées, animations légères.`);
  lines.push(`- Conversion : CTA contrastés, parcours utilisateur fluide, formulaire de contact.`);
  lines.push(`- Le site doit inspirer confiance, expertise et professionnalisme.`);
  lines.push(`- Prends en compte TOUTES les informations ci-dessus sans rien oublier.`);
  return lines.join('\n');
};

interface Submission {
  id: string;
  created_at: string;
  data: any;
  file_paths: string[];
  status: string;
}

type StatusType = "en_attente" | "lu" | "termine";

const normalizeStatus = (status?: string): StatusType => {
  if (status === "lu" || status === "termine" || status === "en_attente") {
    return status;
  }
  return "en_attente";
};

type FormType = "formulaire" | "devis" | "audit";

const detectFormType = (data: any): FormType => {
  if (!data) return "devis";
  if (data.form_type === "audit") return "audit";
  if (data.form_type === "devis") return "devis";
  if (data.form_type === "formulaire") return "formulaire";
  // Auto-detect for existing submissions without form_type
  if (data.pt || data.budget || data.feat || data.brand || data.pages || data.desc?.length > 100) return "formulaire";
  if (data.current_url && !data.pt && !data.budget) return "audit";
  return "devis";
};

const FORM_TYPE_CONFIG: Record<FormType, { label: string; icon: any; color: string }> = {
  formulaire: { label: "Formulaire", icon: ClipboardList, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  devis: { label: "Devis", icon: MessageSquare, color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  audit: { label: "Audit SEO", icon: Search, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

const STATUS_CONFIG: Record<StatusType, { label: string; icon: any; color: string; badgeClass: string }> = {
  en_attente: { label: "En attente", icon: Clock, color: "text-amber-500", badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  lu: { label: "Lu", icon: Eye, color: "text-blue-500", badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  termine: { label: "Terminé", icon: CheckCircle2, color: "text-emerald-500", badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
};

const STATUSES: StatusType[] = ["en_attente", "lu", "termine"];

const ALL_FORM_KEYS = [
  "full_name", "company", "email", "phone", "sector", "size", "current_url", "source",
  "pt", "desc", "inspo", "kw", "goal", "csrc", "budget", "recur", "urgency",
  "brand", "cont", "pages", "feat", "feat_autre_detail", "vibe",
  "dl", "kdate", "auto", "wlevel", "past", "pastissue",
  "msg", "cp", "slot", "ftype", "file_link", "file_notes",
];

const getCompletionPercent = (data: any): number => {
  if (!data) return 0;
  const answered = ALL_FORM_KEYS.filter((k) => {
    const v = data[k];
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim().length > 0;
  }).length;
  return Math.round((answered / ALL_FORM_KEYS.length) * 100);
};

const FIELD_LABELS: Record<string, string> = {
  full_name: "Nom", company: "Entreprise", email: "Email", phone: "Téléphone",
  sector: "Secteur", size: "Taille", current_url: "Site actuel", source: "Source",
  pt: "Type de projet", desc: "Description", inspo: "Sites inspiration", kw: "Mots-clés",
  goal: "Objectif", csrc: "Sources clients", budget: "Budget", recur: "Accompagnement",
  urgency: "Urgence", brand: "Identité visuelle", cont: "Contenu disponible", pages: "Nombre de pages",
  feat: "Fonctionnalités", feat_autre_detail: "Fonctionnalité autre", vibe: "Ambiance visuelle",
  dl: "Délai", kdate: "Date clé", auto: "Autonomie", wlevel: "Niveau web", past: "Expérience passée",
  pastissue: "Problème passé", msg: "Message libre", cp: "Canal préféré", slot: "Créneau",
  ftype: "Types fichiers", file_link: "Lien fichiers", file_notes: "Notes fichiers",
};

const AdminSoumissions = () => {
  const navigate = useNavigate();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");
  const [filterType, setFilterType] = useState<FormType | "all">("all");

  const fetchSubs = async () => {
    try {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("fetchSubs error:", error);
      }
      setSubs((data as any) || []);
    } catch (err) {
      console.error("fetchSubs catch:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, []);

  const updateStatus = async (id: string, status: StatusType) => {
    await supabase.from("form_submissions").update({ status } as any).eq("id", id);
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
  };

  const deleteSub = async (id: string) => {
    if (!confirm("Supprimer cette soumission ? Cette action est irréversible.")) return;
    await supabase.from("form_submissions").delete().eq("id", id);
    setSubs((prev) => prev.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const getFileUrl = (path: string) => {
    const { data } = supabase.storage.from("form-files").getPublicUrl(path);
    return data.publicUrl;
  };

  const downloadSignedUrl = async (path: string) => {
    const { data } = await supabase.storage.from("form-files").createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const downloadPdf = async (sub: Submission) => {
    const d = sub.data;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const drawFooter = (pageNum: number) => {
      doc.setTextColor(160, 160, 170);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Déclic Digital - Fiche Client Confidentielle", margin, pageHeight - 8);
      doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    };

    let pageNum = 1;
    let y = 16;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 25, 35);
    doc.text("Fiche Client", margin, y);
    y += 8;

    const quickInfo: [string, string][] = [];
    if (d.full_name) quickInfo.push(["Nom", d.full_name]);
    if (d.company) quickInfo.push(["Entreprise", d.company]);
    const pt = Array.isArray(d.pt) ? d.pt.join(", ") : d.pt;
    if (pt) quickInfo.push(["Type de projet", pt]);
    const dateStr = new Date(sub.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    quickInfo.push(["Date", dateStr]);

    quickInfo.forEach(([label, value]) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 95);
      doc.text(label + " :", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(23, 25, 35);
      doc.text(value, margin + 36, y);
      y += 6;
    });

    y += 8;

    const checkNewPage = (needed: number) => {
      if (y + needed > pageHeight - 16) {
        drawFooter(pageNum);
        doc.addPage();
        pageNum++;
        y = 16;
      }
    };

    const sections: { title: string; keys: string[] }[] = [
      { title: "Votre profil", keys: ["full_name", "company", "email", "phone", "sector", "size", "current_url", "source"] },
      { title: "Votre projet", keys: ["pt", "desc", "inspo", "kw"] },
      { title: "Objectifs & budget", keys: ["goal", "csrc", "budget", "recur", "urgency"] },
      { title: "Contenu & design", keys: ["brand", "cont", "pages", "feat", "feat_autre_detail", "vibe"] },
      { title: "Délais & organisation", keys: ["dl", "kdate", "auto", "wlevel", "past", "pastissue"] },
      { title: "Message libre", keys: ["msg", "cp", "slot"] },
      { title: "Fichiers & visuels", keys: ["ftype", "file_link", "file_notes"] },
    ];

    sections.forEach((section) => {
      const entries = section.keys
        .filter((k) => d[k] && !(Array.isArray(d[k]) && d[k].length === 0) && !(typeof d[k] === "string" && !d[k].trim()))
        .map((k) => ({ key: k, label: FIELD_LABELS[k] || k, value: Array.isArray(d[k]) ? d[k].join(", ") : String(d[k]) }));
      if (entries.length === 0) return;

      checkNewPage(20);
      doc.setFillColor(14, 165, 233);
      doc.rect(margin, y, 3, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 25, 35);
      doc.text(section.title, margin + 7, y + 6);
      y += 14;

      entries.forEach(({ label, value }) => {
        const lines = doc.splitTextToSize(value, contentWidth - 58);
        const rowH = Math.max(lines.length * 4.5, 6) + 4;
        checkNewPage(rowH + 2);

        doc.setFillColor(248, 249, 252);
        doc.rect(margin, y - 3, contentWidth, rowH + 2, "F");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 95);
        doc.text(label, margin + 4, y + 1);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 40);
        doc.text(lines, margin + 54, y + 1);
        y += rowH + 1;
      });
      y += 6;
    });

    if (sub.file_paths && sub.file_paths.length > 0) {
      checkNewPage(20);
      doc.setFillColor(14, 165, 233);
      doc.rect(margin, y, 3, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 25, 35);
      doc.text("Fichiers joints", margin + 7, y + 6);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 40);
      sub.file_paths.forEach((p) => {
        checkNewPage(7);
        doc.text("• " + (p.split("/").pop() || p), margin + 6, y);
        y += 5;
      });
    }

    // Only include prompt section for "formulaire" type submissions
    if (detectFormType(d) === "formulaire") {
      y += 4;
      checkNewPage(30);
      doc.setFillColor(14, 165, 233);
      doc.rect(margin, y, 3, 8, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 25, 35);
      doc.text("Récap Brief Client (Prompt)", margin + 7, y + 6);
      y += 14;

      doc.setFillColor(245, 245, 248);
      const briefText = generateBriefPrompt(d);
      const briefLines = doc.splitTextToSize(briefText, contentWidth - 12);
      
      briefLines.forEach((line: string) => {
        checkNewPage(5);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 75);
        if (line === line.toUpperCase() && line.trim().length > 2 && !/^[-•]/.test(line)) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(23, 25, 35);
          doc.setFontSize(7.5);
        }
        doc.text(line, margin + 6, y);
        y += 3.8;
      });
    }

    drawFooter(pageNum);
    const name = (d.full_name || "soumission").replace(/\s+/g, "_");
    doc.save(`fiche_${name}.pdf`);
  };

  const filteredSubs = subs.filter((s) => {
    if (filterStatus !== "all" && normalizeStatus(s.status) !== filterStatus) return false;
    if (filterType !== "all" && detectFormType(s.data) !== filterType) return false;
    return true;
  });

  const statusCounts = {
    all: subs.length,
    en_attente: subs.filter((s) => normalizeStatus(s.status) === "en_attente").length,
    lu: subs.filter((s) => normalizeStatus(s.status) === "lu").length,
    termine: subs.filter((s) => normalizeStatus(s.status) === "termine").length,
  };

  const typeCounts = {
    all: subs.length,
    formulaire: subs.filter((s) => detectFormType(s.data) === "formulaire").length,
    devis: subs.filter((s) => detectFormType(s.data) === "devis").length,
    audit: subs.filter((s) => detectFormType(s.data) === "audit").length,
  };

  // ==================== DETAIL VIEW ====================
  if (selected) {
    const d = selected.data;
    const currentStatus = normalizeStatus(selected.status);
    const StatusIcon = STATUS_CONFIG[currentStatus].icon;

    return (
      <div className="min-h-screen bg-background">
        <AdminBar />
        <div className="border-b border-border bg-card">
          <div className="container py-3 md:py-4 space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="px-2" onClick={() => setSelected(null)}>← Retour</Button>
              <h1 className="text-base md:text-lg font-bold truncate">{d.full_name || "Inconnu"}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/30">
                {STATUSES.map((st) => {
                  const cfg = STATUS_CONFIG[st];
                  const Icon = cfg.icon;
                  const isActive = currentStatus === st;
                  return (
                    <button
                      key={st}
                      onClick={() => updateStatus(selected.id, st)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] md:text-xs font-medium transition-all ${
                        isActive ? cfg.badgeClass + " shadow-sm" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span className="hidden sm:inline">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => downloadPdf(selected)}>
                <Download className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
              <Button variant="destructive" size="sm" className="text-xs h-7 px-2" onClick={() => deleteSub(selected.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="container py-8 max-w-5xl">
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <div className="gradient-miami p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-primary-foreground">{d.full_name}</h2>
                    <p className="text-primary-foreground/80 text-xs md:text-sm">{d.company} · {d.email}</p>
                    <p className="text-primary-foreground/70 text-xs mt-1">{getCompletionPercent(d)}% des questions répondues</p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold self-start ${STATUS_CONFIG[currentStatus].badgeClass}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {STATUS_CONFIG[currentStatus].label}
                  </div>
                </div>
            </div>
            <div className="divide-y divide-border">
              {[
                { title: "Votre profil", keys: ["full_name", "company", "email", "phone", "sector", "size", "current_url", "source"] },
                { title: "Votre projet", keys: ["pt", "desc", "inspo", "kw"] },
                { title: "Objectifs & budget", keys: ["goal", "csrc", "budget", "recur", "urgency"] },
                { title: "Contenu & design", keys: ["brand", "cont", "pages", "feat", "feat_autre_detail", "vibe"] },
                { title: "Délais & organisation", keys: ["dl", "kdate", "auto", "wlevel", "past", "pastissue"] },
                { title: "Message libre", keys: ["msg", "cp", "slot"] },
                { title: "Fichiers & visuels", keys: ["ftype", "file_link", "file_notes"] },
              ].map((section) => {
                const entries = section.keys.filter((k) => d[k] && !(Array.isArray(d[k]) && d[k].length === 0) && !(typeof d[k] === "string" && !d[k].trim()));
                if (entries.length === 0) return null;
                const urlRegex = /(https?:\/\/[^\s,]+)/g;
                const renderValue = (text: string) => {
                  const parts = text.split(urlRegex);
                  return parts.map((part, i) =>
                    urlRegex.test(part) ? (
                      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">{part}</a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  );
                };
                return (
                  <div key={section.title}>
                    <div className="px-6 py-3 bg-muted/30 border-b border-border">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{section.title}</h3>
                    </div>
                    {entries.map((key) => {
                      const value = d[key];
                      const display = Array.isArray(value) ? value.join(", ") : String(value);
                      return (
                         <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-4 md:px-6 py-3 md:py-4">
                           <span className="text-xs md:text-sm font-semibold text-foreground sm:w-40 sm:shrink-0">{FIELD_LABELS[key] || key}</span>
                           <span className="text-xs md:text-sm text-muted-foreground whitespace-pre-wrap break-words min-w-0">{renderValue(display)}</span>
                         </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {selected.file_paths && selected.file_paths.length > 0 && (
              <div className="px-6 py-4 border-t border-border">
                <h3 className="text-sm font-semibold mb-3">Fichiers joints</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.file_paths.map((path, i) => (
                    <button
                      key={i}
                      onClick={() => downloadSignedUrl(path)}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs hover:bg-secondary transition-colors"
                    >
                      <Download className="h-3 w-3 text-primary" />
                      {path.split("/").pop()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brief Prompt Recap — only for "formulaire" type */}
            {detectFormType(selected.data) === "formulaire" && (
            <div className="border-t border-border">
              <div className="px-6 py-5 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Récap Brief Client (Prompt)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generateBriefPrompt(selected.data));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? "Copié !" : "Copier le prompt"}
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-background rounded-lg border border-border p-4 max-h-[500px] overflow-y-auto font-mono leading-relaxed">
                  {generateBriefPrompt(selected.data)}
                </pre>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
  return (
    <div className="min-h-screen bg-background">
      <AdminBar />
      <div className="border-b border-border bg-card">
        <div className="container flex h-[4.5rem] md:h-20 items-center justify-between">
          <div className="flex items-center gap-4 -my-2">
            <img src={logoImg} alt="Declic Digital" className="h-14 md:h-16 w-auto object-contain cursor-pointer" onClick={() => navigate("/admin/clients")} />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full hidden md:inline">ADMIN</span>
          </div>
          <div className="text-right">
            <h1 className="text-lg md:text-2xl font-extrabold">Soumissions</h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-0.5">{subs.length} soumission(s)</p>
          </div>
        </div>
      </div>
      <div className="container py-6 md:py-8 max-w-4xl">
        {/* Status filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {(["all", ...STATUSES] as const).map((st) => {
            const isAll = st === "all";
            const label = isAll ? "Toutes" : STATUS_CONFIG[st].label;
            const Icon = isAll ? FileText : STATUS_CONFIG[st].icon;
            const count = statusCounts[st];
            const isActive = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all border whitespace-nowrap shrink-0 ${
                  isActive
                    ? isAll
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : STATUS_CONFIG[st as StatusType].badgeClass + " shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-white/20" : "bg-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {(["all", "formulaire", "devis", "audit"] as const).map((ft) => {
            const isAll = ft === "all";
            const label = isAll ? "Toutes" : FORM_TYPE_CONFIG[ft].label;
            const Icon = isAll ? FileText : FORM_TYPE_CONFIG[ft].icon;
            const count = typeCounts[ft];
            const isActive = filterType === ft;
            return (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all border whitespace-nowrap shrink-0 ${
                  isActive
                    ? isAll
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : FORM_TYPE_CONFIG[ft as FormType].color + " shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-white/20" : "bg-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-16">Chargement…</div>
        ) : filteredSubs.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">Aucune soumission {filterStatus !== "all" ? `avec le statut "${STATUS_CONFIG[filterStatus as StatusType]?.label}"` : ""}</div>
        ) : (
          <div className="space-y-3">
            {filteredSubs.map((s, i) => {
              const status = normalizeStatus(s.status);
              const cfg = STATUS_CONFIG[status];
              const StatusIcon = cfg.icon;
              const formType = detectFormType(s.data);
              const ftCfg = FORM_TYPE_CONFIG[formType];
              const FtIcon = ftCfg.icon;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-card hover:shadow-elevated hover:border-primary/20 transition-all group cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
                      <FtIcon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">{s.data?.full_name || "Sans nom"}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 border ${ftCfg.color}`}>
                          <FtIcon className="h-3 w-3" />
                          {ftCfg.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 border ${cfg.badgeClass}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        {s.data?.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{s.data.company}</span>}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>
                        <span className="font-medium text-primary">{getCompletionPercent(s.data)}%</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSoumissions;
