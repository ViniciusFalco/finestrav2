'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { CalendarDays } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

interface Range { start: Date; end: Date }
export function DateRangePicker ({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md border px-3 py-1">
          <CalendarDays className="h-4 w-4" />
          {format(value.start, 'dd MMM', { locale: ptBR })} – 
          {format(value.end, 'dd MMM', { locale: ptBR })}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-80 rounded-md border bg-white p-4 shadow">
        {/*  — para simplificar, usar 3 atalhos em vez de date-picker completo — */}
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