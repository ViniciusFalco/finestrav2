import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';

interface UserInfo {
  name: string;
  avatarUrl?: string;
}

export function useUser(): UserInfo {
  const [user, setUser] = useState<UserInfo>({ name: 'Usuário' });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = supabaseBrowser();
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

  return user;
} 