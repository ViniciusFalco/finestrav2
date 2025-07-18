import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface ExpenseTableProps {
  data: any[];
}

export default function ExpenseTable({ data }: ExpenseTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Conta</TableCell>
          <TableCell>Grupo</TableCell>
          <TableCell>Subgrupo</TableCell>
          <TableCell>Valor</TableCell>
          <TableCell>Juros</TableCell>
          <TableCell>Valor Total</TableCell>
          <TableCell>Vencimento</TableCell>
          <TableCell>Pagamento</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{expense.account?.name}</TableCell>
            <TableCell>{expense.account?.group}</TableCell>
            <TableCell>{expense.category?.name}</TableCell>
            <TableCell>{expense.value}</TableCell>
            <TableCell>{expense.interest}</TableCell>
            <TableCell>{expense.total}</TableCell>
            <TableCell>{expense.due_date}</TableCell>
            <TableCell>{expense.payment_date || '—'}</TableCell>
            <TableCell>{expense.status}</TableCell>
            <TableCell>{/* TODO: ações editar/remover */}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 