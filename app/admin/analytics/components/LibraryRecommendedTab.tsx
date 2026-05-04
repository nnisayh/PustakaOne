"use client"

import React, { useState, useMemo } from "react"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Brush
} from "recharts"
import { 
  Users, MousePointer2, ExternalLink, Search, ChevronDown
} from "lucide-react"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface LibraryRecommendedTabProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

const DIVERSE_PALETTE = [
  '#0288f4', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Orange
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#f97316', // Orange-dark
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
]

// Mock data for Library Recommended Links
const recommendedLinksData = [
  { id: 1, title: "Telkom University Open Library", users: 108, clicks: 202 },
  { id: 2, title: "Open Library Publications", users: 49, clicks: 64 },
  { id: 3, title: "Library Research Repository", users: 35, clicks: 58 },
  { id: 4, title: "Academic Journal Portal", users: 28, clicks: 45 },
  { id: 5, title: "Student Resource Center", users: 22, clicks: 38 },
]

export default function LibraryRecommendedTab({ isDark, chartTextColor, gridColor }: LibraryRecommendedTabProps) {
  const { notify } = useNotifications()
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Memoized Data Processing
  const filteredData = useMemo(() => {
    let result = recommendedLinksData.map(d => ({
      ...d,
      label: d.title,
      count: d.clicks,
      value: d.clicks
    }))
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => 
        item.label.toLowerCase().includes(q)
      )
    }
    
    if (sortConfig?.key) {
      result.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entriesPerPage === 'All') return filteredData
    const limit = parseInt(entriesPerPage)
    const start = (currentPage - 1) * limit
    return filteredData.slice(start, start + limit)
  }, [filteredData, currentPage, entriesPerPage])

  const totalPages = entriesPerPage === 'All' ? 1 : Math.ceil(filteredData.length / parseInt(entriesPerPage))

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        return null
      }
      return { key, direction: 'asc' }
    })
  }
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = filteredData.reduce((sum: number, item: any) => sum + item.clicks, 0);
      const percent = ((data.clicks / total) * 100).toFixed(2);

      return (
        <div className="bg-white dark:bg-[#1a2234] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 z-[100] shadow-xl shadow-blue-500/5">
          <p className="text-sm font-medium text-slate-800 dark:text-white mb-3 border-b border-slate-50 dark:border-slate-800/50 pb-2">{data.label}</p>
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
              <span className="text-[11px] font-medium text-slate-400 tracking-tight">Click Count</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-medium text-slate-800 dark:text-slate-100">{data.clicks.toLocaleString()}</span>
               <span className="text-xs font-medium text-blue-500">{percent}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Main Visualization Card - Now using PieChart */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 mb-8 overflow-hidden relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">Recommended Links Engagement</h3>
            <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">Tracking click distribution across curated library resources</p>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                 data={filteredData.slice(0, 10)}
                 cx="50%"
                 cy="50%"
                 innerRadius={80}
                 outerRadius={140}
                 paddingAngle={5}
                 dataKey="value"
                 nameKey="label"
                 animationDuration={1500}
                 animationEasing="ease-out"
               >
                 {filteredData.slice(0, 10).map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={DIVERSE_PALETTE[index % DIVERSE_PALETTE.length]} stroke="transparent" />
                 ))}
               </Pie>
               <Tooltip content={<CustomTooltip />} />
               <Legend 
                 verticalAlign="middle" 
                 align="right" 
                 layout="vertical" 
                 iconType="circle"
                 formatter={(value) => <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 ml-2">{value}</span>}
               />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table Card */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="flex-1 max-w-sm group">
             <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium outline-none focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-medium text-slate-400 tracking-widest">SHOW:</span>
             <WidgetDropdown 
                value={entriesPerPage} 
                options={["10", "25", "50", "All"]} 
                onChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }} 
             />
          </div>
        </div>

        <div className="overflow-x-auto -mx-8">
          <table className="w-full border-collapse table-fixed">
            <thead>
               <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30 h-14">
                 {[
                   { k: 'label', l: 'LINK TITLE', w: '40%' },
                   { k: 'users', l: 'USERS', w: '15%' },
                   { k: 'clicks', l: 'CLICK COUNT', w: '15%' },
                   { k: 'value', l: 'ENGAGEMENT', w: '30%', align: 'right' }
                 ].map(h => (
                   <th 
                     key={h.k} 
                     className={`${h.w} px-8 py-0 transition-colors cursor-pointer whitespace-nowrap ${sortConfig?.key === h.k ? 'text-[#0288f4]' : 'text-slate-400 hover:text-slate-600'} ${h.align === 'right' ? 'text-right pr-12' : 'text-left'}`}
                     onClick={() => handleSort(h.k)}
                   >
                     <div className={`flex items-center gap-2 whitespace-nowrap ${h.align === 'right' ? 'justify-end' : ''}`}>
                       {h.l}
                     </div>
                   </th>
                 ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {displayData.map((row: any, i) => {
                const maxClicks = Math.max(...filteredData.map((d: any) => d.clicks))
                const engagementPercent = (row.clicks / maxClicks) * 100

                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group h-[72px]">
                    <td className="px-8 py-0 max-w-0 truncate">
                        <div className="flex items-center gap-3">
                           <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" />
                           <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate whitespace-nowrap">{row.label}</span>
                        </div>
                    </td>
                    <td className="px-8 py-0">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {row.users.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-0">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <MousePointer2 className="w-3.5 h-3.5 text-slate-400" /> {row.clicks.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-0 text-right pr-12">
                       <div className="flex flex-col items-end gap-1.5">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {row.clicks.toLocaleString()}
                          </span>
                          <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000" 
                               style={{ width: `${engagementPercent}%` }}
                             />
                          </div>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-[#adadad]">
            Showing <span className="font-medium text-slate-600 dark:text-slate-300">1-{displayData.length}</span> of <span className="font-medium">{filteredData.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-200 cursor-not-allowed"><ChevronDown className="w-5 h-5 rotate-90" /></button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl font-medium text-sm bg-[#0288f4] text-white">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-200 cursor-not-allowed"><ChevronDown className="w-5 h-5 -rotate-90" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
