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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const totalRevenue = payload[0].payload.totalRevenue || 0;
    const percentage = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{data.product}</p>
        <div className="space-y-1 text-sm">
          <p className="text-green-600">
            <span className="font-medium">Receita:</span> R$ {data.revenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </p>
          <p className="text-blue-600">
            <span className="font-medium">Percentual:</span> {percentage.toFixed(1).replace('.', ',')}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

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

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  
  // Adicionar totalRevenue aos dados para o tooltip
  const chartData = data.map(item => ({
    ...item,
    totalRevenue
  }));

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
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(((percent || 0) * 100) || 0).toFixed(1).replace('.', ',')}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela detalhada */}
        <div>
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-900">
              R$ {(totalRevenue || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Receita Total</div>
          </div>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Produto</th>
                <th className="text-right py-2 font-medium text-gray-700">%</th>
                <th className="text-right py-2 font-medium text-gray-700">Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-gray-700">{item.product}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 text-gray-600">
                    {(((item.revenue || 0) / (totalRevenue || 1)) * 100).toFixed(1)}%
                  </td>
                  <td className="text-right py-2 font-medium">
                    R$ {(item.revenue || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopProductsChart; 