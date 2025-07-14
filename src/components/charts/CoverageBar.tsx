'use client';

import React from 'react';
import { PeriodTotals } from '@/hooks/useDashboardData';

interface CoverageBarProps {
  data: PeriodTotals;
  loading?: boolean;
}

const CoverageBar: React.FC<CoverageBarProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cobertura de Receita vs Despesa
        </h3>
        <div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div>
        <div className="mt-2 text-sm text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cobertura de Receita vs Despesa
        </h3>
        <div className="h-6 w-full rounded bg-gray-200"></div>
        <div className="mt-2 text-sm text-gray-500">Nenhum dado disponível</div>
      </div>
    );
  }

  // Calcular percentual de cobertura
  const total = data.totalRevenue + data.totalExpenses;
  const revenuePct = total > 0 ? data.totalRevenue / total : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cobertura de Receita vs Despesa
      </h3>
      
      {/* Barra de cobertura */}
      <div className="h-6 w-full rounded bg-gray-200">
        <div 
          className="h-full bg-green-500 rounded-l" 
          style={{ width: `${revenuePct * 100}%` }}
        />
      </div>
      
      {/* Legenda */}
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-green-600 font-medium">
          Receitas R$ {data.totalRevenue.toLocaleString()}
        </span>
        <span className="text-red-600 font-medium">
          Despesas R$ {data.totalExpenses.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CoverageBar; 