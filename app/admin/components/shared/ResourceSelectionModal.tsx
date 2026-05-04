"use client"

import React, { useState, useMemo } from "react"
import { Search, Plus, Minus, X, Database, Check } from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"

export interface SelectionItem {
  id: number | string
  [key: string]: any
}

interface ResourceSelectionModalProps {
  title: string
  icon?: React.ElementType
  availableItems: SelectionItem[]
  getPrimaryText: (item: SelectionItem) => string
  getSecondaryText: (item: SelectionItem) => string
  onClose: () => void
  onSave: (selectedItems: SelectionItem[]) => void
}

export default function ResourceSelectionModal({
  title,
  icon: Icon = Database,
  availableItems,
  getPrimaryText,
  getSecondaryText,
  onClose,
  onSave
}: ResourceSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())

  const handleAdd = (id: number | string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const handleRemove = (id: number | string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleSave = () => {
    const selected = availableItems.filter(item => selectedIds.has(item.id))
    onSave(selected)
  }

  // Filter available items based on search query and whether they are already selected
  const displayAvailable = useMemo(() => {
    const unselected = availableItems.filter(item => !selectedIds.has(item.id))
    if (!searchQuery) return unselected
    const q = searchQuery.toLowerCase()
    return unselected.filter(item => 
      getPrimaryText(item).toLowerCase().includes(q) || 
      getSecondaryText(item).toLowerCase().includes(q)
    )
  }, [availableItems, selectedIds, searchQuery, getPrimaryText, getSecondaryText])

  const displaySelected = useMemo(() => {
    return availableItems.filter(item => selectedIds.has(item.id))
  }, [availableItems, selectedIds])

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] w-full max-w-[850px] h-[85vh] sm:h-[650px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2d78f2]/10 flex items-center justify-center border border-[#2d78f2]/20">
                <Icon className="w-6 h-6 text-[#2d78f2]" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">{title}</h3>
                <p className="text-sm font-medium text-slate-400">Select and assign multiple items seamlessly</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content: Dual List */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-slate-50/50 dark:bg-[#0f172a]">
            
            {/* Left Panel: Available Items */}
            <div className="flex-1 flex flex-col border-r border-slate-100 dark:border-slate-800/80 w-full sm:w-1/2">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Available Repertoir</h4>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">{displayAvailable.length} items</span>
                </div>
                <div className="relative group">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#2d78f2] transition-colors" />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    placeholder="Search directory..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-[#2d78f2] focus:ring-2 focus:ring-[#2d78f2]/10 transition-all" 
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {displayAvailable.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Search className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">No results found</p>
                  </div>
                ) : (
                  displayAvailable.map(item => (
                    <div 
                      key={item.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                    >
                      <div className="min-w-0 pr-4 mb-2 sm:mb-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{getPrimaryText(item)}</p>
                        <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{getSecondaryText(item)}</p>
                      </div>
                      <button 
                        onClick={() => handleAdd(item.id)}
                        className="shrink-0 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-[#2d78f2] group-hover:text-white transition-colors flex items-center justify-center self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Selected Items */}
            <div className="flex-1 flex flex-col w-full sm:w-1/2 bg-white/30 dark:bg-slate-900/10">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center justify-between h-[52px]">
                  <h4 className="text-sm font-bold text-[#2d78f2] flex items-center gap-2">
                    <Check className="w-4 h-4" /> Selected Items
                  </h4>
                  {selectedIds.size > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#2d78f2]/10 text-[11px] font-bold text-[#2d78f2]">
                      {selectedIds.size} assigned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {displaySelected.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 px-8 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Plus className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-[15px] font-bold text-slate-600 dark:text-slate-300">No items selected</p>
                    <p className="text-xs mt-1.5 leading-relaxed">Search and click the + icon on the left panel to assign items to this batch.</p>
                  </div>
                ) : (
                  displaySelected.map(item => (
                    <div 
                      key={item.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-[#2d78f2]/5 border border-[#2d78f2]/20 hover:border-red-200 dark:hover:border-red-900/50 transition-all animate-in slide-in-from-left-2 duration-200"
                    >
                      <div className="min-w-0 pr-4 mb-2 sm:mb-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{getPrimaryText(item)}</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{getSecondaryText(item)}</p>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="shrink-0 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center self-start sm:self-auto"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900/80 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 w-full sm:w-auto text-center sm:text-left">
              Review your selection before saving.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={onClose} 
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={selectedIds.size === 0}
                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              >
                Save {selectedIds.size > 0 && `(${selectedIds.size})`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Portal>
  )
}
