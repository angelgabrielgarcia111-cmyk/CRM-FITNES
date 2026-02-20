import React, { useState } from 'react';
import { Search, Utensils, Dumbbell, ArrowLeft, Phone, MessageSquare, Camera } from 'lucide-react';

interface Consultoria {
  name: string;
  email: string;
  plan: string;
  modality: string;
  modalityIcon: string;
  status: string;
  days: number;
  age: number;
  height: string;
  weight: string;
}

const consultorias: Consultoria[] = [
  { name: 'Evandro Amaral', email: 'empresaamaral4002@gmail.com', plan: 'Consultoria P', modality: 'Dieta', modalityIcon: 'diet', status: 'pendente', days: 30, age: 20, height: '180 cm', weight: '88 kg' },
  { name: 'Maria Silva', email: 'maria.silva@email.com', plan: 'Consultoria Básica', modality: 'Treino', modalityIcon: 'treino', status: 'entregue', days: 15, age: 25, height: '165 cm', weight: '62 kg' },
];

const tabs = ['Progresso', 'Agendamentos', 'Anamnese', 'Avaliações', 'Dietas', 'Treinos', 'Exames', 'Feedbacks', 'Fotos', 'Logbook', 'Notas'];

const StudentDetail: React.FC<{ student: Consultoria; onBack: () => void }> = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('Progresso');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
              <span>{student.age} anos</span>
              <span>{student.height}</span>
              <span>{student.weight}</span>
              <span>{student.plan}</span>
            </div>
            <span className="inline-block mt-1.5 text-xs font-medium bg-primary/20 text-primary px-3 py-0.5 rounded-full">
              {student.days} dias restantes
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Phone size={14} /> WhatsApp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
            <MessageSquare size={14} /> Mensagem
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
            <Camera size={14} /> Finalizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-8 text-center">
          <h3 className="text-lg font-bold text-foreground mb-1">{activeTab}</h3>
          <p className="text-sm text-muted-foreground">Conteúdo de {activeTab} em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

const ConsultoriaModule: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Consultoria | null>(null);

  if (selectedStudent) {
    return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

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
                <tr key={c.email} onClick={() => setSelectedStudent(c)} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors cursor-pointer">
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
