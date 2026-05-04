"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Search, X, User as UserIcon, Database as DatabaseIcon, 
  BarChart3 as ChartIcon, Shield as ShieldIcon, ChevronRight,
  Loader2, ArrowRight
} from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"
import { useSmartPosition } from "@/app/admin/hooks/useSmartPosition"
import { useGlobalUI } from "@/app/admin/components/providers/global-ui-provider"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { mockUsers, mockJournals, keywordTableData, securityLogs } from "@/app/admin/lib/mock-data"

export default function GlobalSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const { openDrawer } = useGlobalUI()
  
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoutRef = useRef<HTMLDivElement>(null)
  const dropdownStyle = useSmartPosition(triggerRef, popoutRef, isOpen)

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  // Results logic
  const results = useMemo(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) return null

    const q = debouncedQuery.toLowerCase()
    
    const users = mockUsers.filter(u => 
      u.nama.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.nim.toLowerCase().includes(q)
    )

    const databases = mockJournals.filter(j => 
      j.name.toLowerCase().includes(q) || 
      j.category.toLowerCase().includes(q)
    )

    const analytics = keywordTableData.filter(k => 
      k.keyword.toLowerCase().includes(q)
    )

    const security = securityLogs.filter(s => 
      s.user.toLowerCase().includes(q) || 
      s.ip.includes(q) || 
      s.id.toLowerCase().includes(q)
    )

    const hasAny = users.length > 0 || databases.length > 0 || analytics.length > 0 || security.length > 0

    return {
      users,
      databases,
      analytics,
      security,
      hasAny
    }
  }, [debouncedQuery])

  // Close handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
      }
      if (e.key === "Enter") {
        if (query.trim()) {
          setIsOpen(false)
          router.push(`/admin/search?q=${encodeURIComponent(query)}`)
        } else if (pathname.includes("/admin/search")) {
          // Scenario 2: Hapus teks di input -> tekan Enter lagi -> Redirect ke home
          setIsOpen(false)
          router.push("/admin")
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [query, router])

  const handleAction = (type: string, item: any) => {
    setIsOpen(false)
    if (type === 'user') openDrawer('user', item)
    if (type === 'database') openDrawer('database', item)
    if (type === 'security') openDrawer('log', item)
    if (type === 'analytics') router.push(`/admin/analytics?keyword=${encodeURIComponent(item.keyword)}`)
  }

  const navigateToCategory = (page: string, q: string) => {
    setIsOpen(false)
    router.push(`/admin/${page}?search=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[380px]">
      <div 
        ref={triggerRef}
        className="relative flex items-center w-full bg-white dark:bg-[#1e293b] rounded-full p-1.5 shadow-sm transition-shadow focus-within:shadow-md ring-1 ring-slate-200/50 dark:ring-slate-700/50"
      >
        <div className="pl-3 pr-2 flex items-center justify-center shrink-0">
          <Search className="w-[18px] h-[18px] text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.search ?? "Search, features, users, or IDs..."}
          className="flex-1 bg-transparent px-1 text-[13px] text-slate-700 dark:text-slate-100 placeholder-slate-400 outline-none w-full"
        />
        {query && (
          <button onClick={() => setQuery("")} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors mr-1">
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
        <button 
          onClick={() => {
            setIsOpen(false)
            router.push(`/admin/search?q=${encodeURIComponent(query)}`)
          }}
          className="bg-[#2d78f2] text-white px-4 py-1.5 rounded-full text-[12px] font-semibold hover:opacity-90 transition-opacity shrink-0 mx-0.5"
        >
          {"Search"}
        </button>
      </div>

      {isOpen && results && (
        <Portal>
          <div 
            ref={popoutRef}
            style={dropdownStyle}
            className="w-[480px] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[9999]"
          >
            <div className="max-h-[480px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {!results.hasAny ? (
                <div className="p-8 text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white">No results found for "{debouncedQuery}"</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Try searching for users, databases, or specific keywords like "AI Ethics".
                  </p>
                </div>
              ) : (
                <>
                  {/* Category: Users */}
                  {results.users.length > 0 && (
                    <CategorySection title="Users" icon={UserIcon}>
                      {results.users.slice(0, 3).map(u => (
                        <ResultItem key={u.id} label={u.nama} sub={u.role} onClick={() => handleAction('user', u)} />
                      ))}
                      {results.users.length > 3 && (
                        <SeeAllLink count={results.users.length} onClick={() => navigateToCategory('users', debouncedQuery)} />
                      )}
                    </CategorySection>
                  )}

                  {/* Category: Databases */}
                  {results.databases.length > 0 && (
                    <CategorySection title="Databases" icon={DatabaseIcon}>
                      {results.databases.slice(0, 3).map(j => (
                        <ResultItem key={j.id} label={j.name} sub={j.status} onClick={() => handleAction('database', j)} />
                      ))}
                      {results.databases.length > 3 && (
                        <SeeAllLink count={results.databases.length} onClick={() => navigateToCategory('databases', debouncedQuery)} />
                      )}
                    </CategorySection>
                  )}

                  {/* Category: Analytics */}
                  {results.analytics.length > 0 && (
                    <CategorySection title="Analytics" icon={ChartIcon}>
                      {results.analytics.slice(0, 3).map((k, i) => (
                        <ResultItem key={i} label={k.keyword} sub={`${k.frequency} searches`} onClick={() => handleAction('analytics', k)} />
                      ))}
                      {results.analytics.length > 3 && (
                        <SeeAllLink count={results.analytics.length} onClick={() => router.push(`/admin/analytics?search=${encodeURIComponent(debouncedQuery)}`)} />
                      )}
                    </CategorySection>
                  )}

                  {/* Category: Security Logs */}
                  {results.security.length > 0 && (
                    <CategorySection title="Security Logs" icon={ShieldIcon}>
                      {results.security.slice(0, 3).map(s => (
                        <ResultItem key={s.id} label={s.user} sub={`${s.id} — ${s.type}`} onClick={() => handleAction('security', s)} />
                      ))}
                      {results.security.length > 3 && (
                        <SeeAllLink count={results.security.length} onClick={() => navigateToCategory('security', debouncedQuery)} />
                      )}
                    </CategorySection>
                  )}
                  
                  {/* Footer: Full Search */}
                  <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-800 px-1">
                    <button 
                      onClick={() => {
                        setIsOpen(false)
                        router.push(`/admin/search?q=${encodeURIComponent(debouncedQuery)}`)
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-[#2d78f2] hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ArrowRight className="w-4 h-4 text-[#2d78f2] group-hover:text-white" />
                        <span className="text-xs font-bold tracking-widest">Full Global Search</span>
                      </div>
                      <span className="text-[10px] opacity-60">Enter ↵</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

function CategorySection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="pt-2 first:pt-0">
      <div className="px-3 py-1.5 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-black tracking-widest text-slate-400">{title}</span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function ResultItem({ label, sub, onClick }: { label: string; sub: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left outline-none group"
    >
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#2d78f2] transition-colors">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
    </button>
  )
}

function SeeAllLink({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-[11px] font-bold text-[#2d78f2] hover:underline"
    >
      See all {count} results
    </button>
  )
}
