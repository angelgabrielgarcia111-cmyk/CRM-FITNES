import React, { useState } from 'react';
import { Monitor, Mail, Send, Users, Plus, Video, Phone, MessageSquare, Calendar } from 'lucide-react';

type Tab = 'conversas' | 'templates' | 'envio';

const metrics = [
  { label: 'MENSAGENS HOJE', value: '24', change: '+12% vs ontem', icon: <Monitor size={22} /> },
  { label: 'NÃO LIDAS', value: '3', change: 'Precisam resposta', icon: <Mail size={22} /> },
  { label: 'TAXA DE RESPOSTA', value: '95%', change: 'Média 2h', icon: <Send size={22} /> },
  { label: 'ALUNOS ATIVOS', value: '186', change: 'Online agora: 12', icon: <Users size={22} /> },
];

const conversations = [
  { name: 'Ana Silva', message: 'Obrigada pelo treino de hoje!', time: '14:30', unread: false },
  { name: 'João Santos', message: 'Posso alterar meu horário?', time: '13:15', unread: true },
  { name: 'Maria Oliveira', message: 'Quando é a próxima avaliação?', time: '10:00', unread: true },
  { name: 'Carlos Ferreira', message: 'Preciso remarcar o treino', time: '09:45', unread: false },
];

const templates = [
  { title: 'Boas-vindas', type: 'ONBOARDING', desc: 'Bem-vindo(a) à nossa academia! Estamos aqui para te ajudar...' },
  { title: 'Lembrete de Treino', type: 'REMINDER', desc: 'Não se esqueça do seu treino hoje às {hora}!' },
  { title: 'Pagamento Vencido', type: 'PAYMENT', desc: 'Seu pagamento está em atraso. Regularize para continuar...' },
  { title: 'Motivacional', type: 'MOTIVATION', desc: 'Você está indo muito bem! Continue assim...' },
];

const typeColors: Record<string, string> = {
  ONBOARDING: 'bg-primary/20 text-primary',
  REMINDER: 'bg-primary/20 text-primary',
  PAYMENT: 'bg-yellow-500/20 text-yellow-400',
  MOTIVATION: 'bg-primary/20 text-primary',
};

const audiences = [
  { label: 'Todos os Alunos (186)', active: true },
  { label: 'Pagamentos em Atraso (5)', active: false },
  { label: 'Novos Alunos (12)', active: false },
];

const ComunicacaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('conversas');
  const [selectedConv, setSelectedConv] = useState(1);
  const [selectedAudience, setSelectedAudience] = useState(0);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'conversas', label: 'Conversas' },
    { key: 'templates', label: 'Templates' },
    { key: 'envio', label: 'Envio em Massa' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Comunicação</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as conversas e mensagens com seus alunos</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Nova Mensagem
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Video size={16} /> Videochamada
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider">{m.label}</span>
              <div className="text-primary">{m.icon}</div>
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

      {/* Conversas */}
      {activeTab === 'conversas' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* List */}
          <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 space-y-1">
            <h3 className="text-sm font-bold text-foreground mb-3">Conversas Recentes</h3>
            {conversations.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setSelectedConv(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedConv === i ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
              >
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  {c.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="md:col-span-3 bg-card border border-border rounded-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">{conversations[selectedConv].name}</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"><Phone size={14} /></button>
                <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors"><Video size={14} /></button>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4 min-h-[250px]">
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl rounded-tr-sm text-sm max-w-[70%]">
                  Oi João! Como foi o treino de hoje?
                  <div className="text-[10px] opacity-70 mt-1 text-right">14:29</div>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-xl rounded-tl-sm text-sm text-foreground max-w-[70%]">
                  Foi ótimo! Consegui fazer todos os exercícios. Posso alterar meu horário de amanhã?
                  <div className="text-[10px] text-muted-foreground mt-1">13:15</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Usar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      {activeTab === 'templates' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Templates de Mensagem</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Novo Template
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(t => (
              <div key={t.title} className="bg-background border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{t.title}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${typeColors[t.type]}`}>{t.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">Usar</button>
                  <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Envio em Massa */}
      {activeTab === 'envio' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <h3 className="text-lg font-bold text-foreground">Envio em Massa</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">DESTINATÁRIOS</label>
              <div className="flex gap-2 flex-wrap">
                {audiences.map((a, i) => (
                  <button
                    key={a.label}
                    onClick={() => setSelectedAudience(i)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedAudience === i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">TÍTULO</label>
              <input
                type="text"
                placeholder="Assunto da mensagem"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">MENSAGEM</label>
              <textarea
                placeholder="Digite sua mensagem aqui..."
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Send size={14} /> Enviar Agora
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/30 transition-colors">
                <Calendar size={14} /> Agendar Envio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComunicacaoModule;
