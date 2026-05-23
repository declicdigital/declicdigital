import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ExternalLink, X, Check, Loader2, Upload } from "lucide-react";
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

interface Realisation {
  id: string; name: string; description: string; url: string;
  image_url: string; tags: string[]; ordre: number; visible: boolean; created_at: string;
}

const EMPTY: Omit<Realisation, "id"|"created_at"> = {
  name:"", description:"", url:"", image_url:"", tags:[], ordre:0, visible:true,
};

export default function AdminRealisations() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Realisation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState<Realisation|null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Realisation,"id"|"created_at">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!loading && !isAdmin) navigate("/admin/login"); }, [loading, isAdmin, navigate]);
  useEffect(() => { if (!isAdmin) return; fetchItems(); }, [isAdmin]);

  async function fetchItems() {
    const { data } = await supabase.from("realisations").select("*").order("ordre", { ascending: true });
    setItems(data ?? []); setLoadingData(false);
  }

  function openCreate() { setForm({ ...EMPTY, ordre: items.length }); setTagInput(""); setCreating(true); setEditing(null); }
  function openEdit(item: Realisation) {
    setForm({ name:item.name, description:item.description, url:item.url, image_url:item.image_url, tags:item.tags??[], ordre:item.ordre, visible:item.visible });
    setTagInput(""); setEditing(item); setCreating(false);
  }
  function closeForm() { setEditing(null); setCreating(false); setForm(EMPTY); setTagInput(""); }

  async function handleUpload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `realisations/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("form-files").upload(path, file, { upsert: true });
    if (!error) { const { data } = supabase.storage.from("form-files").getPublicUrl(path); setForm(f => ({ ...f, image_url: data.publicUrl })); }
    setUploading(false);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    if (creating) {
      const { data } = await supabase.from("realisations").insert(form).select().single();
      if (data) setItems(prev => [...prev, data]);
    } else if (editing) {
      const { data } = await supabase.from("realisations").update(form).eq("id", editing.id).select().single();
      if (data) setItems(prev => prev.map(i => i.id === editing.id ? data : i));
    }
    setSaving(false); closeForm();
  }

  async function toggleVisible(item: Realisation) {
    const { data } = await supabase.from("realisations").update({ visible: !item.visible }).eq("id", item.id).select().single();
    if (data) setItems(prev => prev.map(i => i.id === item.id ? data : i));
  }

  async function deleteItem(id: string) {
    if (!confirm("Supprimer cette réalisation ?")) return;
    await supabase.from("realisations").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function moveUp(idx: number) {
    if (idx === 0) return;
    const a = items[idx], b = items[idx-1];
    await supabase.from("realisations").update({ ordre: b.ordre }).eq("id", a.id);
    await supabase.from("realisations").update({ ordre: a.ordre }).eq("id", b.id);
    const newItems = [...items];
    newItems[idx] = { ...a, ordre: b.ordre }; newItems[idx-1] = { ...b, ordre: a.ordre };
    newItems.sort((x,y) => x.ordre - y.ordre); setItems(newItems);
  }

  async function moveDown(idx: number) {
    if (idx === items.length-1) return;
    const a = items[idx], b = items[idx+1];
    await supabase.from("realisations").update({ ordre: b.ordre }).eq("id", a.id);
    await supabase.from("realisations").update({ ordre: a.ordre }).eq("id", b.id);
    const newItems = [...items];
    newItems[idx] = { ...a, ordre: b.ordre }; newItems[idx+1] = { ...b, ordre: a.ordre };
    newItems.sort((x,y) => x.ordre - y.ordre); setItems(newItems);
  }

  function addTag() { const t = tagInput.trim(); if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] })); setTagInput(""); }
  function removeTag(tag: string) { setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) })); }

  if (loading) return <div className="min-h-screen" style={{ background: BG }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: INK }}>Réalisations</h1>
            <p className="text-sm mt-1" style={{ color: INK_XL }}>
              {items.length} projet{items.length > 1 ? "s" : ""} · affichés : {items.filter(i => i.visible).length}
            </p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-white btn-glow"
            style={{ background: "linear-gradient(135deg,hsl(183,70%,63%),hsl(284,65%,66%))" }}>
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {(creating || editing) && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: INK }}>
              {creating ? "Nouvelle réalisation" : `Modifier — ${editing?.name}`}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>Nom du projet *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Boulangerie Le Fournil"
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez brièvement le projet..." rows={3}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
                  style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>URL du site</label>
                <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://monprojet.fr"
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>Image</label>
                <div className="flex gap-3 items-start">
                  <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://... ou uploadez un fichier"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium shrink-0"
                    style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK_L }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Upload..." : "Fichier"}
                  </button>
                </div>
                {form.image_url && <img src={form.image_url} alt="preview" className="mt-3 rounded-xl object-cover w-full max-h-40" />}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: INK_L }}>Tags</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: "rgba(43,30,63,0.08)", color: INK_L }}>
                      {tag}<button onClick={() => removeTag(tag)}><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Ajouter un tag (Entrée)"
                    className="flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none"
                    style={{ background: BG_INPUT, border: `1px solid ${BORDER_I}`, color: INK }} />
                  <button onClick={addTag} className="px-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: BG_INPUT, color: INK_L }}><Plus size={14} /></button>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} className="sr-only" />
                  <div className="w-10 h-6 rounded-full transition-colors" style={{ background: form.visible ? "hsl(183,60%,40%)" : BORDER_I }} />
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: form.visible ? "translateX(16px)" : "translateX(0)" }} />
                </div>
                <span className="text-sm" style={{ color: INK_L }}>Visible sur le site</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving || !form.name.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 text-white btn-glow"
                  style={{ background: "linear-gradient(135deg,hsl(183,70%,63%),hsl(284,65%,66%))" }}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={closeForm} className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: BG_INPUT, color: INK_L }}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {loadingData ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: BG_CARD }} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: INK_XL }}>Aucune réalisation — cliquez sur "Ajouter" pour commencer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="rounded-2xl overflow-hidden flex items-center gap-4 px-4 py-3 transition-all"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}`, opacity: item.visible ? 1 : 0.5 }}>
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="disabled:opacity-20 transition-colors hover:opacity-70" style={{ color: INK_XL }}>
                    <GripVertical size={14} />
                  </button>
                </div>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-16 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-10 rounded-lg shrink-0" style={{ background: BG_INPUT }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: INK }}>{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags?.map(tag => (
                      <span key={tag} className="text-xs rounded-full px-2 py-0.5"
                        style={{ background: "rgba(43,30,63,0.08)", color: INK_L }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg transition-colors hover:opacity-70" style={{ color: INK_XL }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => toggleVisible(item)} className="p-2 rounded-lg transition-colors"
                    style={{ color: item.visible ? "hsl(183,60%,40%)" : INK_XL }}>
                    {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg transition-colors hover:opacity-70" style={{ color: INK_L }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-2 rounded-lg transition-colors hover:text-red-500" style={{ color: INK_XL }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
