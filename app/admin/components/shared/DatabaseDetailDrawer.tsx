"use client"

import React, { useState } from "react"
import { 
  X, Database, ExternalLink, Pencil, 
  Activity, Info, Copy, Check, Globe, 
  Clock, Zap, Calendar, Search, Shield,
  Server, Link, Users
} from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"

export interface Journal {
  id: number
  name: string
  category: string
  url: string
  accessMethod: string
  status: "Active" | "Maintenance" | "Down"
  uptime: string
  responseTime: string
  description?: string
  publisher?: string
  subscriptionExpiry?: string
  coverage?: string
  lastChecked?: string
  groups?: string[]
  updatedDate?: string
  createdDate?: string
}

interface DatabaseDetailDrawerProps {
  db: Journal
  onClose: () => void
  onEdit?: () => void
  toggleStatus?: () => void
}

export default function DatabaseDetailDrawer({ db, onClose, onEdit, toggleStatus }: DatabaseDetailDrawerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(db.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusColors = {
    Active: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Maintenance: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Down: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex" onClick={onClose}>
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" />
        <div 
          className="w-full max-w-[500px] bg-slate-50 dark:bg-[#0f172a] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto border-l border-slate-200 dark:border-slate-800" 
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0 z-10 w-full relative">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d78f2] to-[#2ac9fa] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white leading-tight truncate text-lg">Resource Detail</h3>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest mt-0.5 truncate">ID: {db.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#2d78f2] font-semibold text-xs transition-all">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
            
            {/* 1. General Information */}
            <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <Info className="w-4 h-4 text-[#2d78f2]" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-wider">General Information</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">Resource Name</dt>
                  <dd className="text-lg font-black text-slate-800 dark:text-white leading-tight">{db.name}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">Publisher</dt>
                  <dd className="text-sm font-semibold text-slate-700 dark:text-slate-300">{db.publisher || "Unknown Publisher"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">Coverage / Category</dt>
                  <dd className="text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-1.5 mt-1.5">
                    {db.coverage?.split(',').map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{c.trim()}</span>
                    ))}
                    {!db.coverage && <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">{db.category}</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">Description</dt>
                  <dd className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {db.description || `${db.name} is a comprehensive database providing access to digital resources.`}
                  </dd>
                </div>
              </div>
            </section>

            {/* 2. System & Access */}
            <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <Server className="w-4 h-4 text-[#2ac9fa]" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-wider">System & Access</h4>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1.5">Status</dt>
                    <dd>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[db.status]}`}>
                        {db.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1.5">Access Method</dt>
                    <dd className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" /> {db.accessMethod || "SAML"}
                    </dd>
                  </div>
                </div>

                <div>
                  <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1.5">Portal URL</dt>
                  <dd className="flex gap-2">
                    <a href={db.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-50 dark:bg-[#2d78f2]/10 border border-blue-200 dark:border-[#2d78f2]/20 hover:border-[#2d78f2] text-[#2d78f2] text-xs font-medium px-3 py-2 rounded-xl truncate flex items-center gap-2 transition-colors">
                      <Link className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{db.url}</span>
                    </a>
                    <button onClick={handleCopy} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#2d78f2] rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-800">
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </dd>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-800/50">
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1.5">Last Checked</dt>
                    <dd className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-emerald-500" /> {db.lastChecked || "Just now"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 tracking-widest mb-1.5">Endpoint Check</dt>
                    <dd className="text-xs text-slate-500 dark:text-slate-500 font-mono italic">
                      /api/v1/health (200 OK)
                    </dd>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. eResource Groups */}
            <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <Users className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-wider">eResource Groups</h4>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">The following user groups are authorized to access this resource via the defined access method.</p>
                <div className="flex flex-wrap gap-2">
                  {(db.groups && db.groups.length > 0 ? db.groups : ["Default"]).map((grp, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 text-[11px] font-bold tracking-wide">
                      {grp}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Subscription Information */}
            <section className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <Calendar className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-wider">Subscription Information</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 tracking-widest">Created Date</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{db.createdDate || "2024-01-01"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 tracking-widest">Updated Date</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{db.updatedDate || "2024-11-20"}</span>
                </div>
                <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expiry / Valid</span>
                  <span className="text-sm font-black text-amber-700 dark:text-amber-500">{db.subscriptionExpiry || "Lifetime"}</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </Portal>
  )
}
