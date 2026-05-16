// src/pages/admin/AdminCityContent.tsx
// Liste toutes les villes et leur statut d'edition dans city_content

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit2, Globe, Search, MapPin, Check, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { cities } from "@/data/cities";

type EditedMap = Record<string, { updated_at: string; is_published: boolean }>;

export default function AdminCityContent() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [edited, setEdited] = useState<EditedMap>({});
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState<"all" | "paris" | "hauts-de-seine">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "edited" | "static">("all");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("city_content")
      .select("slug, updated_at, is_published")
      .then(({ data }) => {
        const map: EditedMap = {};
        (data ?? []).forEach((row: any) => {
          map[row.slug] = { updated_at: row.updated_at, is_published: row.is_published };
        });
        setEdited(map);
        setLoadingData(false);
      });
  }, [isAdmin]);

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  const filtered = cities.filter(c => {
    const matchSearch = search === "" ||
      c.nameShort.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    const matchRegion = filterRegion === "all" || c.region === filterRegion;
    const isEdited = !!edited[c.slug];
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "edited" && isEdited) ||
      (filterStatus === "static" && !isEdited);
    return matchSearch && matchRegion && matchStatus;
  });

  const editedCount = cities.filter(c => edited[c.slug]).length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Contenu des villes</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            {cities.length} villes - {editedCount} editees dans Supabase - {cities.length - editedCount} sur contenu statique
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.30)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une ville..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white focus:outline-none"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <select value={filterRegion} onChange={e => setFilterRegion(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <option value="all">Toutes les regions</option>
            <option value="paris">Paris</option>
            <option value="hauts-de-seine">Hauts-de-Seine</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <option value="all">Tous statuts</option>
            <option value="edited">Edites ({editedCount})</option>
            <option value="static">Statiques ({cities.length - editedCount})</option>
          </select>
        </div>

        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>
          {filtered.length} ville{filtered.length > 1 ? "s" : ""}
        </p>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(city => {
            const e = edited[city.slug];
            return (
              <div key={city.slug} className="rounded-2xl p-4 flex flex-col gap-2.5"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} style={{ color: city.region === "paris" ? "hsl(183,70%,63%)" : "hsl(284,65%,66%)" }} />
                    <span className="text-xs font-medium" style={{ color: city.region === "paris" ? "hsl(183,70%,63%)" : "hsl(284,65%,66%)" }}>
                      {city.region === "paris" ? "Paris" : "92"}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: e ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                      color: e ? "rgb(74,222,128)" : "rgba(255,255,255,0.35)",
                    }}>
                    {e ? "Supabase" : "Statique"}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-sm text-white">{city.nameShort}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {city.slug}
                  </p>
                </div>

                {e && (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Modifie le {new Date(e.updated_at).toLocaleDateString("fr-FR")}
                  </p>
                )}

                <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Link
                    to={`/admin/villes/${city.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                    <Edit2 size={12} />
                    {e ? "Modifier" : "Creer"}
                  </Link>
                  <a href={`/creation-site-web/${city.slug}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                    <Globe size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
