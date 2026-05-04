"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import {
  Users, GraduationCap, UserPlus, X, Search, Clock, FileText,
  ChevronLeft, ChevronRight, Download, Trash2,
  CheckSquare, Square, ChevronDown, ChevronUp, Pencil, MoreVertical,
  Loader2, CheckCircle2, AlertCircle, AlertTriangle, SortAsc,
  ToggleLeft, ToggleRight, ShieldOff, UserCheck, UserX, RotateCcw,
  MessageSquare, CalendarDays, Mail, User, ShieldCheck, UserCog, BookText,
  ArrowLeft, Globe, Plus, Minus
} from "lucide-react"
import StatCard from "@/app/admin/components/admin/StatCard"
import StatusBadge, { UserStatus } from "@/app/admin/components/shared/StatusBadge"
import UserDetailDrawer from "@/app/admin/components/shared/UserDetailDrawer"
import Portal from "@/app/admin/components/shared/Portal"
import ConfirmDialog from "@/app/admin/components/shared/ConfirmDialog"
import MultiSelectFilter from "@/app/admin/components/shared/MultiSelectFilter"
import FilterChips from "@/app/admin/components/shared/FilterChips"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import { activeOnlineUsers, ROLES } from "@/app/admin/lib/mock-data"
import { useRouter, useSearchParams } from "next/navigation"
import BulkUserImportModal from "@/app/admin/components/shared/BulkUserImportModal"
import AccessManagementModal from "./AccessManagementModal"
import CategoryDetailDrawer from "@/app/admin/components/shared/CategoryDetailDrawer"
import GroupDetailDrawer from "@/app/admin/components/shared/GroupDetailDrawer"
import { useUsers } from "../hooks/useUsers"

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number
  nama: string
  email: string
  nim: string
  major: string
  role: string
  status: UserStatus
  lastAccess: string
  createdAt: string
  expiryDate: string
  previousStatus?: UserStatus
  categoryId?: number
}

interface UserCategory {
  id: number
  title: string
  type: "Student" | "Lecturer" | "Researcher"
  pdfLimit: number
  dataLimit: string
  accessType: "Direct" | "Remote" | "Hybrid"
  expiryDate: string
  groupIds: number[]
  status: "Active" | "Inactive"
}

interface eResourceGroup {
  id: number
  title: string
  databases: string[]
  status: "Active" | "Inactive"
  createdAt: string
  expiryDate?: string
}

const AVAILABLE_DATABASES = [
  "ACM Digital Library", "Bloomsbury Collections", "Emerald", "Gale", 
  "IEEE Xplore Digital Library", "IET Digital Library", "IGILibrary", 
  "Inderscience Online", "Oxford University Press", "ScienceDirect",
  "SpringerLink", "Taylor & Francis", "Wiley Online Library", "JSTOR", "Nature"
]

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────
// Types are kept top-level
type MainTab = "User Management" | "Admin Management" | "Access Management"
type UserTab = "All Users" | "Active" | "Inactive" | "Blocked"
type AdminTab = "All Admins" | "Active" | "Inactive" | "Blocked"
type AccessTab = "User Categories" | "eResource Groups"
type Tab = UserTab | AdminTab | AccessTab

// ─── Filter Dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({ value, placeholder, options, onChange }: {
  value: string; placeholder: string; options: string[]; onChange: (v: string) => void
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [open])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors outline-none whitespace-nowrap">
        {value || placeholder}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[180px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-150">
          <button onClick={() => { onChange(""); setOpen(false) }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] transition-colors ${!value ? "bg-[#2d78f2] text-white font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-normal"}`}>
            {placeholder}
          </button>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors flex items-center gap-3 ${value === opt ? "bg-[#2d78f2] text-white font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-normal"}`}>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Faculty/Role Options ─────────────────────────────────────────────────────
// Faculty options removed
const getRoleOptions = (t: any) => [
  { value: "Mahasiswa S1",     label: t.student + " S1" },
  { value: "Mahasiswa S2",     label: t.student + " S2" },
  { value: "Dosen",            label: t.lecturer },
  { value: "Staff",            label: t.staff },
  { value: "Institute Admin",  label: t.instituteAdmin },
  { value: "Institute Subadmin", label: t.instituteSubadmin },
]

const ROLE_OPTIONS = [
  { value: "Mahasiswa S1",     label: "Mahasiswa S1" },
  { value: "Mahasiswa S2",     label: "Mahasiswa S2" },
  { value: "Dosen",            label: "Dosen" },
  { value: "Staff",            label: "Staff" },
  { value: "Institute Admin",  label: "Institute Admin" },
  { value: "Institute Subadmin", label: "Institute Subadmin" },
]

// ─── Modal Dropdown ───────────────────────────────────────────────────────────
function ModalDropdown({ value, placeholder, options, onChange, error }: {
  value: string; placeholder: string; options: { value: string; label: string }[]; onChange: (v: string) => void; error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const trigRef = useRef<HTMLButtonElement>(null)
  const handleToggle = () => {
    if (!open && trigRef.current) {
      const r = trigRef.current.getBoundingClientRect()
      setStyle({ position: "fixed", top: r.bottom + 6, left: r.left, width: r.width, zIndex: 9999 })
    }
    setOpen(p => !p)
  }
  const sel = options.find(o => o.value === value)
  return (
    <>
      <button type="button" ref={trigRef} onClick={handleToggle}
        className={`flex items-center justify-between w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all outline-none
          ${error ? "border-red-400 bg-red-50 dark:bg-red-500/10" : "border-slate-200 dark:border-slate-800"}
          ${open ? "ring-2 ring-[#2d78f2]/20 border-[#2d78f2]" : ""}
          ${!value ? "text-slate-400/80" : "text-slate-700 dark:text-slate-200"}`}>
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          {sel ? (
            <>
              <span className="truncate text-slate-700 dark:text-slate-200">{sel.label}</span>
            </>
          ) : <span className="text-slate-400/80 truncate">{placeholder}</span>}
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180 text-[#2d78f2]" : "text-slate-400"}`} />
      </button>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div style={style} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {options.map((opt, i) => (
              opt.isHeader ? (
                <div key={`header-${i}`} className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wider bg-slate-50 dark:bg-slate-800/50 mt-2 first:mt-0">
                  {opt.label}
                </div>
              ) : (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] transition-colors flex items-center gap-2.5
                    ${value === opt.value ? "bg-[#2d78f2] text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"}`}>
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            ))}
          </div>
        </Portal>
      )}
    </>
  )
}

// ─── Action Menu (⋮ per row) ──────────────────────────────────────────────────
function ActionMenu({ 
  onEdit, 
  onSetInactive, 
  onSetActive, 
  onBlock, 
  onDelete, 
  onRevoke, 
  status
}: {
  onEdit: () => void
  onSetInactive: () => void
  onSetActive: () => void
  onBlock: () => void
  onDelete: () => void
  onRevoke: () => void
  status: UserStatus
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const trigRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    if (trigRef.current) {
      const r = trigRef.current.getBoundingClientRect()
      const menuW = 180
      const left = r.right - menuW
      setStyle({ position: "fixed", top: r.bottom + 6, left: Math.max(8, left), width: menuW, zIndex: 9999 })
    }
    setOpen(p => !p)
  }

  const actions: { icon: React.ElementType; label: string; color: string; hex: string; onClick: () => void }[] = []

  // Edit is always available
  if (onEdit) actions.push({ icon: Pencil, label: t.edit, color: "text-[#6B7280]", hex: "#6B7280", onClick: onEdit })

  if (status === "Active") {
    if (onSetInactive) actions.push({ icon: User,       label: t.nonaktifkan || t.deactivate, color: "text-[#6B7280]",  hex: "#6B7280", onClick: onSetInactive })
    if (onBlock)       actions.push({ icon: ShieldOff,  label: t.blockUser || t.blocked,        color: "text-[#DC2626]", hex: "#DC2626", onClick: onBlock })
  } else if (status === "Inactive") {
    if (onSetActive)   actions.push({ icon: User,       label: t.activate || "Activate",   color: "text-[#6B7280]", hex: "#6B7280", onClick: onSetActive })
    if (onBlock)       actions.push({ icon: ShieldOff,  label: t.blockUser || t.blocked,        color: "text-[#DC2626]", hex: "#DC2626", onClick: onBlock })
  } else if (status === "Blocked") {
    if (onSetActive)   actions.push({ icon: User,       label: t.activate || "Activate",   color: "text-[#6B7280]", hex: "#6B7280", onClick: onSetActive })
    if (onRevoke)      actions.push({ icon: RotateCcw,  label: t.confirmUnblockTitle,       color: "text-amber-500", hex: "#f59e0b", onClick: onRevoke })
  }

  // Delete is always available
  if (onDelete) actions.push({ icon: Trash2, label: t.delete, color: "text-[#DC2626]", hex: "#DC2626", onClick: onDelete })

  return (
    <div className="relative inline-block">
      <button ref={trigRef} onClick={handleOpen}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div style={style} className="bg-white dark:bg-[#1a2236] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-150">
            {actions.map((a, i) => (
              <button key={i} onClick={() => { a.onClick(); setOpen(false) }}
                style={{ color: a.hex }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 ${a.label === "Delete" ? "font-bold" : ""}`}>
                <a.icon className="w-4 h-4 shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}

// ─── Add / Edit User Modal ────────────────────────────────────────────────────
function UserFormModal({ user, onClose, onSave, mode, categories }: {
  user?: User | null; onClose: () => void; onSave: (data: Partial<User>) => void; mode: MainTab; categories: UserCategory[]
}) {
  const { t } = useLanguage()
  const isAdminMode = mode === "Admin Management"
  const isEdit = !!user
  const roleOptions = getRoleOptions(t)
  const [form, setForm] = useState({
    nama:        user?.nama        ?? "",
    email:       user?.email       ?? "",
    nim:         user?.nim         ?? "",
    role:        user?.role        ?? "",
    categoryId:  user?.categoryId  ?? undefined,
    status:      (user?.status     ?? "Active") as UserStatus,
    expiryDate:  user?.expiryDate  ?? "",
    emailLocked: isEdit && !!(user?.email),
    sendWelcome: true,
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleSave = () => {
    const e: Record<string, boolean> = {}
    if (!form.nama)    e.nama    = true
    if (!form.email)   e.email   = true
    if (!form.role)    e.role    = true
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onSave(form)
    onClose()
  }

  const inp = (f: string) =>
    `w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 outline-none text-sm text-slate-800 dark:text-slate-200 transition-all ${errors[f] ? "border-red-400 bg-red-50 dark:bg-red-500/10" : "border-slate-200 dark:border-slate-800 focus:border-[#2d78f2]"}`

  return (
    <Portal>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-[500px] shadow-2xl animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d78f2]/20 to-[#2ac9fa]/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[#2d78f2]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  {isEdit ? (isAdminMode ? t.edit + " Admin" : t.edit + " User") : (isAdminMode ? t.addNewUser + " (Admin)" : t.addNewUser)}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAdminMode ? "Assign administrative roles and permissions" : (isEdit ? "Update user information" : "Account will be created as Active")}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t.fullName} *</label>
              <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className={inp("nama")} placeholder="e.g. Budi Santoso" />
              {errors.nama && <p className="text-xs text-red-500 mt-1">{t.fullName} required</p>}
            </div>

            {/* ID + Email */}
            <div className={`grid ${isAdminMode ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {!isAdminMode && (
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t.idNim}</label>
                  <input value={form.nim} onChange={e => setForm(f => ({ ...f, nim: e.target.value }))} className={inp("nim")} placeholder="NIM / NIP (optional)" />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  Email *
                  {isEdit && form.emailLocked && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, emailLocked: false }))}
                      className="text-[10px] text-[#2d78f2] hover:underline">Edit anyway?</button>
                  )}
                </label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inp("email")} placeholder="user@telkomuniversity.ac.id"
                  disabled={form.emailLocked}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">Email required</p>}
              </div>
            </div>

            {/* Faculty + Role */}
              <div className={`grid grid-cols-1 gap-3`}>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t.role} *</label>
                <ModalDropdown 
                  value={form.role} 
                  placeholder={t.selectRole} 
                  options={isAdminMode ? [
                    { label: "Admin Roles", value: "header-admin", isHeader: true },
                    ...roleOptions.filter(r => r.value.toLowerCase().includes("admin"))
                  ] : [
                    { label: "User Roles", value: "header-user", isHeader: true },
                    ...roleOptions.filter(r => !r.value.toLowerCase().includes("admin")),
                    { label: t.userCategories, value: "header-cat", isHeader: true },
                    ...categories.map(c => ({ value: c.title, label: c.title }))
                  ]}
                  onChange={v => {
                    const cat = categories.find(c => c.title === v)
                    setForm(f => ({ ...f, role: v, categoryId: cat?.id }))
                  }} error={errors.role} />
                {errors.role && <p className="text-xs text-red-500 mt-1">Required</p>}
              </div>
            </div>


            {/* Status (edit only) */}
            {isEdit && (
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{t.status}</label>
                <ModalDropdown 
                  value={form.status} 
                  placeholder={t.allStatus} 
                  options={[{value:"Active",label:t.active},{value:"Inactive",label:t.inactive},{value:"Blocked",label:t.blocked}]}
                  onChange={v => setForm(f => ({ ...f, status: v as UserStatus }))} 
                />
              </div>
            )}

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> {t.expiry} <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className={inp("expiryDate")} />
            </div>

            {/* Send Welcome Email (add only) */}
            {!isEdit && (
              <div className="flex items-center justify-between p-4 bg-blue-50/60 dark:bg-[#2d78f2]/5 border border-blue-100 dark:border-[#2d78f2]/15 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2d78f2]/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#2d78f2]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Send Welcome Email?</p>
                    <p className="text-xs text-slate-400">Notify user about their new account</p>
                  </div>
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, sendWelcome: !f.sendWelcome }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.sendWelcome ? "bg-[#2d78f2]" : "bg-slate-200 dark:bg-slate-700"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${form.sendWelcome ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {t.cancel}
              </button>
              <button type="button" onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
                {isEdit ? t.saveUser : (isAdminMode ? t.addUser : t.addUser)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

// ─── Access Management Modal ──────────────────────────────────────────────────


// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-[#2d78f2]/10 border border-blue-100 dark:border-[#2d78f2]/20 rounded-xl text-[#2d78f2] dark:text-[#2ba9f5] text-[11px] font-semibold animate-in zoom-in-95 duration-200">
      <span className="uppercase tracking-tight">{label}</span>
      <button onClick={onClear} className="hover:text-blue-700 dark:hover:text-white transition-colors"><X className="w-3 h-3" /></button>
    </div>
  )
}

// ─── Tab Badge Count ──────────────────────────────────────────────────────────
function TabCount({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={`ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold transition-colors
      ${active ? "bg-[#2d78f2] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
      {n}
    </span>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { t } = useLanguage()
  const { notify, activeStrips, dismissActive } = useNotifications()
  const router = useRouter()
  const searchParams = useSearchParams()

  const MAIN_TABS = useMemo(() => [
    { id: "User Management" as MainTab, label: t.userManagement || "User Management" },
    { id: "Admin Management" as MainTab, label: t.adminManagement || "Admin Management" },
    { id: "Access Management" as MainTab, label: t.accessManagement || "Access Management" }
  ], [t])

  const USER_TABS = useMemo(() => [
    { id: "All Users" as UserTab, label: t.allUsers || "All Users" },
    { id: "Active" as UserTab, label: t.active || "Active" },
    { id: "Inactive" as UserTab, label: t.inactive || "Inactive" },
    { id: "Blocked" as UserTab, label: t.blocked || "Blocked" }
  ], [t])

  const ADMIN_TABS = useMemo(() => [
    { id: "All Admins" as AdminTab, label: t.allAdmins || "All Admins" },
    { id: "Active" as AdminTab, label: t.active || "Active" },
    { id: "Inactive" as AdminTab, label: t.inactive || "Inactive" },
    { id: "Blocked" as AdminTab, label: t.blocked || "Blocked" }
  ], [t])

  const ACCESS_TABS = useMemo(() => [
    { id: "User Categories" as AccessTab, label: t.userCategories || "User Categories" },
    { id: "eResource Groups" as AccessTab, label: t.eResourceGroups || "eResource Groups" }
  ], [t])

  const BULK_OPS = useMemo(() => ({
    "All Users": [
      { label: t.activate || "Activate",     status: "Active" as UserStatus,   color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { label: t.setInactive || "Set Inactive", status: "Inactive" as UserStatus, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
      { label: t.block || "Block",        status: "Blocked" as UserStatus,  color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
      { label: t.delete || "Delete",       delete: true,       color: "bg-red-100 text-red-600 hover:bg-red-200" },
    ],
    "All Admins": [
      { label: t.activate || "Activate",     status: "Active" as UserStatus,   color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { label: t.setInactive || "Set Inactive", status: "Inactive" as UserStatus, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
      { label: t.delete || "Delete",       delete: true,       color: "bg-red-100 text-red-600 hover:bg-red-200" },
    ],
    "Active": [
      { label: t.setInactive || "Set Inactive", status: "Inactive" as UserStatus, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
      { label: t.block || "Block",        status: "Blocked" as UserStatus,  color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
      { label: t.delete || "Delete",       delete: true,       color: "bg-red-100 text-red-600 hover:bg-red-200" },
    ],
    "Inactive": [
      { label: t.activate || "Activate",     status: "Active" as UserStatus,   color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { label: t.block || "Block",        status: "Blocked" as UserStatus,  color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
      { label: t.delete || "Delete",       delete: true,       color: "bg-red-100 text-red-600 hover:bg-red-200" },
    ],
    "Blocked": [
      { label: t.activate || "Activate",     status: "Active" as UserStatus,   color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { label: t.setInactive || "Set Inactive", status: "Inactive" as UserStatus, color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
      { label: t.delete || "Delete",       delete: true,       color: "bg-red-100 text-red-600 hover:bg-red-200" },
    ],
    "User Categories": [],
    "eResource Groups": [],
  }), [t])

  const { users, setUsers, isLoading, addUser, editUser, removeUser } = useUsers()
  const [categories, setCategories] = useState<UserCategory[]>([
    { id: 1, title: "S1 Undergraduate", type: "Student", pdfLimit: 10, dataLimit: "1GB", accessType: "Direct", expiryDate: "2025-12-31", groupIds: [1], status: "Active" },
    { id: 2, title: "Senior Researcher", type: "Researcher", pdfLimit: 100, dataLimit: "Unlimited", accessType: "Hybrid", expiryDate: "2026-06-30", groupIds: [1, 2], status: "Active" },
  ])
  const [resourceGroups, setResourceGroups] = useState<eResourceGroup[]>([
    { id: 1, title: "Direktorat NF", status: "Active", createdAt: "2026-01-07", expiryDate: "2027-01-07", databases: ["IEEE Xplore Digital Library", "ScienceDirect"] },
    { id: 2, title: "UNPAZ", status: "Active", createdAt: "2021-10-29", databases: ["ACM Digital Library", "Emerald"] },
    { id: 3, title: "STIA LAN", status: "Active", createdAt: "2021-10-13", databases: ["Gale", "JSTOR"] },
    { id: 4, title: "Internal-testing", status: "Inactive", createdAt: "2021-05-03", databases: ["IEEE Xplore Digital Library"] },
    { id: 5, title: "UMUM", status: "Active", createdAt: "2021-02-02", databases: ["Nature", "ScienceDirect"] },
  ])
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("User Management")
  const [activeTab, setActiveTab] = useState<Tab>("All Users")
  const [filterRole, setFilterRole] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [groupSearch, setGroupSearch] = useState("")
  const [catSearch, setCatSearch] = useState("")
  const [filterCatType, setFilterCatType] = useState<string[]>([])
  const [filterCatAccess, setFilterCatAccess] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set())
  const [groupStatusFilter, setGroupStatusFilter] = useState<string[]>([])
  const [bulkGroupOp, setBulkGroupOp] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 8

  const [sortKey, setSortKey] = useState<keyof User | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)

  // Selection & Edit Mode
  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // Modals
  const [addModal, setAddModal]     = useState(false)
  const [editCategory, setEditCategory] = useState<UserCategory | null>(null)
  const [editGroup, setEditGroup]       = useState<eResourceGroup | null>(null)
  const [importModal, setImportModal] = useState(false)
  const [detailUser, setDetailUser] = useState<User | null>(null)
  const [detailCategory, setDetailCategory] = useState<UserCategory | null>(null)
  const [detailGroup, setDetailGroup] = useState<eResourceGroup | null>(null)
  const [showEditModal, setShowEditModal]         = useState(false)
  const [showInactiveDialog, setShowInactiveDialog] = useState(false)
  const [showBlockDialog, setShowBlockDialog]       = useState(false)
  const [showDeleteDialog, setShowDeleteDialog]     = useState(false)
  const [selectedUser, setSelectedUser]             = useState<User | null>(null)
  const [bulkDeleteTarget, setBulkDeleteTarget]     = useState(false)
  const [bulkBlockTarget, setBulkBlockTarget]       = useState(false)
  const [bulkInactiveTarget, setBulkInactiveTarget] = useState(false)
  const [catDeleteTarget, setCatDeleteTarget]       = useState<number | null>(null)
  const [bulkCatDeleteTarget, setBulkCatDeleteTarget] = useState(false)
  const [bulkCatInactiveTarget, setBulkCatInactiveTarget] = useState(false)
  const [groupDeleteTarget, setGroupDeleteTarget]   = useState<number | null>(null)
  const [bulkGroupDeleteTarget, setBulkGroupDeleteTarget] = useState(false)
  const [bulkGroupInactiveTarget, setBulkGroupInactiveTarget] = useState(false)

  // Derived counts
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const activeCount  = users.filter(u => u.status === "Active").length
  const docentCount  = users.filter(u => u.role === "Dosen").length
  const newCount     = users.filter(u => u.createdAt?.startsWith(thisMonth)).length

  // Update URL
  const updateParam = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    value ? p.set(key, value) : p.delete(key)
    router.replace(`/admin/users?${p.toString()}`)
  }, [searchParams, router])

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc")
      else if (sortOrder === "desc") {
        setSortKey(null)
        setSortOrder(null)
      }
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  // Filtered list
  const filtered = useMemo(() => {
    let result = users.filter(u => {
      // 1. Main Tab Filter (Admins vs General Users)
      const isAdmin = u.role.toLowerCase().includes("admin")
      if (activeMainTab === "Admin Management" && !isAdmin) return false
      if (activeMainTab === "User Management" && isAdmin) return false

      // 2. Sub Tab Filter (AND)
      if (activeTab === "All Admins" && activeMainTab === "Admin Management") return true
      if (activeTab === "All Users"  && activeMainTab === "User Management") {
         // for "All Users" we apply the filterStatus below
      } else {
        if (u.status !== activeTab) return false
      }

      // 2. Status Category (AND between categories, OR within status list)
      if (activeTab === "All Users" && filterStatus.length > 0 && !filterStatus.includes(u.status)) return false
      
      // Role Category (OR within)
      if (filterRole.length > 0 && !filterRole.includes(u.role)) return false
      
      // 5. Search (AND with everything else)
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!u.nama.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.nim.toLowerCase().includes(q)) return false
      }
      return true
    })

    if (sortKey) {
      result.sort((a, b) => {
        const x = a[sortKey]; const y = b[sortKey]
        if (x === undefined || y === undefined) return 0
        if (x < y) return sortOrder === "asc" ? -1 : 1
        if (x > y) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    }
    return result
  }, [users, activeTab, filterStatus, filterRole, searchQuery, sortKey, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated  = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const from = Math.min((currentPage - 1) * perPage + 1, filtered.length)
  const to   = Math.min(currentPage * perPage, filtered.length)

  // Selection helpers
  const allPageSel = paginated.length > 0 && paginated.every(u => selected.has(u.id))
  const toggleAll  = () => {
    if (allPageSel) { const s = new Set(selected); paginated.forEach(u => s.delete(u.id)); setSelected(s) }
    else            { const s = new Set(selected); paginated.forEach(u => s.add(u.id));    setSelected(s) }
  }
  const toggleOne = (id: number) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const clearSel  = () => setSelected(new Set())

  // Tab switch
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    clearSel()
  }

  const tabCount = (tab: Tab) => {
    return users.filter(u => {
      // Must match explicit main tab
      const isAdmin = u.role.toLowerCase().includes("admin")
      if (activeMainTab === "Admin Management" && !isAdmin) return false
      if (activeMainTab === "User Management" && isAdmin) return false

      // Must match explicit sub tab
      if (tab !== "All Users" && tab !== "All Admins" && u.status !== tab) return false
      if (filterRole.length > 0    && !filterRole.includes(u.role))    return false
      // For tabs other than "All Users", filterStatus is usually overlapping/redundant 
      // but we apply it if we are on "All Users"
      if (tab === "All Users" && filterStatus.length > 0 && !filterStatus.includes(u.status)) return false
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!u.nama.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.nim.toLowerCase().includes(q)) return false
      }
      return true
    }).length
  }

  const isFiltered = !!(filterRole.length > 0 || filterStatus.length > 0 || filterCatType.length > 0 || filterCatAccess.length > 0 || groupStatusFilter.length > 0 || searchQuery)
  
  const chips = [
    ...filterRole.map(v =>    ({ category: "ROLE",    value: v, onClear: () => setFilterRole(prev => prev.filter(x => x !== v)) })),
    ...filterStatus.map(v =>  ({ category: "STATUS",  value: v, onClear: () => setFilterStatus(prev => prev.filter(x => x !== v)) })),
    ...filterCatType.map(v => ({ category: "TYPE",    value: v, onClear: () => setFilterCatType(prev => prev.filter(x => x !== v)) })),
    ...filterCatAccess.map(v => ({ category: "ACCESS",  value: v, onClear: () => setFilterCatAccess(prev => prev.filter(x => x !== v)) })),
    ...groupStatusFilter.map(v => ({ category: "STATUS", value: v, onClear: () => setGroupStatusFilter(prev => prev.filter(x => x !== v)) })),
  ]

  const handleResetFilters = () => {
    setFilterRole([])
    setFilterStatus([])
    setFilterCatType([])
    setFilterCatAccess([])
    setGroupStatusFilter([])
    setSearchQuery("")
    router.replace("/admin/users")
  }
  const handleSaveUser = async (data: Partial<User>) => {
    if (selectedUser) {
      const res = await editUser({ id: selectedUser.id, ...data });
      if (res.success) {
        notify("success", "User Updated", "User berhasil diperbarui")
      } else {
        notify("error", "Update Failed", res.message)
      }
    } else {
      const res = await addUser(data);
      if (res.success) {
        notify("success", "User added", `${data.nama} added as Active`)
        switchTab("Active")
      } else {
        notify("error", "Add Failed", res.message)
      }
    }
  }

  const handleBulkSave = (newUsers: User[]) => {
    setUsers(prev => [...newUsers, ...prev])
    notify("success", "Import Successful", `${newUsers.length} users have been added to the database`)
    setImportModal(false)
    switchTab("Active")
  }

  const handleStatusChange = (userId: number, newStatus: UserStatus) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    setSelectedUser(user)
    if (newStatus === "Active")   executeStatusChange(userId, "Active")
    if (newStatus === "Inactive") setShowInactiveDialog(true)
    if (newStatus === "Blocked")  setShowBlockDialog(true)
  }

  const executeStatusChange = async (userId: number, newStatus: UserStatus) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    const prevStatus = newStatus === "Blocked" ? user.status : user.previousStatus
    
    const res = await editUser({ id: userId, status: newStatus, previousStatus: prevStatus });
    if (res.success) {
      const labels: Record<UserStatus, string> = { Active: "activated", Inactive: "set inactive", Blocked: "blocked" }
      notify("success", "Status Updated", `${user?.nama} is now ${newStatus}`)
      setShowInactiveDialog(false)
      setShowBlockDialog(false)
      setSelectedUser(null)
    } else {
      notify("error", "Update Failed", res.message)
    }
  }

  const handleRevoke = (userId: number) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    setSelectedUser(user)
    setShowInactiveDialog(true) // We reuse the Inactive dialog wording for revoke or we can create a specific flag
  }

  const executeRevoke = async (userId: number) => {
    const user = users.find(u => u.id === userId)
    const prev = user?.previousStatus ?? "Active"
    
    const res = await editUser({ id: userId, status: prev, previousStatus: null });
    if (res.success) {
      notify("success", "Status Restored", "Status user berhasil dikembalikan")
      setSelectedUser(null)
    } else {
      notify("error", "Failed", res.message)
    }
  }

  const handleDelete = async (target: User | "bulk") => {
    if (target === "bulk") {
      const count = selected.size
      for (const id of selected) {
        await removeUser(id);
      }
      notify("success", "Users deleted", `${count} users removed permanently`)
      clearSel()
    } else {
      const res = await removeUser((target as User).id);
      if (res.success) {
        notify("success", "User Deleted", "User berhasil dihapus")
        setShowDeleteDialog(false)
        setSelectedUser(null)
      } else {
        notify("error", "Delete Failed", res.message)
      }
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (catDeleteTarget === null) {
      setCatDeleteTarget(id)
      return
    }
    setCategories(prev => prev.filter(c => c.id !== id))
    notify("success", "Category Deleted", "Category removed successfully")
    setCatDeleteTarget(null)
  }

  const handleDeleteGroup = (id: number) => {
    if (groupDeleteTarget === null) {
      setGroupDeleteTarget(id)
      return
    }
    setResourceGroups(prev => prev.filter(g => g.id !== id))
    notify("success", "Group Deleted", "Resource group removed successfully")
    setGroupDeleteTarget(null)
  }

  const toggleGroup = (id: number) => {
    const next = new Set(selectedGroups)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedGroups(next)
  }

  const toggleAllGroups = () => {
    if (selectedGroups.size === resourceGroups.length) {
      setSelectedGroups(new Set())
    } else {
      setSelectedGroups(new Set(resourceGroups.map(g => g.id)))
    }
  }

  const handleBulkGroupOp = () => {
    if (!bulkGroupOp || selectedGroups.size === 0) return
    
    if (bulkGroupOp === "Deactivate") {
      setResourceGroups(prev => prev.map(g => selectedGroups.has(g.id) ? { ...g, status: "Inactive" } : g))
      notify("success", "Groups Deactivated", `${selectedGroups.size} groups deactivated`)
    } else if (bulkGroupOp === "RemoveExpiry") {
      setResourceGroups(prev => prev.map(g => selectedGroups.has(g.id) ? { ...g, expiryDate: undefined } : g))
      notify("success", "Expiry Removed", `Expiry date removed for ${selectedGroups.size} groups`)
    }
    // SetExpiry logic would usually trigger a calendar modal, for now we simulate or simplify
    setSelectedGroups(new Set())
    setBulkGroupOp("")
  }

  const handleBulkStatus = (newStatus: UserStatus) => {
    if (newStatus === "Inactive" && !bulkInactiveTarget) {
      setBulkInactiveTarget(true)
      return
    }
    if (newStatus === "Blocked" && !bulkBlockTarget) {
      setBulkBlockTarget(true)
      return
    }

    setUsers(prev => prev.map(u => {
      if (!selected.has(u.id)) return u
      const prevStatus = newStatus === "Blocked" ? u.status : u.previousStatus
      return { ...u, status: newStatus, previousStatus: prevStatus }
    }))
    notify("success", `Bulk → ${newStatus}`, `${selected.size} users updated`)
    clearSel()
    setBulkInactiveTarget(false)
    setBulkBlockTarget(false)
  }

  const handleExport = (fmt: string) => {
    notify("export", `Exporting ${fmt}`, `${filtered.length} users · Tab: ${activeTab}`)
  }

  const renderMainContent = () => {
    if (activeMainTab === "Access Management") {
      return (
        <div>
          {activeTab === "User Categories" ? (
            <div className="space-y-5">
              {/* Categories Content */}

              {editMode && selected.size > 0 && (
                <div className="mx-0 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selected.size))}</span>
                  <button onClick={() => {
                    setCategories(prev => prev.map(c => selected.has(c.id) ? { ...c, status: "Active" } : c))
                    notify("success", "Categories Activated", `${selected.size} categories updated`)
                    setSelected(new Set())
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">{t.active}</button>
                  <button onClick={() => {
                    if (!bulkCatInactiveTarget) {
                      setBulkCatInactiveTarget(true)
                      return
                    }
                    setCategories(prev => prev.map(c => selected.has(c.id) ? { ...c, status: "Inactive" } : c))
                    notify("warning", "Categories Deactivated", `${selected.size} categories updated`)
                    setSelected(new Set())
                    setBulkCatInactiveTarget(false)
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">{t.deactivate}</button>
                  <button onClick={() => {
                    if (!bulkCatDeleteTarget) {
                      setBulkCatDeleteTarget(true)
                      return
                    }
                    setCategories(prev => prev.filter(c => !selected.has(c.id)))
                    notify("error", "Categories Deleted", `${selected.size} categories removed permanently`)
                    setSelected(new Set())
                    setBulkCatDeleteTarget(false)
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> {t.delete}
                  </button>
                  <button onClick={() => setSelected(new Set())} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f6f6] dark:bg-slate-800/50 text-[#444] dark:text-slate-400 text-[13px]">
                      {editMode && (
                        <th className="px-5 py-4 w-10">
                          <button onClick={() => {
                            const visible = categories.filter(cat => cat.title.toLowerCase().includes(catSearch.toLowerCase()))
                            const allSel = visible.every(c => selected.has(c.id))
                            const next = new Set(selected)
                            if (allSel) visible.forEach(c => next.delete(c.id))
                            else visible.forEach(c => next.add(c.id))
                            setSelected(next)
                          }} className="text-slate-400 hover:text-[#2d78f2] transition-colors">
                            {categories.filter(cat => cat.title.toLowerCase().includes(catSearch.toLowerCase())).every(c => selected.has(c.id)) && categories.length > 0 ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" /> : <Square className="w-4 h-4" />}
                          </button>
                        </th>
                      )}
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.nameEmail}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.type}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.usageRules}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.accessGroups}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.status}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.expiry}</th>
                      <th className="px-4 py-4 font-semibold text-[11px] text-slate-700 dark:text-slate-300 text-right w-12">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories
                      .filter(cat => cat.title.toLowerCase().includes(catSearch.toLowerCase()))
                      .filter(cat => filterCatType.length === 0 || filterCatType.includes(cat.type))
                      .filter(cat => filterCatAccess.length === 0 || filterCatAccess.includes(cat.accessType))
                      .map(cat => (
                      <tr key={cat.id} 
                        onClick={() => setDetailCategory(cat)}
                        className={`group border-t border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/25 transition-colors cursor-pointer ${selected.has(cat.id) ? "bg-blue-50/40 dark:bg-[#2d78f2]/5" : ""}`}>
                        {editMode && (
                          <td className="px-5 py-4">
                            <button onClick={(e) => {
                              e.stopPropagation()
                              const next = new Set(selected)
                              next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id)
                              setSelected(next)
                            }} className="text-slate-300 hover:text-[#2d78f2] transition-colors">
                              {selected.has(cat.id) ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                        )}
                        <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white text-sm">{cat.title}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-[#2d78f2] dark:bg-[#2d78f2]/10 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                            {cat.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">
                          <div className="flex flex-col gap-0.5">
                            <span>PDF Limit: {cat.pdfLimit}</span>
                            <span>Data: {cat.dataLimit}</span>
                            <span className="font-semibold text-[#2d78f2]">{cat.accessType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {cat.groupIds.map(gid => {
                              const g = resourceGroups.find(rg => rg.id === gid)
                              return (
                                <span key={gid} className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 text-[10px] font-semibold border border-purple-100 dark:border-purple-800/30">
                                  {g?.title || `Group ${gid}`}
                                </span>
                              )
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider border ${cat.status === "Inactive" ? "bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700" : "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800/50"}`}>
                            {cat.status || "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" />
                            {cat.expiryDate || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <ActionMenu 
                            status={cat.status || "Active"}
                            onEdit={() => setEditCategory(cat)} 
                            onSetInactive={() => {
                              if (!bulkCatInactiveTarget) {
                                setSelected(new Set([cat.id]))
                                setBulkCatInactiveTarget(true)
                                return
                              }
                            }}
                            onSetActive={() => {
                              setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, status: "Active" } : c))
                              notify("success", "Category Activated", "Category updated successfully")
                            }}
                            onDelete={() => handleDeleteCategory(cat.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Groups Content */}

              {editMode && selectedGroups.size > 0 && (
                <div className="mx-0 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selectedGroups.size))}</span>
                  <button onClick={() => {
                    setResourceGroups(prev => prev.map(g => selectedGroups.has(g.id) ? { ...g, status: "Active" } : g))
                    notify("success", "Groups Activated", `${selectedGroups.size} groups updated`)
                    setSelectedGroups(new Set())
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">{t.active}</button>
                  <button onClick={() => {
                    if (!bulkGroupInactiveTarget) {
                      setBulkGroupInactiveTarget(true)
                      return
                    }
                    setResourceGroups(prev => prev.map(g => selectedGroups.has(g.id) ? { ...g, status: "Inactive" } : g))
                    notify("warning", "Groups Deactivated", `${selectedGroups.size} groups updated`)
                    setSelectedGroups(new Set())
                    setBulkGroupInactiveTarget(false)
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">{t.deactivate}</button>
                  <button onClick={() => {
                    if (!bulkGroupDeleteTarget) {
                      setBulkGroupDeleteTarget(true)
                      return
                    }
                    setResourceGroups(prev => prev.filter(g => !selectedGroups.has(g.id)))
                    notify("error", "Groups Deleted", `${selectedGroups.size} groups removed permanently`)
                    setSelectedGroups(new Set())
                    setBulkGroupDeleteTarget(false)
                  }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> {t.delete}
                  </button>
                  <button onClick={() => setSelectedGroups(new Set())} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f6f6] dark:bg-slate-800/50 text-[#444] dark:text-slate-400 text-[13px]">
                      {editMode && (
                        <th className="px-5 py-4 w-10">
                          <button onClick={toggleAllGroups} className="text-slate-400 hover:text-[#2d78f2] transition-colors">
                            {selectedGroups.size === resourceGroups.length && resourceGroups.length > 0 ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" /> : <Square className="w-4 h-4" />}
                          </button>
                        </th>
                      )}
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.nameEmail}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.status}</th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#2d78f2] transition-colors">
                          {t.createdAt} <SortAsc className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-4 font-semibold tracking-wider text-[11px] text-slate-400">{t.expiry}</th>
                      <th className="px-4 py-4 font-bold text-[11px] text-slate-700 dark:text-slate-300 text-right w-12">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceGroups
                      .filter(g => g.title.toLowerCase().includes(groupSearch.toLowerCase()))
                      .filter(g => groupStatusFilter.length === 0 || groupStatusFilter.includes(g.status))
                      .map(group => (
                      <tr key={group.id}
                        onClick={() => setDetailGroup(group)}
                        className={`border-t border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/25 transition-colors cursor-pointer ${selectedGroups.has(group.id) ? "bg-blue-50/40 dark:bg-[#2d78f2]/5" : ""}`}>
                        {editMode && (
                          <td className="px-5 py-4">
                            <button onClick={(e) => { e.stopPropagation(); toggleGroup(group.id) }} className="text-slate-300 hover:text-[#2d78f2] transition-colors">
                              {selectedGroups.has(group.id) ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-800 dark:text-white text-sm">{group.title}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-fit">
                            <StatusBadge status={group.status} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {group.createdAt}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" />
                            {group.expiryDate || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <ActionMenu 
                            status={group.status || "Active"}
                            onEdit={() => setEditGroup(group)} 
                            onSetInactive={() => {
                              if (!bulkGroupInactiveTarget) {
                                setSelectedGroups(new Set([group.id]))
                                setBulkGroupInactiveTarget(true)
                                return
                              }
                            }}
                            onSetActive={() => {
                              setResourceGroups(prev => prev.map(g => g.id === group.id ? { ...g, status: "Active" } : g))
                              notify("success", "Group Activated", "Group updated successfully")
                            }}
                            onDelete={() => handleDeleteGroup(group.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <>
        {/* Existing User/Admin Table Logic */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f6f6] dark:bg-slate-800/50 text-[#444] dark:text-slate-400 text-[13px]">
                {editMode && (
                  <th className="px-5 py-4 w-10">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-[#2d78f2] transition-colors">
                      {allPageSel ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                )}
                {[
                  { k: "nama", l: t.nameEmail },
                  { k: "role", l: t.role },
                  { k: "status", l: t.status },
                  { k: "lastAccess", l: activeMainTab === (t.adminManagement || "Admin Management") ? (t.lastActivity || "Last Activity") : t.lastAccess }
                ].map(h => (
                  <th key={h.k} className="px-4 py-4 font-semibold">
                    <button 
                      onClick={() => handleSort(h.k as keyof User)} 
                      className={`flex items-center gap-1 transition-colors outline-none tracking-wider text-[11px] ${sortKey === h.k ? 'text-[#2d78f2]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {h.l}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-4 font-semibold text-right w-12">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 dark:text-slate-600">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-sm font-medium">{t.noUsersFound}</p>
                      <p className="text-xs opacity-60">{t.adjustFilters}</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(user => (
                <tr key={user.id}
                  className={`group border-t border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/25 transition-colors
                    ${selected.has(user.id) ? "bg-blue-50/40 dark:bg-[#2d78f2]/5" : ""}`}>

                  {editMode && (
                    <td className="px-5 py-4">
                      <button onClick={() => toggleOne(user.id)} className="text-slate-300 hover:text-[#2d78f2] transition-colors">
                        {selected.has(user.id)
                          ? <CheckSquare className="w-4 h-4 text-[#2d78f2]" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                  )}

                  {/* Name & Email */}
                  <td className="px-4 py-4">
                    <button onClick={() => setDetailUser(user)} className="text-left group/cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d78f2]/20 to-[#2ac9fa]/20 flex items-center justify-center text-[11px] font-semibold text-[#2d78f2] shrink-0">
                          {user.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white text-sm group-hover/cell:text-[#2d78f2] transition-colors">{user.nama}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{user.email}</div>
                          {user.nim && activeMainTab !== "Admin Management" && <div className="text-slate-300 dark:text-slate-600 text-[10px]">{user.nim}</div>}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Faculty column removed */}

                  {/* Role & Category */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all w-fit
                        ${user.role.includes("Admin")
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800/30"
                          : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40"
                        }`}>
                        {user.role}
                      </span>
                      {user.categoryId && (
                        <span className="flex items-center gap-1.5 text-[10px] text-[#2d78f2] font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          {categories.find(c => c.id === user.categoryId)?.title || (t.customCategory || "Custom Category")}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge 
                        status={user.status} 
                        className="!px-[12px] !py-[6px] !text-[12px]" 
                      />
                      {user.status === "Blocked" && user.previousStatus && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600">
                          {(t.wasStatus || "was: {status}").replace("{status}", user.previousStatus)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Last Access */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" /> {user.lastAccess}
                      </span>
                      {user.expiryDate && (
                        <span className="flex items-center gap-1.5 text-[10px] text-amber-400">
                          <CalendarDays className="w-2.5 h-2.5" /> {(t.expiryShort || "Exp: {date}").replace("{date}", user.expiryDate)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <ActionMenu
                      status={user.status}
                      onEdit={() => { setSelectedUser(user); setShowEditModal(true) }}
                      onSetInactive={() => handleStatusChange(user.id, "Inactive")}
                      onSetActive={() => handleStatusChange(user.id, "Active")}
                      onBlock={() => handleStatusChange(user.id, "Blocked")}
                      onDelete={() => { setSelectedUser(user); setShowDeleteDialog(true) }}
                      onRevoke={() => handleRevoke(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 md:px-8 flex justify-between items-center flex-wrap gap-4 text-sm border-t border-slate-50 dark:border-slate-800/60">
          {isFiltered
            ? <span className="font-medium text-orange-500">{t.showingXofY.replace("{count}", String(filtered.length)).replace("{total}", String(users.length))}</span>
            : <span className="font-medium text-slate-400">{t.showingXofY.replace("{count}", `${from}-${to}`).replace("{total}", String(filtered.length))}</span>
          }
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                  ${p === currentPage ? "bg-[#2d78f2] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .slide-down { animation: slideDown 0.2s ease both; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-4xl sm:text-5xl font-medium text-black dark:text-white tracking-tight">{t.users}</h1>
        <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">{t.usersDesc}</p>
      </div>

      {/* ── Main Section Tabs ── */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800/60 mb-8 relative">
        {MAIN_TABS.map(tab => {
          const Icon = tab.id === "User Management" ? Users : (tab.id === "Admin Management" ? UserCog : ShieldCheck)
          const active = activeMainTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id)
                if (tab.id === "User Management") setActiveTab("All Users")
                else if (tab.id === "Admin Management") {
                  setActiveTab("All Admins")
                }
                else {
                  setActiveTab("User Categories")
                }
                setCurrentPage(1)
                clearSel()
              }}
              className={`flex items-center gap-3 px-1 py-4 border-b-2 transition-all duration-300 relative group
                ${active ? "border-[#2d78f2] text-[#2d78f2]" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
            >
              <Icon className={`w-5 h-5 transition-all group-hover:scale-110 ${active ? "text-[#2d78f2]" : "text-slate-400"}`} />
              <span className={`font-semibold text-base tracking-tight ${active ? "text-slate-900 dark:text-white" : ""}`}>{tab.label}</span>
              {active && (
                <div className="absolute inset-x-0 bottom-[-2px] h-[2.5px] bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] rounded-full shadow-[0_0_10px_rgba(45,120,242,0.4)]" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Notification Strips ── */}
      {activeStrips.length > 0 && (
        <div className="flex flex-col mb-4 relative z-30">
          {activeStrips.map(notif => {
            let colors = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            let Icon: React.ElementType = Loader2
            if (notif.type === "success") { colors = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"; Icon = CheckCircle2 }
            else if (notif.type === "error")   { colors = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"; Icon = AlertCircle }
            else if (notif.type === "warning") { colors = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"; Icon = AlertTriangle }
            else if (notif.type === "export")  { colors = "bg-blue-50 text-[#2d78f2] border-blue-100 dark:bg-[#2d78f2]/10 dark:text-[#2ba9f5] dark:border-[#2d78f2]/20"; Icon = Download }
            return (
              <div key={notif.id} className={`flex items-center gap-3 px-3.5 rounded-2xl border ${colors} shadow-sm transition-all duration-500 ease-in-out overflow-hidden transform-gpu ${notif.isClosing ? "max-h-0 opacity-0 mb-0 py-0 border-transparent scale-[0.98] origin-top" : "max-h-24 opacity-100 mb-3 py-3.5"}`}>
                <div className="shrink-0 bg-white/50 dark:bg-black/20 p-1.5 rounded-lg">
                  <Icon className={`w-4 h-4 ${notif.type === "loading" ? "animate-spin" : ""}`} />
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

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Main Column ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeMainTab === "User Management" ? (
                <>
                  <StatCard title={t.activeUsers}         value={String(activeCount)} trend="+5.2%" icon={Users}        index={0} />
                  <StatCard title={t.registeredLecturers} value={String(docentCount)} trend="+2.1%" icon={GraduationCap} index={1} />
                  <StatCard title={t.newThisMonth}         value={`+${newCount}`}       trend="+18%"  icon={UserPlus}     index={2} />
                </>
              ) : activeMainTab === "Admin Management" ? (
                <>
                  <StatCard title={t.allAdmins}       value={String(users.filter(u => u.role.includes("Admin")).length)} trend="Stable" icon={ShieldCheck} index={0} />
                  <StatCard title={t.instituteAdmin}   value={String(users.filter(u => u.role === "Institute Admin").length)} trend="Main" icon={UserCog} index={1} />
                  <StatCard title={t.instituteSubadmin} value={String(users.filter(u => u.role === "Institute Subadmin").length)} trend="Limited" icon={UserPlus} index={2} />
                </>
              ) : (
                <>
                  <StatCard title={t.userCategories}    value={String(categories.length)} trend="Profiles" icon={Users} index={0} />
                  <StatCard title={t.eResourceGroups}   value={String(resourceGroups.length)} trend="Active" icon={ShieldCheck} index={1} />
                  <StatCard title={t.mappedDatabases}   value={String(resourceGroups.reduce((acc, g) => acc + g.databases.length, 0))} trend="Total" icon={BookText} index={2} />
                </>
              )}
            </div>

            {/* ── User Management Card ── */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl overflow-visible">

              {/* Card Header */}
              <div className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                      {activeMainTab === "Admin Management" ? t.adminMgmt : (activeMainTab === "Access Management" ? t.accessMgmt : t.userMgmt)}
                    </h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                      {activeMainTab === "Admin Management" ? "Manage institute admins and access levels" : (activeMainTab === "Access Management" ? "Manage user profiles and content groups" : t.userMgmtDesc)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditMode(!editMode); setSelected(new Set()); setSelectedGroups(new Set()) }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${editMode ? "bg-blue-50 border-blue-200 text-[#2d78f2] dark:bg-[#2d78f2]/10 dark:text-[#2ba9f5] dark:border-[#2d78f2]/20" : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50"}`}>
                      {editMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {t.editMode}
                    </button>

                    {activeMainTab !== "Access Management" ? (
                      <>
                        <ExportDropdown onExport={handleExport} />
                        <button onClick={() => setImportModal(true)}
                          className="bg-white dark:bg-[#111827] border border-[#2d78f2] text-[#2d78f2] dark:text-[#2ba9f5] dark:border-[#2d78f2]/30 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all shadow-sm flex items-center gap-2">
                          <FileText className="w-4 h-4" /> {activeMainTab === "Admin Management" ? t.bulkImport + " (Admin)" : t.bulkImport}
                        </button>
                      </>
                    ) : (
                      <ExportDropdown onExport={handleExport} />
                    )}
                    <button onClick={() => setAddModal(true)}
                      className="bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> 
                      {activeMainTab === "Admin Management" 
                        ? t.addUser + " (Admin)" 
                        : activeMainTab === "Access Management" 
                          ? (activeTab === "User Categories" ? t.addCategory : t.addGroup) 
                          : t.addUser}
                    </button>
                  </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
                  {(activeMainTab === (t.userManagement || "User Management") ? USER_TABS 
                    : activeMainTab === (t.adminManagement || "Admin Management") ? ADMIN_TABS 
                    : ACCESS_TABS).map((tab) => (
                      <button key={tab.id} onClick={() => switchTab(tab.id as Tab)}
                        className={`flex items-center px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 
                          ${activeTab === tab.id
                            ? "border-[#2d78f2] text-[#2d78f2]"
                            : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}>
                        {tab.label}
                        {activeMainTab !== (t.accessManagement || "Access Management") && <TabCount n={tabCount(tab.id as Tab)} active={activeTab === tab.id} />}
                      </button>
                    ))}
                </div>

                {activeMainTab === "Access Management" ? (
                  <div className="flex flex-wrap gap-3 items-center">
                    {activeTab === "User Categories" ? (
                      <>
                        <MultiSelectFilter 
                          selected={filterCatType} 
                          placeholder={t.type} 
                          options={["Student", "Lecturer", "Researcher"]}
                          onChange={setFilterCatType} 
                        />
                        <MultiSelectFilter 
                          selected={filterCatAccess} 
                          placeholder={t.accessType} 
                          options={["Direct", "Remote", "Hybrid"]}
                          onChange={setFilterCatAccess} 
                        />
                        <div className="relative group flex-1 max-w-sm ml-auto">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2d78f2] transition-colors" />
                          <input type="text" value={catSearch}
                            onChange={e => setCatSearch(e.target.value)}
                            placeholder={t.searchCategoryPlaceholder}
                            className="pl-9 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#2d78f2] transition-all" />
                          {catSearch && (
                            <button onClick={() => setCatSearch("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <MultiSelectFilter 
                          selected={groupStatusFilter} 
                          placeholder={t.status} 
                          options={["Active", "Inactive"]}
                          onChange={setGroupStatusFilter} 
                        />
                        <div className="relative group flex-1 max-w-sm ml-auto">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2d78f2] transition-colors" />
                          <input type="text" value={groupSearch}
                            onChange={e => setGroupSearch(e.target.value)}
                            placeholder={t.searchGroupPlaceholder}
                            className="pl-9 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#2d78f2] transition-all" />
                          {groupSearch && (
                            <button onClick={() => setGroupSearch("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Faculty filter removed as per user request */}
                    <MultiSelectFilter 
                      selected={filterRole} 
                      placeholder={activeMainTab === (t.adminManagement || "Admin Management") ? t.adminRole : t.userRole}
                      options={activeMainTab === (t.adminManagement || "Admin Management") 
                        ? ROLES.filter(r => r.toLowerCase().includes("admin")) 
                        : ROLES.filter(r => !r.toLowerCase().includes("admin"))}
                      onChange={setFilterRole} 
                    />
                    {(activeTab === "All Users" || activeTab === "All Admins") && (
                      <MultiSelectFilter 
                        selected={filterStatus} 
                        placeholder={t.status} 
                        options={["Active", "Inactive", "Blocked"]}
                        onChange={setFilterStatus} 
                      />
                    )}
                    <div className="relative group flex-1 max-w-sm ml-auto">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2d78f2] transition-colors" />
                      <input type="text" value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); updateParam("search", e.target.value) }}
                        placeholder={t.searchUserPlaceholder}
                        className="pl-9 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#2d78f2] transition-all" />
                      {searchQuery && (
                        <button onClick={() => { setSearchQuery(""); updateParam("search", "") }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <FilterChips chips={chips} onResetAll={handleResetFilters} />
              </div>

              {editMode && selected.size > 0 && activeMainTab !== (t.accessManagement || "Access Management") && (
                <div className="mx-6 md:mx-8 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selected.size))}</span>
                  
                  {BULK_OPS[activeTab as Tab]?.map((op, i) => (
                    <button key={i} onClick={() => op.delete ? setBulkDeleteTarget(true) : handleBulkStatus(op.status!)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${op.color}`}>
                      {op.delete && <Trash2 className="w-3.5 h-3.5" />}
                      {op.label}
                    </button>
                  ))}

                  <button onClick={clearSel} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="px-6 md:px-8 pb-8 mt-2">
                {renderMainContent()}
              </div>
            </div>
          </div>

          {/* ── Online Now Sidebar ── */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 h-fit lg:sticky lg:top-24 space-y-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">{t.activeNow}</h3>
              <span className="ml-auto text-xs font-bold text-[#2d78f2] bg-[#2d78f2]/10 px-2.5 py-0.5 rounded-full">
                {activeOnlineUsers.length}
              </span>
            </div>

            <div className="space-y-1">
              {activeOnlineUsers.map((u, i) => (
                <div key={i} className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d78f2]/20 to-[#2ac9fa]/20 border border-[#2d78f2]/15 flex items-center justify-center text-xs font-bold text-[#2d78f2]">
                      {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#111827]" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{u.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400 truncate">{u.role}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-0.5">since {u.since}</p>
                  </div>
                  {/* Message */}
                  <button
                    onClick={() => notify("success", "Message sent", `Notification sent to ${u.name}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-[#2d78f2]/10 text-[#2d78f2] hover:bg-[#2d78f2]/20 shrink-0"
                    title={`Message ${u.name}`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* SSO note */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <ToggleLeft className="w-4 h-4 text-[#2d78f2] shrink-0" />
              <p className="text-[11px] text-slate-400 leading-tight">New SSO logins are automatically set to <strong className="text-emerald-500">Active</strong></p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Overlays ── */}
      {addModal && activeMainTab === "Access Management" && (
        <AccessManagementModal 
          activeTab={activeTab as AccessTab} 
          onClose={() => setAddModal(false)} 
          onSaveCategory={(cat) => { setCategories(prev => [{ ...cat, id: Date.now() } as UserCategory, ...prev]); setAddModal(false); notify("success", "Category Created", `${cat.title} has been added`) }}
          onSaveGroup={(group) => { setResourceGroups(prev => [{ ...group, id: Date.now(), status: "Active", createdAt: new Date().toISOString().split('T')[0] } as eResourceGroup, ...prev]); setAddModal(false); notify("success", "Group Created", `${group.title} has been added`) }}
          resourceGroups={resourceGroups}
        />
      )}
      {editCategory && (
        <AccessManagementModal 
          activeTab="User Categories" 
          initialData={editCategory}
          onClose={() => setEditCategory(null)} 
          onSaveCategory={(cat) => { setCategories(prev => prev.map(c => c.id === editCategory.id ? { ...c, ...cat } : c)); setEditCategory(null); notify("success", "Category Updated", `${cat.title} has been updated`) }}
          onSaveGroup={() => {}}
          resourceGroups={resourceGroups}
        />
      )}
      {editGroup && (
        <AccessManagementModal 
          activeTab="eResource Groups" 
          initialData={editGroup}
          onClose={() => setEditGroup(null)} 
          onSaveCategory={() => {}}
          onSaveGroup={(group) => { setResourceGroups(prev => prev.map(g => g.id === editGroup.id ? { ...g, ...group } : g)); setEditGroup(null); notify("success", "Group Updated", `${group.title} has been updated`) }}
          resourceGroups={resourceGroups}
        />
      )}
      {addModal && activeMainTab !== "Access Management" && <UserFormModal mode={activeMainTab} onClose={() => setAddModal(false)} onSave={handleSaveUser} categories={categories} />}
      {importModal && (
        <BulkUserImportModal 
          onClose={() => setImportModal(false)} 
          onSave={handleBulkSave} 
          roleOptions={activeMainTab === "Admin Management" 
            ? getRoleOptions(t).filter(r => r.value.toLowerCase().includes("admin")) 
            : getRoleOptions(t).filter(r => !r.value.toLowerCase().includes("admin"))} 
          existingUsers={users}
          isAdminMode={activeMainTab === "Admin Management"}
        />
      )}
      {showEditModal && selectedUser && (
        <UserFormModal mode={activeMainTab} user={selectedUser} onClose={() => { setShowEditModal(false); setSelectedUser(null); }} onSave={handleSaveUser} categories={categories} />
      )}
      {detailUser && (
        <UserDetailDrawer
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onEdit={() => { setSelectedUser(detailUser); setShowEditModal(true); setDetailUser(null) }}
          onDelete={() => { setSelectedUser(detailUser); setShowDeleteDialog(true); setDetailUser(null) }}
        />
      )}
      {detailCategory && (
        <CategoryDetailDrawer
          category={detailCategory}
          resourceGroups={resourceGroups}
          onClose={() => setDetailCategory(null)}
          onEdit={() => { setEditCategory(detailCategory); setDetailCategory(null) }}
          onDelete={() => { 
            setCategories(prev => prev.filter(c => c.id !== detailCategory.id))
            notify("error", "Category Deleted", `Category ${detailCategory.title} removed permanently`)
            setDetailCategory(null)
          }}
        />
      )}
      {detailGroup && (
        <GroupDetailDrawer
          group={detailGroup}
          onClose={() => setDetailGroup(null)}
          onEdit={() => { setEditGroup(detailGroup); setDetailGroup(null) }}
          onDelete={() => {
            handleDeleteGroup(detailGroup.id)
            setDetailGroup(null)
          }}
        />
      )}

      {showInactiveDialog && selectedUser && (
        <ConfirmDialog
          title={t.confirmBulkInactiveTitle.replace("{count}", "1")}
          desc={t.confirmBulkInactiveDesc.replace("{count}", "1")}
          confirmLabel={t.deactivate}
          onConfirm={() => executeStatusChange(selectedUser.id, "Inactive")}
          onCancel={() => { setShowInactiveDialog(false); setSelectedUser(null); }}
          danger={true}
        />
      )}
      {showBlockDialog && selectedUser && (
        <ConfirmDialog
          title={t.confirmBlockTitle}
          desc={t.confirmBlockDesc}
          confirmLabel={t.blockUser}
          onConfirm={() => executeStatusChange(selectedUser.id, "Blocked")}
          onCancel={() => { setShowBlockDialog(false); setSelectedUser(null); }}
          danger={true}
        />
      )}
      {showDeleteDialog && selectedUser && (
        <ConfirmDialog
          title={t.confirmDeleteTitle.replace("{name}", selectedUser.nama)}
          desc={t.confirmDeleteDesc.replace("{name}", selectedUser.nama)}
          confirmLabel={t.delete}
          danger={true}
          onConfirm={() => handleDelete(selectedUser)}
          onCancel={() => { setShowDeleteDialog(false); setSelectedUser(null); }}
        />
      )}
      {bulkDeleteTarget && (
        <ConfirmDialog
          title={t.confirmDeleteBulkTitle.replace("{count}", String(selected.size))}
          desc={t.confirmDeleteBulkDesc.replace("{count}", String(selected.size))}
          confirmLabel={t.deleteAll}
          danger={true}
          onConfirm={() => {
            setUsers(prev => prev.filter(u => !selected.has(u.id)))
            notify("success", "Users deleted", `${selected.size} users removed permanently`)
            clearSel()
            setBulkDeleteTarget(false)
          }}
          onCancel={() => setBulkDeleteTarget(false)}
        />
      )}
      {bulkBlockTarget && (
        <ConfirmDialog
          title={t.confirmBulkStatusTitle.replace("{status}", t.blocked).replace("{count}", String(selected.size))}
          desc={t.confirmBulkStatusDesc.replace("{count}", String(selected.size)).replace("{status}", t.blocked)}
          confirmLabel={t.confirm}
          danger={true}
          onConfirm={() => handleBulkStatus("Blocked")}
          onCancel={() => setBulkBlockTarget(false)}
        />
      )}
      {bulkInactiveTarget && (
        <ConfirmDialog
          title={t.confirmBulkInactiveTitle.replace("{count}", String(selected.size))}
          desc={t.confirmBulkInactiveDesc.replace("{count}", String(selected.size))}
          confirmLabel={t.deactivateAll}
          danger={true}
          onConfirm={() => handleBulkStatus("Inactive")}
          onCancel={() => setBulkInactiveTarget(false)}
        />
      )}

      {/* Category Dialogs */}
      {catDeleteTarget !== null && (
        <ConfirmDialog
          title={t.confirmDeleteTitle.replace("{name}", categories.find(c => c.id === catDeleteTarget)?.title || "")}
          desc={t.confirmDeleteDesc.replace("{name}", categories.find(c => c.id === catDeleteTarget)?.title || "")}
          confirmLabel={t.delete}
          onConfirm={() => handleDeleteCategory(catDeleteTarget)}
          onCancel={() => setCatDeleteTarget(null)}
          danger={true}
        />
      )}
      {bulkCatDeleteTarget && (
        <ConfirmDialog
          title={t.confirmDeleteBulkTitle.replace("{count}", String(selected.size))}
          desc={t.confirmDeleteBulkDesc.replace("{count}", String(selected.size))}
          confirmLabel={t.deleteAll}
          onConfirm={() => {
            setCategories(prev => prev.filter(c => !selected.has(c.id)))
            notify("error", "Categories Deleted", `${selected.size} categories removed permanently`)
            setSelected(new Set())
            setBulkCatDeleteTarget(false)
          }}
          onCancel={() => setBulkCatDeleteTarget(false)}
          danger={true}
        />
      )}
      {bulkCatInactiveTarget && (
        <ConfirmDialog
          title={t.confirmBulkInactiveTitle.replace("{count}", String(selected.size))}
          desc={t.confirmBulkInactiveDesc.replace("{count}", String(selected.size))}
          confirmLabel={t.deactivateAll}
          onConfirm={() => {
            setCategories(prev => prev.map(c => selected.has(c.id) ? { ...c, status: "Inactive" } : c))
            notify("warning", "Categories Deactivated", `${selected.size} categories updated`)
            setSelected(new Set())
            setBulkCatInactiveTarget(false)
          }}
          onCancel={() => setBulkCatInactiveTarget(false)}
          danger={true}
        />
      )}

      {/* Group Dialogs */}
      {groupDeleteTarget !== null && (
        <ConfirmDialog
          title={t.confirmDeleteTitle.replace("{name}", resourceGroups.find(g => g.id === groupDeleteTarget)?.title || "")}
          desc={t.confirmDeleteDesc.replace("{name}", resourceGroups.find(g => g.id === groupDeleteTarget)?.title || "")}
          confirmLabel={t.delete}
          onConfirm={() => handleDeleteGroup(groupDeleteTarget)}
          onCancel={() => setGroupDeleteTarget(null)}
          danger={true}
        />
      )}
      {bulkGroupDeleteTarget && (
        <ConfirmDialog
          title={t.confirmDeleteBulkTitle.replace("{count}", String(selectedGroups.size))}
          desc={t.confirmDeleteBulkDesc.replace("{count}", String(selectedGroups.size))}
          confirmLabel={t.deleteAll}
          onConfirm={() => {
            setResourceGroups(prev => prev.filter(g => !selectedGroups.has(g.id)))
            notify("error", "Groups Deleted", `${selectedGroups.size} groups removed permanently`)
            setSelectedGroups(new Set())
            setBulkGroupDeleteTarget(false)
          }}
          onCancel={() => setBulkGroupDeleteTarget(false)}
          danger={true}
        />
      )}
      {bulkGroupInactiveTarget && (
        <ConfirmDialog
          title={t.confirmBulkInactiveTitle.replace("{count}", String(selectedGroups.size))}
          desc={t.confirmBulkInactiveDesc.replace("{count}", String(selectedGroups.size))}
          confirmLabel={t.deactivateAll}
          onConfirm={() => {
            setResourceGroups(prev => prev.map(g => selectedGroups.has(g.id) ? { ...g, status: "Inactive" } : g))
            notify("warning", "Groups Deactivated", `${selectedGroups.size} groups updated`)
            setSelectedGroups(new Set())
            setBulkGroupInactiveTarget(false)
          }}
          onCancel={() => setBulkGroupInactiveTarget(false)}
          danger={true}
        />
      )}
    </>
  )
}
