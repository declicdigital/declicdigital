import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, FileText, MessageSquare, Upload, Send, Calendar, CheckCircle2, Clock, AlertCircle, Play, Plus, Globe } from "lucide-react";
import logoImg from "@/assets/logo-declic-transparent.png";
import ProjectTimeline from "@/components/espace-client/ProjectTimeline";
import ProjectInvoices from "@/components/espace-client/ProjectInvoices";
import ProjectChat from "@/components/espace-client/ProjectChat";

const STATUS_CFG: Record<string, { label: string; icon: any; color: string }> = {
  a_faire: { label: "A faire", icon: AlertCircle, color: "bg-muted text-muted-foreground" },
  en_cours: { label: "En cours", icon: Play, color: "bg-primary/10 text-primary" },
  en_attente: { label: "En attente", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  termine: { label: "Termine", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600" },
};

const EspaceClient = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/connexion", { replace: true });
    if (!authLoading && user && isAdmin) navigate("/admin/clients", { replace: true });
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: projects } = await supabase.from("projects").select("*").eq("client_id", user.id).limit(1);
      const proj = projects?.[0] ?? null;
      setProject(proj);

      if (proj) {
        const [{ data: tasksData }, { data: docsData }, { data: milestonesData }, { data: invoicesData }] = await Promise.all([
          supabase.from("project_tasks").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
          supabase.from("project_documents").select("*").eq("project_id", proj.id).order("created_at", { ascending: false }),
          supabase.from("project_milestones").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
          (supabase.from("project_invoices") as any).select("*").eq("project_id", proj.id).order("created_at", { ascending: false }),
        ]);
        setTasks(tasksData || []);
        setDocuments(docsData || []);
        setMilestones(milestonesData || []);
        setInvoices(invoicesData || []);

        if (tasksData && tasksData.length > 0) {
          const { data: commentsData } = await supabase
            .from("task_comments").select("*")
            .in("task_id", tasksData.map((t: any) => t.id))
            .order("created_at", { ascending: true });
          const grouped: Record<string, any[]> = {};
          (commentsData || []).forEach((c: any) => {
            if (!grouped[c.task_id]) grouped[c.task_id] = [];
            grouped[c.task_id].push(c);
          });
          setComments(grouped);
        }
      }
    } catch (err) {
      console.error("loadData error:", err);
    }
    setLoading(false);
  };

  const addComment = async (taskId: string) => {
    if (!user || !newComment[taskId]?.trim()) return;
    const { error } = await supabase.from("task_comments").insert({
      task_id: taskId, user_id: user.id, content: newComment[taskId].trim(),
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewComment((p) => ({ ...p, [taskId]: "" }));
      loadData();
    }
  };

  const addTask = async () => {
    if (!user || !project || !newTaskTitle.trim()) return;
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.sort_order)) + 1 : 0;
    const { error } = await supabase.from("project_tasks").insert({
      project_id: project.id,
      title: newTaskTitle.trim(),
      status: "a_faire",
      sort_order: maxOrder,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewTaskTitle("");
      setShowAddTask(false);
      toast({ title: "Tache ajoutee" });
      loadData();
    }
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !project || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${project.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("project-documents").upload(path, file);
    if (upErr) {
      toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
    } else {
      await supabase.from("project_documents").insert({
        project_id: project.id, name: file.name, file_path: path, uploaded_by: user.id,
      });
      toast({ title: "Fichier ajoute" });
      loadData();
    }
    setUploading(false);
    e.target.value = "";
  };

  const downloadDoc = async (path: string) => {
    const { data } = await supabase.storage.from("project-documents").createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "termine").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <img
            src={logoImg}
            alt="Declic Digital"
            className="h-12 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl space-y-6">
        {!project ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucun projet n'est encore associe a votre compte.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Project header */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-primary-foreground/80 mt-1">{project.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Debut : {new Date(project.start_date).toLocaleDateString("fr-FR")}
                  </span>
                  {project.website_url && project.website_url.trim() !== "" && (
                    <a
                      href={project.website_url.startsWith("http") ? project.website_url : `https://${project.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 underline hover:text-primary-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4" /> {project.website_url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                    {project.status}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <ProjectTimeline milestones={milestones} />

            {/* Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Suivi des taches ({completedTasks}/{tasks.length})
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddTask(!showAddTask)}>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {showAddTask && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Titre de la tache..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={addTask} disabled={!newTaskTitle.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune tache pour le moment.</p>
                ) : (
                  tasks.map((task) => {
                    const cfg = STATUS_CFG[task.status] || STATUS_CFG.a_faire;
                    const Icon = cfg.icon;
                    const taskComments = comments[task.id] || [];
                    const isExpanded = expandedTask === task.id;
                    return (
                      <div key={task.id} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            <Icon className="h-3.5 w-3.5" /> {cfg.label}
                          </div>
                          <span className="text-sm font-medium text-foreground flex-1">{task.title}</span>
                          {taskComments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3.5 w-3.5" /> {taskComments.length}
                            </span>
                          )}
                        </button>
                        {isExpanded && (
                          <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                            {taskComments.map((c) => (
                              <div
                                key={c.id}
                                className={`text-sm p-3 rounded-lg ${
                                  c.user_id === user?.id ? "bg-primary/10 ml-8" : "bg-card mr-8 border border-border"
                                }`}
                              >
                                <p className="text-foreground">{c.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(c.created_at).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Ajouter un commentaire..."
                                value={newComment[task.id] || ""}
                                onChange={(e) => setNewComment((p) => ({ ...p, [task.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && addComment(task.id)}
                                className="flex-1"
                              />
                              <Button size="icon" onClick={() => addComment(task.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Invoices */}
            <ProjectInvoices
              invoices={invoices}
              projectId={project.id}
              userId={user?.id || ""}
              onRefresh={loadData}
            />

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" /> Documents ({documents.length})
                  </CardTitle>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild disabled={uploading}>
                      <span>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                        Ajouter un fichier
                      </span>
                    </Button>
                    <input type="file" className="hidden" onChange={uploadDocument} />
                  </label>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun document partage.</p>
                ) : (
                  documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => downloadDoc(doc.file_path)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left"
                    >
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Floating chat */}
      {project && (
        <ProjectChat projectId={project.id} userId={user?.id || ""} />
      )}
    </div>
  );
};

export default EspaceClient;
