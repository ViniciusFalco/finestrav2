import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';

export interface DashboardFilter {
  start: Date;
  end: Date;
  productIds: string[];
}

export interface DailySummary {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  refunds: number;
}

export interface AccumulatedSummary {
  date: string;
  cumRevenue: number;
  cumExpenses: number;
  cumProfit: number;
  cumHistoricalAvg?: number;
}

export interface PeriodTotals {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}

export interface TopProduct {
  product: string;
  revenue: number;
}

export interface Product {
  id: string;
  name: string;
}

export interface SalesByPlatform {
  platform: string;
  quantity: number;
  revenue: number;
  refunds: number;
}

export interface SalesByWeekday {
  weekday: string;
  quantity: number;
}

export interface SalesByHour {
  hourRange: string;
  quantity: number;
}

export interface ExpenseDistribution {
  category: string;
  amount: number;
  type: 'fixed' | 'variable';
  percentage: number;
}

export function useDashboardData(filters: DashboardFilter) {
  const { start, end, productIds } = filters;
  const [data, setData] = useState<{
    sales: DailySummary[];
    accumulated: AccumulatedSummary[];
    periodTotals: PeriodTotals;
    allProducts: Product[];
    topProducts: TopProduct[];
    salesByPlatform: SalesByPlatform[];
    salesByWeekday: SalesByWeekday[];
    salesByHour: SalesByHour[];
    expenseDistribution: ExpenseDistribution[];
    balanceData: Array<{ month: string; revenue: number; expenses: number }>;
  }>({
    sales: [],
    accumulated: [],
    periodTotals: { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 },
    allProducts: [],
    topProducts: [],
    salesByPlatform: [],
    salesByWeekday: [],
    salesByHour: [],
    expenseDistribution: [],
    balanceData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = supabaseBrowser();
        
        // Construir filtros de data
        const startDate = start.toISOString().split('T')[0];
        const endDate = end.toISOString().split('T')[0];
        
        // 1. Buscar produtos para o multi-select
        const { data: allProducts, error: prodError } = await supabase
          .from('products')
          .select('id, name')
          .order('name');

        if (prodError) {
          setError(prodError.message);
          setLoading(false);
          return;
        }

        // 2. Buscar dados de vendas filtrados por data e produtos
        let salesQuery = supabase
          .from('sales')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);
        
        if (productIds.length > 0) {
          salesQuery = salesQuery.in('product_id', productIds);
        }
        
        const { data: sales, error: salesError } = await salesQuery;

        if (salesError) {
          setError(salesError.message);
          setLoading(false);
          return;
        }

        // 3. Buscar dados de despesas filtrados por data
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (expensesError) {
          setError(expensesError.message);
          setLoading(false);
          return;
        }

        // 4. Buscar dados de reembolsos filtrados por data
        const { data: refunds, error: refundsError } = await supabase
          .from('refunds')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (refundsError) {
          setError(refundsError.message);
          setLoading(false);
          return;
        }

        // 5. Buscar dados das views (com filtros aplicados)
        const [
          { data: salesByPlatform },
          { data: salesByWeekday },
          { data: salesByHour },
          { data: topProducts },
          { data: expenseDistribution }
        ] = await Promise.all([
          supabase.from('sales_by_platform').select('*').gte('date', startDate).lte('date', endDate),
          supabase.from('sales_by_weekday').select('*').gte('date', startDate).lte('date', endDate),
          supabase.from('sales_by_hour').select('*'), // Não aplicar filtro de data - view já agrega todos os dados
          supabase.from('top_products').select('*').gte('date', startDate).lte('date', endDate),
          supabase.from('expense_distribution').select('*').gte('date', startDate).lte('date', endDate)
        ]);

        // Mapear dias da semana para pt-BR
        const ptWeek: Record<string, string> = {
          Sun: 'Dom', Mon: 'Seg', Tue: 'Ter', Wed: 'Qua', Thu: 'Qui', Fri: 'Sex', Sat: 'Sáb',
        };
        const salesByWeekdayPt = (salesByWeekday || []).map((r: unknown) => {
          const row = r as { weekday: string; quantity: number };
          return {
            weekday: ptWeek[row.weekday as keyof typeof ptWeek] ?? row.weekday,
            quantity: row.quantity || 0,
          };
        });
        
        // 6. Transformar dados de vendas em formato para gráficos
        const dailyData = transformSalesToDailySummary(sales || [], expenses || [], refunds || []);
        const accumulatedData = transformToAccumulatedSummary(dailyData);
        const periodTotals = calculatePeriodTotals(dailyData);

        // Garantir que salesByHour tenha as 4 faixas e o campo correto
        const hourRanges = [
          '00:00 - 05:59',
          '06:00 - 11:59',
          '12:00 - 17:59',
          '18:00 - 23:59'
        ];
        const salesByHourMapped = hourRanges.map(hr => {
          const found = (salesByHour || []).find((item: { hour_range?: string; hourRange?: string; quantity: number }) => item.hour_range === hr || item.hourRange === hr);
          return {
            hourRange: hr,
            quantity: found ? found.quantity : 0
          };
        });
        
        setData({ 
          sales: dailyData, 
          accumulated: accumulatedData,
          periodTotals,
          allProducts: allProducts || [],
          topProducts: topProducts || [],
          salesByPlatform: salesByPlatform || [],
          salesByWeekday: salesByWeekdayPt,
          salesByHour: salesByHourMapped,
          expenseDistribution: expenseDistribution || [],
          balanceData: generateMockBalanceData() // Mantido mockado por enquanto
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
        setError(errorMessage);
      }
      setLoading(false);
    })();
  }, [start, end, productIds]);

  return { data, loading, error };
}

// Função para transformar vendas em resumo diário
function transformSalesToDailySummary(
  sales: Array<{ date: string; net_amount: number }>,
  expenses: Array<{ date: string; amount: number }>,
  refunds: Array<{ date: string; amount: number }>
): DailySummary[] {
  const dailyMap = new Map<string, DailySummary>();
  
  // Processar vendas
  sales.forEach(sale => {
    const date = sale.date;
    const revenue = parseFloat(String(sale.net_amount)) || 0;
    
    if (dailyMap.has(date)) {
      const existing = dailyMap.get(date)!;
      existing.revenue += revenue;
      existing.profit += revenue;
    } else {
      dailyMap.set(date, {
        date,
        revenue,
        expenses: 0,
        profit: revenue,
        refunds: 0
      });
    }
  });

  // Processar despesas
  expenses.forEach(expense => {
    const date = expense.date;
    const amount = parseFloat(String(expense.amount)) || 0;
    
    if (dailyMap.has(date)) {
      const existing = dailyMap.get(date)!;
      existing.expenses += amount;
      existing.profit -= amount;
    } else {
      dailyMap.set(date, {
        date,
        revenue: 0,
        expenses: amount,
        profit: -amount,
        refunds: 0
      });
    }
  });

  // Processar reembolsos
  refunds.forEach(refund => {
    const date = refund.date;
    const amount = parseFloat(String(refund.amount)) || 0;
    
    if (dailyMap.has(date)) {
      const existing = dailyMap.get(date)!;
      existing.refunds += amount;
      existing.revenue -= amount;
      existing.profit -= amount;
    } else {
      dailyMap.set(date, {
        date,
        revenue: -amount,
        expenses: 0,
        profit: -amount,
        refunds: amount
      });
    }
  });
  
  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// Função para transformar dados diários em acumulados
function transformToAccumulatedSummary(dailyData: DailySummary[]): AccumulatedSummary[] {
  let cumRevenue = 0;
  let cumExpenses = 0;
  let cumProfit = 0;
  
  return dailyData.map(item => {
    cumRevenue += item.revenue;
    cumExpenses += item.expenses;
    cumProfit += item.profit;
    
    return {
      date: item.date,
      cumRevenue,
      cumExpenses,
      cumProfit
    };
  });
}

// Função para calcular totais do período
function calculatePeriodTotals(dailyData: DailySummary[]): PeriodTotals {
  const totals = dailyData.reduce(
    (acc, item) => {
      acc.totalRevenue += item.revenue;
      acc.totalExpenses += item.expenses;
      acc.totalProfit += item.profit;
      return acc;
    },
    { totalRevenue: 0, totalExpenses: 0, totalProfit: 0 }
  );
  
  return totals;
}

// Função para gerar dados mockados de balance (mantida por enquanto)
function generateMockBalanceData() {
  return [
    { month: 'Jan', revenue: 5000, expenses: 3000 },
    { month: 'Fev', revenue: 6000, expenses: 3500 },
    { month: 'Mar', revenue: 7000, expenses: 4000 },
    { month: 'Abr', revenue: 8000, expenses: 4500 },
    { month: 'Mai', revenue: 9000, expenses: 5000 },
    { month: 'Jun', revenue: 10000, expenses: 5500 }
  ];
} 