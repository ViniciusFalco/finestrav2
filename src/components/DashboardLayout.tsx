'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  periodTotals?: {
    totalRevenue: number;
    totalRefunds: number;
    totalExpenses: number;
    totalProfit: number;
  };
}

export function DashboardLayout({ children, periodTotals }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-800 text-white transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}>
        <div className="p-4 border-b border-gray-700">
          <button 
            onClick={() => setOpen(!open)} 
            className="w-full text-left text-gray-300 hover:text-white transition-colors"
          >
            {open ? '⇦' : '⇨'}
          </button>
        </div>
        <nav className="mt-4">
          <Link href="/dashboard" className="block p-4 hover:bg-gray-700 transition-colors">
            <span className={open ? '' : 'hidden'}>Dashboard</span>
            {!open && <span>📊</span>}
          </Link>
          <Link href="/expenses" className="block p-4 hover:bg-gray-700 transition-colors">
            <span className={open ? '' : 'hidden'}>Despesas</span>
            {!open && <span>💰</span>}
          </Link>
          <Link href="/sales" className="block p-4 hover:bg-gray-700 transition-colors">
            <span className={open ? '' : 'hidden'}>Vendas</span>
            {!open && <span>📈</span>}
          </Link>
          <Link href="/goals" className="block p-4 hover:bg-gray-700 transition-colors">
            <span className={open ? '' : 'hidden'}>Metas</span>
            {!open && <span>🎯</span>}
          </Link>
          <Link href="/categories" className="block p-4 hover:bg-gray-700 transition-colors">
            <span className={open ? '' : 'hidden'}>Categorias</span>
            {!open && <span>📁</span>}
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={handleSignOut}
            className={`w-full p-2 bg-red-600 hover:bg-red-700 rounded transition-colors ${open ? '' : 'hidden'}`}
          >
            Sair
          </button>
          {!open && (
            <button 
              onClick={handleSignOut}
              className="w-full p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              title="Sair"
            >
              🚪
            </button>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Finestra V2</h1>
            <div className="flex space-x-4">
              {/* Cards de resumo */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg min-w-[120px]">
                <div className="text-sm text-blue-600 font-medium">Faturamento</div>
                <div className="text-lg font-bold text-blue-900">
                  R$ {periodTotals?.totalRevenue.toLocaleString() || '0'}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg min-w-[120px]">
                <div className="text-sm text-red-600 font-medium">Reembolsos</div>
                <div className="text-lg font-bold text-red-900">
                  R$ {periodTotals?.totalRefunds.toLocaleString() || '0'}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg min-w-[120px]">
                <div className="text-sm text-orange-600 font-medium">Despesas</div>
                <div className="text-lg font-bold text-orange-900">
                  R$ {periodTotals?.totalExpenses.toLocaleString() || '0'}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg min-w-[120px]">
                <div className="text-sm text-green-600 font-medium">Lucro Líquido</div>
                <div className="text-lg font-bold text-green-900">
                  R$ {periodTotals?.totalProfit.toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6 overflow-auto bg-gray-50 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 