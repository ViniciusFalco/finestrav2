import React from 'react';

export interface Expense {
  id: string;
  account: { id: string; name: string } | null;
  category: { id: string; name: string; parent_id: string | null } | null;
  group?: string; // pode ser populado conforme lógica de categoria
  subgroup?: string; // pode ser populado conforme lógica de categoria
  value: number;
  interest?: number;
  dueDate: string;
  paymentDate?: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border bg-white text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-2 text-left">Conta</th>
            <th className="px-2 py-2 text-left">Grupo</th>
            <th className="px-2 py-2 text-left">Subgrupo</th>
            <th className="px-2 py-2 text-right">Valor</th>
            <th className="px-2 py-2 text-right">Juros</th>
            <th className="px-2 py-2 text-center">Vencimento</th>
            <th className="px-2 py-2 text-center">Pagamento</th>
            <th className="px-2 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-400">Nenhuma despesa encontrada.</td>
            </tr>
          )}
          {expenses.map((exp) => (
            <tr key={exp.id} className="border-t hover:bg-gray-50">
              <td className="px-2 py-1">{exp.account?.name || '-'}</td>
              <td className="px-2 py-1">{exp.category?.parent_id || '-'}</td>
              <td className="px-2 py-1">{exp.category?.name || '-'}</td>
              <td className="px-2 py-1 text-right">{exp.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td className="px-2 py-1 text-right">{exp.interest ? exp.interest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
              <td className="px-2 py-1 text-center">{exp.dueDate}</td>
              <td className="px-2 py-1 text-center">{exp.paymentDate || '-'}</td>
              <td className="px-2 py-1 text-center">
                <button className="text-blue-600 hover:underline mr-2" onClick={() => onEdit(exp)}>Editar</button>
                <button className="text-red-600 hover:underline" onClick={() => onDelete(exp)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 