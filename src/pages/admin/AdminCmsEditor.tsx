import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, Loader2,
  ChevronDown, ChevronUp, X, Check, Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const BLOCK_TYPES = [
  { type: "hero", label: "Hero / Bannière principale" },
  { type: "text", label: "Bloc texte" },
  { type: "problem", label: "Section problème" },
  { type: "services", label: "Section services" },
  { type: "cta", label: "Appel à l'action (CTA)" },
  { type: "cta_final", label: "CTA final" },
  { type: "stats", label: "Statistiques" },
  { type: "faq_item", label: "Question FAQ" },
  { type: "pricing", label: "Bloc tarif" },
  { type: "image", label: "Image" },
  { type: "testimonial", label: "Témoignage" },
];

const BLOCK_DEFAULTS: Record<string, any> = {
  hero: { badge: "", title: "", subtitle: "", cta_primary_label: "Demander un audit SEO gratuit", cta_primary_href: "/contact", cta_secondary_label: "Prendre rendez-vous", cta_secondary_href: "/rendez-vous" },
  text: { title: "", content: "" },
  problem: { title: "", subtitle: "", items: [], cta_label: "", cta_href: "/contact" },
  services: { title: "", subtitle: "", items: [] },
  cta: { title: "", subtitle: "", cta_label: "", cta_href: "/contact" },
  cta_final: { title: "", subtitle: "", cta_primary_label: "", cta_primary_href: "/contact", cta_secondary_label: "", cta_secondary_href: "/tarifs" },
  stats: { items: [] },
  faq_item: { question: "", answer: "" },
  pricing: { name: "", price: "", description: "", features: [], cta_label: "", cta_href: "/contact" },
  image: { src: "", alt: "", caption: "" },
  testimonial: { author: "", role: "", content: "", rating: 5 },
};

function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: any) {
  const [open, setOpen] = useState(false);
  const content = block.content || {};

  function updateField(key: string, value: any) {
    onChange({ ...block, content: { ...content, [key]: value } });
  }

  function renderField(key: string, value: any) {
    if (typeof value === "boolean") {
      return (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={value} onChange={(e) => updateField(key, e.target.checked)}
            className="rounded" />
          <span className="text-sm text-white capitalize">{key.replace(/_/g, " ")}</span>
        </label>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {key.replace(/_/g, " ")} (JSON)
          </label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => { try { updateField(key, JSON.parse(e.target.value)); } catch {} }}
            rows={6}
            className="w-full rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none resize-y"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      );
    }
    const isLong = key.includes("content") || key.includes("subtitle") || key.includes("text") || key.includes("bio") || key.includes("answer");
    return (
      <div key={key}>
        <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          {key.replace(/_/g, " ")}
        </label>
        {isLong ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => updateField(key, e.target.value)}
            rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        ) : (
          <input
            value={value ?? ""}
            onChange={(e) => updateField(key, e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        )}
      </div>
    );
  }

  const blockLabel = BLOCK_TYPES.find((b) => b.type === block.type)?.label || block.type;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header du bloc */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
        <GripVertical size={14} style={{ color: "rgba(255,255,255,0.20)" }} />
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 text-left">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.08)", color: "hsl(183,70%,63%)" }}>
            {block.type}
          </span>
          <span className="text-sm font-medium text-white">{blockLabel}</span>
          {content.title && <span className="text-xs truncate max-w-xs" style={{ color: "rgba(255,255,255,0.35)" }}>— {content.title}</span>}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.50)" }}>
            <ChevronUp size={14} />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.50)" }}>
            <ChevronDown size={14} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Trash2 size={14} />
          </button>
          <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.50)" }}>
            {open ? <ChevronUp size={14} /> : <Settings size={14} />}
          </button>
        </div>
      </div>

      {/* Champs du bloc */}
      {open && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              <input type="checkbox" checked={block.is_visible !== false} onChange={(e) => onChange({ ...block, is_visible: e.target.checked })} />
              Visible sur le site
            </label>
          </div>
          {Object.entries(content).map(([key, value]) => renderField(key, value))}
        </div>
      )}
    </div>
  );
}

export default function AdminCmsEditor() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !slug) return;
    async function load() {
      const { data: pageData } = await supabase.from("cms_pages").select("*").eq("slug", slug).single();
      if (pageData) setPage(pageData);
      const { data: blocksData } = await supabase.from("cms_blocks").select("*").eq("page_slug", slug).order("sort_order");
      setBlocks(blocksData ?? []);
      setLoadingData(false);
    }
    load();
  }, [isAdmin, slug]);

  function updateBlock(index: number, updated: any) {
    setBlocks((prev) => prev.map((b, i) => i === index ? updated : b));
  }

  function deleteBlock(index: number) {
    if (!confirm("Supprimer ce bloc ?")) return;
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }

  function addBlock(type: string) {
    const newBlock = {
      id: `new-${Date.now()}`,
      page_slug: slug,
      type,
      content: BLOCK_DEFAULTS[type] || {},
      sort_order: blocks.length + 1,
      is_visible: true,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddBlock(false);
  }

  async function handleSave() {
    if (!page) return;
    setSaving(true);

    // Sauvegarder la page
    await supabase.from("cms_pages").update({
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      is_published: page.is_published,
      updated_at: new Date().toISOString(),
    }).eq("slug", slug);

    // Supprimer les anciens blocs
    await supabase.from("cms_blocks").delete().eq("page_slug", slug);

    // Réinsérer tous les blocs avec le bon ordre
    const toInsert = blocks.map((b, i) => ({
      page_slug: slug,
      type: b.type,
      content: b.content,
      sort_order: i + 1,
      is_visible: b.is_visible !== false,
    }));

    if (toInsert.length > 0) {
      await supabase.from("cms_blocks").insert(toInsert);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Recharger les blocs pour avoir les vrais IDs
    const { data: blocksData } = await supabase.from("cms_blocks").select("*").eq("page_slug", slug).order("sort_order");
    setBlocks(blocksData ?? []);
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;
  if (!page) return <AdminLayout><div className="p-8 text-white/40">Page introuvable</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between mb-6 py-3 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-3"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <Link to="/admin/cms" style={{ color: "rgba(255,255,255,0.40)" }} className="hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold text-white">{page.title}</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/${slug === "accueil" ? "" : slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
              <Eye size={14} /> Aperçu
            </a>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "✓ Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>

        {/* Meta SEO */}
        <div className="rounded-2xl p-5 space-y-4 mb-6" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold text-white">SEO & Meta</h2>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Meta title <span style={{ color: (page.meta_title?.length || 0) > 70 ? "hsl(0,70%,60%)" : "rgba(255,255,255,0.25)" }}>({page.meta_title?.length || 0}/70)</span>
            </label>
            <input value={page.meta_title || ""} onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Meta description <span style={{ color: (page.meta_description?.length || 0) > 160 ? "hsl(0,70%,60%)" : "rgba(255,255,255,0.25)" }}>({page.meta_description?.length || 0}/160)</span>
            </label>
            <textarea value={page.meta_description || ""} onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
              rows={3} className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={page.is_published} onChange={(e) => setPage({ ...page, is_published: e.target.checked })} />
            <span className="text-sm text-white">Page publiée</span>
          </label>
        </div>

        {/* Blocs */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold text-white">Blocs de contenu ({blocks.length})</h2>
          {blocks.map((block, i) => (
            <BlockEditor
              key={block.id || i}
              block={block}
              onChange={(updated: any) => updateBlock(i, updated)}
              onDelete={() => deleteBlock(i)}
              onMoveUp={() => moveBlock(i, "up")}
              onMoveDown={() => moveBlock(i, "down")}
              isFirst={i === 0}
              isLast={i === blocks.length - 1}
            />
          ))}
        </div>

        {/* Ajouter un bloc */}
        {showAddBlock ? (
          <div className="rounded-2xl p-4" style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Choisir un type de bloc</h3>
              <button onClick={() => setShowAddBlock(false)} style={{ color: "rgba(255,255,255,0.40)" }}>
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {BLOCK_TYPES.map((bt) => (
                <button key={bt.type} onClick={() => addBlock(bt.type)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.70)" }}>
                  <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.08)", color: "hsl(183,70%,63%)" }}>{bt.type}</span>
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddBlock(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
            <Plus size={16} /> Ajouter un bloc
          </button>
        )}
      </div>
    </AdminLayout>
  );
}
