"use client"

import React, { useState, useRef } from "react"
import { X, Save, Plus, Minus, CalendarDays, ShieldCheck, Database, Layout, Clock, AlertCircle, Search, ArrowLeft, ChevronRight, CheckCircle2, Shield, Settings2, Eye, Check, Library, BookOpen, ChevronDown } from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"
import { useLanguage } from "@/app/admin/components/providers/language-provider"

interface UserCategory {
  id: number
  title: string
  type: "Student" | "Lecturer" | "Researcher"
  pdfLimit: number
  dataLimit: string
  accessType: "Direct" | "Remote" | "Hybrid"
  expiryDate: string
  groupIds: number[]
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
  { name: "ACM Digital Library", provider: "ACM" },
  { name: "Bloomsbury Collections", provider: "Bloomsbury" },
  { name: "Emerald", provider: "Emerald Publishing" },
  { name: "Gale", provider: "Cengage Learning" },
  { name: "IEEE Xplore Digital Library", provider: "IEEE" },
  { name: "IET Digital Library", provider: "IET" },
  { name: "IGILibrary", provider: "IGI Global" },
  { name: "Inderscience Online", provider: "Inderscience" },
  { name: "Oxford University Press", provider: "Oxford" },
  { name: "ScienceDirect", provider: "Elsevier" },
  { name: "SpringerLink", provider: "Springer Nature" },
  { name: "Taylor & Francis", provider: "Informa" },
  { name: "Wiley Online Library", provider: "Wiley" },
  { name: "JSTOR", provider: "ITHAKA" },
  { name: "Nature", provider: "Springer Nature" }
]

interface Props {
  activeTab: "User Categories" | "eResource Groups"
  initialData?: any
  onClose: () => void
  onSaveCategory: (cat: Partial<UserCategory>) => void
  onSaveGroup: (group: Partial<eResourceGroup>) => void
  resourceGroups: eResourceGroup[]
}

function CalendarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [open, setOpen] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLDivElement>(null)

  const { t } = useLanguage()
  const MONTHS = [t.january, t.february, t.march, t.april, t.may, t.june, t.july, t.august, t.september, t.october, t.november, t.december]
  const MONTHS_SHORT = [t.janShort, t.febShort, t.marShort, t.aprShort, t.mayShort, t.junShort, t.julShort, t.augShort, t.sepShort, t.octShort, t.novShort, t.decShort]
  const DAYS = [t.sunShort, t.monShort, t.tueShort, t.wedShort, t.thuShort, t.friShort, t.satShort]
  const YEARS = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 5 + i)

  const CALENDAR_HEIGHT = 280

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const showAbove = spaceBelow < CALENDAR_HEIGHT && rect.top > CALENDAR_HEIGHT
      setDropStyle({
        position: 'fixed',
        top: showAbove ? rect.top - CALENDAR_HEIGHT - 6 : rect.bottom + 6,
        left: rect.left,
        width: 240,
        zIndex: 99999,
      })
    }
    setOpen(prev => !prev)
    setShowMonthPicker(false)
    setShowYearPicker(false)
  }

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const selectDay = (day: number) => {
    const d = new Date(viewDate.year, viewDate.month, day)
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
    onChange(`${y}-${m}-${dd}`)
    setOpen(false)
  }

  const handleToday = () => {
    const d = today
    const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
    onChange(`${y}-${m}-${dd}`)
    setViewDate({ year: today.getFullYear(), month: today.getMonth() })
    setOpen(false)
  }

  const handleClear = () => { onChange(""); setOpen(false) }

  const displayValue = value ? new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month)
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month)
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const isToday = (day: number) => today.getFullYear() === viewDate.year && today.getMonth() === viewDate.month && today.getDate() === day
  const isSelected = (day: number) => {
    if (!value) return false
    const d = new Date(value + 'T00:00:00')
    return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month && d.getDate() === day
  }

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={handleToggle} className={`flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl px-5 py-4 text-sm font-medium transition-all cursor-pointer ${open ? 'border-[#2d78f2]' : 'border-slate-200 dark:border-slate-800'}`}>
        <span className={displayValue ? 'text-slate-800 dark:text-white' : 'text-slate-400'}>{displayValue || 'dd/mm/yyyy'}</span>
        <CalendarDays className={`w-4 h-4 transition-colors ${open ? 'text-[#2d78f2]' : 'text-slate-400'}`} />
      </div>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setOpen(false)} />
          <div 
            style={{...dropStyle, width: 240}} 
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 animate-in fade-in zoom-in-95 duration-150 z-[99999]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {/* Month selector */}
                <div className="relative">
                  <button
                    onClick={e => { e.stopPropagation(); setShowMonthPicker(p => !p); setShowYearPicker(false) }}
                    className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#2d78f2] transition-colors flex items-center gap-0.5"
                  >
                    {MONTHS_SHORT[viewDate.month]} <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
                  </button>
                  {showMonthPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 z-10 w-[168px] grid grid-cols-3 gap-1">
                      {MONTHS_SHORT.map((m, i) => (
                        <button key={m} onClick={e => { e.stopPropagation(); setViewDate(v => ({...v, month: i})); setShowMonthPicker(false) }}
                          className={`text-[11px] font-medium py-1.5 rounded-lg transition-colors ${viewDate.month === i ? 'bg-[#2d78f2] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >{m}</button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Year selector */}
                <div className="relative">
                  <button
                    onClick={e => { e.stopPropagation(); setShowYearPicker(p => !p); setShowMonthPicker(false) }}
                    className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#2d78f2] transition-colors flex items-center gap-0.5"
                  >
                    {viewDate.year} <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} />
                  </button>
                  {showYearPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 z-10 w-[80px] max-h-[160px] overflow-y-auto custom-scrollbar">
                      {YEARS.map(y => (
                        <button key={y} onClick={e => { e.stopPropagation(); setViewDate(v => ({...v, year: y})); setShowYearPicker(false) }}
                          className={`w-full text-[11px] font-medium py-1.5 rounded-lg transition-colors text-center ${viewDate.year === y ? 'bg-[#2d78f2] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >{y}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5">
                <button onClick={e => { e.stopPropagation(); setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }) }} className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs">‹</button>
                <button onClick={e => { e.stopPropagation(); setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }) }} className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs">›</button>
              </div>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-0.5">
              {DAYS.map(d => <div key={d} className="text-center text-[9px] font-semibold text-slate-400 py-0.5">{d}</div>)}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, i) => (
                <div key={i} className="flex items-center justify-center py-0.5">
                  {day ? (
                    <button
                      onClick={e => { e.stopPropagation(); selectDay(day) }}
                      className={`w-6 h-6 rounded-full text-[11px] font-medium transition-colors ${
                        isSelected(day) ? 'bg-[#2d78f2] text-white'
                          : isToday(day) ? 'border border-[#2d78f2] text-[#2d78f2] hover:bg-[#2d78f2]/10'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >{day}</button>
                  ) : <span />}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={e => { e.stopPropagation(); handleClear() }} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t.clear}</button>
              <button onClick={e => { e.stopPropagation(); handleToday() }} className="text-[11px] font-medium text-[#2d78f2] hover:opacity-70 transition-colors">{t.today}</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

function WizardDropdown({ value, placeholder, options, onChange, error }: { value: string; placeholder: string; options: string[]; onChange: (v: string) => void; error?: boolean }) {
  const [open, setOpen] = useState(false)
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      })
    }
    setOpen(prev => !prev)
  }

  return (
    <div className="relative">
      <button 
        type="button" 
        ref={triggerRef} 
        onClick={handleToggle} 
        className={`flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900 border rounded-2xl px-5 py-4 text-sm font-medium transition-all outline-none ${error ? "border-red-400 bg-red-50" : "border-slate-200 dark:border-slate-800 focus:border-[#2d78f2]"} ${open ? "border-[#2d78f2] bg-white" : ""} ${!value ? "text-slate-400" : "text-slate-800 dark:text-white"}`}
      >
        <span className="truncate">{value || placeholder}</span> 
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-[#2d78f2]" : "text-slate-400"}`} />
      </button>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setOpen(false)} />
          <div style={dropStyle} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-1.5 animate-in fade-in zoom-in-95 duration-150 z-[99999]">
            {options.map(opt => (
              <button 
                key={opt} 
                type="button" 
                onClick={() => { onChange(opt); setOpen(false) }} 
                className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-colors ${value === opt ? "bg-[#2d78f2] text-white font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}

export default function AccessManagementModal({ activeTab, initialData, onClose, onSaveCategory, onSaveGroup, resourceGroups }: Props) {
  const { t } = useLanguage()
  const isEdit = !!initialData
  const [currentStep, setCurrentStep] = useState(isEdit ? 3 : 1)
  
  // Category Form State
  const [catTitle, setCatTitle] = useState(initialData?.title || "")
  const [catType, setCatType] = useState<string>(initialData?.type || "")
  const [pdfLimit, setPdfLimit] = useState(initialData?.pdfLimit || 50)
  const [catExpiry, setCatExpiry] = useState(initialData?.expiryDate || "")
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(initialData?.groupIds || [])

  // Group Form State
  const [groupTitle, setGroupTitle] = useState(initialData?.title || "")
  const [groupExpiry, setGroupExpiry] = useState(initialData?.expiryDate || "")
  const [selectedDBs, setSelectedDBs] = useState<string[]>(initialData?.databases || [])
  const [dbSearch, setDbSearch] = useState("")

  const handleSave = () => {
    if (activeTab === "User Categories") {
      onSaveCategory({ title: catTitle, type: catType, pdfLimit, expiryDate: catExpiry, groupIds: selectedGroupIds })
    } else {
      onSaveGroup({ title: groupTitle, expiryDate: groupExpiry, databases: selectedDBs })
    }
  }

  const toggleDB = (db: string) => {
    setSelectedDBs(prev => prev.includes(db) ? prev.filter(d => d !== db) : [...prev, db])
  }

  const STEPS = [
    { id: 1, label: t.select, icon: activeTab === "User Categories" ? Library : Database },
    { id: 2, label: t.configure, icon: Settings2 },
    { id: 3, label: t.review, icon: Eye }
  ]

  const isNextDisabled = () => {
    if (currentStep === 1) {
      return activeTab === "User Categories" ? selectedGroupIds.length === 0 : selectedDBs.length === 0
    }
    if (currentStep === 2) {
      return activeTab === "User Categories" ? !catTitle : !groupTitle
    }
    return false
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
        
        <div className="relative bg-slate-50 dark:bg-[#0f172a] w-full max-w-4xl rounded-[2rem] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200/50 dark:border-slate-800/80 h-[85vh]">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-900 p-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/80 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d78f2] to-[#2ac9fa] flex items-center justify-center">
                {activeTab === "User Categories" ? <Library className="text-white w-6 h-6" /> : <Database className="text-white w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-xl text-slate-800 dark:text-white tracking-tight">
                  {isEdit ? t.edit : t.addNew} {activeTab === "User Categories" ? t.userCategory : t.eResourceGroup}
                </h3>
                <p className="text-sm font-medium text-slate-400">{t.completeSetupProcess}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper UI (Exact match) */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center justify-center w-full py-6">
              {STEPS.map((s, i) => {
                const isPast = currentStep > s.id
                const isActive = currentStep === s.id
                return (
                  <React.Fragment key={s.id}>
                    {i > 0 && (
                      <div className={`h-1 w-16 rounded-full mx-2 transition-colors ${isPast ? 'bg-[#2d78f2]' : 'bg-slate-100 dark:bg-slate-800'}`} />
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${isActive ? 'bg-[#2d78f2] text-white scale-110' : isPast ? 'bg-[#2d78f2] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {isPast ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-[11px] font-semibold tracking-wider ${isActive ? 'text-[#2d78f2]' : 'text-slate-400'}`}>{s.label}</span>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Wizard Body */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            
            {/* STEP 1: SELECT */}
            {currentStep === 1 && (
              <div className="flex flex-col sm:flex-row gap-4 h-[420px] animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Left Panel */}
                <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 shrink-0">
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {activeTab === "User Categories" ? t.eResourceGroupInfo : t.availableResources}
                      </h4>
                      {((activeTab === "User Categories" && selectedGroupIds.length === 0) || (activeTab === "eResource Groups" && selectedDBs.length === 0)) && (
                        <span className="text-[11px] text-rose-500 font-medium leading-tight text-right flex-1">{t.pleaseSelectAtLeastOne.replace("{item}", activeTab === "User Categories" ? t.eResourceGroup : t.resource)}</span>
                      )}
                    </div>
                    <div className="relative group">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" placeholder={activeTab === "User Categories" ? t.searchGroupPlaceholder : t.searchPlaceholder} value={dbSearch} onChange={e => setDbSearch(e.target.value)} 
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#2d78f2]" 
                      />
                    </div>
                    <button onClick={() => activeTab === "User Categories" ? setSelectedGroupIds(resourceGroups.map(g => g.id)) : setSelectedDBs(AVAILABLE_DATABASES.map(d => d.name))} className="text-xs text-[#2d78f2] font-semibold flex items-center gap-1 hover:underline self-start">{t.selectAll}</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                    {(activeTab === "User Categories" ? resourceGroups.filter(g => !selectedGroupIds.includes(g.id)) : AVAILABLE_DATABASES.filter(d => !selectedDBs.includes(d.name))).filter(item => (item.name || (item as any).title).toLowerCase().includes(dbSearch.toLowerCase())).map(item => (
                      <div key={item.id || (item as any).name} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name || (item as any).title}</p>
                          <p className="text-xs text-slate-500 truncate">{(item as any).provider || (item as any).databases?.length + " Databases"}</p>
                        </div>
                        <button onClick={() => activeTab === "User Categories" ? setSelectedGroupIds([...selectedGroupIds, item.id]) : toggleDB(item.name)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-[#2d78f2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 flex justify-between items-center h-[69px]">
                    <h4 className="text-sm font-semibold text-[#2d78f2]">{t.selected} ({activeTab === "User Categories" ? selectedGroupIds.length : selectedDBs.length})</h4>
                    {(activeTab === "User Categories" ? selectedGroupIds : selectedDBs).length > 0 && (
                      <button onClick={() => activeTab === "User Categories" ? setSelectedGroupIds([]) : setSelectedDBs([])} className="text-xs text-rose-500 font-semibold hover:underline">{t.clearAll}</button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin bg-slate-50/30 dark:bg-transparent">
                    {(activeTab === "User Categories" ? selectedGroupIds : selectedDBs).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <p className="text-sm">{t.noItemsSelected}</p>
                      </div>
                    ) : (
                      (activeTab === "User Categories" ? resourceGroups.filter(g => selectedGroupIds.includes(g.id)) : selectedDBs).map(item => (
                        <div key={item.id || item} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-2">
                          <div className="min-w-0 pr-2">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.title || item}</p>
                          </div>
                          <button onClick={() => activeTab === "User Categories" ? setSelectedGroupIds(selectedGroupIds.filter(id => id !== item.id)) : toggleDB(item)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white flex items-center justify-center shrink-0 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CONFIGURE */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-8">
                  <h4 className="text-sm font-semibold text-[#2d78f2] border-b border-slate-50 dark:border-slate-800 pb-4">Basic Information</h4>
                  
                  <div className="space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-semibold text-slate-500">{t.title} *</label>
                        {((activeTab === "User Categories" && !catTitle) || (activeTab === "eResource Groups" && !groupTitle)) && (
                          <span className="text-[11px] text-[#f43f5e] font-medium lowercase">{t.titleRequired}</span>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={activeTab === "User Categories" ? catTitle : groupTitle} 
                        onChange={e => activeTab === "User Categories" ? setCatTitle(e.target.value) : setGroupTitle(e.target.value)}
                        placeholder={activeTab === "User Categories" ? t.categoryPlaceholder : t.groupPlaceholder}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-800 dark:text-white outline-none focus:border-[#2d78f2] transition-all"
                      />
                    </div>

                    {activeTab === "User Categories" && (
                      <>
                        {/* PDF Limit Field */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-medium text-slate-500">PDF limit per user</label>
                          <div className="relative group">
                            <input 
                              type="number" 
                              placeholder="Optional limit"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-800 dark:text-white outline-none focus:border-[#2d78f2] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center">
                              <div className="relative group/tooltip">
                                <AlertCircle className="w-5 h-5 text-slate-400 cursor-help hover:text-[#2d78f2] transition-colors" />
                                <div className="absolute bottom-full right-0 mb-3 w-72 p-4 bg-[#2d78f2] text-white text-[11px] leading-relaxed rounded-[20px] opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-2xl translate-y-1 group-hover/tooltip:translate-y-0 border border-white/5">
                                  <p>{t.pdfLimitNote}</p>
                                  <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-[#2d78f2]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type Field */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-medium text-slate-500">{t.type} *</label>
                          <WizardDropdown 
                            value={catType}
                            placeholder={t.userCategory}
                            options={["Researcher", "Staff", "Others", "Student"]}
                            onChange={setCatType}
                          />
                        </div>
                      </>
                    )}

                    {/* Expiry Date Field */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-slate-500">{t.expiryDate}</label>
                      <CalendarPicker
                        value={activeTab === "User Categories" ? catExpiry : groupExpiry}
                        onChange={activeTab === "User Categories" ? setCatExpiry : setGroupExpiry}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {currentStep === 3 && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800/50">
                  <Eye className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-8 tracking-tight">{t.reviewFinalize}</h3>
                
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] rounded-b-full" />
                  <h4 className="text-[11px] font-semibold text-slate-400 tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-3">{t.deploymentSummary}</h4>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">{t.action}</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{t.addXitems.replace("{count}", String(activeTab === "User Categories" ? selectedGroupIds.length : selectedDBs.length)).replace("{item}", activeTab === "User Categories" ? t.categories : t.databases)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">{t.accessGroups}</span>
                      <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#2d78f2] font-semibold text-[11px]">{t.default}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">{t.portalUrl}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">dadadadadas</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">{t.status}</span>
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 font-semibold text-[11px]">{t.active}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-50 dark:border-slate-800">
                      <span className="font-semibold text-slate-500">{t.expiryConfig}</span>
                      <span className="font-semibold text-slate-400 italic">{t.notSet}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer (Exact match) */}
          <div className="p-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
            <div className="flex items-center">
              {currentStep > 1 && (
                <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-sm transition-all flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </button>
              )}
            </div>
            
            <div className="flex gap-3 items-center">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-sm transition-colors">{t.cancel}</button>
              <button 
                onClick={() => currentStep < 3 ? setCurrentStep(prev => prev + 1) : handleSave()}
                disabled={isNextDisabled()}
                className="bg-[#2d78f2] text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {currentStep === 3 ? t.finalizeSetup : t.continue}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}
