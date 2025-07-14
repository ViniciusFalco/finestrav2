'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AccumulatedSummary } from '@/hooks/useDashboardData';

interface AccumulatedChartProps {
  data: AccumulatedSummary[];
  loading?: boolean;
}

const AccumulatedChart: React.FC<AccumulatedChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Acumulado
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Acumulado
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  // Formatar dados para o gráfico
  const chartData = data.map(item => ({
    ...item,
    date: item.date.split('-').reverse().join('/'),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumo Acumulado
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="cumRevenue"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Receita Acumulada"
          />
          <Area
            type="monotone"
            dataKey="cumExpenses"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Despesas Acumuladas"
          />
          <Area
            type="monotone"
            dataKey="cumProfit"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Lucro Acumulado"
          />
          {data[0]?.cumHistoricalAvg && (
            <Area
              type="monotone"
              dataKey="cumHistoricalAvg"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.4}
              name="Média Histórica"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccumulatedChart; 