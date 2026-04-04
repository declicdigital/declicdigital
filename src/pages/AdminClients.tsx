import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Users, FileText, LogOut, ChevronRight, Search } from "lucide-react";
import logoImg from "@/assets/logo-declic-digital-new.webp";
import AdminBar from "@/components/admin/AdminBar";

const AdminClients = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteProjectName, setInviteProjectName] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/connexion", { replace: true });
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) loadClients();
  }, [isAdmin]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "client");
      if (!roles || roles.length === 0) { setClients([]); setLoading(false); return; }

      const clientIds = roles.map((r: any) => r.user_id);
      const [{ data: profiles }, { data: projects }] = await Promise.all([
        supabase.from("profiles").select("*").in("id", clientIds),
        supabase.from("projects").select("*").in("client_id", clientIds),
      ]);

      const projectMap: Record<string, any> = {};
      (projects || []).forEach((p: any) => { projectMap[p.client_id] = p; });

      setClients((profiles || []).map((p: any) => ({
        id: p.id, email: p.email, full_name: p.full_name, created_at: p.created_at,
        project: projectMap[p.id] ? { id: projectMap[p.id].id, name: projectMap[p.id].name, status: projectMap[p.id].status } : undefined,
      })));
    } catch (err) {
      console.error("loadClients error:", err);
    }
    setLoading(false);
  };

  const inviteClient = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      toast({ title: "Erreur", description: "Email et nom sont requis.", variant: "destructive" });
      return;
    }
    setInviting(true);
    const { data, error } = await supabase.functions.invoke("invite-client", {
      body: { email: inviteEmail.trim(), full_name: inviteName.trim(), project_name: inviteProjectName.trim() || undefined },
    });
    setInviting(false);
    if (error || !data?.success) {
      toast({ title: "Erreur", description: data?.error || error?.message || "Impossible d'inviter ce client.", variant: "destructive" });
      return;
    }
    toast({ title: "Client invite", description: `Invitation envoyee a ${inviteEmail}.` });
    setDialogOpen(false);
    setInviteEmail(""); setInviteName(""); setInviteProjectName("");
    loadClients();
  };

  const filtered = clients.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminBar />
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex h-[4.5rem] md:h-20 items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0 -my-2">
            <img src={logoImg} alt="Declic Digital" className="h-14 md:h-16 w-auto object-contain" />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full hidden md:inline">ADMIN</span>
          </div>
          <nav className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/clients")} className="font-semibold text-primary px-2 md:px-3 text-xs md:text-sm">
              <Users className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Clients</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/soumissions")} className="px-2 md:px-3 text-xs md:text-sm">
              <FileText className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Formulaires</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="px-2 md:px-3 text-xs md:text-sm">
              <LogOut className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Deconnexion</span>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Clients ({clients.length})</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Inviter un client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Inviter un nouveau client</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Email du client *</Label>
                  <Input placeholder="client@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nom complet *</Label>
                  <Input placeholder="Jean Dupont" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nom du projet (optionnel)</Label>
                  <Input placeholder="Site vitrine entreprise" value={inviteProjectName} onChange={(e) => setInviteProjectName(e.target.value)} />
                </div>
                <Button onClick={inviteClient} disabled={inviting} className="w-full">
                  {inviting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Envoyer l'invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un client..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Aucun client pour le moment.</CardContent></Card>
          ) : filtered.map((client) => (
            <Card key={client.id} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate(`/admin/client/${client.id}`)}>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {client.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground truncate">{client.full_name}</p>
                    {client.project ? <Badge variant="secondary" className="text-xs shrink-0">{client.project.name}</Badge> : <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">Pas de projet</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminClients;
