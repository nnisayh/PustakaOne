"use client"

import React from "react"
import { X, TerminalSquare, Monitor, MapPin, Smartphone, ShieldX, Ban, Clock } from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"

interface SecurityLog {
  id: string
  user: string
  type: string
  status: "success" | "failed"
  ip: string
  location: string
  time: string
}

interface SecurityLogDetailDrawerProps {
  log: SecurityLog
  onClose: () => void
  onBlockIp?: (ip: string, reason: string) => void
  onViewUser?: (user: string) => void
}

export default function SecurityLogDetailDrawer({ log, onClose, onBlockIp, onViewUser }: SecurityLogDetailDrawerProps) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-[400px] bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Log {log.id}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 flex flex-col gap-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-transparent border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-start justify-between">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border-0 ${log.type === 'Login' ? 'bg-slate-100 text-slate-600' : log.type === 'Download' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{log.type}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-lg ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                {log.status === 'success' ? 'OK' : 'FAIL'}
              </span>
            </div>
            <div>
              <h2 
                className={`text-2xl font-bold text-slate-800 dark:text-white ${onViewUser ? 'cursor-pointer hover:underline' : ''}`} 
                onClick={() => onViewUser?.(log.user)}
              >
                {log.user}
              </h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> {log.time}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "IP Address", v: log.ip, ic: Monitor }, 
                { k: "Location", v: log.location, ic: MapPin }, 
                { k: "Device", v: "Mac OS X", ic: Smartphone }, 
                { k: "Proxy/VPN", v: log.location === "Unknown" ? "Detected" : "Clean", ic: ShieldX }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <item.ic className="w-3.5 h-3.5" /> <p className="text-[11px] font-bold tracking-wider">{item.k}</p>
                  </div>
                  <p className={`text-sm font-bold ${item.v === "Detected" || item.v === "Unknown" ? "text-rose-500" : "text-slate-800 dark:text-white"} break-words`}>{item.v}</p>
                </div>
              ))}
            </div>
            <div>
               <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-2">Extended Trace</p>
               <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto shadow-inner">
                  {`> CF-RAY: 83a45f922
> ASN: AS13335 (Cloudflare)
> User-Agent: Mozilla/5.0 (Mac OS X 10_15_7) Safari/537.36
> Strict-Route: ACTIVE
> JWT_CLAIMS: VERIFIED`}
               </div>
            </div>
          </div>

          {onBlockIp && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={() => onBlockIp(log.ip, `Blocked actively from log ${log.id}`)} 
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
              >
                <Ban className="w-4 h-4" /> Block This IP
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
