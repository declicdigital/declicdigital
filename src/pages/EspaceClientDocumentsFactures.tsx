import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EspaceClientLayout from "@/components/client/EspaceClientLayout";
import { useClientAuth } from "@/hooks/useClientAuth";

export function EspaceClientDocuments() {
  const { user, loading } = useClientAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/connexion");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? []);
        if (data && data.length > 0) setSelectedProject(data[0].id);
        setLoadingData(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    supabase.from("project_documents").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false })
      .then(({ data }) => setDocuments(data ?? []));
  }, [selectedProject]);

  async function downloadDocument(doc: any) {
    const { data } = await supabase.storage.from("project-documents").createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <EspaceClientLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Fichiers partagés par Déclic Digital</p>
        </div>

        {projects.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={selectedProject === p.id ? { background: "rgba(255,255,255,0.12)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {documents.length === 0 ? (
          <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.30)" }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucun document partagé pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-2xl p-4 flex items-center justify-between gap-3"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} style={{ color: "rgba(255,255,255,0.30)" }} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white/80 truncate">{doc.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
                      {new Date(doc.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <button onClick={() => downloadDocument(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", color: "hsl(183,70%,63%)" }}>
                  <Download size={13} /> Télécharger
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </EspaceClientLayout>
  );
}

export function EspaceClientFactures() {
  const { user, loading } = useClientAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/connexion");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? []);
        if (data && data.length > 0) setSelectedProject(data[0].id);
        setLoadingData(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    supabase.from("project_invoices").select("*").eq("project_id", selectedProject).order("created_at", { ascending: false })
      .then(({ data }) => setInvoices(data ?? []));
  }, [selectedProject]);

  if (loading || loadingData) return <div className="min-h-screen" style={{ background: "hsl(263, 36%, 10%)" }} />;

  return (
    <EspaceClientLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Factures</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Vos devis et factures</p>
        </div>

        {projects.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={selectedProject === p.id ? { background: "rgba(255,255,255,0.12)", color: "white" } : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)" }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-16" style={{ color: "rgba(255,255,255,0.30)" }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucune facture pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "hsl(263, 36%, 13%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <p className="text-sm font-semibold text-white">{inv.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {new Date(inv.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  {inv.amount && <p className="text-sm font-bold text-white">{inv.amount}€</p>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "payé" ? "bg-green-400/15 text-green-300" : "bg-amber-400/15 text-amber-300"}`}>
                    {inv.status ?? "En attente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EspaceClientLayout>
  );
}
