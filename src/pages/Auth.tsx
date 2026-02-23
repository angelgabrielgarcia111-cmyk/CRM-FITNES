import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') || '';

  const { session, role, loading: authLoading } = useAuth();

  // If there's a redirectTo with student invite params, pre-fill email
  useEffect(() => {
    if (!redirectTo) return;
    try {
      const url = new URL(redirectTo, window.location.origin);
      const studentId = url.searchParams.get('student_id');
      const token = url.searchParams.get('token');
      if (studentId && token) {
        // Fetch student email from the student record
        const fetchEmail = async () => {
          const { data } = await supabase
            .from('students')
            .select('email, name')
            .eq('id', studentId)
            .limit(1);
          if (data && data.length > 0 && data[0].email) {
            setEmail(data[0].email);
            setEmailLocked(true);
            if (data[0].name) setName(data[0].name);
            setIsLogin(false); // Default to register for new students
          }
        };
        fetchEmail();
      }
    } catch {
      // invalid redirectTo
    }
  }, [redirectTo]);

  // If already logged in, redirect
  if (session && !authLoading) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    if (role === 'student') return <Navigate to="/student" replace />;
    if (role === 'trainer') return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBlocked(false);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // If there's a redirectTo, go there after login
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
          return;
        }

        const userId = data.user.id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profile?.role === 'trainer') {
          navigate('/dashboard', { replace: true });
          return;
        }
        if (profile?.role === 'student') {
          await supabase.rpc('link_student_user');
          navigate('/student', { replace: true });
          return;
        }

        const { data: allowed } = await supabase.rpc('check_email_allowed', {
          check_email: email,
        });

        if (allowed) {
          await supabase.from('profiles').upsert({
            id: userId,
            role: 'student',
            name: data.user.user_metadata?.name || '',
          });
          await supabase.rpc('link_student_user');
          navigate('/student', { replace: true });
        } else {
          await supabase.auth.signOut();
          setBlocked(true);
        }
      } else {
        // Sign up — check allowlist first
        const { data: allowed } = await supabase.rpc('check_email_allowed', {
          check_email: email,
        });

        if (!allowed) {
          setBlocked(true);
          return;
        }

        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role: 'student' } },
        });
        if (error) throw error;

        // If auto-confirmed, redirect
        if (data.session && redirectTo) {
          navigate(redirectTo, { replace: true });
          return;
        }
        if (data.session) {
          await supabase.rpc('link_student_user');
          navigate('/student', { replace: true });
          return;
        }

        toast({
          title: 'Conta criada!',
          description: 'Verifique seu e-mail para confirmar o registro.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Atlon <span className="text-primary">PRO</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {blocked && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Acesso não autorizado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Seu e-mail não foi convidado pelo treinador. Entre em contato com seu treinador para receber um convite.
              </p>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              onClick={() => { setIsLogin(true); setBlocked(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setBlocked(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Registrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => !emailLocked && setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={emailLocked}
                className={emailLocked ? 'opacity-70' : ''}
              />
              {emailLocked && (
                <p className="text-xs text-muted-foreground">
                  E-mail definido pelo convite do treinador.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
