import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useState, useEffect, useCallback } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, Heading4, List, ListOrdered, Link as LinkIcon, ImageIcon, Code, MousePointerClick } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [mode, setMode] = useState<string>("visual");
  const [rawHtml, setRawHtml] = useState(content);
  const [activeBlock, setActiveBlock] = useState("Paragraphe");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
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
    const text = prompt("Texte du bouton CTA :", "Demander un audit SEO gratuit");
    if (!text) return;
    const link = prompt("Lien du CTA :", "/audit-seo-gratuit");
    if (!link) return;
    const style = prompt("Style (primary / secondary) :", "primary");
    const ctaHtml = `<div class="cta-block" data-cta-style="${style || 'primary'}"><a href="${link}">${text}</a></div>`;
    if (editor) {
      editor.chain().focus().insertContent(ctaHtml).run();
    }
  };

  const handleRawChange = (val: string) => {
    setRawHtml(val);
    onChange(val);
    if (editor) {
      editor.commands.setContent(val);
    }
  };

  return (
    <div className="rounded-lg border border-input bg-background">
      <Tabs value={mode} onValueChange={setMode}>
        <div className="flex items-center justify-between border-b px-2 py-1">
          {mode === "visual" && editor && (
            <div className="flex flex-wrap items-center gap-0.5">
              {/* Active block indicator */}
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
    </div>
  );
};

export default RichTextEditor;
