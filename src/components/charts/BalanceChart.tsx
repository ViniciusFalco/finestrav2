'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PeriodTotals } from '@/hooks/useDashboardData';

interface BalanceChartProps {
  data: PeriodTotals;
  loading?: boolean;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cobertura de Receita vs Despesa
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  // Preparar dados para o gráfico
  const chartData = [
    {
      name: 'Receita',
      value: data.totalRevenue,
    },
    {
      name: 'Despesas',
      value: data.totalExpenses,
    },
  ];

  const coverage = data.totalRevenue > 0 ? (data.totalExpenses / data.totalRevenue) * 100 : 0;
  const isHealthy = coverage <= 80; // Considera saudável se despesas <= 80% da receita

  // Debug: verificar se os dados estão chegando
  console.log('BalanceChart data:', data);
  console.log('BalanceChart chartData:', chartData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cobertura de Receita vs Despesa
      </h3>
      
      {/* Indicador de saúde financeira */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Cobertura de Despesas:</span>
          <span className={`text-sm font-semibold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
            {coverage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(coverage, 100)}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-1 ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
          {isHealthy ? '✅ Cobertura saudável' : '⚠️ Despesas muito altas'}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
          />
          <Bar
            dataKey="value"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Resumo dos valores */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            R$ {data.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Receita Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            R$ {data.totalExpenses.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Despesas Totais</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceChart; 