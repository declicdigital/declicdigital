import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, Loader2,
  ChevronDown, ChevronUp, X, Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const INK = "#2B1E3F";
const INK_L = "rgba(43,30,63,0.50)";
const INK_XL = "rgba(43,30,63,0.30)";
const BG = "#F6F1E9";
const BG_CARD = "#EDE8DF";
const BG_INPUT = "rgba(43,30,63,0.05)";
const BORDER = "rgba(43,30,63,0.09)";
const BORDER_I = "rgba(43,30,63,0.12)";

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
  hero: { badge:"", title:"", subtitle:"", cta_primary_label:"Demander un audit SEO gratuit", cta_primary_href:"/contact", cta_secondary_label:"Prendre rendez-vous", cta_secondary_href:"/rendez-vous" },
  text: { title:"", content:"" },
  problem: { title:"", subtitle:"", items:[], cta_label:"", cta_href:"/contact" },
  services: { title:"", subtitle:"", items:[] },
  cta: { title:"", subtitle:"", cta_label:"", cta_href:"/contact" },
  cta_final: { title:"", subtitle:"", cta_primary_label:"", cta_primary_href:"/contact", cta_secondary_label:"", cta_secondary_href:"/tarifs" },
  stats: { items:[] },
  faq_item: { question:"", answer:"" },
  pricing: { name:"", price:"", description:"", features:[], cta_label:"", cta_href:"/contact" },
  image: { src:"", alt:"", caption:"" },
  testimonial: { author:"", role:"", content:"", rating:5 },
};

function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: any) {
  const [open, setOpen] = useState(false);
  const content = block.content || {};

  function updateField(key: string, value: any) { onChange({ ...block, content: { ...content, [key]: value } }); }

  function renderField(key: string, value: any) {
    if (typeof value === "boolean") {
      return (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={value} onChange={e => updateField(key, e.target.checked)} className="rounded" />
          <span className="text-sm capitalize" style={{ color: INK_L }}>{key.replace(/_/g," ")}</span>
        </label>
      );
    }
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="block text-xs font-medium mb-1" style={{ color: INK_L }}>{key.replace(/_/g," ")} (JSON)</label>
          <textarea value={JSON.stringify(value,null,2)}
            onChange={e => { try { updateField(key, JSON.parse(e.target.value)); } catch {} }}
            rows={6} className="w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none resize-y"
            style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
        </div>
      );
    }
    const isLong = key.includes("content")||key.includes("subtitle")||key.includes("text")||key.includes("bio")||key.includes("answer");
    return (
      <div key={key}>
        <label className="block text-xs font-medium mb-1" style={{ color: INK_L }}>{key.replace(/_/g," ")}</label>
        {isLong ? (
          <textarea value={value??""} onChange={e => updateField(key, e.target.value)} rows={3}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none"
            style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
        ) : (
          <input value={value??""} onChange={e => updateField(key, e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
        )}
      </div>
    );
  }

  const blockLabel = BLOCK_TYPES.find(b => b.type === block.type)?.label || block.type;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: open ? `1px solid ${BORDER}` : "none" }}>
        <GripVertical size={14} style={{ color: INK_XL }} />
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-2 text-left">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: "rgba(43,30,63,0.08)", color: "hsl(183,60%,40%)" }}>{block.type}</span>
          <span className="text-sm font-medium" style={{ color: INK }}>{blockLabel}</span>
          {content.title && <span className="text-xs truncate max-w-xs" style={{ color: INK_XL }}>— {content.title}</span>}
        </button>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1.5 rounded-lg disabled:opacity-30 transition-colors hover:opacity-70" style={{ color: INK_L }}><ChevronUp size={14} /></button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1.5 rounded-lg disabled:opacity-30 transition-colors hover:opacity-70" style={{ color: INK_L }}><ChevronDown size={14} /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: INK_XL }}><Trash2 size={14} /></button>
          <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: INK_L }}>{open ? <ChevronUp size={14} /> : <Settings size={14} />}</button>
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: INK_L }}>
            <input type="checkbox" checked={block.is_visible !== false} onChange={e => onChange({ ...block, is_visible: e.target.checked })} />
            Visible sur le site
          </label>
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

  useEffect(() => { if (!loading && !isAdmin) navigate("/admin/login"); }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin || !slug) return;
    async function load() {
      const { data: pageData } = await supabase.from("cms_pages").select("*").eq("slug", slug).single();
      if (pageData) setPage(pageData);
      const { data: blocksData } = await supabase.from("cms_blocks").select("*").eq("page_slug", slug).order("sort_order");
      setBlocks(blocksData ?? []); setLoadingData(false);
    }
    load();
  }, [isAdmin, slug]);

  function updateBlock(index: number, updated: any) { setBlocks(prev => prev.map((b,i) => i===index ? updated : b)); }
  function deleteBlock(index: number) { if (!confirm("Supprimer ce bloc ?")) return; setBlocks(prev => prev.filter((_,i) => i!==index)); }
  function moveBlock(index: number, direction: "up"|"down") {
    setBlocks(prev => {
      const arr = [...prev];
      const target = direction==="up" ? index-1 : index+1;
      if (target<0||target>=arr.length) return arr;
      [arr[index],arr[target]] = [arr[target],arr[index]];
      return arr;
    });
  }
  function addBlock(type: string) {
    setBlocks(prev => [...prev, { id:`new-${Date.now()}`, page_slug:slug, type, content:BLOCK_DEFAULTS[type]||{}, sort_order:prev.length+1, is_visible:true }]);
    setShowAddBlock(false);
  }

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    await supabase.from("cms_pages").update({ meta_title:page.meta_title, meta_description:page.meta_description, is_published:page.is_published, updated_at:new Date().toISOString() }).eq("slug", slug);
    await supabase.from("cms_blocks").delete().eq("page_slug", slug);
    const toInsert = blocks.map((b,i) => ({ page_slug:slug, type:b.type, content:b.content, sort_order:i+1, is_visible:b.is_visible!==false }));
    if (toInsert.length > 0) await supabase.from("cms_blocks").insert(toInsert);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    const { data: blocksData } = await supabase.from("cms_blocks").select("*").eq("page_slug", slug).order("sort_order");
    setBlocks(blocksData ?? []);
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: BG }} />;
  if (!page) return <AdminLayout><div className="p-8" style={{ color: INK_XL }}>Page introuvable</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="sticky top-0 z-30 flex items-center justify-between mb-6 py-3 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-3"
          style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3">
            <Link to="/admin/cms" style={{ color: INK_XL }} className="hover:opacity-70 transition-opacity"><ArrowLeft size={18} /></Link>
            <h1 className="text-lg font-bold" style={{ color: INK }}>{page.title}</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/${slug==="accueil" ? "" : slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: BG_CARD, color: INK_L }}>
              <Eye size={14} /> Aperçu
            </a>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 text-white btn-glow"
              style={{ background: "linear-gradient(135deg,hsl(183,70%,63%),hsl(284,65%,66%))" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "✓ Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-5 space-y-4 mb-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="text-sm font-bold" style={{ color: INK }}>SEO & Meta</h2>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>
              Meta title <span style={{ color: (page.meta_title?.length||0)>70?"hsl(0,70%,50%)":INK_XL }}>({page.meta_title?.length||0}/70)</span>
            </label>
            <input value={page.meta_title||""} onChange={e => setPage({...page,meta_title:e.target.value})}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>
              Meta description <span style={{ color: (page.meta_description?.length||0)>160?"hsl(0,70%,50%)":INK_XL }}>({page.meta_description?.length||0}/160)</span>
            </label>
            <textarea value={page.meta_description||""} onChange={e => setPage({...page,meta_description:e.target.value})}
              rows={3} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
              style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={page.is_published} onChange={e => setPage({...page,is_published:e.target.checked})} />
            <span className="text-sm" style={{ color: INK_L }}>Page publiée</span>
          </label>
        </div>

        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-bold" style={{ color: INK }}>Blocs de contenu ({blocks.length})</h2>
          {blocks.map((block,i) => (
            <BlockEditor key={block.id||i} block={block}
              onChange={(updated: any) => updateBlock(i,updated)}
              onDelete={() => deleteBlock(i)}
              onMoveUp={() => moveBlock(i,"up")}
              onMoveDown={() => moveBlock(i,"down")}
              isFirst={i===0} isLast={i===blocks.length-1} />
          ))}
        </div>

        {showAddBlock ? (
          <div className="rounded-2xl p-4" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold" style={{ color: INK }}>Choisir un type de bloc</h3>
              <button onClick={() => setShowAddBlock(false)} style={{ color: INK_XL }}><X size={16} /></button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} onClick={() => addBlock(bt.type)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:opacity-80"
                  style={{ background: BG_INPUT, color: INK_L }}>
                  <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(43,30,63,0.08)", color: "hsl(183,60%,40%)" }}>{bt.type}</span>
                  {bt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddBlock(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ border: `2px dashed ${BORDER_I}`, color: INK_XL }}>
            <Plus size={16} /> Ajouter un bloc
          </button>
        )}
      </div>
    </AdminLayout>
  );
}
