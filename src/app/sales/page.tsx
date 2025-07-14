'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useSales, createSale, updateSale, deleteSale, Sale, CreateSaleData } from '@/hooks/useSales';

export default function SalesPage() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState<CreateSaleData>({
    date: new Date().toISOString().split('T')[0],
    product: '',
    platform: '',
    quantity: 1,
    amount: 0,
    refunds: 0,
  });

  const { sales, loading, error } = useSales(startDate, endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSale) {
        await updateSale(editingSale.id, formData);
      } else {
        await createSale(formData);
      }
      setShowForm(false);
      setEditingSale(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        product: '',
        platform: '',
        quantity: 1,
        amount: 0,
        refunds: 0,
      });
    } catch (err) {
      console.error('Erro ao salvar venda:', err);
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      date: sale.date,
      product: sale.product,
      platform: sale.platform,
      quantity: sale.quantity,
      amount: sale.amount,
      refunds: sale.refunds,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteSale(id);
      } catch (err) {
        console.error('Erro ao excluir venda:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSale(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      platform: '',
      quantity: 1,
      amount: 0,
      refunds: 0,
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar vendas: {error}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Nova Venda
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSale ? 'Editar Venda' : 'Nova Venda'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                    Produto
                  </label>
                  <input
                    type="text"
                    id="product"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                    Plataforma
                  </label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma plataforma</option>
                    <option value="Shopee">Shopee</option>
                    <option value="Mercado Livre">Mercado Livre</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Site Próprio">Site Próprio</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="refunds" className="block text-sm font-medium text-gray-700 mb-1">
                    Reembolsos
                  </label>
                  <input
                    type="number"
                    id="refunds"
                    value={formData.refunds}
                    onChange={(e) => setFormData({ ...formData, refunds: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingSale ? 'Atualizar' : 'Salvar'}
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
            <h2 className="text-lg font-semibold text-gray-900">Lista de Vendas</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-500">Nenhuma venda encontrada</div>
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
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plataforma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reembolsos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        R$ {sale.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        R$ {sale.refunds.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
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