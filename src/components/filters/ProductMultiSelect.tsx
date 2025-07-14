'use client'
import { Fragment, useMemo, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'

export interface Product { id: string; name: string }
interface Props {
  value: string[]                // array de productIds
  onChange: (ids: string[]) => void
  options: Product[]
}

export function ProductMultiSelect ({ value, onChange, options }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      query === ''
        ? options
        : options.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
    [query, options]
  )

  const toggle = (id: string) =>
    value.includes(id)
      ? onChange(value.filter(v => v !== id))
      : onChange([...value, id])

  return (
    <Combobox multiple value={value} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full border rounded-md px-3 py-2"
          displayValue={() => ''}
          placeholder="Filtrar produtos..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4" />
        </Combobox.Button>

        <Transition
          as={Fragment}
          leave="transition-opacity ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg">
            {filtered.map(p => (
              <Combobox.Option
                key={p.id} value={p.id}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? 'bg-primary-100' : ''
                  }`
                }
                onClick={() => toggle(p.id)}
              >
                <span className="flex justify-between">
                  {p.name}
                  {value.includes(p.id) && <Check className="h-4 w-4 text-primary-600" />}
                </span>
              </Combobox.Option>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500">Nada encontrado</div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
      {/* chips selecionados */}
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map(id => {
          const prod = options.find(o => o.id === id)!
          return (
            <span
              key={id}
              className="inline-flex items-center rounded bg-primary-100 px-2 py-0.5 text-xs text-primary-700"
            >
              {prod.name}
              <button
                className="ml-1 h-3 w-3"
                onClick={() => toggle(id)}
              >
                ✕
              </button>
            </span>
          )
        })}
      </div>
    </Combobox>
  )
} 