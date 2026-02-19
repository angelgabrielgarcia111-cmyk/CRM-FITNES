import React from 'react';

export enum View {
  DASHBOARD = 'DASHBOARD',
  ALUNOS = 'ALUNOS',
  AGENDA = 'AGENDA',
  NOTIFICACOES = 'NOTIFICACOES',
  CONSULTORIA = 'CONSULTORIA',
  PREDEFINICOES = 'PREDEFINICOES',
  GAMIFICACAO = 'GAMIFICACAO',
  COMUNICACAO = 'COMUNICACAO',
  PAGAMENTOS = 'PAGAMENTOS',
  PRODUTOS_CURSOS = 'PRODUTOS_CURSOS',
  AVALIACOES_RELATORIOS = 'AVALIACOES_RELATORIOS',
  IA_CREATION = 'IA_CREATION',
  CONFIGURACOES = 'CONFIGURACOES'
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'bronze' | 'gold' | 'platinum';
  points: number;
}

export interface Reward {
  id: string;
  name: string;
  status: 'disponivel' | 'esgotado';
  points: number;
}

export interface WorkoutExercise {
  name: string;
  series: string;
  reps: string;
  rest: string;
}

export interface DietMeal {
  name: string;
  items: string[];
  calories: string;
}
