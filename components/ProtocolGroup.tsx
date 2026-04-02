'use client'

import { ProtocolRevenue, Timeframe } from '@/lib/types'
import { RevenueCard } from './RevenueCard'

export function ProtocolGroup({
  title,
  protocols,
  timeframe,
  startIndex,
  selectedSlug,
  onSelect,
}: {
  title: string
  protocols: ProtocolRevenue[]
  timeframe: Timeframe
  startIndex: number
  selectedSlug?: string
  onSelect?: (slug: string) => void
}) {
  if (protocols.length === 0) return null

  return (
    <section>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--text-3)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {protocols.map((protocol, i) => (
          <RevenueCard
            key={protocol.slug}
            protocol={protocol}
            timeframe={timeframe}
            index={startIndex + i}
            selected={selectedSlug === protocol.slug}
            onSelect={() => onSelect?.(protocol.slug)}
          />
        ))}
      </div>
    </section>
  )
}
