import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, CheckSquare, MessageSquare, FileText, Receipt,
  ExternalLink, Plus, Trash2, Edit2, Check, X, Upload, Download, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const INK = "#2B1E3F";
const INK_L = "rgba(43,30,63,0.50)";
const INK_XL = "rgba(43,30,63,0.30)";
const BG = "#F6F1E9";
const BG_CARD = "#EDE8DF";
const BG_INPUT = "rgba(43,30,63,0.05)";
const BORDER = "rgba(43,30,63,0.09)";
const BORDER_I = "rgba(43,30,63,0.12)";

const STATUS_OPTIONS = [
  { value: "a_faire_dd", label: "À faire (DD)", color: "bg-blue-100 text-blue-700" },
  { value: "a_faire_client", label: "À faire (Client)", color: "bg-amber-100 text-amber-700" },
  { value: "en_cours", label: "En cours", color: "bg-purple-100 text-purple-700" },
  { value: "en_attente", label: "En attente", color: "bg-orange-100 text-orange-700" },
  { value: "termine", label: "Terminé", color: "bg-green-100 text-green-700" },
];

function getStatus(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? { value, label: value, color: "bg-gray-100 text-gray-600" };
}

export default function AdminClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"taches"|"messages"|"documents"|"factures">("taches");
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string|null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("a_faire_dd");
  const [addingTask, setAddingTask] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDrive, setEditDrive] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (!loading && !isAdmin) navigate("/admin/login"); }, [loading, isAdmin, navigate]);

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

  useEffect(() => { if (!selectedProject) return; fetchProjectData(); }, [selectedProject]);

  async function fetchProjectData() {
    const [{ data: t }, { data: m }, { data: d }, { data: inv }] = await Promise.all([
      supabase.from("project_tasks").select("*").eq("project_id", selectedProject).order("sort_order"),
      supabase.from("project_messages").select("*").eq("project_id", selectedProject).order("created_at"),
      supabase.from("project_documents").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false }),
      supabase.from("project_invoices").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false }),
    ]);
    setTasks(t ?? []); setMessages(m ?? []); setDocuments(d ?? []); setInvoices(inv ?? []);
  }

  async function addTask() {
    if (!newTaskTitle.trim() || !selectedProject) return;
    setAddingTask(true);
    const maxOrder = tasks.reduce((max, t) => Math.max(max, t.sort_order ?? 0), 0);
    const { data } = await supabase.from("project_tasks").insert({ project_id: selectedProject, title: newTaskTitle.trim(), status: newTaskStatus, sort_order: maxOrder + 1 }).select().single();
    if (data) setTasks((prev) => [...prev, data]);
    setNewTaskTitle(""); setNewTaskStatus("a_faire_dd"); setShowAddTask(false); setAddingTask(false);
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
    setEditName(p.name); setEditWebsite(p.website_url ?? ""); setEditDrive(p.drive_url ?? ""); setEditingProject(true);
  }

  async function saveProject() {
    if (!selectedProject) return;
    setSavingProject(true);
    const { data } = await supabase.from("projects").update({ name: editName, website_url: editWebsite, drive_url: editDrive }).eq("id", selectedProject).select().single();
    if (data) setProjects((prev) => prev.map((p) => p.id === selectedProject ? data : p));
    setEditingProject(false); setSavingProject(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !selectedProject) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const filePath = `${selectedProject}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("project-documents").upload(filePath, file);
      if (!error) {
        const { data: doc } = await supabase.from("project_documents").insert({ project_id: selectedProject, name: file.name, file_path: filePath, uploaded_by: (await supabase.auth.getUser()).data.user?.id }).select().single();
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

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: BG }} />;
  if (!client) return <AdminLayout><div className="p-8" style={{ color: INK_XL }}>Client introuvable</div></AdminLayout>;

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
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clients" style={{ color: INK_XL }} className="hover:opacity-70 transition-opacity"><ArrowLeft size={18} /></Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(43,30,63,0.10)", color: INK_L }}>
              {client.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: INK }}>{client.full_name}</h1>
              <p className="text-sm" style={{ color: INK_L }}>{client.email}</p>
            </div>
          </div>
        </div>

        {projects.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: INK_XL }}>Projet</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {projects.map((p) => (
                <button key={p.id} onClick={() => setSelectedProject(p.id)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={selectedProject === p.id ? { background: INK, color: BG } : { background: BG_CARD, border: `1px solid ${BORDER}`, color: INK_L }}>
                  {p.name}
                </button>
              ))}
            </div>

            {currentProject && !editingProject && (
              <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: INK_XL }}>
                {currentProject.website_url && (
                  <a href={currentProject.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1" style={{ color: "rgb(37,99,235)" }}>
                    Site <ExternalLink size={10} />
                  </a>
                )}
                {currentProject.drive_url && (
                  <a href={currentProject.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1" style={{ color: "rgb(22,163,74)" }}>
                    Drive <ExternalLink size={10} />
                  </a>
                )}
                <button onClick={startEditProject} className="flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: INK_XL }}>
                  <Edit2 size={12} /> Modifier
                </button>
              </div>
            )}

            {editingProject && (
              <div className="rounded-2xl p-4 space-y-3 mt-2" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                {[{ label: "Nom du projet", val: editName, set: setEditName, ph: "" },
                  { label: "URL du site", val: editWebsite, set: setEditWebsite, ph: "https://..." },
                  { label: "URL Drive", val: editDrive, set: setEditDrive, ph: "https://drive.google.com/..." }].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label className="text-xs mb-1 block" style={{ color: INK_XL }}>{label}</label>
                    <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                      className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                      style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={saveProject} disabled={savingProject}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 text-white"
                    style={{ background: INK }}>
                    <Check size={12} /> {savingProject ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button onClick={() => setEditingProject(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: BG_INPUT, border: `1px solid ${BORDER}`, color: INK_L }}>
                    <X size={12} /> Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: BG_CARD }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
              style={activeTab === tab.id ? { background: INK, color: BG } : { color: INK_L }}>
              <tab.icon size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: activeTab === tab.id ? "rgba(246,241,233,0.2)" : "rgba(43,30,63,0.10)", color: activeTab === tab.id ? BG : INK_L }}>
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
                <div key={task.id} className="rounded-xl p-4 flex items-center gap-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                  <p className="text-sm flex-1" style={{ color: INK_L }}>{task.title}</p>
                  <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${s.color}`}
                    style={{ backgroundColor: "transparent" }}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-white text-gray-800">{opt.label}</option>
                    ))}
                  </select>
                  <button onClick={() => deleteTask(task.id)} className="transition-colors hover:text-red-500" style={{ color: INK_XL }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
            {showAddTask ? (
              <div className="rounded-xl p-4 space-y-3" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Titre de la tâche..." autoFocus
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setNewTaskStatus(opt.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${newTaskStatus === opt.value ? opt.color : ""}`}
                      style={newTaskStatus !== opt.value ? { background: BG_INPUT, color: INK_L } : {}}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addTask} disabled={addingTask || !newTaskTitle.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 text-white"
                    style={{ background: INK }}>
                    <Check size={12} /> {addingTask ? "Ajout..." : "Ajouter"}
                  </button>
                  <button onClick={() => { setShowAddTask(false); setNewTaskTitle(""); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: BG_INPUT, border: `1px solid ${BORDER}`, color: INK_L }}>
                    <X size={12} /> Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 text-sm transition-colors py-2 hover:opacity-70" style={{ color: INK_XL }}>
                <Plus size={16} /> Ajouter une tâche
              </button>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: INK_XL }}>Aucun message</p>
            ) : (
              messages.map((msg) => {
                const isClient = msg.user_id === id;
                return (
                  <div key={msg.id} className={`flex ${isClient ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-sm rounded-2xl px-4 py-3 text-sm"
                      style={{ background: isClient ? BG_CARD : "rgba(67,97,238,0.12)", color: INK_L }}>
                      <p className="text-xs font-medium mb-1" style={{ color: INK_XL }}>{isClient ? client.full_name : "Vous"}</p>
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1" style={{ color: INK_XL }}>
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
            <div>
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm w-full justify-center transition-colors disabled:opacity-50"
                style={{ background: BG_INPUT, border: `1px dashed ${BORDER_I}`, color: INK_L }}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Upload en cours..." : "Cliquez pour uploader un fichier (PDF, image, doc...)"}
              </button>
            </div>
            {documents.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: INK_XL }}>Aucun document</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="rounded-xl p-4 flex items-center justify-between gap-3"
                  style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} style={{ color: INK_XL }} className="shrink-0" />
                    <span className="text-sm truncate" style={{ color: INK_L }}>{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs hidden sm:block" style={{ color: INK_XL }}>{new Date(doc.created_at).toLocaleDateString("fr-FR")}</span>
                    <button onClick={() => downloadDocument(doc)} className="transition-colors hover:text-blue-500" style={{ color: INK_XL }} title="Télécharger"><Download size={15} /></button>
                    <button onClick={() => deleteDocument(doc)} className="transition-colors hover:text-red-500" style={{ color: INK_XL }} title="Supprimer"><Trash2 size={15} /></button>
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
              <p className="text-sm py-8 text-center" style={{ color: INK_XL }}>Aucune facture</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="rounded-xl p-4 flex items-center justify-between"
                  style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                  <div>
                    <p className="text-sm" style={{ color: INK_L }}>{inv.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: INK_XL }}>{inv.type}</p>
                  </div>
                  <div className="text-right">
                    {inv.amount && <p className="text-sm font-semibold" style={{ color: INK }}>{inv.amount}€</p>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "payé" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
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
