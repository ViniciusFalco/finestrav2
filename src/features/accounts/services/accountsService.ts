import { createBrowserSupabaseClient } from '@/lib/supabaseClient';

const supabase = createBrowserSupabaseClient();

export type AccountDTO = {
  name: string; // “Minha conta Nubank”
  group: 'Despesas Fixas' | 'Despesas Variáveis';
  subgroup: string; // “Aluguel”, “Marketing” …
};

export async function listAccounts() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function createAccount(dto: AccountDTO) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const { data, error } = await supabase
    .from('accounts')
    .insert([{ ...dto, user_id: userId }]);
  if (error) throw error;
  return data;
}

export async function updateAccount(id: string, dto: AccountDTO) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const { data, error } = await supabase
    .from('accounts')
    .update({ ...dto, user_id: userId })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function deleteAccount(id: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  const { data, error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
  return data;
} 