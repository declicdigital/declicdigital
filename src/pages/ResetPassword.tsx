import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase gère le token dans le hash automatiquement
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Erreur lors de la mise à jour. Réessayez.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/admin/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Nouveau mot de passe</h1>
          <p className="text-white/40 text-sm mt-1">Déclic Digital — Back-office</p>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Mot de passe mis à jour !</p>
            <p className="text-white/40 text-sm mt-1">Redirection en cours...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-9 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0f0f13] font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
