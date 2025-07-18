import React, { useState, useMemo } from 'react';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { useCategories } from '@/features/ads/hooks/useCategories';
import { createExpense, updateExpense } from '../services/expensesService';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: unknown;
}

export default function ExpenseForm({ open, onClose, onSuccess, initialData }: ExpenseFormProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const [form, setForm] = useState({
    account_id: (initialData as any)?.account_id || '',
    group: (initialData as any)?.group || '',
    category_id: (initialData as any)?.category_id || '',
    value: (initialData as any)?.value || '',
    interest: (initialData as any)?.interest || '',
    dueDate: (initialData as any)?.due_date || '',
    paymentDate: (initialData as any)?.payment_date || '',
  });
  const [loading, setLoading] = useState(false);

  // Grupos únicos da conta escolhida
  const groups = useMemo(() => {
    const acc = accounts.find(a => a.id === form.account_id);
    return acc ? [acc.group] : [];
  }, [accounts, form.account_id]);

  // Subgrupos filtrados
  const subgroups = useMemo(() => {
    return categories.filter(c => c.group === form.group);
  }, [categories, form.group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Validação manual
    if (!form.account_id || !accounts.find((a: any) => a.id === form.account_id)) {
      alert('Selecione uma conta válida.');
      setLoading(false);
      return;
    }
    if (!form.value || Number(form.value) <= 0) {
      alert('Informe um valor maior que zero.');
      setLoading(false);
      return;
    }
    if (!form.dueDate) {
      alert('Informe a data de vencimento.');
      setLoading(false);
      return;
    }
    if (form.paymentDate && dayjs(form.paymentDate).isAfter(dayjs(), 'day')) {
      alert('A data de pagamento não pode ser no futuro.');
      setLoading(false);
      return;
    }
    if (dayjs(form.dueDate).isBefore(dayjs(), 'day')) {
      alert('A data de vencimento não pode ser no passado.');
      setLoading(false);
      return;
    }
    try {
      const dto = {
        account_id: form.account_id,
        category_id: accounts.find((a: any) => a.id === form.account_id)?.subgroup || '',
        value: Number(form.value),
        interest: Number(form.interest) || 0,
        dueDate: form.dueDate,
        paymentDate: form.paymentDate || null,
      };
      if ((initialData as any)?.id) {
        await updateExpense((initialData as any).id, dto);
      } else {
        await createExpense(dto);
      }
      onSuccess();
      onClose();
    } catch (e) {
      alert('Erro ao salvar despesa.');
    } finally {
      setLoading(false);
    }
  };

  // Validações
  const isValid =
    form.account_id &&
    form.group &&
    form.category_id &&
    Number(form.value) > 0 &&
    form.dueDate &&
    (!form.paymentDate || dayjs(form.paymentDate).isSameOrBefore(dayjs(), 'day')) &&
    dayjs(form.dueDate).isSameOrAfter(dayjs(), 'day');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Conta"
          name="account_id"
          value={form.account_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {accounts.map((acc: any) => (
            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Grupo"
          name="group"
          value={accounts.find((a: any) => a.id === form.account_id)?.group || ''}
          fullWidth
          margin="normal"
          required
          disabled
        />
        <TextField
          label="Subgrupo"
          name="subgroup"
          value={accounts.find((a: any) => a.id === form.account_id)?.subgroup || ''}
          fullWidth
          margin="normal"
          required
          disabled
        />
        <TextField
          label="Valor"
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Juros"
          name="interest"
          type="number"
          value={form.interest}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data de Vencimento"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data de Pagamento"
          name="paymentDate"
          type="date"
          value={form.paymentDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained" color="primary">
          {initialData ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 