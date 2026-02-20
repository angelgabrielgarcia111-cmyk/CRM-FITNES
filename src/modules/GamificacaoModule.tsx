import React, { useState } from 'react';
import { Trophy, Users, Award, Gift, TrendingUp, Clock, Star, Flame, Dumbbell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type Tab = 'ranking' | 'conquistas' | 'recompensas';

const metrics = [
  { label: 'ALUNOS ATIVOS', value: '89', change: '+12 esta semana', icon: <Users size={22} />, color: 'text-yellow-500' },
  { label: 'MEDALHAS CONQUISTADAS', value: '247', change: '+18 hoje', icon: <Trophy size={22} />, color: 'text-yellow-500' },
  { label: 'RECOMPENSAS RESGATADAS', value: '56', change: '+8 este mês', icon: <Gift size={22} />, color: 'text-yellow-500' },
  { label: 'ENGAJAMENTO MÉDIO', value: '87%', change: '+5% vs. anterior', icon: <TrendingUp size={22} />, color: 'text-yellow-500' },
];

const ranking = [
  { initials: 'AS', name: 'Ana Silva', rank: 1, level: 15, points: 2450, maxPoints: 2500, streak: 12, badges: ['Primeiro Treino', 'Guerreiro da Semana', 'Mestre da Dieta'], achievements: ['Completou 7 dias consecutivos', 'Primeira semana perfeita'] },
  { initials: 'CS', name: 'Carlos Santos', rank: 2, level: 8, points: 1200, maxPoints: 1500, streak: 5, badges: ['Primeiro Treino', 'Madrugador'], achievements: ['Primeiro treino matinal', 'Meta diária atingida'] },
];

const conquistas = [
  { icon: <Dumbbell size={20} />, title: 'Primeiro Treino', type: 'BRONZE' as const, desc: 'Complete seu primeiro treino', points: 50 },
  { icon: <Flame size={20} />, title: 'Guerreiro da Semana', type: 'GOLD' as const, desc: 'Complete 7 treinos em uma semana', points: 200 },
  { icon: <Star size={20} />, title: 'Mestre da Dieta', type: 'PLATINUM' as const, desc: 'Siga a dieta por 30 dias consecutivos', points: 500 },
  { icon: <Clock size={20} />, title: 'Madrugador', type: 'SILVER' as const, desc: 'Complete 5 treinos antes das 8h', points: 100 },
];

const recompensas = [
  { title: 'Desconto 10% Suplementos', desc: 'Desconto em produtos da loja', points: 500, status: 'disponivel' as const },
  { title: 'Sessão de Avaliação Extra', desc: 'Uma avaliação física adicional', points: 800, status: 'disponivel' as const },
  { title: 'Camiseta Exclusiva', desc: 'Camiseta personalizada da academia', points: 1000, status: 'esgotado' as const },
];

const badgeColors: Record<string, string> = {
  BRONZE: 'bg-amber-700/20 text-amber-500',
  SILVER: 'bg-gray-400/20 text-gray-300',
  GOLD: 'bg-yellow-500/20 text-yellow-400',
  PLATINUM: 'bg-purple-500/20 text-purple-400',
};

const GamificacaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ranking');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ranking', label: 'Ranking de Alunos' },
    { key: 'conquistas', label: 'Conquistas' },
    { key: 'recompensas', label: 'Recompensas' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
          <Trophy size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sistema de Gamificação</h1>
          <p className="text-sm text-muted-foreground">Motive seus alunos com conquistas e recompensas</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider">{m.label}</span>
              <div className={m.color}>{m.icon}</div>
            </div>
            <p className="text-3xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-primary mt-1">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'ranking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ranking.map(r => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">{r.initials}</div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">{r.rank}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">NÍVEL {r.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{r.points} pts</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Flame size={12} /> {r.streak} dias</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>PROGRESSO PARA NÍVEL {r.level + 1}</span>
                  <span>{r.points}/{r.maxPoints}</span>
                </div>
                <Progress value={(r.points / r.maxPoints) * 100} className="h-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">CONQUISTAS RECENTES:</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {r.badges.map(b => (
                    <span key={b} className="text-[10px] font-medium bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
                <ul className="space-y-0.5">
                  {r.achievements.map(a => (
                    <li key={a} className="text-xs text-primary">• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'conquistas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {conquistas.map(c => (
            <div key={c.title} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-yellow-500">{c.icon}</div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColors[c.type]}`}>{c.type}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-primary">+{c.points} pts</span>
                <button className="text-xs px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">Ver Detalhes</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recompensas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recompensas.map(r => (
            <div key={r.title} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-yellow-500"><Gift size={20} /></div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{r.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'disponivel' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {r.status === 'disponivel' ? 'DISPONÍVEL' : 'ESGOTADO'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-primary">{r.points} pts</span>
                <button
                  disabled={r.status === 'esgotado'}
                  className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                    r.status === 'disponivel'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {r.status === 'disponivel' ? 'Ativar' : 'Indisponível'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamificacaoModule;
