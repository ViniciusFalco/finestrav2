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

interface TooltipEntry {
  quantity: number;
  totalQuantity: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipEntry }[];
  label?: string;
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const quantity = data.quantity || 0;
    const totalQuantity = data.totalQuantity || 0;
    const percentage = totalQuantity > 0 ? (quantity / totalQuantity) * 100 : 0;
    const avgTicket = 150; // Mock - seria calculado com dados reais
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{`Horário: ${label}`}</p>
        <div className="space-y-1 text-sm">
          <p className="text-yellow-600">
            <span className="font-medium">Quantidade:</span> {quantity}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Valor total:</span> R$ {(quantity * avgTicket).toLocaleString()}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Ticket médio:</span> R$ {avgTicket.toFixed(0)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Percentual:</span> {percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

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

  const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const maxQuantity = Math.max(...data.map(item => item.quantity || 0));
  
  // Adicionar totalQuantity aos dados para o tooltip
  const chartData = data.map(item => ({
    ...item,
    totalQuantity
  }));

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
        <BarChart data={chartData}>
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
          <Tooltip content={<CustomTooltip />} />
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
            const percentage = totalQuantity > 0 ? ((item.quantity || 0) / totalQuantity) * 100 : 0;
            const isHighest = (item.quantity || 0) === maxQuantity;
            
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
                    <div className="text-lg font-bold text-gray-900">{item.quantity || 0}</div>
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