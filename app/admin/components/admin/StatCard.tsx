"use client"

import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  trend: string
  trendUp?: boolean | null
  icon: LucideIcon
  colorClass?: string
  index?: number 
}

export default function StatCard({ title, value, trend, trendUp = true, index = 0 }: StatCardProps) {
  
  // Premium Gradients per index
  const gradients = [
    "linear-gradient(135deg, #0288f4 0%, #2ac9fa 100%)",
    "linear-gradient(135deg, #2d78f2 0%, #2baef7 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #2ac8f9 100%)",
    "linear-gradient(135deg, #2563eb 0%, #77ccff 100%)"
  ];
  
  const selectedGradient = gradients[index % gradients.length];

  return (
    <div 
      className="stat-card relative overflow-hidden text-white group" 
      style={{ 
        background: selectedGradient,
        borderRadius: '24px',
        padding: '24px',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="relative z-10 flex flex-col min-h-[140px]">
        {/* Top: Title bar with options */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[18px] font-medium text-white leading-tight tracking-tight">{title}</p>
          <MoreHorizontal className="w-5 h-5 text-white cursor-pointer hover:opacity-80 transition-opacity" strokeWidth={3} />
        </div>

        {/* Bottom group: Value + Trend Badge (tightly packed at the bottom) */}
        <div className="mt-auto flex flex-col gap-1">
          <h3 className="text-[42px] font-medium leading-none tracking-tight">{value}</h3>
          <div>
            <span 
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-sm ${
                trendUp === true 
                  ? 'bg-emerald-100/90 text-emerald-600' 
                  : trendUp === false 
                    ? 'bg-rose-100/90 text-rose-600' 
                    : 'bg-slate-100/90 text-slate-600'
              }`}
            >
              {trendUp === true
                ? <TrendingUp className="w-3 h-3" />
                : trendUp === false
                  ? <TrendingDown className="w-3 h-3" />
                  : <Minus className="w-3 h-3" />}
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}