'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import DailyChart from '@/components/charts/DailyChart';
import AccumulatedChart from '@/components/charts/AccumulatedChart';
import BalanceChart from '@/components/charts/BalanceChart';
import ExpenseDistributionChart from '@/components/charts/ExpenseDistribution';
import TopProductsChart from '@/components/charts/TopProductsChart';
import SalesByPlatformChart from '@/components/charts/SalesByPlatformChart';
import SalesByWeekdayChart from '@/components/charts/SalesByWeekdayChart';
import SalesByHourChart from '@/components/charts/SalesByHourChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FilterDrawer } from '@/components/FilterDrawer';
import { Calendar, Package } from 'lucide-react';

export default function DashboardClient() {
  // Estado para filtros
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-07');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Hook para buscar dados
  const {
    dailyData,
    accumulatedData,
    periodTotals,
    expenseDistribution,
    topProducts,
    salesByPlatform,
    salesByWeekday,
    salesByHour,
    loading,
    error,
  } = useDashboardData(startDate, endDate, selectedProducts);

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800 font-medium">Erro ao carregar dados: {error}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout periodTotals={periodTotals}>
      <div className="space-y-6">
        {/* Header com título e filtros */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {/* subtítulo com período/produto virá em Sprint 12 */}
          </div>

          {/* Botão de filtros */}
          <FilterDrawer>
            <div className="space-y-4">
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
              <div className="space-y-2">
                <label htmlFor="products" className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Produtos
                </label>
                <select
                  id="products"
                  value={selectedProducts.length > 0 ? 'selected' : 'all'}
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setSelectedProducts([]);
                    } else {
                      // Por enquanto, simula seleção de produtos específicos
                      setSelectedProducts(['produto-a', 'produto-b']);
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">Todos os produtos</option>
                  <option value="selected">Produtos específicos</option>
                </select>
              </div>
              <button
                className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                onClick={() => {
                  // Fechar drawer e recarregar dados
                  // O drawer fechará automaticamente ao clicar fora
                }}
              >
                Aplicar
              </button>
            </div>
          </FilterDrawer>
        </div>

        {/* Gráficos em coluna única */}
        <div className="space-y-6">
          {/* Resumo Diário */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <DailyChart data={dailyData} loading={loading} />
            </CardContent>
          </Card>

          {/* Resumo Acumulado */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <AccumulatedChart data={accumulatedData} loading={loading} />
            </CardContent>
          </Card>

          {/* Cobertura de Receita vs Despesa */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <BalanceChart data={periodTotals} loading={loading} />
            </CardContent>
          </Card>

          {/* Distribuição de Despesas */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <ExpenseDistributionChart data={expenseDistribution} loading={loading} />
            </CardContent>
          </Card>

          {/* Top Produtos */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <TopProductsChart data={topProducts} loading={loading} />
            </CardContent>
          </Card>

          {/* Vendas por Plataforma */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByPlatformChart data={salesByPlatform} loading={loading} />
            </CardContent>
          </Card>

          {/* Vendas por Dia da Semana */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByWeekdayChart data={salesByWeekday} loading={loading} />
            </CardContent>
          </Card>

          {/* Vendas por Horário */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByHourChart data={salesByHour} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 