import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, FileText, CheckSquare, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const INK = "#2B1E3F";
const INK_L = "rgba(43,30,63,0.50)";
const INK_XL = "rgba(43,30,63,0.30)";
const BG = "#F6F1E9";
const BG_CARD = "#EDE8DF";
const BORDER = "rgba(43,30,63,0.09)";

interface Stats {
  clients: number;
  projets: number;
  tachesEnCours: number;
  soumissionsNouvelles: number;
}

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ clients: 0, projets: 0, tachesEnCours: 0, soumissionsNouvelles: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => { if (!loading && !isAdmin) navigate("/admin/login"); }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    async function fetchStats() {
      const [{ count: clients }, { count: projets }, { count: taches }, { count: soumissions }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("project_tasks").select("*", { count: "exact", head: true }).in("status", ["a_faire", "en_cours", "a_faire_dd", "a_faire_client"]),
        supabase.from("form_submissions").select("*", { count: "exact", head: true }).eq("status", "en_attente"),
      ]);
      setStats({ clients: clients ?? 0, projets: projets ?? 0, tachesEnCours: taches ?? 0, soumissionsNouvelles: soumissions ?? 0 });
      setLoadingStats(false);
    }
    fetchStats();
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen" style={{ background: BG }} />;

  const statCards = [
    { label: "Clients", value: stats.clients, icon: Users, to: "/admin/clients", color: "hsl(183,60%,40%)" },
    { label: "Projets actifs", value: stats.projets, icon: CheckSquare, to: "/admin/clients", color: "hsl(284,55%,50%)" },
    { label: "Tâches en cours", value: stats.tachesEnCours, icon: CheckSquare, to: "/admin/clients", color: "hsl(330,80%,55%)" },
    { label: "Nouvelles soumissions", value: stats.soumissionsNouvelles, icon: FileText, to: "/admin/soumissions", color: "hsl(183,60%,40%)" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: INK }}>Tableau de bord</h1>
          <p className="text-sm mt-1" style={{ color: INK_XL }}>Vue d'ensemble de votre activité</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <Link key={card.label} to={card.to}
              className="rounded-2xl p-5 transition-all"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
              <card.icon size={20} className="mb-3" style={{ color: card.color }} />
              <p className="text-3xl font-bold" style={{ color: INK }}>{loadingStats ? "—" : card.value}</p>
              <p className="text-xs mt-1" style={{ color: INK_XL }}>{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/clients"
            className="rounded-2xl p-6 flex items-center justify-between transition-all"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div>
              <Users size={20} className="mb-2" style={{ color: "hsl(183,60%,40%)" }} />
              <h3 className="font-semibold" style={{ color: INK }}>Fiches clients</h3>
              <p className="text-sm mt-1" style={{ color: INK_XL }}>Projets, tâches, messages, documents</p>
            </div>
            <ArrowRight size={16} style={{ color: INK_XL }} />
          </Link>
          <Link to="/admin/soumissions"
            className="rounded-2xl p-6 flex items-center justify-between transition-all"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
            <div>
              <FileText size={20} className="mb-2" style={{ color: "hsl(284,55%,50%)" }} />
              <h3 className="font-semibold" style={{ color: INK }}>Soumissions formulaire</h3>
              <p className="text-sm mt-1" style={{ color: INK_XL }}>Toutes les demandes reçues</p>
            </div>
            <ArrowRight size={16} style={{ color: INK_XL }} />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
