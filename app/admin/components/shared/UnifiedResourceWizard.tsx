"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { Search, Plus, Minus, X, Database, Check, ChevronRight, ChevronLeft, Shield, Settings2, Eye, Library, BookOpen, ChevronDown } from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"

export interface UnifiedResourceConfig {
  groups: string[]
  title: string
  publisher: string
  description: string
  coverage: string
  url: string
  endpoint: string
  status: "Active" | "Maintenance" | "Down"
  updatedDate: string
  expiryDate: string
}

export interface UnifiedResourceWizardProps {
  mode: "add" | "edit"
  resourceType: "database" | "journal" | "ebook"
  availableItems?: any[] // for 'add' mode
  initialData?: any // for 'edit' mode
  onClose: () => void
  onSave: (selectedItems: any[], config: UnifiedResourceConfig) => void
}

const AVAILABLE_GROUPS = ["Mahasiswa", "Dosen", "Staff", "Public", "Researchers", "Default"]

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
        zIndex: 99999, // very high due to wizard modal
      })
    }
    setOpen(prev => !prev)
  }

  return (
    <div className="relative">
      <button type="button" ref={triggerRef} onClick={handleToggle} className={`flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-sm font-medium transition-all outline-none ${error ? "border-red-400 bg-red-50 dark:bg-red-500/10" : "border-slate-200 dark:border-slate-800 focus:border-[#2d78f2]"} ${open ? "ring-2 ring-[#2d78f2]/10 border-[#2d78f2] bg-white" : ""} ${!value ? "text-slate-400/80" : "text-slate-700 dark:text-slate-200"}`}>
        <span className="truncate">{value || placeholder}</span> <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-[#2d78f2]" : "text-slate-400"}`} />
      </button>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setOpen(false)} />
          <div style={dropStyle} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-1.5 animate-in fade-in zoom-in-95 duration-150 z-[99999]">
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }} className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-colors ${value === opt ? "bg-[#2d78f2] text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"}`}>
                {opt}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}

export default function UnifiedResourceWizard({
  mode,
  resourceType,
  availableItems = [],
  initialData,
  onClose,
  onSave
}: UnifiedResourceWizardProps) {
  
  const [step, setStep] = useState(mode === "add" ? 1 : 2)
  
  // -- Selection State (Step 1) --
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set(mode === 'edit' && initialData ? [initialData.id] : []))
  
  // -- Config State (Step 2 & 3) --
  const [config, setConfig] = useState<UnifiedResourceConfig>({
    groups: mode === 'edit' && initialData?.groups ? initialData.groups : ["Default"],
    title: initialData?.title || initialData?.name || initialData?.judul || "",
    publisher: initialData?.publisher || initialData?.penerbit || "",
    description: initialData?.description || "",
    coverage: initialData?.coverage || "",
    url: initialData?.url || "",
    endpoint: initialData?.endpoint || "",
    status: initialData?.status || "Active",
    updatedDate: initialData?.updatedDate || initialData?.tanggal || new Date().toISOString().split('T')[0],
    expiryDate: initialData?.expiryDate || initialData?.expiry || "",
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Icon mapping
  const Icon = resourceType === 'database' ? Database : resourceType === 'journal' ? Library : BookOpen
  const typeName = resourceType === 'database' ? 'Database' : resourceType === 'journal' ? 'Journal' : 'eBook'

  const handleNext = () => {
    if (step === 3) {
      // Validate Step 3
      const e: Record<string, boolean> = {}
      if (mode === 'edit' || selectedIds.size === 1) {
        if (!config.title) e.title = true
        if (!config.publisher) e.publisher = true
      }
      if (!config.url) e.url = true
      
      setErrors(e)
      if (Object.keys(e).length > 0) return
    }
    window.scrollTo({top: 0, behavior: 'smooth'})
    setStep(p => p + 1)
  }

  const handleBack = () => {
    if (mode === 'edit' && step === 2) return
    setStep(p => p - 1)
  }

  const submit = () => {
    // If edit, selectedItems has fake obj based on initialData
    let finalItems = []
    if (mode === 'add') {
      finalItems = availableItems.filter(i => selectedIds.has(i.id))
    } else {
      finalItems = [initialData]
    }
    onSave(finalItems, config)
  }

  const getPrimaryText = (item: any) => item.title || item.name || item.judul || "Unknown"
  const getSecondaryText = (item: any) => item.publisher || item.penerbit || item.category || "Unknown"

  // Step renderers
  const renderStepIndicators = () => {
    const steps = [
      { id: 1, name: "Select", icon: Search },
      { id: 2, name: "Assign Group", icon: Shield },
      { id: 3, name: "Configure", icon: Settings2 },
      { id: 4, name: "Review", icon: Eye }
    ]
    
    return (
      <div className="flex items-center justify-center w-full mb-8 pt-4">
        {steps.map((s, i) => {
          if (mode === 'edit' && s.id === 1) return null // Hide select step for edit
          const isPast = step > s.id
          const isActive = step === s.id
          return (
            <React.Fragment key={s.id}>
              {i > 0 && (mode !== 'edit' || i > 1) && (
                <div className={`h-1 w-8 sm:w-16 rounded-full mx-2 transition-colors ${isPast ? 'bg-[#2d78f2]' : 'bg-slate-100 dark:bg-slate-800'}`} />
              )}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-[#2d78f2] text-white shadow-lg shadow-blue-500/30 scale-110' : isPast ? 'bg-[#2d78f2] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {isPast ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[11px] font-bold ${isActive ? 'text-[#2d78f2]' : 'text-slate-400'}`}>{s.name}</span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const renderStep1 = () => {
    const displayAvailable = availableItems.filter(item => {
      if (selectedIds.has(item.id)) return false
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return getPrimaryText(item).toLowerCase().includes(q) || getSecondaryText(item).toLowerCase().includes(q)
    })
    const displaySelected = availableItems.filter(item => selectedIds.has(item.id))

    return (
      <div className="flex flex-col sm:flex-row gap-4 h-[400px] animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 shrink-0">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Available Resources</h4>
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-[#2d78f2]" />
            </div>
            {displayAvailable.length > 0 && <button onClick={() => setSelectedIds(new Set([...Array.from(selectedIds), ...displayAvailable.map(i => i.id)]))} className="text-xs text-[#2d78f2] font-semibold flex items-center gap-1 hover:underline self-start">Select All Filtered</button>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {displayAvailable.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{getPrimaryText(item)}</p>
                  <p className="text-xs text-slate-500 truncate">{getSecondaryText(item)}</p>
                </div>
                <button onClick={() => setSelectedIds(new Set(selectedIds).add(item.id))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-[#2d78f2] group-hover:text-white flex items-center justify-center shrink-0 transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#111827]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 flex justify-between items-center h-[69px]">
            <h4 className="text-sm font-bold text-[#2d78f2]">Selected ({selectedIds.size})</h4>
            {selectedIds.size > 0 && <button onClick={() => setSelectedIds(new Set())} className="text-xs text-red-500 font-semibold hover:underline">Clear All</button>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {displaySelected.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm">No items selected</p>
              </div>
            ) : (
              displaySelected.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-2">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{getPrimaryText(item)}</p>
                  </div>
                  <button onClick={() => { const ns = new Set(selectedIds); ns.delete(item.id); setSelectedIds(ns) }} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center shrink-0"><Minus className="w-4 h-4" /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderStep2 = () => {
    const toggleGroup = (grp: string) => {
      let next = [...config.groups]
      if (next.includes(grp)) next = next.filter(g => g !== grp)
      else next.push(grp)
      setConfig({ ...config, groups: next })
    }

    return (
      <div className="min-h-[300px] flex flex-col justify-center items-center py-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <Shield className="w-16 h-16 text-[#2d78f2]/20 mb-6" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">Assign Access Groups</h3>
        <p className="text-sm text-slate-500 text-center mb-8 max-w-sm">Select which user groups are allowed to access the selected resource(s). If none are selected, it defaults to "Default".</p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg">
          {AVAILABLE_GROUPS.map(grp => {
            const isSelected = config.groups.includes(grp)
            return (
              <button
                key={grp}
                onClick={() => toggleGroup(grp)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${isSelected ? 'bg-[#2d78f2] text-white border-[#2d78f2] shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}
              >
                {grp}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderStep3 = () => {
    const inp = (field: string) => `w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-2.5 outline-none text-sm text-slate-800 dark:text-slate-200 transition-all focus:bg-white ${errors[field] ? "border-red-400 bg-red-50" : "border-slate-200 dark:border-slate-800 focus:border-[#2d78f2] focus:ring-2 focus:ring-[#2d78f2]/10"}`
    const isBulk = mode === 'add' && selectedIds.size > 1
    
    return (
      <div className="h-[450px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-300">
        
        {/* Basic Info */}
        <div className="mb-6 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-[#2d78f2] mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Title {(!isBulk) && '*'}</label>
              <input 
                value={config.title} 
                onChange={e => setConfig({...config, title: e.target.value})} 
                className={inp("title")} 
                placeholder={isBulk ? "Multiple Titles (leave blank to inherit)" : `e.g. Scopus`} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Publisher {(!isBulk) && '*'}</label>
              <input value={config.publisher} onChange={e => setConfig({...config, publisher: e.target.value})} className={inp("publisher")} placeholder={isBulk ? "Inherited" : "e.g. Elsevier"} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Coverage</label>
              <input value={config.coverage} onChange={e => setConfig({...config, coverage: e.target.value})} className={inp("coverage")} placeholder="e.g. Science, Technology" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Description</label>
              <textarea value={config.description} onChange={e => setConfig({...config, description: e.target.value})} className={`${inp("description")} min-h-[80px] resize-none`} placeholder="Optional description..." />
            </div>
          </div>
        </div>

        {/* Access Info & Status */}
        <div className="mb-6 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-[#2d78f2] mb-4">Access & Systems</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Portal URL *</label>
              <input value={config.url} onChange={e => setConfig({...config, url: e.target.value})} className={inp("url")} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Endpoint (Optional)</label>
              <input value={config.endpoint} onChange={e => setConfig({...config, endpoint: e.target.value})} className={inp("endpoint")} placeholder="api.provider.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Status *</label>
              <WizardDropdown 
                value={config.status} 
                placeholder="Select Status"
                options={resourceType === 'database' ? ["Active", "Maintenance", "Down"] : ["Active", "Inactive"]} 
                onChange={v => setConfig({...config, status: v as any})} 
              />
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
          <h4 className="text-sm font-bold text-[#2d78f2] mb-4">Subscription Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Updated Date</label>
              <input type="date" value={config.updatedDate} onChange={e => setConfig({...config, updatedDate: e.target.value})} className={`${inp("updatedDate")} [color-scheme:light] dark:[color-scheme:dark]`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500">Expiry Date</label>
                <button type="button" onClick={() => setConfig({...config, expiryDate: config.expiryDate === 'Lifetime' ? '' : 'Lifetime'})} className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${config.expiryDate === 'Lifetime' ? 'bg-[#2d78f2] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  Lifetime Access
                </button>
              </div>
              {config.expiryDate === 'Lifetime' ? (
                <div className={`${inp("expiryDate")} flex items-center bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed`}>Lifetime</div>
              ) : (
                <input type="date" value={config.expiryDate} onChange={e => setConfig({...config, expiryDate: e.target.value})} className={`${inp("expiryDate")} [color-scheme:light] dark:[color-scheme:dark]`} />
              )}
            </div>
          </div>
        </div>

      </div>
    )
  }

  const renderStep4 = () => {
    return (
      <div className="h-[450px] overflow-y-auto px-2 pb-4 custom-scrollbar animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800/50">
          <Eye className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Review & Finalize</h3>
        
        <div className="w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-4">
          <h4 className="text-sm font-bold text-slate-400 tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Deployment Summary</h4>
          
          <dl className="space-y-4">
            <div className="flex justify-between items-start">
              <dt className="text-sm text-slate-500">Action</dt>
              <dd className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                {mode === 'add' ? `Add ${selectedIds.size} ${typeName}(s)` : `Update 1 ${typeName}`}
              </dd>
            </div>
            <div className="flex justify-between items-start">
              <dt className="text-sm text-slate-500">Access Groups</dt>
              <dd className="text-sm font-bold text-[#2d78f2] text-right flex flex-wrap justify-end gap-1">
                {(config.groups.length > 0 ? config.groups : ["Default"]).map(g => (
                  <span key={g} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800 text-xs">{g}</span>
                ))}
              </dd>
            </div>
            <div className="flex justify-between items-start">
              <dt className="text-sm text-slate-500">Portal Link</dt>
              <dd className="text-sm font-medium text-slate-800 dark:text-slate-200 text-right break-all max-w-[200px]">{config.url}</dd>
            </div>
            <div className="flex justify-between items-start">
              <dt className="text-sm text-slate-500">Status</dt>
              <dd className="text-sm font-bold text-right pt-0.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs border border-transparent ${config.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : config.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {config.status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between items-start pt-2 border-t border-slate-100 dark:border-slate-800">
              <dt className="text-sm text-slate-500">Expiry Config</dt>
              <dd className="text-sm font-medium text-slate-800 dark:text-slate-200 text-right">{config.expiryDate || "Not Set"}</dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-slate-50 dark:bg-[#0f172a] rounded-[2rem] w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-200/50 dark:border-slate-800/80">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d78f2] to-[#2ac9fa] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
                  {mode === 'add' ? `Add New ${typeName}` : `Edit ${typeName}`}
                </h3>
                <p className="text-sm font-medium text-slate-400">Complete the setup process</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 z-10 px-4">
            {renderStepIndicators()}
          </div>

          {/* Content Body */}
          <div className="p-6 relative">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          {/* Footer Controls */}
          <div className="p-5 sm:p-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex justify-between items-center z-10">
            <div className="flex gap-2">
              <button 
                onClick={handleBack} 
                className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${step === 1 || (mode === 'edit' && step === 2) ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            </div>
            
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">Cancel</button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext} 
                  disabled={step === 1 && selectedIds.size === 0}
                  className="px-8 py-2.5 rounded-xl bg-[#2d78f2] text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={submit} 
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Finalize Setup
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </Portal>
  )
}
