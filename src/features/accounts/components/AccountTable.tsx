import React from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteAccount, AccountDTO } from '../services/accountsService';

interface AccountTableProps {
  data: (AccountDTO & { id: string })[];
  onRefresh: () => void;
  onEdit?: (account: AccountDTO & { id: string }) => void;
}

export default function AccountTable({ data, onRefresh, onEdit }: AccountTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta conta?')) {
      await deleteAccount(id);
      onRefresh();
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Conta</TableCell>
          <TableCell>Grupo</TableCell>
          <TableCell>Subgrupo</TableCell>
          <TableCell>Despesas mês</TableCell>
          <TableCell>Despesa média 12m</TableCell>
          <TableCell>Despesa total</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.name}</TableCell>
            <TableCell>{account.group}</TableCell>
            <TableCell>{account.subgroup}</TableCell>
            <TableCell>{/* TODO: calcular despesas do mês */}—</TableCell>
            <TableCell>{/* TODO: calcular média 12m */}—</TableCell>
            <TableCell>{/* TODO: calcular total */}—</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit && onEdit(account)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(account.id)}><DeleteIcon /></IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 