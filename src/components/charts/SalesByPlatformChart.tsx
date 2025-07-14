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
import { SalesByPlatform } from '@/hooks/useDashboardData';

interface SalesByPlatformChartProps {
  data: SalesByPlatform[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{`Plataforma: ${label}`}</p>
        <div className="space-y-1 text-sm">
          <p className="text-green-600">
            <span className="font-medium">Receita:</span> R$ {(data.revenue || 0).toLocaleString()}
          </p>
          <p className="text-blue-600">
            <span className="font-medium">Quantidade:</span> {data.quantity || 0}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Ticket médio:</span> R$ {((data.revenue || 0) / (data.quantity || 1)).toFixed(0)}
          </p>
          <p className="text-red-600">
            <span className="font-medium">Reembolsos:</span> R$ {(data.refunds || 0).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const SalesByPlatformChart: React.FC<SalesByPlatformChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendas por Plataforma
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
          Vendas por Plataforma
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalRefunds = data.reduce((sum, item) => sum + (item.refunds || 0), 0);
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const averageTicket = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vendas por Plataforma
      </h3>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Quantidade Total</div>
          <div className="text-lg font-bold text-blue-900">{totalQuantity}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Ticket Médio</div>
          <div className="text-lg font-bold text-green-900">
            R$ {averageTicket.toFixed(0)}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-red-600 font-medium">Reembolsos</div>
          <div className="text-lg font-bold text-red-900">
            R$ {(totalRefunds || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Receita Total</div>
          <div className="text-lg font-bold text-purple-900">
            R$ {(totalRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="platform"
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
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            name="revenue"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Tabela detalhada */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detalhamento por Plataforma</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Plataforma</th>
                <th className="text-right py-2 font-medium text-gray-700">Quantidade</th>
                <th className="text-right py-2 font-medium text-gray-700">Receita</th>
                <th className="text-right py-2 font-medium text-gray-700">Reembolsos</th>
                <th className="text-right py-2 font-medium text-gray-700">Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{item.platform}</td>
                  <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                  <td className="py-2 text-right font-medium text-green-600">
                    R$ {(item.revenue || 0).toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-red-600">
                    R$ {(item.refunds || 0).toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    R$ {((item.revenue || 0) / (item.quantity || 1)).toFixed(0)}
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

export default SalesByPlatformChart; 