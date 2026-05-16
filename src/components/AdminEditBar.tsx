// src/components/AdminEditBar.tsx
// Panneau inline depuis le site
// Onglet "HTML brut" : export/import du HTML complet de la page

import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Edit2, X, Save, ExternalLink, Loader2,
  Check, Megaphone, Code, Copy, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { invalidatePageCache } from "@/hooks/usePageContent";
import type { PageOverride } from "@/hooks/usePageContent";
import RichTextEditor from "@/components/admin/RichTextEditor";

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

type FieldDef = {
  key: keyof PageOverride;
  label: string;
  type: "input" | "rich";
  hint?: string;
};

const PANEL_FIELDS: FieldDef[] = [
  { key: "seo_title",           label: "Title SEO",        type: "input", hint: "60 car. max" },
  { key: "seo_description",     label: "Meta description", type: "input", hint: "160 car. max" },
  { key: "seo_h1",              label: "H1",               type: "input" },
  { key: "hero_intro",          label: "Intro hero",       type: "rich" },
  { key: "creation_seo_text_1", label: "Texte SEO §1",     type: "rich" },
  { key: "creation_seo_text_2", label: "Texte SEO §2",     type: "rich" },
  { key: "seo_local_text",      label: "SEO local text",   type: "rich" },
  { key: "seo_why_text",        label: "Pourquoi SEO",     type: "rich" },
  { key: "local_fact",          label: "Le saviez-vous ?", type: "rich" },
];

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

// Genere le HTML complet depuis les donnees override + content_blocks
function generateFullHtml(override: Partial<PageOverride>): string {
  const blocks: any[] = (override as any).content_blocks ?? [];

  const blocksHtml = blocks
    .filter(b => b.visible !== false)
    .map(b => {
      switch (b.type) {
        case "h2":    return `<h2>${b.content}</h2>`;
        case "h3":    return `<h3>${b.content}</h3>`;
        case "h4":    return `<h4>${b.content}</h4>`;
        case "p":     return b.content;
        case "html":  return b.content;
        case "image": return `<img src="${b.content}" alt="${b.label ?? ""}" />`;
        case "link":  return `<a href="${b.content}">${b.label ?? b.content}</a>`;
        default:      return b.content;
      }
    })
    .join("\n\n");

  const customHtml = (override as any).custom_html ?? "";

  const parts: string[] = [];

  if (override.seo_h1)              parts.push(`<h1>${override.seo_h1}</h1>`);
  if (override.hero_intro)          parts.push(override.hero_intro as string);
  if ((override as any).creation_seo_text_1) parts.push((override as any).creation_seo_text_1);
  if ((override as any).creation_seo_text_2) parts.push((override as any).creation_seo_text_2);
  if ((override as any).creation_why_text)   parts.push((override as any).creation_why_text);
  if ((override as any).seo_local_text)      parts.push((override as any).seo_local_text);
  if ((override as any).seo_why_text)        parts.push((override as any).seo_why_text);
  if ((override as any).local_fact)          parts.push(`<div class="local-fact">${(override as any).local_fact}</div>`);
  if (blocksHtml)                   parts.push(blocksHtml);
  if (customHtml)                   parts.push(customHtml);

  return parts.filter(Boolean).join("\n\n");
}

// Parse un HTML brut et le decoupe en champs override
function parseHtmlToOverride(html: string, existing: Partial<PageOverride>): Partial<PageOverride> {
  // On stocke tout dans custom_html + on remet content_blocks vide
  // L'utilisateur peut choisir de tout mettre en custom_html ou de
  // laisser l'editeur le parser. Ici on stocke tout en custom_html
  // pour un remplacement 1:1 simple et fiable.
  return {
    ...existing,
    custom_html: html,
    // Reset les champs individuels pour eviter les doublons
    hero_intro: "",
    creation_seo_text_1: "",
    creation_seo_text_2: "",
    creation_why_text: "",
    seo_local_text: "",
    seo_why_text: "",
    local_fact: "",
    content_blocks: [],
  } as any;
}

export default function AdminEditBar() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"page" | "html" | "stickybar">("page");
  const [pageKey, setPageKey] = useState<string | null>(null);
  const [override, setOverride] = useState<Partial<PageOverride>>({});
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // HTML brut
  const [htmlContent, setHtmlContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Sticky bar
  const [stickyBar, setStickyBar] = useState<StickyBarConfig>(STICKY_DEFAULT);
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

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("site_settings").select("*").eq("key", "sticky_bar").maybeSingle()
      .then(({ data }) => {
        if (data?.value) { setStickyBar({ ...STICKY_DEFAULT, ...data.value }); setStickyBarId(data.id); }
      });
  }, [isAdmin]);

  useEffect(() => {
    const key = inferPageKey(location.pathname);
    setPageKey(key);
    setPanelOpen(false);
    setOverride({});
    setExistingId(null);
    setHtmlContent("");
  }, [location.pathname]);

  async function openPanel(tab?: "page" | "html" | "stickybar") {
    if (!pageKey) return;
    setLoading(true);
    setPanelOpen(true);
    if (tab) setActiveTab(tab);

    const { data } = await supabase
      .from("page_overrides")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();

    if (data) {
      setOverride(data as PageOverride);
      setExistingId(data.id);
      setHtmlContent(generateFullHtml(data as PageOverride));
    } else {
      setOverride({});
      setExistingId(null);
      setHtmlContent("");
    }
    setLoading(false);
  }

  function updateField(key: keyof PageOverride, value: string) {
    setOverride(prev => ({ ...prev, [key]: value }));
  }

  // Quand on change l'onglet HTML, regenerer le HTML depuis l'etat actuel
  function switchToHtml() {
    setHtmlContent(generateFullHtml(override));
    setActiveTab("html");
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

    // Si on est dans l'onglet HTML, on applique le HTML brut
    const finalOverride = activeTab === "html"
      ? parseHtmlToOverride(htmlContent, override)
      : override;

    const payload = {
      page_key: pageKey,
      page_type: pageType,
      page_label: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      page_url: pageUrl,
      seo_title: (finalOverride.seo_title as string) || null,
      seo_description: (finalOverride.seo_description as string) || null,
      seo_h1: (finalOverride.seo_h1 as string) || null,
      hero_intro: (finalOverride.hero_intro as string) || null,
      hero_bg_image_url: (finalOverride.hero_bg_image_url as string) || null,
      sections: (finalOverride.sections as any) || [],
      content_blocks: (finalOverride as any).content_blocks || [],
      creation_seo_text_1: (finalOverride as any).creation_seo_text_1 || null,
      creation_seo_text_2: (finalOverride as any).creation_seo_text_2 || null,
      creation_why_text: (finalOverride as any).creation_why_text || null,
      seo_local_text: (finalOverride as any).seo_local_text || null,
      seo_why_text: (finalOverride as any).seo_why_text || null,
      local_fact: (finalOverride as any).local_fact || null,
      custom_html: (finalOverride as any).custom_html || null,
      is_published: publish !== undefined ? publish : ((finalOverride.is_published as boolean) ?? false),
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
      if (publish !== undefined) setOverride(prev => ({ ...prev, is_published: publish }));
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

  function handleCopyHtml() {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isAdmin || !pageKey) return null;
  if (location.pathname.startsWith("/admin")) return null;

  const isPublished = override.is_published === true;

  return (
    <>
      {/* ── Barre admin fixe en bas ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9998] flex items-center justify-between px-4 py-2.5 gap-3"
        style={{
          background: "hsl(263, 36%, 10%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0"
            style={{ background: isPublished ? "rgb(74,222,128)" : existingId ? "rgb(251,146,60)" : "rgba(255,255,255,0.25)" }} />
          <span className="text-xs text-white font-medium truncate hidden sm:block">{pageKey}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            style={{
              background: isPublished ? "rgba(34,197,94,0.15)" : existingId ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.08)",
              color: isPublished ? "rgb(74,222,128)" : existingId ? "rgb(251,146,60)" : "rgba(255,255,255,0.40)",
            }}>
            {isPublished ? "Publie" : existingId ? "Brouillon" : "Non edite"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { openPanel("html"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(99,179,237,0.12)", color: "rgb(99,179,237)" }}
            title="Editer le HTML brut de la page"
          >
            <Code size={11} /> HTML
          </button>
          <button
            onClick={() => { setPanelOpen(true); setActiveTab("stickybar"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
          >
            <Megaphone size={11} />
            <span className="hidden sm:inline">Sticky bar</span>
          </button>
          <a href={`/admin/pages/${encodeURIComponent(pageKey)}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
            <ExternalLink size={11} />
            <span className="hidden sm:inline">Editeur complet</span>
          </a>
          <button
            onClick={() => { openPanel("page"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-glow"
            style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
          >
            <Edit2 size={11} /> Modifier
          </button>
        </div>
      </div>

      {/* ── Panneau lateral ── */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setPanelOpen(false)} />

          <div className="fixed top-0 right-0 bottom-0 z-[9999] flex flex-col"
            style={{
              width: "min(560px, 95vw)",
              background: "hsl(263, 36%, 10%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{pageKey}</p>
                <h2 className="text-sm font-bold text-white mt-0.5">Modifier la page</h2>
              </div>
              <button onClick={() => setPanelOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
                style={{ color: "rgba(255,255,255,0.50)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 mx-5 my-3 p-1 rounded-xl shrink-0"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { key: "page",      label: "Contenu" },
                { key: "html",      label: "HTML brut", icon: <Code size={10} /> },
                { key: "stickybar", label: "Sticky bar", icon: <Megaphone size={10} /> },
              ].map(tab => (
                <button key={tab.key}
                  onClick={() => tab.key === "html" ? switchToHtml() : setActiveTab(tab.key as any)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                  style={activeTab === tab.key
                    ? { background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }
                    : { color: "rgba(255,255,255,0.45)" }}>
                  {"icon" in tab ? tab.icon : null} {tab.label}
                </button>
              ))}
            </div>

            {/* Corps */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 pb-36">

              {/* ── Onglet Contenu ── */}
              {activeTab === "page" && (
                loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin" style={{ color: "hsl(183,70%,63%)" }} />
                  </div>
                ) : (
                  <>
                    {(override.seo_title || override.seo_description) && (
                      <div className="rounded-xl p-3"
                        style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.06)" }}>
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
                    {PANEL_FIELDS.map(field => {
                      const value = (override[field.key] as string) ?? "";
                      const isTitle = field.key === "seo_title";
                      const isDesc = field.key === "seo_description";
                      const charCount = isTitle ? `${value.length}/60` : isDesc ? `${value.length}/160` : null;
                      const charError = (isTitle && value.length > 60) || (isDesc && value.length > 160);
                      return (
                        <div key={field.key as string}>
                          <label className="flex items-center justify-between text-xs font-medium mb-1.5"
                            style={{ color: charError ? "hsl(0,70%,65%)" : "rgba(255,255,255,0.45)" }}>
                            <span>{field.label}</span>
                            {charCount && <span>{charCount}</span>}
                          </label>
                          {field.type === "rich" ? (
                            <RichTextEditor
                              value={value}
                              onChange={html => updateField(field.key, html)}
                              placeholder={`${field.label}...`}
                              minHeight={90}
                            />
                          ) : (
                            <input value={value}
                              onChange={e => updateField(field.key, e.target.value)}
                              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: `1px solid ${charError ? "hsl(0,70%,50%)" : "rgba(255,255,255,0.08)"}`,
                              }} />
                          )}
                          {field.hint && (
                            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{field.hint}</p>
                          )}
                        </div>
                      );
                    })}
                  </>
                )
              )}

              {/* ── Onglet HTML brut ── */}
              {activeTab === "html" && (
                <div className="space-y-3">
                  <div className="rounded-xl p-3 flex gap-2"
                    style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
                    <Code size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <p className="font-medium text-white mb-0.5">HTML complet de la page</p>
                      <p>Copie, modifie, puis colle ton HTML ici. En sauvegardant, il remplace tout le contenu existant.</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={handleCopyHtml}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: "rgba(255,255,255,0.07)", color: copied ? "rgb(74,222,128)" : "rgba(255,255,255,0.60)" }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copie !" : "Copier tout"}
                    </button>
                    <button onClick={() => setHtmlContent(generateFullHtml(override))}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.60)" }}>
                      <RefreshCw size={12} /> Regenerer
                    </button>
                    <button onClick={() => setHtmlContent("")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                      Vider
                    </button>
                  </div>

                  {/* Textarea HTML */}
                  <textarea
                    value={htmlContent}
                    onChange={e => setHtmlContent(e.target.value)}
                    className="w-full focus:outline-none resize-none"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(99,179,237,0.25)",
                      borderRadius: "12px",
                      padding: "14px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      lineHeight: "1.7",
                      color: "rgba(255,255,255,0.85)",
                      minHeight: "420px",
                      height: "420px",
                    }}
                    placeholder={"<h1>Titre de la page</h1>\n\n<p>Premier paragraphe...</p>\n\n<h2>Section 1</h2>\n<p>Contenu...</p>"}
                    spellCheck={false}
                  />
                  <p className="text-xs" style={{ color: "rgba(99,179,237,0.5)" }}>
                    {htmlContent.length} caracteres - En sauvegardant, ce HTML remplace tout le contenu de la page.
                  </p>
                </div>
              )}

              {/* ── Onglet Sticky bar ── */}
              {activeTab === "stickybar" && (
                <div className="space-y-4">
                  <div className="rounded-xl p-3 flex gap-2"
                    style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)" }}>
                    <Megaphone size={14} className="shrink-0 mt-0.5" style={{ color: "rgb(99,179,237)" }} />
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      Barre affichee en haut de toutes les pages pour tous les visiteurs.
                    </p>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl"
                    style={{ background: "hsl(263, 36%, 14%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-sm text-white font-medium">Activer la sticky bar</span>
                    <div onClick={() => setStickyBar(p => ({ ...p, enabled: !p.enabled }))}
                      className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
                      style={{ background: stickyBar.enabled ? "hsl(183,70%,63%)" : "rgba(255,255,255,0.15)" }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: stickyBar.enabled ? "translateX(22px)" : "translateX(2px)" }} />
                    </div>
                  </label>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Texte de la barre
                    </label>
                    <RichTextEditor
                      value={stickyBar.text}
                      onChange={html => setStickyBar(p => ({ ...p, text: html }))}
                      placeholder="Offre speciale..."
                      minHeight={60}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Texte du bouton CTA
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

                  <div className="grid grid-cols-2 gap-3">
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
                            className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0.5"
                            style={{ background: "rgba(255,255,255,0.05)" }} />
                          <input value={stickyBar[c.key]}
                            onChange={e => setStickyBar(p => ({ ...p, [c.key]: e.target.value }))}
                            className="flex-1 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {stickyBar.text && (
                    <div>
                      <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Apercu</p>
                      <div className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
                        style={{ background: stickyBar.bg_color, color: stickyBar.text_color }}>
                        <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: stickyBar.text }} />
                        {stickyBar.cta_label && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-lg shrink-0"
                            style={{ background: "rgba(255,255,255,0.2)" }}>
                            {stickyBar.cta_label}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-4 space-y-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "hsl(263, 36%, 10%)" }}>

              {activeTab !== "stickybar" && (
                <>
                  {saved && (
                    <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                      style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)" }}>
                      <Check size={12} /> Sauvegarde avec succes
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(false)} disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.70)" }}>
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Brouillon
                    </button>
                    <button onClick={() => handleSave(true)} disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
                      style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Publier
                    </button>
                  </div>
                  <a href={`/admin/pages/${encodeURIComponent(pageKey ?? "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}>
                    <ExternalLink size={11} /> Editeur complet
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
                  <button onClick={handleSaveSticky} disabled={savingSticky}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
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
