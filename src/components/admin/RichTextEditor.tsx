// src/components/admin/RichTextEditor.tsx
// Editeur rich text TipTap avec toolbar complète
// Remplace les textarea dans AdminEditBar et AdminPageOverridesEditor

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  List, ListOrdered, Link as LinkIcon, Unlink,
  Heading2, Heading3, Heading4,
  Minus, Undo, Redo, Code
} from "lucide-react";
import { useEffect, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Saisissez votre contenu...",
  minHeight = 120,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Underline,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content",
        "data-placeholder": placeholder,
      },
    },
  });

  // Sync value si changé de l'extérieur
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL du lien :", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkToNextChar().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkToNextChar().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btnStyle = (active: boolean) => ({
    background: active ? "rgba(99,179,237,0.2)" : "transparent",
    color: active ? "rgb(99,179,237)" : "rgba(255,255,255,0.55)",
    border: "none",
    borderRadius: "6px",
    padding: "4px 6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  });

  const ToolBtn = ({
    onClick, active = false, disabled = false, children, title,
  }: {
    onClick: () => void; active?: boolean; disabled?: boolean;
    children: React.ReactNode; title: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      style={{
        ...btnStyle(active),
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="rich-editor-wrapper"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {/* Format paragraphe / titres */}
        <select
          value={
            editor.isActive("heading", { level: 2 }) ? "h2"
            : editor.isActive("heading", { level: 3 }) ? "h3"
            : editor.isActive("heading", { level: 4 }) ? "h4"
            : "p"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") editor.chain().focus().setParagraph().run();
            else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
            else if (val === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.70)",
            fontSize: "11px",
            padding: "3px 6px",
            cursor: "pointer",
            marginRight: "4px",
          }}
        >
          <option value="p">Paragraphe</option>
          <option value="h2">Titre H2</option>
          <option value="h3">Titre H3</option>
          <option value="h4">Titre H4</option>
        </select>

        {/* Séparateur */}
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.10)", margin: "0 4px" }} />

        <ToolBtn title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={13} />
        </ToolBtn>
        <ToolBtn title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </ToolBtn>
        <ToolBtn title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={13} />
        </ToolBtn>
        <ToolBtn title="Code inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={13} />
        </ToolBtn>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.10)", margin: "0 4px" }} />

        <ToolBtn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={13} />
        </ToolBtn>
        <ToolBtn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={13} />
        </ToolBtn>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.10)", margin: "0 4px" }} />

        <ToolBtn title="Insérer un lien" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon size={13} />
        </ToolBtn>
        <ToolBtn
          title="Supprimer le lien"
          active={false}
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={13} />
        </ToolBtn>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.10)", margin: "0 4px" }} />

        <ToolBtn title="Séparateur horizontal" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={13} />
        </ToolBtn>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.10)", margin: "0 4px" }} />

        <ToolBtn title="Annuler" active={false} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={13} />
        </ToolBtn>
        <ToolBtn title="Rétablir" active={false} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={13} />
        </ToolBtn>
      </div>

      {/* ── Zone d'édition ── */}
      <EditorContent
        editor={editor}
        style={{ minHeight }}
      />

      <style>{`
        .rich-editor-content {
          padding: 10px 14px;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          outline: none;
          min-height: ${minHeight}px;
          line-height: 1.6;
        }
        .rich-editor-content p { margin: 0 0 8px 0; }
        .rich-editor-content p:last-child { margin-bottom: 0; }
        .rich-editor-content h2 { font-size: 18px; font-weight: 700; color: white; margin: 12px 0 6px; }
        .rich-editor-content h3 { font-size: 15px; font-weight: 600; color: white; margin: 10px 0 4px; }
        .rich-editor-content h4 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.80); margin: 8px 0 4px; }
        .rich-editor-content ul { list-style: disc; padding-left: 20px; margin: 6px 0; }
        .rich-editor-content ol { list-style: decimal; padding-left: 20px; margin: 6px 0; }
        .rich-editor-content li { margin: 2px 0; }
        .rich-editor-content a { color: hsl(183,70%,63%); text-decoration: underline; }
        .rich-editor-content strong { font-weight: 700; color: white; }
        .rich-editor-content em { font-style: italic; }
        .rich-editor-content code { 
          background: rgba(255,255,255,0.08); 
          border-radius: 4px; 
          padding: 1px 5px; 
          font-family: monospace; 
          font-size: 12px;
          color: hsl(183,70%,63%);
        }
        .rich-editor-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.12); margin: 12px 0; }
        .rich-editor-content[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.20);
          pointer-events: none;
        }
        .rich-editor-content:focus { outline: none; }
        .rich-editor-wrapper:focus-within {
          border-color: hsl(183,70%,63%) !important;
        }
      `}</style>
    </div>
  );
}
