'use client'

import { DashboardLayout } from '@/components/DashboardLayout'

export default function CategoriesPage() {
  const categoriesContent = (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Categorias</h1>
        <p className="text-gray-600 mb-6">
          Organize suas despesas e vendas em categorias personalizadas.
        </p>
        
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold mb-2">Nenhuma categoria criada</h2>
          <p className="text-sm">Crie sua primeira categoria para começar</p>
        </div>
      </div>
    </div>
  );

  return <DashboardLayout>{categoriesContent}</DashboardLayout>
} 