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
import { SalesByHour } from '@/hooks/useDashboardData';

interface SalesByHourChartProps {
  data: SalesByHour[];
  loading?: boolean;
}

const SalesByHourChart: React.FC<SalesByHourChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendas por Horário
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
          Vendas por Horário
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const maxQuantity = Math.max(...data.map(item => item.quantity));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vendas por Horário
      </h3>
      
      {/* Resumo */}
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-gray-900">{totalQuantity}</div>
        <div className="text-sm text-gray-600">Total de vendas no período</div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="hourRange"
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [value.toString(), 'Quantidade']}
            labelFormatter={(label) => `Horário: ${label}`}
          />
          <Bar
            dataKey="quantity"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Lista detalhada */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detalhamento por Horário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map((item, index) => {
            const percentage = totalQuantity > 0 ? (item.quantity / totalQuantity) * 100 : 0;
            const isHighest = item.quantity === maxQuantity;
            
            return (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">{item.hourRange}</span>
                  {isHighest && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Pico
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{item.quantity}</div>
                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesByHourChart; 