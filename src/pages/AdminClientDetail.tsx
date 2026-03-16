import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2, ArrowLeft, Plus, Trash2, FileText, Upload, Send,
  CheckCircle2, Clock, AlertCircle, Play, Users, LogOut, MessageSquare,
  KeyRound, Mail,
} from "lucide-react";
import logoImg from "@/assets/logo-declic-digital.webp";

const TASK_STATUS_OPTIONS = [
  { value: "a_faire", label: "A faire" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "termine", label: "Termine" },
];

const TASK_STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  a_faire: { label: "A faire", icon: AlertCircle, color: "bg-muted text-muted-foreground" },
  en_cours: { label: "En cours", icon: Play, color: "bg-primary/10 text-primary" },
  en_attente: { label: "En attente", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  termine: { label: "Termine", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600" },
};

const AdminClientDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  const [client, setClient] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  // New project
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  // Account management
  const [emailDraft, setEmailDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  // Comments
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/connexion");
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin && clientId) loadAll();
  }, [isAdmin, clientId]);

  const loadAll = async () => {
    setLoading(true);

    // Step 1: profile + project in parallel
    const [{ data: profile }, { data: projects }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", clientId).single(),
      supabase.from("projects").select("*").eq("client_id", clientId).limit(1),
    ]);

    setClient(profile);
    setEmailDraft(profile?.email || "");
    setNameDraft(profile?.full_name || "");

    const proj = projects?.[0] || null;
    setProject(proj);

    if (proj) {
      // Step 2: tasks + documents in parallel
      const [{ data: tasksData }, { data: docsData }] = await Promise.all([
        supabase.from("project_tasks").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
        supabase.from("project_documents").select("*").eq("project_id", proj.id).order("created_at", { ascending: false }),
      ]);

      setTasks(tasksData || []);
      setDocuments(docsData || []);

      // Step 3: comments if tasks exist
      if (tasksData && tasksData.length > 0) {
        const taskIds = tasksData.map((t: any) => t.id);
        const { data: commentsData } = await supabase
          .from("task_comments")
          .select("*")
          .in("task_id", taskIds)
          .order("created_at", { ascending: true });

        const grouped: Record<string, any[]> = {};
        (commentsData || []).forEach((c: any) => {
          if (!grouped[c.task_id]) grouped[c.task_id] = [];
          grouped[c.task_id].push(c);
        });
        setComments(grouped);
      }
    }

    setLoading(false);
  };

  const updateClientAccount = async () => {
    if (!clientId || !emailDraft.trim()) {
      toast({ title: "Erreur", description: "Email requis", variant: "destructive" });
      return;
    }

    setSavingAccount(true);
    const { data, error } = await supabase.functions.invoke("admin-manage-client", {
      body: {
        action: "update_email",
        user_id: clientId,
        email: emailDraft.trim(),
        full_name: nameDraft.trim(),
      },
    });
    setSavingAccount(false);

    if (error || !data?.success) {
      toast({
        title: "Erreur",
        description: data?.error || error?.message || "Impossible de mettre à jour le compte client.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Compte client mis à jour" });
    loadAll();
  };

  const sendClientResetPassword = async () => {
    if (!clientId || !emailDraft.trim()) {
      toast({ title: "Erreur", description: "Email client requis", variant: "destructive" });
      return;
    }

    setSendingReset(true);
    const { data, error } = await supabase.functions.invoke("admin-manage-client", {
      body: {
        action: "send_reset_password",
        user_id: clientId,
        email: emailDraft.trim(),
      },
    });
    setSendingReset(false);

    if (error || !data?.success) {
      toast({
        title: "Erreur",
        description: data?.error || error?.message || "Impossible d'envoyer l'email de réinitialisation.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Email envoyé", description: "Le client a reçu un lien pour définir son mot de passe." });
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    const { error } = await supabase.from("projects").insert({
      client_id: clientId,
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
    });
    setCreatingProject(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setProjectDialogOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      loadAll();
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !project) return;
    setAddingTask(true);
    const { error } = await supabase.from("project_tasks").insert({
      project_id: project.id,
      title: newTaskTitle.trim(),
      sort_order: tasks.length,
    });
    setAddingTask(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setNewTaskTitle("");
      loadAll();
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    await supabase.from("project_tasks").update({ status } as any).eq("id", taskId);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from("project_tasks").delete().eq("id", taskId);
    loadAll();
  };

  const updateProjectStatus = async (status: string) => {
    if (!project) return;
    await supabase.from("projects").update({ status }).eq("id", project.id);
    setProject((prev: any) => ({ ...prev, status }));
  };

  const addComment = async (taskId: string) => {
    if (!user || !newComment[taskId]?.trim()) return;
    await supabase.from("task_comments").insert({
      task_id: taskId,
      user_id: user.id,
      content: newComment[taskId].trim(),
    });
    setNewComment((prev) => ({ ...prev, [taskId]: "" }));
    loadAll();
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !project || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${project.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("project-documents").upload(path, file);
    if (uploadError) {
      toast({ title: "Erreur", description: uploadError.message, variant: "destructive" });
    } else {
      await supabase.from("project_documents").insert({
        project_id: project.id,
        name: file.name,
        file_path: path,
        uploaded_by: user.id,
      });
      loadAll();
    }
    setUploading(false);
    e.target.value = "";
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    await supabase.storage.from("project-documents").remove([filePath]);
    await supabase.from("project_documents").delete().eq("id", docId);
    loadAll();
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
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="Declic Digital" className="h-8" />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">ADMIN</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/clients")}>
              <Users className="h-4 w-4 mr-1" /> Clients
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/soumissions")}>
              <FileText className="h-4 w-4 mr-1" /> Formulaires
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Deconnexion
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8 max-w-5xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/clients")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux clients
        </Button>

        {/* Client info */}
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {client?.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{client?.full_name}</h1>
              <p className="text-sm text-muted-foreground">{client?.email}</p>
              <p className="text-xs text-muted-foreground">
                Client depuis le {new Date(client?.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestion du compte client */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Compte client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom du client</Label>
                <Input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="Nom complet" />
              </div>
              <div className="space-y-2">
                <Label>Email de connexion</Label>
                <Input type="email" value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} placeholder="client@email.com" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={updateClientAccount} disabled={savingAccount}>
                {savingAccount ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Mettre à jour email/nom
              </Button>

              <Button variant="outline" onClick={sendClientResetPassword} disabled={sendingReset}>
                {sendingReset ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <KeyRound className="h-4 w-4 mr-2" />}
                Envoyer lien de mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project */}
        {!project ? (
          <Card>
            <CardContent className="py-8 text-center space-y-4">
              <p className="text-muted-foreground">Aucun projet associe a ce client.</p>
              <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-1" /> Creer un projet</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau projet pour {client?.full_name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Nom du projet *</Label>
                      <Input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Site vitrine entreprise" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="Creation d'un site vitrine..." />
                    </div>
                    <Button onClick={createProject} disabled={creatingProject} className="w-full">
                      {creatingProject && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Creer le projet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Project header */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <p className="text-primary-foreground/80 mt-1">{project.description}</p>
                  </div>
                  <Select value={project.status} onValueChange={updateProjectStatus}>
                    <SelectTrigger className="w-40 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="En pause">En pause</SelectItem>
                      <SelectItem value="Termine">Termine</SelectItem>
                      <SelectItem value="En ligne">En ligne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taches du projet ({tasks.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map((task) => {
                  const cfg = TASK_STATUS_CONFIG[task.status] || TASK_STATUS_CONFIG.a_faire;
                  const Icon = cfg.icon;
                  const taskComments = comments[task.id] || [];
                  const isExpanded = expandedTask === task.id;

                  return (
                    <div key={task.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-3 p-3">
                        <Select value={task.status} onValueChange={(v) => updateTaskStatus(task.id, v)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TASK_STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span
                          className="text-sm font-medium text-foreground flex-1 cursor-pointer"
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        >
                          {task.title}
                        </span>
                        {taskComments.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                            <MessageSquare className="h-3.5 w-3.5" /> {taskComments.length}
                          </span>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                          {taskComments.map((c: any) => (
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
                })}

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Nouvelle tache..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                  <Button onClick={addTask} disabled={addingTask}>
                    {addingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents ({documents.length})
                  </CardTitle>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                        Ajouter
                      </span>
                    </Button>
                    <input type="file" className="hidden" onChange={uploadDocument} />
                  </label>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun document.</p>
                ) : (
                  documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <button onClick={() => downloadDoc(doc.file_path)} className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteDocument(doc.id, doc.file_path)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AdminClientDetail;
