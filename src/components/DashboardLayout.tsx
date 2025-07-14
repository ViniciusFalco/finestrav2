'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Target, 
  FolderOpen, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Receipt,
  ArrowDown,
  ArrowUp,
  PiggyBank
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  const supabase = supabaseBrowser();

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'global' });
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className={`bg-neutral-800 text-white transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4 border-b border-neutral-700">
          <Button
            onClick={() => setOpen(!open)}
            variant="ghost"
            size="icon"
            className="w-full text-neutral-300 hover:text-white hover:bg-neutral-700"
            aria-label={open ? 'Recolher sidebar' : 'Expandir sidebar'}
          >
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="mt-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
          >
            <BarChart3 className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Dashboard</span>
          </Link>
          
          <Link 
            href="/expenses" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
          >
            <DollarSign className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Despesas</span>
          </Link>
          
          <Link 
            href="/sales" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
          >
            <TrendingUp className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Vendas</span>
          </Link>
          
          <Link 
            href="/goals" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
          >
            <Target className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Metas</span>
          </Link>
          
          <Link 
            href="/categories" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
          >
            <FolderOpen className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Categorias</span>
          </Link>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className={`w-full ${open ? '' : 'hidden'}`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
          {!open && (
            <Button
              onClick={handleSignOut}
              variant="destructive"
              size="icon"
              className="w-full"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-medium">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <h1 className="text-2xl font-bold">Finestra V2</h1>
              
              {/* Cards de resumo responsivos */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white/80">Faturamento</div>
                        <div className="text-lg font-bold">
                          R$ {periodTotals?.totalRevenue.toLocaleString() || '0'}
                        </div>
                      </div>
                      <Receipt className="h-6 w-6 text-white/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white/80">Reembolsos</div>
                        <div className="text-lg font-bold">
                          R$ {periodTotals?.totalRefunds.toLocaleString() || '0'}
                        </div>
                      </div>
                      <ArrowDown className="h-6 w-6 text-white/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white/80">Despesas</div>
                        <div className="text-lg font-bold">
                          R$ {periodTotals?.totalExpenses.toLocaleString() || '0'}
                        </div>
                      </div>
                      <ArrowUp className="h-6 w-6 text-white/60" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white/80">Lucro Líquido</div>
                        <div className="text-lg font-bold">
                          R$ {periodTotals?.totalProfit.toLocaleString() || '0'}
                        </div>
                      </div>
                      <PiggyBank className="h-6 w-6 text-white/60" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-neutral-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 