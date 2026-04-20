import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckSquare, MessageSquare, FileText, Receipt, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  a_faire: { label: "À faire (DD)", color: "bg-blue-400/15 text-blue-300" },
  a_faire_dd: { label: "À faire (DD)", color: "bg-blue-400/15 text-blue-300" },
  a_faire_client: { label: "À faire (Client)", color: "bg-amber-400/15 text-amber-300" },
  en_cours: { label: "En cours", color: "bg-purple-400/15 text-purple-300" },
  en_attente: { label: "En attente", color: "bg-orange-400/15 text-orange-300" },
  termine: { label: "Terminé", color: "bg-green-400/15 text-green-300" },
};

export default function AdminClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"taches" | "messages" | "documents" | "factures">("taches");
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !id) return;
    async function fetchClient() {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single();
      setClient(profile);
      const { data: projs } = await supabase.from("projects").select("*").eq("client_id", id).order("created_at", { ascending: false });
      setProjects(projs ?? []);
      if (projs && projs.length > 0) setSelectedProject(projs[0].id);
      setLoadingData(false);
    }
    fetchClient();
  }, [isAdmin, id]);

  useEffect(() => {
    if (!selectedProject) return;
    async function fetchProjectData() {
      const [{ data: t }, { data: m }, { data: d }, { data: inv }] = await Promise.all([
        supabase.from("project_tasks").select("*").eq("project_id", selectedProject).order("sort_order"),
        supabase.from("project_messages").select("*").eq("project_id", selectedProject).order("created_at"),
        supabase.from("project_documents").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false }),
        supabase.from("project_invoices").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false }),
      ]);
      setTasks(t ?? []);
      setMessages(m ?? []);
      setDocuments(d ?? []);
      setInvoices(inv ?? []);
    }
    fetchProjectData();
  }, [selectedProject]);

  if (loading || loadingData) return <div className="min-h-screen bg-[#0f0f13]" />;
  if (!client) return <AdminLayout><div className="p-8 text-white/40">Client introuvable</div></AdminLayout>;

  const currentProject = projects.find((p) => p.id === selectedProject);

  const tabs = [
    { id: "taches", label: "Tâches", count: tasks.length, icon: CheckSquare },
    { id: "messages", label: "Messages", count: messages.length, icon: MessageSquare },
    { id: "documents", label: "Documents", count: documents.length, icon: FileText },
    { id: "factures", label: "Factures", count: invoices.length, icon: Receipt },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clients" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
              {client.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{client.full_name}</h1>
              <p className="text-white/40 text-sm">{client.email}</p>
            </div>
          </div>
        </div>

        {/* Sélecteur de projet */}
        {projects.length > 0 && (
          <div className="mb-6">
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-2">Projet</p>
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedProject === p.id
                      ? "bg-white text-[#0f0f13]"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {currentProject && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/40">
                <span>Statut : <span className="text-white/70">{currentProject.status}</span></span>
                {currentProject.website_url && (
                  <a href={currentProject.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                    Site <ExternalLink size={10} />
                  </a>
                )}
                {currentProject.drive_url && (
                  <a href={currentProject.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:underline">
                    Drive <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-[#0f0f13]" : "text-white/40 hover:text-white"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-black/10" : "bg-white/10"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu des tabs */}

        {/* TÂCHES */}
        {activeTab === "taches" && (
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">Aucune tâche</p>
            ) : (
              tasks.map((task) => {
                const s = STATUS_LABELS[task.status] ?? { label: task.status, color: "bg-white/10 text-white/60" };
                return (
                  <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-white/80">{task.title}</p>
                    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">Aucun message</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.user_id === client.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${isMe ? "bg-blue-500/20 text-blue-100" : "bg-white/8 text-white/80"}`}>
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-40">
                        {new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">Aucun document</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-white/30" />
                    <span className="text-sm text-white/80">{doc.name}</span>
                  </div>
                  <span className="text-xs text-white/30">
                    {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* FACTURES */}
        {activeTab === "factures" && (
          <div className="space-y-2">
            {invoices.length === 0 ? (
              <p className="text-white/30 text-sm py-8 text-center">Aucune facture</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">{inv.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{inv.type}</p>
                  </div>
                  <div className="text-right">
                    {inv.amount && <p className="text-sm font-semibold text-white">{inv.amount}€</p>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "payé" ? "bg-green-400/15 text-green-300" : "bg-amber-400/15 text-amber-300"}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
