import React, { useState, useMemo } from 'react';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { useCategories } from '@/features/ads/hooks/useCategories';
import { createExpense, updateExpense } from '../services/expensesService';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import dayjs from 'dayjs';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export default function ExpenseForm({ open, onClose, onSuccess, initialData }: ExpenseFormProps) {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const [form, setForm] = useState({
    account_id: initialData?.account_id || '',
    group: initialData?.group || '',
    category_id: initialData?.category_id || '',
    value: initialData?.value || '',
    interest: initialData?.interest || '',
    dueDate: initialData?.due_date || '',
    paymentDate: initialData?.payment_date || '',
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
    try {
      const dto = {
        ...form,
        value: Number(form.value),
        interest: Number(form.interest) || 0,
        dueDate: form.dueDate,
        paymentDate: form.paymentDate || null,
      };
      if (initialData?.id) {
        await updateExpense(initialData.id, dto);
      } else {
        await createExpense(dto);
      }
      onSuccess();
      onClose();
    } catch (e) {
      // TODO: tratar erro
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
          select
          label="Grupo"
          name="group"
          value={form.group}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={!form.account_id}
        >
          {groups.map((g: any) => (
            <MenuItem key={g} value={g}>{g}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Subgrupo"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={!form.group}
        >
          {subgroups.map((sg: any) => (
            <MenuItem key={sg.id} value={sg.id}>{sg.name}</MenuItem>
          ))}
        </TextField>
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
        <Button onClick={handleSubmit} disabled={!isValid || loading} variant="contained" color="primary">
          {initialData ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 