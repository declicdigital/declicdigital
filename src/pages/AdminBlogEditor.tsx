import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, Upload } from "lucide-react";

const CATEGORIES = [
  "Technique",
  "Création de site",
  "SEO & Performance",
  "Stratégie digitale",
  "Tech & Gadgets",
];

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("5 min");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/connexion");
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (!isNew && id && isAdmin) {
      supabase
        .from("cms_blog_posts")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            setTitle(data.title);
            setSlug(data.slug);
            setContent(data.content);
            setExcerpt(data.excerpt);
            setCategory(data.category);
            setTags((data.tags || []).join(", "));
            setReadTime(data.read_time);
            setMetaTitle(data.meta_title);
            setMetaDescription(data.meta_description);
            setCoverImageUrl(data.cover_image_url || "");
            setStatus(data.status);
            setSlugManual(true);
          }
        });
    }
  }, [id, isAdmin]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `blog/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("cms-images").upload(path, file);
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(path);
    setCoverImageUrl(publicUrl);
    toast({ title: "Image uploadée ✅" });
  };

  const save = async (publishStatus?: string) => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: "Titre et slug requis", variant: "destructive" });
      return;
    }
    setSaving(true);
    const postData = {
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      read_time: readTime,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
      cover_image_url: coverImageUrl || null,
      status: publishStatus || status,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("cms_blog_posts").insert(postData));
    } else {
      ({ error } = await supabase.from("cms_blog_posts").update(postData).eq("id", id));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: publishStatus === "published" ? "Article publié ✅" : "Brouillon enregistré ✅" });
      navigate("/admin/blog");
    }
  };

  if (authLoading || !isAdmin) return null;

  return (
    <PageLayout>
      <Helmet><title>{isNew ? "Nouvel article" : "Modifier l'article"} | Admin</title></Helmet>
      <div className="pt-4" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button onClick={() => navigate("/admin/blog")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Retour au blog
        </button>

        <h1 className="text-2xl font-bold mb-8">{isNew ? "Nouvel article" : "Modifier l'article"}</h1>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label>Titre (H1)</Label>
            <Input
              value={title}
              onChange={e => { setTitle(e.target.value); if (!slugManual) setSlug(slugify(e.target.value)); }}
              placeholder="Titre de l'article"
              className="text-lg font-semibold mt-1"
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="mon-article"
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">/blog/{slug}</p>
          </div>

          {/* Cover image */}
          <div>
            <Label>Image de couverture</Label>
            <div className="mt-1 flex items-center gap-4">
              <Input
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="URL de l'image ou uploader ci-dessous"
                className="flex-1"
              />
              <label className="flex items-center gap-1.5 cursor-pointer rounded-md bg-muted px-3 py-2 text-sm hover:bg-muted/80 transition">
                <Upload size={16} /> Upload
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            </div>
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Couverture" className="mt-3 rounded-lg max-h-48 object-cover" />
            )}
          </div>

          {/* Category & read time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Temps de lecture</Label>
              <Input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="5 min" className="mt-1" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags (séparés par des virgules)</Label>
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="seo, paris, artisan" className="mt-1" />
          </div>

          {/* Rich text content */}
          <div>
            <Label>Contenu</Label>
            <div className="mt-1">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label>Extrait / Meta description</Label>
            <Textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Court résumé de l'article (affiché en liste et meta description)"
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">{excerpt.length}/160 caractères</p>
          </div>

          {/* Meta SEO */}
          <div className="grid grid-cols-1 gap-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-sm">SEO avancé</h3>
            <div>
              <Label>Meta Title</Label>
              <Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title} className="mt-1" />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder={excerpt} rows={2} className="mt-1" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => save("draft")} disabled={saving} className="gap-2">
              <Save size={16} /> Enregistrer brouillon
            </Button>
            <Button onClick={() => save("published")} disabled={saving} className="gap-2">
              <Send size={16} /> Publier
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminBlogEditor;
