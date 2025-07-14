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
import { SalesByWeekday } from '@/hooks/useDashboardData';

interface SalesByWeekdayChartProps {
  data: SalesByWeekday[];
  loading?: boolean;
}

const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const weekdayMap: { [key: string]: string } = {
  'Sunday': 'Dom',
  'Monday': 'Seg', 
  'Tuesday': 'Ter',
  'Wednesday': 'Qua',
  'Thursday': 'Qui',
  'Friday': 'Sex',
  'Saturday': 'Sáb',
  'Dom': 'Dom', 'Seg': 'Seg', 'Ter': 'Ter', 'Qua': 'Qua', 'Qui': 'Qui', 'Sex': 'Sex', 'Sáb': 'Sáb'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const quantity = data.quantity || 0;
    const total = data.total || 0;
    const ticket = quantity > 0 ? total / quantity : 0;
    const labelPt = data.weekdayPt || label;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{`Dia: ${labelPt}`}</p>
        <div className="space-y-1 text-sm">
          <p className="text-blue-600">
            <span className="font-medium">Quantidade:</span> {quantity}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Valor total:</span> R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Ticket médio:</span> R$ {ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const SalesByWeekdayChart: React.FC<SalesByWeekdayChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendas por Dia da Semana
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
          Vendas por Dia da Semana
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  // Garantir todos os dias da semana presentes, mesmo se não houver vendas
  const dataByWeekday: { [key: string]: { quantity: number; total: number } } = {};
  data.forEach(item => {
    const pt = weekdayMap[item.weekday] || item.weekday;
    if (!dataByWeekday[pt]) dataByWeekday[pt] = { quantity: 0, total: 0 };
    dataByWeekday[pt].quantity += item.quantity || 0;
    dataByWeekday[pt].total += (item.total || 0);
  });
  const chartData = WEEKDAYS_PT.map(weekdayPt => ({
    weekdayPt,
    quantity: dataByWeekday[weekdayPt]?.quantity || 0,
    total: dataByWeekday[weekdayPt]?.total || 0
  }));

  const totalQuantity = chartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const maxQuantity = Math.max(...chartData.map(item => item.quantity || 0));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vendas por Dia da Semana
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
            dataKey="weekdayPt"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            ticks={WEEKDAYS_PT}
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
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Lista detalhada */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detalhamento por Dia</h4>
        <div className="space-y-2">
          {chartData.map((item, index) => {
            const percentage = totalQuantity > 0 ? ((item.quantity || 0) / totalQuantity) * 100 : 0;
            const isHighest = (item.quantity || 0) === maxQuantity;
            const ticket = item.quantity > 0 ? item.total / item.quantity : 0;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">{item.weekdayPt}</span>
                  {isHighest && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Mais vendas
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                    <div className="text-lg font-bold text-gray-900">{item.quantity || 0}</div>
                    <div className="text-xs text-green-700">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-purple-700">Ticket médio: R$ {ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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

export default SalesByWeekdayChart; 