import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let resolved = false;

    const resolve = () => {
      if (mounted && !resolved) {
        resolved = true;
        setLoading(false);
      }
    };

    // Safety: never loading more than 3s
    const timer = setTimeout(resolve, 3000);

    const handleSession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        try {
          const { data } = await supabase.rpc("has_role", {
            _user_id: s.user.id,
            _role: "admin",
          });
          if (mounted) setIsAdmin(!!data);
        } catch {
          if (mounted) setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      if (mounted) {
        resolved = true;
        setLoading(false);
      }
    };

    // 1. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => { handleSession(s); }
    );

    // 2. Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!resolved) handleSession(s);
    }).catch(() => resolve());

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
