"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useTheme } from "next-themes"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import { Users, BookMarked, Database, ShieldCheck, Clock, Loader2, CheckCircle2, AlertCircle, AlertTriangle, Download, X } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import StatCard from "@/app/admin/components/admin/StatCard"
import DashboardFilters from "@/app/admin/components/admin/DashboardFilters"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import {
  trafficData, topJournalsData, userTypesData, recentActivityData
} from "@/app/admin/lib/mock-data"

const DONUT_COLORS = ['#0288f4', '#2ac8f9', '#7fc9fb', '#e0f2fe']

// ─── Custom Tooltips & Geometry ──────────────────────────────────────────────
// (No Live Dot)

const CustomTooltipTraffic = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#111827] p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 min-w-[150px]">
        <p className="font-semibold text-slate-800 dark:text-white text-[13px] mb-3">{label}</p>
        {[...payload].reverse().map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[12px] text-slate-600 dark:text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-[12px] font-semibold text-slate-800 dark:text-white ml-auto">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomTooltipDB = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#111827] p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800">
        <p className="font-semibold text-slate-800 dark:text-white text-[13px] mb-1">{payload[0].payload.name}</p>
        <p className="text-[12px] text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-[#2d78f2]">{payload[0].value.toLocaleString()}</span> {payload[0].payload.unit || "accesses"}
        </p>
      </div>
    )
  }
  return null
}

const CustomTooltipDonut = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#111827] p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
        <p className="font-medium text-slate-800 dark:text-white text-[13px]">
          {payload[0].name}: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { t, lang } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { notify, activeStrips, dismissActive } = useNotifications()

  // Global Dashboard Filter States
  const [dateMode, setDateMode] = useState<'single' | 'range'>('range')
  const [singleDate, setSingleDate] = useState<Date | null>(new Date())
  const today = new Date()
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: new Date(today.getFullYear(), today.getMonth() + 1, 0)
  })
  const [granularity, setGranularity] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly')
  const [isRefetching, setIsRefetching] = useState(false)

  // Widget-Specific Filter & Loading States
  const [trafficFilter, setTrafficFilter] = useState('Last 7 Days')
  const [loadingTraffic, setLoadingTraffic] = useState(false)

  const [dbFilter, setDbFilter] = useState('This Month')
  const [loadingDB, setLoadingDB] = useState(false)

  const [userDistFilter, setUserDistFilter] = useState('13 April 2026')
  const [loadingUserDist, setLoadingUserDist] = useState(false)

  const chartTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const gridColor = isDark ? '#374151' : '#E2E8F0'
  const donutStrokeColor = isDark ? '#111827' : '#ffffff'

  // Handlers
  const handleFilterChange = () => {
    setIsRefetching(true)
    notify('loading', t.updatingDashboard || 'Updating dashboard...', t.fetchingLatestData || 'Fetching latest data based on your filters')
    setTimeout(() => {
      setIsRefetching(false)
      notify('success', t.dataLoaded || 'Data loaded', t.dashboardMetricsUpdated || 'Dashboard metrics have been successfully updated')
    }, 1500)
  }

  const handleExport = (format: string) => {
    const locale = lang === 'id' ? 'id-ID' : 'en-US'
    const dateStr = dateMode === 'single'
      ? singleDate?.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
      : `${dateRange.start?.toLocaleDateString(locale)} - ${dateRange.end?.toLocaleDateString(locale)}`

    notify('export', t.exportingX.replace("{format}", format), t.generatingFileForX.replace("{date}", dateStr).replace("{resolution}", granularity))
  }

  const handleTrafficChange = (val: string) => {
    setTrafficFilter(val); setLoadingTraffic(true)
    setTimeout(() => setLoadingTraffic(false), 800)
  }
  const handleDbChange = (val: string) => {
    setDbFilter(val); setLoadingDB(true)
    setTimeout(() => setLoadingDB(false), 800)
  }
  const handleUserDistChange = (val: string) => {
    setUserDistFilter(val); setLoadingUserDist(true)
    setTimeout(() => setLoadingUserDist(false), 800)
  }

  return (
    <>
      {/* ── Header Filters ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-3 duration-500 overflow-visible relative z-40">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-white tracking-tight">
            {t.dashboard}
          </h1>
          <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">
            {t.overviewDesc}
          </p>
        </div>

        <DashboardFilters
          dateMode={dateMode} setDateMode={setDateMode}
          singleDate={singleDate} setSingleDate={setSingleDate}
          dateRange={dateRange} setDateRange={setDateRange}
          granularity={granularity} setGranularity={setGranularity}
          onExport={handleExport}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* ── Notification Strips ── */}
      {activeStrips.length > 0 && (
        <div className="flex flex-col mb-6 relative z-30">
          {activeStrips.map(notif => {
            let colors = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            let Icon = Loader2

            if (notif.type === 'success') {
              colors = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              Icon = CheckCircle2
            } else if (notif.type === 'error') {
              colors = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
              Icon = AlertCircle
            } else if (notif.type === 'warning') {
              colors = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
              Icon = AlertTriangle
            } else if (notif.type === 'export') {
              colors = "bg-blue-50 text-[#2d78f2] border-blue-100 dark:bg-[#2d78f2]/10 dark:text-[#2ba9f5] dark:border-[#2d78f2]/20"
              Icon = Download
            }

            return (
              <div
                key={notif.id}
                className={`
                  flex items-center gap-3 px-3.5 rounded-2xl border ${colors} shadow-sm
                  transition-all duration-500 ease-in-out overflow-hidden transform-gpu
                  ${notif.isClosing ? "max-h-0 opacity-0 mb-0 py-0 border-transparent scale-[0.98] origin-top" : "max-h-24 opacity-100 mb-3 py-3.5"}
                `}
              >
                <div className="shrink-0 bg-white/50 dark:bg-black/20 p-1.5 rounded-lg">
                  <Icon className={`w-4 h-4 ${notif.type === 'loading' ? 'animate-spin' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold">{notif.title}</p>
                  {notif.desc && <p className="text-[12px] opacity-80 mt-0.5">{notif.desc}</p>}
                </div>
                <button onClick={() => dismissActive(notif.id)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Global Content Wrapper ── */}
      <div className={`space-y-6 transition-all duration-500 relative z-10 ${isRefetching ? 'opacity-50 blur-[2px] pointer-events-none scale-[0.99]' : 'opacity-100 blur-0 scale-100'}`} style={{ isolation: 'isolate' }}>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t.totalUsers} value="12,450" trend="+12.5%" icon={Users} index={0} />
          <StatCard title={t.totalAccess} value="84,210" trend="+24.1%" icon={BookMarked} index={1} />
          <StatCard title={t.activeDB} value="15" trend="+0.0%" trendUp={null} icon={Database} index={2} />
          <StatCard title={t.systemUptime} value="99.9%" trend="+0.1%" icon={ShieldCheck} index={3} />
        </div>

        {/* ── Main Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Visitor Traffic Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl flex flex-col relative">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4 relative z-40">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-medium text-slate-800 dark:text-white">{t.trafficTitle}</h3>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 shadow-sm shadow-rose-500/5">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 tracking-widest">Live</span>
                </div>
              </div>
              <WidgetDropdown options={[t.last7Days, t.thisWeek, t.thisMonth, t.lastMonth, t.thisYear]} value={trafficFilter} onChange={handleTrafficChange} />
            </div>

            <div className={`h-[300px] w-full transition-all duration-300 relative z-10 ${loadingTraffic ? 'opacity-50 blur-[2px]' : 'opacity-100 blur-0'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d78f2" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#2d78f2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ac9fa" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2ac9fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltipTraffic />} cursor={{ stroke: isDark ? '#1F2937' : '#F3F4F6', strokeWidth: 2 }} />

                  <Area type="monotone" dataKey="pageviews" name={t.pageviews || "Pageviews"} stroke="#2ac9fa" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPageviews)" dot={false} activeDot={false} />
                  <Area type="monotone" dataKey="visitors" name={t.visitors || "Visitors"} stroke="#2d78f2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" dot={false} activeDot={false} />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Databases Widget */}
          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl flex flex-col relative z-20">
            <div className="flex justify-between items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t.topDBTitle}</h3>
              <WidgetDropdown options={[t.last7Days, t.thisWeek, t.thisMonth, t.lastMonth, t.thisYear]} value={dbFilter} onChange={handleDbChange} />
            </div>

            <div className={`flex-1 min-h-[300px] transition-all duration-300 ${loadingDB ? 'opacity-50 blur-[2px]' : 'opacity-100 blur-0'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topJournalsData} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2d78f2" />
                      <stop offset="100%" stopColor="#2ac9fa" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={1} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} width={120} />
                  <Tooltip content={<CustomTooltipDB />} cursor={{ fill: 'transparent' }} />

                  {/* Custom Track Background strictly rounded at all corners */}
                  <Bar dataKey="accesses" fill="url(#colorBar)" radius={[4, 4, 4, 4]} barSize={24} background={{ fill: isDark ? '#1F2937' : '#F1F5F9', radius: [4, 4, 4, 4] }} />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Bottom Widget Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">

          {/* User Distribution Widget (Donut) */}
          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t.userDistTitle}</h3>
              <WidgetDropdown options={['13 April 2026', '12 April 2026', 'This Week']} value={userDistFilter} onChange={handleUserDistChange} icon="calendar" />
            </div>

            <div className={`flex-1 min-h-[250px] w-full flex items-center relative transition-all duration-300 ${loadingUserDist ? 'opacity-50 blur-[2px]' : 'opacity-100 blur-0'}`}>

              {/* Box Kiri: Donut Chart & Absolute Text */}
              <div className="relative w-[55%] sm:w-[60%] h-full flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userTypesData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" stroke={donutStrokeColor} strokeWidth={2}>
                      {userTypesData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipDonut />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mt-0.5">
                  <span className="text-[26px] font-semibold text-slate-800 dark:text-white leading-none mb-1">250</span>
                  <span className="text-[11px] font-medium text-slate-400 leading-none">{t.totalUsers}</span>
                </div>
              </div>

              {/* Box Kanan: Custom HTML Legend */}
              <div className="flex-1 flex flex-col justify-center gap-3 pl-2 sm:pl-4">
                {userTypesData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                    <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Widget */}
          <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t.recentActivity}</h3>
              <button className="text-xs font-semibold text-slate-600 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-xl px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                {t.viewAll} &rarr;
              </button>
            </div>

            <div className="space-y-1 overflow-y-auto pr-2">
              {recentActivityData.map(item => {
                // Strict Mapping Rule against internal legacy blue bits:
                // Hijau: Accessed, Downloaded, Logged in
                // Merah: Failed login, Error
                // Oranye: Searched, Warning
                let dotColor = "bg-emerald-500" // Green
                let textColor = "text-emerald-500"
                if (item.type === 'failed' || item.type === 'error') {
                  dotColor = "bg-rose-500"
                  textColor = "text-rose-500"
                } else if (item.type === 'search' || item.type === 'warning') {
                  dotColor = "bg-orange-500"
                  textColor = "text-orange-500"
                }

                return (
                  <div key={item.id} className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    {/* The activity item inner border is allowed by spec rule "boleh pakai border tipis", though design might not strictly need it, keeping it clean with hover */}
                    <div className={`mt-[7px] w-2 h-2 rounded-full shrink-0 shadow-sm ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                        <span className="font-semibold text-slate-800 dark:text-white pr-1.5">{item.user}</span>
                        <span className="text-slate-300 dark:text-slate-600 pr-1.5">—</span>
                        <span className={`${textColor} font-medium`}>
                          {item.action}
                        </span>
                      </p>
                      <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {item.time} &middot; {item.ip}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
