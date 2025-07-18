import useSWR from 'swr';
import { listAccounts } from '../services/accountsService';

export function useAccounts() {
  const { data, error, mutate } = useSWR('accounts', listAccounts);
  return {
    accounts: data ?? [],
    isLoading: !data && !error,
    error,
    refresh: mutate,
  };
} 