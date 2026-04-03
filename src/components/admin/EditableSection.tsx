import { useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, Pencil, Trash2, Tag, X, Save, Plus, Trash, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";

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
  content: { structured?: StructuredContent; html?: string; label?: string; [key: string]: any };
}

/** Parse DOM element into structured fields */
function parseDomToStructured(el: HTMLElement, fallbackLabel: string): StructuredContent {
  const result: StructuredContent = {
    label: fallbackLabel,
    heading: "",
    text: "",
    image: "",
    imageAlt: "",
    ctas: [],
  };

  // Find H1
  const h1 = el.querySelector("h1");
  if (h1) result.heading = h1.textContent?.trim() || "";

  // Find first significant image (skip tiny icons < 64px)
  const imgs = el.querySelectorAll("img");
  for (const img of imgs) {
    const w = img.getAttribute("width");
    if (w && parseInt(w) < 64) continue;
    result.image = img.getAttribute("src") || "";
    result.imageAlt = img.getAttribute("alt") || "";
    break;
  }

  // Find paragraphs (first substantial one)
  const paragraphs = el.querySelectorAll("p");
  const texts: string[] = [];
  paragraphs.forEach((p) => {
    const t = p.textContent?.trim();
    if (t && t.length > 20) texts.push(t);
  });
  result.text = texts.slice(0, 2).join("\n\n");

  // Find links that look like CTAs (inside buttons or with CTA-like classes)
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

/** Rebuild HTML from structured content */
function structuredToHtml(s: StructuredContent): string {
  const parts: string[] = [];

  if (s.image) {
    parts.push(`<div style="text-align:center;margin-bottom:1.5rem"><img src="${s.image}" alt="${s.imageAlt}" style="max-width:100%;border-radius:0.75rem;object-fit:cover" /></div>`);
  }
  if (s.heading) {
    parts.push(`<h1 style="font-size:2.5rem;font-weight:800;line-height:1.15;margin-bottom:1rem">${s.heading}</h1>`);
  }
  if (s.text) {
    s.text.split("\n\n").forEach((p) => {
      if (p.trim()) parts.push(`<p style="font-size:1.125rem;line-height:1.75;color:inherit;margin-bottom:1rem">${p.trim()}</p>`);
    });
  }

  const enabledCtas = s.ctas.filter((c) => c.enabled && c.text && c.url);
  if (enabledCtas.length > 0) {
    const btns = enabledCtas.map((c) => {
      if (c.style === "primary") {
        return `<a href="${c.url}" class="inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-8 py-3 font-bold text-white text-lg hover:opacity-90 transition-opacity shadow-lg">${c.text}</a>`;
      }
      return `<a href="${c.url}" class="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 font-bold text-primary text-lg hover:bg-primary hover:text-white transition-colors">${c.text}</a>`;
    }).join(" ");
    parts.push(`<div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1.5rem">${btns}</div>`);
  }

  return parts.join("\n");
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

  const openEditor = () => {
    const fallbackLabel = override?.content?.label || label || blockId;

    // If we have structured data saved, use it
    if (override?.content?.structured) {
      setStructured(override.content.structured);
    } else if (contentRef.current) {
      // Parse DOM into structured fields
      setStructured(parseDomToStructured(contentRef.current, fallbackLabel));
    } else {
      setStructured({ label: fallbackLabel, heading: "", text: "", image: "", imageAlt: "", ctas: [] });
    }
    setEditing(true);
  };

  const saveOverride = async () => {
    setSaving(true);
    const html = structuredToHtml(structured);
    const content = { structured, html, label: structured.label };

    if (override) {
      await supabase
        .from("cms_page_blocks")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", override.id);
      setOverride({ ...override, content });
    } else {
      const { data } = await supabase
        .from("cms_page_blocks")
        .insert({ page_path: compositeKey, block_type: "section_override", content, sort_order: 0 })
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
            <button onClick={openEditor} className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-500 transition" title="Modifier cette section">
              <Pencil size={14} />
            </button>
            {override && (
              <button onClick={resetOverride} className="rounded bg-red-600 p-1.5 text-white hover:bg-red-500 transition" title="Réinitialiser">
                <Trash2 size={14} />
              </button>
            )}
            <div className="rounded bg-gray-800/90 p-1.5 text-white cursor-grab">
              <GripVertical size={14} />
            </div>
          </div>

          {override?.content?.html ? (
            <div ref={contentRef} className="cms-article-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(override.content.html) }} />
          ) : (
            <div ref={contentRef}>{children}</div>
          )}
        </div>

        {/* Structured Editor Panel */}
        {editing && (
          <div className="fixed inset-0 z-[9999] flex">
            <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(false)} />
            <div className="relative ml-auto w-[560px] max-w-full h-full bg-background border-l shadow-2xl overflow-y-auto animate-in slide-in-from-right">
              {/* Header */}
              <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold">Modifier : {structured.label || blockId}</h3>
                <button onClick={() => setEditing(false)} className="rounded p-1 hover:bg-muted"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* Block name */}
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">🏷️ Nom du bloc</Label>
                  <Input value={structured.label} onChange={(e) => updateField("label", e.target.value)} placeholder="Ex: Hero HP" />
                </div>

                {/* Image */}
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

                {/* H1 */}
                <div className="rounded-lg border p-4 space-y-2">
                  <Label className="text-sm font-semibold">📝 Titre principal (H1)</Label>
                  <Input
                    value={structured.heading}
                    onChange={(e) => updateField("heading", e.target.value)}
                    placeholder="Titre principal du bloc"
                    className="text-lg font-bold"
                  />
                </div>

                {/* Text */}
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

                {/* CTAs */}
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">🔘 Boutons CTA</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCta} className="gap-1 text-xs">
                      <Plus size={14} /> Ajouter un CTA
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Cochez ceux que vous voulez afficher. Vous pouvez en ajouter autant que vous voulez.</p>

                  {structured.ctas.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-2">Aucun CTA. Cliquez sur "Ajouter un CTA" pour commencer.</p>
                  )}

                  {structured.ctas.map((cta, i) => (
                    <div key={cta.id} className={`rounded-lg border p-3 space-y-2 transition ${cta.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-60"}`}>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={cta.enabled}
                          onCheckedChange={(v) => updateCta(cta.id, "enabled", !!v)}
                        />
                        <span className="text-sm font-medium flex-1">CTA {i + 1}</span>
                        <select
                          value={cta.style}
                          onChange={(e) => updateCta(cta.id, "style", e.target.value)}
                          className="rounded border bg-background px-2 py-1 text-xs"
                        >
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

                <p className="text-xs text-muted-foreground">
                  Laissez tous les champs vides et sauvegardez pour revenir au contenu d'origine.
                </p>
              </div>

              {/* Save button */}
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
  }

  return <>{children}</>;
};

export default EditableSection;
