import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Submission {
  id: string;
  created_at: string;
  status: string;
  file_paths: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
  data: any;
}

const STATUS_OPTIONS = ["en_attente", "lu", "traite", "termine"];
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  en_attente: { label: "Nouveau", color: "bg-amber-400/15 text-amber-300" },
  lu: { label: "Lu", color: "bg-blue-400/15 text-blue-300" },
  traite: { label: "En cours", color: "bg-purple-400/15 text-purple-300" },
  termine: { label: "Traité", color: "bg-green-400/15 text-green-300" },
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
    const { data } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions(data ?? []);
    setLoadingData(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("form_submissions").update({ status }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
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
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === "all" ? "bg-white text-[#0f0f13]" : "bg-white/5 text-white/50 hover:text-white"}`}
          >
            Tous ({submissions.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const count = submissions.filter((sub) => sub.status === s).length;
            const sl = STATUS_LABELS[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-white text-[#0f0f13]" : "bg-white/5 text-white/50 hover:text-white"}`}
              >
                {sl.label} ({count})
              </button>
            );
          })}
        </div>

        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Aucune soumission</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub) => {
              const data = sub.data ? (typeof sub.data === "string" ? JSON.parse(sub.data) : sub.data) : {};
              const name = data.full_name || sub.name || "—";
              const email = data.email || sub.email || "—";
              const phone = data.phone || sub.phone || "—";
              const desc = data.desc || sub.message || "—";
              const budget = data.budget || "—";
              const company = data.company || "—";
              const sl = STATUS_LABELS[sub.status] ?? { label: sub.status, color: "bg-white/10 text-white/50" };
              const isExpanded = expanded === sub.id;

              return (
                <div key={sub.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : sub.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/50">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{name}</p>
                        <p className="text-white/40 text-xs">{email} {company !== "—" && `— ${company}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs hidden sm:block">
                        {new Date(sub.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sl.color}`}>
                        {sl.label}
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                    </div>
                  </div>

                  {/* Détail */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 space-y-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-white/30 text-xs mb-1">Nom</p>
                          <p className="text-white/80 text-sm">{name}</p>
                        </div>
                        <div>
                          <p className="text-white/30 text-xs mb-1">Email</p>
                          <a href={`mailto:${email}`} className="text-blue-400 text-sm hover:underline">{email}</a>
                        </div>
                        <div>
                          <p className="text-white/30 text-xs mb-1">Téléphone</p>
                          <p className="text-white/80 text-sm">{phone}</p>
                        </div>
                        <div>
                          <p className="text-white/30 text-xs mb-1">Entreprise</p>
                          <p className="text-white/80 text-sm">{company}</p>
                        </div>
                        <div>
                          <p className="text-white/30 text-xs mb-1">Budget</p>
                          <p className="text-white/80 text-sm">{budget}</p>
                        </div>
                        {data.sector && (
                          <div>
                            <p className="text-white/30 text-xs mb-1">Secteur</p>
                            <p className="text-white/80 text-sm">{data.sector}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-white/30 text-xs mb-1">Description du projet</p>
                        <p className="text-white/80 text-sm leading-relaxed bg-white/5 rounded-xl p-3">{desc}</p>
                      </div>

                      {sub.file_paths && sub.file_paths.length > 0 && (
                        <div>
                          <p className="text-white/30 text-xs mb-2">Fichiers joints ({sub.file_paths.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {sub.file_paths.map((path, i) => (
                              <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/60">
                                {path.split("/").pop()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Changer statut */}
                      <div>
                        <p className="text-white/30 text-xs mb-2">Changer le statut</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => {
                            const sl2 = STATUS_LABELS[s];
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(sub.id, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                  sub.status === s
                                    ? "bg-white text-[#0f0f13] border-white"
                                    : "bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                }`}
                              >
                                {sl2.label}
                              </button>
                            );
                          })}
                        </div>
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
