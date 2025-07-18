import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '../schemas';

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => void;
  onClose: () => void;
}

export function ExpenseForm({ initialData, onSubmit, onClose }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {},
  });

  React.useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-3"
      >
        <h2 className="text-lg font-bold mb-2">{initialData ? 'Editar Despesa' : 'Nova Despesa'}</h2>
        <div>
          <label className="block text-xs font-medium">Conta*</label>
          <input {...register('account')} className="input" />
          {errors.account && <span className="text-red-500 text-xs">{errors.account.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Grupo*</label>
          <input {...register('group')} className="input" />
          {errors.group && <span className="text-red-500 text-xs">{errors.group.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Subgrupo*</label>
          <input {...register('subgroup')} className="input" />
          {errors.subgroup && <span className="text-red-500 text-xs">{errors.subgroup.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Valor*</label>
          <input type="number" step="0.01" {...register('value', { valueAsNumber: true })} className="input" />
          {errors.value && <span className="text-red-500 text-xs">{errors.value.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Juros</label>
          <input type="number" step="0.01" {...register('interest', { valueAsNumber: true })} className="input" />
          {errors.interest && <span className="text-red-500 text-xs">{errors.interest.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Data Vencimento*</label>
          <input type="date" {...register('dueDate')} className="input" />
          {errors.dueDate && <span className="text-red-500 text-xs">{errors.dueDate.message}</span>}
        </div>
        <div>
          <label className="block text-xs font-medium">Data Pagamento</label>
          <input type="date" {...register('paymentDate')} className="input" />
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