"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Brush, Legend, Cell, ResponsiveContainer as RechartsContainer
} from "recharts"
import { 
  FileSpreadsheet, File as FileIcon, Users as UsersIcon, Activity,
  Search, ChevronDown, FileText, Globe
} from "lucide-react"
import { 
  userCategoryDownloadData,
  resourceDownloadData,
  dailyDownloadData,
  monthlyDownloadData,
  FACULTY_COLORS 
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface EResourceDownloadReportsProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

type ViewType = 'category' | 'resource' | 'daily' | 'monthly'

export default function EResourceDownloadReports({ isDark, chartTextColor, gridColor }: EResourceDownloadReportsProps) {
  const { notify } = useNotifications()
  const [activeView, setActiveView] = useState<ViewType>('category')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [entries, setEntries] = useState("10")
  const [pdfVisible, setPdfVisible] = useState(true)
  const [htmlVisible, setHtmlVisible] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [dateRange, setDateRange] = useState("Last 30 Days")

  // Handle Tab Change with Loading State
  const handleViewChange = (id: string) => {
    setIsLoading(true)
    setActiveView(id as ViewType)
    setTimeout(() => setIsLoading(false), 300)
  }

  // Data Logic
  const rawData = useMemo(() => {
    switch (activeView) {
      case 'category': return userCategoryDownloadData
      case 'resource': return resourceDownloadData
      case 'daily': return dailyDownloadData
      case 'monthly': return monthlyDownloadData
      default: return []
    }
  }, [activeView])

  const filteredData = useMemo(() => {
    let data = [...rawData]
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(d => {
        const val = (d as any).category || (d as any).resource || (d as any).date || (d as any).month || ""
        return val.toLowerCase().includes(q)
      })
    }

    // Sort Logic
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key]
        const bVal = (b as any)[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return data
  }, [rawData, searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entries === "All") return filteredData
    return filteredData.slice(0, parseInt(entries))
  }, [filteredData, entries])

  const handleExport = (type: string) => {
    notify("export", `Exporting ${activeView} Report`, `Your ${type} file is being prepared and will be available in the notification center shortly.`)
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

  // Helper for Table Column Labels
  const getLabelKey = () => {
    if (activeView === 'category') return 'category'
    if (activeView === 'resource') return 'resource'
    if (activeView === 'daily') return 'date'
    if (activeView === 'monthly') return 'month'
    return 'label'
  }

  const getLabelTitle = () => {
    if (activeView === 'category') return 'User Category'
    if (activeView === 'resource') return 'Domain'
    if (activeView === 'daily') return 'Date'
    if (activeView === 'monthly') return 'Month'
    return 'Label'
  }

  // Custom Tick Formatter for Charts
  const formatXAxis = (tickItem: any) => {
    if (activeView === 'monthly' && typeof tickItem === 'string') {
      const parts = tickItem.split(' ')
      if (parts.length === 2) {
        return `${parts[0].substring(0, 3)} ${parts[1]}`
      }
    }
    return tickItem
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white dark:bg-[#1a2234] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 z-[100]">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-widest mb-3 border-b border-slate-50 dark:border-slate-800/50 pb-2">{label}</p>
          <div className="space-y-2.5">
             {payload.map((entry: any, i: number) => (
                <div key={entry.name} className="flex items-center justify-between gap-12">
                   <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full shadow-sm" 
                        style={{ backgroundColor: entry.name.toLowerCase().includes('pdf') ? '#0288f4' : '#ef4444' }} 
                      />
                      <span className="text-[11px] font-medium text-slate-500 tracking-tight">{entry.name}</span>
                   </div>
                   <span className="text-xs font-medium text-slate-800 dark:text-slate-100">{entry.value.toLocaleString()}</span>
                </div>
             ))}
             <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-100 dark:border-slate-800 mt-2">
                <span className="text-[10px] font-medium text-slate-400 tracking-widest">Grand Total</span>
                <span className="text-xs font-medium text-blue-500">{(total).toLocaleString()}</span>
             </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Section Header with Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <AnimatedTabs 
            tabs={[
              { id: 'category', label: 'User Categorywise' },
              { id: 'resource', label: 'Resourcewise' },
              { id: 'daily', label: 'Daily' },
              { id: 'monthly', label: 'Monthly' }
            ]}
            activeId={activeView}
            onChange={(id) => { setActiveView(id as ViewType); }}
            containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-800/50"
            activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all flex items-center justify-center whitespace-nowrap min-w-[160px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        
        {/* Chart Section */}
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 mb-8 overflow-hidden relative">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                 <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
                    {activeView === 'category' && 'Download Activity by User Type'}
                    {activeView === 'resource' && 'Domain-wise Download Distribution'}
                    {activeView === 'daily' && 'Daily Acquisition Trends'}
                    {activeView === 'monthly' && 'Monthly Growth Performance'}
                 </h3>
                 <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">
                    Real-time library usage metrics
                 </p>
              </div>

              <div className="flex items-center gap-4">
                 {/* Legend Toggles */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-full p-1">
                    <button 
                      onClick={() => setPdfVisible(!pdfVisible)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${pdfVisible ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-400 opacity-40 grayscale'}`}
                    >
                       <div className="w-2.5 h-2.5 rounded-full bg-[#0288f4]" />
                       <span className="text-[10px] font-medium tracking-tight">PDF</span>
                    </button>
                    <button 
                      onClick={() => setHtmlVisible(!htmlVisible)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${htmlVisible ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'text-slate-400 opacity-40 grayscale'}`}
                    >
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                       <span className="text-[10px] font-medium tracking-tight">HTML</span>
                    </button>
                  </div>
              </div>
           </div>

           <div className="h-[400px] w-full animate-in fade-in slide-in-from-bottom-3 duration-1000 zoom-in-95" key={activeView}>
              <ResponsiveContainer width="100%" height="100%">
                 {activeView === 'daily' || activeView === 'monthly' ? (
                   <LineChart data={rawData} margin={{ top: 0, right: 20, left: -20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                      <XAxis 
                        dataKey={getLabelKey()} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }} 
                        interval={activeView === 'daily' ? 4 : 0}
                        tickFormatter={formatXAxis}
                        angle={0}
                        textAnchor="middle"
                        height={25}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }} />
                      <Tooltip content={<CustomTooltip />} />
                      {pdfVisible && (
                        <Line 
                          type="monotone" 
                          dataKey="pdf" 
                          name="PDF Downloaded"
                          stroke="#0288f4" 
                          strokeWidth={4} 
                          dot={false}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                        />
                      )}
                      {htmlVisible && (
                        <Line 
                          type="monotone" 
                          dataKey="html" 
                          name="HTML Saved"
                          stroke="#ef4444" 
                          strokeWidth={4} 
                          dot={false}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                        />
                      )}
                      <Brush 
                        dataKey={getLabelKey()} 
                        height={30} 
                        stroke="#0288f480" 
                        fill={isDark ? "#0288f410" : "#eef7ff"} 
                        travellerWidth={10}
                      />
                   </LineChart>
                 ) : (
                   <BarChart data={rawData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0288f4" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2ac8f9" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                      <XAxis 
                        dataKey={getLabelKey()} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} 
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                      />
                      {pdfVisible && (
                        <Bar 
                          dataKey="pdf" 
                          name="PDF Downloaded"
                          fill="url(#blueGradient)" 
                          radius={[6, 6, 0, 0]} 
                          barSize={activeView === 'category' ? 35 : 50} 
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                      )}
                      {htmlVisible && (
                        <Bar 
                          dataKey="html" 
                          name="HTML Saved"
                          fill="#ef4444" 
                          radius={[6, 6, 0, 0]} 
                          barSize={activeView === 'category' ? 35 : 50} 
                          opacity={0.8}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                      )}
                      <Brush 
                        dataKey={getLabelKey()} 
                        height={30} 
                        stroke="#0288f480" 
                        fill={isDark ? "#0288f410" : "#eef7ff"} 
                        travellerWidth={10}
                        dy={10}
                      />
                   </BarChart>
                 )}
              </ResponsiveContainer>
           </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700" key={`table-${activeView}`}>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
              <div className="flex-1 max-w-sm group">
                 <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                    <input 
                      type="text" 
                      placeholder={`Search ${getLabelTitle()}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium focus:border-blue-500 outline-none transition-all"
                    />
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 {activeView === 'daily' && (
                    <WidgetDropdown 
                      value={dateRange} 
                      options={["Last 7 Days", "Last 30 Days", "Last 90 Days", "Current Month"]} 
                      onChange={setDateRange} 
                      icon="calendar"
                    />
                 )}
                 <span className="text-[11px] font-medium text-slate-400 tracking-widest ml-2">SHOW:</span>
                 <WidgetDropdown 
                    value={entries} 
                    options={["10", "25", "50", "All"]} 
                    onChange={setEntries} 
                 />
              </div>
           </div>

           <div className="overflow-x-auto -mx-8">
              <table className="w-full border-collapse table-fixed">
                 <thead>
                    <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30">
                       {[
                          { k: getLabelKey(), l: getLabelTitle(), w: '30%' },
                          { k: 'users', l: 'Users', w: '12%' },
                          { k: 'sessions', l: 'Sessions', w: '12%' },
                          { k: 'pdf', l: 'PDF Downloaded', w: '15%' },
                          { k: 'html', l: 'HTML Saved', w: '15%' },
                          { k: 'total', l: 'Total', w: '16%', align: 'right' }
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
                        const rawLabel = row[getLabelKey()]
                        let label = rawLabel
                        
                        if (activeView === 'daily' && typeof rawLabel === 'string' && rawLabel.includes('-')) {
                           const dateObj = new Date(rawLabel)
                           label = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                        }

                        const total = (row.pdf || 0) + (row.html || 0)
                        return (
                           <tr key={(typeof label === 'string' ? label : i) + i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 {activeView === 'category' ? (
                                    <div className="flex items-center gap-3 overflow-hidden">
                                       <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{label}</span>
                                    </div>
                                 ) : (
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{label}</span>
                                 )}
                              </td>
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <UsersIcon className="w-3.5 h-3.5 text-slate-400/60 shrink-0" /> {(row.users || 0).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <Activity className="w-3.5 h-3.5 text-slate-400/60 shrink-0" /> {(row.sessions || 0).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                    <FileText className="w-3.5 h-3.5 text-blue-500/60 shrink-0" /> {(row.pdf || 0).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                    <Globe className="w-3.5 h-3.5 text-red-500/60 shrink-0" /> {(row.html || 0).toLocaleString()}
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right pr-12 truncate whitespace-nowrap">
                                 <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/30">
                                    {total.toLocaleString()}
                                 </span>
                              </td>
                           </tr>
                        )
                     })}
                 </tbody>
              </table>
           </div>

           <div className="mt-8 flex justify-between items-center px-4">
              <p className="text-xs font-medium text-[#adadad]">
                 Showing <span className={`font-medium ${searchQuery ? 'text-orange-500' : 'text-slate-600 dark:text-slate-300'}`}>1-{displayData.length}</span> of <span className="font-medium">{filteredData.length}</span> entries
              </p>
              <div className="flex items-center gap-1">
                 <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 cursor-not-allowed">
                    <ChevronDown className="w-5 h-5 rotate-90" />
                 </button>
                 <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0288f4] text-white font-medium text-sm shadow-lg shadow-blue-500/20">
                    1
                 </button>
                 <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    2
                 </button>
                 <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
