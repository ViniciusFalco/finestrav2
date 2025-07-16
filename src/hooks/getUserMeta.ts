import { createClient } from '@/lib/supabaseServer';

export async function getUserMeta() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { full_name, avatar_url } = data.user?.user_metadata ?? {};
  return { name: full_name ?? 'Usuário', avatarUrl: avatar_url };
} 