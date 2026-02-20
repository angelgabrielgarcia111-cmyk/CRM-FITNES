import React, { useState } from 'react';
import { View } from '@/types';
import AppSidebar from '@/components/AppSidebar';
import Topbar from '@/components/Topbar';
import DashboardModule from '@/modules/DashboardModule';
import StudentsModule from '@/modules/StudentsModule';
import AgendaModule from '@/modules/AgendaModule';
import NotificacoesModule from '@/modules/NotificacoesModule';
import ConsultoriaModule from '@/modules/ConsultoriaModule';
import PredefinicoesModule from '@/modules/PredefinicoesModule';
import GamificacaoModule from '@/modules/GamificacaoModule';
import EmptyState from '@/components/EmptyState';

const viewLabels: Record<View, string> = {
  [View.DASHBOARD]: 'Início',
  [View.ALUNOS]: 'Gestão de Alunos',
  [View.AGENDA]: 'Controle de Agenda',
  [View.NOTIFICACOES]: 'Notificações',
  [View.CONSULTORIA]: 'Consultoria',
  [View.PREDEFINICOES]: 'Predefinições',
  [View.GAMIFICACAO]: 'Gamificação',
  [View.COMUNICACAO]: 'Comunicação',
  [View.PAGAMENTOS]: 'Pagamentos',
  [View.PRODUTOS_CURSOS]: 'Produtos e Cursos',
  [View.AVALIACOES_RELATORIOS]: 'Avaliações e Relatórios',
  [View.IA_CREATION]: 'Criação com IA',
  [View.CONFIGURACOES]: 'Configurações',
};

const Index = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <DashboardModule />;
      case View.ALUNOS:
        return <StudentsModule />;
      case View.AGENDA:
        return <AgendaModule />;
      case View.NOTIFICACOES:
        return <NotificacoesModule />;
      case View.CONSULTORIA:
        return <ConsultoriaModule />;
      case View.PREDEFINICOES:
        return <PredefinicoesModule />;
      case View.GAMIFICACAO:
        return <GamificacaoModule />;
      default:
        return (
          <EmptyState 
            title={viewLabels[currentView] || currentView.replace(/_/g, ' ')} 
            onBack={() => setCurrentView(View.DASHBOARD)} 
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isOpen={isSidebarOpen} 
        onToggle={() => setSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Topbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
