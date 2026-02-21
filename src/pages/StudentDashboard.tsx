import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Dumbbell, LogOut, Home, ClipboardList, Apple, User, 
  Bot, ShoppingBag, Bell, TrendingUp, Video 
} from 'lucide-react';

type Tab = 'home' | 'treinos' | 'dieta' | 'perfil';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('home');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'treinos', label: 'Treinos', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'dieta', label: 'Dieta', icon: <Apple className="h-4 w-4" /> },
    { id: 'perfil', label: 'Perfil', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Atlon <span className="text-primary">PRO</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-20 max-w-2xl mx-auto w-full">
        {tab === 'home' && <HomeTab email={user?.email} />}
        {tab === 'treinos' && <TreinosTab />}
        {tab === 'dieta' && <DietaTab />}
        {tab === 'perfil' && <PerfilTab email={user?.email} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-2 z-50">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              tab === t.id 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

/* ── Tab Components ── */

const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
    <div className="flex items-center gap-2 font-semibold text-sm">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const PlaceholderText = ({ text }: { text: string }) => (
  <p className="text-sm text-muted-foreground">{text}</p>
);

const HomeTab = ({ email }: { email?: string }) => (
  <div className="space-y-4">
    <div>
      <h1 className="text-xl font-bold">Bem-vindo! 👋</h1>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>

    <SectionCard title="Treino Atual" icon={<Dumbbell className="h-4 w-4 text-primary" />}>
      <PlaceholderText text="Nenhum treino ativo no momento." />
    </SectionCard>

    <SectionCard title="Dieta Atual" icon={<Apple className="h-4 w-4 text-green-500" />}>
      <PlaceholderText text="Nenhum plano alimentar atribuído." />
    </SectionCard>

    <SectionCard title="Calorias & Atividade" icon={<TrendingUp className="h-4 w-4 text-amber-500" />}>
      <PlaceholderText text="Em breve — integração com dispositivos." />
    </SectionCard>

    <SectionCard title="Assistente Fitness IA" icon={<Bot className="h-4 w-4 text-purple-500" />}>
      <PlaceholderText text="Chat com IA em breve disponível." />
    </SectionCard>

    <SectionCard title="Projetos & Infoprodutos" icon={<ShoppingBag className="h-4 w-4 text-rose-500" />}>
      <PlaceholderText text="Nenhum produto disponível." />
    </SectionCard>
  </div>
);

const TreinosTab = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Meus Treinos</h2>
    <SectionCard title="Treinos Atribuídos" icon={<ClipboardList className="h-4 w-4 text-primary" />}>
      <PlaceholderText text="Nenhum treino atribuído ainda." />
    </SectionCard>
    <SectionCard title="Vídeos de Exercícios" icon={<Video className="h-4 w-4 text-primary" />}>
      <PlaceholderText text="Vídeos serão exibidos aqui." />
    </SectionCard>
  </div>
);

const DietaTab = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Alimentação & Dieta</h2>
    <SectionCard title="Plano Alimentar" icon={<Apple className="h-4 w-4 text-green-500" />}>
      <PlaceholderText text="Seu plano alimentar aparecerá aqui." />
    </SectionCard>
    <SectionCard title="Cardápio Semanal" icon={<ClipboardList className="h-4 w-4 text-green-500" />}>
      <PlaceholderText text="Cardápio em breve." />
    </SectionCard>
  </div>
);

const PerfilTab = ({ email }: { email?: string }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Meu Perfil</h2>
    <SectionCard title="Dados Pessoais" icon={<User className="h-4 w-4 text-primary" />}>
      <p className="text-sm text-muted-foreground">Email: {email}</p>
    </SectionCard>
    <SectionCard title="Exames & Avaliações" icon={<ClipboardList className="h-4 w-4 text-primary" />}>
      <PlaceholderText text="Nenhum exame registrado." />
    </SectionCard>
    <SectionCard title="Fotos & Anamnese" icon={<ClipboardList className="h-4 w-4 text-primary" />}>
      <PlaceholderText text="Seção disponível em breve." />
    </SectionCard>
  </div>
);

export default StudentDashboard;
