import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert, Dumbbell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Status = 'loading' | 'no_tokens' | 'unauthorized' | 'linking' | 'error' | 'otp_expired' | 'set_password';

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
  const [password, setPasswordVal] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [studentName, setStudentName] = useState('');
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
        if (result?.ok && result?.linked && !result?.already_linked) {
          // Newly linked — show password form
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setStudentName(currentUser?.user_metadata?.name || '');
          setStatus('set_password');
          return;
        }

        if (result?.ok && result?.linked && result?.already_linked) {
          // Already set up — go straight to dashboard
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem');
      return;
    }
    setSettingPassword(true);
    setErrorMsg('');
    const { error } = await supabase.auth.updateUser({
      password,
      data: { name: studentName || undefined },
    });
    if (error) {
      setErrorMsg(error.message);
      setSettingPassword(false);
      return;
    }
    navigate('/student', { replace: true });
  };

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

  if (status === 'set_password') {
    return (
      <PageShell>
        <p className="text-foreground font-medium text-lg">Bem-vindo ao Atlon PRO!</p>
        <p className="text-sm text-muted-foreground">
          Defina sua senha para acessar sua conta.
        </p>
        <form onSubmit={handleSetPassword} className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="student-name">Nome</Label>
            <Input
              id="student-name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Senha</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPasswordVal(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar senha</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          {errorMsg && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
          <Button type="submit" className="w-full" disabled={settingPassword}>
            {settingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar senha e acessar
          </Button>
        </form>
      </PageShell>
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
