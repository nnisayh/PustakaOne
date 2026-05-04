"use client"

import React from "react"
import { X, Trash2, Pencil, CalendarDays, Clock, ShieldCheck, Database, BookText } from "lucide-react"
import StatusBadge from "./StatusBadge"
import Portal from "@/app/admin/components/shared/Portal"
import { useLanguage } from "@/app/admin/components/providers/language-provider"

interface eResourceGroup {
  id: number
  title: string
  databases: string[]
  status: "Active" | "Inactive"
  createdAt: string
  expiryDate?: string
}

interface GroupDetailDrawerProps {
  group: eResourceGroup
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function GroupDetailDrawer({ group, onClose, onEdit, onDelete }: GroupDetailDrawerProps) {
  const { t } = useLanguage()

  const statusColor: Record<string, string> = {
    Active:   "from-[#2d78f2] to-[#2ac9fa]",
    Inactive: "from-slate-400 to-slate-500",
  }

  const initials = group.title
    .split(/[\s\-_]+/)
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Portal>
      <div className="fixed inset-0 z-[50] flex" onClick={onClose}>
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" />
        <div
          className="w-full max-w-[400px] bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              {t.groupDetail || "Group Detail"}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Avatar & Identity ── */}
          <div className="p-6 flex flex-col items-center gap-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-transparent border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${statusColor[group.status]} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
              {initials}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-slate-800 dark:text-white">{group.title}</p>
              <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
                <StatusBadge status={group.status} />
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-[#2d78f2] dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                  <Database className="w-3 h-3" />
                  {group.databases.length} {t.databases || "Databases"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {[
              [t.status,      group.status],
              ["Group ID",    `#${group.id}`],
              [t.createdAt || "Created",  group.createdAt],
              [t.expiry || "Expiry",      group.expiryDate || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[11px] font-semibold text-slate-400 tracking-wider mb-1">{k}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{v}</p>
              </div>
            ))}
          </div>

          {/* ── eResources List ── */}
          <div className="p-5 flex-1 overflow-y-auto">
            <h4 className="text-[11px] font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <BookText className="w-3.5 h-3.5" />
              {t.eResources || "eResources"}
              <span className="ml-auto text-[10px] font-bold bg-[#2d78f2]/10 text-[#2d78f2] px-2 py-0.5 rounded-full">
                {group.databases.length}
              </span>
            </h4>
            <div className="space-y-2">
              {group.databases.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
                  {t.noDatabases || "No databases assigned"}
                </p>
              ) : (
                group.databases.map((db, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2d78f2] to-[#2ac9fa] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                      {db.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{db}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
            <button
              onClick={() => { onClose(); onDelete?.() }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-bold text-sm"
            >
              <Trash2 className="w-4 h-4" /> {t.delete}
            </button>
            <button
              onClick={() => { onClose(); onEdit?.() }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2d78f2] text-white hover:bg-blue-600 transition-colors font-bold text-sm shadow-lg shadow-blue-500/20"
            >
              <Pencil className="w-4 h-4" /> {t.edit}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
