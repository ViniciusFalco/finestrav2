import React from 'react';
import UserMenu from './UserMenu';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, PiggyBank, Receipt } from 'lucide-react';

interface HeaderProps {
  mesAtual: string;
  produtosSelecionados: string;
  resumo: {
    faturamento: string;
    lucro: string;
    despesas: string;
    reembolsos: string;
  };
}

export default function Header({ mesAtual, produtosSelecionados, resumo }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-medium w-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-base font-bold leading-tight">Finestra V2</h1>
          <div className="text-[11px] font-medium text-white/80 mt-0.5">
            {mesAtual} – {produtosSelecionados}
          </div>
        </div>
        <UserMenu />
      </div>
      {/* Cards coloridos de resumo ultra-compactos, flat, sem borda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        <Card className="bg-green-50 text-green-800 h-10 flex items-center">
          <CardContent className="p-1 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-medium">Faturamento</span>
              <Receipt className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold leading-tight">R$ {resumo.faturamento}</span>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 text-emerald-800 h-10 flex items-center">
          <CardContent className="p-1 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-medium">Lucro Líquido</span>
              <PiggyBank className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold leading-tight">R$ {resumo.lucro}</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 text-red-800 h-10 flex items-center">
          <CardContent className="p-1 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-medium">Despesas</span>
              <ArrowUp className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold leading-tight">R$ {resumo.despesas}</span>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 text-purple-800 h-10 flex items-center">
          <CardContent className="p-1 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-medium">Reembolsos</span>
              <ArrowDown className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold leading-tight">R$ {resumo.reembolsos}</span>
          </CardContent>
        </Card>
      </div>
    </header>
  );
} 