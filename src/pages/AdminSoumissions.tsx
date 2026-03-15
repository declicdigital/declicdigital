import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Calendar, User, Building2, Mail, ChevronRight, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

  if (selected) {
    const d = selected.data;
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>← Retour</Button>
            <h1 className="text-lg font-bold">Soumission de {d.full_name || "Inconnu"}</h1>
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(selected.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
        <div className="container py-8 max-w-3xl">
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="gradient-miami p-6">
              <h2 className="text-xl font-extrabold text-primary-foreground">{d.full_name}</h2>
              <p className="text-primary-foreground/80 text-sm">{d.company} · {d.email}</p>
            </div>
            <div className="divide-y divide-border">
              {Object.entries(d).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && !value.trim())) return null;
                const display = Array.isArray(value) ? value.join(", ") : String(value);
                return (
                  <div key={key} className="flex gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-foreground w-40 shrink-0">{FIELD_LABELS[key] || key}</span>
                    <span className="text-sm text-muted-foreground whitespace-pre-wrap">{display}</span>
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
