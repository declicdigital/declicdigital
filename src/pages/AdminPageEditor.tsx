import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBlockPicker, { type PageBlock, BLOCK_TEMPLATES } from "@/components/admin/PageBlockPicker";
import PageBlockEditor from "@/components/admin/PageBlockEditor";

interface PageMeta {
  title: string;
  slug: string;
  type: "edito" | "landing";
  meta_title: string;
  meta_description: string;
  status: "draft" | "published";
  parent_path: string;
  show_in_header: boolean;
  show_in_more_menu: boolean;
}

const PARENT_OPTIONS = [
  { value: "none", label: "Aucun (racine)" },
  { value: "/creation-site-web", label: "Création de site web" },
  { value: "/referencement-seo", label: "Référencement SEO" },
  { value: "/visibilite-ia", label: "Visibilité IA" },
  { value: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { value: "/blog", label: "Blog" },
];

const generateSlug = (title: string) =>
  title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminPageEditor = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageType = (searchParams.get("type") === "landing" ? "landing" : "edito") as "edito" | "landing";

  const [meta, setMeta] = useState<PageMeta>({
    title: "", slug: "", type: pageType, meta_title: "", meta_description: "",
    status: "draft", parent_path: "none", show_in_header: false, show_in_more_menu: false,
  });
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return null;

  const handleTitleChange = (title: string) => {
    setMeta(p => ({
      ...p, title,
      slug: p.slug || generateSlug(title),
      meta_title: p.meta_title || title,
    }));
  };

  const addBlock = (block: PageBlock) => setBlocks(prev => [...prev, block]);

  const addCustomBlock = () => {
    addBlock({
      id: crypto.randomUUID(),
      type: "custom",
      label: "Bloc personnalisé",
      content: { customName: "", html: "<p>Contenu personnalisé…</p>" },
    });
  };

  const updateBlock = (index: number, block: PageBlock) => {
    setBlocks(prev => prev.map((b, i) => i === index ? block : b));
  };

  const removeBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, dir: "up" | "down") => {
    setBlocks(prev => {
      const next = [...prev];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    if (!meta.title || !meta.slug) {
      toast({ title: "Erreur", description: "Titre et slug sont requis.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const parentPath = meta.parent_path === "none" ? "" : meta.parent_path;
      const fullPath = parentPath ? `${parentPath}/${meta.slug}` : `/${meta.slug}`;

      const { error } = await supabase.from("cms_page_blocks").insert({
        page_path: fullPath,
        block_type: `page_${meta.type}`,
        content: {
          ...meta,
          parent_path: parentPath,
          blocks: blocks.map((b, i) => ({ ...b, sort_order: i })),
        },
        sort_order: 0,
      });
      if (error) throw error;
      toast({ title: "Page créée", description: `La page "${meta.title}" a été enregistrée.` });
      navigate("/admin/blog");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const typeLabel = meta.type === "edito" ? "Page éditoriale" : "Landing Page";

  return (
    <PageLayout hideBlogCarousel>
      <div className="container py-10 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>

        <h1 className="text-2xl font-bold mb-6">Créer une {typeLabel}</h1>

        <div className="space-y-6">
          {/* Meta */}
          <Card>
            <CardHeader><CardTitle className="text-base">Informations générales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la page</Label>
                <Input value={meta.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Mon titre de page" />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input value={meta.slug} onChange={e => setMeta(p => ({ ...p, slug: e.target.value }))} placeholder="mon-titre-de-page" />
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={meta.status} onValueChange={v => setMeta(p => ({ ...p, status: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader><CardTitle className="text-base">Emplacement dans la navigation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Page parente</Label>
                <Select value={meta.parent_path} onValueChange={v => setMeta(p => ({ ...p, parent_path: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PARENT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="header" checked={meta.show_in_header} onCheckedChange={v => setMeta(p => ({ ...p, show_in_header: !!v }))} />
                <Label htmlFor="header">Afficher dans le header</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="more" checked={meta.show_in_more_menu} onCheckedChange={v => setMeta(p => ({ ...p, show_in_more_menu: !!v }))} />
                <Label htmlFor="more">Afficher dans le menu "Plus"</Label>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta titre</Label>
                <Input value={meta.meta_title} onChange={e => setMeta(p => ({ ...p, meta_title: e.target.value }))} maxLength={60} />
                <p className="text-xs text-muted-foreground mt-1">{meta.meta_title.length}/60</p>
              </div>
              <div>
                <Label>Meta description</Label>
                <Input value={meta.meta_description} onChange={e => setMeta(p => ({ ...p, meta_description: e.target.value }))} maxLength={160} />
                <p className="text-xs text-muted-foreground mt-1">{meta.meta_description.length}/160</p>
              </div>
            </CardContent>
          </Card>

          {/* Blocks */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mise en page</h2>
            <div className="space-y-4">
              {blocks.map((block, i) => (
                <PageBlockEditor
                  key={block.id}
                  block={block}
                  index={i}
                  total={blocks.length}
                  onChange={b => updateBlock(i, b)}
                  onRemove={() => removeBlock(i)}
                  onMove={dir => moveBlock(i, dir)}
                />
              ))}
              <div className="flex gap-3">
                <div className="flex-1">
                  <PageBlockPicker onAdd={addBlock} />
                </div>
                <Button variant="outline" onClick={addCustomBlock} className="gap-2 py-6 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary/50">
                  <Plus size={18} /> Bloc custom
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button variant="outline" className="gap-2" disabled>
              <Eye size={16} /> Aperçu
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPageEditor;
