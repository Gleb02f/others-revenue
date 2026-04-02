'use client'

import { motion } from 'framer-motion'
import { ProtocolRevenue, Timeframe } from '@/lib/types'
import { formatCurrency, formatPercent, getRevenueForTimeframe, getChangeForTimeframe, filterChartData } from '@/lib/utils'
import { RevenueChart } from './RevenueChart'

const TIMEFRAME_LABEL: Record<Timeframe, string> = {
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
}

export function RevenueCard({
  protocol,
  timeframe,
  index,
  selected,
  onSelect,
}: {
  protocol: ProtocolRevenue
  timeframe: Timeframe
  index: number
  selected?: boolean
  onSelect?: () => void
}) {
  const revenue = getRevenueForTimeframe(protocol, timeframe)
  const change = getChangeForTimeframe(protocol, timeframe)
  const positive = change !== null && change >= 0
  const chartData = filterChartData(protocol.chartData, timeframe)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onSelect}
      className={`card flex flex-col justify-between cursor-pointer ${selected ? 'ring-1 ring-white/[0.12]' : ''}`}
    >
      <div className="px-6 pt-6 pb-4">
        {/* Header: logo + name + change */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-white/[0.06]">
              <img
                src={protocol.logo}
                alt=""
                width={32}
                height={32}
                className="rounded-full w-8 h-8 object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                }}
              />
            </div>
            <span className="text-[14px] font-medium tracking-[-0.01em]" style={{ color: 'var(--text-2)' }}>
              {protocol.displayName}
            </span>
          </div>
          {change !== null && (
            <span className="text-[12px] font-medium tabular-nums" style={{ color: positive ? 'var(--up)' : 'var(--down)' }}>
              {formatPercent(change)} {TIMEFRAME_LABEL[timeframe]}
            </span>
          )}
        </div>

        {/* Revenue */}
        <div className="text-[30px] font-semibold tracking-[-0.03em] leading-none tabular-nums" style={{ color: 'var(--text-1)' }}>
          {formatCurrency(revenue)}
        </div>
        <div className="text-[12px] mt-2 tabular-nums" style={{ color: 'var(--text-4)' }}>
          {formatCurrency(protocol.totalAllTime)} lifetime
        </div>
      </div>

      {/* Chart */}
      <div className="px-1 pb-1">
        <RevenueChart data={chartData} slug={protocol.slug} />
      </div>
    </motion.div>
  )
}
