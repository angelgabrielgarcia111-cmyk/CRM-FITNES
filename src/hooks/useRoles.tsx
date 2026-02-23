import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AppRole = 'admin' | 'trainer' | 'student';

export const useRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;
        setRoles((data || []).map((r: any) => r.role as AppRole));
      } catch (err) {
        console.error('[useRoles] error:', err);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [user?.id]);

  return {
    roles,
    loading,
    isAdmin: roles.includes('admin'),
    isTrainer: roles.includes('trainer'),
    isStudent: roles.includes('student'),
    hasRole: (role: AppRole) => roles.includes(role),
  };
};
