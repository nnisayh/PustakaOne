"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import {
  RefreshCw, Plus, ExternalLink, CheckSquare, Square, 
  Trash2, Pencil, Search, ChevronDown, ChevronUp,
  CheckCircle2, Database as DatabaseIcon, ChevronLeft, 
  ChevronRight, ToggleLeft, ToggleRight, X,
  Loader2, AlertCircle, AlertTriangle, Download, BookOpen, Library
} from "lucide-react"
import { healthCheckData, mockJournals, mockJournalItems, mockEbooks, availableDatabases, availableJournalItems, availableEbookItems } from "@/app/admin/lib/mock-data"
import Portal from "@/app/admin/components/shared/Portal"
import ConfirmDialog from "@/app/admin/components/shared/ConfirmDialog"
import MultiSelectFilter from "@/app/admin/components/shared/MultiSelectFilter"
import FilterChips from "@/app/admin/components/shared/FilterChips"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import DatabaseDetailDrawer from "@/app/admin/components/shared/DatabaseDetailDrawer"
import UnifiedResourceWizard, { UnifiedResourceConfig } from "@/app/admin/components/shared/UnifiedResourceWizard"
import { useSearchParams } from "next/navigation"

// ─── Types ───
type DBStatus = "Active" | "Maintenance" | "Down" | "Inactive"
interface Journal { id: number; name: string; category: string; url: string; accessMethod: string; status: DBStatus; uptime: string; responseTime: string; description?: string; publisher?: string; subscriptionExpiry?: string; coverage?: string; lastChecked?: string }
interface JournalItem { id: number; title: string; publisher: string; category?: string; status?: DBStatus; updatedDate: string; expiryDate: string }
interface Ebook { id: number; judul: string; penerbit: string; category?: string; status?: DBStatus; tanggal: string; expiry: string }

// ─── Helper Components ───

// ─── TAB COMPONENTS ───

// 1. TabDatabases (Unified Admin Theme)
function TabDatabases({ notify, searchQuery, onSearch }: any) {
  const { t } = useLanguage()
  const [journals, setJournals] = useState<Journal[]>(mockJournals.map(j => ({...j, status: j.status as DBStatus})))
  
  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5

  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)

  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const [addModal, setAddModal] = useState(false)
  const [editDb, setEditDb] = useState<Journal | null>(null)
  const [detailDb, setDetailDb] = useState<Journal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Journal | "bulk" | null>(null)
  const [bulkStatusTarget, setBulkStatusTarget] = useState<DBStatus | null>(null)


  const categories = useMemo(() => Array.from(new Set(journals.map(j => j.category))), [journals])
  const isFiltered = !!(filterCategory.length > 0 || filterStatus.length > 0 || searchQuery)
  
  const processedData = useMemo(() => {
    let res = journals.filter(j => {
      // 1. Category OR logic
      if (filterCategory.length > 0 && !filterCategory.includes(j.category)) return false
      // 2. Status OR logic
      if (filterStatus.length > 0 && !filterStatus.includes(j.status)) return false
      // 3. Search AND logic
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!j.name.toLowerCase().includes(q) && !j.url.toLowerCase().includes(q)) return false
      }
      return true
    })
    
    if (sortKey && sortOrder) {
      res.sort((a, b) => {
        const aVal = (a as any)[sortKey]; const bVal = (b as any)[sortKey]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return 0
      })
    }
    return res
  }, [journals, filterCategory, filterStatus, searchQuery, sortKey, sortOrder])

  const chips = [
    ...filterCategory.map(v => ({ category: "CATEGORY", value: v, onClear: () => setFilterCategory(p => p.filter(x => x !== v)) })),
    ...filterStatus.map(v => ({ category: "STATUS", value: v, onClear: () => setFilterStatus(p => p.filter(x => x !== v)) })),
  ]

  const totalPages = Math.ceil(processedData.length / perPage)
  const paginated = processedData.slice((currentPage - 1) * perPage, currentPage * perPage)
  const from = Math.min((currentPage - 1) * perPage + 1, processedData.length)
  const to = Math.min(currentPage * perPage, processedData.length)

  const allPageSelected = paginated.length > 0 && paginated.every(u => selected.has(u.id))
  const toggleAll = () => {
    if (allPageSelected) { const s = new Set(selected); paginated.forEach(u => s.delete(u.id)); setSelected(s) }
    else { const s = new Set(selected); paginated.forEach(u => s.add(u.id)); setSelected(s) }
  }
  const toggleOne = (id: number) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const exitEditMode = () => { setEditMode(false); setSelected(new Set()) }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc')
      else if (sortOrder === 'desc') {
        setSortKey(null)
        setSortOrder(null)
      }
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleWizardSave = (items: any[], config: UnifiedResourceConfig) => {
    if (editDb) {
      setJournals(prev => prev.map(d => d.id === editDb.id ? { 
        ...d, 
        name: config.title,
        url: config.url,
        status: config.status,
        description: config.description,
        publisher: config.publisher,
        subscriptionExpiry: config.expiryDate
      } : d))
      notify("success", t.databaseUpdated || "Database updated", (t.hasBeenUpdated || "{name} has been updated").replace("{name}", config.title))
      setEditDb(null)
      if (detailDb?.id === editDb.id) setDetailDb(null)
    } else {
      setJournals(prev => {
        const newItems = items.map(item => ({
          ...item,
          id: Date.now() + Math.random(),
          name: item.name || config.title || "New Database",
          url: config.url || item.url || "https://example.com",
          status: config.status,
          responseTime: "12ms",
          uptime: "100%",
          description: config.description || item.description,
          publisher: config.publisher || item.publisher,
          subscriptionExpiry: config.expiryDate
        })) as Journal[]
        return [...newItems, ...prev]
      })
      notify("success", t.databasesAdded || "Databases added", (t.recordsAssigned || "{count} records assigned").replace("{count}", String(items.length)))
      setAddModal(false)
    }
  }

  const handleDelete = (target: Journal | "bulk") => {
    if (target === "bulk") {
      setJournals(prev => prev.filter(d => !selected.has(d.id)))
      notify("error", t.databasesDeleted || "Databases deleted", (t.recordsRemoved || "{count} records removed").replace("{count}", String(selected.size)))
      exitEditMode()
    } else {
      setJournals(prev => prev.filter(d => d.id !== (target as Journal).id))
      notify("error", t.databaseDeleted || "Database deleted", (t.recordRemoved || "{name} removed").replace("{name}", (target as Journal).name))
      if (detailDb?.id === (target as Journal).id) setDetailDb(null)
    }
    setDeleteTarget(null)
  }

  const handleStatusToggle = (target: Journal, forceStatus?: DBStatus) => {
    const newStatus = forceStatus || (target.status === 'Active' ? 'Maintenance' : 'Active') as DBStatus
    setJournals(prev => prev.map(d => d.id === target.id ? { ...d, status: newStatus } : d))
    notify(newStatus === 'Active' ? 'success' : 'warning', `Status changed to ${newStatus}`, target.name)
    if (detailDb?.id === target.id) setDetailDb(prev => prev ? { ...prev, status: newStatus } : null)
  }

  const handleBulkStatusChange = (status: DBStatus) => {
    if ((status === "Maintenance" || status === "Down") && !bulkStatusTarget) {
      setBulkStatusTarget(status)
      return
    }

    setJournals(prev => prev.map(d => selected.has(d.id) ? { ...d, status } : d))
    notify(status === 'Active' ? 'success' : 'warning', `Bulk ${status}`, `${selected.size} databases updated`)
    exitEditMode()
    setBulkStatusTarget(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-[#111827] rounded-[32px] overflow-visible border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col z-10">
        <div className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.databaseDirectory || "Database Directory"}</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">{t.manageDatabasesDesc || "Manage database connections and provider logic."}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditMode(e => !e); setSelected(new Set()) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${editMode ? "bg-blue-50 border-blue-200 text-[#0288f4] dark:bg-[#0288f4]/10 dark:text-[#2ba9f5] dark:border-[#0288f4]/20" : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50"}`}>
                {editMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {t.editMode}
              </button>
              <ExportDropdown onExport={(fmt) => notify("export", `${t.exportSuccess || "Exporting"} ${fmt}`, (t.exportPreparing || "Preparing {count} records").replace("{count}", String(processedData.length)))} />
              <button onClick={() => setAddModal(true)} className="bg-gradient-to-r from-[#0288f4] to-[#2ac9fa] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity shadow-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addDatabase || "Add Database"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MultiSelectFilter selected={filterCategory} placeholder={t.category} options={categories} onChange={setFilterCategory} />
            <MultiSelectFilter selected={filterStatus} placeholder={t.status} options={["Active", "Maintenance", "Down"]} onChange={setFilterStatus} />
            <div className="relative group max-w-sm flex-1 ml-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#0288f4] transition-colors" />
              <input type="text" value={searchQuery} onChange={e => { onSearch(e.target.value); setCurrentPage(1) }} placeholder={t.searchDatabasePlaceholder || "Search databases..."} className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#0288f4] transition-all focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/10" />
            </div>
          </div>
          <FilterChips chips={chips} onResetAll={() => { setFilterCategory([]); setFilterStatus([]); onSearch("") }} />
        </div>

        {editMode && selected.size > 0 && (
          <div className="mx-8 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
            <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selected.size))}</span>
            <button onClick={() => handleBulkStatusChange("Active")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">{t.active}</button>
            <button onClick={() => handleBulkStatusChange("Maintenance")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">{t.maintenance}</button>
            <button onClick={() => handleBulkStatusChange("Down")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors">{t.down}</button>
            <button onClick={() => setDeleteTarget("bulk")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> {t.delete}</button>
            <button onClick={() => setSelected(new Set())} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="overflow-x-auto mt-4 px-2 lg:px-4 z-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 tracking-widest">
                {editMode && <th className="px-6 py-4 w-12"><button onClick={toggleAll} className="text-slate-400 hover:text-[#0288f4] transition-colors">{allPageSelected ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></th>}
                {[
                  { k: 'name', l: t.databaseName || 'Database Name' }, { k: 'category', l: t.category }, 
                  { k: 'accessMethod', l: t.accessMethod || 'Access Method' }, { k: 'status', l: t.status }, { k: 'uptime', l: t.uptime || 'Uptime' }
                ].map(h => (
                  <th key={h.k} className={`px-6 py-4 cursor-pointer transition-colors select-none ${sortKey === h.k ? 'text-[#0288f4]' : 'hover:text-slate-700 dark:hover:text-slate-200'}`} onClick={() => handleSort(h.k)}>
                    <div className="flex items-center gap-1.5">{h.l}</div>
                  </th>
                ))}
                <th className="px-6 py-4">{t.portalUrl || "Portal URL"}</th>
                <th className="px-6 py-4 text-right pr-8 shrink-0">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm">
              {paginated.map(j => (
                <tr key={j.id} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${selected.has(j.id) ? "bg-blue-50/50 dark:bg-[#0288f4]/5" : ""}`}>
                  {editMode && <td className="px-6 py-4"><button onClick={() => toggleOne(j.id)} className="text-slate-400 hover:text-[#0288f4] transition-colors">{selected.has(j.id) ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></td>}
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                    <button onClick={() => setDetailDb(j)} className="hover:text-[#0288f4] transition-colors text-left font-semibold">{j.name}</button>
                  </td>
                  <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 text-xs font-semibold rounded-lg">{j.category}</span></td>
                  <td className="px-6 py-4"><span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 text-xs font-semibold rounded-lg">{j.accessMethod || "SAML"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border-0 ${j.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-none' : j.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-300">{j.uptime}</td>
                  <td className="px-6 py-4 max-w-[150px]">
                    <a href={j.url} target="_blank" rel="noopener noreferrer" className="text-[#0288f4] hover:underline flex items-center gap-1.5 text-xs font-medium truncate">
                      <span className="truncate">{j.url.replace('https://', '')}</span> <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right pr-6 shrink-0">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <button onClick={() => setEditDb(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0288f4] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center flex-wrap gap-4 text-sm mt-auto z-10">
          <span className={`font-semibold ${isFiltered ? "text-orange-500" : "text-slate-400"}`}>
            {t.showingRange.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(processedData.length))}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${p === currentPage ? "bg-[#0288f4] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {addModal && (
        <UnifiedResourceWizard
          mode="add"
          resourceType="database"
          availableItems={availableDatabases}
          onClose={() => setAddModal(false)}
          onSave={handleWizardSave}
        />
      )}
      {editDb && (
        <UnifiedResourceWizard
          mode="edit"
          resourceType="database"
          initialData={editDb}
          onClose={() => setEditDb(null)}
          onSave={handleWizardSave}
        />
      )}
      {detailDb && <DatabaseDetailDrawer db={detailDb} onClose={() => setDetailDb(null)} onEdit={() => { setEditDb(detailDb); setDetailDb(null) }} toggleStatus={() => handleStatusToggle(detailDb)} />}
      
      {deleteTarget !== null && (
        <ConfirmDialog
          title={deleteTarget === "bulk" ? t.confirmDeleteBulkTitle.replace("{count}", String(selected.size)) : t.confirmDeleteTitle.replace("{name}", (deleteTarget as Journal).name)}
          desc={deleteTarget === "bulk" 
            ? t.confirmDeleteBulkDesc.replace("{count}", String(selected.size))
            : t.confirmDeleteDesc.replace("{name}", (deleteTarget as Journal).name)
          }
          confirmLabel={deleteTarget === "bulk" ? t.deleteAll : t.delete}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          danger={true}
        />
      )}
      {bulkStatusTarget && (
        <ConfirmDialog
          title={t.confirmBulkStatusTitle.replace("{status}", bulkStatusTarget).replace("{count}", String(selected.size))}
          desc={t.confirmBulkStatusDesc.replace("{count}", String(selected.size)).replace("{status}", bulkStatusTarget)}
          confirmLabel={t.changeStatus}
          onConfirm={() => handleBulkStatusChange(bulkStatusTarget)}
          onCancel={() => setBulkStatusTarget(null)}
          danger={true}
        />
      )}
    </div>
  )
}

// 2. TabJournals (Unified Admin Theme)
function TabJournals({ notify, searchQuery, onSearch }: any) {
  const { t } = useLanguage()
  const [items, setItems] = useState<JournalItem[]>(mockJournalItems)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  
  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [addModal, setAddModal] = useState(false)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<JournalItem | "bulk" | null>(null)
  const [bulkInactiveTarget, setBulkInactiveTarget] = useState(false)
  const [editItem, setEditItem] = useState<JournalItem | null>(null)

  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])

  const categories = useMemo(() => Array.from(new Set(items.map(j => j.category).filter(Boolean))), [items])
  const isFiltered = !!(filterCategory.length > 0 || filterStatus.length > 0 || searchQuery)

  const processedData = useMemo(() => {
    let res = items.filter(j => {
      if (filterCategory.length > 0 && !filterCategory.includes(j.category || "")) return false
      if (filterStatus.length > 0 && !filterStatus.includes(j.status || "")) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!j.title.toLowerCase().includes(q) && !j.publisher.toLowerCase().includes(q)) return false
      }
      return true
    })

    if (sortKey && sortOrder) {
      res.sort((a, b) => {
        const aVal = (a as any)[sortKey]; const bVal = (b as any)[sortKey]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return 0
      })
    }
    return res
  }, [items, filterCategory, filterStatus, searchQuery, sortKey, sortOrder])

  const chips = [
    ...filterCategory.map(v => ({ category: "CATEGORY", value: v, onClear: () => setFilterCategory(p => p.filter(x => x !== v)) })),
    ...filterStatus.map(v => ({ category: "STATUS", value: v, onClear: () => setFilterStatus(p => p.filter(x => x !== v)) })),
  ]

  const totalPages = Math.ceil(processedData.length / perPage)
  const paginated = processedData.slice((currentPage - 1) * perPage, currentPage * perPage)
  const from = Math.min((currentPage - 1) * perPage + 1, processedData.length)
  const to = Math.min(currentPage * perPage, processedData.length)

  const allPageSelected = paginated.length > 0 && paginated.every(u => selected.has(u.id))
  const toggleAll = () => {
    if (allPageSelected) { const s = new Set(selected); paginated.forEach(u => s.delete(u.id)); setSelected(s) }
    else { const s = new Set(selected); paginated.forEach(u => s.add(u.id)); setSelected(s) }
  }
  const toggleOne = (id: number) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const exitEditMode = () => { setEditMode(false); setSelected(new Set()) }

  const handleWizardSave = (assignedItems: any[], config: UnifiedResourceConfig) => {
    if (editItem) {
      setItems(prev => prev.map(d => d.id === editItem.id ? { 
        ...d, 
        title: config.title,
        publisher: config.publisher,
        updatedDate: config.updatedDate,
        expiryDate: config.expiryDate
      } : d))
      notify("success", "Journal updated", `${config.title} updated`)
      setEditItem(null)
    } else {
      setItems(prev => {
        const newItems = assignedItems.map(item => ({
          ...item,
          id: Date.now() + Math.random(),
          title: item.title || config.title || "New Journal",
          publisher: item.publisher || config.publisher || "Publisher",
          updatedDate: config.updatedDate,
          expiryDate: config.expiryDate
        })) as JournalItem[]
        return [...newItems, ...prev]
      })
      notify("success", "Journals added", `${assignedItems.length} records assigned successfully`)
      setAddModal(false)
    }
  }

  const handleDelete = (target: JournalItem | "bulk") => {
    if (target === "bulk") {
      setItems(prev => prev.filter(d => !selected.has(d.id)))
      notify("error", "Journals deleted", `${selected.size} records removed`)
      exitEditMode()
    } else {
      setItems(prev => prev.filter(d => d.id !== (target as JournalItem).id))
      notify("error", "Journal deleted", `${(target as JournalItem).title} removed`)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-[#111827] rounded-[32px] overflow-visible border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col">
        <div className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.journalRecords || "Journal Records"}</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">{t.manageJournalsDesc || "Manage individual journal articles and publications."}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditMode(e => !e); setSelected(new Set()) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${editMode ? "bg-[#0288f4]/10 border-[#0288f4]/20 text-[#0288f4]" : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50"}`}>
                {editMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {t.editMode}
              </button>
              <ExportDropdown onExport={(fmt) => notify("export", `Exporting ${fmt}`, `${processedData.length} journals`)} />
              <button onClick={() => setAddModal(true)} className="bg-gradient-to-r from-[#0288f4] to-[#2ac9fa] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity shadow-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addJournal || "Add Journal"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {categories.length > 0 && <MultiSelectFilter selected={filterCategory} placeholder={t.category} options={categories as string[]} onChange={setFilterCategory} />}
            <MultiSelectFilter selected={filterStatus} placeholder={t.status} options={["Active", "Inactive"]} onChange={setFilterStatus} />
            <div className="relative group flex-1 max-w-sm ml-auto z-10">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#0288f4] transition-colors" />
              <input type="text" value={searchQuery} onChange={e => { onSearch(e.target.value); setCurrentPage(1) }} placeholder={t.searchJournalPlaceholder || "Search journals by title or publisher..."} className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#0288f4] transition-all" />
            </div>
          </div>
          
          <FilterChips chips={chips} onResetAll={() => { setFilterCategory([]); setFilterStatus([]); onSearch("") }} />
        </div>

        {editMode && selected.size > 0 && (
          <div className="mx-8 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
            <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selected.size))}</span>
            <button onClick={() => {
              setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Active" } : d))
              notify("success", "Bulk Active", `${selected.size} journals updated`)
              exitEditMode()
            }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">{t.active}</button>
            <button onClick={() => {
              if (!bulkInactiveTarget) {
                setBulkInactiveTarget(true)
                return
              }
              setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Inactive" } : d))
              notify("warning", "Bulk Inactive", `${selected.size} journals updated`)
              exitEditMode()
              setBulkInactiveTarget(false)
            }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">{t.inactive}</button>
            <button onClick={() => setDeleteTarget("bulk")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> {t.delete}</button>
            <button onClick={() => setSelected(new Set())} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="overflow-x-auto mt-4 px-2 lg:px-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 tracking-widest">
                {editMode && <th className="px-6 py-4 w-12"><button onClick={toggleAll} className="text-slate-400 hover:text-[#0288f4] transition-colors">{allPageSelected ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></th>}
                {[
                  { k: 'title', l: t.journalTitle || 'Journal Title' }, { k: 'publisher', l: t.publisher }, 
                  { k: 'category', l: t.category }, { k: 'status', l: t.status },
                  { k: 'updatedDate', l: t.updatedDate || 'Updated Date' }, { k: 'expiryDate', l: t.expiryDate || 'Expiry Date' }
                ].map(h => (
                  <th key={h.k} className={`px-6 py-4 cursor-pointer transition-colors select-none ${sortKey === h.k ? 'text-[#0288f4]' : 'hover:text-slate-700 dark:hover:text-slate-200'}`} onClick={() => {
                    if (sortKey === h.k) {
                      if (sortOrder === 'asc') setSortOrder('desc')
                      else if (sortOrder === 'desc') { setSortKey(null); setSortOrder(null) }
                    } else { setSortKey(h.k); setSortOrder('asc') }
                  }}>
                    {h.l}
                  </th>
                ))}
                <th className="px-6 py-4 text-right pr-8 shrink-0">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm">
              {paginated.map(j => (
                <tr key={j.id} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${selected.has(j.id) ? "bg-blue-50/50 dark:bg-[#0288f4]/5" : ""}`}>
                  {editMode && <td className="px-6 py-4"><button onClick={() => toggleOne(j.id)} className="text-slate-400 hover:text-[#0288f4] transition-colors">{selected.has(j.id) ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></td>}
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{j.title}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{j.publisher}</td>
                  <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 text-xs font-semibold rounded-lg">{j.category || "General"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${j.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {j.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{j.updatedDate}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{j.expiryDate}</td>
                  <td className="px-6 py-4 text-right pr-6 shrink-0">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <button onClick={() => setEditItem(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0288f4] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center flex-wrap gap-4 text-sm mt-auto">
          <span className={`font-semibold ${isFiltered ? "text-orange-500" : "text-slate-400"}`}>
            {t.showingRange.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(processedData.length))}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${p === currentPage ? "bg-[#0288f4] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {addModal && (
        <UnifiedResourceWizard
          mode="add"
          resourceType="journal"
          availableItems={availableJournalItems}
          onClose={() => setAddModal(false)}
          onSave={handleWizardSave}
        />
      )}
      {editItem && (
        <UnifiedResourceWizard
          mode="edit"
          resourceType="journal"
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleWizardSave}
        />
      )}
      
      {deleteTarget !== null && (
        <ConfirmDialog
          title={deleteTarget === "bulk" ? t.confirmDeleteBulkTitle.replace("{count}", String(selected.size)) : t.confirmDeleteTitle.replace("{name}", (deleteTarget as JournalItem).title)}
          desc={deleteTarget === "bulk"
            ? t.confirmDeleteBulkDesc.replace("{count}", String(selected.size))
            : t.confirmDeleteDesc.replace("{name}", (deleteTarget as JournalItem).title)
          }
          confirmLabel={deleteTarget === "bulk" ? t.deleteAll : t.delete}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          danger={true}
        />
      )}
      {bulkInactiveTarget && (
        <ConfirmDialog
          title={t.confirmBulkInactiveTitle.replace("{count}", String(selected.size))}
          desc={t.confirmBulkInactiveDesc.replace("{count}", String(selected.size))}
          confirmLabel={t.deactivateAll}
          onConfirm={() => {
            setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Inactive" } : d))
            notify("warning", "Bulk Inactive", `${selected.size} journals updated`)
            exitEditMode()
            setBulkInactiveTarget(false)
          }}
          onCancel={() => setBulkInactiveTarget(false)}
          danger={true}
        />
      )}
    </div>
  )
}

// 3. TabEbooks (Unified Admin Theme)
function TabEbooks({ notify, searchQuery, onSearch }: any) {
  const { t } = useLanguage()
  const [items, setItems] = useState<Ebook[]>(mockEbooks)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  
  const [editMode, setEditMode] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [addModal, setAddModal] = useState(false)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Ebook | "bulk" | null>(null)
  const [bulkInactiveTarget, setBulkInactiveTarget] = useState(false)
  const [editItem, setEditItem] = useState<Ebook | null>(null)

  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string[]>([])

  const categories = useMemo(() => Array.from(new Set(items.map(j => j.category).filter(Boolean))), [items])
  const isFiltered = !!(filterCategory.length > 0 || filterStatus.length > 0 || searchQuery)

  const processedData = useMemo(() => {
    let res = items.filter(j => {
      if (filterCategory.length > 0 && !filterCategory.includes(j.category || "")) return false
      if (filterStatus.length > 0 && !filterStatus.includes(j.status || "")) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!j.judul.toLowerCase().includes(q) && !j.penerbit.toLowerCase().includes(q)) return false
      }
      return true
    })

    if (sortKey && sortOrder) {
      res.sort((a, b) => {
        const aVal = (a as any)[sortKey]; const bVal = (b as any)[sortKey]
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return 0
      })
    }
    return res
  }, [items, filterCategory, filterStatus, searchQuery, sortKey, sortOrder])

  const chips = [
    ...filterCategory.map(v => ({ category: "CATEGORY", value: v, onClear: () => setFilterCategory(p => p.filter(x => x !== v)) })),
    ...filterStatus.map(v => ({ category: "STATUS", value: v, onClear: () => setFilterStatus(p => p.filter(x => x !== v)) })),
  ]

  const totalPages = Math.ceil(processedData.length / perPage)
  const paginated = processedData.slice((currentPage - 1) * perPage, currentPage * perPage)
  const from = Math.min((currentPage - 1) * perPage + 1, processedData.length)
  const to = Math.min(currentPage * perPage, processedData.length)

  const allPageSelected = paginated.length > 0 && paginated.every(u => selected.has(u.id))
  const toggleAll = () => {
    if (allPageSelected) { const s = new Set(selected); paginated.forEach(u => s.delete(u.id)); setSelected(s) }
    else { const s = new Set(selected); paginated.forEach(u => s.add(u.id)); setSelected(s) }
  }
  const toggleOne = (id: number) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const exitEditMode = () => { setEditMode(false); setSelected(new Set()) }

  const handleWizardSave = (assignedItems: any[], config: UnifiedResourceConfig) => {
    if (editItem) {
      setItems(prev => prev.map(d => d.id === editItem.id ? { 
        ...d, 
        judul: config.title,
        penerbit: config.publisher,
        tanggal: config.updatedDate,
        expiry: config.expiryDate
      } : d))
      notify("success", "eBook updated", `${config.title} updated`)
      setEditItem(null)
    } else {
      setItems(prev => {
        const newItems = assignedItems.map(item => ({
          ...item,
          id: Date.now() + Math.random(),
          judul: item.judul || config.title || "New eBook",
          penerbit: item.penerbit || config.publisher || "Publisher",
          tanggal: config.updatedDate,
          expiry: config.expiryDate
        })) as Ebook[]
        return [...newItems, ...prev]
      })
      notify("success", "eBooks added", `${assignedItems.length} items assigned successfully`)
      setAddModal(false)
    }
  }

  const handleDelete = (target: Ebook | "bulk") => {
    if (target === "bulk") {
      setItems(prev => prev.filter(d => !selected.has(d.id)))
      notify("error", "eBooks deleted", `${selected.size} records removed`)
      exitEditMode()
    } else {
      setItems(prev => prev.filter(d => d.id !== (target as Ebook).id))
      notify("error", "eBook deleted", `${(target as Ebook).judul} removed`)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-[#111827] rounded-[32px] overflow-visible border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col">
        <div className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.ebookRepository || "eBook Repository"}</h3>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">{t.manageEbooksDesc || "Manage digital books and packages."}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditMode(e => !e); setSelected(new Set()) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${editMode ? "bg-[#0288f4]/10 border-[#0288f4]/20 text-[#0288f4]" : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50"}`}>
                {editMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {t.editMode}
              </button>
              <ExportDropdown onExport={(fmt) => notify("export", `Exporting ${fmt}`, `${processedData.length} eBooks`)} />
              <button onClick={() => setAddModal(true)} className="bg-gradient-to-r from-[#0288f4] to-[#2ac9fa] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity shadow-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> {t.addEbook || "Add eBook"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {categories.length > 0 && <MultiSelectFilter selected={filterCategory} placeholder={t.category} options={categories as string[]} onChange={setFilterCategory} />}
            <MultiSelectFilter selected={filterStatus} placeholder={t.status} options={["Active", "Inactive"]} onChange={setFilterStatus} />
            <div className="relative group flex-1 max-w-sm ml-auto z-10">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#0288f4] transition-colors" />
              <input type="text" value={searchQuery} onChange={e => { onSearch(e.target.value); setCurrentPage(1) }} placeholder={t.searchEbookPlaceholder || "Search eBooks by title or publisher..."} className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] w-full outline-none focus:border-[#0288f4] transition-all" />
            </div>
          </div>
          
          <FilterChips chips={chips} onResetAll={() => { setFilterCategory([]); setFilterStatus([]); onSearch("") }} />
        </div>

        {editMode && selected.size > 0 && (
          <div className="mx-8 mt-0 mb-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#0288f4] dark:text-[#0288f4] rounded-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
            <span className="text-sm font-semibold flex-1">{t.itemsSelected.replace("{count}", String(selected.size))}</span>
            <button onClick={() => {
              setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Active" } : d))
              notify("success", "Bulk Active", `${selected.size} eBooks updated`)
              exitEditMode()
            }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">{t.active}</button>
            <button onClick={() => {
              if (!bulkInactiveTarget) {
                setBulkInactiveTarget(true)
                return
              }
              setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Inactive" } : d))
              notify("warning", "Bulk Inactive", `${selected.size} eBooks updated`)
              exitEditMode()
              setBulkInactiveTarget(false)
            }} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">{t.inactive}</button>
            <button onClick={() => setDeleteTarget("bulk")} className="text-sm font-medium px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> {t.delete}</button>
            <button onClick={() => setSelected(new Set())} className="text-[#0288f4] hover:text-[#2ac9fa] transition-colors ml-2"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="overflow-x-auto mt-4 px-2 lg:px-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 tracking-widest">
                {editMode && <th className="px-6 py-4 w-12"><button onClick={toggleAll} className="text-slate-400 hover:text-[#0288f4] transition-colors">{allPageSelected ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></th>}
                {[
                  { k: 'judul', l: t.ebookTitle || 'Title (Judul)' }, { k: 'penerbit', l: t.publisher }, 
                  { k: 'category', l: t.category }, { k: 'status', l: t.status },
                  { k: 'tanggal', l: t.date || 'Date' }, { k: 'expiry', l: t.expiry || 'Expiry' }
                ].map(h => (
                  <th key={h.k} className={`px-6 py-4 cursor-pointer transition-colors select-none ${sortKey === h.k ? 'text-[#0288f4]' : 'hover:text-slate-700 dark:hover:text-slate-200'}`} onClick={() => {
                    if (sortKey === h.k) {
                      if (sortOrder === 'asc') setSortOrder('desc')
                      else if (sortOrder === 'desc') { setSortKey(null); setSortOrder(null) }
                    } else { setSortKey(h.k); setSortOrder('asc') }
                  }}>
                    {h.l}
                  </th>
                ))}
                <th className="px-6 py-4 text-right pr-8 shrink-0">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm">
              {paginated.map(j => (
                <tr key={j.id} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${selected.has(j.id) ? "bg-blue-50/50 dark:bg-[#0288f4]/5" : ""}`}>
                  {editMode && <td className="px-6 py-4"><button onClick={() => toggleOne(j.id)} className="text-slate-400 hover:text-[#0288f4] transition-colors">{selected.has(j.id) ? <CheckSquare className="w-4 h-4 text-[#0288f4]" /> : <Square className="w-4 h-4" />}</button></td>}
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{j.judul}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{j.penerbit}</td>
                  <td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 text-xs font-semibold rounded-lg">{j.category || "General"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${j.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {j.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{j.tanggal}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{j.expiry}</td>
                  <td className="px-6 py-4 text-right pr-6 shrink-0">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <button onClick={() => setEditItem(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0288f4] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(j)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center flex-wrap gap-4 text-sm mt-auto">
          <span className={`font-semibold ${isFiltered ? "text-orange-500" : "text-slate-400"}`}>
            {t.showingRange.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(processedData.length))}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${p === currentPage ? "bg-[#0288f4] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {addModal && (
        <UnifiedResourceWizard
          mode="add"
          resourceType="ebook"
          availableItems={availableEbookItems}
          onClose={() => setAddModal(false)}
          onSave={handleWizardSave}
        />
      )}
      {editItem && (
        <UnifiedResourceWizard
          mode="edit"
          resourceType="ebook"
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleWizardSave}
        />
      )}
      
      {deleteTarget !== null && (
        <ConfirmDialog
          title={deleteTarget === "bulk" ? `Hapus ${selected.size} eBook ini?` : `Hapus ${(deleteTarget as Ebook).judul}?`}
          desc={deleteTarget === "bulk"
            ? `Apakah kamu yakin ingin menghapus ${selected.size} eBook secara permanen?`
            : `Apakah kamu yakin ingin menghapus eBook ini secara permanen?`
          }
          confirmLabel={deleteTarget === "bulk" ? "Hapus Semua" : "Hapus"}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          danger={true}
        />
      )}
      {bulkInactiveTarget && (
        <ConfirmDialog
          title={`Nonaktifkan ${selected.size} eBook ini?`}
          desc={`Apakah kamu yakin ingin menonaktifkan ${selected.size} eBook ini?`}
          confirmLabel="Nonaktifkan Semua"
          onConfirm={() => {
            setItems(prev => prev.map(d => selected.has(d.id) ? { ...d, status: "Inactive" } : d))
            notify("warning", "Bulk Inactive", `${selected.size} eBooks updated`)
            exitEditMode()
            setBulkInactiveTarget(false)
          }}
          onCancel={() => setBulkInactiveTarget(false)}
          danger={true}
        />
      )}
    </div>
  )
}

// ─── Main Component ───
export default function DatabasesPage() {
  const { t } = useLanguage()
  const { notify, activeStrips, dismissActive } = useNotifications()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'databases' | 'journals' | 'ebooks'>('databases')
  
  // Shared search state across tabs (optional: can isolate if preferred, but user implies 1 flow)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [refreshTimer, setRefreshTimer] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => setRefreshTimer(prev => (prev <= 1 ? 60 : prev - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const providerCardStyle = (status: string) => {
    if (status === 'up') return { bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' }
    if (status === 'slow') return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' }
    return { bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400' }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-4xl sm:text-5xl font-medium text-black dark:text-white tracking-tight">{t.databases}</h1>
        <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">Manage connections, journal directories, and eBook repositories.</p>
      </div>

      {/* Notifications */}
      {activeStrips.length > 0 && (
        <div className="flex flex-col mb-4 relative z-30">
          {activeStrips.map(notif => {
            let colors = "bg-slate-100 text-slate-700 border-slate-200"
            let Icon: React.ElementType = Loader2
            if (notif.type === 'success') { colors = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"; Icon = CheckCircle2 }
            else if (notif.type === 'error') { colors = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"; Icon = AlertCircle }
            else if (notif.type === 'warning') { colors = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"; Icon = AlertTriangle }
            else if (notif.type === 'export') { colors = "bg-blue-50 text-[#0288f4] border-blue-100 dark:bg-[#0288f4]/10 dark:text-[#2ba9f5] dark:border-[#0288f4]/20"; Icon = Download }
            return (
              <div key={notif.id} className={`flex items-center gap-3 px-3.5 rounded-2xl border ${colors} shadow-sm transition-all overflow-hidden ${notif.isClosing ? "max-h-0 opacity-0 mb-0 py-0 scale-[0.98]" : "max-h-24 opacity-100 mb-3 py-3.5"}`}>
                <div className="shrink-0 bg-white/50 p-1.5 rounded-lg"><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold">{notif.title}</p><p className="text-[12px] opacity-80 mt-0.5">{notif.desc}</p></div>
                <button onClick={() => dismissActive(notif.id)} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            )
          })}
        </div>
      )}


      {/* Provider Health Check */}
      <div className="bg-white dark:bg-[#111827] p-8 lg:p-10 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Provider Health Check</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 tracking-widest">Auto refresh in {refreshTimer}s</p>
          </div>
          <button onClick={() => setRefreshTimer(60)} className="flex items-center gap-2 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800/60 outline-none">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-25%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="relative overflow-hidden w-full group -mx-2 px-2 py-1 cursor-ew-resize">
          <div className="flex w-max animate-marquee gap-10">
            {[...healthCheckData, ...healthCheckData, ...healthCheckData, ...healthCheckData].map((hc, i) => {
              const c = providerCardStyle(hc.status)
              return (
                <div key={i} className={`py-5 px-6 rounded-2xl ${c.bg} text-center transition-all hover:scale-[1.05] border border-slate-100 dark:border-slate-800/60 w-[200px] shrink-0`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shadow-sm`} />
                    <span className={`text-sm font-semibold ${c.text}`}>{hc.name}</span>
                  </div>
                  <p className={`text-2xl font-semibold mt-1 ${c.text}`}>{hc.uptime}</p>
                </div>
              )
            })}
          </div>
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white dark:from-[#111827] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white dark:from-[#111827] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex gap-10 mt-12 mb-10 overflow-x-auto scrollbar-hide relative z-10 border-b border-slate-200 dark:border-slate-800/50">
        <button 
          onClick={() => { setActiveTab('databases'); setSearchQuery('') }}
          className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group ${activeTab === 'databases' ? 'text-[#0288f4] font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <DatabaseIcon className={`w-5 h-5 transition-colors ${activeTab === 'databases' ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span className="text-[16px]">{t.databaseDirectory || "Databases"}</span>
          {activeTab === 'databases' && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
          )}
        </button>
        <button 
          onClick={() => { setActiveTab('journals'); setSearchQuery('') }}
          className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group ${activeTab === 'journals' ? 'text-[#0288f4] font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Library className={`w-5 h-5 transition-colors ${activeTab === 'journals' ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span className="text-[16px]">{t.journalRecords || "Journals"}</span>
          {activeTab === 'journals' && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
          )}
        </button>
        <button 
          onClick={() => { setActiveTab('ebooks'); setSearchQuery('') }}
          className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group ${activeTab === 'ebooks' ? 'text-[#0288f4] font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <BookOpen className={`w-5 h-5 transition-colors ${activeTab === 'ebooks' ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span className="text-[16px]">{t.ebookRepository || "eBooks"}</span>
          {activeTab === 'ebooks' && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
          )}
        </button>
      </div>

      {/* Render Active Tab Content */}
      <div className="relative">
        {activeTab === 'databases' && <TabDatabases notify={notify} searchQuery={searchQuery} onSearch={setSearchQuery} />}
        {activeTab === 'journals' && <TabJournals notify={notify} searchQuery={searchQuery} onSearch={setSearchQuery} />}
        {activeTab === 'ebooks' && <TabEbooks notify={notify} searchQuery={searchQuery} onSearch={setSearchQuery} />}
      </div>
    </>
  )
}
