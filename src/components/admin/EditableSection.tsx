import { useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Pencil, Trash2, Tag, X, Save, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface EditableSectionProps {
  blockId: string;
  pagePath: string;
  children: ReactNode;
  label?: string;
}

interface CtaItem {
  id: string;
  text: string;
  url: string;
  style: "primary" | "secondary";
  enabled: boolean;
}

interface StructuredContent {
  label: string;
  heading: string;
  text: string;
  image: string;
  imageAlt: string;
  ctas: CtaItem[];
}

interface Override {
  id: string;
  content: { structured?: StructuredContent; label?: string; [key: string]: any };
}

/** Parse DOM element into structured fields */
function parseDomToStructured(el: HTMLElement, fallbackLabel: string): StructuredContent {
  const result: StructuredContent = {
    label: fallbackLabel, heading: "", text: "", image: "", imageAlt: "", ctas: [],
  };

  const h1 = el.querySelector("h1");
  if (h1) result.heading = h1.textContent?.trim() || "";

  const imgs = el.querySelectorAll("img");
  for (const img of imgs) {
    const w = img.getAttribute("width");
    if (w && parseInt(w) < 64) continue;
    result.image = img.getAttribute("src") || "";
    result.imageAlt = img.getAttribute("alt") || "";
    break;
  }

  const paragraphs = el.querySelectorAll("p");
  const texts: string[] = [];
  paragraphs.forEach((p) => {
    const t = p.textContent?.trim();
    if (t && t.length > 10) texts.push(t);
  });
  result.text = texts.slice(0, 3).join("\n\n");

  const links = el.querySelectorAll("a");
  let ctaId = 0;
  links.forEach((a) => {
    const parent = a.closest("button, .btn, [class*='btn'], [class*='Button']");
    const cls = (a.className || "") + " " + (parent?.className || "");
    const isCta = parent || cls.includes("gradient") || cls.includes("rounded-full") || cls.includes("btn") || cls.includes("shadow");
    if (isCta) {
      const isPrimary = cls.includes("gradient-primary") || cls.includes("gradient-miami") || !cls.includes("outline");
      result.ctas.push({
        id: `cta-${ctaId++}`,
        text: a.textContent?.trim() || "",
        url: a.getAttribute("href") || "",
        style: isPrimary ? "primary" : "secondary",
        enabled: true,
      });
    }
  });

  return result;
}

/**
 * Apply saved structured content onto the live DOM without replacing children.
 * This patches text/attributes in-place so layout & styling are preserved.
 */
function applyOverrideToDOM(el: HTMLElement, s: StructuredContent) {
  // Patch H1
  if (s.heading) {
    const h1 = el.querySelector("h1");
    if (h1) h1.textContent = s.heading;
  }

  // Patch first significant image
  if (s.image) {
    const imgs = el.querySelectorAll("img");
    for (const img of imgs) {
      const w = img.getAttribute("width");
      if (w && parseInt(w) < 64) continue;
      img.setAttribute("src", s.image);
      if (s.imageAlt) img.setAttribute("alt", s.imageAlt);
      break;
    }
  }

  // Patch paragraphs
  if (s.text) {
    const newTexts = s.text.split("\n\n").filter(t => t.trim());
    const paragraphs = el.querySelectorAll("p");
    const significantPs: HTMLParagraphElement[] = [];
    paragraphs.forEach(p => {
      const t = p.textContent?.trim();
      if (t && t.length > 10) significantPs.push(p);
    });
    newTexts.forEach((txt, i) => {
      if (significantPs[i]) significantPs[i].textContent = txt.trim();
    });
  }

  // Patch CTA links
  const enabledCtas = s.ctas.filter(c => c.enabled && c.text && c.url);
  const links = el.querySelectorAll("a");
  const ctaLinks: HTMLAnchorElement[] = [];
  links.forEach(a => {
    const parent = a.closest("button, .btn, [class*='btn'], [class*='Button']");
    const cls = (a.className || "") + " " + (parent?.className || "");
    const isCta = parent || cls.includes("gradient") || cls.includes("rounded-full") || cls.includes("btn") || cls.includes("shadow");
    if (isCta) ctaLinks.push(a);
  });
  enabledCtas.forEach((cta, i) => {
    if (ctaLinks[i]) {
      // Preserve inner structure (icons etc) — only change text nodes
      const textNode = Array.from(ctaLinks[i].childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = cta.text;
      } else {
        // If link has child elements (icons), append/replace text
        const span = ctaLinks[i].querySelector("span");
        if (span) span.textContent = cta.text;
        else ctaLinks[i].textContent = cta.text;
      }
      ctaLinks[i].setAttribute("href", cta.url);
    }
  });
}

const EditableSection = ({ blockId, pagePath, children, label }: EditableSectionProps) => {
  const { isAdmin } = useAuth();
  const [override, setOverride] = useState<Override | null>(null);
  const [editing, setEditing] = useState(false);
  const [structured, setStructured] = useState<StructuredContent>({
    label: "", heading: "", text: "", image: "", imageAlt: "", ctas: [],
  });
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

  // Apply DOM patches when override data is loaded and children are rendered
  useEffect(() => {
    if (!loaded || !override?.content?.structured || !contentRef.current) return;
    // Use a small delay to ensure React has finished rendering children
    const timer = setTimeout(() => {
      if (contentRef.current) {
        applyOverrideToDOM(contentRef.current, override.content.structured!);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [loaded, override]);

  const openEditor = () => {
    const fallbackLabel = override?.content?.label || label || blockId;
    if (override?.content?.structured) {
      setStructured(override.content.structured);
    } else if (contentRef.current) {
      setStructured(parseDomToStructured(contentRef.current, fallbackLabel));
    } else {
      setStructured({ label: fallbackLabel, heading: "", text: "", image: "", imageAlt: "", ctas: [] });
    }
    setEditing(true);
  };

  const saveOverride = async () => {
    setSaving(true);
    const content = { structured: structured as any, label: structured.label } as any;

    if (override) {
      await supabase
        .from("cms_page_blocks")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", override.id);
      setOverride({ ...override, content });
    } else {
      const { data } = await supabase
        .from("cms_page_blocks")
        .insert([{ page_path: compositeKey, block_type: "section_override", content, sort_order: 0 }])
        .select("id")
        .single();
      if (data) setOverride({ id: data.id, content });
    }

    // Apply immediately to DOM
    if (contentRef.current) {
      applyOverrideToDOM(contentRef.current, structured);
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
    // Reload to get original content back
    window.location.reload();
  };

  const updateField = <K extends keyof StructuredContent>(key: K, value: StructuredContent[K]) => {
    setStructured((prev) => ({ ...prev, [key]: value }));
  };

  const addCta = () => {
    setStructured((prev) => ({
      ...prev,
      ctas: [...prev.ctas, { id: `cta-${Date.now()}`, text: "", url: "", style: "primary", enabled: true }],
    }));
  };

  const updateCta = (id: string, field: keyof CtaItem, value: any) => {
    setStructured((prev) => ({
      ...prev,
      ctas: prev.ctas.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  };

  const removeCta = (id: string) => {
    setStructured((prev) => ({ ...prev, ctas: prev.ctas.filter((c) => c.id !== id) }));
  };

  if (!loaded) return <>{children}</>;

  // Always render original children — both for visitors and admins
  // Override is applied via DOM patching, not HTML replacement
  if (!isAdmin) {
    return <div ref={contentRef}>{children}</div>;
  }

  // Admin mode
  return (
    <>
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 z-[100] rounded-lg border-2 border-transparent transition group-hover:border-primary/30 group-hover:bg-primary/[0.02]" />
        <div className="absolute top-2 right-2 z-[101] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <span className="rounded bg-gray-800/90 px-2 py-1 text-[11px] font-medium text-white flex items-center gap-1">
            <Tag size={10} />
            {override?.content?.label || label || blockId}
          </span>
          <button onClick={openEditor} className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-500 transition" title="Modifier cette section">
            <Pencil size={14} />
          </button>
          {override && (
            <button onClick={resetOverride} className="rounded bg-red-600 p-1.5 text-white hover:bg-red-500 transition" title="Réinitialiser">
              <Trash2 size={14} />
            </button>
          )}
          </div>

        <div ref={contentRef}>{children}</div>
      </div>

      {/* Structured Editor Panel */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(false)} />
          <div className="relative ml-auto w-[560px] max-w-full h-full bg-background border-l shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold">Modifier : {structured.label || blockId}</h3>
              <button onClick={() => setEditing(false)} className="rounded p-1 hover:bg-muted"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">🏷️ Nom du bloc</Label>
                <Input value={structured.label} onChange={(e) => updateField("label", e.target.value)} placeholder="Ex: Hero HP" />
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">🖼️ Image</Label>
                {structured.image && (
                  <div className="relative rounded-lg overflow-hidden bg-muted">
                    <img src={structured.image} alt={structured.imageAlt} className="w-full h-32 object-cover" />
                  </div>
                )}
                <Input value={structured.image} onChange={(e) => updateField("image", e.target.value)} placeholder="URL de l'image" />
                <Input value={structured.imageAlt} onChange={(e) => updateField("imageAlt", e.target.value)} placeholder="Texte alternatif (alt)" className="text-sm" />
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <Label className="text-sm font-semibold">📝 Titre principal (H1)</Label>
                <Input
                  value={structured.heading}
                  onChange={(e) => updateField("heading", e.target.value)}
                  placeholder="Titre principal du bloc"
                  className="text-lg font-bold"
                />
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <Label className="text-sm font-semibold">📄 Texte / sous-titre</Label>
                <Textarea
                  value={structured.text}
                  onChange={(e) => updateField("text", e.target.value)}
                  placeholder="Paragraphe(s) du bloc. Séparez par une ligne vide pour plusieurs paragraphes."
                  rows={5}
                  className="leading-relaxed"
                />
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">🔘 Boutons CTA</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCta} className="gap-1 text-xs">
                    <Plus size={14} /> Ajouter un CTA
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Cochez ceux que vous voulez afficher.</p>

                {structured.ctas.length === 0 && (
                  <p className="text-sm text-muted-foreground italic py-2">Aucun CTA détecté.</p>
                )}

                {structured.ctas.map((cta, i) => (
                  <div key={cta.id} className={`rounded-lg border p-3 space-y-2 transition ${cta.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-60"}`}>
                    <div className="flex items-center gap-3">
                      <Checkbox checked={cta.enabled} onCheckedChange={(v) => updateCta(cta.id, "enabled", !!v)} />
                      <span className="text-sm font-medium flex-1">CTA {i + 1}</span>
                      <select value={cta.style} onChange={(e) => updateCta(cta.id, "style", e.target.value)} className="rounded border bg-background px-2 py-1 text-xs">
                        <option value="primary">Primaire</option>
                        <option value="secondary">Secondaire</option>
                      </select>
                      <button onClick={() => removeCta(cta.id)} className="rounded p-1 text-destructive hover:bg-destructive/10 transition" title="Supprimer">
                        <Trash size={14} />
                      </button>
                    </div>
                    <Input value={cta.text} onChange={(e) => updateCta(cta.id, "text", e.target.value)} placeholder="Texte du bouton" className="text-sm" />
                    <Input value={cta.url} onChange={(e) => updateCta(cta.id, "url", e.target.value)} placeholder="Lien (ex: /audit-seo-gratuit)" className="text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t p-4">
              <Button onClick={saveOverride} disabled={saving} className="w-full gap-2">
                <Save size={16} /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableSection;
