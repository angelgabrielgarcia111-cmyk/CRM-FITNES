import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert, Dumbbell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('student_id') || '';
  const emailParam = searchParams.get('email') || '';

  const [status, setStatus] = useState<'loading' | 'no_tokens' | 'unauthorized' | 'linking' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const run = async () => {
      try {
        // 1) Check for tokens in the URL hash (Supabase invite link puts them there)
        const hash = window.location.hash;
        console.log('[StudentComplete] hash:', hash);

        if (!hash || !hash.includes('access_token')) {
          // Maybe already has a session (e.g. page refresh after setSession)
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setStatus('no_tokens');
            return;
          }
          // Has session, continue to link
        } else {
          // 2) Extract tokens from hash
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (!accessToken || !refreshToken) {
            setStatus('no_tokens');
            return;
          }

          // 3) Set session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('[StudentComplete] setSession error:', sessionError);
            setErrorMsg(sessionError.message);
            setStatus('error');
            return;
          }
        }

        // 4) Verify user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setStatus('unauthorized');
          return;
        }

        // 5) Validate email matches if provided
        if (emailParam && user.email?.toLowerCase() !== emailParam.toLowerCase()) {
          console.warn('[StudentComplete] email mismatch:', user.email, emailParam);
          setStatus('unauthorized');
          return;
        }

        // 6) Link student record via RPC
        setStatus('linking');
        const { data: linkResult, error: linkError } = await supabase.rpc('link_student_user');

        if (linkError) {
          console.error('[StudentComplete] link_student_user error:', linkError);
          setErrorMsg(linkError.message);
          setStatus('error');
          return;
        }

        console.log('[StudentComplete] link result:', linkResult);

        const result = linkResult as any;
        if (result?.ok && result?.linked) {
          // Success — redirect to student area
          navigate('/student', { replace: true });
          return;
        }

        if (result?.ok && !result?.linked) {
          // No matching student record
          setStatus('unauthorized');
          return;
        }

        // Fallback — try redirect anyway if session exists
        navigate('/student', { replace: true });

      } catch (err: any) {
        console.error('[StudentComplete] unexpected error:', err);
        setErrorMsg(err?.message || 'Erro inesperado');
        setStatus('error');
      }
    };

    run();
  }, [navigate, emailParam, studentId]);

  // --- Renders ---

  if (status === 'loading' || status === 'linking') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          {status === 'linking' ? 'Vinculando sua conta...' : 'Processando convite...'}
        </p>
      </div>
    );
  }

  if (status === 'no_tokens') {
    return (
      <PageShell>
        <AlertTriangle className="h-8 w-8 text-warning mx-auto" />
        <p className="text-foreground font-medium">Link inválido ou expirado</p>
        <p className="text-sm text-muted-foreground">
          Solicite um novo convite ao seu treinador.
        </p>
        <Button variant="outline" onClick={() => navigate('/login', { replace: true })} className="w-full">
          Voltar ao login
        </Button>
      </PageShell>
    );
  }

  if (status === 'unauthorized') {
    return (
      <PageShell>
        <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-foreground font-medium">Acesso não autorizado</p>
        <p className="text-sm text-muted-foreground">
          Seu e-mail não foi convidado pelo treinador. Entre em contato com seu treinador para receber um convite.
        </p>
        <Button variant="outline" onClick={() => navigate('/login', { replace: true })} className="w-full">
          Voltar ao login
        </Button>
      </PageShell>
    );
  }

  // error
  return (
    <PageShell>
      <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
      <p className="text-foreground font-medium">Erro ao processar convite</p>
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

export default StudentComplete;
