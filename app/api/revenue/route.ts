import { NextResponse } from 'next/server'
import { PROTOCOLS } from '@/lib/protocols'
import { ProtocolRevenue } from '@/lib/types'

const DEFILLAMA_BASE = 'https://api.llama.fi/summary/fees'

export async function GET() {
  const results = await Promise.allSettled(
    PROTOCOLS.map(async (protocol) => {
      const res = await fetch(
        `${DEFILLAMA_BASE}/${protocol.slug}?dataType=dailyRevenue`,
        { next: { revalidate: 300 } }
      )
      if (!res.ok) throw new Error(`Failed to fetch ${protocol.slug}`)
      const data = await res.json()

      return {
        slug: protocol.slug,
        name: data.name || protocol.displayName,
        displayName: protocol.displayName,
        logo: data.logo || null,
        total24h: data.total24h ?? null,
        total7d: data.total7d ?? null,
        total30d: data.total30d ?? null,
        totalAllTime: data.totalAllTime ?? null,
        change_1d: data.change_1d ?? null,
        chartData: data.totalDataChart || [],
      } satisfies ProtocolRevenue
    })
  )

  const protocols = results
    .filter(
      (r): r is PromiseFulfilledResult<ProtocolRevenue> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value)

  return NextResponse.json(
    { protocols, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
  )
}
