import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Clock, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  tags: string[];
  read_time: string;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: "Publié", color: "bg-green-400/15 text-green-300" },
  draft: { label: "Brouillon", color: "bg-amber-400/15 text-amber-300" },
};

export default function AdminBlog() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPosts();
  }, [isAdmin]);

  async function fetchPosts() {
    const { data } = await supabase
      .from("cms_blog_posts")
      .select("id, title, slug, status, category, tags, read_time, created_at, updated_at, cover_image_url")
      .order("updated_at", { ascending: false });
    setPosts(data ?? []);
    setLoadingData(false);
  }

  async function toggleStatus(post: BlogPost) {
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase.from("cms_blog_posts").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", post.id);
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus } : p));
  }

  async function deletePost(id: string) {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    await supabase.from("cms_blog_posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  if (loading) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {posts.filter((p) => p.status === "published").length} publié{posts.filter((p) => p.status === "published").length > 1 ? "s" : ""} · {posts.filter((p) => p.status === "draft").length} brouillon{posts.filter((p) => p.status === "draft").length > 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all btn-glow"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))" }}>
            <Plus size={16} /> Nouvel article
          </Link>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          {(["all", "published", "draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filter === f
                ? { background: "rgba(255,255,255,0.12)", color: "white" }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.40)" }}>
              {f === "all" ? `Tous (${posts.length})` : f === "published" ? `Publiés (${posts.filter((p) => p.status === "published").length})` : `Brouillons (${posts.filter((p) => p.status === "draft").length})`}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: "hsl(263, 36%, 13%)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "rgba(255,255,255,0.30)" }}>Aucun article</p>
            <Link to="/admin/blog/new" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(183,70%,63%)" }}>
              <Plus size={14} /> Créer le premier article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const sl = STATUS_LABELS[post.status] ?? { label: post.status, color: "bg-white/10 text-white/50" };
              return (
                <div key={post.id} className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-4 p-4">
                    {/* Image miniature */}
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title}
                        className="w-16 h-12 object-cover rounded-xl shrink-0" />
                    ) : (
                      <div className="w-16 h-12 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }}>
                        {post.title.charAt(0)}
                      </div>
                    )}

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sl.color}`}>{sl.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-sm leading-snug line-clamp-1">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
                          <Calendar size={11} />
                          {new Date(post.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
                          <Clock size={11} /> {post.read_time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-all hover:bg-white/5" title="Voir l'article"
                        style={{ color: "rgba(255,255,255,0.30)" }}>
                        <Eye size={15} />
                      </a>
                      <button onClick={() => toggleStatus(post)}
                        className="p-2 rounded-lg transition-all hover:bg-white/5" title={post.status === "published" ? "Dépublier" : "Publier"}
                        style={{ color: post.status === "published" ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.30)" }}>
                        {post.status === "published" ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link to={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg transition-all hover:bg-white/5" title="Modifier"
                        style={{ color: "rgba(255,255,255,0.30)" }}>
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => deletePost(post.id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-500/10" title="Supprimer"
                        style={{ color: "rgba(255,255,255,0.30)" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
