import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AuthRedirect = () => {
  const { session, role, loading } = useAuth();
  console.log('[AuthRedirect]', { role, loading, hasSession: !!session });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'student') {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default AuthRedirect;
