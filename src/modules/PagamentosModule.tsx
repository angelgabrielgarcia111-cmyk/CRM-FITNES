import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Clock, CheckCircle, Plus, Bell, Send, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const metrics = [
  { label: 'RECEITA MENSAL', value: 'R$ 709,50', change: '+18% este mês', icon: <TrendingUp size={22} />, color: 'text-primary' },
  { label: 'EM ATRASO', value: '2', change: 'Precisa atenção', icon: <AlertTriangle size={22} />, color: 'text-destructive' },
  { label: 'VENCE EM BREVE', value: '2', change: 'Próximos 3 dias', icon: <Clock size={22} />, color: 'text-yellow-500' },
  { label: 'EM DIA', value: '1', change: 'Pagamentos OK', icon: <CheckCircle size={22} />, color: 'text-primary' },
];

const chartData = [
  { month: 'Jan', receita: 3500, pendencias: 800 },
  { month: 'Fev', receita: 4200, pendencias: 600 },
  { month: 'Mar', receita: 4800, pendencias: 900 },
  { month: 'Abr', receita: 4000, pendencias: 700 },
  { month: 'Mai', receita: 5500, pendencias: 500 },
  { month: 'Jun', receita: 7100, pendencias: 1200 },
];

const payments = [
  { name: 'Ana Silva', plan: 'Consultoria P', value: 'R$ 299,90', status: 'em_dia', next: '15/02/2026' },
  { name: 'João Santos', plan: 'Consultoria Básica', value: 'R$ 199,90', status: 'atraso', next: '01/02/2026' },
  { name: 'Maria Oliveira', plan: 'Consultoria P', value: 'R$ 299,90', status: 'vence_breve', next: '22/02/2026' },
  { name: 'Carlos Ferreira', plan: 'Consultoria Básica', value: 'R$ 199,90', status: 'atraso', next: '28/01/2026' },
  { name: 'Pedro Lima', plan: 'Consultoria P', value: 'R$ 299,90', status: 'vence_breve', next: '23/02/2026' },
];

const statusMap: Record<string, { label: string; class: string }> = {
  em_dia: { label: 'Em dia', class: 'bg-primary/20 text-primary' },
  atraso: { label: 'Em atraso', class: 'bg-destructive/20 text-destructive' },
  vence_breve: { label: 'Vence em breve', class: 'bg-yellow-500/20 text-yellow-400' },
};

type Filter = 'todos' | 'atraso' | 'vence_breve';

const PagamentosModule: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('todos');
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p => {
    if (filter !== 'todos' && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Pagamentos</h1>
          <p className="text-sm text-muted-foreground">Controle financeiro e cobrança automatizada</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Novo Plano
        </button>
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

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-lg font-bold text-foreground mb-1">Receita vs Pendências</h3>
        <p className="text-xs text-muted-foreground mb-4">Últimos 6 meses</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendencias" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-medium hover:bg-yellow-500/30 transition-colors">
          <Bell size={16} /> Notificar Pagamentos em Atraso (2)
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-medium hover:bg-yellow-500/30 transition-colors">
          <Clock size={16} /> Lembrar Vencimentos Próximos (2)
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30 transition-colors">
          <Send size={16} /> Enviar Recibos
        </button>
      </div>

      {/* Payment Table */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Controle de Pagamentos</h3>
          <div className="flex gap-2">
            {([['todos', 'Todos'], ['atraso', 'Em Atraso'], ['vence_breve', 'Vence em Breve']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === key ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['ALUNO', 'PLANO', 'VALOR', 'STATUS', 'PRÓXIMO VENCIMENTO', 'AÇÕES'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.name} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.plan}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{p.value}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusMap[p.status].class}`}>
                      {statusMap[p.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.next}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary hover:underline">Ver detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagamentosModule;
