"use client"
import React, { useState, useMemo } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  LineChart, Line
} from "recharts"
import { 
  MoreVertical, RefreshCw, Maximize2, Table as TableIcon, Download, 
  ChevronDown, FileText, Globe, Filter, Search, X
} from "lucide-react"
import { 
  downloadReportData, 
  userCategoryDownloadData,
  resourceDownloadData,
  dailyDownloadData,
  monthlyDownloadData,
  FACULTY_COLORS 
} from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import MultiSelectFilter from "@/app/admin/components/shared/MultiSelectFilter"
import FilterChips from "@/app/admin/components/shared/FilterChips"

interface DownloadsTabProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

export default function DownloadsTab({ isDark, chartTextColor, gridColor }: DownloadsTabProps) {
  const [subTab, setSubTab] = useState("category")
  const [period, setPeriod] = useState("This Month")
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [isTableExpanded, setIsTableExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 1. Data Processing Logic
  const rawData = useMemo(() => {
    switch (subTab) {
      case "category": return userCategoryDownloadData
      case "resource": return resourceDownloadData
      case "daily": return dailyDownloadData
      case "monthly": return monthlyDownloadData
      default: return downloadReportData
    }
  }, [subTab])

  const filteredData = useMemo(() => {
    let data = [...rawData]
    // Search filter for Table
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(d => {
        const val = (d as any).faculty || (d as any).category || (d as any).resource || (d as any).date || (d as any).month || ""
        return val.toLowerCase().includes(q)
      })
    }
    return data
  }, [rawData, selectedFaculties, searchQuery])

  // 2. Interaction Handlers
  const toggleSeries = (dataKey: string) => {
    setHiddenSeries(prev => {
      const next = new Set(prev)
      if (next.has(dataKey)) next.delete(dataKey)
      else next.add(dataKey)
      return next
    })
  }

  const getLabelKey = () => {
    if (subTab === "category") return "category"
    if (subTab === "resource") return "resource"
    if (subTab === "daily") return "date"
    if (subTab === "monthly") return "month"
    return "faculty"
  }

  // 3. Custom Components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white dark:bg-[#1a2234] p-5 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-sm font-medium text-slate-800 dark:text-white mb-4 border-b border-slate-50 dark:border-slate-800/50 pb-2">{label}</p>
          <div className="space-y-3">
             {payload.map((entry: any) => (
               <div key={entry.name} className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                     <span className="text-xs font-medium text-slate-500">{entry.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{entry.value.toLocaleString()}</span>
               </div>
             ))}
             <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-400">TOTAL</span>
                <span className="text-sm font-medium text-blue-500">{total.toLocaleString()}</span>
             </div>
          </div>
        </div>
      )
    }
    return null
  }



  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-6">
        {/* Filters Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500" />
                <input 
                   type="text" 
                   placeholder="Quick lookup..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium w-48 focus:w-64 focus:border-blue-500 outline-none transition-all"
                />
             </div>
             <WidgetDropdown 
               value={period} 
               options={["Today", "This Week", "This Month", "Last Month", "Custom Range"]} 
               onChange={setPeriod} 
             />
          </div>
        </div>

        {/* Tertiary Tab Selector (Pill Style) */}
        <div className="mb-10">
           <AnimatedTabs 
             tabs={[
               { id: 'category', label: 'By User Category' },
               { id: 'resource', label: 'By Resource' },
               { id: 'daily', label: 'Daily' },
               { id: 'monthly', label: 'Monthly' }
             ]}
             activeId={subTab}
             onChange={(id) => { setSubTab(id); setSearchQuery("") }}
             containerClassName="bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800 max-w-fit"
           />
        </div>

        {/* Dynamic Chart Section */}
        <div className="h-[450px] w-full mb-12">
          {/* Custom Interactive Legend */}
          <div className="flex justify-end gap-8 mb-8 px-4 flex-wrap">
             <button 
               onClick={() => toggleSeries("pdf")}
               className={`flex items-center gap-3 transition-opacity ${hiddenSeries.has("pdf") ? "opacity-30" : "opacity-100"}`}
             >
                <div className="w-3.5 h-3.5 rounded-full bg-[#0288f4] shadow-[0_0_10px_rgba(2,136,244,0.3)]" />
                <span className="text-[12px] font-medium text-slate-500 tracking-wider">PDF Downloaded</span>
             </button>
             <button 
               onClick={() => toggleSeries("html")}
               className={`flex items-center gap-3 transition-opacity ${hiddenSeries.has("html") ? "opacity-30" : "opacity-100"}`}
             >
                <div className="w-3.5 h-3.5 rounded-full bg-[#2ac8f9] shadow-[0_0_10px_rgba(42,200,249,0.3)]" />
                <span className="text-[12px] font-medium text-slate-500 tracking-wider">HTML Saved</span>
             </button>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            {subTab === "daily" || subTab === "monthly" ? (
              <LineChart data={filteredData} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                <XAxis 
                  dataKey={getLabelKey()} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }}
                  interval={subTab === 'daily' ? 4 : 0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0288f4', strokeWidth: 2, strokeDasharray: '5 5' }} />
                {!hiddenSeries.has("pdf") && <Line type="monotone" dataKey="pdf" stroke="#0288f4" strokeWidth={4} dot={{ r: 4, fill: '#0288f4', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={1500} />}
                {!hiddenSeries.has("html") && <Line type="monotone" dataKey="html" stroke="#2ac8f9" strokeWidth={4} dot={{ r: 4, fill: '#2ac8f9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={1500} />}
              </LineChart>
            ) : (
              <BarChart data={filteredData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout={subTab === 'category' ? 'vertical' : 'horizontal'}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                {subTab === 'category' ? (
                  <>
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} width={120} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey={getLabelKey()} axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} />
                  </>
                )}
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                />
                {!hiddenSeries.has("pdf") && (
                  <Bar 
                    dataKey="pdf" 
                    stackId="a" 
                    fill="#0288f4" 
                    radius={subTab === 'category' ? [0, 0, 0, 0] : [0, 0, 0, 0]} 
                    barSize={subTab === 'category' ? 30 : 40} 
                  />
                )}
                {!hiddenSeries.has("html") && (
                  <Bar 
                    dataKey="html" 
                    stackId="a" 
                    fill="#2ac8f9" 
                    radius={subTab === 'category' ? [0, 6, 6, 0] : [6, 6, 0, 0]} 
                    barSize={subTab === 'category' ? 30 : 40} 
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Collapsible Detailed Table */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-10">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h4 className="font-medium text-slate-800 dark:text-white text-xl tracking-tight flex items-center gap-3">
                   Detailed Breakdown
                   <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-[#0288f4] px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">LIVE DATA</span>
                </h4>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 transition-all border border-slate-200 dark:border-slate-800"
                >
                   {isTableExpanded ? "Collapse Table" : "View All Data"}
                   <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isTableExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className="relative">
                   <button onClick={() => setShowOptions(showOptions === 'table' ? null : 'table')} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                     <MoreVertical className="w-5 h-5 text-slate-400" />
                   </button>
                   {showOptions === 'table' && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a2234] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 p-2 animate-in fade-in zoom-in-95 scale-100 duration-200">
                       <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
                         <RefreshCw className="w-4 h-4 text-blue-500" /> Force Refresh
                       </button>
                       <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
                         <Maximize2 className="w-4 h-4 text-emerald-500" /> Fullscreen
                       </button>
                       <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />
                       <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
                         <Download className="w-4 h-4 text-orange-500" /> Export CSV
                       </button>
                     </div>
                   )}
                </div>
             </div>
          </div>

          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isTableExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-[400px] opacity-90 relative'}`}>
            {!isTableExpanded && (
               <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#111827] to-transparent z-10 pointer-events-none" />
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/50">
                    <th className="px-6 py-5 text-left">
                       <div className="flex items-center gap-2 whitespace-nowrap">{getLabelKey().replace('_', ' ').toUpperCase()}</div>
                    </th>
                    <th className="px-6 py-5 text-left">
                       <div className="flex items-center gap-2 whitespace-nowrap">USERS</div>
                    </th>
                    <th className="px-6 py-5 text-left">
                       <div className="flex items-center gap-2 whitespace-nowrap">SESSIONS</div>
                    </th>
                    <th className="px-6 py-5 text-left">
                       <div className="flex items-center gap-2 whitespace-nowrap">PDF ↓</div>
                    </th>
                    <th className="px-6 py-5 text-left">
                       <div className="flex items-center gap-2 whitespace-nowrap">HTML SAVED</div>
                    </th>
                    <th className="px-6 py-5 text-right pr-6">
                       <div className="flex items-center gap-2 justify-end whitespace-nowrap">GRAND TOTAL</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/10">
                  {filteredData.map((row: any, i) => {
                    const label = row[getLabelKey()]
                    return (
                      <tr key={label + i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors border-b border-slate-50/30 dark:border-slate-800/10">
                        <td className="px-6 py-5 truncate">
                          {subTab === 'faculty' ? (
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[11px] font-medium tracking-tight whitespace-nowrap ${FACULTY_COLORS[label] || 'bg-slate-100'}`}>{label}</span>
                          ) : (
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate whitespace-nowrap">{label}</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{(row.users || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-400">{(row.sessions || 0).toLocaleString()}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                             <FileText className="w-3.5 h-3.5 text-blue-500/60" /> {row.pdf.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                             <Globe className="w-3.5 h-3.5 text-cyan-500/60" /> {row.html.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right pr-6">
                          <span className="text-[15px] font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/30 shadow-sm shadow-black/5">
                            {(row.pdf + row.html).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
