"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import { useTheme } from "next-themes"
import { 
  TrendingUp, TrendingDown, Minus, AlertTriangle, Download, 
  Search, X, Clock, Trash2, CheckCircle2, AlertCircle, 
  ChevronDown, Filter, File, FileText, FileSpreadsheet,
  MousePointer2, Eye, Calendar, ShieldAlert, ArrowLeft, ArrowUpRight,
  BarChart3, PieChart as PieChartIcon, Activity, Users
} from "lucide-react"
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  FACULTIES, FACULTY_COLORS
} from "@/app/admin/lib/mock-data"
import StatCard from "@/app/admin/components/admin/StatCard"
import Portal from "@/app/admin/components/shared/Portal"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"

// ─── Section Views ───
import AppAnalyticsView from "./components/sections/AppAnalyticsView"
import UserAnalyticsView from "./components/sections/UserAnalyticsView"
import TrendReportsView from "./components/sections/TrendReportsView"
import ManageAlertsPanel from "./components/ManageAlertsPanel"

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const { notify } = useNotifications()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const chartTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const gridColor = isDark ? '#374151' : '#E2E8F0'
  
  const [activeTab, setActiveTab] = useState("app")

  const categories = [
    { id: 'app', label: t.appAnalytics || 'App Analytics', icon: <Activity className="w-4 h-4" /> },
    { id: 'user', label: t.userAnalytics || 'User Analytics', icon: <Users className="w-4 h-4" /> },
    { id: 'trends', label: t.trendReports || 'Trend Reports', icon: <TrendingUp className="w-4 h-4" /> },
  ]

  const handleExport = (fmt: string) => {
    notify("export", `Exporting Analysis`, `Global ${fmt} report is being prepared.`)
  }

  return (
    <div className="max-w-[1800px] mx-auto pb-20 px-2 sm:px-0" suppressHydrationWarning>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 xl:mb-14 gap-4 animate-in fade-in slide-in-from-top-3 duration-500 relative z-50">
        <div>
          <h1 className="text-4xl sm:text-5xl font-medium text-slate-800 dark:text-white tracking-tight">{t.analytics}</h1>
          <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">{t.analysisDesc || "Deep-dive research reporting and behavioral analytics"}</p>
        </div>
        <ExportDropdown onExport={handleExport} />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8 mb-10 animate-in fade-in slide-in-from-top-6 duration-700" suppressHydrationWarning>
        <StatCard title={t.totalSearches || "Total Searches"} value="42,890" trend="+12.5%" icon={Search} index={0} />
        <StatCard title={t.mostSearched || "Most Searched"} value="AI Ethics" trend="Trending" icon={Activity} index={1} />
        <StatCard title={t.peakAccessDay || "Peak Access Day"} value="Wednesday" trend="10:00 AM" icon={Calendar} index={2} />
        <StatCard title={t.anomalyAlerts || "Anomaly Alerts"} value="2 Active" trend="Requires Action" trendUp={false} icon={ShieldAlert} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Level 1 Category Tabs (Database Style) */}
            <div className="flex gap-10 border-b border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden mb-4">
              {categories.map((cat) => {
                const isActive = activeTab === cat.id
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-3 pb-4 pt-6 px-1 transition-all relative whitespace-nowrap group
                      ${isActive ? 'text-[#0288f4] font-medium' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
                  >
                    {cat.icon && React.cloneElement(cat.icon as React.ReactElement, { 
                      className: `w-5 h-5 transition-colors ${isActive ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}` 
                    })}
                    <span className="text-[16px]">{cat.label}</span>
                    {isActive && (
                      <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Routing */}
            <div className="min-h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-700" key={activeTab}>
               {activeTab === 'app' && <AppAnalyticsView isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
               {activeTab === 'user' && <UserAnalyticsView isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
               {activeTab === 'trends' && <TrendReportsView isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
            </div>
         </div>

         {/* Sidebar / Manage Alerts */}
         <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <ManageAlertsPanel />

            {/* Quick Summary Block */}
            <div className="bg-gradient-to-br from-[#0288f4] to-[#2ac8f9] p-8 xl:p-10 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
               <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 opacity-75" />
                  <h4 className="font-medium text-lg">{t.quickInsights || "Quick Insights"}</h4>
               </div>
               <p className="text-sm opacity-90 leading-relaxed mb-6 font-medium">
                  Trend aktivitas menunjukkan lonjakan 12% pada sector Search Analytics didominasi oleh Mahasiswa S1 (Undergraduate).
               </p>
               <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-medium tracking-widest hover:bg-white/30 transition-all border border-white/20">
                  {t.viewTrendDetails || "View Trend Details"}
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
