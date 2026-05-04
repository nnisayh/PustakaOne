"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, Brush
} from "recharts"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { 
  BarChart3, Download, FileText, Search, User, MousePointer2, Activity,
  ChevronDown, ExternalLink, Globe, Clock, Mail, Users
} from "lucide-react"
import { 
  userWiseUsageData, 
  userWiseDownloadData, 
  userTitleDownloadData, 
  FACULTY_COLORS, 
  mockUsers 
} from "@/app/admin/lib/mock-data"
import UserDetailDrawer from "@/app/admin/components/shared/UserDetailDrawer"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface UserAnalyticsViewProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

type ViewType = 'data-usage' | 'eresource' | 'title-download'

export default function UserAnalyticsView({ isDark, chartTextColor, gridColor }: UserAnalyticsViewProps) {
  const { notify } = useNotifications()
  const [subTab, setSubTab] = useState<ViewType>("data-usage")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [entries, setEntries] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    setSearchQuery("")
    setCurrentPage(1)
  }, [subTab])

  const tabs = [
    { id: 'data-usage', label: 'Data Usage', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'eresource', label: 'eResource Download', icon: <Download className="w-4 h-4" /> },
    { id: 'title-download', label: 'Title Download', icon: <FileText className="w-4 h-4" /> },
  ]

  const tabConfigs: Record<ViewType, any> = {
    'data-usage': {
      title: 'Data Usage Analytics',
      subtitle: 'Tracks data usage in MB/GB routed through the PustakaONE Proxy.',
      chartTitle: 'Data Usage Reports',
      tableTitle: 'User wise usage [Data Usage Reports]',
      yAxisLabel: 'Data Usage in MB',
      data: userWiseUsageData.map(d => ({ 
        ...d, 
        label: d.name,
        value: parseFloat(d.dataUsage.replace(/[^0-9.]/g, '')),
        email: `${d.name.toLowerCase().replace(/ /g, '.')}@student.telkomuniversity.ac.id`,
        category: `"MAHASISWA S1 (Undergraduate)"`
      }))
    },
    'eresource': {
      title: 'eResource Download',
      subtitle: 'Tracks eResource downloads covering PDF downloads and saved HTML files.',
      chartTitle: 'eResource Download Reports',
      tableTitle: 'User wise [eResource Download Reports]',
      yAxisLabel: 'Downloads',
      data: userWiseDownloadData.map(d => {
        const user = mockUsers.find(u => u.nim === d.nim)
        return {
          ...d,
          label: d.name,
          email: `${d.name.toLowerCase().replace(/ /g, '.')}@student.telkomuniversity.ac.id`,
          category: `"MAHASISWA S1 (Undergraduate)"`
        }
      })
    },
    'title-download': {
      title: 'Title Download Analytics',
      subtitle: 'Tracks Title Level downloads covering PDF downloads and saved HTML files.',
      chartTitle: 'Title Level Download Reports',
      tableTitle: 'User wise [Title Level Download Reports]',
      yAxisLabel: 'Downloads',
      data: userTitleDownloadData.map(d => {
        const user = mockUsers.find(u => u.nim === d.nim)
        return {
          ...d,
          label: d.name,
          email: `${d.name.toLowerCase().replace(/ /g, '.')}@student.telkomuniversity.ac.id`,
          category: `"MAHASISWA S1 (Undergraduate)"`
        }
      })
    }
  }

  const [pdfVisible, setPdfVisible] = useState(true)
  const [htmlVisible, setHtmlVisible] = useState(true)

  const currentConfig = tabConfigs[subTab]

  const filteredData = useMemo(() => {
    let data = [...currentConfig.data]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.nim.includes(q) || 
        d.email.toLowerCase().includes(q)
      )
    }
    if (sortConfig?.key) {
      data.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key]
        const bVal = (b as any)[sortConfig.key]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
           return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
           return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return 0
      })
    }
    return data
  }, [currentConfig.data, searchQuery, sortConfig])

  const displayData = useMemo(() => {
    if (entries === "All") return filteredData
    const limit = parseInt(entries)
    const start = (currentPage - 1) * limit
    return filteredData.slice(start, start + limit)
  }, [filteredData, entries, currentPage])

  const chartData = useMemo(() => {
    return [...currentConfig.data]
      .sort((a, b) => {
        if (subTab === 'data-usage') return b.value - a.value
        return b.total - a.total
      })
      .slice(0, 20)
  }, [currentConfig.data, subTab])

  const handleUserClick = (nim: string, name: string) => {
    const detailedUser = mockUsers.find(u => u.nim === nim || u.nama === name)
    if (detailedUser) {
      setSelectedUser(detailedUser)
    }
  }

  const handleExport = (type: string) => {
    notify("export", `Exporting ${subTab} Report`, `Your ${type} file is being prepared.`)
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const email = payload[0].payload.email || ""
      return (
        <div className="bg-white dark:bg-[#1a2234] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 z-[100] shadow-xl">
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 lowercase tracking-tight mb-3 border-b border-slate-50 dark:border-slate-800/50 pb-2">
            {email}
          </p>
          <div className="space-y-2.5">
             {payload.map((entry: any) => {
                const dotColor = entry.name.toLowerCase().includes('pdf') || entry.name.toLowerCase().includes('data') 
                   ? '#0288f4' 
                   : '#ef4444'
                
                return (
                   <div key={entry.name} className="flex items-center justify-between gap-8">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                         <span className="text-[10px] font-medium text-slate-500 tracking-widest">{entry.name}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
                         {entry.value.toLocaleString()} {subTab === 'data-usage' ? 'MB' : ''}
                      </span>
                   </div>
                )
             })}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Sub-Tabs Nav */}
      <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
        <div className="flex gap-8 mb-8 overflow-x-auto scrollbar-hide relative z-10 border-b border-slate-100 dark:border-slate-800/50">
          {tabs.map((tab) => {
            const isActive = subTab === tab.id
            return (
              <button 
                key={tab.id}
                onClick={() => setSubTab(tab.id as ViewType)}
                className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group
                  ${isActive ? 'text-[#0288f4] font-medium' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                {React.cloneElement(tab.icon as React.ReactElement, { 
                  className: `w-5 h-5 transition-colors ${isActive ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}` 
                })}
                <span className="text-[16px]">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="font-medium text-slate-800 dark:text-white text-2xl tracking-tight">{currentConfig.title}</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium">{currentConfig.subtitle}</p>
          </div>
          <ExportDropdown onExport={handleExport} />
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 mb-8">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-lg font-medium text-slate-800 dark:text-white tracking-tight">{currentConfig.chartTitle}</h4>
            
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1">
              <button 
                onClick={() => setPdfVisible(!pdfVisible)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${pdfVisible ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-400 opacity-40 grayscale'}`}
              >
                <div className="w-2 h-2 rounded-full bg-[#0288f4]" />
                <span className="text-[10px] font-medium">{subTab === 'data-usage' ? 'Data' : 'PDF'}</span>
              </button>
              {subTab !== 'data-usage' && (
                <button 
                  onClick={() => setHtmlVisible(!htmlVisible)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${htmlVisible ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'text-slate-400 opacity-40 grayscale'}`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span className="text-[10px] font-medium">HTML</span>
                </button>
              )}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0288f4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2ac8f9" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
                
                {subTab === 'data-usage' ? (
                  pdfVisible && <Bar dataKey="value" name="Total Data Usage" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={30} />
                ) : (
                  <>
                    {pdfVisible && <Bar dataKey="pdfs" name="PDF Downloaded / Saved" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={25} />}
                    {htmlVisible && <Bar dataKey="htmls" name="HTML Saved" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />}
                  </>
                )}
                <Brush 
                  dataKey="name" 
                  height={30} 
                  stroke="#0288f480" 
                  fill={isDark ? "#0288f410" : "#eef7ff"} 
                  travellerWidth={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
            <div className="flex flex-wrap items-center gap-4 w-full justify-between">
              <div className="relative group w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search user..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-400 tracking-widest">Show:</span>
                <WidgetDropdown value={entries} options={["10", "20", "50", "All"]} onChange={setEntries} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-8">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30">
                  {[
                    { k: 'email', l: 'EMAIL ADDRESS/USERNAME', w: '35%' },
                    { k: 'category', l: 'USER CATEGORIES', w: '30%' },
                    { k: 'sessions', l: 'SESSIONS', w: '10%' },
                    ...(subTab === 'data-usage' 
                      ? [{ k: 'value', l: 'TOTAL DATA USAGE', w: '25%', align: 'right' }]
                      : [
                        { k: 'pdfs', l: 'PDF DOWNLOADED / SAVED', w: '15%' },
                        { k: 'htmls', l: 'HTML SAVED', w: '15%' },
                        { k: 'total', l: 'TOTAL', w: '10%', align: 'right' }
                      ]
                    )
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
                {displayData.map((user: any) => (
                  <tr 
                    key={user.nim} 
                    onClick={() => handleUserClick(user.nim, user.name)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-8 py-5">
                       <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-500 transition-colors truncate">{user.email}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-medium text-slate-500">{user.category}</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{user.sessions}</span>
                    </td>
                    
                    {subTab === 'data-usage' ? (
                      <td className="px-8 py-5 text-right pr-12">
                         <span className="inline-block text-[13px] font-medium text-[#1e293b] bg-slate-50/80 dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/30">
                            {user.dataUsage}
                         </span>
                      </td>
                    ) : (
                      <>
                        <td className="px-8 py-5 text-sm font-medium text-blue-500">{user.pdfs}</td>
                        <td className="px-8 py-5 text-sm font-medium text-red-500">{user.htmls}</td>
                        <td className="px-8 py-5 text-right pr-12">
                           <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/30">
                              {user.total}
                           </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-between items-center px-4">
             <p className="text-xs font-medium text-slate-400">
                Showing <span className="font-medium text-slate-700 dark:text-slate-300">1-{displayData.length}</span> of <span className="font-medium">{filteredData.length}</span> entries
             </p>
             <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                   <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                   <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserDetailDrawer 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  )
}
