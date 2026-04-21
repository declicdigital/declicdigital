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
      const { data: profiles } = await supabase.from("profiles").select("id, email, full_name, created_at").order("created_at", { ascending: false });
      if (!profiles) { setLoadingData(false); return; }
      const clientsWithProjects = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("client_id", profile.id);
          return { ...profile, projectCount: count ?? 0 };
        })
      );
      setClients(clientsWithProjects);
      setLoadingData(false);
    }
    fetchClients();
  }, [isAdmin]);

  const filtered = clients.filter(
    (c) => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{clients.length} client{clients.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)" }} />
          <input type="text" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl px-4 pl-9 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
        </div>

        {loadingData ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: "hsl(263, 36%, 13%)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={32} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p style={{ color: "rgba(255,255,255,0.35)" }}>Aucun client trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => (
              <Link key={client.id} to={`/admin/clients/${client.id}`}
                className="rounded-2xl p-5 flex items-center justify-between group transition-all"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, hsl(183,70%,63%,0.2), hsl(284,65%,66%,0.2))", color: "hsl(183,70%,63%)" }}>
                    {client.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{client.full_name || "—"}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm hidden sm:block" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {client.projectCount} projet{(client.projectCount ?? 0) > 1 ? "s" : ""}
                  </span>
                  <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
