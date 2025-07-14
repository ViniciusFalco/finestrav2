'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useExpenses, createExpense, updateExpense, deleteExpense, Expense, CreateExpenseData } from '@/hooks/useExpenses';

export default function ExpensesPage() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<CreateExpenseData>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: 0,
    type: 'variable',
  });

  const { expenses, loading, error } = useExpenses(startDate, endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
      } else {
        await createExpense(formData);
      }
      setShowForm(false);
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: 0,
        type: 'variable',
      });
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date,
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      type: expense.type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        console.error('Erro ao excluir despesa:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: 0,
      type: 'variable',
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar despesas: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nova Despesa
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'fixed' | 'variable' })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="variable">Variável</option>
                    <option value="fixed">Fixa</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingExpense ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lista de Despesas</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-500">Nenhuma despesa encontrada</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          expense.type === 'fixed' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {expense.type === 'fixed' ? 'Fixa' : 'Variável'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 