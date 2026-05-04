"use client"

import React, { useState, useMemo } from "react"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import { 
  Search, Download, ChevronDown, 
  Users, MousePointer2, ExternalLink, Activity
} from "lucide-react"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface EClicksTabProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

const DIVERSE_PALETTE = [
  '#0288f4', // Blue
  '#f43f5e', // Rose
  '#8b5cf6', // Purple
  '#f59e0b', // Orange
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#f97316', // Orange-dark
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
]

// Mock data for Type Wise
const typeWiseData = [
  { id: 1, label: "DATABASE", users: 795, count: 3886 },
  { id: 2, label: "JOURNAL", users: 9, count: 20 },
]

// Mock data for Title Wise
const titleWiseData = [
  { id: 1, label: "Scopus", type: "DATABASE", users: 532, count: 1490 },
  { id: 2, label: "IEEE Xplore Digital Library", type: "DATABASE", users: 278, count: 604 },
  { id: 3, label: "ScienceDirect", type: "DATABASE", users: 192, count: 364 },
  { id: 4, label: "SpringerLink", type: "DATABASE", users: 200, count: 355 },
  { id: 5, label: "Emerald", type: "DATABASE", users: 164, count: 286 },
  { id: 6, label: "Taylor and Francis eBooks", type: "DATABASE", users: 119, count: 165 },
  { id: 7, label: "Statista", type: "DATABASE", users: 98, count: 149 },
  { id: 8, label: "SAGE Publications and Journals", type: "DATABASE", users: 72, count: 138 },
  { id: 9, label: "ACM Digital Library", type: "DATABASE", users: 59, count: 104 },
  { id: 10, label: "Taylor & Francis Online", type: "DATABASE", users: 64, count: 89 },
  { id: 11, label: "IET Digital Library", type: "DATABASE", users: 38, count: 48 },
  { id: 12, label: "Gale", type: "DATABASE", users: 31, count: 40 },
  { id: 13, label: "Bloomsbury Collections", type: "DATABASE", users: 21, count: 30 },
]

type ViewType = 'type' | 'title'

export default function EClicksTab({ isDark, chartTextColor, gridColor }: EClicksTabProps) {
  const { notify } = useNotifications()
  const [activeView, setActiveView] = useState<ViewType>('type')
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  const rawData = useMemo(() => {
    return activeView === 'type' ? typeWiseData : titleWiseData
  }, [activeView])

  // Memoized Data Processing
  const filteredData = useMemo(() => {
    let result = rawData.map(d => ({
      ...d,
      value: d.count
    }))
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => 
        item.label.toLowerCase().includes(q) || (item.type && item.type.toLowerCase().includes(q))
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
  }, [rawData, searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entriesPerPage === 'All') return filteredData
    const limit = parseInt(entriesPerPage)
    const start = (currentPage - 1) * limit
    return filteredData.slice(start, start + limit)
  }, [filteredData, currentPage, entriesPerPage])

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        return null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleExport = (type: string) => {
    notify("export", `Exporting eResource Click Report`, `Your ${type} file is being prepared and will be available shortly.`)
  }

  // Custom Tooltip Matching other modules
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = filteredData.reduce((sum: number, item: any) => sum + item.value, 0);
      const percent = ((data.value / total) * 100).toFixed(2);
      
      return (
        <div className="bg-white dark:bg-[#1a2234] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 z-[100] shadow-xl shadow-blue-500/5">
          <p className="text-sm font-medium text-slate-800 dark:text-white mb-3 border-b border-slate-50 dark:border-slate-800/50 pb-2">{data.label}</p>
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
              <span className="text-[11px] font-medium text-slate-400 tracking-tight">Click Count</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-medium text-slate-800 dark:text-slate-100">{data.value.toLocaleString()}</span>
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
      {/* Header with Tabs and Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <AnimatedTabs 
          tabs={[
            { id: 'type', label: 'eResource Type Wise' },
            { id: 'title', label: 'eResource Title Wise' }
          ]}
          activeId={activeView}
          onChange={(id) => { setActiveView(id as ViewType); setCurrentPage(1); }}
          containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-800/50"
          activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all flex items-center justify-center whitespace-nowrap min-w-[160px]"
        />
        <ExportDropdown onExport={handleExport} />
      </div>

      {/* Visualization Card */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden relative">
        <div className="mb-10">
          <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
            {activeView === 'type' ? 'eResource Type Wise' : 'eResource Title Wise'}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">Comparative click engagement across resources</p>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                 data={filteredData.slice(0, 15)}
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
                 {filteredData.slice(0, 15).map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={DIVERSE_PALETTE[index % DIVERSE_PALETTE.length]} stroke="transparent" />
                 ))}
               </Pie>
               <Tooltip content={<CustomTooltip />} />
               <Legend 
                 verticalAlign="middle" 
                 align="right" 
                 layout="vertical" 
                 iconType="circle"
                 formatter={(value) => <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 ml-2">{value}</span>}
               />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-slate-400 italic mt-4">To export the full report, select <span className="font-medium">All</span> from the Show Entries dropdown.</p>
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
               <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30">
                 {[
                   { k: 'label', l: (activeView === 'type' ? 'eResource Type' : 'eResource Title'), w: (activeView === 'title' ? '40%' : '50%') },
                   ...(activeView === 'title' ? [{ k: 'type', l: 'eResource Type', w: '15%' }] : []),
                   { k: 'users', l: 'USERS', w: (activeView === 'title' ? '15%' : '20%') },
                   { k: 'count', l: 'COUNT', w: '30%', align: 'right' }
                 ].map(h => (
                   <th 
                     key={h.k} 
                     className={`${h.w} px-8 py-5 transition-colors cursor-pointer ${sortConfig?.key === h.k ? 'text-[#0288f4]' : 'text-slate-400 hover:text-slate-600'} ${h.align === 'right' ? 'text-right pr-12' : 'text-left'}`}
                     onClick={() => handleSort(h.k)}
                   >
                     <div className={`flex items-center gap-2 whitespace-nowrap ${h.align === 'right' ? 'justify-end' : ''}`}>
                       {h.l}
                     </div>
                   </th>
                 ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/10">
              {displayData.map((row: any, i) => {
                const maxVal = Math.max(...filteredData.map((d: any) => d.count))
                const barWidth = (row.count / maxVal) * 100

                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 truncate">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{row.label}</span>
                    </td>
                    {activeView === 'title' && (
                      <td className="px-8 py-5">
                         <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md tracking-tighter">{row.type}</span>
                      </td>
                    )}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400/60" /> {row.users.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right pr-12">
                       <div className="flex flex-col items-end gap-1.5">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {row.count.toLocaleString()}
                          </span>
                          <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000" 
                               style={{ width: `${barWidth}%` }}
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

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center px-4">
          <p className="text-xs font-medium text-[#adadad]">
            Showing <span className="font-medium text-slate-600 dark:text-slate-300">1-{displayData.length}</span> of <span className="font-medium">{filteredData.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 cursor-not-allowed"><ChevronDown className="w-5 h-5 rotate-90" /></button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl font-medium text-sm bg-[#0288f4] text-white">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 cursor-not-allowed"><ChevronDown className="w-5 h-5 -rotate-90" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
