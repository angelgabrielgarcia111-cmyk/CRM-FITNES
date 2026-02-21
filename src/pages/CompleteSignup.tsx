import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, Dumbbell } from 'lucide-react';

const CompleteSignup = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkEmail = async () => {
      if (!emailFromUrl) {
        setChecking(false);
        return;
      }
      try {
        const { data } = await supabase.rpc('check_email_allowed', {
          check_email: emailFromUrl,
        });
        setAllowed(!!data);

        // Pre-fill name from students table
        if (data) {
          const { data: students } = await supabase
            .from('students')
            .select('name')
            .ilike('email', emailFromUrl)
            .limit(1);
          if (students && students.length > 0) {
            setName(students[0].name);
          }
        }
      } catch {
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };
    checkEmail();
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Erro', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailFromUrl,
        password,
        options: { data: { name, role: 'student' } },
      });
      if (error) throw error;

      // If auto-confirmed (invited user), sign in and link
      if (data.session) {
        // Link student record
        await supabase.rpc('link_student_user');
        navigate('/student', { replace: true });
        return;
      }

      // If email confirmation needed
      toast({
        title: 'Conta criada!',
        description: 'Verifique seu e-mail para confirmar o registro.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!emailFromUrl || !allowed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Atlon <span className="text-primary">PRO</span>
            </h1>
          </div>
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 space-y-3">
            <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-foreground font-medium">Acesso não autorizado</p>
            <p className="text-sm text-muted-foreground">
              Seu e-mail não foi convidado pelo treinador. Entre em contato com seu treinador para receber um convite.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/login', { replace: true })} className="w-full">
            Voltar ao login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Atlon <span className="text-primary">PRO</span>
          </h1>
          <p className="text-muted-foreground mt-2">Complete seu cadastro</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={emailFromUrl}
                disabled
                className="opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteSignup;
