import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, CheckSquare, MessageSquare, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";

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
      setStats({
        clients: clients ?? 0,
        projets: projets ?? 0,
        tachesEnCours: taches ?? 0,
        soumissionsNouvelles: soumissions ?? 0,
      });
      setLoadingStats(false);
    }
    fetchStats();
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen bg-[#0f0f13]" />;

  const statCards = [
    { label: "Clients", value: stats.clients, icon: Users, to: "/admin/clients", color: "text-blue-400" },
    { label: "Projets actifs", value: stats.projets, icon: CheckSquare, to: "/admin/clients", color: "text-green-400" },
    { label: "Tâches en cours", value: stats.tachesEnCours, icon: CheckSquare, to: "/admin/clients", color: "text-amber-400" },
    { label: "Nouvelles soumissions", value: stats.soumissionsNouvelles, icon: FileText, to: "/admin/soumissions", color: "text-purple-400" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-white/40 text-sm mt-1">Vue d'ensemble de votre activité</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors group"
            >
              <div className={`${card.color} mb-3`}>
                <card.icon size={20} />
              </div>
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "—" : card.value}
              </p>
              <p className="text-white/40 text-xs mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Raccourcis */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/admin/clients"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors group flex items-center justify-between"
          >
            <div>
              <Users size={20} className="text-blue-400 mb-2" />
              <h3 className="font-semibold text-white">Fiches clients</h3>
              <p className="text-white/40 text-sm mt-1">Projets, tâches, messages, documents</p>
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
          </Link>

          <Link
            to="/admin/soumissions"
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors group flex items-center justify-between"
          >
            <div>
              <FileText size={20} className="text-purple-400 mb-2" />
              <h3 className="font-semibold text-white">Soumissions formulaire</h3>
              <p className="text-white/40 text-sm mt-1">Toutes les demandes reçues</p>
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
