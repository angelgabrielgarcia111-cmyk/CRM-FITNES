import React from 'react';
import { 
  LayoutDashboard, Users, Calendar, Bell, MessageSquare, 
  Settings, Trophy, CreditCard, Package, BarChart3, 
  Bot, Briefcase, FileText, ChevronLeft
} from 'lucide-react';
import { View } from '@/types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: View.DASHBOARD, label: 'Início', icon: LayoutDashboard },
  { id: View.ALUNOS, label: 'Gestão de Alunos', icon: Users },
  { id: View.AGENDA, label: 'Controle de Agenda', icon: Calendar },
  { id: View.NOTIFICACOES, label: 'Dashboard de Notificações', icon: Bell },
  { id: View.CONSULTORIA, label: 'Consultoria', icon: Briefcase },
  { id: View.PREDEFINICOES, label: 'Predefinições', icon: FileText },
  { id: View.GAMIFICACAO, label: 'Gamificação', icon: Trophy },
  { id: View.COMUNICACAO, label: 'Comunicação', icon: MessageSquare },
  { id: View.PAGAMENTOS, label: 'Gestão de Pagamentos', icon: CreditCard },
  { id: View.PRODUTOS_CURSOS, label: 'Produtos e Cursos', icon: Package },
  { id: View.AVALIACOES_RELATORIOS, label: 'Avaliações e Relatórios', icon: BarChart3 },
  { id: View.IA_CREATION, label: 'Criação de Treinos com IA', icon: Bot },
  { id: View.CONFIGURACOES, label: 'Configurações', icon: Settings },
];

const AppSidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle }) => {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex items-center justify-between p-6 h-20">
        <div className={`flex items-center gap-2 overflow-hidden ${!isOpen && 'hidden'}`}>
          <span className="text-xl font-bold whitespace-nowrap text-foreground">Atlon <span className="text-primary">PRO</span></span>
        </div>
        <button onClick={onToggle} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={16} className={`${!isOpen ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>

      <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} />
              {isOpen && <span className="font-semibold text-[13px] whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
