import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, ArrowRight, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Client {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  projectCount?: number;
}

export default function AdminClients() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    async function fetchClients() {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (!profiles) { setLoadingData(false); return; }

      // Compter les projets par client
      const clientsWithProjects = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("client_id", profile.id);
          return { ...profile, projectCount: count ?? 0 };
        })
      );

      setClients(clientsWithProjects);
      setLoadingData(false);
    }
    fetchClients();
  }, [isAdmin]);

  const filtered = clients.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-[#0f0f13]" />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-white/40 text-sm mt-1">{clients.length} client{clients.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-9 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => (
              <Link
                key={client.id}
                to={`/admin/clients/${client.id}`}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/8 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/60">
                    {client.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{client.full_name || "—"}</p>
                    <p className="text-white/40 text-sm">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-sm hidden sm:block">
                    {client.projectCount} projet{(client.projectCount ?? 0) > 1 ? "s" : ""}
                  </span>
                  <ArrowRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
