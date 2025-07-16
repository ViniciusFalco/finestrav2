'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ExpenseDistribution } from '@/hooks/useDashboardData';

interface ExpenseDistributionChartProps {
  data: ExpenseDistribution[];
  loading?: boolean;
}

interface TooltipEntry {
  name: string;
  value: number;
  total: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipEntry }[];
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Valor:</span> R$ {(data.value || 0).toLocaleString()}
          </p>
          <p className="text-blue-600">
            <span className="font-medium">Percentual:</span> {(((data.value || 0) / (data.total || 1)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ 
  data, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição de Despesas
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
          Distribuição de Despesas
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Nenhum dado disponível</div>
        </div>
      </div>
    );
  }

  // Separar despesas fixas e variáveis
  const fixedExpenses = data.filter(item => item.type === 'fixed');
  const variableExpenses = data.filter(item => item.type === 'variable');

  const totalFixed = fixedExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalVariable = variableExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  const total = totalFixed + totalVariable;
  const pieData = [
    { name: 'Despesas Fixas', value: totalFixed, color: '#ef4444', total },
    { name: 'Despesas Variáveis', value: totalVariable, color: '#3b82f6', total },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Distribuição de Despesas
      </h3>
      <p className="text-sm text-gray-600 mb-4">Fixas vs Variáveis</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pizza */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(((percent || 0) * 100) || 0).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista detalhada */}
        <div>
          <div className="space-y-4">
            {/* Despesas Fixas */}
            <div>
              <h4 className="text-sm font-semibold text-red-600 mb-2">
                Despesas Fixas ({(totalFixed || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </h4>
              <div className="space-y-2">
                {fixedExpenses.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        {(item.percentage || 0).toFixed(1)}%
                      </span>
                      <span className="font-medium">
                        R$ {(item.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Despesas Variáveis */}
            <div>
              <h4 className="text-sm font-semibold text-blue-600 mb-2">
                Despesas Variáveis ({(totalVariable || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </h4>
              <div className="space-y-2">
                {variableExpenses.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        {(item.percentage || 0).toFixed(1)}%
                      </span>
                      <span className="font-medium">
                        R$ {(item.amount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDistributionChart; 