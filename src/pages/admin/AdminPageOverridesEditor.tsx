// src/pages/admin/AdminPageOverridesEditor.tsx
// Contenu entierement dynamique - blocs ajoutables/supprimables/reordonnables
// RichTextEditor sur tous les blocs texte

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Globe, Trash2, Plus, GripVertical,
  ChevronDown, ChevronUp, X, Check, RotateCcw,
  Image as ImageIcon, Code, Megaphone, Loader2, Type
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { invalidatePageCache } from "@/hooks/usePageContent";
import RichTextEditor from "@/components/admin/RichTextEditor";

// ── Types ────────────────────────────────────────────────────
type BlockType = "h2" | "h3" | "h4" | "p" | "html" | "image" | "link";

type ContentBlock = {
  id: string;
  type: BlockType;
  content: string;
  label?: string; // pour les liens : texte du lien
  visible: boolean;
};

type FormState = {
  page_label: string;
  page_url: string;
  seo_title: string;
  seo_description: string;
  seo_h1: string;
  hero_intro: string;
  hero_bg_image_url: string;
  content_blocks: ContentBlock[];
  custom_html: string;
  is_published: boolean;
};

type StickyBarConfig = {
  enabled: boolean;
  text: string;
  cta_label: string;
  cta_href: string;
  bg_color: string;
  text_color: string;
};

const STICKY_DEFAULT: StickyBarConfig = {
  enabled: false, text: "", cta_label: "",
  cta_href: "/contact",
  bg_color: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))",
  text_color: "#ffffff",
};

const EMPTY_FORM: FormState = {
  page_label: "", page_url: "",
  seo_title: "", seo_description: "", seo_h1: "",
  hero_intro: "", hero_bg_image_url: "",
  content_blocks: [], custom_html: "", is_published: false,
};

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: "h2",    label: "Titre H2",          icon: <span className="font-bold text-xs">H2</span>, color: "hsl(183,70%,63%)" },
  { type: "h3",    label: "Titre H3",          icon: <span className="font-bold text-xs">H3</span>, color: "hsl(183,70%,63%)" },
  { type: "h4",    label: "Titre H4",          icon: <span className="font-bold text-xs">H4</span>, color: "hsl(183,70%,63%)" },
  { type: "p",     label: "Paragraphe",        icon: <Type size={12} />,    color: "rgba(255,255,255,0.6)" },
  { type: "html",  label: "HTML libre",        icon: <Code size={12} />,    color: "rgb(99,179,237)" },
  { type: "image", label: "Image (URL)",       icon: <ImageIcon size={12} />, color: "hsl(284,65%,66%)" },
  { type: "link",  label: "Lien / Bouton CTA", icon: <span className="text-xs">🔗</span>, color: "hsl(330,100%,70%)" },
];

function newBlock(type: BlockType): ContentBlock {
  return { id: `b-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, type, content: "", visible: true };
}

function overrideToForm(o: any): FormState {
  // Compat : si l'ancienne structure avait des champs fixes, on les migre en blocs
  const blocks: ContentBlock[] = o.content_blocks ?? [];
  if (blocks.length === 0) {
    // Migration des anciens champs fixes vers des blocs
    const legacyFields = [
      { key: "hero_intro",          label: "Intro" },
      { key: "creation_seo_text_1", label: "Texte SEO §1" },
      { key: "creation_seo_text_2", label: "Texte SEO §2" },
      { key: "creation_why_text",   label: "Pourquoi" },
      { key: "seo_local_text",      label: "SEO local" },
      { key: "seo_why_text",        label: "Pourquoi SEO" },
      { key: "local_fact",          label: "Le saviez-vous" },
    ];
    legacyFields.forEach(({ key }) => {
      if (o[key]) blocks.push({ id: `legacy-${key}`, type: "p", content: o[key], visible: true });
    });
  }
  return {
    page_label: o.page_label ?? "",
    page_url: o.page_url ?? "",
    seo_title: o.seo_title ?? "",
    seo_description: o.seo_description ?? "",
    seo_h1: o.seo_h1 ?? "",
    hero_intro: o.hero_intro ?? "",
    hero_bg_image_url: o.hero_bg_image_url ?? "",
    content_blocks: blocks,
    custom_html: o.custom_html ?? "",
    is_published: o.is_published ?? false,
  };
}

// ── Bloc editor ──────────────────────────────────────────────
function BlockEditor({ block, index, total, onChange, onDelete, onMove }: {
  block: ContentBlock; index: number; total: number;
  onChange: (b: ContentBlock) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(true);
  const typeConf = BLOCK_TYPES.find(t => t.type === block.type)!;

  const preview = block.content
    ? block.content.replace(/<[^>]*>/g, "").slice(0, 55) + (block.content.length > 55 ? "..." : "")
    : "Bloc vide";

  return (
    <div className="rounded-xl overflow-hidden"
      style={{
        background: "hsl(263, 36%, 15%)",
        border: `1px solid ${block.type === "html" ? "rgba(99,179,237,0.2)" : "rgba(255,255,255,0.07)"}`,
      }}>
      {/* Header du bloc */}
      <div className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.20)", cursor: "grab", flexShrink: 0 }} />

        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md shrink-0"
            style={{ background: "rgba(255,255,255,0.07)", color: typeConf.color }}>
            {typeConf.icon} {block.type.toUpperCase()}
          </span>
          <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.40)" }}>
            {preview}
          </span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {/* Visibilite */}
          <button
            onClick={() => onChange({ ...block, visible: !block.visible })}
            className="px-2 py-1 rounded-lg text-xs transition-all"
            style={{
              background: block.visible ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
              color: block.visible ? "rgb(74,222,128)" : "rgba(255,255,255,0.30)",
            }}
            title={block.visible ? "Visible" : "Cache"}
          >
            {block.visible ? "On" : "Off"}
          </button>
          <button onClick={() => onMove("up")} disabled={index === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            <ChevronUp size={13} />
          </button>
          <button onClick={() => onMove("down")} disabled={index === total - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            <ChevronDown size={13} />
          </button>
          <button onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/20 transition"
            style={{ color: "rgba(255,255,255,0.30)" }}>
            <Trash2 size={13} />
          </button>
          <button onClick={() => setOpen(!open)}
            className="p-1 rounded hover:bg-white/10 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Corps du bloc */}
      {open && (
        <div className="p-3 space-y-3">
          {/* Selecteur de type */}
          <div className="flex flex-wrap gap-1.5">
            {BLOCK_TYPES.map(bt => (
              <button key={bt.type}
                onClick={() => onChange({ ...block, type: bt.type })}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: block.type === bt.type ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  color: block.type === bt.type ? bt.color : "rgba(255,255,255,0.40)",
                  border: `1px solid ${block.type === bt.type ? "rgba(255,255,255,0.15)" : "transparent"}`,
                }}>
                {bt.icon} {bt.label}
              </button>
            ))}
          </div>

          {/* Champ de contenu selon le type */}
          {block.type === "h2" || block.type === "h3" || block.type === "h4" ? (
            <input
              value={block.content}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              placeholder={`Texte du ${block.type.toUpperCase()}...`}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontWeight: block.type === "h2" ? 700 : block.type === "h3" ? 600 : 500,
                fontSize: block.type === "h2" ? "16px" : block.type === "h3" ? "14px" : "13px",
              }}
            />
          ) : block.type === "p" ? (
            <RichTextEditor
              value={block.content}
              onChange={(html) => onChange({ ...block, content: html })}
              placeholder="Saisissez votre paragraphe..."
              minHeight={120}
            />
          ) : block.type === "html" ? (
            <div>
              <textarea
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                rows={8}
                placeholder={"<p>Mon texte avec du <strong>gras</strong> et un <a href='/contact'>lien</a></p>\n<ul>\n  <li>Element 1</li>\n  <li>Element 2</li>\n</ul>"}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-y"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(99,179,237,0.25)",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  lineHeight: "1.6",
                }}
              />
              <p className="text-xs mt-1" style={{ color: "rgba(99,179,237,0.6)" }}>
                HTML brut accepte : p, h2, h3, h4, ul, ol, li, strong, em, a, br, div, table...
              </p>
            </div>
          ) : block.type === "image" ? (
            <div className="space-y-2">
              <input
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="https://... URL de l'image"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <input
                value={block.label ?? ""}
                onChange={(e) => onChange({ ...block, label: e.target.value })}
                placeholder="Texte alternatif (alt)..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {block.content && (
                <img src={block.content} alt={block.label ?? ""} className="w-full h-32 object-cover rounded-xl mt-2" />
              )}
            </div>
          ) : block.type === "link" ? (
            <div className="space-y-2">
              <input
                value={block.label ?? ""}
                onChange={(e) => onChange({ ...block, label: e.target.value })}
                placeholder="Texte du lien / bouton..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <input
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="URL : /contact ou https://..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {block.label && block.content && (
                <div className="flex">
                  <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                    {block.label} →
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── Composant principal ──────────────────────────────────────
export default function AdminPageOverridesEditor() {
  const { pageKey: encodedKey } = useParams<{ pageKey: string }>();
  const pageKey = decodeURIComponent(encodedKey ?? "");
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"seo" | "contenu" | "html" | "stickybar">("seo");
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [stickyBar, setStickyBar] = useState<StickyBarConfig>(STICKY_DEFAULT);
  const [stickyBarId, setStickyBarId] = useState<string | null>(null);
  const [savingSticky, setSavingSticky] = useState(false);
  const [savedSticky, setSavedSticky] = useState(false);

  const pageType = pageKey.startsWith("creation/") ? "ville_creation"
    : pageKey.startsWith("seo/") ? "ville_seo"
    : pageKey.startsWith("metier/") ? "metier" : "static";

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !pageKey) return;
    async function load() {
      const { data } = await supabase.from("page_overrides").select("*").eq("page_key", pageKey).maybeSingle();
      if (data) { setForm(overrideToForm(data)); setExistingId(data.id); }
      else {
        const slug = pageKey.split("/")[1] ?? "";
        const label = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const url = pageType === "ville_creation" ? `/creation-site-web/${slug}`
          : pageType === "ville_seo" ? `/referencement-seo/${slug}`
          : pageType === "metier" ? `/creation-site-web/metier/${slug}`
          : `/${slug}`;
        setForm({ ...EMPTY_FORM, page_label: label, page_url: url });
      }
      const { data: sbData } = await supabase.from("site_settings").select("*").eq("key", "sticky_bar").maybeSingle();
      if (sbData?.value) { setStickyBar({ ...STICKY_DEFAULT, ...sbData.value }); setStickyBarId(sbData.id); }
      setLoadingData(false);
    }
    load();
  }, [isAdmin, pageKey, pageType]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function updateBlock(index: number, block: ContentBlock) {
    const next = [...form.content_blocks];
    next[index] = block;
    updateField("content_blocks", next);
  }

  function deleteBlock(index: number) {
    updateField("content_blocks", form.content_blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, dir: "up" | "down") {
    const next = [...form.content_blocks];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateField("content_blocks", next);
  }

  function addBlock(type: BlockType) {
    updateField("content_blocks", [...form.content_blocks, newBlock(type)]);
    setShowAddBlock(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const ext = file.name.split(".").pop();
    const path = `hero/${pageKey.replace(/\//g, "-")}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("page-media").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("page-media").getPublicUrl(path);
      updateField("hero_bg_image_url", urlData.publicUrl);
    }
    setImageUploading(false);
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    const payload = {
      page_key: pageKey,
      page_type: pageType,
      page_label: form.page_label,
      page_url: form.page_url,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      seo_h1: form.seo_h1 || null,
      hero_intro: form.hero_intro || null,
      hero_bg_image_url: form.hero_bg_image_url || null,
      content_blocks: form.content_blocks,
      custom_html: form.custom_html || null,
      // Compat legacy
      sections: [],
      creation_seo_text_1: null,
      creation_seo_text_2: null,
      creation_why_text: null,
      seo_local_text: null,
      seo_why_text: null,
      local_fact: null,
      is_published: publish !== undefined ? publish : form.is_published,
      updated_at: new Date().toISOString(),
    };
    let error;
    if (existingId) {
      ({ error } = await supabase.from("page_overrides").update(payload).eq("id", existingId));
    } else {
      const { data, error: e } = await supabase.from("page_overrides").insert(payload).select().single();
      error = e;
      if (data) setExistingId(data.id);
    }
    if (!error) {
      if (publish !== undefined) updateField("is_published", publish);
      invalidatePageCache(pageKey);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  async function handleSaveSticky() {
    setSavingSticky(true);
    const payload = { key: "sticky_bar", value: stickyBar };
    let error;
    if (stickyBarId) {
      ({ error } = await supabase.from("site_settings").update(payload).eq("id", stickyBarId));
    } else {
      const { data, error: e } = await supabase.from("site_settings").insert(payload).select().single();
      error = e;
      if (data) setStickyBarId(data.id);
    }
    if (!error) { setSavedSticky(true); setTimeout(() => setSavedSticky(false), 2500); }
    setSavingSticky(false);
  }

  async function handleDelete() {
    if (!existingId) return;
    if (!confirm("Supprimer toutes les surcharges de cette page ?")) return;
    await supabase.from("page_overrides").delete().eq("id", existingId);
    invalidatePageCache(pageKey);
    navigate("/admin/pages");
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  const TABS = [
    { key: "seo",       label: "SEO & Meta" },
    { key: "contenu",   label: `Contenu (${form.content_blocks.length})` },
    { key: "html",      label: "HTML brut", icon: <Code size={10} /> },
    { key: "stickybar", label: "Sticky bar", icon: <Megaphone size={10} /> },
  ] as const;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-8">

        {/* Header sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between py-3 mb-6 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-2"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/pages" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{pageKey}</p>
              <h1 className="text-sm font-bold text-white truncate">{form.page_label || "Nouvelle page"}</h1>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{
                background: form.is_published ? "rgba(34,197,94,0.15)" : "rgba(251,146,60,0.15)",
                color: form.is_published ? "rgb(74,222,128)" : "rgb(251,146,60)",
              }}>
              {form.is_published ? "Publie" : existingId ? "Brouillon" : "Non edite"}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={form.page_url || "#"} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
              <Globe size={12} /> Voir
            </a>
            {existingId && (
              form.is_published ? (
                <button onClick={() => handleSave(false)} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium disabled:opacity-50"
                  style={{ background: "rgba(251,146,60,0.15)", color: "rgb(251,146,60)" }}>
                  <RotateCcw size={12} /> Depublier
                </button>
              ) : (
                <button onClick={() => handleSave(true)} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 btn-glow"
                  style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Publier
                </button>
              )
            )}
            {existingId && (
              <button onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs hover:bg-red-500/20 transition"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                <Trash2 size={12} />
              </button>
            )}
            <button onClick={() => handleSave()} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.08)", color: saved ? "rgb(74,222,128)" : "rgba(255,255,255,0.80)" }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {saved ? "Sauvegarde" : "Brouillon"}
            </button>
          </div>
        </div>

        {/* Apercu Google */}
        {(form.seo_title || form.seo_description) && (
          <div className="rounded-2xl p-4 mb-6"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Apercu Google</p>
            <p className="text-sm font-medium" style={{ color: "hsl(220,90%,70%)" }}>{form.seo_title || "Titre non defini"}</p>
            <p className="text-xs" style={{ color: "hsl(140,60%,50%)" }}>declicdigital.net{form.page_url}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{form.seo_description || "-"}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
          style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap px-2"
              style={activeTab === tab.key
                ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                : { color: "rgba(255,255,255,0.45)" }}>
              {"icon" in tab ? tab.icon : null} {tab.label}
            </button>
          ))}
        </div>

        {/* ── SEO ── */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            {[
              { key: "seo_title" as const,       label: `Title SEO (${form.seo_title.length}/60)`,       hint: "Max 60 car.", error: form.seo_title.length > 60 },
              { key: "seo_description" as const,  label: `Meta description (${form.seo_description.length}/160)`, hint: "Max 160 car.", error: form.seo_description.length > 160 },
              { key: "seo_h1" as const,           label: "H1 de la page", hint: "Titre principal visible par les visiteurs.", error: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1.5"
                  style={{ color: f.error ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}>
                  {f.label}
                </label>
                <input value={form[f.key]}
                  onChange={e => updateField(f.key, e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${f.error ? "hsl(0,70%,50%)" : "rgba(255,255,255,0.08)"}`,
                  }} />
                {f.hint && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{f.hint}</p>}
              </div>
            ))}

            {/* Hero intro et image dans SEO aussi */}
            <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-semibold mb-3 text-white">Hero</p>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Texte d'intro (sous le H1)
                </label>
                <RichTextEditor
                  value={form.hero_intro}
                  onChange={html => updateField("hero_intro", html)}
                  placeholder="Texte d'introduction..."
                  minHeight={80}
                />
              </div>
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-medium text-white">Image de fond hero</p>
                {form.hero_bg_image_url && (
                  <div className="relative">
                    <img src={form.hero_bg_image_url} alt="" className="w-full h-28 object-cover rounded-xl" />
                    <button onClick={() => updateField("hero_bg_image_url", "")}
                      className="absolute top-2 right-2 p-1 rounded-lg"
                      style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                  {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                  {imageUploading ? "Upload..." : "Uploader une image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <input value={form.hero_bg_image_url}
                  onChange={e => updateField("hero_bg_image_url", e.target.value)}
                  placeholder="Ou coller une URL directe..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENU dynamique ── */}
        {activeTab === "contenu" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {form.content_blocks.length} bloc{form.content_blocks.length > 1 ? "s" : ""} de contenu
              </p>
              {form.content_blocks.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer tous les blocs ?"))
                      updateField("content_blocks", []);
                  }}
                  className="text-xs px-2 py-1 rounded-lg hover:bg-red-500/15 transition"
                  style={{ color: "rgba(255,255,255,0.30)" }}>
                  Tout vider
                </button>
              )}
            </div>

            {form.content_blocks.map((block, i) => (
              <BlockEditor
                key={block.id}
                block={block}
                index={i}
                total={form.content_blocks.length}
                onChange={b => updateBlock(i, b)}
                onDelete={() => deleteBlock(i)}
                onMove={dir => moveBlock(i, dir)}
              />
            ))}

            {/* Ajouter un bloc */}
            {showAddBlock ? (
              <div className="rounded-2xl p-4"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-white">Ajouter un bloc</p>
                  <button onClick={() => setShowAddBlock(false)} style={{ color: "rgba(255,255,255,0.35)" }}>
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TYPES.map(bt => (
                    <button key={bt.type} onClick={() => addBlock(bt.type)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.70)" }}>
                      <span className="flex items-center justify-center w-5" style={{ color: bt.color }}>
                        {bt.icon}
                      </span>
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddBlock(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all hover:border-white/30"
                style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
                <Plus size={14} /> Ajouter un bloc
              </button>
            )}
          </div>
        )}

        {/* ── HTML brut ── */}
        {activeTab === "html" && (
          <div className="space-y-4">
            <div className="rounded-xl p-3 flex gap-2"
              style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
              <Code size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
              <div>
                <p className="text-xs font-medium text-white mb-1">HTML personnalise global</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                  Injecte apres le contenu principal. Utile pour des tableaux complexes, des widgets ou du code specifique.
                </p>
              </div>
            </div>
            <textarea
              value={form.custom_html}
              onChange={e => updateField("custom_html", e.target.value)}
              rows={20}
              placeholder={"<section>\n  <h2>Titre supplementaire</h2>\n  <p>Contenu avec du <strong>gras</strong>.</p>\n  <ul>\n    <li>Element 1</li>\n    <li>Element 2</li>\n  </ul>\n</section>"}
              className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-y"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(99,179,237,0.25)",
                fontFamily: "monospace",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            />
            <p className="text-xs" style={{ color: "rgba(99,179,237,0.6)" }}>
              Balises acceptees : p, h2, h3, h4, ul, ol, li, strong, em, a, br, span, div, section, table, tr, td, th
            </p>
          </div>
        )}

        {/* ── Sticky bar ── */}
        {activeTab === "stickybar" && (
          <div className="space-y-4">
            <div className="rounded-xl p-3 flex gap-2"
              style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
              <Megaphone size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                Barre globale affichee en haut de toutes les pages pour tous les visiteurs.
              </p>
            </div>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl"
              style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-sm text-white font-medium">Activer la sticky bar</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {stickyBar.enabled ? "Visible sur le site" : "Masquee"}
                </p>
              </div>
              <div onClick={() => setStickyBar(p => ({ ...p, enabled: !p.enabled }))}
                className="relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0"
                style={{ background: stickyBar.enabled ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.15)" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: stickyBar.enabled ? "translateX(23px)" : "translateX(4px)" }} />
              </div>
            </label>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                Texte de la barre
              </label>
              <RichTextEditor
                value={stickyBar.text}
                onChange={html => setStickyBar(p => ({ ...p, text: html }))}
                placeholder="Offre speciale - Audit SEO gratuit ce mois-ci !"
                minHeight={60}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                Texte du bouton CTA (optionnel)
              </label>
              <input value={stickyBar.cta_label}
                onChange={e => setStickyBar(p => ({ ...p, cta_label: e.target.value }))}
                placeholder="En profiter"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                Lien du bouton
              </label>
              <input value={stickyBar.cta_href}
                onChange={e => setStickyBar(p => ({ ...p, cta_href: e.target.value }))}
                placeholder="/contact"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Couleur de fond", key: "bg_color" as const },
                { label: "Couleur texte",   key: "text_color" as const },
              ].map(c => (
                <div key={c.key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {c.label}
                  </label>
                  <div className="flex gap-2">
                    <input type="color"
                      value={stickyBar[c.key].startsWith("#") ? stickyBar[c.key] : "#4cc9b0"}
                      onChange={e => setStickyBar(p => ({ ...p, [c.key]: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                      style={{ background: "rgba(255,255,255,0.05)" }} />
                    <input value={stickyBar[c.key]}
                      onChange={e => setStickyBar(p => ({ ...p, [c.key]: e.target.value }))}
                      placeholder="#hex"
                      className="flex-1 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                </div>
              ))}
            </div>

            {stickyBar.text && (
              <div>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Apercu</p>
                <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                  style={{ background: stickyBar.bg_color, color: stickyBar.text_color }}>
                  <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: stickyBar.text }} />
                  {stickyBar.cta_label && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                      style={{ background: "rgba(255,255,255,0.2)" }}>
                      {stickyBar.cta_label}
                    </span>
                  )}
                </div>
              </div>
            )}

            {savedSticky && (
              <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                <Check size={12} /> Sticky bar sauvegardee
              </div>
            )}
            <button onClick={handleSaveSticky} disabled={savingSticky}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              {savingSticky ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer la sticky bar
            </button>
          </div>
        )}

        {/* Boutons bas */}
        {activeTab !== "stickybar" && (
          <div className="flex gap-2 mt-8 pt-6 flex-wrap"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => handleSave()} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.80)" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Sauvegarder brouillon
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Publier maintenant
            </button>
            {existingId && (
              <button onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:bg-red-500/15 ml-auto transition"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                <Trash2 size={14} /> Supprimer les surcharges
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .field-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          padding: 10px 14px; font-size: 14px; color: white; outline: none;
        }
        .field-input:focus { border-color: hsl(183,70%,63%); }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </AdminLayout>
  );
}
