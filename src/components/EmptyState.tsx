import React from 'react';
import { Construction } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  onBack?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-center animate-fade-in">
      <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 text-primary">
        <Construction size={40} />
      </div>
      <h2 className="text-2xl font-bold mb-2 capitalize text-foreground">{title}</h2>
      <p className="text-muted-foreground max-w-md px-6">
        Este módulo está atualmente sob desenvolvimento para garantir a melhor experiência SaaS do mercado. 
        Fique atento às próximas atualizações!
      </p>
      {onBack && (
        <button 
          onClick={onBack}
          className="mt-8 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all"
        >
          Voltar ao Início
        </button>
      )}
    </div>
  );
};

export default EmptyState;
