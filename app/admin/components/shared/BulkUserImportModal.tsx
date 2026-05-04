"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { 
  X, UserPlus, Info, CheckCircle2, AlertCircle, 
  Trash2, Upload, FileText, ChevronDown, 
  Mail, CalendarDays, GraduationCap, Building2, User,
  HelpCircle, MoreVertical, SortAsc, HelpCircleIcon
} from "lucide-react"
import Portal from "./Portal"
import { UserStatus } from "./StatusBadge"

interface ImportEntry {
  id: string
  email: string
  fullName: string
  nim: string
  category: string
  expiryDate: string
  status: 'blue' | 'yellow' | 'red' | 'green' | 'idle'
  message?: string
}

interface BulkUserImportModalProps {
  onClose: () => void
  onSave: (users: any[]) => void
  roleOptions: { value: string; label: string }[]
  existingUsers: { email: string }[]
  isAdminMode?: boolean
}

export default function BulkUserImportModal({ 
  onClose, 
  onSave, 
  roleOptions,
  existingUsers,
  isAdminMode = false
}: BulkUserImportModalProps) {
  const [entries, setEntries] = useState<ImportEntry[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      email: "",
      fullName: "",
      nim: "",
      category: "",
      expiryDate: "",
      status: 'idle'
    }))
  )

  const [options, setOptions] = useState({
    sendWelcome: true,
    replaceCategory: false
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [sortConfig, setSortConfig] = useState({ field: "email", order: "asc" })

  const handleSort = () => {
    setEntries(prev => {
      const sorted = [...prev].sort((a, b) => {
        const valA = (a as any)[sortConfig.field]?.toLowerCase() || ""
        const valB = (b as any)[sortConfig.field]?.toLowerCase() || ""
        if (valA < valB) return sortConfig.order === "asc" ? -1 : 1
        if (valA > valB) return sortConfig.order === "asc" ? 1 : -1
        return 0
      })
      return sorted
    })
  }

  // Validation Logic
  const validateRow = useCallback((row: Partial<ImportEntry>) => {
    if (!row.email && !row.fullName) return 'idle'
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!row.email || !emailRegex.test(row.email)) return 'red'

    // Check if already exists
    const exists = existingUsers.some(u => u.email.toLowerCase() === row.email?.toLowerCase())
    if (exists) return 'yellow'

    // Check if duplicate in current list (excluding itself)
    const dupeInList = entries.some(e => e.id !== row.id && e.email.toLowerCase() === row.email?.toLowerCase() && e.email !== "")
    if (dupeInList) return 'yellow'

    // If mandatory fields present
    if (row.email && row.fullName) return 'blue'
    
    return 'idle'
  }, [existingUsers, entries])

  const updateEntry = (id: string, updates: Partial<ImportEntry>) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const updated = { ...e, ...updates }
      return { ...updated, status: validateRow(updated) }
    }))
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text")
    if (!text) return

    const lines = text.trim().split(/\r?\n/)
    const newEntries: ImportEntry[] = lines.map(line => {
      const cols = line.split("\t")
      const entry: Partial<ImportEntry> = {
        id: Math.random().toString(36).substr(2, 9),
        email: cols[0]?.trim() || "",
        fullName: cols[1]?.trim() || "",
        nim: cols[2]?.trim() || "",
        category: cols[4]?.trim() || "",
        expiryDate: cols[5]?.trim() || "",
      }
      return { ...entry, status: validateRow(entry) } as ImportEntry
    })

    // If the first row was empty, replace it
    setEntries(prev => {
      const filtered = prev.filter(p => !p.email && !p.fullName)
      if (filtered.length === prev.length) return [...newEntries, ...Array.from({ length: 3 }, () => ({ id: Math.random().toString(36).substr(2, 9), email: "", fullName: "", category: "", expiryDate: "", status: 'idle' as const }))]
      return [...prev.filter(p => p.email || p.fullName), ...newEntries]
    })
  }

  const handleImport = async () => {
    const validOnes = entries.filter(e => e.status === 'blue')
    if (validOnes.length === 0) {
      alert("No valid users to import. Please check rows with red status.")
      return
    }

    setIsProcessing(true)
    
    // Simulate processing for visual effect
    await new Promise(r => setTimeout(r, 1000))

    const usersToSave = validOnes.map(e => ({
      id: Date.now() + Math.random(),
      nama: e.fullName,
      email: e.email,
      nim: e.nim,
      role: e.category || "Staff",
      status: "Active" as UserStatus,
      lastAccess: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
      expiryDate: e.expiryDate,
    }))

    // Show Green for valid ones
    setEntries(prev => prev.map(e => e.status === 'blue' ? { ...e, status: 'green' } : e))
    
    await new Promise(r => setTimeout(r, 500))
    
    onSave(usersToSave)
    setIsProcessing(false)
  }

  const addRow = () => {
    setEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      email: "",
      fullName: "",
      nim: "",
      category: "",
      expiryDate: "",
      status: 'idle'
    }])
  }

  // ─── Custom Grid Dropdown ────────────────────────────────────────────────────────
  function GridDropdown({ value, options, onChange, placeholder, showChevron, className }: {
    value: string
    options: { value: string; label: string }[]
    onChange: (v: string) => void
    placeholder: string
    showChevron?: boolean
    className?: string
  }) {
    const [open, setOpen] = useState(false)
    const [style, setStyle] = useState<React.CSSProperties>({})
    const trigRef = useRef<HTMLButtonElement>(null)

    const handleToggle = () => {
      if (!open && trigRef.current) {
        const r = trigRef.current.getBoundingClientRect()
        setStyle({ position: "fixed", top: r.bottom + 4, left: r.left, minWidth: r.width, zIndex: 9999 })
      }
      setOpen(p => !p)
    }

    const sel = options.find(o => o.value === value)

    return (
      <>
        <button 
          ref={trigRef} 
          onClick={handleToggle}
          className={`px-4 flex items-center justify-between text-sm transition-all outline-none group
            ${className || "w-full h-11 hover:bg-slate-50 dark:hover:bg-slate-800/40"}
            ${open ? "bg-white dark:bg-slate-900 border-blue-400 ring-2 ring-blue-400 z-10" : "bg-transparent"}
            ${!value ? "text-slate-400" : "text-slate-600 dark:text-slate-300"}`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate text-xs font-semibold">{sel?.label || placeholder}</span>
          </div>
          {showChevron && (
            <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ml-2 ${open ? "rotate-180 text-blue-500" : "text-slate-400"}`} />
          )}
        </button>
        {open && (
          <Portal>
            <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
            <div style={style} className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2
                    ${value === opt.value ? "bg-blue-500 text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </Portal>
        )}
      </>
    )
  }

  const StatusIcon = ({ status }: { status: ImportEntry['status'] }) => {
    if (status === 'idle') return <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-800" />
    if (status === 'blue') return <div className="w-5 h-5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40 animate-pulse" title="Valid & Ready to Save" />
    if (status === 'yellow') return <div className="w-5 h-5 rounded-full bg-amber-400 shadow-sm shadow-amber-500/40" title="User Already Added" />
    if (status === 'red') return <div className="w-5 h-5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/40" title="Invalid Information" />
    if (status === 'green') return <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
    return null
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-[#f8f9fc] dark:bg-[#0f172a] rounded-[32px] w-full max-w-6xl shadow-2xl border border-white/20 dark:border-slate-800/50 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowHelp(true)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"
                title="Help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-500 tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">Batch Processing</span>
                 </div>
                 <h3 className="font-bold text-xl text-slate-800 dark:text-white">Import Users List</h3>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden lg:flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${options.sendWelcome ? "bg-blue-500 border-blue-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"}`}>
                       {options.sendWelcome && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={options.sendWelcome} onChange={() => setOptions(o => ({...o, sendWelcome: !o.sendWelcome}))} />
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">Should send welcome email?</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${options.replaceCategory ? "bg-blue-500 border-blue-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"}`}>
                       {options.replaceCategory && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={options.replaceCategory} onChange={() => setOptions(o => ({...o, replaceCategory: !o.replaceCategory}))} />
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">Should replace user category?</span>
                  </label>
               </div>
               
               <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2" />

               <div className="flex items-center gap-3">
                   <div className="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <GridDropdown 
                        value={sortConfig.field}
                        options={[
                          { value: "email", label: "Email" },
                          { value: "fullName", label: "Full Name" },
                          { value: "category", label: "Category" }
                        ]}
                        placeholder="Field"
                        showChevron={true}
                        className="h-8 w-full"
                        onChange={v => setSortConfig(s => ({...s, field: v}))}
                      />
                   </div>
                   <div className="w-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                      <GridDropdown 
                        value={sortConfig.order}
                        options={[
                          { value: "asc", label: "Ascending" },
                          { value: "desc", label: "Descending" }
                        ]}
                        placeholder="Order"
                        showChevron={true}
                        className="h-8 w-full"
                        onChange={v => setSortConfig(s => ({...s, order: v}))}
                      />
                   </div>
                   <button onClick={handleSort} className="bg-[#334155] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors active:scale-95 shadow-sm">Sort</button>
               </div>

              <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 overflow-auto bg-white dark:bg-[#0f172a] p-1 shadow-inner relative">
            <table className="w-full text-left text-sm border-collapse table-fixed min-w-[800px]">
              <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 shadow-sm shrink-0">
                <tr>
                  <th className="w-12 px-2 py-3.5 border-b border-slate-100 dark:border-slate-800"></th>
                  <th className="w-12 font-bold text-slate-400 dark:text-slate-600 px-4 py-3.5 border-b border-r border-slate-100 dark:border-slate-800 text-center">#</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 border-b border-r border-slate-100 dark:border-slate-800 tracking-wider text-[11px]">Email</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 border-b border-r border-slate-100 dark:border-slate-800 tracking-wider text-[11px]">Full Name</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 border-b border-r border-slate-100 dark:border-slate-800 tracking-wider text-[11px]">ID Number</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 border-b border-r border-slate-100 dark:border-slate-800 tracking-wider text-[11px]">User Category</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 tracking-wider text-[11px]">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900/40">
                {entries.map((entry) => (
                  <tr key={entry.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-4 w-12">
                      <div className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse
                        ${entry.status === 'green'  ? 'bg-emerald-500 shadow-emerald-500/20' : 
                          entry.status === 'yellow' ? 'bg-amber-500 shadow-amber-500/20' : 
                          entry.status === 'red'    ? 'bg-rose-500 shadow-rose-500/20' : 
                          entry.status === 'blue'   ? 'bg-[#2d78f2] shadow-[#2d78f2]/20' : 
                          'bg-slate-200 dark:bg-slate-700'}`} 
                      />
                    </td>
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-0 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:z-10 bg-inherit">
                       <input 
                         type="email" 
                         value={entry.email} 
                         onChange={(e) => updateEntry(entry.id, { email: e.target.value })}
                         placeholder="email@example.com"
                         className="w-full h-11 px-4 bg-transparent outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                       />
                    </td>
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-0 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:z-10 bg-inherit">
                       <input 
                         type="text" 
                         value={entry.fullName} 
                         onChange={(e) => updateEntry(entry.id, { fullName: e.target.value })}
                         placeholder="Full Name"
                         className="w-full h-11 px-4 bg-transparent outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                       />
                    </td>
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-0 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:z-10 bg-inherit">
                       <input 
                         type="text" 
                         value={entry.nim} 
                         onChange={(e) => updateEntry(entry.id, { nim: e.target.value })}
                         placeholder="NIM"
                         className="w-full h-11 px-4 bg-transparent outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                       />
                    </td>
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-0 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:z-10 bg-inherit min-w-[140px]">
                      <GridDropdown 
                        value={entry.category} 
                        options={roleOptions} 
                        onChange={(v) => updateEntry(entry.id, { category: v })} 
                      />
                    </td>
                    <td className="border-b border-slate-50 dark:border-slate-800/60 p-0 overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:z-10 bg-inherit">
                       <input 
                         type="date"
                         value={entry.expiryDate} 
                         onChange={(e) => updateEntry(entry.id, { expiryDate: e.target.value })}
                         className="w-full h-11 px-6 bg-transparent outline-none text-slate-600 dark:text-slate-300 appearance-none"
                       />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={addRow}
              className="w-full py-4 text-slate-400 hover:text-[#2d78f2] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-semibold flex items-center justify-center gap-2 border-b border-slate-50 dark:border-slate-800/60"
            >
              <UserPlus className="w-4 h-4" /> Add more rows
            </button>
          </div>

          {/* Legend Footer */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
             <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                   <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Processing complete</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                   <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Invalid Information</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                   <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Valid User details, ready to save</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                   <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Already added in institute</span>
                </div>
                
                <div className="ml-auto flex gap-4">
                  <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white transition-all active:scale-95">Cancel</button>
                  <button 
                    disabled={isProcessing || entries.every(e => e.status !== 'blue')}
                    onClick={handleImport} 
                    className={`px-10 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2
                      ${entries.some(e => e.status === 'blue') ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-600/20 hover:opacity-90" : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"}`}
                  >
                    {isProcessing ? "Processing..." : "Save Users"}
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
           <Portal>
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                 <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                    <div className="p-6 bg-blue-500 flex justify-between items-center">
                       <h3 className="font-bold text-white text-lg">How to Import users list?</h3>
                       <button onClick={() => setShowHelp(false)} className="text-white hover:opacity-70 transition-opacity"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-8 space-y-5">
                       <ul className="space-y-4">
                          <li className="flex items-start gap-4">
                             <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                             <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Download the sample file.</p>
                          </li>
                          <li className="flex items-start gap-4">
                             <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                             <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Enter the required data (Email is a mandatory field)</p>
                          </li>
                          <li className="flex items-start gap-4">
                             <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                             <div className="space-y-2">
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Please note:</p>
                                <ul className="space-y-1.5 ml-1">
                                   <li className="text-[13px] text-slate-500 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> In case "User Category" field is left blank, The System will assign the "Default" User category to the User.
                                   </li>
                                   <li className="text-[13px] text-slate-500 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Make sure you create User Categories before entering/pasting to the provided sheet.
                                   </li>
                                </ul>
                             </div>
                          </li>
                          <li className="flex items-start gap-4">
                             <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                             <p className="text-sm text-slate-600 dark:text-slate-400 font-medium font-bold">Once your sheet is ready, please copy/paste the sheet here.</p>
                          </li>
                       </ul>
                    </div>
                 </div>
              </div>
           </Portal>
        )}
      </div>

      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </Portal>
  )
}
