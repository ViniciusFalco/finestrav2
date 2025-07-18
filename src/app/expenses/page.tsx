"use client";
import React, { useState } from 'react';
import { ExpenseTable } from '@/features/expenses/components/ExpenseTable';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import { createExpense, updateExpense, deleteExpense } from '@/features/expenses/services/expensesService';
import { ExpenseFormData } from '@/features/expenses/schemas';

// Simulação de userId (ajuste para pegar do contexto/auth real)
const userId = 'demo-user-id';

export default function ExpensesPage() {
  const { expenses, isLoading, error, refresh } = useExpenses(userId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [search, setSearch] = useState('');

  const filteredExpenses = expenses.filter((e: any) =>
    e.account?.toLowerCase().includes(search.toLowerCase()) ||
    e.group?.toLowerCase().includes(search.toLowerCase()) ||
    e.subgroup?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(data: ExpenseFormData) {
    if (editing) {
      await updateExpense(editing.id, userId, data);
    } else {
      await createExpense(userId, data);
    }
    setModalOpen(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete(exp: any) {
    if (window.confirm('Excluir esta despesa?')) {
      await deleteExpense(exp.id, userId);
      refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Despesas</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          Nova Despesa
        </button>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por conta, grupo ou subgrupo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full max-w-xs"
        />
      </div>
      {isLoading ? (
        <div>Carregando...</div>
      ) : error ? (
        <div className="text-red-600">Erro ao carregar despesas.</div>
      ) : (
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={exp => { setEditing(exp); setModalOpen(true); }}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <ExpenseForm
          initialData={editing}
          onSubmit={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
} 