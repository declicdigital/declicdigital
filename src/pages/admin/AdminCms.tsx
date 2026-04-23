import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Edit2, Loader2, FileText, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const PAGE_LABELS: Record<string, string> = {
  accueil: "Page d'accueil",
  "creation-site-web": "Création de site web",
  "referencement-seo": "Référencement SEO",
  "visibilite-ia": "Visibilité IA (GEO)",
  tarifs: "Tarifs",
  faq: "FAQ",
  "qui-sommes-nous": "Qui sommes-nous",
  contact: "Contact",
};

export default function AdminCms() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("cms_pages")
      .select("*, cms_blocks(count)")
      .order("slug")
      .then(({ data }) => {
        setPages(data ?? []);
        setLoadingData(false);
      });
  }, [isAdmin]);

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">CMS Pages</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
              Modifiez les textes, images et blocs de chaque page du site
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div key={page.id} className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%,0.15), hsl(284,65%,66%,0.15))" }}>
                    <FileText size={16} style={{ color: "hsl(183,70%,63%)" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{PAGE_LABELS[page.slug] || page.title}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>/{page.slug}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${page.is_published ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                  {page.is_published ? "Publié" : "Brouillon"}
                </span>
              </div>

              <p className="text-xs line-clamp-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                {page.meta_description || "Aucune meta description"}
              </p>

              <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link to={`/admin/cms/${page.slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all btn-glow"
                  style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
                  <Edit2 size={12} /> Modifier
                </Link>
                <a href={`/${page.slug === "accueil" ? "" : page.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                  <Globe size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
