// src/components/AdminEditBar.tsx
// Barre sticky d'édition + panneau latéral
// Ajouts : champ HTML brut dans les champs, + section sticky bar globale

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Edit2, X, Save, ExternalLink, Loader2,
  Check, AlertCircle, Code, Megaphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { invalidatePageCache } from "@/hooks/usePageContent";
import type { PageOverride } from "@/hooks/usePageContent";

function inferPageKey(pathname: string): string | null {
  const creationVille = pathname.match(/^\/creation-site-web\/([^/]+)$/);
  if (creationVille && creationVille[1] !== "metier") return `creation/${creationVille[1]}`;
  const metier = pathname.match(/^\/creation-site-web\/metier\/([^/]+)$/);
  if (metier) return `metier/${metier[1]}`;
  const seoVille = pathname.match(/^\/referencement-seo\/([^/]+)$/);
  if (seoVille) return `seo/${seoVille[1]}`;
  const staticMap: Record<string, string> = {
    "/": "static/accueil",
    "/creation-site-web": "static/creation-site-web",
    "/referencement-seo": "static/referencement-seo",
    "/visibilite-ia": "static/visibilite-ia",
    "/tarifs": "static/tarifs",
    "/faq": "static/faq",
    "/qui-sommes-nous": "static/qui-sommes-nous",
    "/contact": "static/contact",
    "/nos-villes": "static/nos-villes",
    "/nos-metiers": "static/nos-metiers",
    "/realisations": "static/realisations",
  };
  return staticMap[pathname] ?? null;
}

type PanelField = {
  key: keyof PageOverride;
  label: string;
  type: "input" | "textarea" | "url" | "html";
  hint?: string;
  rows?: number;
};

const PANEL_FIELDS: PanelField[] = [
  { key: "seo_title",           label: "Title SEO",          type: "input",    hint: "≤ 60 car." },
  { key: "seo_description",     label: "Meta description",   type: "textarea", hint: "≤ 160 car.", rows: 3 },
  { key: "seo_h1",              label: "H1",                 type: "input" },
  { key: "hero_intro",          label: "Intro hero",         type: "textarea", rows: 4 },
  { key: "creation_seo_text_1", label: "Texte SEO §1",       type: "textarea", rows: 4 },
  { key: "creation_seo_text_2", label: "Texte SEO §2",       type: "textarea", rows: 4 },
  { key: "seo_local_text",      label: "SEO local text",     type: "textarea", rows: 4 },
  { key: "seo_why_text",        label: "Pourquoi SEO",       type: "textarea", rows: 3 },
  { key: "local_fact",          label: "Le saviez-vous ?",   type: "textarea", rows: 2 },
  { key: "hero_bg_image_url",   label: "Image hero (URL)",   type: "url" },
  { key: "custom_html",         label: "HTML personnalisé",  type: "html",     hint: "HTML brut injecté dans la page. Attention : contenu non échappé.", rows: 8 },
];

// ── Sticky bar globale ────────────────────────────────────────
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

export default function AdminEditBar() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"page" | "stickybar">("page");
  const [pageKey, setPageKey] = useState<string | null>(null);
  const [override, setOverride] = useState<Partial<PageOverride>>({});
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sticky bar state
  const [stickyBar, setStickyBar] = useState<StickyBarConfig>(STICKY_BAR_DEFAULT);
  const [stickyBarId, setStickyBarId] = useState<string | null>(null);
  const [savingSticky, setSavingSticky] = useState(false);
  const [savedSticky, setSavedSticky] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session?.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Charger la sticky bar globale au montage
  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("site_settings")
      .select("*")
      .eq("key", "sticky_bar")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          setStickyBar({ ...STICKY_BAR_DEFAULT, ...data.value });
          setStickyBarId(data.id);
        }
      });
  }, [isAdmin]);

  useEffect(() => {
    const key = inferPageKey(location.pathname);
    setPageKey(key);
    setPanelOpen(false);
    setOverride({});
    setExistingId(null);
  }, [location.pathname]);

  async function openPanel() {
    if (!pageKey) return;
    setLoading(true);
    setPanelOpen(true);
    const { data } = await supabase
      .from("page_overrides")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    if (data) {
      setOverride(data as PageOverride);
      setExistingId(data.id);
    } else {
      setOverride({});
      setExistingId(null);
    }
    setLoading(false);
  }

  function updateField(key: keyof PageOverride, value: string) {
    setOverride((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(publish?: boolean) {
    if (!pageKey) return;
    setSaving(true);
    const slug = pageKey.split("/")[1] ?? "";
    const pageType = pageKey.startsWith("creation/") ? "ville_creation"
      : pageKey.startsWith("seo/") ? "ville_seo"
      : pageKey.startsWith("metier/") ? "metier" : "static";
    const pageUrl = pageKey.startsWith("creation/") ? `/creation-site-web/${slug}`
      : pageKey.startsWith("seo/") ? `/referencement-seo/${slug}`
      : pageKey.startsWith("metier/") ? `/creation-site-web/metier/${slug}`
      : `/${slug}`;

    const payload = {
      page_key: pageKey,
      page_type: pageType,
      page_label: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      page_url: pageUrl,
      seo_title: (override.seo_title as string) || null,
      seo_description: (override.seo_description as string) || null,
      seo_h1: (override.seo_h1 as string) || null,
      hero_intro: (override.hero_intro as string) || null,
      hero_bg_image_url: (override.hero_bg_image_url as string) || null,
      sections: (override.sections as any) || [],
      creation_seo_text_1: (override.creation_seo_text_1 as string) || null,
      creation_seo_text_2: (override.creation_seo_text_2 as string) || null,
      creation_why_text: (override.creation_why_text as string) || null,
      seo_local_text: (override.seo_local_text as string) || null,
      seo_why_text: (override.seo_why_text as string) || null,
      local_fact: (override.local_fact as string) || null,
      custom_html: (override.custom_html as string) || null,
      is_published: publish !== undefined ? publish : ((override.is_published as boolean) ?? false),
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
      if (publish !== undefined) setOverride((prev) => ({ ...prev, is_published: publish }));
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

  if (!isAdmin || !pageKey) return null;
  if (location.pathname.startsWith("/admin")) return null;

  const isPublished = override.is_published === true;

  return (
    <>
      {/* ── Sticky admin bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9998] flex items-center justify-between px-4 py-2.5 gap-3"
        style={{
          background: "hsl(263, 36%, 10%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: isPublished ? "rgb(74,222,128)"
                : existingId ? "rgb(251,146,60)"
                : "rgba(255,255,255,0.25)",
            }}
          />
          <span className="text-xs text-white font-medium truncate hidden sm:block">{pageKey}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            style={{
              background: isPublished ? "rgba(34,197,94,0.15)" : existingId ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.08)",
              color: isPublished ? "rgb(74,222,128)" : existingId ? "rgb(251,146,60)" : "rgba(255,255,255,0.40)",
            }}
          >
            {isPublished ? "Publié" : existingId ? "Brouillon" : "Non édité"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Bouton sticky bar */}
          <button
            onClick={() => { setPanelOpen(true); setActiveTab("stickybar"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
            title="Gérer la sticky bar"
          >
            <Megaphone size={11} />
            <span className="hidden sm:inline">Sticky bar</span>
          </button>

          <a
            href={`/admin/pages/${encodeURIComponent(pageKey)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
          >
            <ExternalLink size={11} />
            <span className="hidden sm:inline">Editeur complet</span>
          </a>

          <button
            onClick={() => { openPanel(); setActiveTab("page"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all btn-glow"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
          >
            <Edit2 size={11} />
            Modifier cette page
          </button>
        </div>
      </div>

      {/* ── Panneau latéral ── */}
      {panelOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setPanelOpen(false)}
          />
          <div
            className="fixed top-0 right-0 bottom-0 z-[9999] flex flex-col"
            style={{
              width: "min(480px, 95vw)",
              background: "hsl(263, 36%, 10%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{pageKey}</p>
                <h2 className="text-sm font-bold text-white mt-0.5">Modifier la page</h2>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Onglets */}
            <div
              className="flex gap-1 mx-5 my-3 p-1 rounded-xl shrink-0"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <button
                onClick={() => setActiveTab("page")}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={activeTab === "page"
                  ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                  : { color: "rgba(255,255,255,0.45)" }}
              >
                Contenu page
              </button>
              <button
                onClick={() => setActiveTab("stickybar")}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                style={activeTab === "stickybar"
                  ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                  : { color: "rgba(255,255,255,0.45)" }}
              >
                <Megaphone size={10} /> Sticky bar
              </button>
            </div>

            {/* Corps */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 pb-32">
              {/* ── Onglet Contenu page ── */}
              {activeTab === "page" && (
                loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin" style={{ color: "hsl(183,70%,63%)" }} />
                  </div>
                ) : (
                  <>
                    {/* Aperçu Google */}
                    {(override.seo_title || override.seo_description) && (
                      <div
                        className="rounded-xl p-3"
                        style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.30)" }}>Apercu Google</p>
                        <p className="text-sm font-medium" style={{ color: "hsl(220,90%,70%)" }}>
                          {(override.seo_title as string) || "-"}
                        </p>
                        <p className="text-xs" style={{ color: "hsl(140,60%,50%)" }}>
                          declicdigital.net{location.pathname}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                          {(override.seo_description as string) || "-"}
                        </p>
                      </div>
                    )}

                    {/* Champs */}
                    {PANEL_FIELDS.map((field) => {
                      const value = (override[field.key] as string) ?? "";
                      const isTitle = field.key === "seo_title";
                      const isDesc = field.key === "seo_description";
                      const charCount = isTitle ? `${value.length}/60` : isDesc ? `${value.length}/160` : null;
                      const charError = (isTitle && value.length > 60) || (isDesc && value.length > 160);
                      const isHtml = field.type === "html";

                      return (
                        <div key={field.key as string}>
                          <label
                            className="flex items-center justify-between text-xs font-medium mb-1.5"
                            style={{ color: charError ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}
                          >
                            <span className="flex items-center gap-1">
                              {isHtml && <Code size={10} style={{ color: "hsl(183,70%,63%)" }} />}
                              {field.label}
                            </span>
                            {charCount && <span>{charCount}</span>}
                          </label>
                          {field.type === "textarea" || isHtml ? (
                            <textarea
                              value={value}
                              onChange={(e) => updateField(field.key, e.target.value)}
                              rows={field.rows ?? 3}
                              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-y"
                              style={{
                                background: isHtml ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${charError ? "hsl(0,70%,50%)" : isHtml ? "rgba(99,179,237,0.25)" : "rgba(255,255,255,0.08)"}`,
                                fontFamily: isHtml ? "monospace" : undefined,
                                fontSize: isHtml ? "12px" : undefined,
                              }}
                              placeholder={isHtml ? "<p>Votre HTML ici...</p>" : undefined}
                            />
                          ) : (
                            <input
                              value={value}
                              onChange={(e) => updateField(field.key, e.target.value)}
                              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: `1px solid ${charError ? "hsl(0,70%,50%)" : "rgba(255,255,255,0.08)"}`,
                              }}
                            />
                          )}
                          {field.hint && (
                            <p className="text-xs mt-1" style={{ color: isHtml ? "rgba(99,179,237,0.6)" : "rgba(255,255,255,0.25)" }}>
                              {field.hint}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    <div
                      className="rounded-xl p-3 flex gap-2"
                      style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.15)" }}
                    >
                      <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(251,146,60)" }} />
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                        Pour les sections H2/H3/paragraphes et l'upload d'images, utilisez l'editeur complet.
                      </p>
                    </div>
                  </>
                )
              )}

              {/* ── Onglet Sticky bar ── */}
              {activeTab === "stickybar" && (
                <div className="space-y-4">
                  <div
                    className="rounded-xl p-3 flex gap-2"
                    style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}
                  >
                    <Megaphone size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      La sticky bar s'affiche en haut de toutes les pages du site pour tous les visiteurs.
                    </p>
                  </div>

                  {/* Activer/desactiver */}
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl"
                    style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-sm text-white font-medium">Activer la sticky bar</span>
                    <div
                      onClick={() => setStickyBar((p) => ({ ...p, enabled: !p.enabled }))}
                      className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                      style={{ background: stickyBar.enabled ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.15)" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: stickyBar.enabled ? "translateX(22px)" : "translateX(2px)" }}
                      />
                    </div>
                  </label>

                  {/* Texte principal */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Texte de la barre
                    </label>
                    <textarea
                      value={stickyBar.text}
                      onChange={(e) => setStickyBar((p) => ({ ...p, text: e.target.value }))}
                      rows={2}
                      placeholder="Offre speciale - Audit SEO gratuit ce mois-ci !"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* CTA label */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Texte du bouton CTA (optionnel)
                    </label>
                    <input
                      value={stickyBar.cta_label}
                      onChange={(e) => setStickyBar((p) => ({ ...p, cta_label: e.target.value }))}
                      placeholder="En profiter"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* CTA href */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Lien du bouton CTA
                    </label>
                    <input
                      value={stickyBar.cta_href}
                      onChange={(e) => setStickyBar((p) => ({ ...p, cta_href: e.target.value }))}
                      placeholder="/contact"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Couleurs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Couleur de fond
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={stickyBar.bg_color.startsWith("#") ? stickyBar.bg_color : "#4cc9b0"}
                          onChange={(e) => setStickyBar((p) => ({ ...p, bg_color: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                        <input
                          value={stickyBar.bg_color}
                          onChange={(e) => setStickyBar((p) => ({ ...p, bg_color: e.target.value }))}
                          placeholder="#4cc9b0 ou linear-gradient(...)"
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
                        <input
                          type="color"
                          value={stickyBar.text_color}
                          onChange={(e) => setStickyBar((p) => ({ ...p, text_color: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        />
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

                  {/* Preview */}
                  {stickyBar.text && (
                    <div>
                      <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Apercu</p>
                      <div
                        className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
                        style={{ background: stickyBar.bg_color, color: stickyBar.text_color }}
                      >
                        <p className="text-sm font-medium">{stickyBar.text}</p>
                        {stickyBar.cta_label && (
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-lg shrink-0"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                          >
                            {stickyBar.cta_label}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer sticky */}
            <div
              className="shrink-0 px-5 py-4 space-y-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "hsl(263, 36%, 10%)" }}
            >
              {activeTab === "page" && (
                <>
                  {saved && (
                    <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                      style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                      <Check size={12} /> Sauvegarde avec succes
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.70)" }}
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Brouillon
                    </button>
                    <button
                      onClick={() => handleSave(true)}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
                      style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Publier
                    </button>
                  </div>
                  <a
                    href={`/admin/pages/${encodeURIComponent(pageKey ?? "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    <ExternalLink size={11} /> Ouvrir l'editeur complet
                  </a>
                </>
              )}

              {activeTab === "stickybar" && (
                <>
                  {savedSticky && (
                    <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                      style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                      <Check size={12} /> Sticky bar sauvegardee
                    </div>
                  )}
                  <button
                    onClick={handleSaveSticky}
                    disabled={savingSticky}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
                  >
                    {savingSticky ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Enregistrer la sticky bar
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
