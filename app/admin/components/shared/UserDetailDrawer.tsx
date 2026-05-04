"use client"

import React from "react"
import { X, Clock, Trash2, Pencil, CalendarDays, ShieldOff, RotateCcw } from "lucide-react"
import StatusBadge, { type UserStatus } from "./StatusBadge"
import Portal from "@/app/admin/components/shared/Portal"

interface User {
  id: number
  nama: string
  email: string
  nim: string
  role: string
  status: UserStatus
  lastAccess: string
  createdAt?: string
  expiryDate?: string
  previousStatus?: UserStatus
}

interface UserDetailDrawerProps {
  user: User
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function UserDetailDrawer({ user, onClose, onEdit, onDelete }: UserDetailDrawerProps) {
  const activityLog = [
    { action: "Accessed IEEE Xplore — Machine Learning AI", time: "2 min ago",  color: "bg-emerald-500" },
    { action: "Downloaded 'Data Science Review'",            time: "1 hr ago",   color: "bg-emerald-500" },
    { action: "Searched 'neural network'",                   time: "3 hr ago",   color: "bg-orange-500"  },
    { action: "Logged in via SSO",                           time: "5 hr ago",   color: "bg-emerald-500" },
    { action: "Failed login attempt",                        time: "1 day ago",  color: "bg-rose-500"    },
  ]

  const statusColor: Record<UserStatus, string> = {
    Active:   "from-emerald-400 to-green-500",
    Inactive: "from-slate-400 to-slate-500",
    Blocked:  "from-red-400 to-rose-500",
  }

  const isAdmin = user.role.toLowerCase().includes("admin")

  return (
    <Portal>
      <div className="fixed inset-0 z-[50] flex" onClick={onClose}>
        <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" />
        <div className="w-full max-w-[400px] bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
          onClick={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">User Detail</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Avatar & Identity ── */}
          <div className="p-6 flex flex-col items-center gap-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-transparent border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${statusColor[user.status]} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
              {user.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl text-slate-800 dark:text-white">{user.nama}</p>
              <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
              {user.nim && <p className="text-xs text-slate-300 dark:text-slate-600 mt-0.5">{user.nim}</p>}
              <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
                <StatusBadge status={user.status} />
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all
                  ${isAdmin
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {[
              ["ID / NIM",    user.nim         || "—"],
              ["Role",        user.role],
              ["Last Access", user.lastAccess],
              ...(user.createdAt  ? [["Created",     user.createdAt]]    : []),
              ...(user.expiryDate ? [["Expiry Date", user.expiryDate]]   : []),
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="text-[11px] font-semibold text-slate-400 tracking-wider mb-1">{k}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{v}</p>
              </div>
            ))}
          </div>

          {/* ── Blocked: previous status info ── */}
          {user.status === "Blocked" && user.previousStatus && (
            <div className="mx-5 mt-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 shrink-0 flex items-start gap-3">
              <ShieldOff className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-red-500 tracking-wider mb-0.5">Account Blocked</p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Was previously <strong>{user.previousStatus}</strong>. Use <em>Revoke</em> to restore.
                </p>
              </div>
            </div>
          )}

          {/* ── Expiry warning ── */}
          {user.expiryDate && user.status === "Active" && (
            <div className="mx-5 mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 shrink-0 flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">Expires on <strong>{user.expiryDate}</strong></p>
            </div>
          )}

          {/* ── Recent Activity ── */}
          <div className="flex-1 overflow-y-auto p-5">
            <p className="text-[11px] font-bold text-slate-400 tracking-wider mb-4">Recent Activity</p>
            <div className="space-y-3">
              {activityLog.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.color}`} />
                  <div>
                    <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{a.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Actions ── */}
          {(onDelete || onEdit) && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
              {onDelete && (
                <button onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-500 text-sm font-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
              {onEdit && (
                <button onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
                  <Pencil className="w-4 h-4" /> Edit User
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </Portal>
  )
}
