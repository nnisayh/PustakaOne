"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  User as UserIcon, Database as DatabaseIcon, 
  BarChart3 as ChartIcon, Shield as ShieldIcon,
  Search, ArrowRight, X
} from "lucide-react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useGlobalUI } from "@/app/admin/components/providers/global-ui-provider"
import { mockUsers, mockJournals, keywordTableData, securityLogs } from "@/app/admin/lib/mock-data"

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-medium animate-pulse">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const { openDrawer } = useGlobalUI()
  
  const query = searchParams.get("q") || ""

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    
    return {
      users: mockUsers.filter(u => 
        u.nama.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        (u.nim && u.nim.toLowerCase().includes(q))
      ),
      databases: mockJournals.filter(j => 
        j.name.toLowerCase().includes(q) || 
        j.category.toLowerCase().includes(q)
      ),
      analytics: keywordTableData.filter(k => 
        k.keyword.toLowerCase().includes(q)
      ),
      security: securityLogs.filter(s => 
        s.user.toLowerCase().includes(q) || 
        s.ip.includes(q) || 
        s.id.toLowerCase().includes(q)
      )
    }
  }, [query])

  const totalResults = results ? (results.users.length + results.databases.length + results.analytics.length + results.security.length) : 0

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">{t.startSearching || "Start searching..."}</h2>
        <p className="text-slate-500 mt-2">{t.enterKeyword || "Enter a keyword in the search bar above to find what you're looking for."}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-8 relative group">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.searchResults || "Search Results"}</h1>
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Close Search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-500 mt-2">
            {(t.showingXMatchesForY || "Showing {count} matches for {query}")
              .replaceAll("{count}", String(totalResults))
              .replaceAll("{query}", query)}
          </p>
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="py-20 text-center">
            <p className="text-xl font-semibold text-slate-400">{t.noMatchesFound || "No matches found."}</p>
           <button onClick={() => router.back()} className="mt-4 text-[#2d78f2] font-semibold hover:underline">{t.goBack || "Go back"}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
          
          {/* Users Section */}
          {results!.users.length > 0 && (
            <ResultSection title={t.users || "Users"} count={results!.users.length} icon={UserIcon}>
              <div className="grid gap-3">
                {results!.users.map(u => (
                  <div key={u.id} onClick={() => openDrawer('user', u)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-[#2d78f2] transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d78f2] to-[#2ac9fa] flex items-center justify-center text-white font-semibold text-lg">
                      {u.nama.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">{u.nama}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[10px] font-semibold text-slate-400">{u.role}</span>
                  </div>
                ))}
              </div>
            </ResultSection>
          )}

          {/* Databases Section */}
          {results!.databases.length > 0 && (
            <ResultSection title={t.databases || "Databases"} count={results!.databases.length} icon={DatabaseIcon}>
              <div className="grid gap-3">
                {results!.databases.map(j => (
                  <div key={j.id} onClick={() => openDrawer('database', j)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-[#2d78f2] transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2d78f2]">
                      <DatabaseIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">{j.name}</p>
                      <p className="text-xs text-slate-500 truncate">{j.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#2d78f2] transition-all" />
                  </div>
                ))}
              </div>
            </ResultSection>
          )}

          {/* Analytics Section */}
          {results!.analytics.length > 0 && (
            <ResultSection title={t.analyticsKeywords || "Analytics Keywords"} count={results!.analytics.length} icon={ChartIcon}>
              <div className="grid gap-3">
                {results!.analytics.map((k, i) => (
                  <div key={i} onClick={() => router.push(`/admin/analytics?keyword=${encodeURIComponent(k.keyword)}`)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-[#2d78f2] transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                      <ChartIcon className="w-6 h-6" />
                    </div>  
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">{k.keyword}</p>
                      <p className="text-xs text-slate-500 truncate">Top Faculty: {k.topFaculty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white">{k.frequency}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">usages</p>
                    </div>
                  </div>
                ))}
              </div>
            </ResultSection>
          )}

          {/* Security Section */}
          {results!.security.length > 0 && (
            <ResultSection title={t.securityLogs || "Security Logs"} count={results!.security.length} icon={ShieldIcon}>
              <div className="grid gap-3">
                {results!.security.map(s => (
                  <div key={s.id} onClick={() => openDrawer('log', s)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-[#2d78f2] transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
                      <ShieldIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white truncate">{s.user}</p>
                      <p className="text-xs text-slate-500 truncate">{s.ip} — {s.type}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </ResultSection>
          )}

        </div>
      )}
    </div>
  )
}

function ResultSection({ title, count, icon: Icon, children }: { title: string; count: number; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Icon className="w-5 h-5 text-slate-400" />
        <h3 className="font-semibold text-slate-800 dark:text-white tracking-widest text-xs flex-1">{title}</h3>
        <span className="text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{count}</span>
      </div>
      {children}
    </div>
  )
}
