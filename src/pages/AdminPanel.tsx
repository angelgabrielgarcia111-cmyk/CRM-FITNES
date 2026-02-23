import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, RefreshCw, Ban, LogOut, Shield } from 'lucide-react';

interface TrainerInvite {
  id: string;
  email: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  accepted_at: string | null;
}

const AdminPanel = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<TrainerInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchInvites = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('trainer_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites((data as TrainerInvite[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch invites:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchInvites(); }, []);

  const sendInvite = async (targetEmail?: string) => {
    const inviteEmail = (targetEmail || email).trim().toLowerCase();
    if (!inviteEmail) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('invite-trainer', {
        body: { email: inviteEmail },
      });

      if (error) throw error;
      if (!data?.ok) throw new Error(data?.message || 'Failed to send invite');

      toast({ title: 'Sucesso', description: data.message });
      setEmail('');
      fetchInvites();
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const revokeInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('trainer_invites')
        .update({ status: 'revoked' })
        .eq('id', inviteId);

      if (error) throw error;
      toast({ title: 'Convite revogado' });
      fetchInvites();
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'accepted': return 'secondary';
      case 'revoked': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Invite Form */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Convidar Trainer</h2>
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="trainer-email">Email do Trainer</Label>
              <Input
                id="trainer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainer@example.com"
                onKeyDown={(e) => e.key === 'Enter' && sendInvite()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => sendInvite()} disabled={loading || !email.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Enviar
              </Button>
            </div>
          </div>
        </section>

        {/* Invites List */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Convites de Trainers</h2>
            <Button variant="ghost" size="sm" onClick={fetchInvites} disabled={fetching}>
              <RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {invites.length === 0 && !fetching ? (
            <p className="text-sm text-muted-foreground">Nenhum convite enviado ainda.</p>
          ) : (
            <div className="space-y-3">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{inv.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColor(inv.status)}>{inv.status}</Badge>
                      {inv.sent_at && (
                        <span className="text-xs text-muted-foreground">
                          Enviado: {new Date(inv.sent_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {inv.status === 'sent' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => sendInvite(inv.email)}>
                          <RefreshCw className="h-3 w-3 mr-1" /> Reenviar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => revokeInvite(inv.id)}>
                          <Ban className="h-3 w-3 mr-1" /> Revogar
                        </Button>
                      </>
                    )}
                    {inv.status === 'revoked' && (
                      <Button size="sm" variant="outline" onClick={() => sendInvite(inv.email)}>
                        <Send className="h-3 w-3 mr-1" /> Reenviar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
