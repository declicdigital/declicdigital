import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";
import logoImg from "@/assets/logo-declic-transparent.png";

const Connexion = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? "/admin/clients" : "/espace-client", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Erreur", description: "Veuillez entrer votre email.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email envoye", description: "Consultez votre boite mail pour reinitialiser votre mot de passe." });
      setIsForgotPassword(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    } else if (!rememberMe) {
      // If not "remember me", we mark a flag so we can sign out on tab close
      sessionStorage.setItem("declic_session_only", "true");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-elevated border-border">
        <CardHeader className="text-center space-y-4">
          <img src={logoImg} alt="Declic Digital" className="h-10 mx-auto" />
          <CardTitle className="text-2xl font-bold text-foreground">
            {isForgotPassword ? "Mot de passe oublie" : "Espace Client"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isForgotPassword
              ? "Entrez votre email pour recevoir un lien de reinitialisation."
              : "Connectez-vous pour acceder a votre suivi de projet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Envoyer le lien
              </Button>
              <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                Retour a la connexion
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Rester connecte
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Se connecter
              </Button>
              <button type="button" onClick={() => setIsForgotPassword(true)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                Mot de passe oublie ?
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Connexion;
