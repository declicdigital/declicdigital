import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";
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
  const checkedUserIdRef = useRef<string | null>(null);

  const resolveAdminRole = useCallback(async (userId: string) => {
    if (checkedUserIdRef.current === userId) return;

    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    checkedUserIdRef.current = userId;
    setIsAdmin(!error && !!data);
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrapSession = async () => {
      setLoading(true);
      const { data: { session: initialSession } } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        checkedUserIdRef.current = null;
        await resolveAdminRole(initialSession.user.id);
      } else {
        setIsAdmin(false);
        checkedUserIdRef.current = null;
      }

      if (mounted) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        checkedUserIdRef.current = null;
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (event === "TOKEN_REFRESHED" && checkedUserIdRef.current === nextSession.user.id) {
        return;
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setLoading(true);
      }

      checkedUserIdRef.current = null;
      await resolveAdminRole(nextSession.user.id);

      if (mounted) setLoading(false);
    });

    bootstrapSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveAdminRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    checkedUserIdRef.current = null;
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
