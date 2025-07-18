import { supabase } from '@/lib/supabaseClient';
import { ExpenseFormData } from '../schemas';

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}

export async function listExpenses() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('expenses')
    .select('*, account:accounts(id, name), category:categories(id, name, parent_id)')
    .eq('user_id', userId)
    .order('due_date', { ascending: false });
  if (error) throw error;
  return data;
}

export interface CreateExpenseDTO {
  account_id: string;
  category_id: string;
  value: number;
  interest?: number;
  dueDate: string;
  paymentDate?: string | null;
}

export async function createExpense(dto: CreateExpenseDTO) {
  const userId = await getUserId();
  // Valor total = valor + juros (calculado antes do insert)
  const total = (dto.value ?? 0) + (dto.interest ?? 0);
  const { data, error } = await supabase
    .from('expenses')
    .insert([{ 
      user_id: userId,
      account_id: dto.account_id,
      category_id: dto.category_id, // FK para categories
      value: dto.value,
      interest: dto.interest ?? 0,
      total,
      due_date: dto.dueDate,
      payment_date: dto.paymentDate ?? null
    }])
    .select()
    .single();
  if (error) throw error;
  // Status é calculado no SQL (ver regra de negócio)
  return data;
}

export async function updateExpense(id: string, dto: Partial<ExpenseFormData & { account_id: string; category_id: string }>) {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('expenses')
    .update(dto)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string) {
  const userId = await getUserId();
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
  return true;
} 