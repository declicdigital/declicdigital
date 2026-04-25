import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminTarifs() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("cms_tarifs").select("*").order("sort_order").then(({ data }) => {
      setPlans(data ?? []);
      setLoadingData(false);
    });
  }, [isAdmin]);

  function update(i: number, field: string, value: any) {
    setPlans(prev => prev.map((p, j) => j === i ? { ...p, [field]: value } : p));
  }

  function updateFeatures(i: number, text: string) {
    const features = text.split("\n").filter(f => f.trim());
    update(i, "features", features);
  }

  function addPlan() {
    setPlans(prev => [...prev, {
      id: `new-${Date.now()}`,
      name: "Nouveau plan",
      monthly: "0",
      setup: "0",
      unit: "€/mois",
      description: "",
      highlighted: false,
      type: "creation",
      features: [],
      sort_order: prev.length + 1,
      is_visible: true,
    }]);
  }

  function deletePlan(i: number) {
    if (!confirm("Supprimer ce plan ?")) return;
    setPlans(prev => prev.filter((_, j) => j !== i));
  }

  function movePlan(i: number, dir: "up" | "down") {
    setPlans(prev => {
      const arr = [...prev];
      const t = dir === "up" ? i - 1 : i + 1;
      if (t < 0 || t >= arr.length) return arr;
      [arr[i], arr[t]] = [arr[t], arr[i]];
      return arr;
    });
  }

  async function handleSave() {
    setSaving(true);
    // Supprimer tous les plans existants
    await supabase.from("cms_tarifs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    // Réinsérer
    const toInsert = plans.map((p, i) => ({
      name: p.name,
      monthly: p.monthly,
      setup: p.setup,
      unit: p.unit,
      description: p.description,
      highlighted: p.highlighted,
      type: p.type,
      features: Array.isArray(p.features) ? p.features : [],
      sort_order: i + 1,
      is_visible: p.is_visible !== false,
      updated_at: new Date().toISOString(),
    }));
    if (toInsert.length > 0) await supabase.from("cms_tarifs").insert(toInsert);
    // Recharger
    const { data } = await supabase.from("cms_tarifs").select("*").order("sort_order");
    setPlans(data ?? []);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Header sticky */}
        <div className="sticky top-0 z-30 flex items-center justify-between mb-6 py-3 -mx-6 px-6 md:-mx-8 md:px-8 flex-wrap gap-3"
          style={{ background: "hsl(263, 36%, 10%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="text-xl font-bold text-white">Gestion des tarifs</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Les modifications s'affichent immédiatement sur le site</p>
          </div>
          <div className="flex gap-2">
            <a href="/tarifs" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
              ↗ Voir la page
            </a>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 btn-glow"
              style={{ background: "linear-gradient(135deg, hsl(183,70%,63%), hsl(284,65%,66%))", color: "white" }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "✓ Sauvegardé" : "Sauvegarder"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {plans.map((plan, i) => (
            <div key={plan.id || i} className="rounded-2xl p-5 space-y-4"
              style={{ background: "hsl(263, 36%, 13%)", border: plan.highlighted ? "2px solid hsl(183,70%,63%)" : "1px solid rgba(255,255,255,0.07)" }}>

              {/* Header du plan */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {plan.highlighted && <Star size={14} style={{ color: "hsl(183,70%,63%)" }} />}
                  <span className="font-bold text-white">{plan.name || "Nouveau plan"}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)" }}>
                    {plan.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => movePlan(i, "up")} disabled={i === 0} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => movePlan(i, "down")} disabled={i === plans.length - 1} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => deletePlan(i)} className="p-1.5 rounded-lg hover:bg-red-500/20" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Nom */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Nom du plan</label>
                  <input value={plan.name} onChange={e => update(i, "name", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Type</label>
                  <select value={plan.type} onChange={e => update(i, "type", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <option value="creation" className="bg-[#1a1020]">Création de site</option>
                    <option value="seo" className="bg-[#1a1020]">SEO / GEO</option>
                  </select>
                </div>

                {/* Prix mensuel */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Prix mensuel (€/mois)</label>
                  <input value={plan.monthly} onChange={e => update(i, "monthly", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>

                {/* Setup */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Première mensualité (€)</label>
                  <input value={plan.setup} onChange={e => update(i, "setup", e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>Description</label>
                <textarea value={plan.description} onChange={e => update(i, "description", e.target.value)} rows={2}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Fonctionnalités <span style={{ color: "rgba(255,255,255,0.25)" }}>(une par ligne)</span>
                </label>
                <textarea
                  value={Array.isArray(plan.features) ? plan.features.join("\n") : ""}
                  onChange={e => updateFeatures(i, e.target.value)}
                  rows={6}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={plan.highlighted} onChange={e => update(i, "highlighted", e.target.checked)} />
                  <span className="text-sm text-white">⭐ Populaire (mis en avant)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={plan.is_visible !== false} onChange={e => update(i, "is_visible", e.target.checked)} />
                  <span className="text-sm text-white">Visible sur le site</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Ajouter un plan */}
        <button onClick={addPlan}
          className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-2xl text-sm font-semibold transition-all hover:border-white/20"
          style={{ border: "2px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)" }}>
          <Plus size={16} /> Ajouter un plan tarifaire
        </button>
      </div>
    </AdminLayout>
  );
}
