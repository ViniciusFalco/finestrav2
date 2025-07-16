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
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Finestra V2</h1>
          {/* Título de filtros dinâmico */}
          <div className="text-sm font-medium text-white/80 mt-1">
            {mesAtual} – {produtosSelecionados}
          </div>
        </div>
        <div>
          <UserMenu />
        </div>
      </div>
      {/* Cards coloridos de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 pb-4">
        <Card className="bg-green-50 border-green-200 text-green-800">
          <CardContent className="p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Faturamento</span>
              <Receipt className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">R$ {resumo.faturamento}</span>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 text-emerald-800">
          <CardContent className="p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Lucro Líquido</span>
              <PiggyBank className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">R$ {resumo.lucro}</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 text-red-800">
          <CardContent className="p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Despesas</span>
              <ArrowUp className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">R$ {resumo.despesas}</span>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200 text-purple-800">
          <CardContent className="p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Reembolsos</span>
              <ArrowDown className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">R$ {resumo.reembolsos}</span>
          </CardContent>
        </Card>
      </div>
    </header>
  );
} 