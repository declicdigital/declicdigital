import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Loader2, FileText, MessageSquare, Upload, Send, Calendar,
  CheckCircle2, Clock, AlertCircle, Play, Plus, Globe, Paperclip,
  FolderOpen, Pencil, Check, X,
} from "lucide-react";
import logoImg from "@/assets/logo-declic-digital-new.png";
import ProjectTimeline from "@/components/espace-client/ProjectTimeline";

const STATUS_PRIORITY: Record<string, number> = {
  a_faire_client: 0,
  a_faire_dd: 1,
  en_cours: 2,
  termine: 3,
};

const getStatusCfg = (projectName: string): Record<string, { label: string; icon: any; color: string; bg: string }> => ({
  a_faire_dd: { label: "A faire par D.D", icon: AlertCircle, color: "bg-[#e91e63]/10 text-[#e91e63]", bg: "bg-[#e91e63]/5 border-[#e91e63]/20" },
  a_faire_client: { label: `A faire par ${projectName}`, icon: Clock, color: "bg-emerald-500/10 text-emerald-600", bg: "bg-emerald-500/5 border-emerald-500/20" },
  en_cours: { label: "En cours", icon: Play, color: "bg-blue-500/10 text-blue-600", bg: "bg-blue-500/5 border-blue-500/20" },
  termine: { label: "Termine", icon: CheckCircle2, color: "bg-muted text-muted-foreground", bg: "bg-muted/30 border-border" },
});

const SharedProject = () => {
  const { token } = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [attachments, setAttachments] = useState<Record<string, any[]>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [renamingAttId, setRenamingAttId] = useState<string | null>(null);
  const [renameAttValue, setRenameAttValue] = useState("");
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    if (!initialLoadDone.current) setLoading(true);
    try {
      const { data: projects } = await (supabase.from("projects") as any).select("*").eq("share_token", token).limit(1);
      const proj = projects?.[0] ?? null;
      if (!proj) { setNotFound(true); setLoading(false); return; }
      setProject(proj);

      const [{ data: tasksData }, { data: docsData }, { data: milestonesData }] = await Promise.all([
        supabase.from("project_tasks").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
        supabase.from("project_documents").select("*").eq("project_id", proj.id).order("created_at", { ascending: false }),
        supabase.from("project_milestones").select("*").eq("project_id", proj.id).order("sort_order", { ascending: true }),
      ]);
      setTasks(tasksData || []);
      setDocuments(docsData || []);
      setMilestones(milestonesData || []);

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
    } catch (err) {
      console.error("loadData error:", err);
    }
    setLoading(false);
    initialLoadDone.current = true;
  };

  const addTask = async () => {
    if (!project || !newTaskTitle.trim()) return;
    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.sort_order)) + 1 : 0;
    const { error } = await supabase.from("project_tasks").insert({
      project_id: project.id,
      title: newTaskTitle.trim(),
      status: "a_faire_dd" as any,
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
    if (!e.target.files || !project) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${project.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("project-documents").upload(path, file);
    if (upErr) {
      toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
    } else {
      await supabase.from("project_documents").insert({
        project_id: project.id, name: file.name, file_path: path,
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
      loadData();
    }
    setRenamingAttId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Lien de partage invalide.</p></CardContent></Card>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9));
  const completedTasks = tasks.filter((t) => t.status === "termine").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <img src={logoImg} alt="Declic Digital" className="h-20 md:h-24" />
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">ACCES PARTAGE</span>
        </div>
      </header>

      <div className="container py-8 max-w-4xl space-y-6">
        {/* Project header */}
        <Card className="overflow-hidden">
          <div className="gradient-miami p-6 text-white">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-primary-foreground/80 mt-1">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-primary-foreground/70">
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
              {(project as any).drive_url && (project as any).drive_url.trim() !== "" && (
                <a
                  href={(project as any).drive_url.startsWith("http") ? (project as any).drive_url : `https://${(project as any).drive_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 underline hover:text-primary-foreground transition-colors"
                >
                  <FolderOpen className="h-4 w-4" /> Lien Drive
                </a>
              )}
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
              sortedTasks.map((task) => {
                const statusCfg = getStatusCfg(project.name);
                const cfg = statusCfg[task.status] || statusCfg.a_faire_dd;
                const Icon = cfg.icon;
                const taskComments = comments[task.id] || [];
                const taskAttachments = attachments[task.id] || [];
                const isExpanded = expandedTask === task.id;
                const canMarkDone = task.status === "a_faire_client";
                return (
                  <div key={task.id} className={`border rounded-lg overflow-hidden ${cfg.bg}`}>
                    <button
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-muted/10 transition-colors text-left"
                    >
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="h-3.5 w-3.5" /> {cfg.label}
                      </div>
                      <span className="text-sm font-medium text-foreground flex-1">{task.title}</span>
                      {canMarkDone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await supabase.from("project_tasks").update({ status: "a_faire_dd" } as any).eq("id", task.id);
                            loadData();
                          }}
                        >
                          Marquer fait
                        </Button>
                      )}
                      {(taskComments.length > 0 || taskAttachments.length > 0) && (
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {taskComments.length > 0 && <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {taskComments.length}</span>}
                          {taskAttachments.length > 0 && <span className="flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {taskAttachments.length}</span>}
                        </span>
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border p-4 bg-background/50 space-y-3">
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
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {taskComments.map((c) => (
                          <div key={c.id} className="text-sm p-3 rounded-lg bg-card border border-border">
                            <p className="text-foreground">{c.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <Button variant="outline" size="icon" asChild>
                              <span><Paperclip className="h-4 w-4" /></span>
                            </Button>
                            <input type="file" className="hidden" onChange={async (ev) => {
                              if (!ev.target.files || !project) return;
                              const file = ev.target.files[0];
                              const path = `${project.id}/tasks/${task.id}/${Date.now()}_${file.name}`;
                              const { error: upErr } = await supabase.storage.from("project-documents").upload(path, file);
                              if (upErr) {
                                toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
                              } else {
                                await (supabase.from("task_attachments" as any) as any).insert({
                                  task_id: task.id, file_name: file.name, file_path: path, uploaded_by: "00000000-0000-0000-0000-000000000000",
                                });
                                toast({ title: "Fichier ajoute" });
                                loadData();
                              }
                              ev.target.value = "";
                            }} />
                          </label>
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
                    <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharedProject;
