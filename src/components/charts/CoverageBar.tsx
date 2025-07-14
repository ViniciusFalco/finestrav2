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
  const coverageIndex = total > 0 ? (data.totalRevenue / (data.totalRevenue + data.totalExpenses)) * 100 : 0;
  const isHealthy = coverageIndex >= 60; // Exemplo: saudável se >= 60%

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Índice de Cobertura de Caixa
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Proporção entre receitas e despesas no período. Quanto maior, mais saudável está o caixa.
      </p>
      {/* Barra de cobertura */}
      <div className="h-6 w-full rounded bg-gray-200 flex">
        <div 
          className="h-full bg-green-500 rounded-l" 
          style={{ width: `${coverageIndex}%` }}
        />
        <div 
          className="h-full bg-red-500 rounded-r" 
          style={{ width: `${100 - coverageIndex}%` }}
        />
      </div>
      {/* Índice de Cobertura */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-700">
          Índice de Cobertura de Caixa: {coverageIndex.toFixed(1).replace('.', ',')}%
        </span>
        <span className={`ml-2 text-xs font-semibold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>({isHealthy ? 'Saudável' : 'Atenção'})</span>
      </div>
      {/* Legenda */}
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-green-600 font-medium">
          Receitas R$ {data.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
        </span>
        <span className="text-red-600 font-medium">
          Despesas R$ {data.totalExpenses.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
        </span>
      </div>
    </div>
  );
};

export default CoverageBar; 