"use client"

import React from "react"
import { Bell, ChevronDown } from "lucide-react"

export default function ManageAlertsPanel() {
  const settings = [
    { label: "Download Report", icon: "📊", frequency: "Monthly" },
    { label: "Data Usage", icon: "💾", frequency: "Quarterly" },
    { label: "Search Analytics", icon: "🔍", frequency: "Never" },
    { id: "eClicks", label: "eResource Clicks", icon: "🖱️", frequency: "Yearly" },
  ]

  return (
    <div className="bg-white dark:bg-[#111827] rounded-[32px] border border-slate-100 dark:border-slate-800/50 overflow-hidden h-fit">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3">
         <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Bell className="w-5 h-5 fill-current" />
         </div>
         <div>
            <h3 className="font-medium text-slate-800 dark:text-white">Manage Alerts</h3>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider">Notification Preferences</p>
         </div>
      </div>
      
      <div className="p-6 space-y-4">
         {settings.map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
               <div className="flex items-center gap-3">
                  <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-400 transition-colors">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-500">{item.frequency}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
               </div>
            </div>
         ))}
      </div>

      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800/50">
         <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
            Note: Laporan otomatis akan dikirimkan ke email terdaftar tiap tanggal 2 bulan berjalan sesuai frekuensi yang dipilih.
         </p>
      </div>
    </div>
  )
}
