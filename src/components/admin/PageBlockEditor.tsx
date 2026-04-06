import { useState, useRef } from "react";
import { GripVertical, Trash2, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "./RichTextEditor";
import type { PageBlock } from "./PageBlockPicker";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, UPLOAD_OPTIONS } from "@/lib/imageCompression";
import { toast } from "@/hooks/use-toast";

interface PageBlockEditorProps {
  block: PageBlock;
  index: number;
  total: number;
  onChange: (block: PageBlock) => void;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
}

const ImageUploadField = ({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) => {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await compressImage(file);
      const path = `pages/${Date.now()}-${optimized.name}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, optimized, { ...UPLOAD_OPTIONS, contentType: "image/webp" });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(path);
      onChange(publicUrl);
      toast({ title: "Image uploadée ✅" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="URL de l'image" className="flex-1 h-8 text-sm" />
        <label className="flex items-center gap-1 cursor-pointer rounded-md bg-muted px-2 py-1.5 text-xs hover:bg-muted/80 transition">
          <Upload size={14} /> Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
      {value && <img src={value} alt="" className="mt-2 rounded max-h-32 object-cover" />}
    </div>
  );
};

const updateContent = (block: PageBlock, key: string, value: string): PageBlock => ({
  ...block,
  content: { ...block.content, [key]: value },
});

const PageBlockEditor = ({ block, index, total, onChange, onRemove, onMove }: PageBlockEditorProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const renderFields = () => {
    switch (block.type) {
      case "text":
        return (
          <RichTextEditor content={block.content.html || ""} onChange={html => onChange(updateContent(block, "html", html))} />
        );

      case "image-left-text-right":
      case "text-left-image-right":
        return (
          <div className="space-y-4">
            <ImageUploadField value={block.content.imageUrl || ""} onChange={url => onChange(updateContent(block, "imageUrl", url))} />
            <div>
              <Label className="text-xs">Texte alt</Label>
              <Input value={block.content.imageAlt || ""} onChange={e => onChange(updateContent(block, "imageAlt", e.target.value))} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Contenu</Label>
              <RichTextEditor content={block.content.html || ""} onChange={html => onChange(updateContent(block, "html", html))} />
            </div>
          </div>
        );

      case "hero-image":
        return (
          <div className="space-y-4">
            <ImageUploadField value={block.content.imageUrl || ""} label="Image de fond" onChange={url => onChange(updateContent(block, "imageUrl", url))} />
            <div>
              <Label className="text-xs">Contenu superposé</Label>
              <RichTextEditor content={block.content.html || ""} onChange={html => onChange(updateContent(block, "html", html))} />
            </div>
          </div>
        );

      case "two-columns":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1 block">Colonne gauche</Label>
              <RichTextEditor content={block.content.htmlLeft || ""} onChange={html => onChange(updateContent(block, "htmlLeft", html))} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Colonne droite</Label>
              <RichTextEditor content={block.content.htmlRight || ""} onChange={html => onChange(updateContent(block, "htmlRight", html))} />
            </div>
          </div>
        );

      case "image-full":
        return (
          <div className="space-y-3">
            <ImageUploadField value={block.content.imageUrl || ""} onChange={url => onChange(updateContent(block, "imageUrl", url))} />
            <div>
              <Label className="text-xs">Texte alt</Label>
              <Input value={block.content.imageAlt || ""} onChange={e => onChange(updateContent(block, "imageAlt", e.target.value))} className="mt-1 h-8 text-sm" />
            </div>
          </div>
        );

      case "cta-banner":
        return (
          <div className="space-y-4">
            <RichTextEditor content={block.content.html || ""} onChange={html => onChange(updateContent(block, "html", html))} />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Texte du bouton</Label>
                <Input value={block.content.ctaLabel || ""} onChange={e => onChange(updateContent(block, "ctaLabel", e.target.value))} className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Lien</Label>
                <Input value={block.content.ctaHref || ""} onChange={e => onChange(updateContent(block, "ctaHref", e.target.value))} className="mt-1 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Style</Label>
                <Select value={block.content.ctaStyle || "primary"} onValueChange={v => onChange(updateContent(block, "ctaStyle", v))}>
                  <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primaire (violet)</SelectItem>
                    <SelectItem value="secondary">Secondaire (dégradé)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "features-grid":
        return (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-2 p-3 rounded-lg border">
                <Label className="text-xs font-semibold">Carte {n}</Label>
                <Input
                  value={block.content[`card${n}Title`] || ""}
                  onChange={e => onChange(updateContent(block, `card${n}Title`, e.target.value))}
                  placeholder="Titre"
                  className="h-8 text-sm"
                />
                <Input
                  value={block.content[`card${n}Text`] || ""}
                  onChange={e => onChange(updateContent(block, `card${n}Text`, e.target.value))}
                  placeholder="Description"
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        );

      case "custom":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nom du bloc</Label>
              <Input value={block.content.customName || ""} onChange={e => onChange(updateContent(block, "customName", e.target.value))} className="mt-1 h-8 text-sm" placeholder="Mon bloc personnalisé" />
            </div>
            <div>
              <Label className="text-xs">HTML personnalisé</Label>
              <RichTextEditor content={block.content.html || ""} onChange={html => onChange(updateContent(block, "html", html))} />
            </div>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Type de bloc inconnu : {block.type}</p>;
    }
  };

  return (
    <div className="rounded-lg border bg-card group">
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 rounded-t-lg">
        <GripVertical size={14} className="text-muted-foreground cursor-grab" />
        <span className="text-xs font-semibold flex-1">{block.label}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMove("up")} disabled={index === 0}>
            <ChevronUp size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onMove("down")} disabled={index === total - 1}>
            <ChevronDown size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={onRemove}>
            <Trash2 size={14} />
          </Button>
        </div>
        <button onClick={() => setCollapsed(c => !c)} className="text-xs text-muted-foreground hover:text-foreground ml-1">
          {collapsed ? "Ouvrir" : "Réduire"}
        </button>
      </div>
      {/* Block content */}
      {!collapsed && (
        <div className="p-4">
          {renderFields()}
        </div>
      )}
    </div>
  );
};

export default PageBlockEditor;
