import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, FileText, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { blogArticles } from "@/data/blogArticles";

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
  const [importing, setImporting] = useState<string | null>(null);

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

  const importStaticArticle = async (article: typeof blogArticles[0]) => {
    setImporting(article.slug);
    // Check if already imported
    const { data: existing } = await supabase
      .from("cms_blog_posts")
      .select("id")
      .eq("slug", article.slug)
      .maybeSingle();

    if (existing) {
      toast({ title: "Déjà importé", description: "Cet article existe déjà dans le CMS." });
      setImporting(null);
      return;
    }

    // Convert markdown-like content to HTML
    let html = article.content
      .replace(/#### (.+)/g, "<h4>$1</h4>")
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/## (.+)/g, "<h2>$1</h2>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(.+)$/gm, (line) => {
        if (line.startsWith("<h") || line.startsWith("<p>") || line.startsWith("</p>") || line.trim() === "") return line;
        return line;
      });
    html = `<p>${html}</p>`.replace(/<p><\/p>/g, "").replace(/<p>(<h[2-4]>)/g, "$1").replace(/(<\/h[2-4]>)<\/p>/g, "$1");

    const { error } = await supabase.from("cms_blog_posts").insert({
      title: article.title,
      slug: article.slug,
      content: html,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      read_time: article.readTime,
      meta_title: article.metaTitle,
      meta_description: article.metaDescription,
      cover_image_url: typeof article.image === "string" && article.image.startsWith("http") ? article.image : null,
      status: "published",
      related_slugs: article.relatedSlugs || [],
      created_at: `${article.date}T10:00:00+01:00`,
    });

    if (error) {
      toast({ title: "Erreur d'import", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `"${article.title}" importé dans le CMS ✅` });
      loadPosts();
    }
    setImporting(null);
  };

  // Find static articles not yet in CMS
  const cmsSlugs = new Set(posts.map((p) => p.slug));
  const staticNotImported = blogArticles.filter((a) => !cmsSlugs.has(a.slug));

  if (authLoading || !isAdmin) return null;

  return (
    <PageLayout>
      <Helmet>
        <title>Gestion du blog | Admin</title>
      </Helmet>
      <div className="pt-4" />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Gestion du blog</h1>
          <Button onClick={() => navigate("/admin/blog/new")} className="gap-2">
            <Plus size={18} /> Nouvel article
          </Button>
        </div>

        {/* CMS Articles */}
        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>Aucun article CMS. Créez ou importez des articles ci-dessous.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            <h2 className="text-lg font-semibold mb-3">Articles CMS ({posts.length})</h2>
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition"
              >
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="h-16 w-24 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                    {post.category && <span>{post.category}</span>}
                    <span>{new Date(post.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {post.status === "published" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blog/${post.id}`)}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(post.id, post.title)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Static articles to import */}
        {staticNotImported.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-2">Articles statiques à importer ({staticNotImported.length})</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ces articles sont codés en dur. Importez-les dans le CMS pour les rendre éditables.
            </p>
            <div className="space-y-2">
              {staticNotImported.map((article) => (
                <div
                  key={article.slug}
                  className="flex items-center gap-4 rounded-lg border border-dashed bg-muted/30 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.category} · {article.date}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => importStaticArticle(article)}
                    disabled={importing === article.slug}
                    className="gap-1.5 flex-shrink-0"
                  >
                    <Upload size={14} />
                    {importing === article.slug ? "Import..." : "Importer"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminBlog;
