"use client";
import React, { useState } from 'react';
import { ExpenseTable } from '@/features/expenses/components/ExpenseTable';
import { ExpenseForm } from '@/features/expenses/components/ExpenseForm';
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { createExpense, updateExpense, deleteExpense } from '@/features/expenses/services/expensesService';
import { ExpenseFormData } from '@/features/expenses/schemas';
import type { Expense } from '@/features/expenses/components/ExpenseTable';
import { DashboardLayout } from '@/components/DashboardLayout';

// Simulação de userId (ajuste para pegar do contexto/auth real)
const userId = 'demo-user-id';

export default function ExpensesPage() {
  const { expenses, isLoading, error, refresh } = useExpenses(userId);
  const { accounts } = useAccounts(userId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filteredExpenses = expenses.filter((e: Expense) =>
    (e.account?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.category?.name || '').toLowerCase().includes(search.toLowerCase())
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

  async function handleDelete(exp: Expense) {
    if (window.confirm('Excluir esta despesa?')) {
      await deleteExpense(exp.id, userId);
      refresh();
    }
  }

  function handleNewExpense() {
    if (accounts.length === 0) {
      setToast('Cadastre uma conta antes de lançar despesas.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setEditing(null);
    setModalOpen(true);
  }

  const formInitialData = editing
    ? {
        ...editing,
        account: (editing.account as any)?.id || '',
        group: (editing.category as any)?.parent_id || '',
        subgroup: (editing.category as any)?.id || '',
      }
    : undefined;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Despesas</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleNewExpense}
          >
            Nova Despesa
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por conta ou categoria..."
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
            userId={userId}
            initialData={formInitialData}
            onSubmit={handleSave}
            onClose={() => { setModalOpen(false); setEditing(null); }}
          />
        )}
        {toast && (
          <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
            {toast}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 