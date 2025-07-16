'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import DailyChart from '@/components/charts/DailyChart';
import AccumulatedChart from '@/components/charts/AccumulatedChart';
import CoverageBar from '@/components/charts/CoverageBar';
import ExpenseDistributionChart from '@/components/charts/ExpenseDistribution';
import TopProductsChart from '@/components/charts/TopProductsChart';
import SalesByPlatformChart from '@/components/charts/SalesByPlatformChart';
import SalesByWeekdayChart from '@/components/charts/SalesByWeekdayChart';
import SalesByHourChart from '@/components/charts/SalesByHourChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent } from '@/components/ui/card';
import { FilterDrawer } from '@/components/FilterDrawer';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { ProductMultiSelect } from '@/components/filters/ProductMultiSelect';
import { subDays } from 'date-fns';
import { ArrowDown, ArrowUp, PiggyBank, Receipt } from 'lucide-react';

export default function DashboardClient() {
  // Estado para filtros
  const [dateRange, setDateRange] = useState({ start: subDays(new Date(), 29), end: new Date() });
  const [productIds, setProductIds] = useState<string[]>([]);

  // Hook para buscar dados filtrados
  const { data, loading, error } = useDashboardData({
    start: dateRange.start,
    end: dateRange.end,
    productIds
  });

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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Título de filtros ativos */}
        <div className="mb-2">
          <span className="text-sm text-neutral-700 font-medium">
            {dateRange.start.toLocaleDateString('pt-BR', { month: 'long' })}
            {dateRange.end.getFullYear() !== dateRange.start.getFullYear() ?
              `/${dateRange.end.getFullYear()}` : ''}
            {' – '}
            {productIds.length === 0 ? 'Todos os produtos' : `${productIds.length} produto(s)`}
          </span>
        </div>
        {/* Cards de resumo coloridos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Card className="bg-green-50 border-green-200 text-green-800">
            <CardContent className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Faturamento</span>
                <Receipt className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                R$ {data.periodTotals?.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200 text-emerald-800">
            <CardContent className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Lucro Líquido</span>
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                R$ {data.periodTotals?.totalProfit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200 text-red-800">
            <CardContent className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Despesas</span>
                <ArrowUp className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                R$ {data.periodTotals?.totalExpenses?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200 text-purple-800">
            <CardContent className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Reembolsos</span>
                <ArrowDown className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">
                R$ {data.sales?.reduce((acc, item) => acc + (item.refunds || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </span>
            </CardContent>
          </Card>
        </div>
        {/* Header com título e filtros */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <FilterDrawer>
            <div className="space-y-4">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <ProductMultiSelect
                value={productIds}
                onChange={setProductIds}
                options={data.allProducts || []}
              />
              <button
                className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                onClick={() => {}}
              >
                Aplicar filtros
              </button>
            </div>
          </FilterDrawer>
        </div>

        {/* Gráficos em coluna única */}
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <DailyChart data={data.sales || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <AccumulatedChart data={data.accumulated || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <CoverageBar data={data.periodTotals} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <TopProductsChart data={data.topProducts || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByPlatformChart data={data.salesByPlatform || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByWeekdayChart data={data.salesByWeekday || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <SalesByHourChart data={data.salesByHour || []} loading={loading} />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <ExpenseDistributionChart data={data.expenseDistribution || []} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 