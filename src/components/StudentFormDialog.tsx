import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Student = Tables<'students'>;

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSubmit: (data: {
    name: string;
    email: string;
    status: string;
    plan: string;
    modality: string;
    due_date: string;
  }) => void;
  loading: boolean;
}

const StudentFormDialog = ({ open, onOpenChange, student, onSubmit, loading }: StudentFormDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('active');
  const [plan, setPlan] = useState('');
  const [modality, setModality] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email || '');
      setStatus(student.status);
      setPlan(student.plan || '');
      setModality(student.modality || '');
      setDueDate(student.due_date || '');
    } else {
      setName(''); setEmail(''); setStatus('active');
      setPlan(''); setModality(''); setDueDate('');
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    onSubmit({ name, email, status, plan, modality, due_date: dueDate });
  };

  const isEdit = !!student;
  const selectClass = "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Aluno' : 'Adicionar Aluno'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-name">Nome *</Label>
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome do aluno" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-email">E-mail</Label>
            <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Modalidade</Label>
              <select value={modality} onChange={(e) => setModality(e.target.value)} className={selectClass}>
                <option value="">Selecionar</option>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Plano</Label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className={selectClass}>
                <option value="">Selecionar</option>
                <option value="Plano Mensal">Mensal</option>
                <option value="Plano Trimestral">Trimestral</option>
                <option value="Plano Semestral">Semestral</option>
                <option value="Plano Anual">Anual</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormDialog;
