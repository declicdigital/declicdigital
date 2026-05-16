// src/pages/admin/AdminCityContentEditor.tsx
// Editeur complet du contenu d'une ville
// Lit depuis Supabase (city_content) avec fallback statique
// RichTextEditor sur tous les champs texte longs

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Globe, Trash2, Plus, GripVertical,
  ChevronDown, ChevronUp, X, Check, Loader2, RotateCcw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { invalidateCityCache, fetchCityContentForAdmin, type CityContentRow } from "@/hooks/useCityContent";
import { cityContent as staticCityContent } from "@/data/cityContent";
import { getCityGuide } from "@/data/cityGuideContent";
import { getCityBySlug } from "@/data/cities";
import RichTextEditor from "@/components/admin/RichTextEditor";

// ── Types ────────────────────────────────────────────────────
type GuideSection = { heading: string; text: string };

type FormState = {
  creation_intro: string;
  creation_why_title: string;
  creation_why_text: string;
  creation_seo_text_1: string;
  creation_seo_text_2: string;
  seo_intro: string;
  seo_why_text: string;
  seo_local_text: string;
  local_fact: string;
  target_keywords: string;
  guide_creation_title: string;
  guide_creation_sections: GuideSection[];
  guide_seo_title: string;
  guide_seo_sections: GuideSection[];
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  creation_intro: "",
  creation_why_title: "",
  creation_why_text: "",
  creation_seo_text_1: "",
  creation_seo_text_2: "",
  seo_intro: "",
  seo_why_text: "",
  seo_local_text: "",
  local_fact: "",
  target_keywords: "",
  guide_creation_title: "",
  guide_creation_sections: [],
  guide_seo_title: "",
  guide_seo_sections: [],
  is_published: true,
};

function rowToForm(row: CityContentRow): FormState {
  return {
    creation_intro: row.creation_intro ?? "",
    creation_why_title: row.creation_why_title ?? "",
    creation_why_text: row.creation_why_text ?? "",
    creation_seo_text_1: row.creation_seo_text_1 ?? "",
    creation_seo_text_2: row.creation_seo_text_2 ?? "",
    seo_intro: row.seo_intro ?? "",
    seo_why_text: row.seo_why_text ?? "",
    seo_local_text: row.seo_local_text ?? "",
    local_fact: row.local_fact ?? "",
    target_keywords: (row.target_keywords ?? []).join(", "),
    guide_creation_title: row.guide_creation_title ?? "",
    guide_creation_sections: row.guide_creation_sections ?? [],
    guide_seo_title: row.guide_seo_title ?? "",
    guide_seo_sections: row.guide_seo_sections ?? [],
    is_published: row.is_published ?? true,
  };
}

function staticToForm(slug: string): FormState {
  const s = staticCityContent[slug];
  const guide = getCityGuide(slug);
  return {
    creation_intro: s?.creationIntro ?? "",
    creation_why_title: s?.creationWhyTitle ?? "",
    creation_why_text: s?.creationWhyText ?? "",
    creation_seo_text_1: s?.creationSeoText?.[0] ?? "",
    creation_seo_text_2: s?.creationSeoText?.[1] ?? "",
    seo_intro: s?.seoIntro ?? "",
    seo_why_text: s?.seoWhyText ?? "",
    seo_local_text: s?.seoLocalText ?? "",
    local_fact: s?.localFact ?? "",
    target_keywords: (s?.targetKeywords ?? []).join(", "),
    guide_creation_title: guide?.creation?.title ?? "",
    guide_creation_sections: guide?.creation?.sections ?? [],
    guide_seo_title: guide?.seo?.title ?? "",
    guide_seo_sections: guide?.seo?.sections ?? [],
    is_published: true,
  };
}

// ── Section editor (pour les sections du guide) ──────────────
function SectionEditor({ section, index, total, onChange, onDelete, onMove }: {
  section: GuideSection; index: number; total: number;
  onChange: (s: GuideSection) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: "hsl(263, 36%, 16%)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.20)" }} />
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 text-left min-w-0">
          <span className="text-xs text-white truncate">
            {section.heading || "Section sans titre"}
          </span>
          {section.text && (
            <span className="text-xs truncate hidden sm:block" style={{ color: "rgba(255,255,255,0.30)" }}>
              — {section.text.replace(/<[^>]*>/g, "").slice(0, 40)}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onMove("up")} disabled={index === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20" style={{ color: "rgba(255,255,255,0.40)" }}>
            <ChevronUp size={13} />
          </button>
          <button onClick={() => onMove("down")} disabled={index === total - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-20" style={{ color: "rgba(255,255,255,0.40)" }}>
            <ChevronDown size={13} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-500/20" style={{ color: "rgba(255,255,255,0.30)" }}>
            <Trash2 size={13} />
          </button>
          <button onClick={() => setOpen(!open)} className="p-1 rounded hover:bg-white/10" style={{ color: "rgba(255,255,255,0.40)" }}>
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-2">
            <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Titre H3</label>
            <input value={section.heading}
              onChange={e => onChange({ ...section, heading: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Texte du paragraphe</label>
            <RichTextEditor
              value={section.text}
              onChange={text => onChange({ ...section, text })}
              placeholder="Contenu de la section..."
              minHeight={120}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant Field ──────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{hint}</p>}
    </div>
  );
}

// ── Composant principal ──────────────────────────────────────
export default function AdminCityContentEditor() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  const city = slug ? getCityBySlug(slug) : undefined;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"creation" | "seo" | "guide_creation" | "guide_seo">("creation");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !slug) return;
    async function load() {
      const row = await fetchCityContentForAdmin(slug!);
      if (row) {
        setForm(rowToForm(row));
        setExistingId(row.id);
      } else {
        // Pre-remplir avec le contenu statique existant
        setForm(staticToForm(slug!));
      }
      setLoadingData(false);
    }
    load();
  }, [isAdmin, slug]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // Guide sections helpers
  function updateSection(field: "guide_creation_sections" | "guide_seo_sections", index: number, section: GuideSection) {
    const next = [...form[field]];
    next[index] = section;
    updateField(field, next);
  }
  function deleteSection(field: "guide_creation_sections" | "guide_seo_sections", index: number) {
    updateField(field, form[field].filter((_, i) => i !== index));
  }
  function moveSection(field: "guide_creation_sections" | "guide_seo_sections", index: number, dir: "up" | "down") {
    const next = [...form[field]];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateField(field, next);
  }
  function addSection(field: "guide_creation_sections" | "guide_seo_sections") {
    updateField(field, [...form[field], { heading: "", text: "" }]);
  }

  async function handleSave(publish?: boolean) {
    if (!slug) return;
    setSaving(true);

    const payload = {
      slug,
      creation_intro: form.creation_intro || null,
      creation_why_title: form.creation_why_title || null,
      creation_why_text: form.creation_why_text || null,
      creation_seo_text_1: form.creation_seo_text_1 || null,
      creation_seo_text_2: form.creation_seo_text_2 || null,
      seo_intro: form.seo_intro || null,
      seo_why_text: form.seo_why_text || null,
      seo_local_text: form.seo_local_text || null,
      local_fact: form.local_fact || null,
      target_keywords: form.target_keywords
        ? form.target_keywords.split(",").map(k => k.trim()).filter(Boolean)
        : [],
      guide_creation_title: form.guide_creation_title || null,
      guide_creation_sections: form.guide_creation_sections,
      guide_seo_title: form.guide_seo_title || null,
      guide_seo_sections: form.guide_seo_sections,
      is_published: publish !== undefined ? publish : form.is_published,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (existingId) {
      ({ error } = await supabase.from("city_content").update(payload).eq("id", existingId));
    } else {
      const { data, error: e } = await supabase.from("city_content").insert(payload).select().single();
      error = e;
      if (data) setExistingId(data.id);
    }

    if (!error) {
      if (publish !== undefined) updateField("is_published", publish);
      invalidateCityCache(slug);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!existingId || !slug) return;
    if (!confirm("Supprimer le contenu Supabase ? Le contenu statique sera restaure.")) return;
    await supabase.from("city_content").delete().eq("id", existingId);
    invalidateCityCache(slug);
    navigate("/admin/villes");
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  const TABS = [
    { key: "creation",       label: "Creation site" },
    { key: "seo",            label: "SEO local" },
    { key: "guide_creation", label: `Guide creation (${form.guide_creation_sections.length})` },
    { key: "guide_seo",      label: `Guide SEO (${form.guide_seo_sections.length})` },
  ] as const;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 md:p-8">

        {/* Header sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between py-3 mb-6 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-2"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/villes" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{slug}</p>
              <h1 className="text-sm font-bold text-white truncate">{city?.nameShort ?? slug}</h1>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{
                background: existingId ? "rgba(34,197,94,0.15)" : "rgba(251,146,60,0.15)",
                color: existingId ? "rgb(74,222,128)" : "rgb(251,146,60)",
              }}>
              {existingId ? "Supabase" : "Statique - sera cree"}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <a href={`/creation-site-web/${slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
              <Globe size={12} /> Voir
            </a>
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
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Publier
            </button>
          </div>
        </div>

        {/* Info statique */}
        {!existingId && (
          <div className="rounded-xl p-3 flex gap-2 mb-6"
            style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <RotateCcw size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(251,146,60)" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.60)" }}>
              Le contenu affiche provient du fichier statique. En sauvegardant, il sera copie dans Supabase et deviendra editable en temps reel.
            </p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
          style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap px-2"
              style={activeTab === tab.key
                ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                : { color: "rgba(255,255,255,0.45)" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Onglet Creation site ── */}
        {activeTab === "creation" && (
          <div className="space-y-5">
            <Field label="Intro hero (texte sous le H1)" hint="Visible dans la section hero de la page creation.">
              <RichTextEditor value={form.creation_intro} onChange={v => updateField("creation_intro", v)}
                placeholder="Asnières-sur-Seine, aux portes de Paris..." minHeight={100} />
            </Field>
            <Field label="Titre section Pourquoi" hint="H2 de la section avantages.">
              <input value={form.creation_why_title}
                onChange={e => updateField("creation_why_title", e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </Field>
            <Field label="Texte Pourquoi" hint="Paragraphe sous le H2 de la section avantages.">
              <RichTextEditor value={form.creation_why_text} onChange={v => updateField("creation_why_text", v)}
                placeholder="Les habitants de [ville] privilegient les commerces locaux..." minHeight={100} />
            </Field>
            <Field label="Texte SEO paragraphe 1" hint="1er paragraphe de la section referencement local.">
              <RichTextEditor value={form.creation_seo_text_1} onChange={v => updateField("creation_seo_text_1", v)}
                placeholder="Premier paragraphe de la section SEO..." minHeight={120} />
            </Field>
            <Field label="Texte SEO paragraphe 2" hint="2eme paragraphe de la section referencement local.">
              <RichTextEditor value={form.creation_seo_text_2} onChange={v => updateField("creation_seo_text_2", v)}
                placeholder="Deuxieme paragraphe..." minHeight={120} />
            </Field>
            <Field label="Le saviez-vous ?" hint="Encadre en bas de la section referencement.">
              <RichTextEditor value={form.local_fact} onChange={v => updateField("local_fact", v)}
                placeholder="[Ville] est connectee a Paris en moins de 10 minutes..." minHeight={80} />
            </Field>
          </div>
        )}

        {/* ── Onglet SEO local ── */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            <Field label="Intro SEO" hint="Texte d'introduction de la page referencement SEO de la ville.">
              <RichTextEditor value={form.seo_intro} onChange={v => updateField("seo_intro", v)}
                placeholder="Votre entreprise est a [ville] et vous souhaitez..." minHeight={120} />
            </Field>
            <Field label="Pourquoi le SEO local" hint="Paragraphe expliquant l'interet du SEO local pour cette ville.">
              <RichTextEditor value={form.seo_why_text} onChange={v => updateField("seo_why_text", v)}
                placeholder="Les habitants de [ville] cherchent leurs prestataires..." minHeight={120} />
            </Field>
            <Field label="Strategie SEO locale" hint="Paragraphe detaillant la strategie SEO specifique a cette ville.">
              <RichTextEditor value={form.seo_local_text} onChange={v => updateField("seo_local_text", v)}
                placeholder="Notre strategie SEO pour [ville] cible les zones..." minHeight={120} />
            </Field>
            <Field label="Mots cles cibles" hint="Mots cles separes par des virgules.">
              <textarea value={form.target_keywords}
                onChange={e => updateField("target_keywords", e.target.value)}
                rows={3}
                placeholder="agence seo [ville], consultant seo [ville], référencement google [ville]..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace", fontSize: "12px" }} />
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                {form.target_keywords.split(",").filter(k => k.trim()).length} mot(s) cle(s)
              </p>
            </Field>
          </div>
        )}

        {/* ── Onglet Guide creation ── */}
        {activeTab === "guide_creation" && (
          <div className="space-y-4">
            <Field label="Titre du guide creation (H2)" hint="Titre de la section guide creation de site.">
              <input value={form.guide_creation_title}
                onChange={e => updateField("guide_creation_title", e.target.value)}
                placeholder="Creer un site web a [ville] : ..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </Field>

            <div className="space-y-3">
              <p className="text-xs font-medium text-white">{form.guide_creation_sections.length} section(s)</p>
              {form.guide_creation_sections.map((section, i) => (
                <SectionEditor key={i} section={section} index={i} total={form.guide_creation_sections.length}
                  onChange={s => updateSection("guide_creation_sections", i, s)}
                  onDelete={() => deleteSection("guide_creation_sections", i)}
                  onMove={dir => moveSection("guide_creation_sections", i, dir)} />
              ))}
              <button onClick={() => addSection("guide_creation_sections")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
                <Plus size={14} /> Ajouter une section
              </button>
            </div>
          </div>
        )}

        {/* ── Onglet Guide SEO ── */}
        {activeTab === "guide_seo" && (
          <div className="space-y-4">
            <Field label="Titre du guide SEO (H2)" hint="Titre de la section guide SEO de la ville.">
              <input value={form.guide_seo_title}
                onChange={e => updateField("guide_seo_title", e.target.value)}
                placeholder="SEO a [ville] : ..."
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </Field>

            <div className="space-y-3">
              <p className="text-xs font-medium text-white">{form.guide_seo_sections.length} section(s)</p>
              {form.guide_seo_sections.map((section, i) => (
                <SectionEditor key={i} section={section} index={i} total={form.guide_seo_sections.length}
                  onChange={s => updateSection("guide_seo_sections", i, s)}
                  onDelete={() => deleteSection("guide_seo_sections", i)}
                  onMove={dir => moveSection("guide_seo_sections", i, dir)} />
              ))}
              <button onClick={() => addSection("guide_seo_sections")}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
                <Plus size={14} /> Ajouter une section
              </button>
            </div>
          </div>
        )}

        {/* Boutons bas */}
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
              <Trash2 size={14} /> Supprimer (restaure le statique)
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
