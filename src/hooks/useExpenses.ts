import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'fixed' | 'variable';
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'fixed' | 'variable';
}

export interface UpdateExpenseData {
  date?: string;
  description?: string;
  category?: string;
  amount?: number;
  type?: 'fixed' | 'variable';
}

// Hook para listar despesas
export const useExpenses = (startDate: string, endDate: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false });

        if (error) throw error;

        setExpenses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [startDate, endDate]);

  return { expenses, loading, error };
};

// Função para criar despesa
export const createExpense = async (data: CreateExpenseData): Promise<Expense> => {
  const supabase = supabaseBrowser();
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return expense;
};

// Função para atualizar despesa
export const updateExpense = async (id: string, data: UpdateExpenseData): Promise<Expense> => {
  const supabase = supabaseBrowser();
  const { data: expense, error } = await supabase
    .from('expenses')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return expense;
};

// Função para excluir despesa
export const deleteExpense = async (id: string): Promise<void> => {
  const supabase = supabaseBrowser();
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 