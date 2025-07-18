"use client";
import React, { useState } from 'react';
import ExpenseTable from '@/features/expenses/components/ExpenseTable';
import ExpenseForm from '@/features/expenses/components/ExpenseForm';
import { useExpenses } from '@/features/expenses/hooks/useExpenses';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import { DashboardLayout } from '@/components/DashboardLayout';

interface ExpenseEditing {
  account?: { id?: string };
  category?: { id?: string; parent_id?: string };
  [key: string]: any;
}

export default function ExpensesPage() {
  const { expenses, isLoading, error, refresh } = useExpenses();
  const { accounts } = useAccounts();
  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<ExpenseEditing | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filteredExpenses = expenses.filter((e: any) =>
    (e.account?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

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
        account: editing.account?.id || '',
        group: editing.category?.parent_id || '',
        subgroup: editing.category?.id || '',
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
            data={filteredExpenses}
          />
        )}
        {modalOpen && (
          <ExpenseForm
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSuccess={refresh}
            initialData={formInitialData}
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