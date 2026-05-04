"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import { useTheme } from "next-themes"
import { 
  ShieldCheck, ShieldX, AlertTriangle, Search, Clock, ChevronLeft, ChevronRight, 
  Download, X, Eye, File, FileText, FileSpreadsheet,
  CheckCircle2, AlertCircle, Ban, ArrowUpRight, Lock, MapPin, 
  Globe2, Smartphone, TerminalSquare, Filter, ShieldAlert, ChevronDown, Monitor, ChevronUp
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts"
import StatCard from "@/app/admin/components/admin/StatCard"
import UserDetailDrawer from "@/app/admin/components/shared/UserDetailDrawer"
import SecurityLogDetailDrawer from "@/app/admin/components/shared/SecurityLogDetailDrawer"
import Portal from "@/app/admin/components/shared/Portal"
import ConfirmDialog from "@/app/admin/components/shared/ConfirmDialog"
import { useSearchParams } from "next/navigation"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import StatusBadge from "@/app/admin/components/shared/StatusBadge"
import MultiSelectFilter from "@/app/admin/components/shared/MultiSelectFilter"
import FilterChips from "@/app/admin/components/shared/FilterChips"
import { 
  securityStats, anomalyAlerts, securityLogs, 
  securityTrendData, blockedIPsData, alertHistoryData 
} from "@/app/admin/lib/mock-data"


// ─── Main Page ───────────────────────────────────────────────────────────────
export default function SecurityPage() {
  const { t } = useLanguage()
  const { notify, activeStrips, dismissActive } = useNotifications()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  const chartTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const gridColor = isDark ? '#1F2937' : '#e2e8f0'

  // Global States
  const searchParams = useSearchParams()
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string[]>([])
  const [filterDate, setFilterDate] = useState("All Time")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  
  const [sortKey, setSortKey] = useState<keyof typeof securityLogs[0] | "">("")
  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("asc")

  // Mock State Pools
  type AlertItem = typeof anomalyAlerts[0] & { status?: string }
  const [alerts, setAlerts] = useState<AlertItem[]>(anomalyAlerts)
  const [blockedIps, setBlockedIps] = useState(blockedIPsData)
  const [historyLogs, setHistoryLogs] = useState(alertHistoryData)

  const [alertSeverityFilter, setAlertSeverityFilter] = useState("All")

  // Overlay States
  const [detailUser, setDetailUser] = useState<any>(null)
  const [logDetailDrawer, setLogDetailDrawer] = useState<any>(null)
  const [historyDrawer, setHistoryDrawer] = useState(false)
  const [unblockTarget, setUnblockTarget] = useState<string | null>(null)
  const [ipLookup, setIpLookup] = useState<string | null>(null)
  const [investigatingAlert, setInvestigatingAlert] = useState<any>(null)
  const [confirmationConfig, setConfirmationConfig] = useState<{ title: string; desc: string; type: 'block' | 'dismiss'; alert: any } | null>(null)

  // ─── Logic Map ───

  const filteredAlerts = alerts.filter(a => alertSeverityFilter === "All" || a.severity.toLowerCase() === alertSeverityFilter.toLowerCase())

  const handleExport = (fmt: string) => {
    notify("export", `Exporting Logs`, `${fmt} security log mapping is being processed.`)
  }

  const handleBlockIp = (ip: string, reason: string) => {
    setBlockedIps([{ ip, reason, time: "Just now" }, ...blockedIps])
    notify("error", "IP Blocked", `Successfully restricted access from ${ip}`)
  }

  const handleAlertBlock = (alert: any) => {
    handleBlockIp("103.22.x.x (Detected via Alert)", alert.title)
    const updated = alerts.filter(a => a.id !== alert.id)
    setAlerts(updated)
    setHistoryLogs([{ id: alert.id, severity: alert.severity, title: alert.title, description: alert.description, time: "Just now", status: "Blocked" }, ...historyLogs])
  }

  const handleAlertDismiss = (alert: any) => {
    const updated = alerts.filter(a => a.id !== alert.id)
    setAlerts(updated)
    setHistoryLogs([{ id: alert.id, severity: alert.severity, title: alert.title, description: alert.description, time: "Just now", status: "Dismissed" }, ...historyLogs])
    notify("success", "Alert Dismissed", `Alert ${alert.id} moved to history log.`)
  }

  const handleBlockFromDrawer = (alert: any) => {
    setConfirmationConfig({
      title: `${t.blockUser || "Block user"} ${alert.user}?`,
      desc: "User tidak bisa login ke dalam sistem kampus.",
      type: 'block',
      alert
    })
  }

  const handleDismissFromDrawer = (alert: any) => {
    setConfirmationConfig({
      title: `${t.dismiss || "Dismiss"} alert ini?`,
      desc: "Alert akan dianggap selesai dan masuk ke history.",
      type: 'dismiss',
      alert
    })
  }

  const executeActionFromDrawer = () => {
    if (!confirmationConfig) return
    const { type, alert } = confirmationConfig
    
    if (type === 'block') {
      // 1. Block IP logic
      handleBlockIp("103.22.x.x (Detected via Alert)", alert.title)
      
      // 2. Jalur A: status berubah ke Investigated (tetap di list aktif)
      setAlerts(alerts.map(a => a.id === alert.id ? { ...a, status: 'Investigated' } : a))
      
      // 3. Masukkan ke history sebagai catatan investigasi
      setHistoryLogs([{ 
        id: alert.id, 
        severity: alert.severity, 
        title: alert.title, 
        description: alert.description, 
        time: "Just now", 
        status: "Investigated & Blocked" 
      }, ...historyLogs])
      
      notify("error", "User Blocked", `Security measure active for ${alert.user}.`)
    } else {
      handleAlertDismiss(alert)
    }
    
    setConfirmationConfig(null)
    setDetailUser(null)
    setInvestigatingAlert(null)
  }

  const unblockIP = (ip: string) => {
    setBlockedIps(blockedIps.filter(b => b.ip !== ip))
    setUnblockTarget(null)
    notify("success", "IP Unblocked", `Restored access for ${ip}`)
  }

  const handleSort = (key: keyof typeof securityLogs[0]) => {
    if (sortKey === key) setSortOrder(o => o === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortOrder("asc") }
  }

  // Derived Log Map
  const processedLogs = useMemo(() => {
    let result = [...securityLogs]
    if (filterStatus.length > 0) result = result.filter(l => filterStatus.includes(l.status === "success" ? "Success" : "Failed"))
    if (filterType.length > 0) result = result.filter(l => filterType.includes(l.type))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l => l.user.toLowerCase().includes(q) || l.ip.includes(q) || l.id.includes(q))
    }
    if (sortKey) {
      result.sort((a, b) => {
        const x = a[sortKey]; const y = b[sortKey];
        if (x < y) return sortOrder === "asc" ? -1 : 1
        if (x > y) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    }
    return result
  }, [filterStatus, filterType, searchQuery, sortKey, sortOrder])

  const totalPages = Math.ceil(processedLogs.length / perPage)
  const paginatedLogs = processedLogs.slice((currentPage - 1) * perPage, currentPage * perPage)
  const isFiltered = filterStatus.length > 0 || filterType.length > 0 || filterDate !== "All Time" || searchQuery

  const chips = [
    ...filterStatus.map(v => ({ category: "STATUS", value: v, onClear: () => setFilterStatus(p => p.filter(x => x !== v)) })),
    ...filterType.map(v => ({ category: "LOGIC", value: v, onClear: () => setFilterType(p => p.filter(x => x !== v)) })),
  ]

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-3 duration-500 relative z-50">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.security}</h1>
          <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">{t.securityDesc}</p>
        </div>
      </div>

      {/* ── Notification Strips ── */}
      {activeStrips.length > 0 && (
        <div className="flex flex-col mb-4 relative z-30">
          {activeStrips.map(notif => {
            let colors = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            let IconV: React.ElementType = AlertCircle
            if (notif.type === 'success') { colors = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"; IconV = CheckCircle2 }
            else if (notif.type === 'error') { colors = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"; IconV = Ban }
            else if (notif.type === 'warning') { colors = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"; IconV = AlertTriangle }
            else if (notif.type === 'export') { colors = "bg-blue-50 text-[#2d78f2] border-blue-100 dark:bg-[#2d78f2]/10 dark:text-[#2ba9f5] dark:border-[#2d78f2]/20"; IconV = Download }
            return (
              <div key={notif.id} className={`flex items-center gap-3 px-3.5 rounded-2xl border ${colors} shadow-sm transition-all duration-500 ease-in-out overflow-hidden transform-gpu ${notif.isClosing ? "max-h-0 opacity-0 mb-0 py-0 border-transparent scale-[0.98] origin-top" : "max-h-24 opacity-100 mb-3 py-3.5"}`}>
                <div className="shrink-0 bg-white/50 dark:bg-black/20 p-1.5 rounded-lg"><IconV className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{notif.title}</p>
                  {notif.desc && <p className="text-[12px] opacity-80 mt-0.5">{notif.desc}</p>}
                </div>
                <button onClick={() => dismissActive(notif.id)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"><X className="w-4 h-4" /></button>
              </div>
            )
          })}
        </div>
      )}

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={`${t.successfulLogins} (${t.today})`} value={securityStats.successfulLogins.toLocaleString()} trend="+8.3%" icon={ShieldCheck} index={0} />
          <StatCard title={`${t.failedLogins} (${t.today})`} value={String(securityStats.failedLogins)} trend="-12%" trendUp={false} icon={ShieldX} index={1} />
          <StatCard title={t.anomaliesDetected} value={String(alerts.length)} trend="Requires Action" trendUp={false} icon={AlertTriangle} index={2} />
          <StatCard title={t.activeBlockedIps || "Blocked IPs"} value={String(blockedIps.length)} trend="Current Bans" trendUp={false} icon={Ban} index={3} />
        </div>

        {/* Security Summary & Active Blocked IPs Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Kiri — Security Summary Chart */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium text-slate-800 dark:text-white">{t.securitySummary || "Security Summary"}</h2>
                <p className="text-sm text-slate-400">{t.authTrendAnalysis || "7-day authentication trend analysis"}</p>
              </div>
              <WidgetDropdown value="This Month" options={["Last 7 Days", "This Month", "Last Month", "This Year"]} onChange={() => {}} />
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={securityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d78f2" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2d78f2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 500 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }} 
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="success" name="Successful Validations" stroke="#2d78f2" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
                  <Area type="monotone" dataKey="fail" name="Failed Blocks" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFail)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kanan — Active Blocked IPs */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium text-slate-800 dark:text-white">{t.activeBlockedIps || "Active Blocked IPs"}</h2>
                <p className="text-sm text-slate-400">{t.restrictedIpsDesc || "IP addresses currently restricted"}</p>
              </div>
              <span className="text-sm text-red-500 font-normal bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-500/20">{(t.activeBans || "{count} active bans").replace("{count}", String(blockedIps.length))}</span>
            </div>
            
            <div className="overflow-y-auto max-h-[280px] space-y-3 pr-2 custom-scrollbar">
              {blockedIps.length === 0 ? (
                <div className="text-center py-6 text-sm font-medium text-slate-400">No IPs are currently blocked.</div>
              ) : blockedIps.map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 transition-all hover:bg-red-100/50 dark:hover:bg-red-900/20">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="bg-white dark:bg-slate-900/50 p-2 rounded-xl shrink-0"><TerminalSquare className="w-4 h-4 text-red-500" /></div>
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{b.ip}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{b.reason} &bull; <span className="font-medium text-slate-400">{b.time}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUnblockTarget(b.ip)}
                    className="w-full sm:w-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                  >
                    {t.unblockNetwork || "Unblock Network"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anomaly Alerts */}
        <div className="bg-white dark:bg-[#111827] px-6 py-8 md:p-10 rounded-3xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> {t.anomalyAlerts}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Real-time threat monitoring and auto-flagging system</p>
            </div>
            
            <div className="flex items-center flex-wrap gap-4">
              <AnimatedTabs 
                tabs={[
                  { id: 'All', label: t.allAlerts || 'All Alerts' },
                  { id: 'Critical', label: 'Critical' },
                  { id: 'Medium', label: 'Medium' },
                  { id: 'Low', label: 'Low' }
                ]}
                activeId={alertSeverityFilter}
                onChange={setAlertSeverityFilter}
                containerClassName="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1"
              />
              <button 
                onClick={() => setHistoryDrawer(true)} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                <Clock className="w-4 h-4 text-slate-400" /> {t.viewAllAlerts || "View All Alerts"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3 opacity-90" />
                <p className="font-semibold text-slate-800 dark:text-white">{t.noActiveAnomalies || "No active anomalies"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[300px]">{t.ecosystemClear || "The ecosystem is currently clear of any active network thresholds or security threat violations."}</p>
              </div>
            ) : filteredAlerts.map(alert => {
              const cx = alert.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-500/20' 
                   : alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-amber-900/10 dark:border-amber-500/20' 
                   : 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-500/20';
              const iconCx = alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-500' : 'text-blue-500';
              const badgeCx = alert.severity === 'critical' ? 'bg-red-600 text-white' : alert.severity === 'medium' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white';

              return (
                <div key={alert.id} className={`p-6 rounded-2xl border ${cx} transition-all hover:shadow-md`}>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/80 dark:bg-slate-900/50 p-2.5 rounded-xl shrink-0 shadow-sm border border-black/5 dark:border-white/5">
                      <AlertTriangle className={`w-5 h-5 ${iconCx}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`${badgeCx} px-2 py-0.5 text-[10px] tracking-wide font-semibold rounded-md shadow-sm`}>{alert.severity}</span>
                          {alert.status && (
                            <span className="bg-emerald-500 text-white px-2 py-0.5 text-[10px] tracking-wide font-black rounded-md shadow-sm flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {alert.status}
                            </span>
                          )}
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{alert.title}</h4>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {alert.time}</span>
                      </div>
                      <p className="text-sm mt-1.5 text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {alert.description.split(alert.user).map((part, i) => i === 0 ? part : <span key={i} className="font-medium text-slate-800 dark:text-slate-200">{alert.user}{part}</span>)}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/5 dark:border-white/5 pt-4">
                        <button onClick={() => {
                          setDetailUser({ id: 999, nama: alert.user, email: 'user@example.com', nim: '130121000', faculty: 'FIF', role: 'Student', status: 'Active', lastAccess: alert.time });
                          setInvestigatingAlert(alert);
                        }} className="bg-blue-500 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20">
                          {t.investigate}
                        </button>
                        <button onClick={() => handleAlertBlock(alert)} className="bg-red-500 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                          {t.blockUser}
                        </button>
                        <button onClick={() => handleAlertDismiss(alert)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          {t.dismiss}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>



        {/* Security Logs Table */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl overflow-hidden flex flex-col">
          <div className="p-8 lg:p-10 flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{t.connectionLogs}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t.auditTrailing || "Detailed audit trailing for physical and remote sessions"}</p>
              </div>
              <div className="flex items-center gap-3">
                <ExportDropdown onExport={handleExport} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <MultiSelectFilter selected={filterStatus} options={["Success", "Failed"]} placeholder={t.status} onChange={setFilterStatus} />
              <MultiSelectFilter selected={filterType} options={["Login", "Access", "Download"]} placeholder={t.logic || "Logic"} onChange={setFilterType} />
              <WidgetDropdown value={filterDate} options={["All Time", "Today", "Last 7 Days", "Last 30 Days"]} onChange={(v) => { setFilterDate(v); setCurrentPage(1) }} />
              
              <div className="relative group flex-1 max-w-sm ml-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2d78f2] transition-colors" />
                <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} placeholder={t.searchLogs} className="pl-9 pr-4 py-2.5 bg-[#fcfcfc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#2d78f2] transition-all" />
              </div>
            </div>

            <FilterChips chips={chips} onResetAll={() => { setFilterStatus([]); setFilterType([]); setSearchQuery("") }} />
          </div>
          
          <div className="overflow-x-auto px-2 lg:px-4 mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-sm font-medium">
                  {[{k: 'id', l: t.logId}, {k: 'user', l: t.user}, {k: 'type', l: t.type}, {k: 'status', l: t.status}, {k: 'ip', l: t.ip}, {k: 'location', l: t.location}, {k: 'time', l: t.time}].map(h => (
                    <th key={h.k} className="px-6 py-4 cursor-pointer hover:text-slate-700 transition-colors select-none" onClick={() => handleSort(h.k as keyof typeof securityLogs[0])}>
                      <div className="flex items-center gap-1.5">{h.l} {sortKey === h.k && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm">
                {paginatedLogs.map(log => (
                  <tr key={log.id} onClick={() => setLogDetailDrawer(log)} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 cursor-pointer">
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs font-semibold">{log.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                      <span onClick={(e) => { e.stopPropagation(); setDetailUser({ id: parseInt(log.id.replace('#','')), nama: log.user, email: `${log.user.split(' ')[0].toLowerCase()}@campus.ac.id`, nim: '123456', faculty: 'FTE', role: 'User', status: 'Active', lastAccess: log.time }) }} className="hover:text-[#2d78f2] hover:underline transition-colors">{log.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border-0 ${log.type === 'Login' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : log.type === 'Download' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${log.status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {log.status === 'success' ? (t.ok || 'OK') : (t.fail || 'FAIL')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {log.ip}
                        <button onClick={(e) => { e.stopPropagation(); setIpLookup(log.ip) }} className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#2d78f2] hover:bg-blue-50 dark:hover:bg-[#2d78f2]/10 transition-colors shadow-sm" title="Lookup IP">
                          <Globe2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${log.location === 'Unknown' ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {log.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {log.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center flex-wrap gap-4 text-sm mt-auto">
            <span className={`font-semibold ${isFiltered ? "text-orange-500" : "text-slate-400"}`}>
              {(t.showingXOfYLogs || "Showing {from}–{to} of {total} logs")
                .replace("{from}", String((currentPage - 1) * perPage + 1))
                .replace("{to}", String(Math.min(currentPage * perPage, processedLogs.length)))
                .replace("{total}", String(processedLogs.length))}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${p === currentPage ? "bg-[#2d78f2] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overlays ── */}
      
      {/* 1. History Drawer */}
      {historyDrawer && (
        <Portal>
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setHistoryDrawer(false)} />
          <div className="relative w-full max-w-[400px] bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2"><Clock className="w-5 h-5 text-slate-400" /> Alert History</h3>
              <button onClick={() => setHistoryDrawer(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <button onClick={() => { setHistoryLogs([]); notify('success', 'History Cleared', 'Alert history array permanently wiped.'); }} disabled={historyLogs.length===0} className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">Clear All Records</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {historyLogs.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <p className="font-semibold">{t.noPastAlerts || "No Past Alerts"}</p>
                </div>
              ) : historyLogs.map(log => (
                <div key={log.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 relative bg-white dark:bg-[#111827]">
                  <div className="flex justify-between mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded ${log.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}`}>{log.severity}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.status === 'Blocked' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>{log.status}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{log.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{log.description}</p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* 2. Log Detail Drawer */}
      {logDetailDrawer && (
        <SecurityLogDetailDrawer 
          log={logDetailDrawer} 
          onClose={() => setLogDetailDrawer(null)}
          onBlockIp={handleBlockIp}
          onViewUser={(user) => { setDetailUser({ id: 999, nama: user, faculty: 'FTE' }); setLogDetailDrawer(null); }}
        />
      )}

      {/* 3. User Drawer Share */}
      {detailUser && (
        <UserDetailDrawer 
          user={detailUser} 
          onClose={() => { setDetailUser(null); setInvestigatingAlert(null); }}
          onEdit={undefined}
          onDelete={undefined}
        />
      )}
      {/* Investigation action strip — shown when a drawer is opened from an alert */}
      {detailUser && investigatingAlert && (
        <Portal>
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 border border-slate-700">
            <span className="text-xs font-semibold text-slate-300 mr-1">{t.investigating || "Investigating"}: <strong className="text-white">{investigatingAlert.user}</strong></span>
            <button
              onClick={() => { handleBlockFromDrawer(investigatingAlert); setDetailUser(null); setInvestigatingAlert(null); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold transition-colors">
              Block User
            </button>
            <button
              onClick={() => { handleDismissFromDrawer(investigatingAlert); setDetailUser(null); setInvestigatingAlert(null); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-600 text-slate-200 hover:bg-slate-500 text-xs font-bold transition-colors">
              Dismiss Alert
            </button>
          </div>
        </Portal>
      )}

      {/* 4. Mini IP Lookup Modal */}
      {ipLookup && (
        <Portal>
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-[320px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2d78f2]/10 flex items-center justify-center shrink-0">
                    <Globe2 className="w-5 h-5 text-[#2d78f2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{t.lookupIp || "IP Lookup"}</h4>
                    <p className="text-xs font-mono text-slate-500">{ipLookup}</p>
                  </div>
                </div>
                <button onClick={() => setIpLookup(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex justify-between items-center"><span className="text-xs text-slate-500 font-bold">{t.isp || "ISP"}</span><span className="text-xs font-bold text-slate-800 dark:text-white">Telkom Indonesia</span></div>
                <div className="flex justify-between items-center"><span className="text-xs text-slate-500 font-bold">{t.country || "Country"}</span><span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1">Indonesia</span></div>
                <div className="flex justify-between items-center"><span className="text-xs text-slate-500 font-bold">{t.threatLevel || "Threat Level"}</span><span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">Low</span></div>
              </div>
              <button onClick={() => { handleBlockIp(ipLookup, "Manual Block from Lookup"); setIpLookup(null) }} className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" /> {t.blockRemoteIp || "Block Remote IP"}
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* 5. Unblock Confirmer */}
      {unblockTarget && (
        <ConfirmDialog
          title="Buka blokir IP Network?"
          desc={`Lalu lintas user dari ${unblockTarget} akan diizinkan kembali masuk ke dalam ekosistem kampus.`}
          confirmLabel="Buka Blokir"
          onConfirm={() => unblockIP(unblockTarget)}
          onCancel={() => setUnblockTarget(null)}
          danger={false}
        />
      )}

      {/* 6. Investigation Context Confirmer */}
      {confirmationConfig && (
        <ConfirmDialog
          title={confirmationConfig.title}
          desc={confirmationConfig.desc}
          confirmLabel={confirmationConfig.type === 'block' ? "Blokir" : "Selesaikan"}
          onConfirm={executeActionFromDrawer}
          onCancel={() => setConfirmationConfig(null)}
          danger={confirmationConfig.type === 'block'}
        />
      )}
    </>
  )
}
