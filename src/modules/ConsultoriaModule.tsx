import React, { useState } from 'react';
import { Search, Utensils, Dumbbell } from 'lucide-react';

const consultorias = [
  { name: 'Evandro Amaral', email: 'empresaamaral4002@gmail.com', plan: 'Consultoria P', modality: 'Dieta', modalityIcon: 'diet', status: 'pendente', days: 30 },
  { name: 'Maria Silva', email: 'maria.silva@email.com', plan: 'Consultoria Básica', modality: 'Treino', modalityIcon: 'treino', status: 'entregue', days: 15 },
];

const ConsultoriaModule: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultorias ativas</h1>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">1 Pendente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Nenhum entregue</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por nome" value={searchName} onChange={e => setSearchName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="relative flex-1 min-w-[160px]">
            <input type="text" placeholder="Buscar por email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-[140px]">
            <option>Selecionar plano</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-[140px]">
            <option>Selecionar modalidade</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary flex-1 min-w-[140px]">
            <option>Selecionar status</option>
          </select>
          <button className="px-5 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors whitespace-nowrap">
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Table */}
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
              </tr>
            </thead>
            <tbody>
              {consultorias.map(c => (
                <tr key={c.email} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className={`w-3 h-3 rounded-full ${c.status === 'pendente' ? 'bg-destructive' : 'bg-primary'}`} />
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{c.plan}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      {c.modalityIcon === 'diet' ? <Utensils size={14} /> : <Dumbbell size={14} />}
                      {c.modality}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {c.days} dias restantes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-center text-xs text-muted-foreground border-t border-border">
          EXIBINDO 1 A 2 DE 2 REGISTROS
        </div>
      </div>
    </div>
  );
};

export default ConsultoriaModule;
