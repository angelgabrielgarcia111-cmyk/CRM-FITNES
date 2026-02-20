import React, { useState } from 'react';
import { Users, Eye, CalendarPlus, AlertCircle, Search, Pencil, Monitor, Trash2, TrendingUp, Clock, UserPlus } from 'lucide-react';

const students = [
  { name: 'Ana Silva', initials: 'A', email: 'ana.silva@email.com', plan: 'Plano Mensal', modality: 'Presencial', status: 'ATIVO', expiry: '2024-02-15' },
  { name: 'Carlos Santos', initials: 'C', email: 'carlos.santos@email.com', plan: 'Plano Trimestral', modality: 'Online', status: 'ATIVO', expiry: '2024-03-20' },
  { name: 'Maria Costa', initials: 'M', email: 'maria.costa@email.com', plan: 'Plano Mensal', modality: 'Híbrido', status: 'INATIVO', expiry: '2024-01-10' },
  { name: 'João Oliveira', initials: 'J', email: 'joao.oliveira@email.com', plan: 'Plano Semestral', modality: 'Presencial', status: 'PENDENTE', expiry: '2024-04-15' },
];

const statusColors: Record<string, string> = {
  ATIVO: 'bg-success/20 text-success',
  INATIVO: 'bg-destructive/20 text-destructive',
  PENDENTE: 'bg-warning/20 text-warning',
};

const StudentsModule: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie todos os seus alunos em um só lugar</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus size={16} />
          Adicionar Aluno
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total de Alunos</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">248</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Users size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+12 este mês</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Alunos Ativos</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">192</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Eye size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>77% do total</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Novos Este Mês</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">24</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <CalendarPlus size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+18% vs. anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Pendentes</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">8</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-warning/10">
              <AlertCircle size={20} className="text-warning" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-warning">
            <Clock size={14} />
            <span>Requer atenção</span>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/40" />
          <span>NENHUM PENDENTE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/40" />
          <span>NENHUM ENTREGUE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por e-mail"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Todos os planos</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Todas modalidades</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Todos status</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Todos objetivos</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Todas avaliações</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Mais Recente</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button className="text-xs text-primary hover:underline">Limpar filtros</button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Aluno</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">E-mail</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Plano</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Modalidade</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Vencimento</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.email} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded ${statusColors[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {s.initials}
                      </div>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{s.email}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{s.plan}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{s.modality}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarPlus size={14} />
                      {s.expiry}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors">
                        <Monitor size={15} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default StudentsModule;
