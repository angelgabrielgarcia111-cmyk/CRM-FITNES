import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'trainer' | 'student' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const fetchRole = async (userId: string): Promise<AppRole> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      console.log('[useAuth] fetchRole result:', { data, error });
      return (data?.role as AppRole) ?? null;
    } catch (err) {
      console.error('[useAuth] fetchRole exception:', err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1) Initial load
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        console.log('[useAuth] getSession:', { userId: session?.user?.id });

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const r = await fetchRole(session.user.id);
          if (isMounted) setRole(r);
        }
      } finally {
        if (isMounted) {
          initialized.current = true;
          setLoading(false);
          console.log('[useAuth] initialized, loading=false');
        }
      }
    };

    initialize();

    // 2) Ongoing auth changes — do NOT touch loading
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!isMounted || !initialized.current) return;
        console.log('[useAuth] onAuthStateChange:', _event, newSession?.user?.id);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            if (!isMounted) return;
            const r = await fetchRole(newSession.user.id);
            if (isMounted) setRole(r);
          }, 0);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  console.log('[useAuth] render:', { loading, role, userId: user?.id });

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
