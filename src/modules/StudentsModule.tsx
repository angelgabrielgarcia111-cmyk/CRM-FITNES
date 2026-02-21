import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Users, Eye, CalendarPlus, AlertCircle, Search, Pencil, Trash2, TrendingUp, Clock, UserPlus, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import StudentFormDialog from '@/components/StudentFormDialog';
import DeleteStudentDialog from '@/components/DeleteStudentDialog';
import type { Tables } from '@/integrations/supabase/types';

type Student = Tables<'students'>;

const statusLabels: Record<string, string> = { active: 'ATIVO', inactive: 'INATIVO', pending: 'PENDENTE' };
const statusColors: Record<string, string> = {
  active: 'bg-success/20 text-success',
  inactive: 'bg-destructive/20 text-destructive',
  pending: 'bg-warning/20 text-warning',
};

const StudentsModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [mutating, setMutating] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Student[];
    },
  });

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchName = !searchName || s.name.toLowerCase().includes(searchName.toLowerCase());
      const matchEmail = !searchEmail || (s.email || '').toLowerCase().includes(searchEmail.toLowerCase());
      return matchName && matchEmail;
    });
  }, [students, searchName, searchEmail]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const newThisMonth = students.filter((s) => new Date(s.created_at) >= startOfMonth).length;
  const pendingStudents = students.filter((s) => s.status === 'pending').length;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['students'] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('students').insert({ ...data, trainer_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); setFormOpen(false); toast({ title: 'Aluno adicionado com sucesso!' }); },
    onError: (e: any) => toast({ title: 'Erro ao adicionar', description: e.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from('students').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); setFormOpen(false); setEditingStudent(null); toast({ title: 'Aluno atualizado!' }); },
    onError: (e: any) => toast({ title: 'Erro ao atualizar', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); setDeleteTarget(null); toast({ title: 'Aluno excluído!' }); },
    onError: (e: any) => toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' }),
  });

  const inviteMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { data, error } = await supabase.functions.invoke('invite-student', {
        body: { student_id: studentId },
      });
      if (error) throw error;
      if (data && !data.ok) throw new Error(data.message || 'Erro desconhecido');
    },
    onSuccess: () => { invalidate(); toast({ title: 'Convite enviado com sucesso!' }); },
    onError: (e: any) => toast({ title: 'Erro ao enviar convite', description: e.message, variant: 'destructive' }),
  });

  const handleFormSubmit = (data: any) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEdit = (s: Student) => { setEditingStudent(s); setFormOpen(true); };
  const openCreate = () => { setEditingStudent(null); setFormOpen(true); };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie todos os seus alunos em um só lugar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <UserPlus size={16} />
          Adicionar Aluno
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <MetricCard label="Total de Alunos" value={totalStudents} icon={Users} sub={`+${newThisMonth} este mês`} subIcon={TrendingUp} subColor="text-success" />
            <MetricCard label="Alunos Ativos" value={activeStudents} icon={Eye} sub={totalStudents ? `${Math.round((activeStudents / totalStudents) * 100)}% do total` : '0%'} subIcon={TrendingUp} subColor="text-success" />
            <MetricCard label="Novos Este Mês" value={newThisMonth} icon={CalendarPlus} sub="este mês" subIcon={TrendingUp} subColor="text-success" />
            <MetricCard label="Pendentes" value={pendingStudents} icon={AlertCircle} sub="Requer atenção" subIcon={Clock} subColor="text-warning" iconBg="bg-warning/10" iconColor="text-warning" />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por nome" value={searchName} onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por e-mail" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* Students Table */}
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
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Conta</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><Skeleton className="h-5 w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    {students.length === 0 ? (
                      <div className="space-y-2">
                        <Users size={40} className="mx-auto text-muted-foreground/40" />
                        <p className="font-medium">Nenhum aluno cadastrado</p>
                        <p className="text-sm">Clique em "Adicionar Aluno" para começar.</p>
                      </div>
                    ) : (
                      'Nenhum resultado encontrado.'
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded ${statusColors[s.status] || 'bg-muted text-muted-foreground'}`}>
                        {statusLabels[s.status] || s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{s.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{s.plan || '—'}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{s.modality || '—'}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {s.due_date ? (
                        <div className="flex items-center gap-1.5">
                          <CalendarPlus size={14} />
                          {s.due_date}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {s.user_id ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/20 px-2.5 py-1 rounded">
                          <CheckCircle2 size={12} />
                          Conta ativa
                        </span>
                      ) : (
                        <button
                          onClick={() => inviteMutation.mutate(s.id)}
                          disabled={!s.email || inviteMutation.isPending}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={!s.email ? 'Cadastre um email primeiro' : 'Enviar convite'}
                        >
                          {inviteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                          Convidar
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded hover:bg-muted/20 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingStudent(null); }}
        student={editingStudent}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />

      <DeleteStudentDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        studentName={deleteTarget?.name || ''}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, sub, subIcon: SubIcon, subColor, iconBg = 'bg-primary/10', iconColor = 'text-primary' }: any) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    <div className={`flex items-center gap-1.5 mt-3 text-xs ${subColor}`}>
      <SubIcon size={14} />
      <span>{sub}</span>
    </div>
  </div>
);

export default StudentsModule;
