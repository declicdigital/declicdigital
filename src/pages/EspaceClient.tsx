import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, FileText, MessageSquare, Upload, Send, Calendar, CheckCircle2, Clock, AlertCircle, Play } from "lucide-react";
import logoImg from "@/assets/logo-declic-digital.webp";

const TASK_STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  a_faire: { label: "A faire", icon: AlertCircle, color: "bg-muted text-muted-foreground" },
  en_cours: { label: "En cours", icon: Play, color: "bg-primary/10 text-primary" },
  en_attente: { label: "En attente", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  termine: { label: "Termine", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600" },
};

interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  sort_order: number;
  project_id: string;
}

interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  uploaded_by: string | null;
}

const EspaceClient = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/connexion");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    // Load project
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", user.id)
      .limit(1);

    const proj = projects?.[0] as Project | undefined;
    setProject(proj || null);

    if (proj) {
      // Load tasks
      const { data: tasksData } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", proj.id)
        .order("sort_order", { ascending: true });
      setTasks((tasksData as Task[]) || []);

      // Load comments for all tasks
      if (tasksData && tasksData.length > 0) {
        const taskIds = tasksData.map((t: any) => t.id);
        const { data: commentsData } = await supabase
          .from("task_comments")
          .select("*")
          .in("task_id", taskIds)
          .order("created_at", { ascending: true });

        const grouped: Record<string, Comment[]> = {};
        (commentsData || []).forEach((c: any) => {
          if (!grouped[c.task_id]) grouped[c.task_id] = [];
          grouped[c.task_id].push(c as Comment);
        });
        setComments(grouped);
      }

      // Load documents
      const { data: docsData } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", proj.id)
        .order("created_at", { ascending: false });
      setDocuments((docsData as Document[]) || []);
    }

    setLoading(false);
  };

  const addComment = async (taskId: string) => {
    if (!user || !newComment[taskId]?.trim()) return;
    const { error } = await supabase.from("task_comments").insert({
      task_id: taskId,
      user_id: user.id,
      content: newComment[taskId].trim(),
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewComment((prev) => ({ ...prev, [taskId]: "" }));
      loadData();
    }
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !project || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${project.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project-documents")
      .upload(path, file);

    if (uploadError) {
      toast({ title: "Erreur d'upload", description: uploadError.message, variant: "destructive" });
    } else {
      await supabase.from("project_documents").insert({
        project_id: project.id,
        name: file.name,
        file_path: path,
        uploaded_by: user.id,
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
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <img src={logoImg} alt="Declic Digital" className="h-8" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
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
              <p className="text-muted-foreground">Aucun projet n'est encore associe a votre compte. Votre projet apparaitra ici des qu'il sera lance.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Project overview */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-primary-foreground/80 mt-1">{project.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Debut : {new Date(project.start_date).toLocaleDateString("fr-FR")}</span>
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">{project.status}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Progression globale</span>
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Suivi des taches ({completedTasks}/{tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune tache pour le moment.</p>
                ) : (
                  tasks.map((task) => {
                    const cfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.a_faire;
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
                            <Icon className="h-3.5 w-3.5" />
                            {cfg.label}
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
                              <div key={c.id} className={`text-sm p-3 rounded-lg ${c.user_id === user?.id ? "bg-primary/10 ml-8" : "bg-card mr-8 border border-border"}`}>
                                <p className="text-foreground">{c.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Ajouter un commentaire..."
                                value={newComment[task.id] || ""}
                                onChange={(e) => setNewComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
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

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents ({documents.length})
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
                  <p className="text-muted-foreground text-sm">Aucun document partage pour le moment.</p>
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
                          {new Date(doc.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
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
    </div>
  );
};

export default EspaceClient;
