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
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-medium w-full pb-2">
      <div className="flex items-end justify-between px-4 pt-3 pb-1">
        <div>
          <h1 className="text-xl font-bold leading-tight">Finestra V2</h1>
          <div className="text-xs font-medium text-white/80 mt-0.5">
            {mesAtual} – {produtosSelecionados}
          </div>
        </div>
        <UserMenu />
      </div>
      {/* Cards coloridos de resumo minimalistas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
        <Card className="bg-green-50 border-green-200 text-green-800 shadow-none h-16 flex items-center">
          <CardContent className="p-2 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium">Faturamento</span>
              <Receipt className="h-4 w-4" />
            </div>
            <span className="text-base font-bold leading-tight">R$ {resumo.faturamento}</span>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 text-emerald-800 shadow-none h-16 flex items-center">
          <CardContent className="p-2 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium">Lucro Líquido</span>
              <PiggyBank className="h-4 w-4" />
            </div>
            <span className="text-base font-bold leading-tight">R$ {resumo.lucro}</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 text-red-800 shadow-none h-16 flex items-center">
          <CardContent className="p-2 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium">Despesas</span>
              <ArrowUp className="h-4 w-4" />
            </div>
            <span className="text-base font-bold leading-tight">R$ {resumo.despesas}</span>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200 text-purple-800 shadow-none h-16 flex items-center">
          <CardContent className="p-2 flex flex-col justify-center h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium">Reembolsos</span>
              <ArrowDown className="h-4 w-4" />
            </div>
            <span className="text-base font-bold leading-tight">R$ {resumo.reembolsos}</span>
          </CardContent>
        </Card>
      </div>
    </header>
  );
} 