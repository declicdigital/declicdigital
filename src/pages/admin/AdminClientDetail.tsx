import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, CheckSquare, MessageSquare, FileText, Receipt,
  ExternalLink, Plus, Trash2, Edit2, Check, X, Upload, Download, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const STATUS_OPTIONS = [
  { value: "a_faire_dd", label: "À faire (DD)", color: "bg-blue-400/15 text-blue-300" },
  { value: "a_faire_client", label: "À faire (Client)", color: "bg-amber-400/15 text-amber-300" },
  { value: "en_cours", label: "En cours", color: "bg-purple-400/15 text-purple-300" },
  { value: "en_attente", label: "En attente", color: "bg-orange-400/15 text-orange-300" },
  { value: "termine", label: "Terminé", color: "bg-green-400/15 text-green-300" },
];

function getStatus(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? { value, label: value, color: "bg-white/10 text-white/60" };
}

export default function AdminClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"taches" | "messages" | "documents" | "factures">("taches");
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // New task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("a_faire_dd");
  const [addingTask, setAddingTask] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // Edit project
  const [editingProject, setEditingProject] = useState(false);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDrive, setEditDrive] = useState("");
  const [savingProject, setSavingProject] = useState(false);

  // Upload
  const [uploading, setUploading] = useState(false);

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
    fetchProjectData();
  }, [selectedProject]);

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

  async function addTask() {
    if (!newTaskTitle.trim() || !selectedProject) return;
    setAddingTask(true);
    const maxOrder = tasks.reduce((max, t) => Math.max(max, t.sort_order ?? 0), 0);
    const { data } = await supabase.from("project_tasks").insert({
      project_id: selectedProject,
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      sort_order: maxOrder + 1,
    }).select().single();
    if (data) setTasks((prev) => [...prev, data]);
    setNewTaskTitle("");
    setNewTaskStatus("a_faire_dd");
    setShowAddTask(false);
    setAddingTask(false);
  }

  async function updateTaskStatus(taskId: string, status: string) {
    await supabase.from("project_tasks").update({ status }).eq("id", taskId);
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Supprimer cette tâche ?")) return;
    await supabase.from("project_tasks").delete().eq("id", taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function startEditProject() {
    const p = projects.find((p) => p.id === selectedProject);
    if (!p) return;
    setEditName(p.name);
    setEditWebsite(p.website_url ?? "");
    setEditDrive(p.drive_url ?? "");
    setEditingProject(true);
  }

  async function saveProject() {
    if (!selectedProject) return;
    setSavingProject(true);
    const { data } = await supabase.from("projects").update({
      name: editName,
      website_url: editWebsite,
      drive_url: editDrive,
    }).eq("id", selectedProject).select().single();
    if (data) setProjects((prev) => prev.map((p) => p.id === selectedProject ? data : p));
    setEditingProject(false);
    setSavingProject(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedProject) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const filePath = `${selectedProject}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("project-documents").upload(filePath, file);
      if (!error) {
        const { data: doc } = await supabase.from("project_documents").insert({
          project_id: selectedProject,
          name: file.name,
          file_path: filePath,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        }).select().single();
        if (doc) setDocuments((prev) => [doc, ...prev]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function downloadDocument(doc: any) {
    const { data } = await supabase.storage.from("project-documents").createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  async function deleteDocument(doc: any) {
    if (!confirm("Supprimer ce document ?")) return;
    await supabase.storage.from("project-documents").remove([doc.file_path]);
    await supabase.from("project_documents").delete().eq("id", doc.id);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  }

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
            <div className="flex flex-wrap gap-2 mb-3">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedProject === p.id ? "bg-white text-[#0f0f13]" : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Infos projet + édition */}
            {currentProject && !editingProject && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
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
                <button onClick={startEditProject} className="flex items-center gap-1 text-white/30 hover:text-white transition-colors">
                  <Edit2 size={12} /> Modifier
                </button>
              </div>
            )}

            {/* Formulaire édition projet */}
            {editingProject && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mt-2">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Nom du projet</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">URL du site</label>
                  <input value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">URL Drive</label>
                  <input value={editDrive} onChange={(e) => setEditDrive(e.target.value)} placeholder="https://drive.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProject} disabled={savingProject}
                    className="flex items-center gap-1.5 bg-white text-[#0f0f13] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/90 disabled:opacity-50">
                    <Check size={12} /> {savingProject ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button onClick={() => setEditingProject(false)}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-xl text-xs font-semibold hover:text-white">
                    <X size={12} /> Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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

        {/* TÂCHES */}
        {activeTab === "taches" && (
          <div className="space-y-2">
            {tasks.map((task) => {
              const s = getStatus(task.status);
              return (
                <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <p className="text-sm text-white/80 flex-1">{task.title}</p>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${s.color} bg-transparent`}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#1a1a24] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => deleteTask(task.id)} className="text-white/20 hover:text-red-400 transition-colors ml-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}

            {/* Formulaire ajout tâche */}
            {showAddTask ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche..."
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNewTaskStatus(opt.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        newTaskStatus === opt.value ? opt.color + " ring-1 ring-white/20" : "bg-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addTask} disabled={addingTask || !newTaskTitle.trim()}
                    className="flex items-center gap-1.5 bg-white text-[#0f0f13] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/90 disabled:opacity-50">
                    <Check size={12} /> {addingTask ? "Ajout..." : "Ajouter"}
                  </button>
                  <button onClick={() => { setShowAddTask(false); setNewTaskTitle(""); }}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-xl text-xs font-semibold hover:text-white">
                    <X size={12} /> Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors py-2"
              >
                <Plus size={16} /> Ajouter une tâche
              </button>
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
                const isClient = msg.user_id === id;
                return (
                  <div key={msg.id} className={`flex ${isClient ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${isClient ? "bg-white/8 text-white/80" : "bg-blue-500/20 text-blue-100"}`}>
                      <p className="text-xs font-medium mb-1 opacity-60">{isClient ? client.full_name : "Vous"}</p>
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
          <div className="space-y-3">
            {/* Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm text-white/50 hover:text-white hover:border-white/30 transition-colors w-full justify-center disabled:opacity-50"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Upload en cours..." : "Cliquez pour uploader un fichier (PDF, image, doc...)"}
              </button>
            </div>

            {documents.length === 0 ? (
              <p className="text-white/30 text-sm py-4 text-center">Aucun document</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-white/30 shrink-0" />
                    <span className="text-sm text-white/80 truncate">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-white/30 hidden sm:block">
                      {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <button onClick={() => downloadDocument(doc)} className="text-white/30 hover:text-blue-400 transition-colors" title="Télécharger">
                      <Download size={15} />
                    </button>
                    <button onClick={() => deleteDocument(doc)} className="text-white/30 hover:text-red-400 transition-colors" title="Supprimer">
                      <Trash2 size={15} />
                    </button>
                  </div>
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
