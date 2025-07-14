'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TopProduct } from '@/hooks/useDashboardData';

interface TopProductsChartProps {
  data: TopProduct[];
  loading?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Produtos
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
          Top Produtos
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Produtos
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pizza */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista detalhada */}
        <div>
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">
                R$ {totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Receita Total</div>
            </div>
            
            {data.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{item.product}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                  </span>
                  <span className="font-medium">
                    R$ {item.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProductsChart; 