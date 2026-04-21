import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, FileText, CheckSquare, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

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

  if (loading) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  const statCards = [
    { label: "Clients", value: stats.clients, icon: Users, to: "/admin/clients", color: "hsl(183,70%,63%)" },
    { label: "Projets actifs", value: stats.projets, icon: CheckSquare, to: "/admin/clients", color: "hsl(284,65%,66%)" },
    { label: "Tâches en cours", value: stats.tachesEnCours, icon: CheckSquare, to: "/admin/clients", color: "hsl(330,100%,70%)" },
    { label: "Nouvelles soumissions", value: stats.soumissionsNouvelles, icon: FileText, to: "/admin/soumissions", color: "hsl(183,70%,63%)" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Vue d'ensemble de votre activité</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <Link key={card.label} to={card.to}
              className="rounded-2xl p-5 transition-all group"
              style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <card.icon size={20} className="mb-3" style={{ color: card.color }} />
              <p className="text-3xl font-bold text-white">{loadingStats ? "—" : card.value}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Raccourcis */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/clients"
            className="rounded-2xl p-6 flex items-center justify-between group transition-all"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <Users size={20} className="mb-2" style={{ color: "hsl(183,70%,63%)" }} />
              <h3 className="font-semibold text-white">Fiches clients</h3>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Projets, tâches, messages, documents</p>
            </div>
            <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
          </Link>
          <Link to="/admin/soumissions"
            className="rounded-2xl p-6 flex items-center justify-between group transition-all"
            style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <FileText size={20} className="mb-2" style={{ color: "hsl(284,65%,66%)" }} />
              <h3 className="font-semibold text-white">Soumissions formulaire</h3>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Toutes les demandes reçues</p>
            </div>
            <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
