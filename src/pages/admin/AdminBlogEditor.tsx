import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Eye, Upload, X, Plus, Loader2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const CATEGORIES = ["Création de site", "SEO & Performance", "Stratégie digitale", "GEO, Visibilité IA", "Business"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    status: "draft",
    category: CATEGORIES[0],
    tags: [] as string[],
    read_time: "3 min",
    related_slugs: [] as string[],
    meta_title: "",
    meta_description: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || isNew) return;
    async function fetchPost() {
      const { data } = await supabase.from("cms_blog_posts").select("*").eq("id", id).single();
      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          content: data.content ?? "",
          excerpt: data.excerpt ?? "",
          cover_image_url: data.cover_image_url ?? "",
          status: data.status ?? "draft",
          category: data.category ?? CATEGORIES[0],
          tags: data.tags ?? [],
          read_time: data.read_time ?? "3 min",
          related_slugs: data.related_slugs ?? [],
          meta_title: data.meta_title ?? "",
          meta_description: data.meta_description ?? "",
          created_at: data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        });
      }
    }
    fetchPost();
  }, [isAdmin, id, isNew]);

  function update(field: string, value: any) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-slug depuis le titre
      if (field === "title" && (isNew || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(value);
      }
      // Auto meta_title depuis le titre
      if (field === "title" && !prev.meta_title) {
        updated.meta_title = value;
      }
      return updated;
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      update("tags", [...form.tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    update("tags", form.tags.filter((t) => t !== tag));
  }

  async function uploadCoverImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `blog/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("cms-images").upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(filePath);
      update("cover_image_url", publicUrl);
    }
    setUploading(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  async function handleSave(publishNow = false) {
    setSaving(true);
    const payload = {
      ...form,
      status: publishNow ? "published" : form.status,
      updated_at: new Date().toISOString(),
      created_at: new Date(form.created_at).toISOString(),
    };

    if (isNew) {
      const { data, error } = await supabase.from("cms_blog_posts").insert(payload).select().single();
      if (data) navigate(`/admin/blog/${data.id}`, { replace: true });
      if (error) alert("Erreur : " + error.message);
    } else {
      const { error } = await supabase.from("cms_blog_posts").update(payload).eq("id", id);
      if (error) alert("Erreur : " + error.message);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/admin/blog" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-bold text-white">{isNew ? "Nouvel article" : "Modifier l'article"}</h1>
          </div>
          <div className="flex gap-2">
            {!isNew && form.slug && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.60)" }}>
                <Eye size={14} /> Aperçu
              </a>
            )}
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "Sauvegardé !" : "Enregistrer"}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              Publier
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-5">

            {/* Titre */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Titre de l'article *</label>
                <input value={form.title} onChange={(e) => update("title", e.target.value)}
                  placeholder="Ex: Comment améliorer son référencement en 2026..."
                  className="w-full rounded-xl px-4 py-3 text-white text-base font-semibold focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Slug URL</label>
                <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>/blog/</span>
                  <input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))}
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                    placeholder="mon-article-seo" />
                </div>
              </div>
            </div>

            {/* Extrait */}
            <div className="rounded-2xl p-5" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Extrait / Description courte *</label>
              <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)}
                rows={3} placeholder="Court résumé de l'article affiché sur la page blog..."
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            {/* Contenu */}
            <div className="rounded-2xl p-5" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>Contenu de l'article (HTML) *</label>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{form.content.length} caractères</span>
              </div>
              <textarea value={form.content} onChange={(e) => update("content", e.target.value)}
                rows={20} placeholder="<h2>Introduction</h2><p>Votre contenu ici...</p>"
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-y font-mono"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", minHeight: "300px" }} />
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.20)" }}>
                Utilisez du HTML : &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;a href=""&gt;, &lt;ul&gt;&lt;li&gt;
              </p>
            </div>

            {/* SEO */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">SEO & Métadonnées</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Meta title <span style={{ color: "rgba(255,255,255,0.25)" }}>({form.meta_title.length}/70)</span>
                </label>
                <input value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)}
                  placeholder="Titre pour Google (60-70 caractères)"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Meta description <span style={{ color: "rgba(255,255,255,0.25)" }}>({form.meta_description.length}/160)</span>
                </label>
                <textarea value={form.meta_description} onChange={(e) => update("meta_description", e.target.value)}
                  rows={3} placeholder="Description pour Google (150-160 caractères)"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-5">

            {/* Statut & publication */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Publication</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Statut</label>
                <select value={form.status} onChange={(e) => update("status", e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <option value="draft" className="bg-[#1a1020]">Brouillon</option>
                  <option value="published" className="bg-[#1a1020]">Publié</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  <Calendar size={11} className="inline mr-1" />Date de publication
                </label>
                <input type="date" value={form.created_at} onChange={(e) => update("created_at", e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Temps de lecture</label>
                <input value={form.read_time} onChange={(e) => update("read_time", e.target.value)}
                  placeholder="3 min"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>

            {/* Image de couverture */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Image de couverture</h3>
              {form.cover_image_url && (
                <div className="relative">
                  <img src={form.cover_image_url} alt="Couverture" className="w-full h-32 object-cover rounded-xl" />
                  <button onClick={() => update("cover_image_url", "")}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.7)" }}>
                    <X size={12} className="text-white" />
                  </button>
                </div>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" onChange={uploadCoverImage} className="hidden" />
              <button onClick={() => imageInputRef.current?.click()} disabled={uploading}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.45)" }}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "Upload..." : form.cover_image_url ? "Changer l'image" : "Uploader une image"}
              </button>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Ou URL externe</label>
                <input value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
              </div>
            </div>

            {/* Catégorie */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Catégorie</h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="category" value={cat} checked={form.category === cat}
                      onChange={() => update("category", cat)} className="hidden" />
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: form.category === cat ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.2)" }}>
                      {form.category === cat && <div className="w-2 h-2 rounded-full" style={{ background: "hsl(183,70%,63%)" }} />}
                    </div>
                    <span className="text-sm transition-colors" style={{ color: form.category === cat ? "white" : "rgba(255,255,255,0.45)" }}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Mots-clés / Tags</h3>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Ajouter un tag..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                <button onClick={addTag} className="px-3 py-2 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
                  <Plus size={14} />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.70)" }}>
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
