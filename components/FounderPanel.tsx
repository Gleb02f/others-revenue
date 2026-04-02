'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ProtocolRevenue, Timeframe } from '@/lib/types'
import { formatCurrency, getRevenueForTimeframe } from '@/lib/utils'

const SHARE = 0.03

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
  return `$${v.toFixed(2)}`
}

export function FounderPanel({
  protocol,
  timeframe,
}: {
  protocol: ProtocolRevenue
  timeframe: Timeframe
}) {
  const rev = getRevenueForTimeframe(protocol, timeframe) ?? 0
  const share = rev * SHARE

  // Always use real data for each period, don't extrapolate from a single timeframe
  const daily24 = (protocol.total24h ?? 0) * SHARE
  const daily7d = ((protocol.total7d ?? 0) * SHARE) / 7
  const daily30d = ((protocol.total30d ?? 0) * SHARE) / 30

  // Use 30d data for the most reliable daily average
  const dailyAvg = daily30d
  const monthly = (protocol.total30d ?? 0) * SHARE
  const yearly = monthly * 12

  return (
    <div className="card p-6 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-white/[0.06]">
          <img
            src={protocol.logo}
            alt=""
            width={20}
            height={20}
            className="rounded-full w-5 h-5 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--text-3)' }}>
          3% Founder Share
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${protocol.slug}-${timeframe}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Selected project name */}
          <div className="mb-5">
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-2)' }}>
              {protocol.displayName}
            </span>
          </div>

          {/* Main figure — 3% of selected timeframe */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-[0.06em] mb-1.5" style={{ color: 'var(--text-4)' }}>
              Your {timeframe} share
            </div>
            <div className="text-[28px] font-semibold tracking-[-0.03em] leading-none tabular-nums" style={{ color: 'var(--text-1)' }}>
              {fmt(share)}
            </div>
            <div className="text-[11px] mt-1.5 tabular-nums" style={{ color: 'var(--text-4)' }}>
              of {formatCurrency(rev)} revenue
            </div>
          </div>

          {/* Real data per period */}
          <div style={{ height: '0.5px', background: 'var(--border)' }} className="mb-4" />

          <div className="flex flex-col gap-3">
            <Row label="24h" value={fmt(daily24)} />
            <Row label="7d" value={fmt(daily7d * 7)} />
            <Row label="30d" value={fmt(monthly)} />
          </div>

          <div style={{ height: '0.5px', background: 'var(--border)' }} className="my-4" />

          {/* Projections */}
          <div className="flex flex-col gap-3">
            <Row label="Daily avg" value={fmt(dailyAvg)} sub="30d ÷ 30" />
            <Row label="Yearly proj." value={fmt(yearly)} sub="30d × 12" />
            <Row label="Lifetime" value={fmt((protocol.totalAllTime ?? 0) * SHARE)} />
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-[10px] mt-6" style={{ color: 'var(--text-4)' }}>
        Click any card to simulate
      </p>
    </div>
  )
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{label}</span>
        {sub && <span className="text-[9px] ml-1.5" style={{ color: 'var(--text-4)' }}>{sub}</span>}
      </div>
      <span className="text-[13px] font-medium tabular-nums" style={{ color: 'var(--text-2)' }}>{value}</span>
    </div>
  )
}
