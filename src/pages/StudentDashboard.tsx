import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dumbbell, LogOut } from 'lucide-react';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Atlon <span className="text-primary">PRO</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Bem-vindo, aluno!</h1>
        <p className="text-muted-foreground">
          Seu painel de treinos estará disponível em breve. Fique atento às novidades.
        </p>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-2">Seus treinos</h2>
          <p className="text-sm text-muted-foreground">Nenhum treino atribuído ainda.</p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
