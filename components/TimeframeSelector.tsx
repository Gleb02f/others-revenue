'use client'

import { Timeframe } from '@/lib/types'

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
]

export function TimeframeSelector({
  active,
  onSelect,
}: {
  active: Timeframe
  onSelect: (t: Timeframe) => void
}) {
  return (
    <div className="seg">
      {TIMEFRAMES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`seg-btn ${active === value ? 'seg-btn-on' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
