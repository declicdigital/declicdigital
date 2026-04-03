import { useState, useEffect, useRef, ReactNode, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Pencil, Trash2, Tag, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

interface EditableSectionProps {
  blockId: string;
  pagePath: string;
  children: ReactNode;
  label?: string;
}

interface Override {
  id: string;
  content: { html?: string; label?: string; [key: string]: any };
}

const EditableSection = ({ blockId, pagePath, children, label }: EditableSectionProps) => {
  const { isAdmin } = useAuth();
  const [override, setOverride] = useState<Override | null>(null);
  const [editing, setEditing] = useState(false);
  const [editHtml, setEditHtml] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const compositeKey = `${pagePath}::${blockId}`;

  useEffect(() => {
    supabase
      .from("cms_page_blocks")
      .select("id, content")
      .eq("page_path", compositeKey)
      .eq("block_type", "section_override")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const content = data.content as Override["content"];
          setOverride({ id: data.id, content });
        }
        setLoaded(true);
      });
  }, [compositeKey]);

  const openEditor = () => {
    // Pre-fill with override content, or capture current DOM content
    if (override?.content?.html) {
      setEditHtml(override.content.html);
    } else if (contentRef.current) {
      // Capture the actual rendered HTML from the DOM
      setEditHtml(contentRef.current.innerHTML);
    }
    setEditLabel(override?.content?.label || label || blockId);
    setEditing(true);
  };

  const saveOverride = async () => {
    setSaving(true);
    const content = { html: editHtml, label: editLabel };

    if (override) {
      await supabase
        .from("cms_page_blocks")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", override.id);
      setOverride({ ...override, content });
    } else {
      const { data } = await supabase
        .from("cms_page_blocks")
        .insert({
          page_path: compositeKey,
          block_type: "section_override",
          content,
          sort_order: 0,
        })
        .select("id")
        .single();
      if (data) setOverride({ id: data.id, content });
    }

    setSaving(false);
    setEditing(false);
    toast({ title: "Section sauvegardée ✅" });
  };

  const resetOverride = async () => {
    if (!override) return;
    if (!confirm("Supprimer les modifications et revenir au contenu d'origine ?")) return;
    await supabase.from("cms_page_blocks").delete().eq("id", override.id);
    setOverride(null);
    toast({ title: "Section réinitialisée" });
  };

  if (!loaded) return <>{children}</>;

  // Non-admin with override
  if (override?.content?.html && !isAdmin) {
    return (
      <div
        className="cms-article-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(override.content.html) }}
      />
    );
  }

  // Admin mode
  if (isAdmin) {
    return (
      <>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-0 z-[100] rounded-lg border-2 border-transparent transition group-hover:border-primary/30 group-hover:bg-primary/[0.02]" />
          <div className="absolute top-2 right-2 z-[101] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
            <span className="rounded bg-gray-800/90 px-2 py-1 text-[11px] font-medium text-white flex items-center gap-1">
              <Tag size={10} />
              {override?.content?.label || label || blockId}
            </span>
            <button
              onClick={openEditor}
              className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-500 transition"
              title="Modifier cette section"
            >
              <Pencil size={14} />
            </button>
            {override && (
              <button
                onClick={resetOverride}
                className="rounded bg-red-600 p-1.5 text-white hover:bg-red-500 transition"
                title="Réinitialiser"
              >
                <Trash2 size={14} />
              </button>
            )}
            <div className="rounded bg-gray-800/90 p-1.5 text-white cursor-grab">
              <GripVertical size={14} />
            </div>
          </div>

          {/* Content wrapper with ref for DOM capture */}
          {override?.content?.html ? (
            <div
              ref={contentRef}
              className="cms-article-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(override.content.html) }}
            />
          ) : (
            <div ref={contentRef}>
              {children}
            </div>
          )}
        </div>

        {/* Editor panel */}
        {editing && (
          <div className="fixed inset-0 z-[9999] flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(false)} />
            {/* Panel */}
            <div className="relative ml-auto w-[600px] max-w-full h-full bg-background border-l shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-right">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Modifier : {editLabel}</h3>
                <button onClick={() => setEditing(false)} className="rounded p-1 hover:bg-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="mb-1 block text-sm font-medium">Nom du bloc</Label>
                  <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} placeholder="Ex: Hero HP" />
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium">Contenu (éditeur visuel)</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Le contenu actuel du bloc est pré-rempli ci-dessous. Modifiez directement ce que vous souhaitez.
                  </div>
                  <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded" />}>
                    <RichTextEditor content={editHtml} onChange={setEditHtml} />
                  </Suspense>
                </div>
                <p className="text-xs text-muted-foreground">
                  Laissez vide et sauvegardez pour revenir au contenu d'origine.
                </p>
              </div>
              <Button onClick={saveOverride} disabled={saving} className="mt-6 w-full gap-2">
                <Save size={16} /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default EditableSection;
