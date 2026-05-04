"use client"

import React, { useState, useMemo } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, Brush 
} from "recharts"
import { 
  Mail, CheckCircle2, AlertCircle, Clock, TrendingUp, Search, 
  Users as UsersIcon, Send, MailOpen, UserCheck, UserMinus, 
  Slash, Calendar, UserCog, GraduationCap, School, BookOpen
} from "lucide-react"
import { welcomeEmailStats, facultyEmailData, roleEmailData } from "@/app/admin/lib/mock-data"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"

interface WelcomeEmailReportsProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

const FACULTY_BADGES: Record<string, string> = {
  'FIF': 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  'FEB': 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
  'FTE': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  'FRI': 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  'FKB': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  'FIT': 'bg-cyan-50 text-cyan-600 border-teal-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
  'FIK': 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
}

const DASHBOARD_BLUES = {
  blue1: '#0288f4', // Dark blue
  blue2: '#2ac8f9', // Cyan
  blue3: '#81d4fa', // Light blue
  blue4: '#b3e5fc', // Pale blue
}

const ROLE_COLORS: Record<string, string> = {
  'Dosen': '#3b82f6',
  'Mahasiswa S1': '#10b981',
  'Mahasiswa S2': '#f59e0b',
  'Staff': '#8b5cf6'
}

// Reverting status colors to original vibrant ones
const STATUS_COLORS = {
  users: '#3b82f6',
  neverLoggedIn: '#ef4444',
  loggedIn: '#f59e0b',
  opened: '#10b981',
  invalid: '#8b5cf6'
}

export default function WelcomeEmailReports({ isDark, chartTextColor, gridColor }: WelcomeEmailReportsProps) {
  const { notify } = useNotifications()
  const [activeTab, setActiveTab] = useState('role')
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState('10')
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)
  
  const [visibleStatus, setVisibleStatus] = useState({
    users: true,
    neverLoggedIn: true,
    loggedIn: true,
    opened: true,
    invalid: true
  })

  const [visibleRoles, setVisibleRoles] = useState({
    dosen: true,
    mhsS1: true,
    mhsS2: true,
    staff: true
  })

  const openRate = ((welcomeEmailStats.opened / welcomeEmailStats.totalSent) * 100).toFixed(1)
  const currentData = activeTab === 'role' ? roleEmailData : facultyEmailData

  const filteredData = useMemo(() => {
    let data = [...currentData]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(item => {
        const label = (item as any).role || (item as any).faculty
        return label.toLowerCase().includes(q)
      })
    }
    if (sortConfig?.key) {
      data.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key]
        const bVal = (b as any)[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
  }, [currentData, searchQuery, sortConfig, activeTab])

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
    notify("export", "Exporting Report", `Your ${type} file is being prepared.`)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl animate-in fade-in zoom-in-95 duration-200 z-[100]">
          <p className="text-[11px] font-medium text-slate-400 tracking-widest mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">{label}</p>
          <div className="space-y-2.5">
            {payload.map((p: any, i: number) => {
              const dotColor = p.color && p.color.includes('url') 
                ? (p.dataKey === 'users' ? STATUS_COLORS.users :
                   p.dataKey === 'neverLoggedIn' ? STATUS_COLORS.neverLoggedIn :
                   p.dataKey === 'loggedIn' ? STATUS_COLORS.loggedIn :
                   p.dataKey === 'opened' ? STATUS_COLORS.opened :
                   p.dataKey === 'invalid' ? STATUS_COLORS.invalid :
                   p.dataKey === 'dosen' ? ROLE_COLORS.Dosen :
                   p.dataKey === 'mhsS1' ? ROLE_COLORS['Mahasiswa S1'] :
                   p.dataKey === 'mhsS2' ? ROLE_COLORS['Mahasiswa S2'] :
                   p.dataKey === 'staff' ? ROLE_COLORS.Staff : p.color)
                : p.color;

              return (
                <div key={i} className="flex items-center justify-between gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{p.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">{p.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Sent', value: welcomeEmailStats.totalSent.toLocaleString(), sub: 'New student onboarding', icon: Mail, color: 'blue' },
           { label: 'Open Rate', value: `${openRate}%`, sub: '+2.4% vs last week', icon: CheckCircle2, color: 'emerald', trend: true },
           { label: 'Failed', value: welcomeEmailStats.failed, sub: 'Invalid email addresses', icon: AlertCircle, color: 'rose' },
           { label: 'Pending', value: welcomeEmailStats.pending, sub: 'In delivery queue', icon: Clock, color: 'amber' }
         ].map((card, i) => (
           <div key={i} className="bg-white dark:bg-[#111827] p-7 rounded-[32px] border border-slate-100 dark:border-slate-800/50 flex flex-col relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                   ${card.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' : ''}
                   ${card.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : ''}
                   ${card.color === 'rose' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : ''}
                   ${card.color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : ''}
                 `}>
                    <card.icon className="w-6 h-6" />
                 </div>
                 <span className="text-[10px] font-medium text-slate-400 tracking-widest">{card.label}</span>
              </div>
              <h4 className="text-4xl font-medium text-slate-800 dark:text-white tracking-tight">{card.value}</h4>
              <div className="mt-2 flex items-center gap-1.5">
                 {card.trend && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                 <p className={`text-xs font-medium ${card.trend ? 'text-emerald-600' : 'text-slate-500'}`}>{card.sub}</p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                 <card.icon className="w-24 h-24 -mr-6 -mt-6 rotate-12" />
              </div>
           </div>
         ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <AnimatedTabs 
          tabs={[{ id: 'role', label: 'By User Role' }]}
          activeId={activeTab}
          onChange={(id) => { setActiveTab(id); setSortConfig({ key: 'users', direction: 'desc' }); }}
          containerClassName="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-1 border border-slate-200/50 dark:border-slate-800/50"
          activePillClassName="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          tabClassName="py-2.5 px-8 text-[13px] font-medium transition-all whitespace-nowrap min-w-[140px]"
        />
        <div className="flex items-center gap-3">
           <ExportDropdown onExport={handleExport} />
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden relative">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div>
               <h3 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
                  {activeTab === 'role' ? 'Engagement Status by Role' : 'Onboarding Distribution by Faculty'}
               </h3>
               <p className="text-xs font-medium text-slate-400 mt-1 tracking-widest">
                  {activeTab === 'role' ? 'Detailed email analytics for student and staff onboarding' : 'Comparative performance across university faculties'}
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-50/30 dark:bg-slate-900/50 p-2 rounded-[20px] border border-slate-100 dark:border-slate-800">
               {activeTab === 'role' ? (
                 <>
                   {[
                     { id: 'users', label: 'Users', color: STATUS_COLORS.users, bg: 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
                     { id: 'neverLoggedIn', label: 'Never Logged In', color: STATUS_COLORS.neverLoggedIn, bg: 'bg-rose-50/50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
                     { id: 'loggedIn', label: 'Logged In', color: STATUS_COLORS.loggedIn, bg: 'bg-amber-50/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
                     { id: 'opened', label: 'Opened', color: STATUS_COLORS.opened, bg: 'bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
                     { id: 'invalid', label: 'Invalid', color: STATUS_COLORS.invalid, bg: 'bg-purple-50/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' }
                   ].map(s => (
                     <button key={s.id} onClick={() => setVisibleStatus(v => ({ ...v, [s.id]: !v[s.id as keyof typeof visibleStatus] }))}
                       className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium text-[10px] whitespace-nowrap
                         ${visibleStatus[s.id as keyof typeof visibleStatus] ? `${s.bg}` : 'opacity-30 grayscale'}`}>
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                       {s.label}
                     </button>
                   ))}
                 </>
               ) : (
                 <>
                   {[
                     { id: 'dosen', label: 'Dosen', color: ROLE_COLORS.Dosen, bg: 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
                     { id: 'mhsS1', label: 'Mhs S1', color: ROLE_COLORS['Mahasiswa S1'], bg: 'bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
                     { id: 'mhsS2', label: 'Mhs S2', color: ROLE_COLORS['Mahasiswa S2'], bg: 'bg-amber-50/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
                     { id: 'staff', label: 'Staff', color: ROLE_COLORS.Staff, bg: 'bg-purple-50/50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' }
                   ].map(r => (
                     <button key={r.id} onClick={() => setVisibleRoles(v => ({ ...v, [r.id]: !v[r.id as keyof typeof visibleRoles] }))}
                       className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium text-[10px] whitespace-nowrap
                         ${visibleRoles[r.id as keyof typeof visibleRoles] ? `${r.bg}` : 'opacity-30 grayscale'}`}>
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                       {r.label}
                     </button>
                   ))}
                 </>
               )}
            </div>
         </div>

         <div className="h-[400px] w-full" key={activeTab}>
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={displayData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                  <defs>
                     {/* Role Gradients (Vibrant) */}
                     <linearGradient id="blue1Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
                     <linearGradient id="blue2Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                     <linearGradient id="blue3Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
                     <linearGradient id="blue4Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient>
                     
                     {/* Status Gradients (Original Colors) */}
                     <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
                     <linearGradient id="neverGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f87171" /></linearGradient>
                     <linearGradient id="loggedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
                     <linearGradient id="openedGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                     <linearGradient id="invalidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey={activeTab === 'role' ? 'role' : 'faculty'} axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} height={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  
                  {activeTab === 'role' ? (
                    <>
                      {visibleStatus.users && <Bar dataKey="users" name="Total Users" fill="url(#usersGrad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleStatus.neverLoggedIn && <Bar dataKey="neverLoggedIn" name="Never Logged In" fill="url(#neverGrad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleStatus.loggedIn && <Bar dataKey="loggedIn" name="Logged In Users" fill="url(#loggedGrad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleStatus.opened && <Bar dataKey="opened" name="Email Opened" fill="url(#openedGrad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleStatus.invalid && <Bar dataKey="invalid" name="Invalid Emails" fill="url(#invalidGrad)" radius={[6, 6, 0, 0]} barSize={25} />}
                    </>
                  ) : (
                    <>
                      {visibleRoles.dosen && <Bar dataKey="dosen" name="Dosen" fill="url(#blue1Grad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleRoles.mhsS1 && <Bar dataKey="mhsS1" name="Mahasiswa S1" fill="url(#blue2Grad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleRoles.mhsS2 && <Bar dataKey="mhsS2" name="Mahasiswa S2" fill="url(#blue3Grad)" radius={[6, 6, 0, 0]} barSize={25} />}
                      {visibleRoles.staff && <Bar dataKey="staff" name="Staff" fill="url(#blue4Grad)" radius={[6, 6, 0, 0]} barSize={25} />}
                    </>
                  )}
                  <Brush dataKey={activeTab === 'role' ? 'role' : 'faculty'} height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} travellerWidth={10} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div className="flex-1 max-w-sm group">
               <div className="relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                  <input type="text" placeholder={`Search ${activeTab === 'role' ? 'roles' : 'faculties'}...`}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium focus:border-blue-500 outline-none transition-all"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[11px] font-medium text-slate-400 tracking-widest">SHOW:</span>
               <WidgetDropdown value={entries} options={["10", "25", "All"]} onChange={setEntries} />
            </div>
         </div>

         <div className="overflow-x-auto -mx-8">
            <table className="w-full border-collapse table-fixed">
                <thead>
                   <tr className="text-[10px] tracking-[0.2em] font-medium border-b border-slate-50 dark:border-slate-800/30">
                     {[
                       { k: (activeTab === 'role' ? 'role' : 'faculty'), l: (activeTab === 'role' ? 'User Role' : 'Faculty'), w: '30%' },
                       ...(activeTab === 'role' 
                         ? [
                           { k: 'users', l: 'Total Users' }, { k: 'opened', l: 'Opened' }, 
                           { k: 'loggedIn', l: 'Logged In' }, { k: 'neverLoggedIn', l: 'Never Logged In' }, 
                           { k: 'invalid', l: 'Invalid', align: 'right' }
                         ]
                         : [
                           { k: 'dosen', l: 'Dosen' }, { k: 'mhsS1', l: 'Mhs S1' }, 
                           { k: 'mhsS2', l: 'Mhs S2' }, { k: 'staff', l: 'Staff' }, 
                           { k: 'total', l: 'Total', align: 'right' }
                         ]
                       )
                     ].map((h, i) => (
                       <th 
                         key={h.k} 
                         className={`${h.w || 'w-[14%]'} px-8 py-5 transition-colors cursor-pointer ${sortConfig?.key === h.k ? 'text-[#0288f4]' : 'text-slate-400 hover:text-slate-600'} ${h.align === 'right' ? 'text-right pr-12' : (i === 0 ? 'text-left' : 'text-center')}`}
                         onClick={() => handleSort(h.k)}
                       >
                          <div className={`flex items-center gap-2 whitespace-nowrap ${h.align === 'right' ? 'justify-end' : (i === 0 ? 'justify-start' : 'justify-center')}`}>
                            {h.l}
                          </div>
                       </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {displayData.map((row: any, idx) => {
                     const roleColor = activeTab === 'role' ? (ROLE_COLORS[row.role] || (row.role.includes('Mahasiswa S1') ? ROLE_COLORS['Mahasiswa S1'] : (row.role.includes('Mahasiswa S2') ? ROLE_COLORS['Mahasiswa S2'] : DASHBOARD_BLUES.blue4))) : null;
                     
                     return (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                           <td className="px-8 py-5">
                              {activeTab === 'role' ? (
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.role}</span>
                              ) : (
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-medium border tracking-tight ${FACULTY_BADGES[row.faculty] || 'bg-slate-100 text-slate-500'}`}>
                                   {row.faculty} FACULTY
                                </span>
                              )}
                           </td>
                           {activeTab === 'role' ? (
                             <>
                                <td className="px-8 py-5 text-center font-medium text-slate-600 dark:text-slate-300 text-sm">{row.users.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-emerald-600 dark:text-emerald-400 text-sm">{row.opened.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-amber-600 dark:text-amber-400 text-sm">{row.loggedIn.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-rose-600 dark:text-rose-400 text-sm">{row.neverLoggedIn.toLocaleString()}</td>
                                <td className="px-8 py-5 text-right pr-12 font-medium text-slate-400 dark:text-slate-500 text-sm">{row.invalid.toLocaleString()}</td>
                             </>
                           ) : (
                             <>
                                <td className="px-8 py-5 text-center font-medium text-slate-600 dark:text-slate-300 text-sm">{row.dosen.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-slate-600 dark:text-slate-300 text-sm">{row.mhsS1.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-slate-600 dark:text-slate-300 text-sm">{row.mhsS2.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-medium text-slate-600 dark:text-slate-300 text-sm">{row.staff.toLocaleString()}</td>
                                <td className="px-8 py-5 text-right pr-12">
                                   <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                      {row.total.toLocaleString()}
                                   </span>
                                 </td>
                              </>
                           )}
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
