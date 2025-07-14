import { useState, useEffect, useCallback } from 'react';

// Tipos para os dados do dashboard
export interface DailySummary {
  date: string;
  revenue: number;
  refunds: number;
  expenses: number;
  profit: number;
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
  totalRefunds: number;
  totalExpenses: number;
  totalProfit: number;
}

export interface ExpenseDistribution {
  category: string;
  amount: number;
  percentage: number;
  type: 'fixed' | 'variable';
}

// Novos tipos para Sprint 5
export interface TopProduct {
  product: string;
  revenue: number;
}

export interface SalesByPlatform {
  platform: string;
  revenue: number;
  refunds: number;
  quantity: number;
}

export interface SalesByWeekday {
  weekday: string;
  quantity: number;
}

export interface SalesByHour {
  hourRange: string;
  quantity: number;
}

// Dados mockados para desenvolvimento
const mockDailyData: DailySummary[] = [
  { date: '2024-01-01', revenue: 1500, refunds: 50, expenses: 800, profit: 650 },
  { date: '2024-01-02', revenue: 2200, refunds: 100, expenses: 900, profit: 1200 },
  { date: '2024-01-03', revenue: 1800, refunds: 75, expenses: 850, profit: 875 },
  { date: '2024-01-04', revenue: 2500, refunds: 120, expenses: 1000, profit: 1380 },
  { date: '2024-01-05', revenue: 2100, refunds: 90, expenses: 950, profit: 1060 },
  { date: '2024-01-06', revenue: 2800, refunds: 150, expenses: 1100, profit: 1550 },
  { date: '2024-01-07', revenue: 2400, refunds: 110, expenses: 1050, profit: 1240 },
];

const mockExpenseDistribution: ExpenseDistribution[] = [
  { category: 'Aluguel', amount: 2000, percentage: 25, type: 'fixed' },
  { category: 'Salários', amount: 3000, percentage: 37.5, type: 'fixed' },
  { category: 'Marketing', amount: 1500, percentage: 18.75, type: 'variable' },
  { category: 'Fornecedores', amount: 800, percentage: 10, type: 'variable' },
  { category: 'Serviços', amount: 700, percentage: 8.75, type: 'variable' },
];

// Novos dados mockados para Sprint 5
const mockTopProducts: TopProduct[] = [
  { product: 'Produto A', revenue: 4500 },
  { product: 'Produto B', revenue: 3200 },
  { product: 'Produto C', revenue: 2800 },
  { product: 'Produto D', revenue: 2100 },
  { product: 'Outros', revenue: 1500 },
];

const mockSalesByPlatform: SalesByPlatform[] = [
  { platform: 'Shopee', revenue: 3800, refunds: 120, quantity: 45 },
  { platform: 'Mercado Livre', revenue: 3200, refunds: 80, quantity: 38 },
  { platform: 'Instagram', revenue: 2800, refunds: 60, quantity: 32 },
  { platform: 'WhatsApp', revenue: 2200, refunds: 40, quantity: 28 },
];

const mockSalesByWeekday: SalesByWeekday[] = [
  { weekday: 'Segunda', quantity: 15 },
  { weekday: 'Terça', quantity: 22 },
  { weekday: 'Quarta', quantity: 18 },
  { weekday: 'Quinta', quantity: 25 },
  { weekday: 'Sexta', quantity: 30 },
  { weekday: 'Sábado', quantity: 35 },
  { weekday: 'Domingo', quantity: 20 },
];

const mockSalesByHour: SalesByHour[] = [
  { hourRange: '00-03h', quantity: 5 },
  { hourRange: '03-06h', quantity: 2 },
  { hourRange: '06-09h', quantity: 8 },
  { hourRange: '09-12h', quantity: 25 },
  { hourRange: '12-15h', quantity: 35 },
  { hourRange: '15-18h', quantity: 40 },
  { hourRange: '18-21h', quantity: 45 },
  { hourRange: '21-24h', quantity: 20 },
];

// Dados mockados de produtos para o multi-select
export const mockAllProducts = [
  { id: 'produto-a', name: 'Produto A' },
  { id: 'produto-b', name: 'Produto B' },
  { id: 'produto-c', name: 'Produto C' },
  { id: 'produto-d', name: 'Produto D' },
  { id: 'produto-e', name: 'Produto E' },
  { id: 'produto-f', name: 'Produto F' },
];

// Função para obter dados diários
export const getDailySummary = async (
  startDate: string,
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<DailySummary[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados filtrados por período
  return mockDailyData.filter(item => 
    item.date >= startDate && item.date <= endDate
  );
};

// Função para obter dados acumulados
export const getAccumulatedSummary = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<AccumulatedSummary[]> => {
  const dailyData = await getDailySummary(startDate, endDate, productIds);
  
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
      cumProfit,
      cumHistoricalAvg: cumRevenue / dailyData.length // Média histórica simples
    };
  });
};

// Função para obter totais do período
export const getPeriodTotals = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<PeriodTotals> => {
  const dailyData = await getDailySummary(startDate, endDate, productIds);
  
  return dailyData.reduce((totals, item) => ({
    totalRevenue: totals.totalRevenue + item.revenue,
    totalRefunds: totals.totalRefunds + item.refunds,
    totalExpenses: totals.totalExpenses + item.expenses,
    totalProfit: totals.totalProfit + item.profit,
  }), {
    totalRevenue: 0,
    totalRefunds: 0,
    totalExpenses: 0,
    totalProfit: 0,
  });
};

// Função para obter distribuição de despesas
export const getExpenseDistribution = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string
): Promise<ExpenseDistribution[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados
  return mockExpenseDistribution;
};

// Novas funções para Sprint 5
export const getTopProducts = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<TopProduct[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados
  return mockTopProducts;
};

export const getSalesByPlatform = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<SalesByPlatform[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados
  return mockSalesByPlatform;
};

export const getSalesByWeekday = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<SalesByWeekday[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados
  return mockSalesByWeekday;
};

export const getSalesByHour = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endDate: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productIds?: string[]
): Promise<SalesByHour[]> => {
  // TODO: Implementar chamada real para o Supabase
  // Por enquanto, retorna dados mockados
  return mockSalesByHour;
};

// Hook principal para usar os dados do dashboard
export const useDashboardData = ({ 
  dateRange, 
  productIds 
}: { 
  dateRange: { start: Date; end: Date }; 
  productIds: string[] 
}) => {
  const [dailyData, setDailyData] = useState<DailySummary[]>([]);
  const [accumulatedData, setAccumulatedData] = useState<AccumulatedSummary[]>([]);
  const [periodTotals, setPeriodTotals] = useState<PeriodTotals>({
    totalRevenue: 0,
    totalRefunds: 0,
    totalExpenses: 0,
    totalProfit: 0,
  });
  const [expenseDistribution, setExpenseDistribution] = useState<ExpenseDistribution[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesByPlatform, setSalesByPlatform] = useState<SalesByPlatform[]>([]);
  const [salesByWeekday, setSalesByWeekday] = useState<SalesByWeekday[]>([]);
  const [salesByHour, setSalesByHour] = useState<SalesByHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = dateRange.start.toISOString().split('T')[0];
      const endDate = dateRange.end.toISOString().split('T')[0];
      
      const [
        daily, 
        accumulated, 
        totals, 
        distribution,
        topProductsData,
        platformData,
        weekdayData,
        hourData
      ] = await Promise.all([
        getDailySummary(startDate, endDate, productIds),
        getAccumulatedSummary(startDate, endDate, productIds),
        getPeriodTotals(startDate, endDate, productIds),
        getExpenseDistribution(startDate, endDate),
        getTopProducts(startDate, endDate, productIds),
        getSalesByPlatform(startDate, endDate, productIds),
        getSalesByWeekday(startDate, endDate, productIds),
        getSalesByHour(startDate, endDate, productIds),
      ]);
      
      setDailyData(daily);
      setAccumulatedData(accumulated);
      setPeriodTotals(totals);
      setExpenseDistribution(distribution);
      setTopProducts(topProductsData);
      setSalesByPlatform(platformData);
      setSalesByWeekday(weekdayData);
      setSalesByHour(hourData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end, productIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dailyData,
    accumulatedData,
    periodTotals,
    expenseDistribution,
    topProducts,
    salesByPlatform,
    salesByWeekday,
    salesByHour,
    allProducts: mockAllProducts,
    loading,
    error,
    refreshData: fetchData,
  };
}; 