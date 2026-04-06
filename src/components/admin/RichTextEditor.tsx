import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useState, useEffect, useRef } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, Heading4, List, ListOrdered, Link as LinkIcon, ImageIcon, Code, MousePointerClick } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CtaNode from "./CtaNode";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuButton = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`rounded p-1.5 transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
  >
    {children}
  </button>
);

const getActiveBlockLabel = (editor: any): string => {
  if (!editor) return "Paragraphe";
  if (editor.isActive("heading", { level: 1 })) return "H1";
  if (editor.isActive("heading", { level: 2 })) return "H2";
  if (editor.isActive("heading", { level: 3 })) return "H3";
  if (editor.isActive("heading", { level: 4 })) return "H4";
  if (editor.isActive("bulletList")) return "Liste";
  if (editor.isActive("orderedList")) return "Liste num.";
  if (editor.isActive("blockquote")) return "Citation";
  if (editor.isActive("codeBlock")) return "Code";
  return "Paragraphe";
};

interface CtaEditState {
  pos: number;
  label: string;
  href: string;
  ctaStyle: "primary" | "secondary";
  rect: { top: number; left: number; width: number; bottom: number };
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [mode, setMode] = useState<string>("visual");
  const [rawHtml, setRawHtml] = useState(content);
  const [activeBlock, setActiveBlock] = useState("Paragraphe");
  const [ctaEdit, setCtaEdit] = useState<CtaEditState | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      CtaNode,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setRawHtml(html);
      setActiveBlock(getActiveBlockLabel(editor));
    },
    onSelectionUpdate: ({ editor }) => {
      setActiveBlock(getActiveBlockLabel(editor));
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setRawHtml(content);
    }
  }, [content]);

  // Listen for CTA edit events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCtaEdit({
        pos: detail.pos,
        label: detail.label,
        href: detail.href,
        ctaStyle: detail.ctaStyle,
        rect: detail.rect,
      });
    };
    document.addEventListener("edit-cta", handler);
    return () => document.removeEventListener("edit-cta", handler);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    if (!ctaEdit) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setCtaEdit(null);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctaEdit]);

  const addLink = () => {
    const url = prompt("URL du lien :");
    if (url && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt("URL de l'image :");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertCta = () => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: "ctaBlock",
      attrs: {
        label: "Demander un audit SEO gratuit",
        href: "/audit-seo-gratuit",
        ctaStyle: "primary",
      },
    }).run();
  };

  const saveCtaEdit = () => {
    if (!ctaEdit || !editor) return;
    const { state } = editor;
    const node = state.doc.nodeAt(ctaEdit.pos);
    if (node && node.type.name === "ctaBlock") {
      const tr = state.tr.setNodeMarkup(ctaEdit.pos, undefined, {
        label: ctaEdit.label,
        href: ctaEdit.href,
        ctaStyle: ctaEdit.ctaStyle,
      });
      editor.view.dispatch(tr);
    }
    setCtaEdit(null);
  };

  const handleRawChange = (val: string) => {
    setRawHtml(val);
    onChange(val);
    if (editor) {
      editor.commands.setContent(val);
    }
  };

  // Calculate popup position fixed to viewport so it doesn't cause scroll jumps
  const getPopupStyle = (): React.CSSProperties => {
    if (!ctaEdit) return { display: "none" };
    return {
      position: "fixed",
      top: Math.min(ctaEdit.rect.bottom + 8, window.innerHeight - 320),
      left: Math.max(16, ctaEdit.rect.left),
      zIndex: 9999,
    };
  };

  return (
    <div className="rounded-lg border border-input bg-background relative" ref={editorWrapperRef}>
      <Tabs value={mode} onValueChange={setMode}>
        <div className="flex items-center justify-between border-b px-2 py-1 sticky top-0 z-30 bg-background rounded-t-lg">
          {mode === "visual" && editor && (
            <div className="flex flex-wrap items-center gap-0.5">
              <span className="mr-2 rounded bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground min-w-[70px] text-center">
                {activeBlock}
              </span>
              <div className="mx-1 h-5 w-px bg-border" />
              <MenuButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><Heading1 size={16} /></MenuButton>
              <MenuButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><Heading2 size={16} /></MenuButton>
              <MenuButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3"><Heading3 size={16} /></MenuButton>
              <MenuButton active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="H4"><Heading4 size={16} /></MenuButton>
              <div className="mx-1 h-5 w-px bg-border" />
              <MenuButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras"><Bold size={16} /></MenuButton>
              <MenuButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique"><Italic size={16} /></MenuButton>
              <MenuButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Souligné"><UnderlineIcon size={16} /></MenuButton>
              <div className="mx-1 h-5 w-px bg-border" />
              <MenuButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces"><List size={16} /></MenuButton>
              <MenuButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée"><ListOrdered size={16} /></MenuButton>
              <div className="mx-1 h-5 w-px bg-border" />
              <MenuButton active={editor.isActive("link")} onClick={addLink} title="Lien"><LinkIcon size={16} /></MenuButton>
              <MenuButton onClick={addImage} title="Image"><ImageIcon size={16} /></MenuButton>
              <div className="mx-1 h-5 w-px bg-border" />
              <MenuButton onClick={insertCta} title="Insérer un bouton CTA"><MousePointerClick size={16} /></MenuButton>
            </div>
          )}
          {mode !== "visual" && <div />}
          <TabsList className="h-8">
            <TabsTrigger value="visual" className="text-xs px-2 py-1">Visuel</TabsTrigger>
            <TabsTrigger value="html" className="text-xs px-2 py-1"><Code size={12} className="mr-1" />HTML</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="visual" className="m-0">
          <div className="prose prose-sm max-w-none p-4 min-h-[300px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]">
            <EditorContent editor={editor} />
          </div>
        </TabsContent>
        <TabsContent value="html" className="m-0">
          <Textarea
            value={rawHtml}
            onChange={(e) => handleRawChange(e.target.value)}
            className="min-h-[300px] rounded-none border-0 font-mono text-xs"
          />
        </TabsContent>
      </Tabs>

      {/* CTA Edit Popup */}
      {ctaEdit && (
        <div ref={popupRef} style={getPopupStyle()} className="w-80 rounded-lg border bg-popover p-4 shadow-lg">
          <h4 className="text-sm font-semibold mb-3">Modifier le CTA</h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Texte</Label>
              <Input
                value={ctaEdit.label}
                onChange={(e) => setCtaEdit({ ...ctaEdit, label: e.target.value })}
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Lien</Label>
              <Input
                value={ctaEdit.href}
                onChange={(e) => setCtaEdit({ ...ctaEdit, href: e.target.value })}
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Style</Label>
              <RadioGroup
                value={ctaEdit.ctaStyle}
                onValueChange={(v) => setCtaEdit({ ...ctaEdit, ctaStyle: v as "primary" | "secondary" })}
                className="mt-1.5 flex gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="primary" id="cta-primary" />
                  <label htmlFor="cta-primary" className="text-xs cursor-pointer">Primaire (violet)</label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="secondary" id="cta-secondary" />
                  <label htmlFor="cta-secondary" className="text-xs cursor-pointer">Secondaire (dégradé)</label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={saveCtaEdit} className="text-xs h-7">Appliquer</Button>
              <Button size="sm" variant="outline" onClick={() => setCtaEdit(null)} className="text-xs h-7">Annuler</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
