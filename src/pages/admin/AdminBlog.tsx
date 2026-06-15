import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Clock } from "lucide-react";
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
  scheduled_at: string | null;
  cover_image_url: string | null;
}

const INK = "#2B1E3F";
const INK_LIGHT = "rgba(43,30,63,0.45)";
const INK_XLIGHT = "rgba(43,30,63,0.25)";
const BG_CARD = "#EDE8DF";
const BG_MAIN = "#F6F1E9";
const BORDER = "rgba(43,30,63,0.08)";

function getStatusDisplay(post: BlogPost): { label: string; color: string } {
  if (post.status === "draft" && post.scheduled_at && new Date(post.scheduled_at) > new Date()) {
    return { label: "Programmé", color: "bg-orange-100 text-orange-600" };
  }
  if (post.status === "published") {
    return { label: "Publié", color: "bg-green-100 text-green-700" };
  }
  return { label: "Brouillon", color: "bg-amber-100 text-amber-700" };
}

export default function AdminBlog() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");

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
      .select("id, title, slug, status, category, tags, read_time, created_at, updated_at, scheduled_at, cover_image_url")
      .order("created_at", { ascending: false });
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

  const isScheduled = (p: BlogPost) =>
    p.status === "draft" && !!p.scheduled_at && new Date(p.scheduled_at) > new Date();

  const scheduledCount = posts.filter(isScheduled).length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft" && !isScheduled(p)).length;

  const filtered =
    filter === "all" ? posts
    : filter === "published" ? posts.filter((p) => p.status === "published")
    : filter === "scheduled" ? posts.filter(isScheduled)
    : posts.filter((p) => p.status === "draft" && !isScheduled(p));

  if (loading) return <div className="min-h-screen" style={{ background: BG_MAIN }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: INK }}>Blog</h1>
            <p className="text-sm mt-1" style={{ color: INK_XLIGHT }}>
              {publishedCount} publié{publishedCount > 1 ? "s" : ""} ·{" "}
              {scheduledCount > 0 && `${scheduledCount} programmé${scheduledCount > 1 ? "s" : ""} · `}
              {draftCount} brouillon{draftCount > 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all btn-glow"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))" }}>
            <Plus size={16} /> Nouvel article
          </Link>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "all", label: `Tous (${posts.length})` },
            { key: "published", label: `Publiés (${publishedCount})` },
            ...(scheduledCount > 0 ? [{ key: "scheduled", label: `Programmés (${scheduledCount})` }] : []),
            { key: "draft", label: `Brouillons (${draftCount})` },
          ] as { key: typeof filter; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filter === key
                ? { background: INK, color: "#F6F1E9" }
                : { background: BG_CARD, color: INK_LIGHT, border: `1px solid ${BORDER}` }}>
              {label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: BG_CARD }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: INK_XLIGHT }}>Aucun article</p>
            <Link to="/admin/blog/new" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(183,70%,45%)" }}>
              <Plus size={14} /> Créer le premier article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const sl = getStatusDisplay(post);
              return (
                <div key={post.id} className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-4 p-4">
                    {/* Image miniature */}
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.title} className="w-16 h-12 object-cover rounded-xl shrink-0" />
                    ) : (
                      <div className="w-16 h-12 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: "rgba(43,30,63,0.08)", color: INK_XLIGHT }}>
                        {post.title.charAt(0)}
                      </div>
                    )}

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sl.color}`}>{sl.label}</span>
                        {isScheduled(post) && post.scheduled_at && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(234,88,12,0.08)", color: "rgb(234,88,12)" }}>
                            {new Date(post.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(43,30,63,0.06)", color: INK_LIGHT }}>
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: INK }}>{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs" style={{ color: INK_XLIGHT }}>
                          <Calendar size={11} />
                          {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: INK_XLIGHT }}>
                          <Clock size={11} /> {post.read_time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-all hover:bg-black/5" title="Voir l'article"
                        style={{ color: INK_XLIGHT }}>
                        <Eye size={15} />
                      </a>
                      <button onClick={() => toggleStatus(post)}
                        className="p-2 rounded-lg transition-all hover:bg-black/5"
                        title={post.status === "published" ? "Dépublier" : "Publier"}
                        style={{ color: post.status === "published" ? "hsl(183,70%,45%)" : INK_XLIGHT }}>
                        {post.status === "published" ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link to={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg transition-all hover:bg-black/5" title="Modifier"
                        style={{ color: INK_XLIGHT }}>
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => deletePost(post.id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-50" title="Supprimer"
                        style={{ color: INK_XLIGHT }}>
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
