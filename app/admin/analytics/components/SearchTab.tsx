"use client"

import React, { useState, useMemo } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, AreaChart, Area, PieChart, Pie, Brush
} from "recharts"
import { 
  Filter, Calendar, Users, MousePointerSquare, FileText,
  Search, Activity, ChevronDown
} from "lucide-react"
import { 
  keywordTrendData, searchEngineUsageData, keywordTableData,
  KEYWORD_COLORS, FACULTY_COLORS, dataUsageFacultyData
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface SearchTabProps {
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

export default function SearchTab({ isDark, chartTextColor, gridColor }: SearchTabProps) {
  const { notify } = useNotifications()
  const [activeTab, setActiveTab] = useState('engine')
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Memoized Data Processing
  const filteredData = useMemo(() => {
    let result = []
    if (activeTab === 'keywords') {
      result = keywordTableData.map(d => ({
        ...d,
        label: d.keyword,
        users: Math.floor(d.frequency * 0.4),
        count: d.frequency,
        value: d.frequency
      }))
    } else {
      result = searchEngineUsageData.map(d => ({
        ...d,
        label: d.name,
        users: Math.floor(d.value * 120),
        count: Math.floor(d.value * 300),
        frequency: Math.floor(d.value * 300),
        value: Math.floor(d.value * 300)
      }))
    }
    
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
  }, [activeTab, searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entriesPerPage === 'All') return filteredData
    const limit = parseInt(entriesPerPage)
    const start = (currentPage - 1) * limit
    return filteredData.slice(start, start + limit)
  }, [filteredData, currentPage, entriesPerPage])

  const totalPages = entriesPerPage === 'All' ? 1 : Math.ceil(filteredData.length / parseInt(entriesPerPage))

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
              <span className="text-[11px] font-medium text-slate-400 tracking-tight">Search Count</span>
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

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        return null
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <AnimatedTabs 
          tabs={[
            { id: 'engine', label: 'Search Engines' },
            { id: 'keywords', label: 'Search Keywords' }
          ]}
          activeId={activeTab}
          onChange={(id) => { setActiveTab(id); setCurrentPage(1); }}
          containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-800/50"
          activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all flex items-center justify-center whitespace-nowrap min-w-[140px]"
        />
        <ExportDropdown onExport={(fmt) => notify('export', 'Generating Report', `Report is being prepared in ${fmt} format.`)} />
      </div>

      {/* Visualization Card - Now using PieChart */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
              {activeTab === 'keywords' ? 'Top Search Keywords' : 'Search Engine Distribution'}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">
              Detailed distribution of user search behavior
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full" key={activeTab}>
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

      {/* Table Card */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden animate-in fade-in duration-700" key={`table-${activeTab}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="flex-1 max-w-sm group">
             <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab === 'engine' ? 'engines' : 'keywords'}...`}
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
                   { k: 'label', l: (activeTab === 'engine' ? 'SEARCH ENGINE' : 'SEARCH KEYWORD'), w: '40%' },
                   { k: 'users', l: 'USERS', w: '15%' },
                   { k: 'count', l: 'SEARCH COUNT', w: '15%' },
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
                const maxCount = Math.max(...filteredData.map((d: any) => d.count))
                const engagementPercent = (row.count / maxCount) * 100

                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group h-[72px]">
                    <td className="px-8 py-0 truncate">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{row.label}</span>
                    </td>
                    <td className="px-8 py-0">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {(row.users || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-0">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-slate-400" /> {(row.count || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-0 text-right pr-12">
                       <div className="flex flex-col items-end gap-1.5">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {row.count.toLocaleString()}
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
            Showing <span className={`font-medium ${searchQuery ? 'text-blue-500' : 'text-slate-600 dark:text-slate-300'}`}>
              {((currentPage - 1) * parseInt(entriesPerPage)) + 1}-{Math.min(currentPage * parseInt(entriesPerPage), filteredData.length)}
            </span> of <span className="font-medium">{filteredData.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium text-sm transition-all ${currentPage === i + 1 ? 'bg-[#0288f4] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
