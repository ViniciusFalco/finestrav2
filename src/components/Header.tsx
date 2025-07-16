'use client'
import { cn } from '@/lib/utils'
import UserMenu from './UserMenu'

export function Header({ subtitle, totals }: { subtitle: string, totals: { revenue: number, profit: number, expenses: number, refunds: number } }) {
  return (
    <header
      className={cn(
        'w-full',
        'bg-gradient-to-r from-green-500 via-green-600 to-green-700',
        'text-white flex flex-wrap items-center gap-4'
      )}
    >
      {/* Logo + subtítulo */}
      <div className="flex flex-col flex-1 min-w-[180px]">
        <span className="font-bold text-lg leading-tight">Finestra V2</span>
        <span className="text-xs opacity-90">{subtitle}</span>
      </div>

      {/* Mini-cards compactos */}
      <div className="flex flex-wrap gap-2 justify-center flex-1">
        <Card metric="Faturamento" value={totals.revenue} color="green" />
        <Card metric="Lucro Líquido" value={totals.profit} color="emerald" />
        <Card metric="Despesas" value={totals.expenses} color="red" />
        <Card metric="Reembolsos" value={totals.refunds} color="purple" />
      </div>

      {/* Menu do usuário funcional */}
      <div className="relative">
        <UserMenu />
      </div>
    </header>
  )
}

function Card({
  metric,
  value,
  color,
}: {
  metric: string
  value: number
  color: 'green' | 'emerald' | 'red' | 'purple'
}) {
  const variants = {
    green: 'bg-green-50 border-green-200 text-green-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  }[color]

  return (
    <div
      className={cn(
        'max-w-44 min-w-[110px] px-2 py-1 rounded-md border text-center',
        'flex flex-col',
        variants
      )}
    >
      <span className="text-[10px] leading-tight font-semibold">{metric}</span>
      <span className="text-sm font-bold">
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  )
} 