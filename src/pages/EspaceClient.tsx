import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Plus, MessageSquare, X, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EspaceClientLayout from "@/components/client/EspaceClientLayout";
import { useClientAuth } from "@/hooks/useClientAuth";

const STATUS_OPTIONS = [
  { value: "a_faire_dd", label: "À faire (DD)", color: "bg-blue-400/15 text-blue-300" },
  { value: "a_faire_client", label: "À faire (Moi)", color: "bg-amber-400/15 text-amber-300" },
  { value: "en_cours", label: "En cours", color: "bg-purple-400/15 text-purple-300" },
  { value: "en_attente", label: "En attente", color: "bg-orange-400/15 text-orange-300" },
  { value: "termine", label: "Terminé ✓", color: "bg-green-400/15 text-green-300" },
];

function getStatus(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? { value, label: value, color: "bg-white/10 text-white/60" };
}

export default function EspaceClient() {
  const { user, loading } = useClientAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Nouvelle tâche
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  // Commentaire
  const [commentTask, setCommentTask] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!loading && !user) navigate("/connexion");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const { data: projs } = await supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false });
      setProjects(projs ?? []);
      if (projs && projs.length > 0) setSelectedProject(projs[0].id);
      setLoadingData(false);
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    supabase.from("project_tasks").select("*").eq("project_id", selectedProject).order("sort_order")
      .then(({ data }) => setTasks(data ?? []));
  }, [selectedProject]);

  async function addTask() {
    if (!newTaskTitle.trim() || !selectedProject || !user) return;
    setAddingTask(true);
    const maxOrder = tasks.reduce((max, t) => Math.max(max, t.sort_order ?? 0), 0);
    const { data } = await supabase.from("project_tasks").insert({
      project_id: selectedProject,
      title: newTaskTitle.trim(),
      status: "a_faire_client",
      sort_order: maxOrder + 1,
    }).select().single();
    if (data) setTasks((prev) => [...prev, data]);
    setNewTaskTitle("");
    setShowAddTask(false);
    setAddingTask(false);
  }

  async function loadComments(taskId: string) {
    const { data } = await supabase.from("task_comments").select("*, profiles(full_name)").eq("task_id", taskId).order("created_at");
    setComments((prev) => ({ ...prev, [taskId]: data ?? [] }));
    setCommentTask(taskId);
  }

  async function addComment(taskId: string) {
    if (!commentText.trim() || !user) return;
    const { data } = await supabase.from("task_comments").insert({
      task_id: taskId,
      user_id: user.id,
      content: commentText.trim(),
    }).select("*, profiles(full_name)").single();
    if (data) setComments((prev) => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), data] }));
    setCommentText("");
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  const currentProject = projects.find((p) => p.id === selectedProject);
  const tasksByStatus = {
    todo: tasks.filter((t) => ["a_faire_dd", "a_faire_client", "en_attente"].includes(t.status)),
    inProgress: tasks.filter((t) => t.status === "en_cours"),
    done: tasks.filter((t) => t.status === "termine"),
  };

  return (
    <EspaceClientLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Bonjour {profile?.full_name?.split(" ")[0] ?? ""}  👋</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Suivez l'avancement de votre projet</p>
        </div>

        {/* Sélecteur projet */}
        {projects.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={selectedProject === p.id ? { background: "rgba(255,255,255,0.12)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.30)" }}>
            <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucun projet en cours pour le moment.</p>
            <p className="text-sm mt-2">Contactez-nous pour démarrer votre projet !</p>
          </div>
        ) : (
          <>
            {/* Infos projet */}
            {currentProject && (
              <div className="rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Projet</p>
                  <p className="font-semibold text-white">{currentProject.name}</p>
                </div>
                {currentProject.website_url && (
                  <a href={currentProject.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "hsl(183,70%,63%)" }}>
                    ↗ Voir le site
                  </a>
                )}
                <div className="ml-auto flex gap-3 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <span>{tasks.filter(t => t.status === "termine").length}/{tasks.length} tâches terminées</span>
                </div>
              </div>
            )}

            {/* Tâches par statut */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "À faire / En attente", tasks: tasksByStatus.todo, color: "hsl(183,70%,63%)" },
                { label: "En cours", tasks: tasksByStatus.inProgress, color: "hsl(284,65%,66%)" },
                { label: "Terminé", tasks: tasksByStatus.done, color: "hsl(142,70%,55%)" },
              ].map((col) => (
                <div key={col.label} className="rounded-2xl p-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>{col.label}</p>
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>{col.tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.tasks.map((task) => {
                      const s = getStatus(task.status);
                      return (
                        <div key={task.id} className="rounded-xl p-3 group" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-sm text-white/80 leading-snug mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                            <button onClick={() => commentTask === task.id ? setCommentTask(null) : loadComments(task.id)}
                              className="text-xs flex items-center gap-1 transition-colors"
                              style={{ color: commentTask === task.id ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.25)" }}>
                              <MessageSquare size={11} /> Commentaires
                            </button>
                          </div>

                          {/* Commentaires */}
                          {commentTask === task.id && (
                            <div className="mt-3 space-y-2">
                              {(comments[task.id] ?? []).map((c, i) => (
                                <div key={i} className="rounded-lg p-2 text-xs" style={{ background: "rgba(255,255,255,0.05)" }}>
                                  <p className="font-semibold mb-0.5" style={{ color: "hsl(183,70%,63%)" }}>{c.profiles?.full_name ?? "Moi"}</p>
                                  <p style={{ color: "rgba(255,255,255,0.70)" }}>{c.content}</p>
                                </div>
                              ))}
                              <div className="flex gap-2 mt-2">
                                <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && addComment(task.id)}
                                  placeholder="Ajouter un commentaire..."
                                  className="flex-1 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }} />
                                <button onClick={() => addComment(task.id)}
                                  className="px-2 py-1.5 rounded-lg text-xs font-semibold"
                                  style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                                  <Check size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Ajouter une tâche */}
            {showAddTask ? (
              <div className="rounded-2xl p-4 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche à ajouter..." autoFocus
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                <div className="flex gap-2">
                  <button onClick={addTask} disabled={addingTask || !newTaskTitle.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                    {addingTask ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Ajouter
                  </button>
                  <button onClick={() => { setShowAddTask(false); setNewTaskTitle(""); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                    <X size={12} /> Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 text-sm transition-colors py-2"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                <Plus size={16} /> Ajouter une tâche
              </button>
            )}
          </>
        )}
      </div>
    </EspaceClientLayout>
  );
}
