import React, { useState } from 'react';
import { Zap, Utensils, ClipboardList, Pen, Send, Loader2 } from 'lucide-react';

type MainTab = 'treinos' | 'dietas';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const initialChat: ChatMsg[] = [
  { role: 'assistant', content: 'Olá! Sou seu assistente de IA. Como posso ajudar você hoje com seus treinos, dietas e alunos?', time: 'agora' },
];

const mockTreino = {
  tags: ['EMAGRECIMENTO', 'INTERMEDIÁRIO'],
  exercises: [
    { name: 'Burpees', sets: '4 séries de 12 a 15 repetições', tip: 'Mantenha um ritmo constante e execute o salto final com explosão.', rest: '30 segundos' },
    { name: 'Agachamento com Salto', sets: '4 séries de 15 a 20 repetições', tip: 'Foque em aterrissar suavemente para proteger as articulações.', rest: '45 segundos' },
    { name: 'Flexão de Braços', sets: '3 séries até a falha técnica', tip: 'Mantenha o core contraído e o corpo alinhado durante todo o movimento.', rest: '45 segundos' },
    { name: 'Afundo Alternado', sets: '3 séries de 12 repetições por perna', tip: 'Dê um passo largo para trás e desça o joelho em direção ao chão sem tocá-lo.', rest: '30 segundos' },
    { name: 'Prancha Abdominal', sets: '3 séries de 60 segundos', tip: 'Mantenha os cotovelos sob os ombros e a coluna neutra sem elevar o quadril.', rest: '30 segundos' },
    { name: 'Polichinelos', sets: '4 séries de 45 segundos', tip: 'Realize o movimento de forma rápida para manter a frequência cardíaca elevada.', rest: '15 segundos' },
  ],
  dica: 'Priorize a intensidade e o tempo sob tensão. Tente reduzir os intervalos se o treino se tornar fácil e mantenha a consistência diária para maximizar o gasto calórico.',
};

const mockDieta = {
  tags: ['EMAGRECIMENTO', 'LOW-CARB', 'DOENÇA RENAL'],
  meals: [
    { name: 'Café da Manhã', time: '08:00', kcal: 450, items: ['3 ovos mexidos preparados com manteiga', '1/2 abacate médio picado', 'Café preto sem açúcar'] },
    { name: 'Almoço', time: '12:00', kcal: 500, items: ['200g de peito de frango grelhado', '100g de brócolis cozido no vapor', 'Salada de mix de folhas verdes', '1 colher de sopa de azeite de oliva extra virgem'] },
    { name: 'Lanche da Tarde', time: '15:30', kcal: 180, items: ['30g de castanha-do-pará', '1 potinho de iogurte grego natural integral sem açúcar'] },
    { name: 'Jantar', time: '19:30', kcal: 450, items: ['150g de filé de salmão assado', '100g de vagem refogada no alho', 'Salada de tomate cereja com manjericão'] },
    { name: 'Ceia', time: '21:00', kcal: 300, items: ['1 scoop de whey protein isolado batido com água', '10g de chocolate amargo 85% cacau'] },
  ],
  macros: { proteina: '154g', carboidrato: '100g', gordura: '114g' },
};

const selectClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none";

const IACriationModule: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('treinos');
  const [generating, setGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initialChat);
  const [chatInput, setChatInput] = useState('');

  // Treino form
  const [objetivo, setObjetivo] = useState('');
  const [equipamentos, setEquipamentos] = useState('');
  const [nivel, setNivel] = useState('');
  const [obsT, setObsT] = useState('');

  // Dieta form
  const [objNutri, setObjNutri] = useState('');
  const [tipoDieta, setTipoDieta] = useState('');
  const [nivelAtividade, setNivelAtividade] = useState('');
  const [restricoes, setRestricoes] = useState('');

  const handleGenerate = () => {
    setGenerating(true);
    setShowPlan(false);
    setTimeout(() => {
      setGenerating(false);
      setShowPlan(true);
    }, 2000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMsg = { role: 'user', content: chatInput, time: 'agora' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Aqui estão algumas estratégias eficazes:\n• Defina metas pequenas e alcançáveis\n• Celebre cada conquista\n• Varie os exercícios para manter o interesse\n• Use gamificação com desafios',
        time: 'agora',
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
          <ClipboardList size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Criação com IA</h1>
          <p className="text-sm text-muted-foreground">Gere planos personalizados automaticamente com inteligência artificial</p>
        </div>
      </div>

      {/* Main Tab */}
      <div className="flex bg-card border border-border rounded-xl overflow-hidden">
        <button onClick={() => { setMainTab('treinos'); setShowPlan(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${mainTab === 'treinos' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          <Zap size={16} /> Treinos
        </button>
        <button onClick={() => { setMainTab('dietas'); setShowPlan(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${mainTab === 'dietas' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          <Utensils size={16} /> Dietas
        </button>
      </div>

      {/* Config + Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Config */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-foreground">
            {mainTab === 'treinos' ? 'Configuração do Treino' : 'Configuração da Dieta'}
          </h2>

          {mainTab === 'treinos' ? (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">OBJETIVO PRINCIPAL</label>
                <select value={objetivo} onChange={e => setObjetivo(e.target.value)} className={selectClass}>
                  <option value="">Selecione o objetivo</option>
                  <option>Hipertrofia</option><option>Emagrecimento</option><option>Condicionamento Físico</option><option>Ganho de Força</option><option>Resistência</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">EQUIPAMENTOS DISPONÍVEIS</label>
                <select value={equipamentos} onChange={e => setEquipamentos(e.target.value)} className={selectClass}>
                  <option value="">Selecione os equipamentos</option>
                  <option>Academia Completa</option><option>Apenas Peso Corporal</option><option>Halteres</option><option>Elásticos e Faixas</option><option>Equipamentos Funcionais</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">NÍVEL DE EXPERIÊNCIA</label>
                <select value={nivel} onChange={e => setNivel(e.target.value)} className={selectClass}>
                  <option value="">Selecione o nível</option>
                  <option>Iniciante</option><option>Intermediário</option><option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">OBSERVAÇÕES ADICIONAIS</label>
                <textarea value={obsT} onChange={e => setObsT(e.target.value)} rows={3} placeholder="Ex: Lesão no joelho direito, preferência por treinos curtos..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">OBJETIVO NUTRICIONAL</label>
                <select value={objNutri} onChange={e => setObjNutri(e.target.value)} className={selectClass}>
                  <option value="">Selecione o objetivo</option>
                  <option>Ganho de Massa</option><option>Emagrecimento</option><option>Manutenção</option><option>Performance</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">TIPO DE DIETA</label>
                <select value={tipoDieta} onChange={e => setTipoDieta(e.target.value)} className={selectClass}>
                  <option value="">Selecione o tipo</option>
                  <option>Balanceada</option><option>Low-Carb</option><option>Cetogênica</option><option>Vegetariana</option><option>Vegana</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">NÍVEL DE ATIVIDADE</label>
                <select value={nivelAtividade} onChange={e => setNivelAtividade(e.target.value)} className={selectClass}>
                  <option value="">Selecione o nível</option>
                  <option>Sedentário</option><option>Atividade Leve</option><option>Atividade Moderada</option><option>Atividade Intensa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 block">RESTRIÇÕES E PREFERÊNCIAS</label>
                <textarea value={restricoes} onChange={e => setRestricoes(e.target.value)} rows={3} placeholder="Ex: Alergia a frutos do mar, intolerância à lactose..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
            </>
          )}

          <button onClick={handleGenerate} disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {generating ? <Loader2 size={16} className="animate-spin" /> : mainTab === 'treinos' ? <Zap size={16} /> : <Utensils size={16} />}
            {generating ? 'Gerando...' : mainTab === 'treinos' ? 'Gerar Plano com IA' : 'Gerar Dieta com IA'}
          </button>
        </div>

        {/* Result */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            {mainTab === 'treinos' ? 'Plano Gerado' : 'Dieta Gerada'}
          </h2>

          {generating && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <p className="text-sm">A IA está processando...</p>
            </div>
          )}

          {!generating && !showPlan && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ClipboardList size={40} className="mb-4" />
              <p className="text-sm text-center max-w-[250px]">
                Configure os parâmetros e clique em "{mainTab === 'treinos' ? 'Gerar Plano com IA' : 'Gerar Dieta com IA'}" para criar um {mainTab === 'treinos' ? 'treino personalizado' : 'plano nutricional personalizado'}
              </p>
            </div>
          )}

          {!generating && showPlan && mainTab === 'treinos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Treino Personalizado</h3>
                  <div className="flex gap-2 mt-1">
                    {mockTreino.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold bg-primary/20 text-primary px-2.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"><Pen size={12} /> Editar</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"><Send size={12} /> Enviar</button>
                </div>
              </div>
              {mockTreino.exercises.map(ex => (
                <div key={ex.name} className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-foreground">{ex.name}</h4>
                    <span className="text-xs font-medium text-primary">{ex.sets}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ex.tip}</p>
                  <p className="text-xs text-foreground mt-1">Descanso: <span className="font-medium">{ex.rest}</span></p>
                </div>
              ))}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-bold text-primary mb-1">DICAS DA IA</p>
                <p className="text-xs text-muted-foreground">{mockTreino.dica}</p>
              </div>
            </div>
          )}

          {!generating && showPlan && mainTab === 'dietas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Plano Nutricional</h3>
                  <div className="flex gap-2 mt-1">
                    {mockDieta.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold bg-primary/20 text-primary px-2.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"><Pen size={12} /> Editar</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"><Send size={12} /> Enviar</button>
                </div>
              </div>
              {mockDieta.meals.map(meal => (
                <div key={meal.name} className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{meal.name}</h4>
                      <span className="text-[10px] text-muted-foreground">🕐 {meal.time}</span>
                    </div>
                    <span className="text-xs font-medium text-primary">{meal.kcal} kcal</span>
                  </div>
                  <ul className="space-y-0.5 mt-2">
                    {meal.items.map(item => (
                      <li key={item} className="text-xs text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-bold text-primary mb-2">INFORMAÇÕES NUTRICIONAIS</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-lg font-bold text-foreground">{mockDieta.macros.proteina}</p><p className="text-[10px] text-muted-foreground">PROTEÍNA</p></div>
                  <div><p className="text-lg font-bold text-foreground">{mockDieta.macros.carboidrato}</p><p className="text-[10px] text-muted-foreground">CARBOIDRATO</p></div>
                  <div><p className="text-lg font-bold text-foreground">{mockDieta.macros.gordura}</p><p className="text-[10px] text-muted-foreground">GORDURA</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Assistente IA - Chat</h3>
          <span className="flex items-center gap-1.5 text-xs text-primary"><span className="w-2 h-2 rounded-full bg-primary" /> ONLINE</span>
        </div>
        <div className="p-5 space-y-4 max-h-[300px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-xl rounded-tr-sm' : 'bg-background text-foreground rounded-xl rounded-tl-sm'} px-4 py-2.5`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-right opacity-70' : 'text-muted-foreground'}`}>
                  {msg.role === 'assistant' ? 'ATLONIA' : 'VOCÊ'} • {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleChatSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={handleChatSend} className="p-2 text-primary hover:text-primary/80 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IACriationModule;
