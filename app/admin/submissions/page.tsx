"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { 
  Inbox, MoreVertical, X, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  FileText, ShoppingBag, Mail, Info, ChevronDown, Check
} from "lucide-react"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import { ExportDropdown } from "@/app/admin/components/ui/ExportDropdown"
import ConfirmDialog from "@/app/admin/components/shared/ConfirmDialog"
import FilterChips from "@/app/admin/components/shared/FilterChips"
import Portal from "@/app/admin/components/shared/Portal"
import { useLanguage } from "@/app/admin/components/providers/language-provider"

// --- Inline multi-select (absolute pos, avoids fixed-position CSS transform trap) ---
function InlineMultiSelect({ selected, placeholder, options, onChange }: {
  selected: string[]; placeholder: string; options: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt))
    else onChange([...selected, opt])
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all outline-none whitespace-nowrap
          ${open ? "ring-2 ring-[#0288f4]/20 border-[#0288f4] bg-white dark:bg-[#111827]" : "border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}
        `}
      >
        <span className="truncate max-w-[130px]">
          {selected.length > 0 ? `${selected.length} ${placeholder}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[180px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-[999]">
          <button
            onClick={() => { onChange([]); setOpen(false) }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium mb-1 transition-colors outline-none
              ${selected.length === 0 ? "bg-[#0288f4] text-white font-semibold" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            All {placeholder}
            {selected.length === 0 && <Check className="w-3.5 h-3.5" />}
          </button>
          {options.map(opt => {
            const isSel = selected.includes(opt)
            return (
              <button key={opt} onClick={() => toggle(opt)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors outline-none
                  ${isSel ? "bg-slate-50 dark:bg-slate-800/60 text-[#0288f4] font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"}`}
              >
                {opt}
                {isSel && <Check className="w-4 h-4 text-[#0288f4]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Mock Data ---
const articleRequestsMock = [
  { id: 1, email: "mhmmdragil@student.telkomuniversity.ac.id", type: "Manual Request", status: "Pending", createdAt: "27th Nov 2025", title: "Deep Learning in Computer Vision", notes: "Needed for my final thesis research." },
  { id: 2, email: "fakhrijulverdie@student.telkomuniversity.ac.id", type: "Manual Request", status: "Approved", createdAt: "26th Oct 2025", title: "Advanced Quantum Mechanics", notes: "Self-study purposes." },
  { id: 3, email: "sukmakeyshaaulia@student.telkomuniversity.ac.id", type: "Auto Request", status: "Pending", createdAt: "13th Oct 2025", title: "Human-Computer Interaction Trends", notes: "" },
  { id: 4, email: "haaniyabutsainaa@student.telkomuniversity.ac.id", type: "Manual Request", status: "Rejected", createdAt: "10th Oct 2025", title: "Introduction to Psychology", notes: "Book already available in library." },
  { id: 5, email: "azkafatharani@student.telkomuniversity.ac.id", type: "Auto Request", status: "Pending", createdAt: "26th Sep 2025", title: "Blockchain Security Protocols", notes: "Project reference." },
]

const purchaseSuggestionsMock = [
  { id: 1, email: "budi@student.telkomuniversity.ac.id", title: "Deep Learning Fundamentals", category: "eBook", status: "Pending", createdAt: "20th Apr 2026", notes: "Highly recommended by professor." },
  { id: 2, email: "hendra@telkomuniversity.ac.id", title: "IEEE Journal of AI", category: "Journal", status: "Approved", createdAt: "15th Apr 2026", notes: "Essential for laboratory resources." },
]

// --- Detail Drawer ---
const SubmissionDetailDrawer = ({ submission, type, onClose, onAction }: {
  submission: any; type: 'article' | 'purchase'
  onClose: () => void; onAction: (s: 'Approved' | 'Rejected') => void
}) => {
  if (!submission) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
        <div className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.submissionDetail || "Submission Detail"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-5">
              {[
                { label: "Email", value: <span className="text-sm font-semibold text-slate-800 dark:text-white break-all">{submission.email}</span> },
                { label: t.type, value: <span className="text-sm font-semibold text-slate-800 dark:text-white">{type === 'article' ? submission.type : submission.category}</span> },
                { label: t.status, value: (
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                    submission.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    submission.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>{submission.status}</span>
                )},
                { label: t.submitted || "Submitted", value: <span className="text-sm font-semibold text-slate-800 dark:text-white">{submission.createdAt}</span> },
              ].map(row => (
                <div key={row.label} className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium text-slate-400">{row.label}</span>
                  <span className="col-span-2">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
              <h3 className="text-[11px] font-semibold text-slate-400 tracking-widest mb-4">{t.requestDetail || "Request Detail"}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1.5">{type === 'article' ? (t.titleArticle || 'Title/Article') : (t.bookTitle || 'Book Title')}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">{submission.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1.5">{t.notes || "Notes"}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">{submission.notes || (t.noNotesProvided || "No notes provided.")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex gap-3">
              <button disabled={submission.status !== 'Pending'} onClick={() => onAction('Approved')}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {t.approve || "Approve"}
              </button>
              <button disabled={submission.status !== 'Pending'} onClick={() => onAction('Rejected')}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> {t.reject || "Reject"}
              </button>
            </div>
            <button onClick={onClose} className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold text-sm py-2 transition-colors">{t.close}</button>
          </div>
        </div>
      </div>
    </Portal>
  )
}

// --- Main Page ---
export default function SubmissionsPage() {
  const { t } = useLanguage()
  const { notify } = useNotifications()
  const [activeTab, setActiveTab] = useState<'article' | 'purchase'>('article')
  const [articleData, setArticleData] = useState(articleRequestsMock)
  const [purchaseData, setPurchaseData] = useState(purchaseSuggestionsMock)

  // Reactive multi-select filters — no Apply button needed
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [detailSubmission, setDetailSubmission] = useState<any>(null)
  const [confirmAction, setConfirmAction] = useState<{ status: 'Approved' | 'Rejected', sub: any } | null>(null)

  // Derived: is any filter active?
  const isFiltered = filterTypes.length > 0 || filterStatuses.length > 0

  // FilterChips array — matches Users page pattern
  const chips = [
    ...filterTypes.map(v => ({
      category: activeTab === 'article' ? 'TYPE' : 'CATEGORY',
      value: v,
      onClear: () => setFilterTypes(prev => prev.filter(x => x !== v))
    })),
    ...filterStatuses.map(v => ({
      category: 'STATUS',
      value: v,
      onClear: () => setFilterStatuses(prev => prev.filter(x => x !== v))
    }))
  ]

  const handleTabSwitch = (tab: 'article' | 'purchase') => {
    setActiveTab(tab)
    setFilterTypes([])
    setFilterStatuses([])
    setSortKey(null)
    setSortOrder(null)
  }

  const processedData = useMemo(() => {
    const rawData = activeTab === 'article' ? articleData : purchaseData
    let res = [...rawData]
    if (filterTypes.length > 0)
      res = res.filter(item => filterTypes.includes(activeTab === 'article' ? item.type : item.category))
    if (filterStatuses.length > 0)
      res = res.filter(item => filterStatuses.includes(item.status))
    if (sortKey && sortOrder) {
      res.sort((a, b) => {
        const aVal = (a as any)[sortKey]; const bVal = (b as any)[sortKey]
        if (typeof aVal === 'string' && typeof bVal === 'string')
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        return 0
      })
    }
    return res
  }, [activeTab, articleData, purchaseData, filterTypes, filterStatuses, sortKey, sortOrder])

  const totalData = activeTab === 'article' ? articleData.length : purchaseData.length

  const handleStatusChange = (status: 'Approved' | 'Rejected', sub: any) => {
    const fn = (prev: any[]) => prev.map(item => item.id === sub.id ? { ...item, status } : item)
    if (activeTab === 'article') setArticleData(fn)
    else setPurchaseData(fn)
    setConfirmAction(null)
    setDetailSubmission(null)
    notify(status === 'Approved' ? 'success' : 'error', t.actionSuccess || "Action Success", (t.submissionUpdated || "Submission {status}").replace("{status}", status))
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc')
      else { setSortKey(null); setSortOrder(null) }
    } else { setSortKey(key); setSortOrder('asc') }
  }

  const typeOptions = activeTab === 'article' ? ["Manual Request", "Auto Request"] : ["eBook", "Journal"]
  const SortTh = ({ label, k }: { label: string; k: string }) => (
    <th className={`px-6 py-5 cursor-pointer transition-colors select-none ${sortKey === k ? 'text-[#0288f4]' : 'hover:text-slate-700 dark:hover:text-slate-200'}`} onClick={() => handleSort(k)}>{label}</th>
  )

  return (
    <>
      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-medium text-black dark:text-white tracking-tight">{t.submissions}</h1>
            <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">{t.submissionsDesc}</p>
          </div>
          <ExportDropdown onExport={fmt => notify("export", `${t.exportSuccess || "Exporting"} ${fmt}`, (t.exportPreparing || "Preparing {count} records").replace("{count}", String(processedData.length)))} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-10 border-b border-slate-200 dark:border-slate-800 relative z-10 mb-8">
        {[
          { id: 'article' as const, label: t.articleRequest || 'Article Request', icon: FileText },
          { id: 'purchase' as const, label: t.purchaseSuggestion || 'Purchase Suggestion', icon: ShoppingBag },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => handleTabSwitch(tab.id)}
              className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group ${isActive ? 'text-[#0288f4] font-semibold' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="text-[16px]">{tab.label}</span>
              {isActive && <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />}
            </button>
          )
        })}
      </div>

      <div key={activeTab} className="bg-white dark:bg-[#111827] rounded-[32px] overflow-visible border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col z-10">
        {/* Filter Bar — reactive multi-select + FilterChips row, matches Users page */}
        <div className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800/50 relative overflow-visible">
          <div className="flex flex-wrap items-center gap-3">
            <InlineMultiSelect
              selected={filterTypes}
              placeholder={activeTab === 'article' ? t.type : t.category}
              options={typeOptions}
              onChange={setFilterTypes}
            />
            <InlineMultiSelect
              selected={filterStatuses}
              placeholder={t.status}
              options={["Pending", "Approved", "Rejected"]}
              onChange={setFilterStatuses}
            />
          </div>
          {/* Active filter chips — same as Users page */}
          <FilterChips
            chips={chips}
            onResetAll={() => { setFilterTypes([]); setFilterStatuses([]) }}
          />
        </div>

        {/* Table — no overflow scroll, pagination handles navigation */}
        <div className="px-4 py-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 tracking-widest">
                <SortTh label="Email" k="email" />
                {activeTab === 'article'
                  ? <SortTh label="Type" k="type" />
                  : <><SortTh label="Title" k="title" /><SortTh label="Category" k="category" /></>
                }
                <SortTh label="Status" k="status" />
                <SortTh label="Created Date" k="createdAt" />
                <th className="px-6 py-5 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Inbox className="w-10 h-10 opacity-40" />
                      <p className="font-semibold text-sm">{t.noSubmissionsMatch || "No submissions match your filters"}</p>
                      <button onClick={() => { setFilterTypes([]); setFilterStatuses([]) }} className="text-[#0288f4] text-xs font-semibold hover:underline">{t.clearFilters || "Clear filters"}</button>
                    </div>
                  </td>
                </tr>
              ) : processedData.map(item => (
                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer outline-none" onClick={() => setDetailSubmission(item)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#0288f4]/10 group-hover:text-[#0288f4] transition-colors shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]">{item.email}</span>
                    </div>
                  </td>
                  {activeTab === 'article' ? (
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${item.type === 'Manual Request' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.type}</span>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[200px] block">{item.title}</span></td>
                      <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.category}</span></td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">{item.createdAt}</td>
                  <td className="px-6 py-4 text-right pr-6" onClick={e => e.stopPropagation()}>
                    <div className="relative group/action inline-block">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl p-1.5 z-[20] opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all">
                        <button onClick={() => setDetailSubmission(item)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                          <Info className="w-3.5 h-3.5" /> View Detail
                        </button>
                        <button disabled={item.status !== 'Pending'} onClick={() => setConfirmAction({ status: 'Approved', sub: item })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button disabled={item.status !== 'Pending'} onClick={() => setConfirmAction({ status: 'Rejected', sub: item })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center text-sm mt-auto">
          {isFiltered
            ? <span className="text-orange-500 font-medium">{(t.showingXOfYSubmissions || "Showing {count} of {total} submissions").replace("{count}", String(processedData.length)).replace("{total}", String(totalData))}</span>
            : <span className="text-slate-400 font-medium">Showing 1–{processedData.length} of {totalData} submissions</span>
          }
          <div className="flex items-center gap-2">
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0288f4] text-white font-semibold text-xs shadow-sm">1</button>
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <SubmissionDetailDrawer
        submission={detailSubmission}
        type={activeTab}
        onClose={() => setDetailSubmission(null)}
        onAction={status => setConfirmAction({ status, sub: detailSubmission })}
      />

      {confirmAction && (
        <ConfirmDialog
          title={`${confirmAction.status === 'Approved' ? 'Setujui' : 'Tolak'} pengajuan ini?`}
          desc={`Apakah kamu yakin ingin ${confirmAction.status === 'Approved' ? 'menyetujui' : 'menolak'} pengajuan dari ${confirmAction.sub.email}?`}
          onConfirm={() => handleStatusChange(confirmAction.status, confirmAction.sub)}
          onCancel={() => setConfirmAction(null)}
          confirmLabel={confirmAction.status === 'Approved' ? 'Setujui' : 'Tolak'}
          danger={confirmAction.status === 'Rejected'}
        />
      )}
    </>
  )
}
