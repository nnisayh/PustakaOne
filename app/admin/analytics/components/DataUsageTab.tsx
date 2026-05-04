"use client"

import React, { useState, useMemo } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, Brush, LineChart, Line
} from "recharts"
import { 
  Filter, Calendar, Users, MousePointer, FileText,
  Clock, BarChart3, Search, Activity, ChevronDown
} from "lucide-react"
import { 
  dataUsageFacultyData, dataUsageResourceData, 
  dailyDownloadData, monthlyDownloadData,
  userCategoryDownloadData
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface DataUsageTabProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

type ViewType = 'category' | 'resource' | 'daily' | 'monthly'

export default function DataUsageTab({ isDark, chartTextColor, gridColor }: DataUsageTabProps) {
  const { notify } = useNotifications()
  const [activeView, setActiveView] = useState<ViewType>('category')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState('10')
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  const tabs = [
    { id: 'category', label: 'User Categorywise' },
    { id: 'resource', label: 'Resourcewise' },
    { id: 'daily', label: 'Daily' },
    { id: 'monthly', label: 'Monthly' }
  ]

  // Data Logic
  const rawData = useMemo(() => {
    switch (activeView) {
      case 'category': return userCategoryDownloadData.map(d => ({ ...d, label: d.category, usage: (d.pdf + d.html) * 0.05 }))
      case 'resource': return dataUsageResourceData.map(d => ({ ...d, label: d.name, usage: d.value / 10, users: Math.floor(d.value / 2), sessions: d.value }))

      case 'daily': return dailyDownloadData.map(d => ({ ...d, label: d.date, usage: (d.pdf + d.html) * 0.08 }))
      case 'monthly': return monthlyDownloadData.map(d => ({ ...d, label: d.month, usage: (d.pdf + d.html) * 0.08 }))
      default: return []
    }
  }, [activeView])

  const filteredData = useMemo(() => {
    let result = [...rawData]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item: any) => 
        item.label.toLowerCase().includes(q)
      )
    }
    if (sortConfig?.key) {
      result.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key] || 0
        const bVal = b[sortConfig.key] || 0
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [rawData, searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entries === 'All') return filteredData
    return filteredData.slice(0, parseInt(entries))
  }, [filteredData, entries])

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
    notify("export", `Exporting Data Usage Report`, `Your ${type} file is being prepared.`)
  }

  const getLabelTitle = () => {
    if (activeView === 'category') return 'User Category'
    if (activeView === 'resource') return 'Resource'
    if (activeView === 'daily') return 'Date'
    if (activeView === 'monthly') return 'Month'
    return 'Item'
  }

  // Custom Tooltip Matching other modules
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl animate-in fade-in zoom-in-95 duration-200 z-[100]">
          <p className="text-[11px] font-medium text-slate-400 tracking-widest mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">{label}</p>
          <div className="space-y-2.5">
            {payload.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#0288f4' }} />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{p.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-900 dark:text-white">{p.value.toLocaleString()} GB</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Tabs and Export - MATCHING ERESOURCE STYLE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <AnimatedTabs 
          tabs={tabs}
          activeId={activeView}
          onChange={(id) => { setActiveView(id as ViewType); }}
          containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-800/50"
          activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all whitespace-nowrap min-w-[160px]"
        />
        <div className="flex items-center gap-2">
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden relative">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div>
               <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
                  {activeView === 'resource' && 'Resource-wise Data Distribution'}
                  {activeView === 'category' && 'Usage Patterns by User Type'}
                  {activeView === 'daily' && 'Daily Traffic Insights'}
                  {activeView === 'monthly' && 'Monthly Usage Performance'}
               </h3>
               <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">
                  Monitoring overall data consumption across all library platforms
               </p>
            </div>
         </div>

         <div className="h-[400px] w-full" key={activeView}>
            <ResponsiveContainer width="100%" height="100%">
               {activeView === 'daily' || activeView === 'monthly' ? (
                 <LineChart data={rawData} margin={{ top: 0, right: 20, left: -20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }} interval={activeView === 'daily' ? 4 : 0} height={25} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="usage" name="Usage" stroke="#0288f4" strokeWidth={4} dot={false} animationDuration={1500} />
                    <Brush dataKey="label" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} travellerWidth={10} />
                 </LineChart>
               ) : (
                 <BarChart data={rawData.slice(0, 10)} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0288f4" /><stop offset="100%" stopColor="#2ac8f9" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="usage" name="Usage" fill="url(#usageGradient)" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1500} />
                    <Brush dataKey="label" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} travellerWidth={10} dy={10} />
                 </BarChart>
               )}
            </ResponsiveContainer>
         </div>
      </div>

      {/* Table Section - MATCHING ERESOURCE STYLE */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
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
               <span className="text-[11px] font-medium text-slate-400 tracking-widest ml-2">SHOW:</span>
               <WidgetDropdown value={entries} options={["10", "25", "50", "All"]} onChange={setEntries} />
            </div>
         </div>

         <div className="overflow-x-auto -mx-8">
            <table className="w-full border-collapse table-fixed">
               <thead>
                   <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30">
                      {[
                        { k: 'label', l: getLabelTitle(), w: '40%' },
                        { k: 'users', l: 'USERS', w: '20%' },
                        { k: 'sessions', l: 'SESSIONS', w: '20%' },
                        { k: 'usage', l: 'TOTAL DATA USAGE', w: '20%', align: 'right' }
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
                     return (
                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                           <td className="px-8 py-5 truncate">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate whitespace-nowrap">{row.label}</span>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                 <Users className="w-3.5 h-3.5 text-slate-400/60" /> {(row.users || 0).toLocaleString()}
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                 <Activity className="w-3.5 h-3.5 text-slate-400/60" /> {(row.sessions || 0).toLocaleString()}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right pr-12">
                              <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/30">
                                 {(row.usage || 0).toFixed(1)} GB
                              </span>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>

         {/* Pagination - Matching eResource */}
         <div className="mt-8 flex justify-between items-center px-4">
            <p className="text-xs font-medium text-[#adadad]">
               Showing <span className="font-medium text-slate-600 dark:text-slate-300">1-{displayData.length}</span> of <span className="font-medium">{filteredData.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
               <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 cursor-not-allowed">
                  <ChevronDown className="w-5 h-5 rotate-90" />
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0288f4] text-white font-medium text-sm shadow-lg shadow-blue-500/20">
                  1
               </button>
               <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <ChevronDown className="w-5 h-5 -rotate-90" />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
