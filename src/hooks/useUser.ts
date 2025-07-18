import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserInfo {
  name: string;
  avatarUrl?: string;
  signOut: () => Promise<void>;
}

export function useUser(): UserInfo {
  const [user, setUser] = useState<{ name: string; avatarUrl?: string }>({ name: 'Usuário' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      let name = 'Usuário';
      let avatarUrl = undefined;
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        avatarUrl = meta.avatar_url || undefined;
        if (meta.name && meta.name.trim()) {
          name = meta.name;
        } else if (data.user.email) {
          name = data.user.email.split('@')[0];
        }
      }
      setUser({ name, avatarUrl });
    };
    fetchUser();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return { ...user, signOut };
} 