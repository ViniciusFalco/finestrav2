'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useSales, createSale, updateSale, deleteSale, Sale, CreateSaleData } from '@/hooks/useSales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, Filter, Edit, Trash2, TrendingUp } from 'lucide-react';

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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800 font-medium">Erro ao carregar vendas: {error}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-neutral-900">Vendas</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        {/* Filtros */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary-600" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Data Inicial
                </label>
                <Input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Data Final
                </label>
                <Input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal do Formulário */}
        <Modal
          isOpen={showForm}
          onClose={handleCancel}
          title={editingSale ? 'Editar Venda' : 'Nova Venda'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-neutral-700">
                  Data
                </label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="product" className="text-sm font-medium text-neutral-700">
                  Produto
                </label>
                <Input
                  type="text"
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium text-neutral-700">
                  Plataforma
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione uma plataforma</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Site Próprio">Site Próprio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium text-neutral-700">
                  Quantidade
                </label>
                <Input
                  type="number"
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  required
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-neutral-700">
                  Valor Total
                </label>
                <Input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="refunds" className="text-sm font-medium text-neutral-700">
                  Reembolsos
                </label>
                <Input
                  type="number"
                  id="refunds"
                  value={formData.refunds}
                  onChange={(e) => setFormData({ ...formData, refunds: parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingSale ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* Tabela */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lista de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-6 text-center">
                <div className="text-neutral-500">Carregando...</div>
              </div>
            ) : sales.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-neutral-500">Nenhuma venda encontrada</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Reembolsos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.platform}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        R$ {sale.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        R$ {sale.refunds.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(sale)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sale.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 