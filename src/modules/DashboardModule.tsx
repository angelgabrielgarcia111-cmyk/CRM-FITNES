import React from 'react';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { name: 'Jan', alunos: 40, receita: 2400 },
  { name: 'Fev', alunos: 45, receita: 2800 },
  { name: 'Mar', alunos: 50, receita: 3200 },
  { name: 'Abr', alunos: 48, receita: 3100 },
  { name: 'Mai', alunos: 55, receita: 3600 },
  { name: 'Jun', alunos: 60, receita: 4000 },
];

const pieData = [
  { name: 'Musculação', value: 45 },
  { name: 'Funcional', value: 25 },
  { name: 'Pilates', value: 15 },
  { name: 'Cardio', value: 15 },
];

const COLORS = ['#22d3ee', '#22c55e', '#f59e0b', '#f43f5e'];

const recentStudents = [
  { name: 'Ana Silva', plan: 'Premium', status: 'Ativo' },
  { name: 'Carlos Santos', plan: 'Básico', status: 'Ativo' },
  { name: 'Maria Oliveira', plan: 'Premium', status: 'Pendente' },
  { name: 'João Costa', plan: 'Básico', status: 'Ativo' },
];

const DashboardModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral do seu negócio fitness</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Alunos"
          value={60}
          change="+8.2%"
          isPositive
          icon={<Users size={20} className="text-chart-cyan" />}
          iconBg="bg-chart-cyan/20"
        />
        <MetricCard
          title="Receita Mensal"
          value="R$ 4.000"
          change="+12.5%"
          isPositive
          icon={<DollarSign size={20} className="text-chart-green" />}
          iconBg="bg-chart-green/20"
        />
        <MetricCard
          title="Taxa de Retenção"
          value="92%"
          change="+2.1%"
          isPositive
          icon={<TrendingUp size={20} className="text-chart-amber" />}
          iconBg="bg-chart-amber/20"
        />
        <MetricCard
          title="Treinos Hoje"
          value={12}
          change="-3.0%"
          isPositive={false}
          icon={<Activity size={20} className="text-chart-rose" />}
          iconBg="bg-chart-rose/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Evolução de Alunos e Receita</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 18%)" />
              <XAxis dataKey="name" stroke="hsl(215 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(215 40% 11%)', 
                  border: '1px solid hsl(215 25% 18%)', 
                  borderRadius: '12px',
                  color: 'hsl(210 40% 98%)'
                }} 
              />
              <Bar dataKey="alunos" fill="hsl(187 80% 48%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="receita" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Modalidades</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(215 40% 11%)', 
                  border: '1px solid hsl(215 25% 18%)', 
                  borderRadius: '12px',
                  color: 'hsl(210 40% 98%)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Alunos Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Nome</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Plano</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.name} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">{student.name}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{student.plan}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      student.status === 'Ativo' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {student.status}
                    </span>
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

export default DashboardModule;
