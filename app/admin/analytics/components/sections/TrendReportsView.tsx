"use client"

import React, { useState } from "react"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush
} from "recharts"
import { 
  Activity, Download, TrendingUp, TrendingDown 
} from "lucide-react"
import { monthlyActivityTrend, monthlyDownloadTrend } from "@/app/admin/lib/mock-data"

interface TrendReportsViewProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
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

export default function TrendReportsView({ isDark, chartTextColor, gridColor }: TrendReportsViewProps) {
  const [subTab, setSubTab] = useState("activity")
  const [journalVisible, setJournalVisible] = useState(true)
  const [ebookVisible, setEbookVisible] = useState(true)
  const [databaseVisible, setDatabaseVisible] = useState(true)

  const tabs = [
    { id: 'activity', label: 'User Activity Trend', icon: <Activity className="w-4 h-4" /> },
    { id: 'downloads', label: 'Download Trend', icon: <Download className="w-4 h-4" /> },
  ]

  const tabConfigs: Record<string, any> = {
    'activity': {
      title: 'User Activity',
      subtitle: 'Monthly tracking of active user footprint and growth',
      yAxisLabel: 'Active Users',
      growth: '+18.5%',
      metrics: [
        { label: 'Peak Performance', value: 'June 2024', sub: '+450 new registrations', trend: 'up' },
        { label: 'Bounce Intensity', value: '6.2% Avg', sub: '-2% improvement', trend: 'down' },
        { label: 'Consistency Score', value: 'High (88/100)', sub: 'Relative to library benchmark' }
      ]
    },
    'downloads': {
      title: 'Download Performance',
      subtitle: 'Resource acquisition trends across journals, ebooks, and databases',
      yAxisLabel: 'Downloads',
      growth: '+12.3%',
      metrics: [
        { label: 'Top Domain', value: 'sciencedirect.com', sub: '4.2k downloads this month', trend: 'up' },
        { label: 'Growth Velocity', value: 'Fast', sub: '+15% MoM increase', trend: 'up' },
        { label: 'Popular Format', value: 'PDF (82%)', sub: 'Standard research preference' }
      ]
    }
  }

  const currentConfig = tabConfigs[subTab]

  return (
    <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] border border-slate-100 dark:border-slate-800/50 animate-in fade-in duration-700">
      {/* Level 2 Sub-Tabs Navigation */}
      <div className="flex gap-8 mb-12 overflow-x-auto scrollbar-hide relative z-10 border-b border-slate-100 dark:border-slate-800/50">
        {tabs.map((tab) => {
          const isActive = subTab === tab.id
          return (
            <button 
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
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

      <div className="space-y-12">
        <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 p-8 lg:p-10">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <div className="animate-in fade-in slide-in-from-left-4 duration-500" key={`header-${subTab}`}>
                 <h3 className="font-medium text-slate-800 dark:text-white text-2xl tracking-tight">{currentConfig.title}</h3>
                 <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">{currentConfig.subtitle}</p>
              </div>
               <div className="flex items-center gap-4">
                  <div />

                  {subTab === 'downloads' && (
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-full p-1 ml-4">
                      <button 
                        onClick={() => setJournalVisible(!journalVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${journalVisible ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-400 opacity-40 grayscale'}`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0288f4]" />
                        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">Journal</span>
                      </button>
                      <button 
                        onClick={() => setEbookVisible(!ebookVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${ebookVisible ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'text-slate-400 opacity-40 grayscale'}`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">E-Book</span>
                      </button>
                      <button 
                        onClick={() => setDatabaseVisible(!databaseVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${databaseVisible ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'text-slate-400 opacity-40 grayscale'}`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">Database</span>
                      </button>
                    </div>
                  )}
               </div>
           </div>

           <div className="h-[400px] w-full animate-in fade-in slide-in-from-bottom-3 duration-1000" key={`chart-${subTab}`}>
              {subTab === 'activity' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyActivityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0288f4" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0288f4" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.6} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }}
                      tickFormatter={(val) => `${val} 2026`}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: '1px solid rgba(0,0,0,0.05)', 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        padding: '12px 16px'
                      }}
                      itemStyle={{ fontWeight: 500, fontSize: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: 500, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}
                      labelFormatter={(label) => FULL_MONTHS[label] || label}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#0288f4" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                      animationDuration={1500}
                    />
                    <Brush 
                      dataKey="month" 
                      height={30} 
                      stroke="#0288f480" 
                      fill={isDark ? "#0288f410" : "#eef7ff"} 
                      dy={30}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyDownloadTrend} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0288f4" stopOpacity={1} />
                        <stop offset="100%" stopColor="#2ac8f9" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.6} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `${val} 2026`} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 500 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: '1px solid rgba(0,0,0,0.05)', 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        padding: '12px 16px'
                      }}
                      labelFormatter={(label) => FULL_MONTHS[label] || label}
                    />

                    {journalVisible && <Bar dataKey="journal" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} barSize={20} />}
                    {ebookVisible && <Bar dataKey="ebook" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />}
                    {databaseVisible && <Bar dataKey="database" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} barSize={20} />}
                    <Brush dataKey="month" height={30} stroke="#0288f480" fill={isDark ? "#0288f410" : "#eef7ff"} dy={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
           </div>
        </div>


      </div>
    </div>
  )
}
