import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CmsBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  category: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminBlog = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/connexion");
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("cms_blog_posts")
      .select("id, title, slug, excerpt, status, category, cover_image_url, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    const { error } = await supabase.from("cms_blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Article supprimé" });
      loadPosts();
    }
  };

  if (authLoading || !isAdmin) return null;

  return (
    <PageLayout>
      <Helmet><title>Gestion du blog | Admin</title></Helmet>
      <div className="pt-4" />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Gestion du blog</h1>
          <Button onClick={() => navigate("/admin/blog/new")} className="gap-2">
            <Plus size={18} /> Nouvel article
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucun article. Créez votre premier article !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition">
                {post.cover_image_url && (
                  <img src={post.cover_image_url} alt="" className="h-16 w-24 rounded object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {post.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                    {post.category && <span>{post.category}</span>}
                    <span>{new Date(post.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {post.status === "published" && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blog/${post.id}`)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deletePost(post.id, post.title)} className="text-destructive hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminBlog;
