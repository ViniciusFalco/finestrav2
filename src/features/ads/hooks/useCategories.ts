import useSWR from 'swr';
import { createBrowserSupabaseClient } from '@/lib/supabaseClient';

export interface Category {
  id: string;
  name: string;
  group?: string;
  parent_id?: string | null;
}

async function fetchCategories() {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  if (error) throw error;
  return data as Category[];
}

export function useCategories() {
  const { data, error, isLoading } = useSWR('categories', fetchCategories);
  return {
    categories: data || [],
    isLoading,
    error,
  };
} 