import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '../schemas';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import type { Account, Group, Subgroup } from '@/features/accounts/types';

interface ExpenseFormProps {
  userId: string;
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => void;
  onClose: () => void;
}

export function ExpenseForm({ userId, initialData, onSubmit, onClose }: ExpenseFormProps) {
  const { accounts, isLoading } = useAccounts(userId);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {},
  });

  React.useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  const selectedAccount = watch('account');
  const today = new Date().toISOString().split('T')[0];

  const groups: Group[] = useMemo(() => {
    return accounts.find((a: Account) => a.id === selectedAccount)?.groups || [];
  }, [selectedAccount, accounts]);

  const subgroups: Subgroup[] = useMemo(() => {
    const group = groups.find((g: Group) => g.id === watch('group'));
    return group?.subgroups || [];
  }, [selectedAccount, groups, accounts, watch]);

  if (!isLoading && accounts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center">
          <p className="text-red-600 font-semibold mb-4">Cadastre uma conta antes de lançar despesas.</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-3"
      >
        <h2 className="text-lg font-bold mb-2">{initialData ? 'Editar Despesa' : 'Nova Despesa'}</h2>
        {/* Conta */}
        <div>
          <label className="block text-xs font-medium after:content-['*'] after:text-red-500">Conta</label>
          <Controller
            name="account"
            control={control}
            render={({ field }) => (
              <select {...field} className="input">
                <option value="">Selecione</option>
                {accounts.map((a: Account) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}
          />
          {errors.account && <span className="text-red-500 text-xs">{errors.account.message}</span>}
        </div>
        {/* Grupo */}
        <div>
          <label className="block text-xs font-medium after:content-['*'] after:text-red-500">Grupo</label>
          <Controller
            name="group"
            control={control}
            render={({ field }) => (
              <select {...field} className="input" disabled={!selectedAccount}>
                <option value="">Selecione</option>
                {groups.map((g: Group) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
          />
          {errors.group && <span className="text-red-500 text-xs">{errors.group.message}</span>}
        </div>
        {/* Subgrupo */}
        <div>
          <label className="block text-xs font-medium after:content-['*'] after:text-red-500">Subgrupo</label>
          <Controller
            name="subgroup"
            control={control}
            render={({ field }) => (
              <select {...field} className="input" disabled={!watch('group')}>
                <option value="">Selecione</option>
                {subgroups.map((sg: Subgroup) => (
                  <option key={sg.id} value={sg.id}>{sg.name}</option>
                ))}
              </select>
            )}
          />
          {errors.subgroup && <span className="text-red-500 text-xs">{errors.subgroup.message}</span>}
        </div>
        {/* Valor */}
        <div>
          <label className="block text-xs font-medium after:content-['*'] after:text-red-500">Valor</label>
          <input type="number" step="0.01" inputMode="decimal" {...register('value', { valueAsNumber: true })} className="input" />
          {errors.value && <span className="text-red-500 text-xs">{errors.value.message}</span>}
        </div>
        {/* Juros */}
        <div>
          <label className="block text-xs font-medium">Juros</label>
          <input type="number" step="0.01" inputMode="decimal" {...register('interest', { valueAsNumber: true })} className="input" />
          {errors.interest && <span className="text-red-500 text-xs">{errors.interest.message}</span>}
        </div>
        {/* Data Vencimento */}
        <div>
          <label className="block text-xs font-medium after:content-['*'] after:text-red-500">Data Vencimento</label>
          <input type="date" {...register('dueDate')} className="input" />
          {errors.dueDate && <span className="text-red-500 text-xs">{errors.dueDate.message}</span>}
        </div>
        {/* Data Pagamento */}
        <div>
          <label className="block text-xs font-medium">Data Pagamento</label>
          <input type="date" {...register('paymentDate')} className="input" max={today} />
          {errors.paymentDate && <span className="text-red-500 text-xs">{errors.paymentDate.message}</span>}
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-3 py-1 rounded bg-green-600 text-white">
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 