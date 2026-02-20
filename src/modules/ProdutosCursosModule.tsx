import React, { useState } from 'react';
import { Package, TrendingUp, DollarSign, BookOpen, Users, Play, Plus, Clock, Star, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type Tab = 'produtos' | 'cursos';

const produtosMetrics = [
  { label: 'TOTAL DE PRODUTOS', value: '2', icon: <Package size={22} /> },
  { label: 'TOTAL EM ESTOQUE', value: '40', icon: <TrendingUp size={22} /> },
  { label: 'VALOR TOTAL', value: 'R$ 2922.50', icon: <DollarSign size={22} /> },
];

const cursosMetrics = [
  { label: 'CURSOS PUBLICADOS', value: '3', icon: <BookOpen size={22} /> },
  { label: 'ALUNOS INSCRITOS', value: '479', icon: <Users size={22} /> },
  { label: 'RECEITA GERADA', value: 'R$ 63865.00', icon: <TrendingUp size={22} /> },
  { label: 'MAIS POPULAR', value: 'Mindset do Atleta Vencedor', icon: <Play size={22} /> },
];

const produtos = [
  { name: 'Whey Protein Premium', desc: 'Proteína de alta qualidade para atletas', price: 'R$ 89.50', stock: 25 },
  { name: 'Creatina Monohidratada', desc: 'Suplemento para ganho de força e massa', price: 'R$ 45.00', stock: 15 },
];

const cursos = [
  { name: 'Nutrição Esportiva Avançada', desc: 'Curso completo sobre nutrição para atletas de alto rendimento', weeks: 8, students: 156, rating: 4.8, progress: 65, price: 'R$ 297.00', tag: 'NUTRIÇÃO' },
  { name: 'Treinamento Funcional Intensivo', desc: 'Metodologia completa de treinamento funcional', weeks: 12, students: 89, rating: 4.9, progress: 45, price: 'R$ 197.00', tag: 'TREINAMENTO' },
  { name: 'Mindset do Atleta Vencedor', desc: 'Desenvolvimento mental para performance máxima', weeks: 6, students: 234, rating: 4.7, progress: 72, price: 'Gratuito', tag: 'MINDSET', free: true },
];

const ProdutosCursosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('produtos');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Produtos e Cursos</h1>

      {/* Tab switcher */}
      <div className="flex bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('produtos')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'produtos' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('cursos')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'cursos' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Cursos e Mentorias
        </button>
      </div>

      {/* Metrics */}
      <div className={`grid grid-cols-1 gap-4 ${activeTab === 'produtos' ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {(activeTab === 'produtos' ? produtosMetrics : cursosMetrics).map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider">{m.label}</span>
              <div className="text-primary">{m.icon}</div>
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'produtos' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Meus Produtos</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Adicionar Produto
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {produtos.map(p => (
              <div key={p.name} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="h-40 bg-muted/30 flex items-center justify-center text-muted-foreground">
                  <Package size={40} />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-primary">{p.price}</span>
                    <span className="text-xs text-muted-foreground">ESTOQUE: {p.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'cursos' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Meus Cursos e Mentorias</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Publicar Curso ou Mentoria
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cursos.map(c => (
              <div key={c.name} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="h-40 bg-muted/30 flex items-center justify-center relative">
                  <BookOpen size={40} className="text-muted-foreground" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold bg-primary/80 text-primary-foreground px-2 py-0.5 rounded">{c.tag}</span>
                  {c.free && <span className="absolute top-3 right-3 text-[10px] font-bold bg-primary/80 text-primary-foreground px-2 py-0.5 rounded">GRATUITO</span>}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={12} /> {c.weeks} semanas</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {c.students}</span>
                    <span className="flex items-center gap-1 text-yellow-400"><Star size={12} fill="currentColor" /> {c.rating}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>PROGRESSO MÉDIO</span>
                      <span>{c.progress}%</span>
                    </div>
                    <Progress value={c.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-primary">{c.price}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProdutosCursosModule;
