import React, { useState } from 'react';
import { ClipboardList, Apple, FileText, Utensils, Dumbbell, Zap, Activity, Pen, Plus } from 'lucide-react';

type Tab = 'dieta' | 'treinamento';

interface PresetCard {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  helpLink: string;
}

const dietCards: PresetCard[] = [
  { icon: <Apple size={28} />, title: 'Meus alimentos', subtitle: 'LISTA PERSONALIZADA DE ALIMENTOS', helpLink: 'Como criar seus alimentos?' },
  { icon: <FileText size={28} />, title: 'Minhas fórmulas', subtitle: 'FÓRMULAS NUTRICIONAIS SALVAS', helpLink: 'Como criar suas fórmulas?' },
  { icon: <Utensils size={28} />, title: 'Meus cardápios', subtitle: 'CARDÁPIOS PRÉ-DEFINIDOS', helpLink: 'Como criar seus cardápios?' },
];

const treiningCards: PresetCard[] = [
  { icon: <Dumbbell size={28} />, title: 'Meus exercícios', subtitle: 'BANCO DE EXERCÍCIOS PERSONALIZADO', helpLink: 'Como criar seus exercícios?' },
  { icon: <Zap size={28} />, title: 'Técnicas avançadas', subtitle: 'TÉCNICAS DE TREINAMENTO AVANÇADAS', helpLink: 'Como criar suas técnicas?' },
  { icon: <Activity size={28} />, title: 'Meus treinos', subtitle: 'TREINOS PRÉ-CONFIGURADOS', helpLink: 'Como criar seus treinos?' },
];

const PredefinicoesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dieta');
  const cards = activeTab === 'dieta' ? dietCards : treiningCards;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Predefinições</h1>
          <p className="text-sm text-muted-foreground">Configure seus modelos e bibliotecas pessoais</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('dieta')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dieta'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Apple size={16} /> Dieta e protocolo
          </button>
          <button
            onClick={() => setActiveTab('treinamento')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'treinamento'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Dumbbell size={16} /> Treinamento
          </button>
        </div>

        {/* Section title */}
        <h2 className="text-lg font-bold text-foreground">
          {activeTab === 'dieta' ? 'Dieta e protocolo' : 'Treinamento'}
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} className="bg-background border border-border rounded-xl p-6 flex flex-col items-center text-center space-y-3">
              <div className="text-muted-foreground">{card.icon}</div>
              <h3 className="text-sm font-bold text-foreground">{card.title}</h3>
              <p className="text-xs text-muted-foreground tracking-wide">{card.subtitle}</p>
              <div className="flex gap-2 w-full mt-auto pt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                  <Pen size={14} /> Editar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Help links */}
        <div className="flex justify-center gap-6 pt-2">
          {cards.map(card => (
            <a key={card.helpLink} href="#" className="text-xs text-primary hover:underline">
              {card.helpLink}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredefinicoesModule;
