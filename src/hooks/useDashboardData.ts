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

export interface Product {
  id: string;
  name: string;
}

export function useDashboardData(filters: DashboardFilter) {
  const { start, end, productIds } = filters;
  const [data, setData] = useState<{
    sales: DailySummary[];
    accumulated: AccumulatedSummary[];
    allProducts: Product[];
    topProducts: Array<{ name: string; sales: number }>;
    salesByPlatform: Array<{ platform: string; sales: number }>;
    salesByWeekday: Array<{ day: string; sales: number }>;
    salesByHour: Array<{ hour: number; sales: number }>;
    expenseDistribution: Array<{ category: string; amount: number }>;
    balanceData: Array<{ month: string; revenue: number; expenses: number }>;
  }>({
    sales: [],
    accumulated: [],
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
        // --- consulta dinâmica ---
        const supabase = supabaseBrowser();
        let q = supabase
          .from('sales') // trocado para a tabela real
          .select('*')
          .gte('date', start.toISOString())
          .lte('date', end.toISOString());
        if (productIds.length) q = q.in('product_id', productIds);
        const { data: sales, error: salesError } = await q;

        // Produtos para o multi-select
        const { data: allProducts, error: prodError } = await supabase
          .from('products')
          .select('id, name')
          .order('name');

        if (salesError) setError(salesError.message);
        else if (prodError) setError(prodError.message);
        else {
          // Transformar dados de vendas em formato para gráficos
          const dailyData = transformSalesToDailySummary(sales || []);
          const accumulatedData = transformToAccumulatedSummary(dailyData);
          
          setData({ 
            sales: dailyData, 
            accumulated: accumulatedData,
            allProducts: allProducts || [],
            // Dados mockados para outros gráficos por enquanto
            topProducts: generateMockTopProducts(),
            salesByPlatform: generateMockSalesByPlatform(),
            salesByWeekday: generateMockSalesByWeekday(),
            salesByHour: generateMockSalesByHour(),
            expenseDistribution: generateMockExpenseDistribution(),
            balanceData: generateMockBalanceData()
          });
        }
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
function transformSalesToDailySummary(sales: Array<{ date: string; amount: string | number; cost: string | number; refunded?: boolean }>): DailySummary[] {
  const dailyMap = new Map<string, DailySummary>();
  
  sales.forEach(sale => {
    const date = sale.date.split('T')[0]; // Pega só a data
    const revenue = parseFloat(String(sale.amount)) || 0;
    const expenses = parseFloat(String(sale.cost)) || 0;
    const profit = revenue - expenses;
    const refunds = sale.refunded ? revenue : 0;
    
    if (dailyMap.has(date)) {
      const existing = dailyMap.get(date)!;
      existing.revenue += revenue;
      existing.expenses += expenses;
      existing.profit += profit;
      existing.refunds += refunds;
    } else {
      dailyMap.set(date, {
        date,
        revenue,
        expenses,
        profit,
        refunds
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

// Funções para gerar dados mockados para outros gráficos
function generateMockTopProducts() {
  return [
    { name: 'Produto A', sales: 150 },
    { name: 'Produto B', sales: 120 },
    { name: 'Produto C', sales: 100 },
    { name: 'Produto D', sales: 80 },
    { name: 'Produto E', sales: 60 }
  ];
}

function generateMockSalesByPlatform() {
  return [
    { platform: 'Shopee', sales: 45 },
    { platform: 'Mercado Livre', sales: 30 },
    { platform: 'Instagram', sales: 15 },
    { platform: 'WhatsApp', sales: 10 }
  ];
}

function generateMockSalesByWeekday() {
  return [
    { day: 'Seg', sales: 20 },
    { day: 'Ter', sales: 25 },
    { day: 'Qua', sales: 30 },
    { day: 'Qui', sales: 35 },
    { day: 'Sex', sales: 40 },
    { day: 'Sáb', sales: 45 },
    { day: 'Dom', sales: 15 }
  ];
}

function generateMockSalesByHour() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    sales: Math.floor(Math.random() * 50) + 10
  }));
}

function generateMockExpenseDistribution() {
  return [
    { category: 'Marketing', amount: 30 },
    { category: 'Logística', amount: 25 },
    { category: 'Operacional', amount: 20 },
    { category: 'Administrativo', amount: 15 },
    { category: 'Outros', amount: 10 }
  ];
}

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