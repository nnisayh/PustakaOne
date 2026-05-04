"use client"

import React, { useState } from "react"
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush
} from "recharts"
import { 
  TrendingUp, TrendingDown, Minus, Search, Calendar, MousePointer2 
} from "lucide-react"
import { 
  keywordTrendData, platformRankingData, downloadTrendData,
  KEYWORD_COLORS, FACULTIES, FACULTY_COLORS
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import MultiSelectFilter from "@/app/admin/components/shared/MultiSelectFilter"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"

interface OverviewTabProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

const FULL_MONTHS: Record<string, string> = {
  'Jan': 'JANUARY',
  'Feb': 'FEBRUARY',
  'Mar': 'MARCH',
  'Apr': 'APRIL',
  'May': 'MAY',
  'Mei': 'MAY',
  'Jun': 'JUNE',
  'Jul': 'JULY',
  'Aug': 'AUGUST',
  'Sep': 'SEPTEMBER',
  'Oct': 'OCTOBER',
  'Nov': 'NOVEMBER',
  'Dec': 'DECEMBER'
}

export default function OverviewTab({ isDark, chartTextColor, gridColor }: OverviewTabProps) {
  const [viewMode, setViewMode] = useState("keyword")
  const [filterFaculty, setFilterFaculty] = useState<string[]>([])
  const keywordKeys = ["Machine Learning", "Deep Learning", "Data Science", "IoT", "Cloud Computing"]

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Keyword Trend Section */}
      <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-white text-2xl tracking-tight">Keyword Trends</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-medium">Monitoring real-time search performance across faculties</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="w-full sm:w-[220px]">
              <AnimatedTabs 
                tabs={[{ id: 'keyword', label: 'By Keyword' }, { id: 'faculty', label: 'By Faculty' }]}
                activeId={viewMode}
                onChange={setViewMode}
                containerClassName="bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800"
              />
            </div>
            <MultiSelectFilter 
              selected={filterFaculty} 
              options={[...FACULTIES]} 
              placeholder="Faculty"
              onChange={setFilterFaculty} 
            />
            <WidgetDropdown 
              value="This Month" 
              options={["Last 7 Days", "This Month", "Last Month", "This Year"]} 
              onChange={() => {}} 
            />
          </div>
        </div>

        <div className="h-[400px] w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={keywordTrendData} margin={{ top: 10, right: 20, left: -15, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTextColor, fontSize: 13, fontWeight: 600 }} 
                tickFormatter={(val) => `${val} 2026`}
                dy={20} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 13, fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)', 
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  padding: '16px 20px'
                }} 
                itemStyle={{ fontSize: '13px', fontWeight: 500, padding: '4px 0' }}
                cursor={{ stroke: isDark ? '#374151' : '#E5E7EB', strokeWidth: 2 }}
                labelFormatter={(label) => FULL_MONTHS[label] || label}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                iconSize={10}
                wrapperStyle={{ fontSize: '13px', fontWeight: 500, paddingBottom: '40px', paddingRight: '10px' }} 
              />
              {keywordKeys.map((key, i) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={KEYWORD_COLORS[i]} 
                  strokeWidth={4} 
                  dot={false} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: KEYWORD_COLORS[i] }} 
                  animationDuration={1500}
                />
              ))}
              <Brush dataKey="month" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} dy={20} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Platform Ranking */}
        <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
          <h3 className="font-medium text-slate-800 dark:text-white text-xl mb-8 flex items-center gap-2">
            Platform Ranking
            <span className="text-[10px] font-medium bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full tracking-tighter">Live</span>
          </h3>
          <div className="space-y-4">
            {platformRankingData.map(p => {
              const maxAccesses = platformRankingData[0].accesses
              const pct = (p.accesses / maxAccesses) * 100
              const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`
              return (
                <div key={p.rank} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-slate-400 w-6 text-center">{medal}</span>
                      <span className="font-medium text-slate-800 dark:text-white">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">RENEW</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0288f4] to-[#2ac8f9] transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Download Tracker */}
        <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white text-xl">Download Tracker</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">Downloads / Day</p>
            </div>
            <WidgetDropdown value="This Month" options={["Last 7 Days", "This Month"]} onChange={() => {}} />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downloadTrendData} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0288f4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0288f4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="downloads" stroke="#0288f4" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" />
                <Brush dataKey="day" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} dy={30} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
