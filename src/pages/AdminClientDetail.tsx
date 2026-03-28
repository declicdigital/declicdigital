import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Loader2, ArrowLeft, Plus, Trash2, FileText, Upload, Send,
  CheckCircle2, Clock, AlertCircle, Play, Users, LogOut, MessageSquare,
  KeyRound, Mail, Globe, Save, Paperclip, Share2, Pencil, Check, X, FolderOpen,
} from "lucide-react";
import logoImg from "@/assets/logo-declic-digital-new.webp";
import ProjectChat from "@/components/espace-client/ProjectChat";
import PageSpeedScores from "@/components/PageSpeedScores";

const STATUS_PRIORITY: Record<string, number> = {
  a_faire_client: 0,
  a_faire_dd: 1,
  en_cours: 2,
  termine: 3,
};

const getStatusOptions = (projectName: string) => [
  { value: "a_faire_client", label: `A faire par ${projectName}` },
  { value: "a_faire_dd", label: "A faire par D.D" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Termine" },
];

const getStatusCfg = (projectName: string): Record<string, { label: string; icon: any; color: string; bg: string }> => ({
  a_faire_dd: { label: "A faire par D.D", icon: AlertCircle, color: "bg-[#e91e63]/10 text-[#e91e63]", bg: "bg-[#e91e63]/5 border-[#e91e63]/20" },
  a_faire_client: { label: `A faire par ${projectName}`, icon: Clock, color: "bg-emerald-500/10 text-emerald-600", bg: "bg-emerald-500/5 border-emerald-500/20" },
  en_cours: { label: "En cours", icon: Play, color: "bg-blue-500/10 text-blue-600", bg: "bg-blue-500/5 border-blue-500/20" },
  termine: { label: "Termine", icon: CheckCircle2, color: "bg-muted text-muted-foreground", bg: "bg-muted/30 border-border" },
});

interface ProjectMessage {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  const [client, setClient] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [attachments, setAttachments] = useState<Record<string, any[]>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [renamingDocId, setRenamingDocId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renamingAttId, setRenamingAttId] = useState<string | null>(null);
  const [renameAttValue, setRenameAttValue] = useState("");
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState("");
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/connexion", { replace: true });
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin && clientId) loadAll();
  }, [isAdmin, clientId]);

  const loadAll = async () => {
    if (!initialLoadDone.current) setLoading(true);
    try {
      const [{ data: profile }, { data: projects }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", clientId).single(),
        supabase.from("projects").select("*").eq("client_id", clientId).limit(1),
      ]);

      setClient(profile);
      setEmailDraft(profile?.email || "");
      setNameDraft(profile?.full_name || "");
      const proj = projects?.[0] || null;
      setProject(proj);
      setWebsiteUrl(proj?.website_url || "");
      setDriveUrl((proj as any)?.drive_url || "");

      if (proj) {
        const [{ data: tasksData }, { data: docsData }] = await Promise.all([
          supabase.from("project_tasks").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
          supabase.from("project_documents").select("*").eq("project_id", proj.id).order("created_at", { ascending: false }),
        ]);
        setTasks(tasksData || []);
        setDocuments(docsData || []);

        if (tasksData && tasksData.length > 0) {
          const taskIds = tasksData.map((t: any) => t.id);
          const [{ data: commentsData }, { data: attachData }] = await Promise.all([
            supabase.from("task_comments").select("*").in("task_id", taskIds).order("created_at", { ascending: true }),
            supabase.from("task_attachments" as any).select("*").in("task_id", taskIds).order("created_at", { ascending: false }),
          ]);
          const grouped: Record<string, any[]> = {};
          (commentsData || []).forEach((c: any) => {
            if (!grouped[c.task_id]) grouped[c.task_id] = [];
            grouped[c.task_id].push(c);
          });
          setComments(grouped);
          const groupedAtt: Record<string, any[]> = {};
          ((attachData as any[]) || []).forEach((a: any) => {
            if (!groupedAtt[a.task_id]) groupedAtt[a.task_id] = [];
            groupedAtt[a.task_id].push(a);
          });
          setAttachments(groupedAtt);
        }
      }
    } catch (err) {
      console.error("loadAll error:", err);
    }
    setLoading(false);
    initialLoadDone.current = true;
  };

  const updateClientAccount = async () => {
    if (!clientId || !emailDraft.trim()) return;
    setSavingAccount(true);
    const { data, error } = await supabase.functions.invoke("admin-manage-client", {
      body: { action: "update_email", user_id: clientId, email: emailDraft.trim(), full_name: nameDraft.trim() },
    });
    setSavingAccount(false);
    if (error || !data?.success) {
      toast({ title: "Erreur", description: data?.error || error?.message || "Erreur", variant: "destructive" });
    } else {
      toast({ title: "Compte mis a jour" });
      loadAll();
    }
  };

  const sendResetPassword = async () => {
    if (!clientId || !emailDraft.trim()) return;
    setSendingReset(true);
    const { data, error } = await supabase.functions.invoke("admin-manage-client", {
      body: { action: "send_reset_password", user_id: clientId, email: emailDraft.trim() },
    });
    setSendingReset(false);
    if (error || !data?.success) {
      toast({ title: "Erreur", description: data?.error || error?.message || "Erreur", variant: "destructive" });
    } else {
      toast({ title: "Email envoye" });
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    const { error } = await supabase.from("projects").insert({ client_id: clientId, name: newProjectName.trim(), description: newProjectDesc.trim() });
    setCreatingProject(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setProjectDialogOpen(false); setNewProjectName(""); setNewProjectDesc(""); loadAll(); }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !project) return;
    setAddingTask(true);
    const { error } = await supabase.from("project_tasks").insert({ project_id: project.id, title: newTaskTitle.trim(), sort_order: tasks.length });
    setAddingTask(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { setNewTaskTitle(""); loadAll(); }
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

  const saveProjectName = async () => {
    if (!project || !projectNameDraft.trim()) return;
    const { error } = await supabase.from("projects").update({ name: projectNameDraft.trim() }).eq("id", project.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setProject((prev: any) => ({ ...prev, name: projectNameDraft.trim() }));
      toast({ title: "Nom du projet mis a jour" });
    }
    setEditingProjectName(false);
  };

  const addComment = async (taskId: string) => {
    if (!user || !newComment[taskId]?.trim()) return;
    await supabase.from("task_comments").insert({ task_id: taskId, user_id: user.id, content: newComment[taskId].trim() });
    setNewComment((p) => ({ ...p, [taskId]: "" }));
    loadAll();
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !project || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${project.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("project-documents").upload(path, file);
    if (upErr) { toast({ title: "Erreur", description: upErr.message, variant: "destructive" }); }
    else { await supabase.from("project_documents").insert({ project_id: project.id, name: file.name, file_path: path, uploaded_by: user.id }); loadAll(); }
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

  const startRename = (doc: { id: string; name: string }) => {
    setRenamingDocId(doc.id);
    setRenameValue(doc.name);
  };

  const confirmRename = async () => {
    if (!renamingDocId || !renameValue.trim()) return;
    const { error } = await supabase.from("project_documents").update({ name: renameValue.trim() }).eq("id", renamingDocId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fichier renomme" });
      loadAll();
    }
    setRenamingDocId(null);
  };

  const startRenameAtt = (att: { id: string; file_name: string }) => {
    setRenamingAttId(att.id);
    setRenameAttValue(att.file_name);
  };

  const confirmRenameAtt = async () => {
    if (!renamingAttId || !renameAttValue.trim()) return;
    const { error } = await (supabase.from("task_attachments" as any) as any).update({ file_name: renameAttValue.trim() }).eq("id", renamingAttId);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fichier renomme" });
      loadAll();
    }
    setRenamingAttId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9));
  const completedTasks = tasks.filter((t) => t.status === "termine").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex h-[4.5rem] md:h-20 items-center justify-between">
          <div className="flex items-center gap-4 -my-2">
            <img src={logoImg} alt="Declic Digital" className="h-32 md:h-36 w-auto cursor-pointer" onClick={() => navigate("/admin/clients")} />
            <span className="hidden sm:inline text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">ADMIN</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/admin/clients")}><Users className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline"> Clients</span></Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={() => navigate("/admin/soumissions")}><FileText className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline"> Formulaires</span></Button>
            <Button variant="ghost" size="sm" className="px-2 sm:px-3" onClick={signOut}><LogOut className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline"> Deconnexion</span></Button>
          </nav>
        </div>
      </header>

      <div className="container py-4 sm:py-8 max-w-5xl space-y-4 sm:space-y-6 px-3 sm:px-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/clients")}><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Button>

        {/* Client info */}
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {client?.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{client?.full_name}</h1>
              <p className="text-sm text-muted-foreground">{client?.email}</p>
              <p className="text-xs text-muted-foreground">Client depuis le {new Date(client?.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account management */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Compte client</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2"><Label>Nom</Label><Input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} /></div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Button size="sm" onClick={updateClientAccount} disabled={savingAccount} className="w-full sm:w-auto">
                {savingAccount && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Mettre a jour
              </Button>
              <Button variant="outline" size="sm" onClick={sendResetPassword} disabled={sendingReset} className="w-full sm:w-auto">
                {sendingReset ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <KeyRound className="h-4 w-4 mr-2" />} Envoyer lien mdp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project */}
        {!project ? (
          <Card>
            <CardContent className="py-8 text-center space-y-4">
              <p className="text-muted-foreground">Aucun projet associe.</p>
              <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Creer un projet</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nouveau projet</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2"><Label>Nom *</Label><Input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Input value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} /></div>
                    <Button onClick={createProject} disabled={creatingProject} className="w-full">
                      {creatingProject && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Creer
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
              <div className="gradient-miami p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {editingProjectName ? (
                        <>
                          <Input
                            value={projectNameDraft}
                            onChange={(e) => setProjectNameDraft(e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-8 text-base sm:text-lg font-bold w-full sm:w-48"
                            onKeyDown={(e) => { if (e.key === "Enter") saveProjectName(); if (e.key === "Escape") setEditingProjectName(false); }}
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20 shrink-0" onClick={saveProjectName}><Check className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20 shrink-0" onClick={() => setEditingProjectName(false)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <h2 className="text-lg sm:text-xl font-bold truncate">{project.name}</h2>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/20 shrink-0" onClick={() => { setProjectNameDraft(project.name); setEditingProjectName(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        </>
                      )}
                    </div>
                    <p className="text-primary-foreground/80 mt-1 text-sm">{project.description}</p>
                    <PageSpeedScores url={project.website_url || ""} />
                  </div>
                  <div className="flex items-center gap-2">
                    {project.share_token && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30"
                        onClick={() => {
                          const url = `${window.location.origin}/projet/${project.share_token}`;
                          navigator.clipboard.writeText(url);
                          toast({ title: "Lien copie !" });
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-1" /> Partager
                      </Button>
                    )}
                    <Select value={project.status} onValueChange={updateProjectStatus}>
                    <SelectTrigger className="w-32 sm:w-40 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="En pause">En pause</SelectItem>
                      <SelectItem value="Termine">Termine</SelectItem>
                      <SelectItem value="En ligne">En ligne</SelectItem>
                    </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="https://exemple.fr"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      const { error } = await supabase.from("projects").update({ website_url: websiteUrl }).eq("id", project.id);
                      if (error) {
                        toast({ title: "Erreur", description: error.message, variant: "destructive" });
                      } else {
                        toast({ title: "URL du site mise a jour" });
                        setProject({ ...project, website_url: websiteUrl });
                      }
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" /> Sauvegarder
                  </Button>
                </div>
                {project.website_url && project.website_url.trim() !== "" && (
                  <a
                    href={project.website_url.startsWith("http") ? project.website_url : `https://${project.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> {project.website_url.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      const { error } = await (supabase.from("projects") as any).update({ drive_url: driveUrl }).eq("id", project.id);
                      if (error) {
                        toast({ title: "Erreur", description: error.message, variant: "destructive" });
                      } else {
                        toast({ title: "Lien Drive mis a jour" });
                        setProject({ ...project, drive_url: driveUrl });
                      }
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" /> Sauvegarder
                  </Button>
                </div>
                {(project as any).drive_url && (project as any).drive_url.trim() !== "" && (
                  <a
                    href={(project as any).drive_url.startsWith("http") ? (project as any).drive_url : `https://${(project as any).drive_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <FolderOpen className="h-3.5 w-3.5" /> Lien Drive
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Taches ({tasks.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 mb-3">
                  <Input placeholder="Nouvelle tache..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} className="flex-1" />
                  <Button onClick={addTask} disabled={addingTask}>{addingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</Button>
                </div>
                {sortedTasks.map((task) => {
                  const statusCfg = getStatusCfg(project.name);
                  const cfg = statusCfg[task.status] || statusCfg.a_faire_dd;
                  const Icon = cfg.icon;
                  const taskComments = comments[task.id] || [];
                  const taskAttachments = attachments[task.id] || [];
                  const isExpanded = expandedTask === task.id;
                  const statusOptions = getStatusOptions(project.name);
                  return (
                    <div key={task.id} className={`border rounded-lg overflow-hidden ${cfg.bg}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3">
                        <Select value={task.status} onValueChange={(v) => updateTaskStatus(task.id, v)}>
                          <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button onClick={() => setExpandedTask(isExpanded ? null : task.id)} className="flex-1 text-sm font-medium text-foreground text-left hover:text-primary transition-colors truncate">
                            {task.title}
                          </button>
                          {(taskComments.length > 0 || taskAttachments.length > 0) && (
                            <span className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                              {taskComments.length > 0 && <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {taskComments.length}</span>}
                              {taskAttachments.length > 0 && <span className="flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {taskAttachments.length}</span>}
                            </span>
                          )}
                          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 shrink-0" onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-muted/20 space-y-3">
                          {/* Attachments */}
                          {taskAttachments.length > 0 && (
                            <div className="space-y-1">
                              {taskAttachments.map((att: any) => (
                                <div key={att.id} className="flex items-center gap-2">
                                  {renamingAttId === att.id ? (
                                    <div className="flex items-center gap-1 flex-1">
                                      <Input
                                        value={renameAttValue}
                                        onChange={(e) => setRenameAttValue(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") confirmRenameAtt(); if (e.key === "Escape") setRenamingAttId(null); }}
                                        className="h-7 text-xs flex-1"
                                        autoFocus
                                      />
                                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={confirmRenameAtt}>
                                        <Check className="h-3 w-3 text-emerald-600" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setRenamingAttId(null)}>
                                        <X className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={async () => {
                                          const { data } = await supabase.storage.from("project-documents").createSignedUrl(att.file_path, 3600);
                                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                                        }}
                                        className="flex items-center gap-2 text-xs text-primary hover:underline"
                                      >
                                        <Paperclip className="h-3 w-3" /> {att.file_name}
                                      </button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startRenameAtt(att)}>
                                        <Pencil className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={async () => {
                                        await supabase.storage.from("project-documents").remove([att.file_path]);
                                        await (supabase.from("task_attachments" as any) as any).delete().eq("id", att.id);
                                        loadAll();
                                      }}><Trash2 className="h-3 w-3" /></Button>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {taskComments.map((c) => (
                            <div key={c.id} className="text-sm p-3 rounded-lg bg-card border border-border">
                              <p className="text-foreground whitespace-pre-wrap break-words">{c.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input placeholder="Commentaire..." value={newComment[task.id] || ""} onChange={(e) => setNewComment((p) => ({ ...p, [task.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addComment(task.id)} className="flex-1" />
                            <label className="cursor-pointer">
                              <Button variant="outline" size="icon" asChild>
                                <span><Paperclip className="h-4 w-4" /></span>
                              </Button>
                              <input type="file" className="hidden" onChange={async (e) => {
                                if (!e.target.files || !user || !project) return;
                                const file = e.target.files[0];
                                const path = `${project.id}/tasks/${task.id}/${Date.now()}_${file.name}`;
                                const { error: upErr } = await supabase.storage.from("project-documents").upload(path, file);
                                if (upErr) {
                                  toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
                                } else {
                                  await (supabase.from("task_attachments" as any) as any).insert({
                                    task_id: task.id, uploaded_by: user.id, file_name: file.name, file_path: path,
                                  });
                                  toast({ title: "Fichier ajoute" });
                                  loadAll();
                                }
                                e.target.value = "";
                              }} />
                            </label>
                            <Button size="icon" onClick={() => addComment(task.id)}><Send className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Documents ({documents.length})</CardTitle>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild disabled={uploading}>
                      <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />} Ajouter</span>
                    </Button>
                    <input type="file" className="hidden" onChange={uploadDocument} />
                  </label>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.length === 0 ? <p className="text-muted-foreground text-sm">Aucun document.</p> : documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <button onClick={() => downloadDoc(doc.file_path)} className="flex-1 flex items-center gap-3 text-left hover:text-primary transition-colors min-w-0">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        {renamingDocId === doc.id ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenamingDocId(null); }}
                              className="h-7 text-sm"
                              autoFocus
                              onClick={(e) => e.preventDefault()}
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.preventDefault(); confirmRename(); }}>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.preventDefault(); setRenamingDocId(null); }}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString("fr-FR")}</p>
                          </>
                        )}
                      </div>
                    </button>
                    {renamingDocId !== doc.id && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => startRename(doc)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteDocument(doc.id, doc.file_path)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recap taches a faire par D.D */}
            {tasks.filter((t) => t.status === "a_faire_dd").length > 0 && (
              <Card className="border-[#e91e63]/30 bg-[#e91e63]/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-[#e91e63]" /> A faire par D.D ({tasks.filter((t) => t.status === "a_faire_dd").length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tasks.filter((t) => t.status === "a_faire_dd").map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-[#e91e63]/20">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-[#e91e63] shrink-0" />
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Floating chat */}
      {project && (
        <ProjectChat
          projectId={project.id}
          userId={user?.id || ""}
          isAdmin
          contactName={client?.full_name || "Client"}
          contactInitials={client?.full_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "CL"}
        />
      )}
    </div>
  );
};

export default AdminClientDetail;
