import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShieldAlert, Dumbbell, CheckCircle2 } from 'lucide-react';

const CompleteSignup = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student_id') || '';
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<'checking' | 'linking' | 'success' | 'error' | 'no_session'>('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;

    // No session → redirect to login preserving params
    if (!session) {
      const redirectTo = `/student/complete-signup?student_id=${studentId}&token=${token}`;
      navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`, { replace: true });
      return;
    }

    // No student_id or token → can't validate
    if (!studentId || !token) {
      setErrorMsg('Link de convite inválido. Solicite um novo convite ao seu treinador.');
      setStatus('error');
      return;
    }

    const linkStudent = async () => {
      setStatus('linking');
      try {
        const { data, error } = await supabase.rpc('link_student_user', {
          _student_id: studentId,
          _token: token,
        } as any);

        if (error) {
          console.error('[CompleteSignup] RPC error:', error);
          setErrorMsg(error.message);
          setStatus('error');
          return;
        }

        const result = data as any;
        if (result?.ok && result?.linked) {
          setStatus('success');
          toast({ title: 'Conta vinculada!', description: 'Bem-vindo ao Atlon PRO!' });
          setTimeout(() => navigate('/student', { replace: true }), 1500);
          return;
        }

        setErrorMsg(result?.message || 'Não foi possível vincular sua conta.');
        setStatus('error');
      } catch (err: any) {
        setErrorMsg(err?.message || 'Erro inesperado');
        setStatus('error');
      }
    };

    linkStudent();
  }, [authLoading, session, studentId, token, navigate, toast]);

  if (authLoading || status === 'checking' || status === 'linking') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          {status === 'linking' ? 'Vinculando sua conta...' : 'Verificando...'}
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <PageShell>
        <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
        <p className="text-foreground font-medium">Conta vinculada com sucesso!</p>
        <p className="text-sm text-muted-foreground">Redirecionando para o portal...</p>
      </PageShell>
    );
  }

  // Error
  return (
    <PageShell>
      <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
      <p className="text-foreground font-medium">Erro ao vincular conta</p>
      <p className="text-sm text-muted-foreground">{errorMsg}</p>
      <Button variant="outline" onClick={() => navigate('/login', { replace: true })} className="w-full">
        Voltar ao login
      </Button>
    </PageShell>
  );
};

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-6 text-center">
      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dumbbell className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Atlon <span className="text-primary">PRO</span>
        </h1>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        {children}
      </div>
    </div>
  </div>
);

export default CompleteSignup;
