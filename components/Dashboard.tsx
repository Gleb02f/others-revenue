'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'framer-motion'
import { ProtocolRevenue, Timeframe } from '@/lib/types'
import { PROTOCOLS } from '@/lib/protocols'
import { formatCurrency } from '@/lib/utils'
import { TimeframeSelector } from './TimeframeSelector'
import { ProtocolGroup } from './ProtocolGroup'
import { FounderPanel } from './FounderPanel'

interface ApiResponse {
  protocols: ProtocolRevenue[]
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const DEFAULT_SELECTED = 'gmgn'

function getTotalRevenue(protocols: ProtocolRevenue[], timeframe: Timeframe): number {
  return protocols.reduce((sum, p) => {
    const val = timeframe === '24h' ? p.total24h : timeframe === '7d' ? p.total7d : p.total30d
    return sum + (val ?? 0)
  }, 0)
}

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Dashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_SELECTED)
  const { data, error, isLoading } = useSWR<ApiResponse>(
    '/api/revenue',
    fetcher,
    { refreshInterval: 600_000, revalidateOnFocus: true }
  )

  const protocols = data?.protocols ?? []
  const terminalSlugs = PROTOCOLS.filter((p) => p.group === 'terminal').map((p) => p.slug)
  const trackerSlugs = PROTOCOLS.filter((p) => p.group === 'tracker').map((p) => p.slug)

  const terminals = protocols.filter((p) => terminalSlugs.includes(p.slug))
  const trackers = protocols.filter((p) => trackerSlugs.includes(p.slug))
  const totalRevenue = protocols.length > 0 ? getTotalRevenue(protocols, timeframe) : null
  const selectedProtocol = protocols.find((p) => p.slug === selectedSlug) ?? protocols[0]

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-3)' }}>
              Revenue
            </span>
            {data?.updatedAt && (
              <>
                <span style={{ color: 'var(--text-4)' }}>&middot;</span>
                <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-4)' }}>
                  {formatUpdatedAt(data.updatedAt)}
                </span>
              </>
            )}
          </div>
          <TimeframeSelector active={timeframe} onSelect={setTimeframe} />
        </div>

        {/* Summary */}
        <div className="mb-12">
          {totalRevenue !== null ? (
            <div className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.04em] leading-none tabular-nums" style={{ color: 'var(--text-1)' }}>
              {formatCurrency(totalRevenue)}
            </div>
          ) : (
            <div className="h-[56px]" />
          )}
          <p className="text-[13px] mt-3" style={{ color: 'var(--text-3)' }}>
            Combined revenue &middot; {timeframe === '24h' ? '24 hours' : timeframe === '7d' ? '7 days' : '30 days'}
          </p>
        </div>

        {/* Mobile: founder panel on top */}
        {selectedProtocol && (
          <div className="lg:hidden mb-8">
            <FounderPanel protocol={selectedProtocol} timeframe={timeframe} />
          </div>
        )}

        {/* Main layout: cards + founder panel */}
        <div className="flex gap-6">
          {/* Left: protocol cards */}
          <div className="flex-1 min-w-0">
            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skel h-[200px]" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && !protocols.length && (
              <div className="py-20 text-center">
                <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>Unable to load data</p>
              </div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {protocols.length > 0 && (
                <motion.div
                  key={timeframe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-12"
                >
                  <ProtocolGroup
                    title="Trading Terminals"
                    protocols={terminals}
                    timeframe={timeframe}
                    startIndex={0}
                    selectedSlug={selectedSlug}
                    onSelect={setSelectedSlug}
                  />

                  {trackers.length > 0 && (
                    <>
                      <div style={{ height: '0.5px', background: 'var(--border)' }} />
                      <ProtocolGroup
                        title="Trackers"
                        protocols={trackers}
                        timeframe={timeframe}
                        startIndex={terminals.length}
                        selectedSlug={selectedSlug}
                        onSelect={setSelectedSlug}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: founder panel */}
          {selectedProtocol && (
            <div className="hidden lg:block w-[260px] flex-shrink-0">
              <FounderPanel protocol={selectedProtocol} timeframe={timeframe} />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-[10px] mt-14 text-center" style={{ color: 'var(--text-4)' }}>
          DeFiLlama &middot; Refreshes every 10m
        </p>
      </div>
    </div>
  )
}
