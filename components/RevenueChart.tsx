'use client'

import { useMemo } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

interface ChartDataPoint {
  date: string
  value: number
}

export function RevenueChart({
  data,
  slug,
}: {
  data: ChartDataPoint[]
  slug: string
}) {
  const gradientId = `g-${slug}`

  const domain = useMemo(() => {
    if (data.length < 2) return [0, 0] as [number, number]
    const vals = data.map((d) => d.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = (max - min) * 0.12 || 1
    return [Math.max(0, min - pad), max + pad] as [number, number]
  }, [data])

  if (data.length < 2) {
    return <div className="h-[64px]" />
  }

  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <YAxis domain={domain} hide />
        <Tooltip
          contentStyle={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            padding: '5px 9px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}
          formatter={(value) => {
            const v = Number(value)
            if (v >= 1_000_000) return [`$${(v / 1_000_000).toFixed(2)}M`, '']
            if (v >= 1_000) return [`$${(v / 1_000).toFixed(1)}K`, '']
            return [`$${v.toFixed(0)}`, '']
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginBottom: 1 }}
          separator=""
          cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 2.5, fill: 'rgba(255,255,255,0.5)', stroke: 'none' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
