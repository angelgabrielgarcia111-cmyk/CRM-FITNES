import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert, Dumbbell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'no_tokens' | 'unauthorized' | 'linking' | 'error' | 'otp_expired';

const StudentComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('student_id') || '';
  const emailParam = searchParams.get('email') || '';

  // Supabase may put errors in query params when the link fails
  const errorParam = searchParams.get('error') || '';
  const errorDescParam = searchParams.get('error_description') || '';
  const errorCodeParam = searchParams.get('error_code') || '';

  // PKCE code
  const codeParam = searchParams.get('code') || '';

  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const run = async () => {
      try {
        // 0) Check for Supabase error params (e.g. otp_expired, access_denied)
        if (errorParam) {
          console.warn('[StudentComplete] Supabase error in URL:', errorParam, errorCodeParam, errorDescParam);
          if (errorCodeParam === 'otp_expired' || errorDescParam?.includes('expired')) {
            setStatus('otp_expired');
          } else {
            setErrorMsg(errorDescParam || errorParam);
            setStatus('error');
          }
          return;
        }

        const hash = window.location.hash;
        console.log('[StudentComplete] hash:', hash, 'code:', codeParam);

        let sessionEstablished = false;

        // A) PKCE flow: ?code=XXX
        if (codeParam) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(codeParam);
          if (codeError) {
            console.error('[StudentComplete] exchangeCodeForSession error:', codeError);
            setErrorMsg(codeError.message);
            setStatus('error');
            return;
          }
          sessionEstablished = true;
        }
        // B) Implicit flow: #access_token=...&refresh_token=...
        else if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (!accessToken || !refreshToken) {
            setStatus('no_tokens');
            return;
          }

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
          sessionEstablished = true;
        }

        // C) Maybe already has a session (page refresh)
        if (!sessionEstablished) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setStatus('no_tokens');
            return;
          }
        }

        // Verify user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setStatus('unauthorized');
          return;
        }

        // Validate email matches if provided
        if (emailParam && user.email?.toLowerCase() !== emailParam.toLowerCase()) {
          console.warn('[StudentComplete] email mismatch:', user.email, emailParam);
          setStatus('unauthorized');
          return;
        }

        // Link student record via RPC
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
          navigate('/student', { replace: true });
          return;
        }

        if (result?.ok && !result?.linked) {
          setStatus('unauthorized');
          return;
        }

        // Fallback
        navigate('/student', { replace: true });

      } catch (err: any) {
        console.error('[StudentComplete] unexpected error:', err);
        setErrorMsg(err?.message || 'Erro inesperado');
        setStatus('error');
      }
    };

    run();
  }, [navigate, emailParam, studentId, codeParam, errorParam, errorCodeParam, errorDescParam]);

  // --- Renders ---

  if (status === 'loading' || status === 'linking') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          {status === 'linking' ? 'Vinculando sua conta...' : 'Confirmando convite...'}
        </p>
      </div>
    );
  }

  if (status === 'otp_expired') {
    return (
      <PageShell>
        <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
        <p className="text-foreground font-medium">Link expirado</p>
        <p className="text-sm text-muted-foreground">
          O link do convite expirou. Solicite um novo convite ao seu treinador.
        </p>
        <Button variant="outline" onClick={() => navigate('/login', { replace: true })} className="w-full">
          Voltar ao login
        </Button>
      </PageShell>
    );
  }

  if (status === 'no_tokens') {
    return (
      <PageShell>
        <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
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
