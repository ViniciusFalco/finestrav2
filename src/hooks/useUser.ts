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
      if (data?.user?.user_metadata) {
        setUser({
          name: data.user.user_metadata.name || 'Usuário',
          avatarUrl: data.user.user_metadata.avatar_url || undefined,
        });
      }
    };
    fetchUser();
  }, []);

  return user;
} 