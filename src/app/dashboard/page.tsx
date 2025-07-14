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

export default function DashboardPage() {
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
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar dados: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout periodTotals={periodTotals}>
      <div className="p-6 space-y-6">
        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os produtos</option>
                <option value="selected">Produtos específicos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumo Diário */}
          <div className="lg:col-span-2">
            <DailyChart data={dailyData} loading={loading} />
          </div>

          {/* Resumo Acumulado */}
          <div className="lg:col-span-2">
            <AccumulatedChart data={accumulatedData} loading={loading} />
          </div>

          {/* Cobertura de Receita vs Despesa */}
          <div>
            <BalanceChart data={periodTotals} loading={loading} />
          </div>

          {/* Distribuição de Despesas */}
          <div>
            <ExpenseDistributionChart data={expenseDistribution} loading={loading} />
          </div>

          {/* Top Produtos */}
          <div>
            <TopProductsChart data={topProducts} loading={loading} />
          </div>

          {/* Vendas por Plataforma */}
          <div>
            <SalesByPlatformChart data={salesByPlatform} loading={loading} />
          </div>

          {/* Vendas por Dia da Semana */}
          <div>
            <SalesByWeekdayChart data={salesByWeekday} loading={loading} />
          </div>

          {/* Vendas por Horário */}
          <div>
            <SalesByHourChart data={salesByHour} loading={loading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 