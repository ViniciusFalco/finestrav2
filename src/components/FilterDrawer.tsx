'use client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import { ReactNode } from 'react'

export function FilterDrawer({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir filtros"
          className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filtros
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-80">
        <h2 className="mb-4 text-lg font-semibold">Filtros</h2>
        {children}
      </SheetContent>
    </Sheet>
  )
} 