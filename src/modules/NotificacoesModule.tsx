import React, { useState } from 'react';
import { TrendingUp, Eye, MousePointer, Plus, Send, UserX, UserPlus, Gift, Target, Sparkles, X, Zap, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const chartData = [
  { name: '1 Jun', interacoes: 20, notificacoes: 25 },
  { name: '5 Jun', interacoes: 30, notificacoes: 35 },
  { name: '10 Jun', interacoes: 25, notificacoes: 40 },
  { name: '15 Jun', interacoes: 35, notificacoes: 45 },
  { name: '20 Jun', interacoes: 30, notificacoes: 55 },
  { name: '25 Jun', interacoes: 40, notificacoes: 65 },
  { name: '30 Jun', interacoes: 45, notificacoes: 80 },
];

const suggestions = [
  { icon: <UserX size={18} />, title: 'Alunos Inativos', desc: '15 alunos não visitaram a academia nos últimos 14 dias. Uma notificação pode aumentar o engajamento.', color: 'bg-destructive/10 text-destructive' },
  { icon: <UserPlus size={18} />, title: 'Novos Alunos', desc: '8 novos alunos se inscreveram esta semana. Envie uma mensagem de boas-vindas personalizada.', color: 'bg-primary/10 text-primary' },
  { icon: <Gift size={18} />, title: 'Aniversariantes', desc: '3 alunos fazem aniversário nos próximos 7 dias. Envie um presente ou desconto especial.', color: 'bg-warning/10 text-warning' },
  { icon: <Target size={18} />, title: 'Metas Alcançadas', desc: '12 alunos atingiram suas metas de treino este mês. Parabenize-os e sugira novos desafios.', color: 'bg-success/10 text-success' },
];

const history = [
  { title: 'Desafio de 30 Dias - Verão', status: 'ENVIADA', date: '15/06/2023 - 10:30', aberturas: '78%', cliques: '45%', conversoes: '12%' },
  { title: 'Novos Treinos de Força', status: 'ENVIADA', date: '10/06/2023 - 08:15', aberturas: '82%', cliques: '51%', conversoes: '18%' },
];

const tags = ['#motivacao', '#treino', '#nutricao', '#resultado', '#desafio', '#dica'];

const aiSuggestions = [
  { icon: <Zap size={14} />, text: 'Lembrete de treino personalizado' },
  { icon: <Target size={14} />, text: 'Parabenizar conquistas recentes' },
  { icon: <TrendingUp size={14} />, text: 'Motivação para próxima meta' },
  { icon: <TrendingUp size={14} />, text: 'Compartilhar progresso semanal' },
  { icon: <Calendar size={14} />, text: 'Oferta especial para aniversariantes' },
];

const segments = [
  { label: 'Todos os alunos', count: 248 },
  { label: 'Alunos ativos', count: 192 },
  { label: 'Alunos inativos', count: 56 },
  { label: 'Novos alunos (últimos 30 dias)', count: 24 },
  { label: 'Aniversariantes da semana', count: 8 },
  { label: 'Meta atingida este mês', count: 34, highlight: true },
];

const NotificacoesModule: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(5);
  const [sendOption, setSendOption] = useState<'now' | 'schedule'>('now');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Notificações</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie e acompanhe o desempenho das suas campanhas de notificação</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Criar Nova Notificação
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Notificações Enviadas</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">248</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <TrendingUp size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+12% este mês</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Taxa de Abertura</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">76%</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Eye size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+8% vs. último mês</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Taxa de Cliques</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">42%</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <MousePointer size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-success">
            <TrendingUp size={14} />
            <span>+5% vs. último mês</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground">Desempenho das Campanhas</h3>
        <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="interacoes" stroke="hsl(var(--primary))" name="Interações Geradas" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="notificacoes" stroke="hsl(142 71% 45%)" name="Notificações Enviadas" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{s.title}</h4>
            <p className="text-xs text-muted-foreground flex-1 mb-4">{s.desc}</p>
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Criar Notificação
            </button>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Histórico de Notificações</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Título</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Data/Hora</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Métricas</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.title} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{h.title}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold bg-primary/20 text-primary px-2.5 py-1 rounded">{h.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{h.date}</td>
                  <td className="px-4 py-4 text-xs text-muted-foreground leading-relaxed">
                    Aberturas: <span className="text-primary font-medium">{h.aberturas}</span><br />
                    Cliques: <span className="text-primary font-medium">{h.cliques}</span><br />
                    Conversões: <span className="text-primary font-medium">{h.conversoes}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-xs border border-border px-3 py-1.5 rounded-lg text-foreground hover:bg-muted/20 transition-colors">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Criar Nova Notificação</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left */}
              <div className="lg:col-span-3 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Título da Notificação</label>
                  <input
                    type="text"
                    placeholder="Ex: Lembrete de treino hoje!"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Mensagem</label>
                  <textarea
                    placeholder="Digite sua mensagem aqui..."
                    rows={4}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-medium">TAGS:</span>
                  {tags.map(t => (
                    <span key={t} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20">{t}</span>
                  ))}
                </div>

                {/* Segmentação */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Segmentação de Público</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {segments.map((seg, i) => (
                      <button
                        key={seg.label}
                        onClick={() => setSelectedSegment(i)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left text-xs transition-colors ${
                          selectedSegment === i
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border text-muted-foreground hover:border-muted-foreground/50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 ${selectedSegment === i ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`} />
                        <div>
                          <p className="font-medium">{seg.label}</p>
                          <p className="text-muted-foreground">{seg.count} alunos</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opções de envio */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Opções de Envio</h4>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="radio" checked={sendOption === 'now'} onChange={() => setSendOption('now')} className="accent-primary" />
                      <Send size={14} className="text-primary" />
                      <span className="text-primary font-medium">Enviar agora</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="radio" checked={sendOption === 'schedule'} onChange={() => setSendOption('schedule')} className="accent-primary" />
                      <Calendar size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Agendar envio</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-background border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">Sugestões de IA</h4>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((s) => (
                      <button key={s.text} className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-left">
                        {s.icon}
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-background border border-border rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Preview da Notificação</h4>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap size={14} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-semibold text-foreground">Atlon PRO</span>
                          <span className="text-xs text-muted-foreground">Agora</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">🏆 Parabenizar conquistas recentes</p>
                        <p className="text-xs text-muted-foreground">Sua mensagem aparecerá aqui...</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Alcance Estimado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destinatários</span>
                      <span className="font-semibold text-foreground">{segments[selectedSegment]?.count || 34}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxa de abertura estimada</span>
                      <span className="font-semibold text-primary">76%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engajamento esperado</span>
                      <span className="font-semibold text-primary">42%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Send size={16} />
                Enviar Notificação
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacoesModule;
