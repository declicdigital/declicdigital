import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Loader2, Receipt } from "lucide-react";

interface Invoice {
  id: string;
  name: string;
  type: string;
  file_path: string;
  amount: number | null;
  status: string;
  created_at: string;
}

interface ProjectInvoicesProps {
  invoices: Invoice[];
  projectId: string;
  userId: string;
  onRefresh: () => void;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-amber-500/10 text-amber-600 border-0" },
  payee: { label: "Payee", className: "bg-emerald-500/10 text-emerald-600 border-0" },
  envoyee: { label: "Envoyee", className: "bg-primary/10 text-primary border-0" },
};

const TYPE_LABELS: Record<string, string> = {
  facture: "Facture",
  devis: "Devis",
  avoir: "Avoir",
};

const ProjectInvoices = ({ invoices, projectId, userId, onRefresh }: ProjectInvoicesProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadInvoice = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `${projectId}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("project-invoices").upload(path, file);
    if (upErr) {
      toast({ title: "Erreur", description: upErr.message, variant: "destructive" });
    } else {
      await (supabase.from("project_invoices") as any).insert({
        project_id: projectId,
        name: file.name,
        type: "devis",
        file_path: path,
        uploaded_by: userId,
      });
      toast({ title: "Fichier ajoute" });
      onRefresh();
    }
    setUploading(false);
    e.target.value = "";
  };

  const downloadInvoice = async (path: string) => {
    const { data } = await supabase.storage.from("project-invoices").createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-primary" />
            Factures & Devis ({invoices.length})
          </CardTitle>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                Envoyer un fichier
              </span>
            </Button>
            <input type="file" className="hidden" onChange={uploadInvoice} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" />
          </label>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {invoices.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune facture ou devis pour le moment.</p>
        ) : (
          invoices.map((inv) => {
            const statusCfg = STATUS_LABELS[inv.status] || STATUS_LABELS.en_attente;
            return (
              <button
                key={inv.id}
                onClick={() => downloadInvoice(inv.file_path)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left"
              >
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{inv.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {TYPE_LABELS[inv.type] || inv.type}
                    </span>
                    {inv.amount != null && (
                      <span className="text-xs font-medium text-foreground">{inv.amount.toFixed(2)} EUR</span>
                    )}
                    <Badge variant="secondary" className={`text-xs ${statusCfg.className}`}>
                      {statusCfg.label}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(inv.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectInvoices;
