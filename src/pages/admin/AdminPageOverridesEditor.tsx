// src/pages/admin/AdminPageOverridesEditor.tsx
// Ajouts : type "html" dans les sections libres + onglet Sticky Bar

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Eye, Loader2, Globe, Trash2,
  Plus, GripVertical, ChevronDown, ChevronUp, X,
  Check, RotateCcw, Image as ImageIcon, Code, Megaphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { invalidatePageCache } from "@/hooks/usePageContent";
import type { PageOverride, Section } from "@/hooks/usePageContent";

// ── Types ────────────────────────────────────────────────────
type FormState = {
  page_label: string;
  page_url: string;
  seo_title: string;
  seo_description: string;
  seo_h1: string;
  hero_intro: string;
  hero_bg_image_url: string;
  creation_seo_text_1: string;
  creation_seo_text_2: string;
  creation_why_text: string;
  seo_local_text: string;
  seo_why_text: string;
  local_fact: string;
  custom_html: string;
  sections: Section[];
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

const STICKY_BAR_DEFAULT: StickyBarConfig = {
  enabled: false,
  text: "",
  cta_label: "",
  cta_href: "/contact",
  bg_color: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))",
  text_color: "#ffffff",
};

const EMPTY_FORM: FormState = {
  page_label: "",
  page_url: "",
  seo_title: "",
  seo_description: "",
  seo_h1: "",
  hero_intro: "",
  hero_bg_image_url: "",
  creation_seo_text_1: "",
  creation_seo_text_2: "",
  creation_why_text: "",
  seo_local_text: "",
  seo_why_text: "",
  local_fact: "",
  custom_html: "",
  sections: [],
  is_published: false,
};

function overrideToForm(o: PageOverride): FormState {
  return {
    page_label: o.page_label ?? "",
    page_url: o.page_url ?? "",
    seo_title: o.seo_title ?? "",
    seo_description: o.seo_description ?? "",
    seo_h1: o.seo_h1 ?? "",
    hero_intro: o.hero_intro ?? "",
    hero_bg_image_url: o.hero_bg_image_url ?? "",
    creation_seo_text_1: o.creation_seo_text_1 ?? "",
    creation_seo_text_2: o.creation_seo_text_2 ?? "",
    creation_why_text: o.creation_why_text ?? "",
    seo_local_text: o.seo_local_text ?? "",
    seo_why_text: o.seo_why_text ?? "",
    local_fact: o.local_fact ?? "",
    custom_html: (o as any).custom_html ?? "",
    sections: o.sections ?? [],
    is_published: o.is_published ?? false,
  };
}

// ── Section Editor avec type HTML ───────────────────────────
function SectionEditor({
  section, index, total, onChange, onDelete, onMove,
}: {
  section: Section; index: number; total: number;
  onChange: (s: Section) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(false);
  const isHtml = section.type === "html";

  const TYPE_LABELS: Record<string, string> = {
    h2: "H2 - Titre de section",
    h3: "H3 - Sous-titre",
    p: "Paragraphe",
    image: "Image",
    html: "HTML personnalise",
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "hsl(263, 36%, 16%)", border: `1px solid ${isHtml ? "rgba(99,179,237,0.2)" : "rgba(255,255,255,0.07)"}` }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.20)", cursor: "grab" }} />
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 text-left">
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
            style={{
              background: isHtml ? "rgba(99,179,237,0.15)" : "rgba(255,255,255,0.08)",
              color: isHtml ? "rgb(99,179,237)" : "hsl(183,70%,63%)",
            }}
          >
            {isHtml && <Code size={9} />}
            {section.type}
          </span>
          <span className="text-xs text-white truncate max-w-xs">
            {section.content ? section.content.slice(0, 60) : TYPE_LABELS[section.type]}
          </span>
        </button>
        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 cursor-pointer mr-1">
            <input
              type="checkbox"
              checked={section.visible !== false}
              onChange={(e) => onChange({ ...section, visible: e.target.checked })}
            />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Visible</span>
          </label>
          <button onClick={() => onMove("up")} disabled={index === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            <ChevronUp size={13} />
          </button>
          <button onClick={() => onMove("down")} disabled={index === total - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
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

      {open && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-2">
            <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Type de bloc</label>
            <select
              value={section.type}
              onChange={(e) => onChange({ ...section, type: e.target.value as Section["type"] })}
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="h2">H2 - Titre de section</option>
              <option value="h3">H3 - Sous-titre</option>
              <option value="p">Paragraphe</option>
              <option value="image">Image (URL)</option>
              <option value="html">HTML personnalise</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: isHtml ? "rgb(99,179,237)" : "rgba(255,255,255,0.40)" }}>
              {section.type === "image" ? "URL de l'image" : isHtml ? "Code HTML" : "Contenu"}
            </label>
            {section.type === "p" || isHtml ? (
              <textarea
                value={section.content}
                onChange={(e) => onChange({ ...section, content: e.target.value })}
                rows={isHtml ? 8 : 4}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-y"
                style={{
                  background: isHtml ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isHtml ? "rgba(99,179,237,0.25)" : "rgba(255,255,255,0.08)"}`,
                  fontFamily: isHtml ? "monospace" : undefined,
                  fontSize: isHtml ? "12px" : undefined,
                }}
                placeholder={isHtml ? "<h2>Mon titre</h2>\n<p>Mon paragraphe avec du <strong>gras</strong>...</p>" : undefined}
              />
            ) : (
              <input
                value={section.content}
                onChange={(e) => onChange({ ...section, content: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            )}
            {isHtml && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "rgba(99,179,237,0.7)" }}>
                <Code size={10} />
                HTML brut - balises autorisees : p, h2, h3, ul, li, strong, em, a, br, span
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant Field ──────────────────────────────────────────
function Field({ label, hint, error = false, children }: {
  label: string; hint?: string; error?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5"
        style={{ color: error ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{hint}</p>}
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
  const [activeTab, setActiveTab] = useState<"seo" | "contenu" | "sections" | "html" | "stickybar">("seo");
  const [showAddSection, setShowAddSection] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Sticky bar
  const [stickyBar, setStickyBar] = useState<StickyBarConfig>(STICKY_BAR_DEFAULT);
  const [stickyBarId, setStickyBarId] = useState<string | null>(null);
  const [savingSticky, setSavingSticky] = useState(false);
  const [savedSticky, setSavedSticky] = useState(false);

  const pageType = pageKey.startsWith("creation/") ? "ville_creation"
    : pageKey.startsWith("seo/") ? "ville_seo"
    : pageKey.startsWith("metier/") ? "metier" : "static";
  const isVille = pageType === "ville_creation" || pageType === "ville_seo";

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !pageKey) return;
    async function load() {
      // Page override
      const { data } = await supabase.from("page_overrides").select("*").eq("page_key", pageKey).maybeSingle();
      if (data) {
        setForm(overrideToForm(data as PageOverride));
        setExistingId(data.id);
      } else {
        const slug = pageKey.split("/")[1] ?? "";
        const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const url = pageType === "ville_creation" ? `/creation-site-web/${slug}`
          : pageType === "ville_seo" ? `/referencement-seo/${slug}`
          : pageType === "metier" ? `/creation-site-web/metier/${slug}`
          : `/${slug}`;
        setForm({ ...EMPTY_FORM, page_label: label, page_url: url });
      }
      // Sticky bar
      const { data: sbData } = await supabase.from("site_settings").select("*").eq("key", "sticky_bar").maybeSingle();
      if (sbData?.value) {
        setStickyBar({ ...STICKY_BAR_DEFAULT, ...sbData.value });
        setStickyBarId(sbData.id);
      }
      setLoadingData(false);
    }
    load();
  }, [isAdmin, pageKey, pageType]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSection(index: number, section: Section) {
    const next = [...form.sections];
    next[index] = section;
    updateField("sections", next);
  }

  function deleteSection(index: number) {
    updateField("sections", form.sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, dir: "up" | "down") {
    const next = [...form.sections];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateField("sections", next);
  }

  function addSection(type: string) {
    const newSection: Section = {
      id: `s-${Date.now()}`,
      type: type as Section["type"],
      content: "",
      order: form.sections.length,
      visible: true,
    };
    updateField("sections", [...form.sections, newSection]);
    setShowAddSection(false);
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
      sections: form.sections,
      creation_seo_text_1: form.creation_seo_text_1 || null,
      creation_seo_text_2: form.creation_seo_text_2 || null,
      creation_why_text: form.creation_why_text || null,
      seo_local_text: form.seo_local_text || null,
      seo_why_text: form.seo_why_text || null,
      local_fact: form.local_fact || null,
      custom_html: form.custom_html || null,
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
    if (!error) {
      setSavedSticky(true);
      setTimeout(() => setSavedSticky(false), 2500);
    }
    setSavingSticky(false);
  }

  async function handleUnpublish() { await handleSave(false); }

  async function handleDelete() {
    if (!existingId) return;
    if (!confirm("Supprimer toutes les surcharges de cette page ? Le contenu statique sera restaure.")) return;
    await supabase.from("page_overrides").delete().eq("id", existingId);
    invalidatePageCache(pageKey);
    navigate("/admin/pages");
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;
  if (!form.page_label && !loadingData) return <AdminLayout><div className="p-8 text-white/40">Page introuvable</div></AdminLayout>;

  const titleLength = form.seo_title.length;
  const descLength = form.seo_description.length;

  const TABS = [
    { key: "seo",       label: "SEO & Meta" },
    { key: "contenu",   label: "Contenu" },
    { key: "sections",  label: "Sections" },
    { key: "html",      label: "HTML", icon: <Code size={11} /> },
    { key: "stickybar", label: "Sticky bar", icon: <Megaphone size={11} /> },
  ] as const;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-8">

        {/* Header sticky */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between py-3 mb-6 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-2"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/pages" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{pageKey}</p>
              <h1 className="text-sm font-bold text-white truncate">{form.page_label || "Nouvelle page"}</h1>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{
                background: form.is_published ? "rgba(34,197,94,0.15)" : "rgba(251,146,60,0.15)",
                color: form.is_published ? "rgb(74,222,128)" : "rgb(251,146,60)",
              }}
            >
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
                <button onClick={handleUnpublish} disabled={saving}
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
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>{form.seo_description || "Meta description non definie"}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
          style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap px-2"
              style={activeTab === tab.key
                ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                : { color: "rgba(255,255,255,0.45)" }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Onglet SEO ── */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <Field label={`Title <title> (${titleLength}/60 car.)`} error={titleLength > 60} hint="Idealement 60 caracteres max.">
              <input value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="Titre SEO de la page..." className="field-input" />
            </Field>
            <Field label={`Meta description (${descLength}/160 car.)`} error={descLength > 160} hint="Idealement 160 caracteres max.">
              <textarea value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)}
                rows={3} placeholder="Description SEO..." className="field-input resize-none" />
            </Field>
            <Field label="H1 de la page" hint="Titre principal visible par les visiteurs.">
              <input value={form.seo_h1} onChange={(e) => updateField("seo_h1", e.target.value)}
                placeholder="Titre H1..." className="field-input" />
            </Field>
          </div>
        )}

        {/* ── Onglet Contenu ── */}
        {activeTab === "contenu" && (
          <div className="space-y-4">
            <Field label="Texte d'intro (sous le H1)" hint="Paragraphe principal visible dans la section hero.">
              <textarea value={form.hero_intro} onChange={(e) => updateField("hero_intro", e.target.value)}
                rows={4} placeholder="Texte d'introduction..." className="field-input resize-y" />
            </Field>

            {/* Image hero */}
            <div className="rounded-2xl p-4 space-y-3"
              style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-medium text-white">Image de fond hero</p>
              {form.hero_bg_image_url && (
                <div className="relative">
                  <img src={form.hero_bg_image_url} alt="Hero preview" className="w-full h-32 object-cover rounded-xl" />
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
              <Field label="Ou URL directe" hint="">
                <input value={form.hero_bg_image_url} onChange={(e) => updateField("hero_bg_image_url", e.target.value)}
                  placeholder="https://..." className="field-input" />
              </Field>
            </div>

            {isVille && (
              <>
                <div className="pt-2">
                  <p className="text-xs font-semibold mb-3 text-white">Champs specifiques aux pages villes</p>
                </div>
                <Field label="Texte SEO paragraphe 1" hint="1er paragraphe de la section referencement local.">
                  <textarea value={form.creation_seo_text_1} onChange={(e) => updateField("creation_seo_text_1", e.target.value)}
                    rows={4} placeholder="Premier paragraphe SEO..." className="field-input resize-y" />
                </Field>
                <Field label="Texte SEO paragraphe 2" hint="2eme paragraphe de la section referencement local.">
                  <textarea value={form.creation_seo_text_2} onChange={(e) => updateField("creation_seo_text_2", e.target.value)}
                    rows={4} placeholder="Deuxieme paragraphe SEO..." className="field-input resize-y" />
                </Field>
                <Field label="Texte Pourquoi" hint="Section pourquoi avoir un site web.">
                  <textarea value={form.creation_why_text} onChange={(e) => updateField("creation_why_text", e.target.value)}
                    rows={3} placeholder="Texte pourquoi..." className="field-input resize-y" />
                </Field>
                <Field label="SEO local text" hint="Paragraphe de la section Google Maps.">
                  <textarea value={form.seo_local_text} onChange={(e) => updateField("seo_local_text", e.target.value)}
                    rows={4} placeholder="Texte SEO local..." className="field-input resize-y" />
                </Field>
                <Field label="SEO why text" hint="Paragraphe pourquoi le SEO local est indispensable.">
                  <textarea value={form.seo_why_text} onChange={(e) => updateField("seo_why_text", e.target.value)}
                    rows={3} placeholder="Texte pourquoi SEO..." className="field-input resize-y" />
                </Field>
                <Field label="Le saviez-vous ? (localFact)" hint="Encadre en bas de la section SEO.">
                  <textarea value={form.local_fact} onChange={(e) => updateField("local_fact", e.target.value)}
                    rows={2} placeholder="Fait local interessant..." className="field-input resize-y" />
                </Field>
              </>
            )}
          </div>
        )}

        {/* ── Onglet Sections libres ── */}
        {activeTab === "sections" && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Ajoutez des blocs H2, H3, paragraphes, HTML ou images. Ils s'affichent dans la section Guide de la page.
            </p>
            {form.sections.map((section, i) => (
              <SectionEditor
                key={section.id}
                section={section}
                index={i}
                total={form.sections.length}
                onChange={(s) => updateSection(i, s)}
                onDelete={() => deleteSection(i)}
                onMove={(dir) => moveSection(i, dir)}
              />
            ))}
            {showAddSection ? (
              <div className="rounded-2xl p-4"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-white">Choisir un type de bloc</p>
                  <button onClick={() => setShowAddSection(false)} style={{ color: "rgba(255,255,255,0.35)" }}>
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "h2",   label: "Titre H2" },
                    { type: "h3",   label: "Sous-titre H3" },
                    { type: "p",    label: "Paragraphe" },
                    { type: "image",label: "Image" },
                    { type: "html", label: "HTML personnalise" },
                  ].map((bt) => (
                    <button key={bt.type} onClick={() => addSection(bt.type)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.70)" }}>
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono flex items-center gap-1"
                        style={{
                          background: bt.type === "html" ? "rgba(99,179,237,0.15)" : "rgba(255,255,255,0.08)",
                          color: bt.type === "html" ? "rgb(99,179,237)" : "hsl(183,70%,63%)",
                        }}>
                        {bt.type === "html" && <Code size={9} />}
                        {bt.type}
                      </span>
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddSection(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
                <Plus size={14} /> Ajouter un bloc
              </button>
            )}
          </div>
        )}

        {/* ── Onglet HTML ── */}
        {activeTab === "html" && (
          <div className="space-y-4">
            <div className="rounded-xl p-3 flex gap-2"
              style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
              <Code size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
              <div>
                <p className="text-xs font-medium text-white mb-1">HTML personnalise global</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                  Ce bloc HTML est injecte directement dans la page apres le contenu principal.
                  Utilisez-le pour des tableaux, des listes complexes, des widgets ou tout contenu
                  impossible a exprimer avec les champs standards.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgb(99,179,237)" }}>
                Code HTML
              </label>
              <textarea
                value={form.custom_html}
                onChange={(e) => updateField("custom_html", e.target.value)}
                rows={20}
                placeholder={"<section>\n  <h2>Mon titre supplementaire</h2>\n  <p>Mon contenu avec du <strong>gras</strong> et des <a href='/contact'>liens</a>.</p>\n  <ul>\n    <li>Element 1</li>\n    <li>Element 2</li>\n  </ul>\n</section>"}
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-y"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(99,179,237,0.25)",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              />
              <p className="text-xs mt-2" style={{ color: "rgba(99,179,237,0.6)" }}>
                Balises autorisees : p, h2, h3, h4, ul, ol, li, strong, em, a, br, span, div, section, table, tr, td, th
              </p>
            </div>
          </div>
        )}

        {/* ── Onglet Sticky bar ── */}
        {activeTab === "stickybar" && (
          <div className="space-y-4">
            <div className="rounded-xl p-3 flex gap-2"
              style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
              <Megaphone size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                La sticky bar s'affiche en haut de toutes les pages du site pour tous les visiteurs.
                Ce parametre est global et s'applique a l'ensemble du site.
              </p>
            </div>

            {/* Toggle */}
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl"
              style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-sm text-white font-medium">Activer la sticky bar</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {stickyBar.enabled ? "Actuellement visible sur le site" : "Actuellement masquee"}
                </p>
              </div>
              <div
                onClick={() => setStickyBar((p) => ({ ...p, enabled: !p.enabled }))}
                className="relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0"
                style={{ background: stickyBar.enabled ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: stickyBar.enabled ? "translateX(23px)" : "translateX(4px)" }}
                />
              </div>
            </label>

            <Field label="Texte de la barre" hint="Le message principal affiche dans la barre.">
              <textarea
                value={stickyBar.text}
                onChange={(e) => setStickyBar((p) => ({ ...p, text: e.target.value }))}
                rows={2}
                placeholder="Offre speciale - Audit SEO gratuit ce mois-ci !"
                className="field-input resize-none"
              />
            </Field>

            <Field label="Texte du bouton CTA (optionnel)" hint="Laissez vide pour ne pas afficher de bouton.">
              <input
                value={stickyBar.cta_label}
                onChange={(e) => setStickyBar((p) => ({ ...p, cta_label: e.target.value }))}
                placeholder="En profiter"
                className="field-input"
              />
            </Field>

            <Field label="Lien du bouton" hint="URL relative (/contact) ou absolue (https://...).">
              <input
                value={stickyBar.cta_href}
                onChange={(e) => setStickyBar((p) => ({ ...p, cta_href: e.target.value }))}
                placeholder="/contact"
                className="field-input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Couleur de fond
                </label>
                <div className="flex gap-2">
                  <input type="color"
                    value={stickyBar.bg_color.startsWith("#") ? stickyBar.bg_color : "#4cc9b0"}
                    onChange={(e) => setStickyBar((p) => ({ ...p, bg_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                    style={{ background: "rgba(255,255,255,0.05)" }} />
                  <input
                    value={stickyBar.bg_color}
                    onChange={(e) => setStickyBar((p) => ({ ...p, bg_color: e.target.value }))}
                    placeholder="#hex ou linear-gradient(...)"
                    className="flex-1 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Couleur du texte
                </label>
                <div className="flex gap-2">
                  <input type="color"
                    value={stickyBar.text_color}
                    onChange={(e) => setStickyBar((p) => ({ ...p, text_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                    style={{ background: "rgba(255,255,255,0.05)" }} />
                  <input
                    value={stickyBar.text_color}
                    onChange={(e) => setStickyBar((p) => ({ ...p, text_color: e.target.value }))}
                    placeholder="#ffffff"
                    className="flex-1 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>
            </div>

            {/* Apercu */}
            {stickyBar.text && (
              <div>
                <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Apercu</p>
                <div
                  className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                  style={{ background: stickyBar.bg_color, color: stickyBar.text_color }}
                >
                  <p className="text-sm font-medium">{stickyBar.text}</p>
                  {stickyBar.cta_label && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                      style={{ background: "rgba(255,255,255,0.2)" }}>
                      {stickyBar.cta_label}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Save sticky */}
            {savedSticky && (
              <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                <Check size={12} /> Sticky bar sauvegardee avec succes
              </div>
            )}
            <button
              onClick={handleSaveSticky}
              disabled={savingSticky}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
            >
              {savingSticky ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer la sticky bar
            </button>
          </div>
        )}

        {/* Boutons bas de page */}
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/15 ml-auto"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                <Trash2 size={14} /> Supprimer les surcharges
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus { border-color: hsl(183,70%,63%); }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </AdminLayout>
  );
}
