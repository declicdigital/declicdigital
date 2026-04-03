import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

interface Block {
  id: string;
  page_path: string;
  block_type: string;
  content: Record<string, any>;
  sort_order: number;
}

const BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "text_image", label: "Texte + Image" },
  { value: "testimonial", label: "Témoignage" },
  { value: "cta", label: "CTA (Appel à l'action)" },
  { value: "gallery", label: "Galerie" },
  { value: "contact_form", label: "Formulaire de contact" },
  { value: "separator", label: "Séparateur" },
  { value: "content", label: "Contenu / Éditeur libre" },
];

const defaultContent: Record<string, Record<string, any>> = {
  hero: { title: "Titre principal", subtitle: "Sous-titre", buttonLabel: "En savoir plus", buttonLink: "/", backgroundImage: "", backgroundColor: "#1a1a2e" },
  text_image: { title: "Titre", text: "Votre texte ici...", imageUrl: "", imageAlt: "", imagePosition: "right" },
  testimonial: { quote: "Témoignage client...", author: "Nom du client", role: "Fonction", avatar: "" },
  cta: { title: "Prêt à démarrer ?", text: "Contactez-nous dès maintenant.", buttonLabel: "Nous contacter", buttonLink: "/contact", backgroundColor: "#7c3aed" },
  gallery: { title: "Nos réalisations", images: [] },
  contact_form: { title: "Contactez-nous", subtitle: "Nous vous répondons en 24h" },
  separator: { height: 40, style: "line" },
  content: { html: "<h2>Titre de section</h2><p>Votre contenu ici...</p>", targetPage: "/", contentType: "section" },
};

// Renders a CMS block
export const BlockRenderer = ({ block }: { block: Block }) => {
  const c = block.content;
  const py = c.paddingY ?? 16;

  switch (block.block_type) {
    case "hero":
      return (
        <section className="relative overflow-hidden py-20 px-6 text-center text-white" style={{ backgroundColor: c.backgroundColor || "#1a1a2e", backgroundImage: c.backgroundImage ? `url(${c.backgroundImage})` : undefined, backgroundSize: "cover", paddingTop: py, paddingBottom: py }}>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-4">{c.title}</h2>
            {c.subtitle && <p className="text-xl opacity-90 mb-8">{c.subtitle}</p>}
            {c.buttonLabel && (
              <a href={c.buttonLink || "#"} className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100">
                {c.buttonLabel}
              </a>
            )}
          </div>
        </section>
      );
    case "text_image":
      return (
        <section className="py-16 px-6" style={{ paddingTop: py, paddingBottom: py }}>
          <div className={`mx-auto max-w-6xl flex flex-col ${c.imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} gap-10 items-center`}>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{c.title}</h2>
              <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: c.text || "" }} />
            </div>
            {c.imageUrl && (
              <div className="flex-1">
                <img src={c.imageUrl} alt={c.imageAlt || c.title} className="rounded-xl shadow-lg w-full" />
              </div>
            )}
          </div>
        </section>
      );
    case "testimonial":
      return (
        <section className="py-16 px-6 bg-muted/30" style={{ paddingTop: py, paddingBottom: py }}>
          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="text-xl italic text-foreground mb-6">"{c.quote}"</blockquote>
            <p className="font-semibold">{c.author}</p>
            {c.role && <p className="text-sm text-muted-foreground">{c.role}</p>}
          </div>
        </section>
      );
    case "cta":
      return (
        <section className="py-16 px-6 text-center text-white" style={{ backgroundColor: c.backgroundColor || "#7c3aed", paddingTop: py, paddingBottom: py }}>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">{c.title}</h2>
            <p className="text-lg opacity-90 mb-8">{c.text}</p>
            <a href={c.buttonLink || "#"} className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100">
              {c.buttonLabel}
            </a>
          </div>
        </section>
      );
    case "gallery":
      return (
        <section className="py-16 px-6" style={{ paddingTop: py, paddingBottom: py }}>
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-8 text-center">{c.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(c.images || []).map((img: string, i: number) => (
                <img key={i} src={img} alt={`Image ${i + 1}`} className="rounded-lg shadow-md w-full aspect-video object-cover" />
              ))}
            </div>
          </div>
        </section>
      );
    case "separator":
      return (
        <div style={{ height: c.height || 40 }} className="flex items-center justify-center">
          {c.style === "line" && <div className="w-full max-w-xs border-t border-border" />}
        </div>
      );
    case "contact_form":
      return (
        <section className="py-16 px-6 bg-muted/20" style={{ paddingTop: py, paddingBottom: py }}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-2">{c.title}</h2>
            {c.subtitle && <p className="text-muted-foreground mb-8">{c.subtitle}</p>}
            <p className="text-sm text-muted-foreground italic">Formulaire de contact intégré</p>
          </div>
        </section>
      );
    case "content":
      return (
        <section className="py-16 px-6" style={{ paddingTop: py, paddingBottom: py }}>
          <div
            className="mx-auto max-w-3xl cms-article-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.html || "") }}
          />
        </section>
      );
    default:
      return <div className="p-8 text-center text-muted-foreground">Bloc inconnu : {block.block_type}</div>;
  }
};

// Inline block editor panel
const BlockEditPanel = ({ block, onSave, onClose }: { block: Block; onSave: (content: Record<string, any>) => void; onClose: () => void }) => {
  const [content, setContent] = useState({ ...block.content });
  const isContentBlock = block.block_type === "content";

  const update = (key: string, value: any) => setContent(prev => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-y-0 right-0 z-[10000] w-[480px] max-w-full bg-background border-l shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Modifier le bloc</h3>
        <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X size={20} /></button>
      </div>
      <div className="space-y-4">
        {isContentBlock ? (
          <>
            <div>
              <Label className="mb-1 block">Page cible</Label>
              <Input value={content.targetPage || "/"} onChange={e => update("targetPage", e.target.value)} placeholder="/" />
            </div>
            <div>
              <Label className="mb-1 block">Type de contenu</Label>
              <Select value={content.contentType || "section"} onValueChange={v => update("contentType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="section">Section custom</SelectItem>
                  <SelectItem value="editorial">Encart éditorial</SelectItem>
                  <SelectItem value="blog">Article de blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Contenu</Label>
              <Suspense fallback={<div className="h-[300px] bg-muted animate-pulse rounded" />}>
                <RichTextEditor content={content.html || ""} onChange={html => update("html", html)} />
              </Suspense>
            </div>
          </>
        ) : (
          Object.entries(content).filter(([k]) => !["images"].includes(k)).map(([key, val]) => (
            <div key={key}>
              <Label className="capitalize mb-1 block">{key.replace(/([A-Z])/g, " $1")}</Label>
              {typeof val === "number" ? (
                <div className="flex items-center gap-3">
                  <Slider value={[val]} onValueChange={([v]) => update(key, v)} min={0} max={200} step={4} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-10">{val}px</span>
                </div>
              ) : typeof val === "string" && val.length > 100 ? (
                <Textarea value={val} onChange={e => update(key, e.target.value)} rows={4} />
              ) : typeof val === "string" ? (
                <Input value={val} onChange={e => update(key, e.target.value)} />
              ) : null}
            </div>
          ))
        )}
      </div>
      <Button onClick={() => onSave(content)} className="mt-6 w-full gap-2">
        <Save size={16} /> Enregistrer
      </Button>
    </div>
  );
};

// Block wrapper with admin controls
const AdminBlockWrapper = ({
  block,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: Block;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  return (
    <div className="group relative">
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
        {!isFirst && (
          <button onClick={onMoveUp} className="rounded bg-gray-800 p-1 text-white text-xs hover:bg-gray-700" title="Monter">↑</button>
        )}
        <button className="rounded bg-gray-800 p-1 text-white cursor-grab active:cursor-grabbing" title="Déplacer">
          <GripVertical size={14} />
        </button>
        {!isLast && (
          <button onClick={onMoveDown} className="rounded bg-gray-800 p-1 text-white text-xs hover:bg-gray-700" title="Descendre">↓</button>
        )}
      </div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
        <button onClick={onEdit} className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-500" title="Modifier">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="rounded bg-red-600 p-1.5 text-white hover:bg-red-500" title="Supprimer">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="ring-2 ring-transparent group-hover:ring-primary/30 rounded-lg transition">
        <BlockRenderer block={block} />
      </div>
    </div>
  );
};

// Add block button between sections
const AddBlockButton = ({ onAdd }: { onAdd: (type: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex justify-center py-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90"
      >
        <Plus size={14} /> Ajouter un bloc
      </button>
      {open && (
        <div className="absolute top-full mt-2 z-[200] bg-background border rounded-lg shadow-xl p-2 min-w-[220px]">
          {BLOCK_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => { onAdd(t.value); setOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main block editor for a page
const BlockEditorOverlay = ({ pagePath }: { pagePath: string }) => {
  const { isAdmin } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    loadBlocks();
  }, [isAdmin, pagePath]);

  const loadBlocks = async () => {
    const { data } = await supabase
      .from("cms_page_blocks")
      .select("*")
      .eq("page_path", pagePath)
      .order("sort_order");
    if (data) setBlocks(data as Block[]);
    setLoading(false);
  };

  const addBlock = async (type: string, afterIndex: number) => {
    const newOrder = afterIndex + 1;
    const { error } = await supabase.from("cms_page_blocks").insert({
      page_path: pagePath,
      block_type: type,
      content: defaultContent[type] || {},
      sort_order: newOrder * 10,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      loadBlocks();
    }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Supprimer ce bloc ?")) return;
    await supabase.from("cms_page_blocks").delete().eq("id", id);
    loadBlocks();
  };

  const saveBlock = async (id: string, content: Record<string, any>) => {
    await supabase.from("cms_page_blocks").update({ content, updated_at: new Date().toISOString() }).eq("id", id);
    setEditingBlock(null);
    loadBlocks();
    toast({ title: "Bloc sauvegardé ✅" });
  };

  const moveBlock = async (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    for (let i = 0; i < newBlocks.length; i++) {
      await supabase.from("cms_page_blocks").update({ sort_order: i * 10 }).eq("id", newBlocks[i].id);
    }
    loadBlocks();
  };

  if (!isAdmin || loading) return null;

  if (blocks.length === 0) {
    return (
      <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 my-8 mx-auto max-w-4xl">
        <p className="text-center text-muted-foreground mb-4">Aucun bloc CMS sur cette page</p>
        <AddBlockButton onAdd={(type) => addBlock(type, -1)} />
      </div>
    );
  }

  return (
    <div className="relative pl-14 pr-14 my-8">
      <AddBlockButton onAdd={(type) => addBlock(type, -1)} />
      {blocks.map((block, i) => (
        <div key={block.id}>
          <AdminBlockWrapper
            block={block}
            onEdit={() => setEditingBlock(block)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(i, "up")}
            onMoveDown={() => moveBlock(i, "down")}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
          />
          <AddBlockButton onAdd={(type) => addBlock(type, i)} />
        </div>
      ))}
      {editingBlock && (
        <BlockEditPanel
          block={editingBlock}
          onSave={(content) => saveBlock(editingBlock.id, content)}
          onClose={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
};

// Read-only renderer for visitors
export const PageBlocks = ({ pagePath }: { pagePath: string }) => {
  const { isAdmin } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    supabase
      .from("cms_page_blocks")
      .select("*")
      .eq("page_path", pagePath)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setBlocks(data as Block[]);
      });
  }, [pagePath]);

  if (isAdmin) return <BlockEditorOverlay pagePath={pagePath} />;

  if (blocks.length === 0) return null;

  return (
    <div>
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};

export default BlockEditorOverlay;
