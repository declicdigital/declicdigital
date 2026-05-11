// src/components/AdminEditBar.tsx
// ============================================================
// Barre sticky d'édition + panneau latéral
// Visible uniquement quand un admin est connecté.
// À placer dans PageLayout.tsx (ou App.tsx) pour qu'elle
// apparaisse sur toutes les pages.
//
// Usage dans PageLayout.tsx :
//   import AdminEditBar from "@/components/AdminEditBar";
//   ...
//   <AdminEditBar pageKey={pageKey} pageUrl={pageUrl} />
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Edit2, X, Save, Eye, ExternalLink, Loader2,
  ChevronRight, Check, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { invalidatePageCache } from "@/hooks/usePageContent";
import type { PageOverride } from "@/hooks/usePageContent";

// ── Déduire le pageKey depuis l'URL ─────────────────────────
function inferPageKey(pathname: string): string | null {
  // Création site ville
  const creationVille = pathname.match(/^\/creation-site-web\/([^/]+)$/);
  if (creationVille && creationVille[1] !== "metier") {
    return `creation/${creationVille[1]}`;
  }
  // Métier
  const metier = pathname.match(/^\/creation-site-web\/metier\/([^/]+)$/);
  if (metier) return `metier/${metier[1]}`;
  // SEO ville
  const seoVille = pathname.match(/^\/referencement-seo\/([^/]+)$/);
  if (seoVille) return `seo/${seoVille[1]}`;
  // Pages statiques
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

// ── Types ────────────────────────────────────────────────────
type PanelField = {
  key: keyof PageOverride;
  label: string;
  type: "input" | "textarea" | "url";
  hint?: string;
  rows?: number;
};

const PANEL_FIELDS: PanelField[] = [
  { key: "seo_title",       label: "Title SEO",         type: "input",    hint: "≤ 60 car." },
  { key: "seo_description", label: "Meta description",  type: "textarea", hint: "≤ 160 car.", rows: 3 },
  { key: "seo_h1",          label: "H1",                type: "input" },
  { key: "hero_intro",      label: "Intro hero",        type: "textarea", rows: 4 },
  { key: "creation_seo_text_1", label: "Texte SEO §1",  type: "textarea", rows: 4 },
  { key: "creation_seo_text_2", label: "Texte SEO §2",  type: "textarea", rows: 4 },
  { key: "seo_local_text",  label: "SEO local text",    type: "textarea", rows: 4 },
  { key: "seo_why_text",    label: "Pourquoi SEO",      type: "textarea", rows: 3 },
  { key: "local_fact",      label: "Le saviez-vous ?",  type: "textarea", rows: 2 },
  { key: "hero_bg_image_url", label: "Image hero (URL)",type: "url" },
];

// ── Composant principal ──────────────────────────────────────
export default function AdminEditBar() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pageKey, setPageKey] = useState<string | null>(null);
  const [override, setOverride] = useState<Partial<PageOverride>>({});
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Vérifier la session admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session?.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session?.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Détecter la page courante
  useEffect(() => {
    const key = inferPageKey(location.pathname);
    setPageKey(key);
    setPanelOpen(false);
    setOverride({});
    setExistingId(null);
  }, [location.pathname]);

  // Charger les données existantes quand le panneau s'ouvre
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
      : pageKey.startsWith("metier/") ? "metier"
      : "static";
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
      is_published: publish !== undefined ? publish : ((override.is_published as boolean) ?? false),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (existingId) {
      ({ error } = await supabase.from("page_overrides").update(payload).eq("id", existingId));
    } else {
      const { data, error: e } = await supabase
        .from("page_overrides").insert(payload).select().single();
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

  // Ne rien afficher si pas admin ou si page non gérée
  if (!isAdmin || !pageKey) return null;
  // Ne pas afficher sur les pages admin
  if (location.pathname.startsWith("/admin")) return null;

  const isPublished = override.is_published === true;

  return (
    <>
      {/* ── Sticky bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9998] flex items-center justify-between px-4 py-2.5 gap-3"
        style={{
          background: "hsl(263, 36%, 10%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* Infos page */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: isPublished ? "rgb(74,222,128)"
                : existingId ? "rgb(251,146,60)"
                : "rgba(255,255,255,0.25)",
            }}
          />
          <span className="text-xs text-white font-medium truncate hidden sm:block">
            {pageKey}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            style={{
              background: isPublished ? "rgba(34,197,94,0.15)"
                : existingId ? "rgba(251,146,60,0.15)"
                : "rgba(255,255,255,0.08)",
              color: isPublished ? "rgb(74,222,128)"
                : existingId ? "rgb(251,146,60)"
                : "rgba(255,255,255,0.40)",
            }}
          >
            {isPublished ? "Publié" : existingId ? "Brouillon" : "Non édité"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/admin/pages/${encodeURIComponent(pageKey)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
            title="Ouvrir l'éditeur complet"
          >
            <ExternalLink size={11} />
            <span className="hidden sm:inline">Éditeur complet</span>
          </a>

          <button
            onClick={openPanel}
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
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setPanelOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed top-0 right-0 bottom-0 z-[9999] flex flex-col"
            style={{
              width: "min(480px, 95vw)",
              background: "hsl(263, 36%, 10%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header panneau */}
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

            {/* Corps */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-32">
              {loading ? (
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
                      <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                        Aperçu Google
                      </p>
                      <p className="text-sm font-medium" style={{ color: "hsl(220,90%,70%)" }}>
                        {(override.seo_title as string) || "—"}
                      </p>
                      <p className="text-xs" style={{ color: "hsl(140,60%,50%)" }}>
                        declicdigital.net{location.pathname}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {(override.seo_description as string) || "—"}
                      </p>
                    </div>
                  )}

                  {/* Champs */}
                  {PANEL_FIELDS.map((field) => {
                    const value = (override[field.key] as string) ?? "";
                    const isLong = field.type === "textarea";
                    const isTitle = field.key === "seo_title";
                    const isDesc = field.key === "seo_description";
                    const charCount = isTitle ? `${value.length}/60` : isDesc ? `${value.length}/160` : null;
                    const charError = (isTitle && value.length > 60) || (isDesc && value.length > 160);

                    return (
                      <div key={field.key as string}>
                        <label
                          className="flex items-center justify-between text-xs font-medium mb-1.5"
                          style={{ color: charError ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}
                        >
                          <span>{field.label}</span>
                          {charCount && <span>{charCount}</span>}
                        </label>
                        {isLong ? (
                          <textarea
                            value={value}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            rows={field.rows ?? 3}
                            className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-y"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: `1px solid ${charError ? "hsl(0,70%,50%)" : "rgba(255,255,255,0.08)"}`,
                            }}
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
                          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
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
                      Pour les sections H2/H3/paragraphes supplémentaires et l'upload d'images, utilisez l'éditeur complet.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer panneau — sticky */}
            <div
              className="shrink-0 px-5 py-4 space-y-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "hsl(263, 36%, 10%)" }}
            >
              {saved && (
                <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                  style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                  <Check size={12} /> Sauvegardé avec succès
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
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
                href={`/admin/pages/${encodeURIComponent(pageKey)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                <ExternalLink size={11} /> Ouvrir l'éditeur complet
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
