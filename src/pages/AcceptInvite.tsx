import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

type Step = 'loading' | 'no-session' | 'linking' | 'done' | 'error';

const AcceptInvite = () => {
  const [step, setStep] = useState<Step>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Check session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[accept-invite] session found:', !!session, session?.user?.id);

        if (!session?.user) {
          setStep('no-session');
          return;
        }

        const user = session.user;
        setStep('linking');

        // 2) Ensure profile exists with role=student
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Profile should be created by trigger, but just in case
          console.log('[accept-invite] no profile found, trigger should have created it');
        } else if (profile.role !== 'student') {
          await supabase
            .from('profiles')
            .update({ role: 'student' })
            .eq('id', user.id);
          console.log('[accept-invite] profiles upsert ok - updated role to student');
        } else {
          console.log('[accept-invite] profiles upsert ok - already student');
        }

        // 3) Link student record via RPC
        const { data: linkResult, error: linkError } = await supabase.rpc('link_student_user');
        console.log('[accept-invite] student link result:', linkResult, linkError);

        if (linkError) {
          console.error('[accept-invite] link error:', linkError);
          setMessage('Erro ao vincular conta. Tente novamente.');
          setStep('error');
          return;
        }

        const result = linkResult as any;
        if (result?.ok) {
          console.log('[accept-invite] student link ok:', result);
          setStep('done');
          // Redirect to student portal after brief success display
          setTimeout(() => navigate('/student', { replace: true }), 1500);
        } else {
          setMessage(result?.message || 'Não foi possível vincular a conta.');
          setStep('error');
        }
      } catch (err: any) {
        console.error('[accept-invite] unexpected error:', err);
        setMessage(err?.message || 'Erro inesperado');
        setStep('error');
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Atlon <span className="text-primary">PRO</span>
        </h1>

        {step === 'loading' && (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Configurando sua conta…</p>
          </div>
        )}

        {step === 'linking' && (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Vinculando seu perfil de aluno…</p>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-3">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="text-foreground font-medium">Conta configurada com sucesso!</p>
            <p className="text-sm text-muted-foreground">Redirecionando ao portal…</p>
          </div>
        )}

        {step === 'no-session' && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
            <p className="text-foreground font-medium">Link inválido ou expirado</p>
            <p className="text-sm text-muted-foreground">
              Peça um novo convite ao seu treinador.
            </p>
          </div>
        )}

        {step === 'error' && (
          <div className="rounded-xl border border-destructive/50 bg-card p-6 space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-foreground font-medium">Erro</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;
