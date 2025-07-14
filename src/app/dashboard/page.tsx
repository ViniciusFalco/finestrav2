'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Finestra V2
        </h1>
        <p className="text-gray-600 mb-6">
          Bem-vindo ao seu painel de controle financeiro, {user?.email}!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Total de Vendas</h3>
            <p className="text-3xl font-bold">R$ 0,00</p>
            <p className="text-blue-100 text-sm">Este mês</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Lucro Líquido</h3>
            <p className="text-3xl font-bold">R$ 0,00</p>
            <p className="text-green-100 text-sm">Este mês</p>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Total de Despesas</h3>
            <p className="text-3xl font-bold">R$ 0,00</p>
            <p className="text-red-100 text-sm">Este mês</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Metas Ativas</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-purple-100 text-sm">Em andamento</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendas Recentes</h2>
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma venda registrada ainda</p>
            <p className="text-sm">Adicione sua primeira venda na seção Vendas</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Despesas Recentes</h2>
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma despesa registrada ainda</p>
            <p className="text-sm">Adicione sua primeira despesa na seção Despesas</p>
          </div>
        </div>
      </div>
    </div>
  )
} 