import useSWR from 'swr';
import { listExpenses } from '../services/expensesService';

export function useExpenses() {
  const { data, error, isLoading, mutate } = useSWR('expenses', listExpenses);

  return {
    expenses: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
} 