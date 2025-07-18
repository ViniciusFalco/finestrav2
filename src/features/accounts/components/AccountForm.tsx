import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { AccountDTO, createAccount, updateAccount } from '../services/accountsService';

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AccountDTO & { id?: string };
}

const GROUPS = [
  { value: 'Despesas Fixas', label: 'Despesas Fixas' },
  { value: 'Despesas Variáveis', label: 'Despesas Variáveis' },
];

const SUBGROUPS = [
  'Consumo elétrico',
  'Água',
  'Internet',
  'Telefonia',
  'Aluguel',
  'Transporte',
  'Alimentação',
  'Saúde',
  'Educação',
  'Marketing',
  'Honorários profissionais',
  'Equipamentos',
  'Licenças e taxas',
  'Lazer e entretenimento',
  'Seguros',
];

export default function AccountForm({ open, onClose, onSuccess, initialData }: AccountFormProps) {
  const [form, setForm] = useState<AccountDTO>({
    name: initialData?.name || '',
    group: (initialData?.group as 'Despesas Fixas' | 'Despesas Variáveis') || 'Despesas Fixas',
    subgroup: initialData?.subgroup || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateAccount(initialData.id, form);
      } else {
        await createAccount(form);
      }
      onSuccess();
      onClose();
    } catch (e) {
      // TODO: tratar erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome da Conta"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Grupo"
          name="group"
          value={form.group}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {GROUPS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Subgrupo"
          name="subgroup"
          value={form.subgroup}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {SUBGROUPS.map((sg) => (
            <MenuItem key={sg} value={sg}>{sg}</MenuItem>
          ))}
        </TextField>
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