import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function getServerSupabase() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // @ts-expect-error — métodos expostos em runtime pelo Next 15
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // Não precisa alterar cookies no SSR normalmente
      },
    }
  );
  return { supabase };
} 