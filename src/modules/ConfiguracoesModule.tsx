import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Link2, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SettingsTab = 'perfil' | 'notificacoes' | 'seguranca' | 'aparencia' | 'integracoes' | 'dados';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil', label: 'PERFIL', icon: <User size={16} /> },
  { id: 'notificacoes', label: 'NOTIFICAÇÕES', icon: <Bell size={16} /> },
  { id: 'seguranca', label: 'SEGURANÇA', icon: <Shield size={16} /> },
  { id: 'aparencia', label: 'APARÊNCIA', icon: <Palette size={16} /> },
  { id: 'integracoes', label: 'INTEGRAÇÕES', icon: <Link2 size={16} /> },
  { id: 'dados', label: 'DADOS', icon: <Database size={16} /> },
];

const NotificacoesContent = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const items = [
    { label: 'Notificações por Email', desc: 'Receber notificações importantes por email', enabled: emailEnabled, onChange: setEmailEnabled },
    { label: 'SMS', desc: 'Receber lembretes por mensagem de texto', enabled: smsEnabled, onChange: setSmsEnabled },
    { label: 'Notificações Push', desc: 'Receber notificações no navegador', enabled: pushEnabled, onChange: setPushEnabled },
    { label: 'Marketing', desc: 'Receber dicas e novidades da plataforma', enabled: marketingEnabled, onChange: setMarketingEnabled },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Configurações de Notificação</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch checked={item.enabled} onCheckedChange={item.onChange} />
          </div>
        ))}
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Preferências</Button>
    </div>
  );
};

const SegurancaContent = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-foreground">Segurança</h2>

    <div className="space-y-4">
      <p className="text-xs font-bold text-muted-foreground tracking-wider">ALTERAR SENHA</p>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Senha Atual</label>
          <Input type="password" className="bg-background border-border mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Nova Senha</label>
          <Input type="password" className="bg-background border-border mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Confirmar Nova Senha</label>
          <Input type="password" className="bg-background border-border mt-1" />
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <p className="text-xs font-bold text-muted-foreground tracking-wider">AUTENTICAÇÃO DE DOIS FATORES</p>
      <div className="flex items-center justify-between bg-background border border-border rounded-lg p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">2FA por SMS</p>
          <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
        </div>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">ATIVAR</Button>
      </div>
    </div>

    <div className="space-y-3">
      <p className="text-xs font-bold text-muted-foreground tracking-wider">SESSÕES ATIVAS</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-background border border-border rounded-lg p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Chrome – São Paulo, SP</p>
            <p className="text-xs text-muted-foreground">Sessão Atual</p>
          </div>
          <span className="text-xs font-bold text-primary">ATIVO</span>
        </div>
        <div className="flex items-center justify-between bg-background border border-border rounded-lg p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Mobile App – Android</p>
            <p className="text-xs text-muted-foreground">Há 2 horas</p>
          </div>
        </div>
      </div>
    </div>

    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Configurações</Button>
  </div>
);

const PlaceholderContent = ({ title, message }: { title: string; message: string }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-foreground">{title}</h2>
    <div className="bg-background border border-border rounded-lg p-8">
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  </div>
);

const ConfiguracoesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notificacoes');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <PlaceholderContent title="Perfil" message="Configurações de perfil em desenvolvimento..." />;
      case 'notificacoes':
        return <NotificacoesContent />;
      case 'seguranca':
        return <SegurancaContent />;
      case 'aparencia':
        return <PlaceholderContent title="Aparência" message="Configurações de tema e layout em desenvolvimento..." />;
      case 'integracoes':
        return <PlaceholderContent title="Integrações" message="Configurações de integrações externas em desenvolvimento..." />;
      case 'dados':
        return <PlaceholderContent title="Gestão de Dados" message="Configurações de backup e exportação em desenvolvimento..." />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configurações da sua academia</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-60 shrink-0 bg-card border border-border rounded-xl p-3 space-y-1 h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesModule;
