import React from 'react';
import { Users, DollarSign, Calendar, Star, TrendingUp, Clock, UserPlus, CreditCard } from 'lucide-react';

const DashboardModule: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Alunos Ativos */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Clientes Atendidos</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">+10mil</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Users size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+12% este mês</span>
          </div>
        </div>

        {/* Faturamento Mensal */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Faturamento Mensal</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">R$ 6.540</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <TrendingUp size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+8% este mês</span>
          </div>
        </div>

        {/* Sessões Agendadas Hoje */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Sessões Agendadas Hoje</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">8</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Calendar size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>próxima em 45min</span>
          </div>
        </div>

        {/* Avaliações Recebidas */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Avaliações Recebidas</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">4.8</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Star size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-warning">
            <div className="flex">
              {[1, 2, 3, 4].map(i => (
                <Star key={i} size={12} className="fill-warning text-warning" />
              ))}
              <Star size={12} className="text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">(27 avaliações)</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Próximas Sessões + Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Próximas Sessões */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-foreground">Próximas Sessões</h3>
            <button className="text-xs text-primary hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  AM
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Ana Martins</p>
                  <p className="text-xs text-muted-foreground">Hipertrofia - Intermediário</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">09:30 - 10:30</p>
                <p className="text-xs text-muted-foreground">Hoje</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-sm font-semibold text-success">
                  JR
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">João Rodrigues</p>
                  <p className="text-xs text-muted-foreground">Avaliação Física</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">11:00 - 12:00</p>
                <p className="text-xs text-muted-foreground">Hoje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
            <button className="text-xs text-primary hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                <UserPlus size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Novo aluno cadastrado</p>
                <p className="text-xs text-muted-foreground">Pedro Mendes se inscreveu no plano trimestral</p>
                <p className="text-xs text-muted-foreground mt-1">Hoje, 09:45</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                <CreditCard size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Pagamento recebido</p>
                <p className="text-xs text-muted-foreground">R$ 350,00 - Maria Silva (Plano Mensal)</p>
                <p className="text-xs text-muted-foreground mt-1">Hoje, 09:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
