import { createBrowserSupabaseClient } from '@/lib/supabaseClient';
import type { AccountDto } from '../types';

const supabase = createBrowserSupabaseClient();

export async function listAccounts(userId: string) {
  return supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function createAccount(userId: string, dto: AccountDto) {
  return supabase.from('accounts').insert([{ ...dto, user_id: userId }]);
} 