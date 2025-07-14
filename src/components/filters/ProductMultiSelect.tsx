'use client'
import React from 'react'
import Select from 'react-select'

export interface Product { id: string; name: string }
interface Props {
  value: string[]                // array de productIds
  onChange: (ids: string[]) => void
  options: Product[]
}

export function ProductMultiSelect({ value, onChange, options }: Props) {
  const selectOptions = options.map(p => ({ value: p.id, label: p.name }))
  const selectedOptions = selectOptions.filter(opt => value.includes(opt.value))

  return (
    <Select
      isMulti
      options={selectOptions}
      value={selectedOptions}
      onChange={opts => onChange(Array.isArray(opts) ? opts.map(o => o.value) : [])}
      placeholder="Filtrar produtos..."
      classNamePrefix="react-select"
      styles={{
        menu: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({ ...base, minHeight: 36 }),
      }}
      noOptionsMessage={() => 'Nada encontrado'}
    />
  )
} 