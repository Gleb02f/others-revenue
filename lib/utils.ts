import { ProtocolRevenue, Timeframe } from './types'

export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return 'N/A'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return ''
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function getRevenueForTimeframe(
  protocol: ProtocolRevenue,
  timeframe: Timeframe
): number | null {
  switch (timeframe) {
    case '24h': return protocol.total24h
    case '7d': return protocol.total7d
    case '30d': return protocol.total30d
  }
}

/**
 * Calculate % change for a timeframe by comparing current period vs previous period.
 * For 24h: today vs yesterday (use API change_1d).
 * For 7d: last 7 days vs 7 days before that.
 * For 30d: last 30 days vs 30 days before that.
 */
export function getChangeForTimeframe(
  protocol: ProtocolRevenue,
  timeframe: Timeframe
): number | null {
  if (timeframe === '24h') return protocol.change_1d

  const days = timeframe === '7d' ? 7 : 30
  const chart = protocol.chartData
  if (!chart || chart.length < days * 2) return null

  const now = Date.now() / 1000
  const currentCutoff = now - days * 86400
  const prevCutoff = now - days * 2 * 86400

  let currentSum = 0
  let prevSum = 0

  for (const [ts, val] of chart) {
    if (ts >= currentCutoff) currentSum += val
    else if (ts >= prevCutoff) prevSum += val
  }

  if (prevSum === 0) return null
  return ((currentSum - prevSum) / prevSum) * 100
}

const CHART_DAYS: Record<Timeframe, number> = {
  '24h': 14,
  '7d': 30,
  '30d': 90,
}

export function filterChartData(
  data: [number, number][],
  timeframe: Timeframe
): { date: string; value: number }[] {
  const days = CHART_DAYS[timeframe]
  const cutoff = Date.now() / 1000 - days * 86400
  return data
    .filter(([ts]) => ts >= cutoff)
    .map(([ts, value]) => ({
      date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value,
    }))
}
