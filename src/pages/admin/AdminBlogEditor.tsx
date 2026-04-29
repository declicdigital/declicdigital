import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Eye, Upload, X, Plus, Loader2, Calendar,
  Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered,
  Heading2, Heading3, Quote, Code, AlignLeft, Image as ImageIcon,
  RotateCcw, RotateCw, Minus, Zap, Pencil, Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const CATEGORIES = ["Création de site", "SEO & Performance", "Stratégie digitale", "GEO, Visibilité IA", "Business"];

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

const MAX_WIDTH = 1200;  // px max
const MAX_SIZE_KB = 200; // poids cible en Ko

async function convertToWebP(file: File, quality = 0.78): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // Redimensionner si > MAX_WIDTH
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_WIDTH) {
        h = Math.round((h * MAX_WIDTH) / w);
        w = MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas non supporté")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      // Compression adaptative : si trop lourd, baisser la qualité
      const tryCompress = (q: number) => {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Conversion WebP échouée")); return; }
          const sizeKb = blob.size / 1024;
          if (sizeKb > MAX_SIZE_KB && q > 0.40) {
            // Encore trop lourd → réessayer avec qualité réduite
            tryCompress(Math.round((q - 0.08) * 100) / 100);
          } else {
            resolve(blob);
          }
        }, "image/webp", q);
      };
      tryCompress(quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Chargement image échoué")); };
    img.src = url;
  });
}

// ─── Smart render : détecte et convertit Markdown, HTML ou mixte ─────────────
function smartRender(input: string): string {
  if (!input || !input.trim()) return input;
  const hasHtmlTags = /<(h[1-6]|p|ul|ol|li|strong|em|a|blockquote|pre|code|div|span|br|hr|img)\b/i.test(input);
  const hasMarkdown = /^#{1,6}\s|^\*\*|^\*[^*]|^-\s|^\d+\.\s|^>\s|`[^`]|\[.+\]\(.+\)/m.test(input);
  if (hasHtmlTags && !hasMarkdown) return input;
  if (!hasHtmlTags && !hasMarkdown) return `<p>${input.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
  const lines = input.split('\n');
  const result: string[] = [];
  let inUl = false, inOl = false, inPre = false;
  const preBuffer: string[] = [];
  const closeList = () => {
    if (inUl) { result.push('</ul>'); inUl = false; }
    if (inOl) { result.push('</ol>'); inOl = false; }
  };
  const inline = (text: string): string => {
    if (/<[a-z]/i.test(text)) return text;
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  };
  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inPre) { result.push('<pre><code>' + preBuffer.join('\n') + '</code></pre>'); preBuffer.length = 0; inPre = false; }
      else { closeList(); inPre = true; }
      continue;
    }
    if (inPre) { preBuffer.push(line); continue; }
    if (!line.trim()) { closeList(); result.push(''); continue; }
    if (/^<[a-z]/i.test(line.trim())) { closeList(); result.push(line); continue; }
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) { closeList(); result.push(`<h${hMatch[1].length}>${inline(hMatch[2])}</h${hMatch[1].length}>`); continue; }
    if (line.startsWith('> ')) { closeList(); result.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    if (/^[-*+]\s/.test(line)) {
      if (inOl) { result.push('</ol>'); inOl = false; }
      if (!inUl) { result.push('<ul>'); inUl = true; }
      result.push(`<li>${inline(line.replace(/^[-*+]\s/, ''))}</li>`); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      if (inUl) { result.push('</ul>'); inUl = false; }
      if (!inOl) { result.push('<ol>'); inOl = true; }
      result.push(`<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>`); continue;
    }
    if (/^[-*_]{3,}$/.test(line.trim())) { closeList(); result.push('<hr>'); continue; }
    closeList(); result.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  if (inPre) result.push('<pre><code>' + preBuffer.join('\n') + '</code></pre>');
  return result.join('\n').replace(/<p><\/p>/g, '').replace(/<p>\s*<\/p>/g, '');
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n').trim();
}


// ─── Sélecteur de point focal ────────────────────────────────────────────────
function FocalPointPicker({ imageUrl, value, onChange }: {
  imageUrl: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const parse = (v: string) => {
    const parts = v.split(" ");
    return { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 };
  };
  const pos = parse(value);

  const updateFromEvent = (e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));
    onChange(`${x}% ${y}%`);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) updateFromEvent(e as any); };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>Point focal</p>
        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{value}</span>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden select-none"
        style={{ height: "140px", cursor: "crosshair" }}
        onMouseDown={(e) => { isDragging.current = true; updateFromEvent(e); }}
        onClick={(e) => updateFromEvent(e)}
      >
        <img
          src={imageUrl}
          alt="Aperçu focal"
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: value }}
          draggable={false}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.2)" }} />
        {/* Point focal */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: "translate(-50%, -50%)",
            width: 28,
            height: 28,
          }}
        >
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.5)"
          }} />
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            height: 1, background: "rgba(255,255,255,0.8)",
            transform: "translateY(-50%)"
          }} />
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: 1, background: "rgba(255,255,255,0.8)",
            transform: "translateX(-50%)"
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: "white",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)"
          }} />
        </div>
      </div>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>Cliquez ou glissez pour repositionner</p>
    </div>
  );
}

function ToolbarButton({ onClick, title, active, children }: { onClick: () => void; title: string; active?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className="p-2 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
      style={{ color: active ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.55)", background: active ? "rgba(255,255,255,0.08)" : "transparent" }}>
      {children}
    </button>
  );
}

function CtaModal({ onInsert, onClose }: { onInsert: (label: string, href: string, style: string) => void; onClose: () => void }) {
  const [label, setLabel] = useState("Prendre rendez-vous");
  const [href, setHref] = useState("/rendez-vous");
  const [style, setStyle] = useState("primary");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Insérer un CTA</h3>
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Texte du bouton</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Lien (URL)</label>
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/rendez-vous ou https://..." className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>Style</label>
          <div className="flex gap-3">
            {["primary", "secondary"].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={style === s} onChange={() => setStyle(s)} className="hidden" />
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: style === s ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.2)" }}>
                  {style === s && <div className="w-2 h-2 rounded-full" style={{ background: "hsl(183,70%,63%)" }} />}
                </div>
                <span className="text-sm text-white">{s === "primary" ? "Gradient (principal)" : "Contour (secondaire)"}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>Annuler</button>
          <button onClick={() => { onInsert(label, href, style); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow" style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))" }}>Insérer</button>
        </div>
      </div>
    </div>
  );
}

function RenameImageModal({ currentAlt, onSave, onClose }: { currentAlt: string; onSave: (alt: string) => void; onClose: () => void }) {
  const [alt, setAlt] = useState(currentAlt);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white">Modifier le texte alternatif</h3>
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.4)" }}><X size={16} /></button>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Texte alternatif (alt)</label>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Important pour le SEO et l'accessibilité</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>Annuler</button>
          <button onClick={() => { onSave(alt); onClose(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow" style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))" }}>
            <Check size={14} className="inline mr-1" /> Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Éditeur WYSIWYG ─────────────────────────────────────────────────────────
function WysiwygEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<"visual" | "html" | "markdown">("visual");
  const [htmlValue, setHtmlValue] = useState("");
  const [markdownValue, setMarkdownValue] = useState("");
  const [showCtaModal, setShowCtaModal] = useState(false);
  const [renameImageModal, setRenameImageModal] = useState<{ src: string; alt: string } | null>(null);

  // ── FIX 1 : charger le contenu UNE SEULE FOIS quand value arrive de Supabase ──
  // On utilise une ref pour savoir si on a déjà initialisé
  const loadedRef = useRef(false);

  useEffect(() => {
    // Si déjà chargé ou pas de contenu → ne rien faire
    if (loadedRef.current || !value) return;
    loadedRef.current = true;
    const rendered = smartRender(value);
    setHtmlValue(value);
    setMarkdownValue(htmlToMarkdown(value));
    // Injecter dans le div contentEditable après le prochain paint
    requestAnimationFrame(() => {
      if (editorRef.current) editorRef.current.innerHTML = rendered;
    });
  }, [value]);

  // ── Sync quand on change de mode ──────────────────────────────────────────
  const switchMode = (newMode: "visual" | "html" | "markdown") => {
    if (newMode === editorMode) return;
    // Capturer le contenu courant
    let currentHtml = htmlValue;
    if (editorMode === "visual" && editorRef.current) {
      currentHtml = editorRef.current.innerHTML;
      setHtmlValue(currentHtml);
      setMarkdownValue(htmlToMarkdown(currentHtml));
    } else if (editorMode === "html") {
      currentHtml = htmlValue;
      setMarkdownValue(htmlToMarkdown(currentHtml));
    } else if (editorMode === "markdown") {
      currentHtml = smartRender(markdownValue);
      setHtmlValue(currentHtml);
      onChange(currentHtml);
    }
    // Injecter dans le visuel si on y va
    if (newMode === "visual") {
      requestAnimationFrame(() => {
        if (editorRef.current) editorRef.current.innerHTML = smartRender(currentHtml);
      });
    }
    setEditorMode(newMode);
  };

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  // ── FIX 1 : handleInput ne réinjecte PAS innerHTML → pas de saut de curseur ──
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlValue(html);
      onChange(html);
    }
  };

  const insertCta = (label: string, href: string, style: string) => {
    const html = `<div class="cta-block" data-cta-style="${style}" data-href="${href}" data-label="${label}"><span class="cta-editor-preview cta-editor-${style}">${label} →</span></div><p><br></p>`;
    exec("insertHTML", html);
  };

  const insertLink = () => { const url = prompt("URL du lien :"); if (url) exec("createLink", url); };
  const insertImage = () => { const url = prompt("URL de l'image :"); if (url) exec("insertImage", url); };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      e.preventDefault();
      setRenameImageModal({ src: (target as HTMLImageElement).src, alt: target.getAttribute("alt") || "" });
    }
  };

  const saveImageAlt = (alt: string) => {
    if (!editorRef.current || !renameImageModal) return;
    editorRef.current.querySelectorAll("img").forEach((img) => { if (img.src === renameImageModal.src) img.alt = alt; });
    onChange(editorRef.current.innerHTML);
  };

  return (
    <>
      {showCtaModal && <CtaModal onInsert={insertCta} onClose={() => setShowCtaModal(false)} />}
      {renameImageModal && <RenameImageModal currentAlt={renameImageModal.alt} onSave={saveImageAlt} onClose={() => setRenameImageModal(null)} />}

      <div className="rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* ── FIX 2 : barre sticky position:sticky top:56px — toujours visible ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2"
          style={{
            background: "hsl(263, 36%, 15%)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            position: "sticky",
            top: "56px",
            zIndex: 30,
          }}>
          <ToolbarButton onClick={() => exec("bold")} title="Gras"><Bold size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("italic")} title="Italique"><Italic size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("underline")} title="Souligné"><Underline size={14} /></ToolbarButton>
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <ToolbarButton onClick={() => exec("formatBlock", "h2")} title="H2"><Heading2 size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "h3")} title="H3"><Heading3 size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "p")} title="Paragraphe"><AlignLeft size={14} /></ToolbarButton>
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Liste"><List size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("insertOrderedList")} title="Liste numérotée"><ListOrdered size={14} /></ToolbarButton>
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <ToolbarButton onClick={insertLink} title="Lien"><LinkIcon size={14} /></ToolbarButton>
          <ToolbarButton onClick={insertImage} title="Image"><ImageIcon size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "blockquote")} title="Citation"><Quote size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "pre")} title="Code"><Code size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("insertHorizontalRule")} title="Séparateur"><Minus size={14} /></ToolbarButton>
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <button type="button" onClick={() => setShowCtaModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%,0.2), hsl(284,65%,66%,0.2))", color: "hsl(183,70%,63%)", border: "1px solid hsl(183,70%,63%,0.3)" }}>
            <Zap size={13} /> CTA
          </button>
          <button type="button" onClick={() => {
            const img = editorRef.current?.querySelector("img");
            if (img) setRenameImageModal({ src: img.src, alt: img.alt || "" });
            else alert("Cliquez d'abord sur une image.");
          }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.50)" }}>
            <Pencil size={13} /> Alt image
          </button>
          <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <ToolbarButton onClick={() => exec("undo")} title="Annuler"><RotateCcw size={14} /></ToolbarButton>
          <ToolbarButton onClick={() => exec("redo")} title="Refaire"><RotateCw size={14} /></ToolbarButton>
          <div className="flex-1" />
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {(["visual", "html", "markdown"] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => switchMode(mode)}
                className="px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: editorMode === mode ? "rgba(255,255,255,0.15)" : "transparent",
                  color: editorMode === mode ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.45)",
                  borderRight: mode !== "markdown" ? "1px solid rgba(255,255,255,0.1)" : "none"
                }}>
                {mode === "visual" ? "Visuel" : mode === "html" ? "HTML" : "Markdown"}
              </button>
            ))}
          </div>
        </div>

        {editorMode === "html" && (
          <textarea value={htmlValue}
            onChange={(e) => { setHtmlValue(e.target.value); onChange(e.target.value); }}
            className="w-full px-5 py-4 text-sm font-mono focus:outline-none resize-y"
            style={{ background: "hsl(263, 36%, 11%)", color: "rgba(255,255,255,0.75)", minHeight: "400px" }}
            placeholder="<h2>Contenu HTML...</h2>" />
        )}

        {editorMode === "markdown" && (
          <div>
            <textarea value={markdownValue}
              onChange={(e) => { setMarkdownValue(e.target.value); onChange(smartRender(e.target.value)); }}
              className="w-full px-5 py-4 text-sm font-mono focus:outline-none resize-y"
              style={{ background: "hsl(263, 36%, 11%)", color: "rgba(255,255,255,0.75)", minHeight: "400px" }}
              placeholder={"## Titre\n\nÉcrivez en **Markdown**, HTML ou les deux mélangés..."} />
            <div className="px-5 py-2 text-xs" style={{ background: "hsl(263, 36%, 13%)", color: "rgba(255,255,255,0.30)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              ✨ Détection automatique · **gras** · *italique* · ## Titre · - liste · [lien](url) · `code`
            </div>
          </div>
        )}

        {editorMode === "visual" && (
          <div ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onClick={handleEditorClick}
            className="wysiwyg-editor px-5 py-4 focus:outline-none"
            style={{ background: "hsl(263, 36%, 11%)", color: "rgba(255,255,255,0.85)", minHeight: "400px", lineHeight: "1.8" }} />
        )}

        <style>{`
          .wysiwyg-editor h2{font-size:1.5rem;font-weight:700;margin:1.5rem 0 .75rem;color:white}
          .wysiwyg-editor h3{font-size:1.25rem;font-weight:600;margin:1.25rem 0 .5rem;color:white}
          .wysiwyg-editor p{margin:.75rem 0}
          .wysiwyg-editor strong{color:white;font-weight:700}
          .wysiwyg-editor em{font-style:italic}
          .wysiwyg-editor a{color:hsl(183,70%,63%);text-decoration:underline}
          .wysiwyg-editor ul{list-style:disc;padding-left:1.5rem;margin:.75rem 0}
          .wysiwyg-editor ol{list-style:decimal;padding-left:1.5rem;margin:.75rem 0}
          .wysiwyg-editor li{margin:.25rem 0}
          .wysiwyg-editor blockquote{border-left:3px solid hsl(183,70%,63%);padding-left:1rem;margin:1rem 0;color:rgba(255,255,255,.6);font-style:italic}
          .wysiwyg-editor pre{background:rgba(255,255,255,.05);padding:1rem;border-radius:.5rem;font-family:monospace;margin:.75rem 0}
          .wysiwyg-editor hr{border:none;border-top:1px solid rgba(255,255,255,.1);margin:1.5rem 0}
          .wysiwyg-editor img{max-width:100%;border-radius:.5rem;margin:.75rem 0;cursor:pointer;outline:2px solid transparent;transition:outline .2s}
          .wysiwyg-editor img:hover{outline:2px solid hsl(183,70%,63%)}
          .wysiwyg-editor:empty:before{content:"Commencez à écrire...";color:rgba(255,255,255,.2);pointer-events:none}
          .wysiwyg-editor .cta-block{margin:1.5rem 0;text-align:center}
          .cta-editor-preview{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 2rem;border-radius:9999px;font-weight:600;font-size:.9rem;pointer-events:none}
          .cta-editor-primary{background:linear-gradient(135deg,hsl(183,70%,63%),hsl(284,65%,66%));color:white;box-shadow:0 0 20px hsl(183,70%,63%,.3)}
          .cta-editor-secondary{border:2px solid hsl(263,36%,40%);color:hsl(263,36%,40%);background:transparent}
        `}</style>
      </div>
    </>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [saved, setSaved] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "",
    cover_image_url: "", cover_image_position: "50% 50%", status: "draft", category: CATEGORIES[0],
    tags: [] as string[], read_time: "3 min", related_slugs: [] as string[],
    meta_title: "", meta_description: "",
    created_at: new Date().toISOString().split("T")[0],
    scheduled_at: "",
    scheduled_time: "09:00",
  });

  useEffect(() => { if (!loading && !isAdmin) navigate("/admin/login"); }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || isNew) return;
    supabase.from("cms_blog_posts").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({
        title: data.title ?? "", slug: data.slug ?? "", content: data.content ?? "",
        excerpt: data.excerpt ?? "", cover_image_url: data.cover_image_url ?? "", cover_image_position: data.cover_image_position ?? "50% 50%",
        status: data.status ?? "draft", category: data.category ?? CATEGORIES[0],
        tags: data.tags ?? [], read_time: data.read_time ?? "3 min",
        related_slugs: data.related_slugs ?? [], meta_title: data.meta_title ?? "",
        meta_description: data.meta_description ?? "",
        created_at: data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        scheduled_at: data.scheduled_at ? data.scheduled_at.split("T")[0] : "",
        scheduled_time: data.scheduled_at ? data.scheduled_at.split("T")[1]?.slice(0, 5) : "09:00",
      });
    });
  }, [isAdmin, id, isNew]);

  function update(field: string, value: any) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && (isNew || prev.slug === slugify(prev.title))) updated.slug = slugify(value);
      if (field === "title" && !prev.meta_title) updated.meta_title = value;
      return updated;
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) update("tags", [...form.tags, tag]);
    setTagInput("");
  }

  async function uploadCoverImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadProgress("Optimisation et conversion WebP...");
    try {
      const webpBlob = await convertToWebP(file, 0.85);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const fileName = `${slugify(baseName)}-${Date.now()}.webp`;
      const filePath = `blog/${fileName}`;
      setUploadProgress("Upload en cours...");
      const { error } = await supabase.storage.from("cms-images").upload(filePath, webpBlob, { upsert: true, contentType: "image/webp" });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(filePath);
        update("cover_image_url", publicUrl);
        const sizeKb = Math.round(webpBlob.size / 1024);
        setUploadProgress(`✓ ${sizeKb} Ko — optimisé`);
        setTimeout(() => setUploadProgress(""), 3000);
      } else alert("Erreur upload : " + error.message);
    } catch (err: any) { alert("Erreur conversion : " + err.message); }
    finally { setUploading(false); setUploadProgress(""); if (imageInputRef.current) imageInputRef.current.value = ""; }
  }

  async function handleSave(publishNow = false) {
    if (!form.title || !form.slug) { alert("Le titre et le slug sont obligatoires."); return; }
    setSaving(true);
    let autoPublish = publishNow;
    let scheduledIso: string | null = null;
    if (form.scheduled_at) {
      const time = form.scheduled_time || "09:00";
      scheduledIso = new Date(`${form.scheduled_at}T${time}:00`).toISOString();
      if (!publishNow && form.status !== "published" && new Date(scheduledIso) <= new Date()) autoPublish = true;
    }
    // scheduled_time est local uniquement — ne pas envoyer à Supabase
    const { scheduled_time, ...formData } = form;
    const payload = {
      ...formData,
      status: autoPublish ? "published" : form.status,
      scheduled_at: scheduledIso,
      updated_at: new Date().toISOString(),
      created_at: new Date(form.created_at).toISOString(),
    };
    if (isNew) {
      const { data, error } = await supabase.from("cms_blog_posts").insert(payload).select().single();
      if (data) navigate(`/admin/blog/${data.id}`, { replace: true });
      if (error) alert("Erreur : " + error.message);
    } else {
      const { error } = await supabase.from("cms_blog_posts").update(payload).eq("id", id);
      if (error) alert("Erreur : " + error.message);
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="sticky top-0 z-30 flex items-center justify-between mb-6 flex-wrap gap-3 py-3 -mx-6 px-6 md:-mx-8 md:px-8"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <Link to="/admin/blog" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors"><ArrowLeft size={18} /></Link>
            <h1 className="text-lg font-bold text-white truncate max-w-xs">{isNew ? "Nouvel article" : form.title || "Modifier"}</h1>
          </div>
          <div className="flex gap-2">
            {!isNew && form.slug && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                <Eye size={14} /> Aperçu
              </a>
            )}
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "✓ Sauvegardé" : "Enregistrer"}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              Publier
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Titre *</label>
                <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Titre de l'article..."
                  className="w-full rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Slug URL</label>
                <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>/blog/</span>
                  <input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="flex-1 bg-transparent text-sm text-white focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Extrait *</label>
              <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={3} placeholder="Description courte..."
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                Contenu * <span style={{ color: "rgba(255,255,255,0.25)" }}>({form.content.length} caractères)</span>
              </label>
              <WysiwygEditor value={form.content} onChange={(val) => update("content", val)} />
            </div>

            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">SEO</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Meta title <span style={{ color: form.meta_title.length > 70 ? "hsl(0,70%,60%)" : "rgba(255,255,255,0.25)" }}>({form.meta_title.length}/70)</span>
                </label>
                <input value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)} placeholder="Titre pour Google (60-70 caractères)"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Meta description <span style={{ color: form.meta_description.length > 160 ? "hsl(0,70%,60%)" : "rgba(255,255,255,0.25)" }}>({form.meta_description.length}/160)</span>
                </label>
                <textarea value={form.meta_description} onChange={(e) => update("meta_description", e.target.value)} rows={3} placeholder="Description pour Google (150-160 caractères)"
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Publication</h3>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Statut</label>
                <select value={form.status} onChange={(e) => update("status", e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <option value="draft" className="bg-[#1a1020]">Brouillon</option>
                  <option value="published" className="bg-[#1a1020]">Publié</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}><Calendar size={11} className="inline mr-1" />Date</label>
                <input type="date" value={form.created_at} onChange={(e) => update("created_at", e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}><Calendar size={11} className="inline mr-1" />Programmer la publication</label>
                <input type="date" value={form.scheduled_at} onChange={(e) => update("scheduled_at", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                {form.scheduled_at && (
                  <input type="time" value={form.scheduled_time || "09:00"} onChange={(e) => update("scheduled_time", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none mt-2"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                )}
                {form.scheduled_at && form.status !== "published" && (
                  <p className="text-xs mt-1" style={{ color: "hsl(183,70%,63%)" }}>
                    ⏰ Sera publié le {new Date(form.scheduled_at).toLocaleDateString("fr-FR")} à {form.scheduled_time || "09:00"}
                  </p>
                )}
                {form.scheduled_at && (
                  <button type="button" onClick={() => update("scheduled_at", "")}
                    className="text-xs mt-1 hover:text-red-400 transition-colors block"
                    style={{ color: "rgba(255,255,255,0.30)" }}>× Annuler la programmation</button>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Temps de lecture</label>
                <input value={form.read_time} onChange={(e) => update("read_time", e.target.value)} placeholder="3 min"
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Image de couverture</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>✨ Conversion WebP automatique</p>
              {form.cover_image_url && (
                <div className="space-y-3">
                  <div className="relative">
                    <img src={form.cover_image_url} alt="Cover" className="w-full h-32 object-cover rounded-xl"
                      style={{ objectPosition: form.cover_image_position }} />
                    <button onClick={() => update("cover_image_url", "")} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                  <FocalPointPicker
                    imageUrl={form.cover_image_url}
                    value={form.cover_image_position}
                    onChange={(val) => update("cover_image_position", val)}
                  />
                </div>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" onChange={uploadCoverImage} className="hidden" />
              <button onClick={() => imageInputRef.current?.click()} disabled={uploading}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.45)" }}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? uploadProgress || "Traitement..." : "Uploader une image"}
              </button>
              <input value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} placeholder="Ou coller une URL externe..."
                className="w-full rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Catégorie</h3>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={() => update("category", cat)} className="hidden" />
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: form.category === cat ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.2)" }}>
                    {form.category === cat && <div className="w-2 h-2 rounded-full" style={{ background: "hsl(183,70%,63%)" }} />}
                  </div>
                  <span className="text-sm" style={{ color: form.category === cat ? "white" : "rgba(255,255,255,0.45)" }}>{cat}</span>
                </label>
              ))}
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-bold text-white">Tags</h3>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Ajouter un tag..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                <button onClick={addTag} className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.70)" }}>
                    {tag}
                    <button onClick={() => update("tags", form.tags.filter((t) => t !== tag))} className="hover:text-red-400"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
