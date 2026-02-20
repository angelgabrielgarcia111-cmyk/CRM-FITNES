import React, { useState } from 'react';
import { Calendar, Clock, User, Check, X, Plus } from 'lucide-react';

const sessions = [
  { time: '08:00', name: 'Ana Silva', type: 'Treino Individual', status: 'CONFIRMADO' },
  { time: '09:30', name: 'Carlos Santos', type: 'Avaliação', status: 'PENDENTE' },
  { time: '11:00', name: 'Maria Costa', type: 'Treino Individual', status: 'CONFIRMADO' },
  { time: '14:00', name: 'João Oliveira', type: 'Consultoria', status: 'PENDENTE' },
  { time: '16:30', name: 'Pedro Lima', type: 'Treino Individual', status: 'CONFIRMADO' },
];

const weekData = [
  { day: 'Seg', scheduled: 8, free: 2 },
  { day: 'Ter', scheduled: 6, free: 4 },
  { day: 'Qua', scheduled: 7, free: 3 },
  { day: 'Qui', scheduled: 5, free: 5 },
  { day: 'Sex', scheduled: 9, free: 1 },
  { day: 'Sáb', scheduled: 4, free: 6 },
  { day: 'Dom', scheduled: 0, free: 0 },
];

const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

const AgendaModule: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1)); // June 2025
  const selectedDay = 11;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => daysInPrevMonth - firstDayOfMonth + 1 + i);
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const goToPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Calendar size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Controle de Agenda</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus horários e sessões</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Calendário</h3>
          <div className="flex items-center justify-between mb-4">
            <button onClick={goToPrevMonth} className="text-muted-foreground hover:text-foreground p-1">
              &lt;
            </button>
            <span className="text-sm font-medium text-foreground">{monthName}</span>
            <button onClick={goToNextMonth} className="text-muted-foreground hover:text-foreground p-1">
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {prevMonthDays.map(d => (
              <div key={`p-${d}`} className="text-center text-xs text-muted-foreground/40 py-1.5">{d}</div>
            ))}
            {currentDays.map(d => (
              <div
                key={d}
                className={`text-center text-xs py-1.5 rounded-md cursor-pointer transition-colors ${
                  d === selectedDay
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-foreground hover:bg-muted/20'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <button className="w-full mt-5 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Nova Sessão
          </button>
        </div>

        {/* Agenda de Hoje */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold text-foreground">Agenda de Hoje</h3>
            <span className="text-xs font-bold bg-primary/20 text-primary px-2.5 py-1 rounded">
              5 SESSÕES
            </span>
          </div>

          <div className="space-y-1">
            {sessions.map((s, i) => (
              <div key={i} className="relative pl-6 pb-5 last:pb-0">
                {/* Timeline line */}
                {i < sessions.length - 1 && (
                  <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-border bg-card flex items-center justify-center">
                  <Clock size={10} className="text-muted-foreground" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{s.time}</span>
                    <span className={`text-xs font-bold ${
                      s.status === 'CONFIRMADO' ? 'text-primary' : 'text-warning'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.type}</p>

                  {s.status === 'PENDENTE' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                        <Check size={14} />
                        Aprovar
                      </button>
                      <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visão Semanal */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground mb-5">Visão Semanal</h3>

          <div className="space-y-3">
            {weekData.map((w) => (
              <div key={w.day} className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium w-10">{w.day}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-primary text-xs">{w.scheduled} agendadas</span>
                </div>
                <span className="text-muted-foreground text-xs">{w.free} LIVRES</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full py-2.5 bg-muted/20 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/30 transition-colors">
              Definir Disponibilidade
            </button>
            <button className="w-full py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/10 transition-colors">
              Configurar Horários
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaModule;
