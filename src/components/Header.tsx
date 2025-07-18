'use client';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface PeriodInfoProps { periodLabel: string; productLabel: string }
interface Totals { revenue: number; profit: number; expenses: number; refunds: number }

export function Header({
  periodInfo,
  totals,
  onToggleFilters,
}: {
  periodInfo: PeriodInfoProps;
  totals: Totals;
  onToggleFilters?: () => void;
}) {
  const { name, avatarUrl, signOut } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const MetricCard = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: number;
    className?: string;
  }) => (
    <div
      className={cn(
        'flex flex-col items-start justify-center border rounded-md px-3 py-1 max-w-44 text-xs sm:text-sm',
        className
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="font-semibold text-sm sm:text-base">
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  );

  return (
    <header className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 m-0">
        {/* LOGO + subtítulo */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-none">Finestra V2</h1>
          <span className="text-xs opacity-80">
            {periodInfo.periodLabel} — {periodInfo.productLabel}
          </span>
        </div>

        {/* METRIC CARDS */}
        <div className="flex flex-wrap gap-2">
          <MetricCard
            label="Faturamento"
            value={totals.revenue}
            className="bg-green-50 border-green-200 text-green-800"
          />
          <MetricCard
            label="Lucro Líquido"
            value={totals.profit}
            className="bg-emerald-50 border-emerald-200 text-emerald-800"
          />
          <MetricCard
            label="Despesas"
            value={totals.expenses}
            className="bg-red-50 border-red-200 text-red-800"
          />
          <MetricCard
            label="Reembolsos"
            value={totals.refunds}
            className="bg-purple-50 border-purple-200 text-purple-800"
          />
        </div>

        {/* BOTÃO FILTROS */}
        <button
          aria-label="Filtros"
          onClick={onToggleFilters}
          className="hidden sm:flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm hover:bg-white/20"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 14.414V20l-6 3v-8.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filtros
        </button>

        {/* MENU USUÁRIO */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 hover:bg-white/20"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={name ?? 'avatar'}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold">
                {name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium hidden sm:inline">{name}</span>
            <ChevronDown size={16} />
          </button>

          {/* Dropdown – simples, sem libs */}
          {menuOpen && (
            <ul className="absolute right-0 mt-1 w-44 rounded-md bg-white py-1 text-sm text-gray-800 shadow-lg z-50">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                >
                  <Settings size={14} /> Configurações
                </Link>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100"
                >
                  <LogOut size={14} /> Sair
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
} 