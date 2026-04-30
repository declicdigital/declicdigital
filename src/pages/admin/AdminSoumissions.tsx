import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronDown, ChevronUp, Download, Mail, Phone, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Submission {
  id: string;
  created_at: string;
  status: string;
  file_paths: string[];
  full_name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  size: string;
  current_url: string;
  source: string;
  project_types: string[];
  description: string;
  inspiration: string;
  keywords: string;
  goal: string;
  acquisition_sources: string[];
  budget: string;
  recurrence: string;
  urgency: string;
  brand: string;
  content_available: string[];
  pages_count: string;
  features: string[];
  features_other: string;
  vibe: string;
  team_enabled: boolean;
  team_data: any[];
  deadline: string;
  key_date: string;
  autonomy: string;
  web_level: string;
  past_experience: string;
  past_issue: string;
  message: string;
  contact_pref: string;
  time_slot: string;
  file_types: string[];
  file_link: string;
  file_notes: string;
}

const STATUS_OPTIONS = ["new", "lu", "en_cours", "traite"];
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-amber-400/15 text-amber-300" },
  lu: { label: "Lu", color: "bg-blue-400/15 text-blue-300" },
  en_cours: { label: "En cours", color: "bg-purple-400/15 text-purple-300" },
  traite: { label: "Traité", color: "bg-green-400/15 text-green-300" },
};

const Field = ({ label, value }: { label: string; value: string | string[] | boolean | undefined | null }) => {
  if (!value || (Array.isArray(value) && value.length === 0) || value === false) return null;
  const display = Array.isArray(value) ? value.join(", ") : value === true ? "Oui" : String(value);
  if (!display.trim()) return null;
  return (
    <div>
      <p className="text-white/30 text-xs mb-1">{label}</p>
      <p className="text-white/80 text-sm leading-relaxed">{display}</p>
    </div>
  );
};

export default function AdminSoumissions() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSubmissions();
  }, [isAdmin]);

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from("brief_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Erreur fetch:", error);
    setSubmissions(data ?? []);
    setLoadingData(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("brief_submissions").update({ status }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }

  async function deleteSubmission(id: string) {
    if (!confirm("Supprimer cette soumission ? Cette action est irréversible.")) return;
    const { error } = await supabase.from("brief_submissions").delete().eq("id", id);
    if (!error) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expanded === id) setExpanded(null);
    } else {
      alert("Erreur lors de la suppression");
    }
  }

  async function downloadFile(path: string) {
    const { data, error } = await supabase.storage.from("form-files").download(path);
    if (error || !data) { alert("Erreur téléchargement"); return; }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop() || "fichier";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function getFileUrl(path: string) {
    const { data } = supabase.storage.from("form-files").getPublicUrl(path);
    return data.publicUrl;
  }

  const filtered = filterStatus === "all"
    ? submissions
    : submissions.filter((s) => s.status === filterStatus);

  if (loading) return <div className="min-h-screen bg-[#0f0f13]" />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Soumissions</h1>
            <p className="text-white/40 text-sm mt-1">{submissions.length} demande{submissions.length > 1 ? "s" : ""} reçue{submissions.length > 1 ? "s" : ""}</p>
          </div>
          <button onClick={fetchSubmissions} className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5">
            Actualiser
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === "all" ? "bg-white text-[#0f0f13]" : "bg-white/5 text-white/50 hover:text-white"}`}>
            Tous ({submissions.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const count = submissions.filter((sub) => sub.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-white text-[#0f0f13]" : "bg-white/5 text-white/50 hover:text-white"}`}>
                {STATUS_LABELS[s]?.label ?? s} ({count})
              </button>
            );
          })}
        </div>

        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Aucune soumission</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub) => {
              const sl = STATUS_LABELS[sub.status] ?? { label: sub.status, color: "bg-white/10 text-white/50" };
              const isExpanded = expanded === sub.id;
              const name = sub.full_name || "—";

              return (
                <div key={sub.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : sub.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/50">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{name} {sub.company && <span className="text-white/40">— {sub.company}</span>}</p>
                        <p className="text-white/40 text-xs">{sub.email} {sub.budget && `· ${sub.budget}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs hidden sm:block">
                        {new Date(sub.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sl.color}`}>{sl.label}</span>
                      {isExpanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSubmission(sub.id); }}
                        className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Détail */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 space-y-6">

                      {/* Actions rapides */}
                      <div className="flex flex-wrap gap-2">
                        <a href={`mailto:${sub.email}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                          <Mail size={13} /> Répondre par email
                        </a>
                        {sub.phone && (
                          <a href={`tel:${sub.phone}`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                            <Phone size={13} /> Appeler
                          </a>
                        )}
                        {sub.current_url && (
                          <a href={sub.current_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-colors">
                            <ExternalLink size={13} /> Voir le site actuel
                          </a>
                        )}
                      </div>

                      {/* Profil */}
                      <div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">👤 Profil</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Nom" value={sub.full_name} />
                          <Field label="Email" value={sub.email} />
                          <Field label="Téléphone" value={sub.phone} />
                          <Field label="Entreprise" value={sub.company} />
                          <Field label="Secteur" value={sub.sector} />
                          <Field label="Taille" value={sub.size} />
                          <Field label="Site actuel" value={sub.current_url} />
                          <Field label="Source" value={sub.source} />
                        </div>
                      </div>

                      {/* Projet */}
                      <div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">📋 Projet</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label="Type de site" value={sub.project_types} />
                          <Field label="Mots-clés SEO" value={sub.keywords} />
                        </div>
                        {sub.description && (
                          <div className="mt-3">
                            <p className="text-white/30 text-xs mb-1">Description</p>
                            <p className="text-white/80 text-sm leading-relaxed bg-white/5 rounded-xl p-3 whitespace-pre-wrap">{sub.description}</p>
                          </div>
                        )}
                        {sub.inspiration && (
                          <div className="mt-3">
                            <p className="text-white/30 text-xs mb-1">Inspiration</p>
                            <p className="text-white/80 text-sm leading-relaxed bg-white/5 rounded-xl p-3">{sub.inspiration}</p>
                          </div>
                        )}
                      </div>

                      {/* Objectifs & Budget */}
                      <div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">🎯 Objectifs & Budget</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Objectif" value={sub.goal} />
                          <Field label="Budget" value={sub.budget} />
                          <Field label="Récurrence" value={sub.recurrence} />
                          <Field label="Urgence" value={sub.urgency ? sub.urgency + "/5" : null} />
                          <Field label="Acquisition" value={sub.acquisition_sources} />
                        </div>
                      </div>

                      {/* Design */}
                      <div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">🎨 Contenu & Design</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Charte graphique" value={sub.brand} />
                          <Field label="Contenu dispo" value={sub.content_available} />
                          <Field label="Nb de pages" value={sub.pages_count} />
                          <Field label="Fonctionnalités" value={sub.features} />
                          <Field label="Fonct. autre" value={sub.features_other} />
                        </div>
                        {sub.vibe && (
                          <div className="mt-3">
                            <p className="text-white/30 text-xs mb-1">Ambiance souhaitée</p>
                            <p className="text-white/80 text-sm bg-white/5 rounded-xl p-3">{sub.vibe}</p>
                          </div>
                        )}
                      </div>

                      {/* Délais */}
                      <div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">⏱ Délais & Contexte</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <Field label="Délai souhaité" value={sub.deadline} />
                          <Field label="Date clé" value={sub.key_date} />
                          <Field label="Autonomie" value={sub.autonomy} />
                          <Field label="Niveau web" value={sub.web_level ? sub.web_level + "/5" : null} />
                          <Field label="Expérience agence" value={sub.past_experience} />
                          <Field label="Contact préféré" value={sub.contact_pref} />
                          <Field label="Créneau" value={sub.time_slot} />
                        </div>
                        {sub.past_issue && (
                          <div className="mt-3">
                            <p className="text-white/30 text-xs mb-1">Ce qui s'est passé</p>
                            <p className="text-white/80 text-sm bg-white/5 rounded-xl p-3">{sub.past_issue}</p>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      {sub.message && (
                        <div>
                          <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">💬 Message</p>
                          <p className="text-white/80 text-sm bg-white/5 rounded-xl p-3 whitespace-pre-wrap">{sub.message}</p>
                        </div>
                      )}

                      {/* Équipe */}
                      {sub.team_enabled && sub.team_data && sub.team_data.length > 0 && (
                        <div>
                          <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">👥 Équipe</p>
                          <div className="space-y-2">
                            {sub.team_data.map((m: any, i: number) => (
                              <div key={i} className="bg-white/5 rounded-xl p-3 text-sm text-white/70">
                                <span className="font-medium text-white">{m.name}</span> — {m.role}
                                {m.bio && <p className="text-white/40 text-xs mt-1">{m.bio}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fichiers */}
                      {((sub.file_paths && sub.file_paths.length > 0) || sub.file_link) && (
                        <div>
                          <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">📎 Fichiers</p>

                          {/* Lien externe */}
                          {sub.file_link && (
                            <a href={sub.file_link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-white/5 text-blue-400 text-sm hover:bg-white/10 transition-colors w-fit">
                              <ExternalLink size={14} /> Voir les fichiers partagés (Drive/Dropbox…)
                            </a>
                          )}

                          {sub.file_notes && (
                            <p className="text-white/40 text-xs mb-3 italic">{sub.file_notes}</p>
                          )}

                          {/* Fichiers uploadés */}
                          {sub.file_paths && sub.file_paths.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {sub.file_paths.map((path, i) => (
                                <button key={i} onClick={() => downloadFile(path)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white transition-colors">
                                  <Download size={12} />
                                  {path.split("/").pop()}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Statut + Suppression */}
                      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-white/10">
                        <div>
                          <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-3">Statut</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((s) => (
                              <button key={s} onClick={() => updateStatus(sub.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                  sub.status === s
                                    ? "bg-white text-[#0f0f13] border-white"
                                    : "bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                }`}>
                                {STATUS_LABELS[s]?.label ?? s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => deleteSubmission(sub.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Supprimer cette soumission
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
