// src/pages/admin/AdminPageOverridesEditor.tsx
// ============================================================
// Éditeur complet d'une page dynamique
// Route : /admin/pages/:pageKey (pageKey est encodé URI)
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Eye, Loader2, Globe, Trash2,
  Plus, GripVertical, ChevronDown, ChevronUp, X,
  Check, RotateCcw, Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { invalidatePageCache } from "@/hooks/usePageContent";
import type { PageOverride, Section } from "@/hooks/usePageContent";

// ── Types locaux ─────────────────────────────────────────────
type FormState = {
  page_label: string;
  page_url: string;
  // SEO
  seo_title: string;
  seo_description: string;
  seo_h1: string;
  // Hero
  hero_intro: string;
  hero_bg_image_url: string;
  // Contenu villes
  creation_seo_text_1: string;
  creation_seo_text_2: string;
  creation_why_text: string;
  seo_local_text: string;
  seo_why_text: string;
  local_fact: string;
  // Sections libres
  sections: Section[];
  // Publication
  is_published: boolean;
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
    sections: o.sections ?? [],
    is_published: o.is_published ?? false,
  };
}

// ── Composant Section Editor ─────────────────────────────────
function SectionEditor({
  section, index, total,
  onChange, onDelete, onMove,
}: {
  section: Section; index: number; total: number;
  onChange: (s: Section) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(false);
  const TYPE_LABELS: Record<string, string> = {
    h2: "H2 — Titre de section",
    h3: "H3 — Sous-titre",
    p: "Paragraphe",
    image: "Image",
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.20)", cursor: "grab" }} />
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.08)", color: "hsl(183,70%,63%)" }}
          >
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
              className="rounded"
            />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Visible</span>
          </label>
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            <ChevronDown size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/20 transition"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded hover:bg-white/10 transition"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-2">
            <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
              Type de bloc
            </label>
            <select
              value={section.type}
              onChange={(e) => onChange({ ...section, type: e.target.value as Section["type"] })}
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="h2">H2 — Titre de section</option>
              <option value="h3">H3 — Sous-titre</option>
              <option value="p">Paragraphe</option>
              <option value="image">Image (URL)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
              {section.type === "image" ? "URL de l'image" : "Contenu"}
            </label>
            {section.type === "p" ? (
              <textarea
                value={section.content}
                onChange={(e) => onChange({ ...section, content: e.target.value })}
                rows={4}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-y"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            ) : (
              <input
                value={section.content}
                onChange={(e) => onChange({ ...section, content: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
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
  const [activeTab, setActiveTab] = useState<"seo" | "contenu" | "sections">("seo");
  const [showAddSection, setShowAddSection] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Déduire le type depuis la clé
  const pageType = pageKey.startsWith("creation/") ? "ville_creation"
    : pageKey.startsWith("seo/") ? "ville_seo"
    : pageKey.startsWith("metier/") ? "metier"
    : "static";

  const isVille = pageType === "ville_creation" || pageType === "ville_seo";

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !pageKey) return;

    async function load() {
      const { data } = await supabase
        .from("page_overrides")
        .select("*")
        .eq("page_key", pageKey)
        .maybeSingle();

      if (data) {
        setForm(overrideToForm(data as PageOverride));
        setExistingId(data.id);
      } else {
        // Pré-remplir le label et l'URL depuis la clé
        const slug = pageKey.split("/")[1] ?? "";
        const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const url = pageType === "ville_creation" ? `/creation-site-web/${slug}`
          : pageType === "ville_seo" ? `/referencement-seo/${slug}`
          : pageType === "metier" ? `/creation-site-web/metier/${slug}`
          : `/${slug}`;
        setForm({ ...EMPTY_FORM, page_label: label, page_url: url });
      }
      setLoadingData(false);
    }

    load();
  }, [isAdmin, pageKey, pageType]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Sections
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

  function addSection(type: Section["type"]) {
    const newSection: Section = {
      id: `s-${Date.now()}`,
      type,
      content: "",
      order: form.sections.length,
      visible: true,
    };
    updateField("sections", [...form.sections, newSection]);
    setShowAddSection(false);
  }

  // Upload image hero
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

  // Sauvegarde
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

  // Dépublier / supprimer
  async function handleUnpublish() {
    await handleSave(false);
  }

  async function handleDelete() {
    if (!existingId) return;
    if (!confirm("Supprimer toutes les surcharges de cette page ? Le contenu statique sera restauré.")) return;
    await supabase.from("page_overrides").delete().eq("id", existingId);
    invalidatePageCache(pageKey);
    navigate("/admin/pages");
  }

  if (loading || loadingData) {
    return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;
  }

  const titleLength = form.seo_title.length;
  const descLength = form.seo_description.length;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-8">

        {/* ── Header sticky ── */}
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
              {form.is_published ? "Publié" : existingId ? "Brouillon" : "Non édité"}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <a
              href={form.page_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
            >
              <Globe size={12} /> Voir
            </a>

            {existingId && (
              <>
                {form.is_published ? (
                  <button
                    onClick={handleUnpublish}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium disabled:opacity-50"
                    style={{ background: "rgba(251,146,60,0.15)", color: "rgb(251,146,60)" }}
                  >
                    <RotateCcw size={12} /> Dépublier
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 btn-glow"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Publier
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs hover:bg-red-500/20 transition"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.08)", color: saved ? "rgb(74,222,128)" : "rgba(255,255,255,0.80)" }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {saved ? "Sauvegardé ✓" : "Brouillon"}
            </button>
          </div>
        </div>

        {/* ── Aperçu Google snippet ── */}
        {(form.seo_title || form.seo_description) && (
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Aperçu Google</p>
            <p className="text-sm font-medium" style={{ color: "hsl(220,90%,70%)" }}>
              {form.seo_title || "Titre non défini"}
            </p>
            <p className="text-xs" style={{ color: "hsl(140,60%,50%)" }}>
              declicdigital.net{form.page_url}
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.50)" }}>
              {form.seo_description || "Meta description non définie"}
            </p>
          </div>
        )}

        {/* ── Onglets ── */}
        <div
          className="flex gap-1 mb-6 p-1 rounded-xl"
          style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["seo", "contenu", "sections"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
              style={
                activeTab === tab
                  ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                  : { color: "rgba(255,255,255,0.45)" }
              }
            >
              {tab === "seo" ? "SEO & Meta" : tab === "contenu" ? "Contenu" : "Sections libres"}
            </button>
          ))}
        </div>

        {/* ── Onglet SEO ── */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            <Field
              label={`Title <title> (${titleLength}/60 car.)`}
              error={titleLength > 60}
              hint="Idéalement ≤ 60 caractères. Affiché dans l'onglet du navigateur et les résultats Google."
            >
              <input
                value={form.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="Titre SEO de la page..."
                className="field-input"
              />
            </Field>

            <Field
              label={`Meta description (${descLength}/160 car.)`}
              error={descLength > 160}
              hint="Idéalement ≤ 160 caractères. Affiché sous le titre dans les résultats Google."
            >
              <textarea
                value={form.seo_description}
                onChange={(e) => updateField("seo_description", e.target.value)}
                rows={3}
                placeholder="Description SEO..."
                className="field-input resize-none"
              />
            </Field>

            <Field label="H1 de la page" hint="Le titre principal visible par les visiteurs. Doit inclure le mot-clé principal.">
              <input
                value={form.seo_h1}
                onChange={(e) => updateField("seo_h1", e.target.value)}
                placeholder="Titre H1..."
                className="field-input"
              />
            </Field>
          </div>
        )}

        {/* ── Onglet Contenu ── */}
        {activeTab === "contenu" && (
          <div className="space-y-4">
            <Field label="Texte d'intro (sous le H1)" hint="Paragraphe principal visible dans la section hero.">
              <textarea
                value={form.hero_intro}
                onChange={(e) => updateField("hero_intro", e.target.value)}
                rows={4}
                placeholder="Texte d'introduction..."
                className="field-input resize-y"
              />
            </Field>

            {/* Image hero */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs font-medium text-white">Image de fond hero</p>
              {form.hero_bg_image_url && (
                <div className="relative">
                  <img
                    src={form.hero_bg_image_url}
                    alt="Hero preview"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => updateField("hero_bg_image_url", "")}
                    className="absolute top-2 right-2 p-1 rounded-lg"
                    style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px dashed rgba(255,255,255,0.12)" }}>
                  {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                  {imageUploading ? "Upload..." : "Uploader une image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <Field label="Ou URL directe" hint="">
                <input
                  value={form.hero_bg_image_url}
                  onChange={(e) => updateField("hero_bg_image_url", e.target.value)}
                  placeholder="https://..."
                  className="field-input"
                />
              </Field>
            </div>

            {/* Champs spécifiques villes */}
            {isVille && (
              <>
                <div className="pt-2">
                  <p className="text-xs font-semibold mb-3 text-white">Champs spécifiques aux pages villes</p>
                </div>

                <Field label="Texte SEO paragraphe 1" hint="1er paragraphe de la section 'Référencement local' visible sur la page.">
                  <textarea
                    value={form.creation_seo_text_1}
                    onChange={(e) => updateField("creation_seo_text_1", e.target.value)}
                    rows={4}
                    placeholder="Premier paragraphe SEO..."
                    className="field-input resize-y"
                  />
                </Field>

                <Field label="Texte SEO paragraphe 2" hint="2ème paragraphe de la section 'Référencement local'.">
                  <textarea
                    value={form.creation_seo_text_2}
                    onChange={(e) => updateField("creation_seo_text_2", e.target.value)}
                    rows={4}
                    placeholder="Deuxième paragraphe SEO..."
                    className="field-input resize-y"
                  />
                </Field>

                <Field label="Texte 'Pourquoi'" hint="Paragraphe de la section 'Pourquoi les professionnels de X ont besoin d'un site web'.">
                  <textarea
                    value={form.creation_why_text}
                    onChange={(e) => updateField("creation_why_text", e.target.value)}
                    rows={3}
                    placeholder="Texte pourquoi..."
                    className="field-input resize-y"
                  />
                </Field>

                <Field label="SEO local text" hint="Paragraphe de la section Google Maps.">
                  <textarea
                    value={form.seo_local_text}
                    onChange={(e) => updateField("seo_local_text", e.target.value)}
                    rows={4}
                    placeholder="Texte SEO local..."
                    className="field-input resize-y"
                  />
                </Field>

                <Field label="SEO why text" hint="Paragraphe 'Pourquoi le SEO local est indispensable'.">
                  <textarea
                    value={form.seo_why_text}
                    onChange={(e) => updateField("seo_why_text", e.target.value)}
                    rows={3}
                    placeholder="Texte pourquoi SEO..."
                    className="field-input resize-y"
                  />
                </Field>

                <Field label="Le saviez-vous ? (localFact)" hint="Encadré bleu en bas de la section SEO.">
                  <textarea
                    value={form.local_fact}
                    onChange={(e) => updateField("local_fact", e.target.value)}
                    rows={2}
                    placeholder="Fait local intéressant..."
                    className="field-input resize-y"
                  />
                </Field>
              </>
            )}
          </div>
        )}

        {/* ── Onglet Sections libres ── */}
        {activeTab === "sections" && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Ajoutez des blocs H2, H3, paragraphes ou images supplémentaires. Ils s'affichent dans la section "Guide" de la page.
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
              <div
                className="rounded-2xl p-4"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-white">Choisir un type de bloc</p>
                  <button onClick={() => setShowAddSection(false)} style={{ color: "rgba(255,255,255,0.35)" }}>
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["h2", "h3", "p", "image"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.70)" }}
                    >
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-mono"
                        style={{ background: "rgba(255,255,255,0.08)", color: "hsl(183,70%,63%)" }}
                      >
                        {type}
                      </span>
                      {type === "h2" ? "Titre H2" : type === "h3" ? "Sous-titre H3" : type === "p" ? "Paragraphe" : "Image"}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddSection(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}
              >
                <Plus size={14} /> Ajouter un bloc
              </button>
            )}
          </div>
        )}

        {/* ── Boutons bas de page ── */}
        <div
          className="flex gap-2 mt-8 pt-6 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.80)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Sauvegarder brouillon
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Publier maintenant
          </button>

          {existingId && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/15 ml-auto"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <Trash2 size={14} /> Supprimer les surcharges
            </button>
          )}
        </div>
      </div>

      {/* Style global pour les inputs */}
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
        .field-input:focus {
          border-color: hsl(183,70%,63%);
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
      `}</style>
    </AdminLayout>
  );
}

// ── Composant Field réutilisable ─────────────────────────────
function Field({
  label, hint, error = false, children,
}: {
  label: string; hint?: string; error?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: error ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{hint}</p>
      )}
    </div>
  );
}
