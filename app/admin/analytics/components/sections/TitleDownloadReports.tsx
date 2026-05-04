"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Brush, Legend, Cell
} from "recharts"
import { 
  FileSpreadsheet, File as FileIcon, Users as UsersIcon, Activity,
  Search, ChevronDown, FileText, Globe
} from "lucide-react"
import { 
  userCategoryDownloadData,
  resourceWiseDownloadData,
  dailyDownloadData,
  monthlyDownloadData,
  publisherWiseDownloadData,
  topTitlesDownloadData
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface TitleDownloadReportsProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

const FACULTY_BADGES: Record<string, string> = {
  'FIF': 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  'FEB': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  'FTE': 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  'FRI': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  'FKS': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  'FIK': 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
  'FKB': 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
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

export default function TitleDownloadReports({ isDark, chartTextColor, gridColor }: TitleDownloadReportsProps) {
  const [activeView, setActiveView] = useState('category') // category, publisher, resource, daily, monthly
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' })
  const [entriesPerPage, setEntriesPerPage] = useState('10')
  const [pdfVisible, setPdfVisible] = useState(true)
  const [htmlVisible, setHtmlVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { notify } = useNotifications()

  // Handle loading state simulation
  const handleViewChange = (id: string) => {
    setIsLoading(true)
    setActiveView(id)
    setTimeout(() => setIsLoading(false), 300)
  }

  const rawData = useMemo(() => {
    switch (activeView) {
      case 'category': return userCategoryDownloadData
      case 'publisher': return publisherWiseDownloadData
      case 'resource': return topTitlesDownloadData
      case 'daily': return dailyDownloadData
      case 'monthly': return monthlyDownloadData
      default: return userCategoryDownloadData
    }
  }, [activeView])

  const getLabelKey = () => {
    if (activeView === 'category') return 'category'
    if (activeView === 'publisher') return 'publisher'
    if (activeView === 'resource') return 'title'
    if (activeView === 'daily') return 'date'
    return 'month'
  }

  const filteredData = useMemo(() => {
    let data = [...rawData].map(item => ({
      ...item,
      total: (item.pdf || 0) + (item.html || 0)
    }))

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(item => 
        (item[getLabelKey()] as string).toLowerCase().includes(q)
      )
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a]
        const bVal = b[sortConfig.key as keyof typeof b]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return data
  }, [rawData, searchQuery, sortConfig, activeView])

  const displayData = useMemo(() => {
    if (entriesPerPage === 'All') return filteredData
    return filteredData.slice(0, parseInt(entriesPerPage))
  }, [filteredData, entriesPerPage])

  const handleSort = (key: string) => {
    setSortConfig((prev: any) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        return null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleExport = (type: string) => {
    notify("export", `Exporting Title Level ${activeView} Report`, `Your ${type} file is being prepared and will be available in the notification center shortly.`)
  }

  // Custom Tick Formatter for Charts
  const formatXAxis = (tickItem: any) => {
    if (activeView === 'monthly' && typeof tickItem === 'string') {
      return tickItem
    }
    if (activeView === 'resource' && typeof tickItem === 'string') {
       if (tickItem.length > 20) {
          return tickItem.substring(0, 17) + '...'
       }
    }
    return tickItem
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pdf = payload.find((p: any) => p.dataKey === 'pdf')?.value || 0
      const html = payload.find((p: any) => p.dataKey === 'html')?.value || 0
      const total = pdf + html
      const pdfPct = total > 0 ? ((pdf / total) * 100).toFixed(1) : 0
      
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl animate-in fade-in zoom-in-95 duration-200 z-[100]">
          <p className="text-[11px] font-medium text-slate-400 tracking-widest mb-3 border-b border-slate-50 dark:border-slate-800 pb-2 max-w-[250px]">
            {activeView === 'monthly' ? (FULL_MONTHS[label.split(' ')[0]] || label) : label}
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0288f4]" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">PDF Downloaded</span>
              </div>
              <span className="text-xs font-medium text-slate-900 dark:text-white">{pdf.toLocaleString()} ({pdfPct}%)</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">HTML Saved</span>
              </div>
              <span className="text-xs font-medium text-slate-900 dark:text-white">{html.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 tracking-tighter">Total Hits</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{total.toLocaleString()}</span>
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
              { id: 'publisher', label: 'Publisherwise' },
              { id: 'resource', label: 'Resourcewise' },
              { id: 'daily', label: 'Daily' },
              { id: 'monthly', label: 'Monthly' }
            ]}
            activeId={activeView}
            onChange={(id) => { setActiveView(id); }}
            containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-800/50"
            activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all flex items-center justify-center whitespace-nowrap min-w-[140px]"
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
                    {activeView === 'category' && 'Title Downloads by User Type'}
                    {activeView === 'publisher' && 'Publisher-wise Download Trends'}
                    {activeView === 'resource' && 'Top Downloaded Titles Distribution'}
                    {activeView === 'daily' && 'Daily Acquisition Trends'}
                    {activeView === 'monthly' && 'Monthly Growth Performance'}
                 </h3>
                 <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">
                    Title level library usage metrics
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
                        tick={{ fill: chartTextColor, fontSize: activeView === 'resource' ? 9 : 11, fontWeight: 500 }} 
                        tickFormatter={formatXAxis}
                        angle={activeView === 'resource' ? -25 : 0}
                        textAnchor={activeView === 'resource' ? 'end' : 'middle'}
                        height={activeView === 'resource' ? 80 : 30}
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
                          barSize={activeView === 'resource' ? 20 : 35} 
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
                          barSize={activeView === 'resource' ? 20 : 35} 
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
                         tickFormatter={formatXAxis}
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
                      placeholder={`Search ${activeView === 'resource' ? 'titles' : activeView === 'publisher' ? 'publishers' : 'categories'}...`}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium outline-none focus:border-blue-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    value={entriesPerPage} 
                    options={["10", "25", "50", "All"]} 
                    onChange={setEntriesPerPage} 
                 />
              </div>
           </div>

           <div className="overflow-x-auto -mx-8">
              <table className="w-full border-collapse table-fixed">
                 <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                        {[
                          { k: getLabelKey(), l: (activeView === 'category' ? 'User Category' : activeView === 'publisher' ? 'Publisher' : activeView === 'resource' ? 'Title' : 'Period'), w: '30%' },
                          { k: 'users', l: 'Users', w: '12%' },
                          { k: 'sessions', l: 'Sessions', w: '12%' },
                          { k: 'pdf', l: 'PDF Downloaded', w: '15%' },
                          { k: 'html', l: 'HTML Saved', w: '15%' },
                          { k: 'total', l: 'Total', w: '16%', align: 'right' }
                        ].map(h => (
                          <th 
                            key={h.k} 
                            className={`${h.w} px-8 py-5 transition-colors cursor-pointer text-[11px] font-medium tracking-widest ${sortConfig?.key === h.k ? 'text-[#0288f4]' : 'text-slate-400 hover:text-slate-600'} ${h.align === 'right' ? 'text-right pr-12' : 'text-left'}`}
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
                     {displayData.map((row, idx) => {
                        const rawLabel = row[getLabelKey() as keyof typeof row] as string
                        let label = rawLabel
                        
                        if (activeView === 'daily' && typeof rawLabel === 'string' && rawLabel.includes('-')) {
                           const dateObj = new Date(rawLabel)
                           label = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                        }
                        
                        const total = (row.pdf || 0) + (row.html || 0)
                        const facultyMatch = typeof label === 'string' ? label.match(/\(([^)]+)\)/) : null
                        const faculty = facultyMatch ? facultyMatch[1] : null
                        const publisher = (row as any).publisher
                        
                        return (
                           <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                              <td className="px-8 py-5 truncate whitespace-nowrap">
                                 {faculty ? (
                                    <div className="flex items-center gap-3 overflow-hidden">
                                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{label.split(' (')[0]}</span>
                                       <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${FACULTY_BADGES[faculty] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                          {faculty}
                                       </span>
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-3 overflow-hidden">
                                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{label}</span>
                                       {activeView === 'resource' && publisher && (
                                          <span className="shrink-0 px-2 py-1 rounded-lg text-[9px] font-medium tracking-tight bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                             {publisher.length > 25 ? publisher.substring(0, 22) + '...' : publisher}
                                          </span>
                                       )}
                                    </div>
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

           {/* Footer Pagination */}
           <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
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
