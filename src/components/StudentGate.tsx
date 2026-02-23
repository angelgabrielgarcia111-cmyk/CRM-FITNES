import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const StudentGate = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }

    const check = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('id, status')
          .eq('user_id', user.id)
          .limit(1);

        if (!error && data && data.length > 0 && data[0].status === 'active') {
          setLinked(true);
        }
      } catch {
        // not linked
      } finally {
        setChecking(false);
      }
    };

    check();
  }, [user?.id]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (!linked) return <Navigate to="/student/complete-signup" replace />;

  return <>{children}</>;
};

export default StudentGate;
