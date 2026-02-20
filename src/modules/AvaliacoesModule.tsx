import React, { useState } from 'react';
import { Star, Users, ClipboardCheck, TrendingUp, Download, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';

const metrics = [
  { label: 'SATISFAÇÃO GERAL', value: '4.8/5', change: '+0.3 este mês', icon: <Star size={22} />, color: 'text-yellow-400' },
  { label: 'TAXA DE RETENÇÃO', value: '92%', change: '+5% este mês', icon: <Users size={22} />, color: 'text-primary' },
  { label: 'AVALIAÇÕES REALIZADAS', value: '48', change: 'Este mês', icon: <ClipboardCheck size={22} />, color: 'text-primary' },
  { label: 'FREQUÊNCIA MÉDIA', value: '4.2x', change: 'Por semana', icon: <TrendingUp size={22} />, color: 'text-yellow-400' },
];

const lineData = [
  { month: 'Jan', alunos: 120, avaliacoes: 45 },
  { month: 'Fev', alunos: 135, avaliacoes: 52 },
  { month: 'Mar', alunos: 160, avaliacoes: 60 },
  { month: 'Abr', alunos: 200, avaliacoes: 75 },
];

const pieData = [
  { name: 'Muito Satisfeito', value: 65, color: 'hsl(var(--primary))' },
  { name: 'Satisfeito', value: 28, color: 'hsl(142 71% 45%)' },
  { name: 'Neutro', value: 5, color: 'hsl(45 93% 47%)' },
  { name: 'Insatisfeito', value: 2, color: 'hsl(var(--destructive))' },
];

const topAlunos = [
  { rank: 1, initials: 'AS', name: 'Ana Silva', progress: 95, treinos: 24, rating: 4.9 },
  { rank: 2, initials: 'JS', name: 'João Santos', progress: 88, treinos: 22, rating: 4.8 },
  { rank: 3, initials: 'MO', name: 'Maria Oliveira', progress: 82, treinos: 26, rating: 4.9 },
  { rank: 4, initials: 'CF', name: 'Carlos Ferreira', progress: 85, treinos: 20, rating: 4.7 },
  { rank: 5, initials: 'LC', name: 'Lucia Costa', progress: 90, treinos: 23, rating: 4.8 },
];

const recentReviews = [
  { initials: 'AS', name: 'Ana Silva', comment: 'Excelente acompanhamento, muito satisfeita!', rating: 5, date: '2024-01-15' },
  { initials: 'JS', name: 'João Santos', comment: 'Ótima metodologia, resultados aparecendo rápido.', rating: 5, date: '2024-01-14' },
];

const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-700'];

const AvaliacoesModule: React.FC = () => {
  const [chartRange, setChartRange] = useState<'3M' | '6M'>('6M');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Avaliações e Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise completa do desempenho da sua academia</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/30 transition-colors">
            <Download size={16} /> Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Nova Avaliação
          </button>
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
            <p className={`text-xs mt-1 ${m.color}`}>{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Line Chart */}
        <div className="md:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Performance Mensal</h3>
              <p className="text-xs text-muted-foreground">Alunos, receita e avaliações</p>
            </div>
            <div className="flex gap-1 bg-background rounded-lg p-0.5">
              {(['3M', '6M'] as const).map(r => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${chartRange === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
              <Line type="monotone" dataKey="alunos" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="avaliacoes" stroke="hsl(280 70% 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Alunos</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(280 70% 60%)' }} /> Avaliações</span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-lg font-bold text-foreground mb-1">Satisfação dos Alunos</h3>
          <p className="text-xs text-muted-foreground mb-2">Distribuição das avaliações</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}
                </span>
                <span className="font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Alunos */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-lg font-bold text-foreground mb-1">Top Alunos do Mês</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Baseado em frequência, progresso e avaliações</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['POSIÇÃO', 'ALUNO', 'PROGRESSO', 'TREINOS', 'AVALIAÇÃO', 'STATUS'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAlunos.map(a => (
                <tr key={a.name} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3">
                    <span className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold ${a.rank <= 3 ? `${rankColors[a.rank - 1]} text-foreground` : 'text-muted-foreground'}`}>
                      {a.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">{a.initials}</div>
                      <span className="text-sm text-foreground">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={a.progress} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">{a.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{a.treinos}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-yellow-400"><Star size={14} fill="currentColor" /> {a.rating}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold bg-primary/20 text-primary px-2.5 py-1 rounded-full">ATIVO</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Avaliações Recentes</h3>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">VER TODAS</button>
        </div>
        <div className="space-y-3">
          {recentReviews.map(r => (
            <div key={r.name} className="flex items-center gap-4 p-3 bg-background rounded-xl">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0">{r.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">{r.comment}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvaliacoesModule;
