import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';

export interface Sale {
  id: string;
  date: string;
  product: string;
  platform: string;
  quantity: number;
  amount: number;
  refunds: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSaleData {
  date: string;
  product: string;
  platform: string;
  quantity: number;
  amount: number;
  refunds?: number;
}

export interface UpdateSaleData {
  date?: string;
  product?: string;
  platform?: string;
  quantity?: number;
  amount?: number;
  refunds?: number;
}

// Hook para listar vendas
export const useSales = (startDate: string, endDate: string) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false });

        if (error) throw error;

        setSales(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [startDate, endDate]);

  return { sales, loading, error };
};

// Função para criar venda
export const createSale = async (data: CreateSaleData): Promise<Sale> => {
  const supabase = supabaseBrowser();
  const { data: sale, error } = await supabase
    .from('sales')
    .insert([{ ...data, refunds: data.refunds || 0 }])
    .select()
    .single();

  if (error) throw error;
  return sale;
};

// Função para atualizar venda
export const updateSale = async (id: string, data: UpdateSaleData): Promise<Sale> => {
  const supabase = supabaseBrowser();
  const { data: sale, error } = await supabase
    .from('sales')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return sale;
};

// Função para excluir venda
export const deleteSale = async (id: string): Promise<void> => {
  const supabase = supabaseBrowser();
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 