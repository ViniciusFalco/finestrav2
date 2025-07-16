'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  BarChart2,
  Crosshair, // Usar Crosshair para Metas
  FolderCog, 
  ReceiptText, 
  Megaphone, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className={`bg-neutral-800 text-white transition-all duration-300 ease-in-out ${
        open ? 'w-48' : 'w-14'
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
            title="Dashboard"
          >
            <BarChart3 className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Dashboard</span>
          </Link>
          <Link 
            href="/goals" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
            title="Metas"
          >
            <Crosshair className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Metas</span>
          </Link>
          <Link 
            href="/sales" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
            title="Vendas"
          >
            <BarChart2 className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Vendas</span>
          </Link>
          <Link 
            href="/accounts" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
            title="Registro de Contas"
          >
            <FolderCog className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Registro de Contas</span>
          </Link>
          <Link 
            href="/expenses" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
            title="Registro de Despesas"
          >
            <ReceiptText className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Registro de Despesas</span>
          </Link>
          <Link 
            href="/ads" 
            className="flex items-center p-4 hover:bg-neutral-700 transition-colors group"
            title="Ads"
          >
            <Megaphone className="h-5 w-5 text-neutral-400 group-hover:text-white" />
            <span className={`ml-3 ${open ? '' : 'hidden'}`}>Ads</span>
          </Link>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          {/* Nenhum botão de logout aqui */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

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