import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRole: 'trainer' | 'student';
}

const RoleRoute = ({ children, allowedRole }: RoleRouteProps) => {
  const { session, role, loading } = useAuth();
  console.log('[RoleRoute]', { allowedRole, role, loading, hasSession: !!session });

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

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Erro de acesso</h1>
          <p className="text-muted-foreground">Não foi possível determinar seu perfil. Entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  if (role !== allowedRole) {
    const redirect = role === 'trainer' ? '/dashboard' : '/student';
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
