export type Timeframe = '24h' | '7d' | '30d'

export interface ProtocolRevenue {
  slug: string
  name: string
  displayName: string
  logo: string
  total24h: number | null
  total7d: number | null
  total30d: number | null
  totalAllTime: number | null
  change_1d: number | null
  chartData: [number, number][] // [unixTimestamp, value]
}

export interface ProtocolConfig {
  slug: string
  displayName: string
  group: 'terminal' | 'tracker'
}
