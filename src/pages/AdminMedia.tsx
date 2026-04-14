import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Image as ImageIcon,
  FileText,
  Film,
  Trash2,
  Copy,
  Pencil,
  Upload,
  Check,
  X,
  Search,
  Grid3X3,
  List,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { compressImage, UPLOAD_OPTIONS } from "@/lib/imageCompression";

const BUCKET = "cms-images";

interface StorageFile {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: { size?: number; mimetype?: string } | null;
}

function getFileType(name: string, mime?: string): "image" | "video" | "pdf" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (mime?.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)) return "image";
  if (mime?.startsWith("video/") || ["mp4", "webm", "mov", "avi"].includes(ext)) return "video";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  return "other";
}

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function FileIcon({ type }: { type: "image" | "video" | "pdf" | "other" }) {
  if (type === "image") return <ImageIcon size={18} className="text-brand-violet" />;
  if (type === "video") return <Film size={18} className="text-brand-blue" />;
  if (type === "pdf") return <FileText size={18} className="text-brand-pink" />;
  return <FileText size={18} className="text-muted-foreground" />;
}

const AdminMedia = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "pdf">("all");

  // Fetch all files from bucket (list all folders recursively)
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const allFiles: (StorageFile & { path: string; publicUrl: string })[] = [];

      async function listDir(prefix: string) {
        const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) throw error;
        for (const item of data || []) {
          if (item.id === null && !item.metadata) {
            // It's a folder
            await listDir(prefix ? `${prefix}/${item.name}` : item.name);
          } else {
            const path = prefix ? `${prefix}/${item.name}` : item.name;
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            allFiles.push({ ...item, path, publicUrl: urlData.publicUrl });
          }
        }
      }

      await listDir("");
      return allFiles;
    },
    enabled: isAdmin,
  });

  // Upload
  const uploadMutation = useMutation({
    mutationFn: async (fileList: FileList) => {
      const results: string[] = [];
      for (const file of Array.from(fileList)) {
        let toUpload: File | Blob = file;
        if (file.type.startsWith("image/")) {
          toUpload = await compressImage(file);
        }
        const path = `media/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, toUpload, UPLOAD_OPTIONS);
        if (error) throw error;
        results.push(path);
      }
      return results;
    },
    onSuccess: (paths) => {
      toast({ title: `${paths.length} fichier(s) uploadé(s) ✅` });
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: any) => {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Fichier supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: any) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  // Rename (copy + delete old)
  const renameMutation = useMutation({
    mutationFn: async ({ oldPath, newName }: { oldPath: string; newName: string }) => {
      const folder = oldPath.substring(0, oldPath.lastIndexOf("/") + 1);
      const newPath = folder + newName;
      if (newPath === oldPath) return;

      // Download then re-upload
      const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(oldPath);
      if (dlErr) throw dlErr;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, blob, UPLOAD_OPTIONS);
      if (upErr) throw upErr;
      const { error: rmErr } = await supabase.storage.from(BUCKET).remove([oldPath]);
      if (rmErr) throw rmErr;
    },
    onSuccess: () => {
      toast({ title: "Fichier renommé ✅" });
      setRenamingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: any) => {
      toast({ title: "Erreur renommage", description: err.message, variant: "destructive" });
    },
  });

  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiée 📋" });
  }, []);

  const openPreview = useCallback(async (publicUrl: string) => {
    setPreviewUrl(publicUrl);
    setPreviewPages([]);
    setLoadingPages(true);
    try {
      const { data } = await supabase
        .from("cms_page_blocks")
        .select("page_path, content")
        .eq("block_type", "section_override");
      const pages = new Set<string>();
      if (data) {
        for (const row of data) {
          const json = JSON.stringify(row.content || "");
          // Check if the image URL (or filename) appears in the content
          const filename = publicUrl.split("/").pop() || "";
          if (json.includes(publicUrl) || (filename && json.includes(filename))) {
            // page_path format is "/page::blockId" — extract just the page
            const pagePath = row.page_path.split("::")[0];
            pages.add(pagePath || "/");
          }
        }
      }
      setPreviewPages(Array.from(pages));
    } catch {
      // ignore
    } finally {
      setLoadingPages(false);
    }
  }, []);

  const startRename = (file: (typeof files)[0]) => {
    setRenamingId(file.path);
    setRenameValue(file.name);
  };

  const confirmRename = () => {
    if (!renamingId || !renameValue.trim()) return;
    renameMutation.mutate({ oldPath: renamingId, newName: renameValue.trim() });
  };

  if (authLoading) return <div className="min-h-screen" />;
  if (!isAdmin) return <Navigate to="/connexion" replace />;

  const filtered = files.filter((f) => {
    const type = getFileType(f.name, f.metadata?.mimetype);
    if (filterType !== "all" && type !== filterType) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Médiathèque | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header isAdmin />
      <main className="min-h-screen bg-background">
        <div className="container py-8 max-w-6xl">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold font-sans" style={{ fontFamily: "'Clash Display', system-ui" }}>
                  📁 Médiathèque
                </h1>
                <p className="text-muted-foreground mt-1">
                  {files.length} fichier{files.length !== 1 ? "s" : ""} — {formatSize(files.reduce((s, f) => s + (f.metadata?.size || 0), 0))} au total
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files && uploadMutation.mutate(e.target.files)}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                  className="gap-2 gradient-primary text-white rounded-full"
                >
                  <Upload size={16} />
                  {uploadMutation.isPending ? "Upload..." : "Ajouter des fichiers"}
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un fichier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-full"
                />
              </div>
              <div className="flex gap-1 rounded-full border p-0.5">
                {(["all", "image", "video", "pdf"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      filterType === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {t === "all" ? "Tous" : t === "image" ? "Images" : t === "video" ? "Vidéos" : "PDF"}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 rounded-full border p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full p-1.5 transition ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-full p-1.5 transition ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucun fichier trouvé</p>
                <p className="text-sm">Uploadez vos premiers médias pour les voir ici.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((file) => {
                  const type = getFileType(file.name, file.metadata?.mimetype);
                  const isRenaming = renamingId === file.path;

                  return (
                    <div
                      key={file.path}
                      className="group relative rounded-xl border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-all"
                    >
                      {/* Preview */}
                      <div
                        className="aspect-square bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() => type === "image" && setPreviewUrl(file.publicUrl)}
                      >
                        {type === "image" ? (
                          <img
                            src={file.publicUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <FileIcon type={type} />
                        )}
                      </div>

                      {/* Actions overlay */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => copyUrl(file.publicUrl)}
                          className="rounded-full bg-foreground/80 p-1.5 text-background hover:bg-foreground transition"
                          title="Copier l'URL"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={() => startRename(file)}
                          className="rounded-full bg-foreground/80 p-1.5 text-background hover:bg-foreground transition"
                          title="Renommer"
                        >
                          <Pencil size={12} />
                        </button>
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-foreground/80 p-1.5 text-background hover:bg-foreground transition"
                          title="Ouvrir"
                        >
                          <Eye size={12} />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm("Supprimer ce fichier ?")) deleteMutation.mutate(file.path);
                          }}
                          className="rounded-full bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive transition"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-2.5">
                        {isRenaming ? (
                          <div className="flex gap-1">
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="h-7 text-xs"
                              autoFocus
                              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                            />
                            <button onClick={confirmRename} className="rounded p-1 text-emerald-600 hover:bg-emerald-50">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setRenamingId(null)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-medium truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatSize(file.metadata?.size)} • {file.created_at ? new Date(file.created_at).toLocaleDateString("fr-FR") : ""}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List view */
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="px-4 py-2.5 font-medium">Fichier</th>
                      <th className="px-4 py-2.5 font-medium hidden md:table-cell">Type</th>
                      <th className="px-4 py-2.5 font-medium hidden md:table-cell">Taille</th>
                      <th className="px-4 py-2.5 font-medium hidden md:table-cell">Date</th>
                      <th className="px-4 py-2.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((file) => {
                      const type = getFileType(file.name, file.metadata?.mimetype);
                      const isRenaming = renamingId === file.path;

                      return (
                        <tr key={file.path} className="border-b last:border-0 hover:bg-muted/30 transition">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              {type === "image" ? (
                                <img src={file.publicUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" loading="lazy" />
                              ) : (
                                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                                  <FileIcon type={type} />
                                </div>
                              )}
                              {isRenaming ? (
                                <div className="flex gap-1 flex-1">
                                  <Input
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="h-7 text-xs"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                                  />
                                  <button onClick={confirmRename} className="rounded p-1 text-emerald-600 hover:bg-emerald-50">
                                    <Check size={14} />
                                  </button>
                                  <button onClick={() => setRenamingId(null)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 hidden md:table-cell capitalize text-muted-foreground">{type}</td>
                          <td className="px-4 py-2.5 hidden md:table-cell text-muted-foreground">{formatSize(file.metadata?.size)}</td>
                          <td className="px-4 py-2.5 hidden md:table-cell text-muted-foreground">
                            {file.created_at ? new Date(file.created_at).toLocaleDateString("fr-FR") : "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => copyUrl(file.publicUrl)} className="rounded p-1.5 hover:bg-muted transition" title="Copier l'URL">
                                <Copy size={14} />
                              </button>
                              <button onClick={() => startRename(file)} className="rounded p-1.5 hover:bg-muted transition" title="Renommer">
                                <Pencil size={14} />
                              </button>
                              <a href={file.publicUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 hover:bg-muted transition" title="Ouvrir">
                                <Eye size={14} />
                              </a>
                              <button
                                onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(file.path); }}
                                className="rounded p-1.5 text-destructive hover:bg-destructive/10 transition"
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition"
            >
              <X size={20} />
            </button>
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMedia;
