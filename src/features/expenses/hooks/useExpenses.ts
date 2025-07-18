import useSWR from 'swr';
import { listExpenses } from '../services/expensesService';

export function useExpenses(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ['expenses', userId] : null,
    () => listExpenses(userId)
  );

  return {
    expenses: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
} 