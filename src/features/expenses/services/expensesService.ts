import { supabaseBrowser } from '@/lib/supabaseClient.browser';
import { ExpenseFormData } from '../schemas';

export async function listExpenses(userId: string) {
  const { data, error } = await supabaseBrowser()
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('dueDate', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createExpense(userId: string, dto: ExpenseFormData) {
  const { data, error } = await supabaseBrowser()
    .from('expenses')
    .insert([{ ...dto, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpense(id: string, userId: string, dto: Partial<ExpenseFormData>) {
  const { data, error } = await supabaseBrowser()
    .from('expenses')
    .update(dto)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string, userId: string) {
  const { error } = await supabaseBrowser()
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
  return true;
} 