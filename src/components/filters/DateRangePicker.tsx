'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { CalendarDays } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import React from 'react'

interface Range { start: Date; end: Date }
export function DateRangePicker ({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const [open, setOpen] = useState(false)
  // Estados locais para inputs manuais
  const [startInput, setStartInput] = useState(value.start.toISOString().slice(0, 10))
  const [endInput, setEndInput] = useState(value.end.toISOString().slice(0, 10))

  // Atualiza inputs locais quando valor externo muda
  React.useEffect(() => {
    setStartInput(value.start.toISOString().slice(0, 10))
    setEndInput(value.end.toISOString().slice(0, 10))
  }, [value.start, value.end])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1">
          <CalendarDays className="h-4 w-4" />
          {format(value.start, 'dd MMM', { locale: ptBR })} – 
          {format(value.end, 'dd MMM', { locale: ptBR })}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="z-[9999] w-80 rounded-md border bg-white p-4 shadow space-y-4 mb-2">
        {/* Inputs manuais */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startInput}
            onChange={e => setStartInput(e.target.value)}
            onBlur={() => {
              if (startInput) onChange({ start: new Date(startInput), end: value.end })
            }}
            className="border rounded px-2 py-1 text-sm"
          />
          <span className="text-neutral-400">–</span>
          <input
            type="date"
            value={endInput}
            onChange={e => setEndInput(e.target.value)}
            onBlur={() => {
              if (endInput) onChange({ start: value.start, end: new Date(endInput) })
            }}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        {/* Atalhos rápidos */}
        <div className="space-y-2">
          {[
            { label: 'Últimos 7 dias', days: 7 },
            { label: 'Últimos 30 dias', days: 30 },
            { label: 'Últimos 90 dias', days: 90 }
          ].map(opt => (
            <button
              key={opt.days}
              onClick={() => {
                onChange({ start: subDays(new Date(), opt.days - 1), end: new Date() })
                setOpen(false)
              }}
              className="block w-full rounded bg-gray-100 px-3 py-2 text-left hover:bg-primary-100"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
} 