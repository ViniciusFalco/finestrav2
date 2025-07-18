import useSWR from 'swr';
import { listAccounts } from '../services/accountsService';

export function useAccounts(userId: string) {
  const fetcher = () => listAccounts(userId).then(r => r.data ?? []);
  const { data, error, mutate } = useSWR(['accounts', userId], fetcher);
  return { accounts: data ?? [], isLoading: !error && !data, refresh: mutate };
} 