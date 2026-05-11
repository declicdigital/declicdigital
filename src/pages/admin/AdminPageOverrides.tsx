// src/pages/admin/AdminPageOverrides.tsx
// ============================================================
// Page admin : liste de toutes les pages dynamiques éditables
// Route : /admin/pages
// ============================================================

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit2, Globe, Search, Filter, FileText, MapPin, Briefcase, Layout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// ── Données statiques : toutes les pages gérables ───────────
// On importe les slugs depuis les données existantes

const PARIS_ARRONDISSEMENTS = [
  "paris-1er","paris-2eme","paris-3eme","paris-4eme","paris-5eme",
  "paris-6eme","paris-7eme","paris-8eme","paris-9eme","paris-10eme",
  "paris-11eme","paris-12eme","paris-13eme","paris-14eme","paris-15eme",
  "paris-16eme","paris-17eme","paris-18eme","paris-19eme","paris-20eme",
];

const VILLES_92 = [
  "antony","asnieres-sur-seine","bagneux","bois-colombes","boulogne-billancourt",
  "bourg-la-reine","chatillon","chatenay-malabry","chaville","clamart","clichy",
  "colombes","courbevoie","fontenay-aux-roses","garches","gennevilliers",
  "issy-les-moulineaux","la-garenne-colombes","le-plessis-robinson","levallois-perret",
  "malakoff","marnes-la-coquette","meudon","montrouge","nanterre","neuilly-sur-seine",
  "puteaux","rueil-malmaison","saint-cloud","sceaux","sevres","suresnes","vanves",
  "vaucresson","ville-d-avray","villeneuve-la-garenne",
];

const METIERS = [
  "plombier","electricien","peintre-en-batiment","menuisier","serrurier","carreleur",
  "maconnerie","couvreur","jardinier-paysagiste","climaticien","coiffeur","estheticienne",
  "photographe","traiteur","coach-sportif","wedding-planner","professeur-particulier",
  "osteopathe","psychologue","dieteticien","sophrologue","naturopathe","boulanger-patissier",
  "fleuriste","restaurateur","consultant","expert-comptable","avocat","architecte",
  "decorateur-interieur","graphiste","developpeur-web","community-manager",
  "agent-immobilier","diagnostiqueur-immobilier","chauffeur-vtc","demenageur",
];

const STATIC_PAGES = [
  { key: "static/accueil", label: "Accueil", url: "/" },
  { key: "static/creation-site-web", label: "Création de site web", url: "/creation-site-web" },
  { key: "static/referencement-seo", label: "Référencement SEO", url: "/referencement-seo" },
  { key: "static/visibilite-ia", label: "Visibilité IA (GEO)", url: "/visibilite-ia" },
  { key: "static/tarifs", label: "Tarifs", url: "/tarifs" },
  { key: "static/faq", label: "FAQ", url: "/faq" },
  { key: "static/qui-sommes-nous", label: "Qui sommes-nous", url: "/qui-sommes-nous" },
  { key: "static/contact", label: "Contact", url: "/contact" },
  { key: "static/nos-villes", label: "Nos villes", url: "/nos-villes" },
  { key: "static/nos-metiers", label: "Nos métiers", url: "/nos-metiers" },
  { key: "static/realisations", label: "Réalisations", url: "/realisations" },
];

// Construire la liste complète
function buildAllPages() {
  const pages: { key: string; label: string; type: string; url: string }[] = [];

  // Pages création villes
  [...PARIS_ARRONDISSEMENTS, ...VILLES_92].forEach((slug) => {
    pages.push({
      key: `creation/${slug}`,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: "ville_creation",
      url: `/creation-site-web/${slug}`,
    });
  });

  // Pages SEO villes
  [...PARIS_ARRONDISSEMENTS, ...VILLES_92].forEach((slug) => {
    pages.push({
      key: `seo/${slug}`,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: "ville_seo",
      url: `/referencement-seo/${slug}`,
    });
  });

  // Pages métiers
  METIERS.forEach((slug) => {
    pages.push({
      key: `metier/${slug}`,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      type: "metier",
      url: `/creation-site-web/metier/${slug}`,
    });
  });

  // Pages statiques
  STATIC_PAGES.forEach((p) => {
    pages.push({ key: p.key, label: p.label, type: "static", url: p.url });
  });

  return pages;
}

const ALL_PAGES = buildAllPages();

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  ville_creation: { label: "Création site", color: "hsl(183,70%,63%)", icon: MapPin },
  ville_seo:      { label: "SEO local", color: "hsl(284,65%,66%)", icon: MapPin },
  metier:         { label: "Métier", color: "hsl(330,100%,70%)", icon: Briefcase },
  static:         { label: "Page statique", color: "hsl(40,90%,65%)", icon: Layout },
};

type OverrideMap = Record<string, { is_published: boolean; updated_at: string }>;

export default function AdminPageOverrides() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("page_overrides")
      .select("page_key, is_published, updated_at")
      .then(({ data }) => {
        const map: OverrideMap = {};
        (data ?? []).forEach((row: any) => {
          map[row.page_key] = { is_published: row.is_published, updated_at: row.updated_at };
        });
        setOverrides(map);
        setLoadingData(false);
      });
  }, [isAdmin]);

  if (loading || loadingData) {
    return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;
  }

  // Filtrage
  const filtered = ALL_PAGES.filter((p) => {
    const matchSearch = search === "" ||
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    const override = overrides[p.key];
    const status = !override ? "non_edite" : override.is_published ? "publie" : "brouillon";
    const matchStatus = filterStatus === "all" || filterStatus === status;
    return matchSearch && matchType && matchStatus;
  });

  const counts = {
    all: ALL_PAGES.length,
    publie: ALL_PAGES.filter((p) => overrides[p.key]?.is_published).length,
    brouillon: ALL_PAGES.filter((p) => overrides[p.key] && !overrides[p.key].is_published).length,
    non_edite: ALL_PAGES.filter((p) => !overrides[p.key]).length,
  };

  function getStatusBadge(pageKey: string) {
    const override = overrides[pageKey];
    if (!override) return { label: "Non édité", color: "rgba(255,255,255,0.15)", text: "rgba(255,255,255,0.35)" };
    if (override.is_published) return { label: "Publié", color: "rgba(34,197,94,0.15)", text: "rgb(74,222,128)" };
    return { label: "Brouillon", color: "rgba(251,146,60,0.15)", text: "rgb(251,146,60)" };
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Pages du site</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            {ALL_PAGES.length} pages éditables — {counts.publie} publiées · {counts.brouillon} brouillons · {counts.non_edite} non éditées
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Recherche */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.30)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une page..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white focus:outline-none"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          {/* Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <option value="all">Tous les types</option>
            <option value="ville_creation">Création site</option>
            <option value="ville_seo">SEO local</option>
            <option value="metier">Métiers</option>
            <option value="static">Pages statiques</option>
          </select>

          {/* Statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <option value="all">Tous statuts</option>
            <option value="publie">Publiés ({counts.publie})</option>
            <option value="brouillon">Brouillons ({counts.brouillon})</option>
            <option value="non_edite">Non édités ({counts.non_edite})</option>
          </select>
        </div>

        {/* Résultats */}
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>
          {filtered.length} page{filtered.length > 1 ? "s" : ""}
        </p>

        {/* Grille */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((page) => {
            const typeConf = TYPE_CONFIG[page.type];
            const TypeIcon = typeConf.icon;
            const badge = getStatusBadge(page.key);
            const override = overrides[page.key];

            return (
              <div
                key={page.key}
                className="rounded-2xl p-4 flex flex-col gap-2.5"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Ligne type + statut */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TypeIcon size={12} style={{ color: typeConf.color }} />
                    <span className="text-xs font-medium" style={{ color: typeConf.color }}>
                      {typeConf.label}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: badge.color, color: badge.text }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Nom de la page */}
                <div>
                  <p className="font-semibold text-sm text-white">{page.label}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {page.url}
                  </p>
                </div>

                {/* Date de modif */}
                {override && (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Modifié le {new Date(override.updated_at).toLocaleDateString("fr-FR")}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Link
                    to={`/admin/pages/${encodeURIComponent(page.key)}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}
                  >
                    <Edit2 size={12} />
                    {override ? "Modifier" : "Créer"}
                  </Link>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}
                  >
                    <Globe size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.30)" }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucune page correspondante</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
