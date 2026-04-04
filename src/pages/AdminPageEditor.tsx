import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface PageData {
  title: string;
  slug: string;
  type: "edito" | "landing";
  meta_title: string;
  meta_description: string;
  content: string;
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

const AdminPageEditor = ({ pageType = "edito" }: { pageType?: "edito" | "landing" }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState<PageData>({
    title: "",
    slug: "",
    type: pageType,
    meta_title: "",
    meta_description: "",
    content: "",
    status: "draft",
    parent_path: "none",
    show_in_header: false,
    show_in_more_menu: false,
  });
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return null;

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setPage(p => ({
      ...p,
      title,
      slug: p.slug || generateSlug(title),
      meta_title: p.meta_title || title,
    }));
  };

  const handleSave = async () => {
    if (!page.title || !page.slug) {
      toast({ title: "Erreur", description: "Titre et slug sont requis.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const parentPath = page.parent_path === "none" ? "" : page.parent_path;
      const fullPath = parentPath ? `${parentPath}/${page.slug}` : `/${page.slug}`;

      const { error } = await supabase.from("cms_page_blocks").insert({
        page_path: fullPath,
        block_type: `page_${page.type}`,
        content: {
          title: page.title,
          slug: page.slug,
          type: page.type,
          meta_title: page.meta_title,
          meta_description: page.meta_description,
          content: page.content,
          status: page.status,
          parent_path: parentPath,
          show_in_header: page.show_in_header,
          show_in_more_menu: page.show_in_more_menu,
        },
        sort_order: 0,
      });

      if (error) throw error;

      toast({ title: "Page créée", description: `La page "${page.title}" a été enregistrée.` });
      navigate("/admin/blog");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const typeLabel = page.type === "edito" ? "Page éditoriale" : "Landing Page";

  return (
    <PageLayout hideBlogCarousel>
      <div className="container py-10 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>

        <h1 className="text-2xl font-bold mb-6">Créer une {typeLabel}</h1>

        <div className="space-y-6">
          {/* Titre */}
          <Card>
            <CardHeader><CardTitle className="text-base">Informations générales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Titre de la page</Label>
                <Input
                  value={page.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Mon titre de page"
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={page.slug}
                  onChange={e => setPage(p => ({ ...p, slug: e.target.value }))}
                  placeholder="mon-titre-de-page"
                />
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={page.status} onValueChange={v => setPage(p => ({ ...p, status: v as any }))}>
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
                <Label>Page parente (fil d'Ariane)</Label>
                <Select value={page.parent_path} onValueChange={v => setPage(p => ({ ...p, parent_path: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PARENT_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="header"
                  checked={page.show_in_header}
                  onCheckedChange={v => setPage(p => ({ ...p, show_in_header: !!v }))}
                />
                <Label htmlFor="header">Afficher dans le header (menu principal)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="more"
                  checked={page.show_in_more_menu}
                  onCheckedChange={v => setPage(p => ({ ...p, show_in_more_menu: !!v }))}
                />
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
                <Input
                  value={page.meta_title}
                  onChange={e => setPage(p => ({ ...p, meta_title: e.target.value }))}
                  placeholder="Titre SEO"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">{page.meta_title.length}/60</p>
              </div>
              <div>
                <Label>Meta description</Label>
                <Textarea
                  value={page.meta_description}
                  onChange={e => setPage(p => ({ ...p, meta_description: e.target.value }))}
                  placeholder="Description pour les moteurs de recherche"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">{page.meta_description.length}/160</p>
              </div>
            </CardContent>
          </Card>

          {/* Contenu */}
          <Card>
            <CardHeader><CardTitle className="text-base">Contenu</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={page.content}
                onChange={e => setPage(p => ({ ...p, content: e.target.value }))}
                placeholder="Contenu HTML de la page..."
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save size={16} />
              {saving ? "Enregistrement..." : "Enregistrer"}
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
