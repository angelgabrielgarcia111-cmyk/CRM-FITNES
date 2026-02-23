import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthRedirect = () => {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, isTrainer, isStudent, loading: rolesLoading } = useRoles();
  const [triedAccept, setTriedAccept] = useState(false);
  const [finalRole, setFinalRole] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || rolesLoading || !session) return;

    // If user has no roles, try to accept a trainer invite
    if (!isAdmin && !isTrainer && !isStudent && !triedAccept) {
      const tryAccept = async () => {
        try {
          const { data } = await supabase.rpc('accept_trainer_invite');
          const result = data as any;
          if (result?.ok) {
            setFinalRole('trainer');
          }
        } catch {
          // no invite
        } finally {
          setTriedAccept(true);
        }
      };
      tryAccept();
    } else {
      setTriedAccept(true);
    }
  }, [authLoading, rolesLoading, session, isAdmin, isTrainer, isStudent, triedAccept]);

  if (authLoading || rolesLoading || !triedAccept) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  // Check roles (prioritize admin > trainer > student)
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isTrainer || finalRole === 'trainer') return <Navigate to="/dashboard" replace />;
  if (isStudent) return <Navigate to="/student" replace />;

  // No role at all — go to login
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
