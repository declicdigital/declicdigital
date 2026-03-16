import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Calendar, User, Building2, Mail, ChevronRight, Download, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import logoSrc from "@/assets/logo-declic-digital.png";

const generateBriefPrompt = (d: any): string => {
  const lines: string[] = [];

  lines.push(`Agis comme un directeur UX, copywriter senior, expert SEO et web designer. Tu dois créer un site web complet pour le client suivant.\n`);

  // Client info
  lines.push(`CLIENT`);
  if (d.full_name) lines.push(`Nom : ${d.full_name}`);
  if (d.company) lines.push(`Entreprise : ${d.company}`);
  if (d.email) lines.push(`Email : ${d.email}`);
  if (d.phone) lines.push(`Téléphone : ${d.phone}`);
  if (d.sector) lines.push(`Secteur d'activité : ${d.sector}`);
  if (d.size) lines.push(`Taille de l'entreprise : ${d.size}`);
  if (d.current_url) lines.push(`Site actuel : ${d.current_url}`);
  lines.push('');

  // Project type
  const pt = Array.isArray(d.pt) ? d.pt.join(", ") : d.pt;
  if (pt) lines.push(`TYPE DE PROJET\n${pt}\n`);

  // Description
  if (d.desc) lines.push(`DESCRIPTION DU PROJET\n${d.desc}\n`);

  // Objectives
  if (d.goal) lines.push(`OBJECTIF PRINCIPAL\n${d.goal}\n`);

  // Target audience / client sources
  const csrc = Array.isArray(d.csrc) ? d.csrc.join(", ") : d.csrc;
  if (csrc) lines.push(`SOURCES DE CLIENTS ACTUELLES\n${csrc}\n`);

  // SEO & Keywords
  if (d.kw) lines.push(`MOTS-CLES SEO CIBLES\nIntègre ces mots-clés dans la structure du site, les titres, le contenu et les meta descriptions :\n${d.kw}\n`);

  // Pages
  if (d.pages) lines.push(`NOMBRE DE PAGES SOUHAITE\n${d.pages}\n`);

  // Features
  const feat = Array.isArray(d.feat) ? d.feat.join(", ") : d.feat;
  if (feat) {
    lines.push(`FONCTIONNALITES REQUISES`);
    lines.push(feat);
    if (d.feat_autre_detail) lines.push(`Détail supplémentaire : ${d.feat_autre_detail}`);
    lines.push('');
  }

  // Visual identity & branding
  if (d.brand) lines.push(`IDENTITE VISUELLE EXISTANTE\n${d.brand}\n`);
  if (d.vibe) lines.push(`AMBIANCE VISUELLE SOUHAITEE\n${d.vibe}\n`);

  // Inspiration
  if (d.inspo) lines.push(`SITES D'INSPIRATION\nAnalyse ces sites et inspire-toi de leurs points forts :\n${d.inspo}\n`);

  // Content
  const cont = Array.isArray(d.cont) ? d.cont.join(", ") : d.cont;
  if (cont) lines.push(`CONTENU DISPONIBLE\n${cont}\n`);

  // Budget
  if (d.budget) lines.push(`BUDGET\n${d.budget}\n`);

  // Timeline
  if (d.urgency) lines.push(`NIVEAU D'URGENCE\n${d.urgency}`);
  if (d.dl) lines.push(`DELAI SOUHAITE\n${d.dl}`);
  if (d.kdate) lines.push(`DATE CLE\n${d.kdate}`);
  if (d.dl || d.urgency || d.kdate) lines.push('');

  // Recurring / maintenance
  if (d.recur) lines.push(`ACCOMPAGNEMENT SOUHAITE\n${d.recur}\n`);

  // Autonomy
  if (d.auto) lines.push(`AUTONOMIE SOUHAITEE\nLe client souhaite : ${d.auto}\n`);

  // Web level
  if (d.wlevel) lines.push(`NIVEAU WEB DU CLIENT\n${d.wlevel}\n`);

  // Past experience
  if (d.past) lines.push(`EXPERIENCE PASSEE\n${d.past}`);
  if (d.pastissue) lines.push(`PROBLEMES RENCONTRES\n${d.pastissue}`);
  if (d.past || d.pastissue) lines.push('');

  // Free message
  if (d.msg) lines.push(`MESSAGE LIBRE DU CLIENT\n${d.msg}\n`);

  // Communication preferences
  if (d.cp) lines.push(`CANAL DE COMMUNICATION PREFERE : ${d.cp}`);
  if (d.slot) lines.push(`CRENEAU DE DISPONIBILITE : ${d.slot}`);
  if (d.cp || d.slot) lines.push('');

  // Files
  if (d.file_link) lines.push(`LIEN VERS FICHIERS : ${d.file_link}`);
  if (d.file_notes) lines.push(`NOTES FICHIERS : ${d.file_notes}`);
  if (d.file_link || d.file_notes) lines.push('');

  // Final instructions
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
}

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
  const [subs, setSubs] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSubs((data as any) || []);
        setLoading(false);
      });
  }, []);

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

    // Load logo
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    const logoLoaded = new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = logoSrc;
    });
    await logoLoaded;

    const drawHeader = () => {
      // Dark background matching site foreground
      doc.setFillColor(23, 25, 35);
      doc.rect(0, 0, pageWidth, 44, "F");
      // Accent line (primary blue)
      doc.setFillColor(14, 165, 233);
      doc.rect(0, 44, pageWidth, 2, "F");

      // Logo
      try { doc.addImage(logoImg, "PNG", margin, 8, 36, 12); } catch {}

      // Company info right
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("declicdigital.net", pageWidth - margin, 14, { align: "right" });
      doc.text("contact@declicdigital.net", pageWidth - margin, 20, { align: "right" });
      doc.text("06.02.22.89.39", pageWidth - margin, 26, { align: "right" });
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 190);
      doc.text("SIRET 102 436 664 00019", pageWidth - margin, 34, { align: "right" });
    };

    const drawFooter = (pageNum: number) => {
      doc.setFillColor(23, 25, 35);
      doc.rect(0, pageHeight - 14, pageWidth, 14, "F");
      doc.setTextColor(140, 140, 155);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Déclic Digital - Fiche Client Confidentielle", margin, pageHeight - 5);
      doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: "right" });
    };

    let pageNum = 1;
    drawHeader();

    // Title section
    let y = 56;
    doc.setFillColor(240, 245, 250);
    doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 25, 35);
    doc.text("Fiche Client", margin + 8, y + 11);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 115);
    const dateStr = new Date(sub.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    doc.text(dateStr, margin + 8, y + 21);
    if (d.full_name) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(14, 165, 233);
      doc.text(d.full_name, pageWidth - margin - 8, y + 11, { align: "right" });
      if (d.company) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 115);
        doc.text(d.company, pageWidth - margin - 8, y + 21, { align: "right" });
      }
    }

    y += 38;

    // Section groups
    const sections: { title: string; keys: string[] }[] = [
      { title: "Informations", keys: ["full_name", "company", "email", "phone", "sector", "size", "current_url", "source"] },
      { title: "Projet", keys: ["pt", "desc", "inspo", "kw", "goal", "csrc", "budget", "recur", "urgency", "pages", "feat", "feat_autre_detail", "vibe", "dl", "kdate"] },
      { title: "Profil & Préférences", keys: ["brand", "cont", "auto", "wlevel", "past", "pastissue", "msg", "cp", "slot"] },
      { title: "Fichiers", keys: ["ftype", "file_link", "file_notes"] },
    ];

    const checkNewPage = (needed: number) => {
      if (y + needed > pageHeight - 22) {
        drawFooter(pageNum);
        doc.addPage();
        pageNum++;
        drawHeader();
        y = 54;
      }
    };

    sections.forEach((section) => {
      const entries = section.keys
        .filter((k) => d[k] && !(Array.isArray(d[k]) && d[k].length === 0) && !(typeof d[k] === "string" && !d[k].trim()))
        .map((k) => ({ key: k, label: FIELD_LABELS[k] || k, value: Array.isArray(d[k]) ? d[k].join(", ") : String(d[k]) }));
      if (entries.length === 0) return;

      checkNewPage(20);

      // Section title
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

        // Zebra row
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

    // Attached files
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

    // Brief prompt recap
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
      // Bold section headers (ALL CAPS lines)
      if (line === line.toUpperCase() && line.trim().length > 2 && !/^[-•]/.test(line)) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(23, 25, 35);
        doc.setFontSize(7.5);
      }
      doc.text(line, margin + 6, y);
      y += 3.8;
    });

    drawFooter(pageNum);
    const name = (d.full_name || "soumission").replace(/\s+/g, "_");
    doc.save(`fiche_${name}.pdf`);
  };

  if (selected) {
    const d = selected.data;
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>← Retour</Button>
            <h1 className="text-lg font-bold">Soumission de {d.full_name || "Inconnu"}</h1>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => downloadPdf(selected)}>
                <Download className="h-4 w-4 mr-1" /> Télécharger PDF
              </Button>
              <span className="text-xs text-muted-foreground">
                {new Date(selected.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
        <div className="container py-8 max-w-5xl">
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="gradient-miami p-6">
              <h2 className="text-xl font-extrabold text-primary-foreground">{d.full_name}</h2>
              <p className="text-primary-foreground/80 text-sm">{d.company} · {d.email}</p>
            </div>
            <div className="divide-y divide-border">
              {Object.entries(d).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && !value.trim())) return null;
                const display = Array.isArray(value) ? value.join(", ") : String(value);
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
                  <div key={key} className="flex gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-foreground w-48 shrink-0">{FIELD_LABELS[key] || key}</span>
                    <span className="text-sm text-muted-foreground whitespace-pre-wrap break-words min-w-0">{renderValue(display)}</span>
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

            {/* Brief Prompt Recap */}
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-2xl font-extrabold">Soumissions formulaire</h1>
          <p className="text-muted-foreground text-sm mt-1">{subs.length} soumission(s) reçue(s)</p>
        </div>
      </div>
      <div className="container py-8 max-w-4xl">
        {loading ? (
          <div className="text-center text-muted-foreground py-16">Chargement…</div>
        ) : subs.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">Aucune soumission pour le moment.</div>
        ) : (
          <div className="space-y-3">
            {subs.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(s)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated hover:border-primary/20 cursor-pointer transition-all group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-semibold text-sm truncate">{s.data?.full_name || "Sans nom"}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    {s.data?.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{s.data.company}</span>}
                    {s.data?.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.data.email}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSoumissions;
