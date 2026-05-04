"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { institutions } from "@/lib/institutions"



export default function SelectInstitutionPage() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { lang, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [user, setUser] = useState<{ nama: string; email: string } | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null)
  const [recentPicks, setRecentPicks] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const savedRecents = localStorage.getItem("recentInstitutions")
    if (savedRecents) {
      try {
        setRecentPicks(JSON.parse(savedRecents))
      } catch (e) {
        // Ignore json parse error
      }
    }
  }, [])

  // Derive the list of recent institutions to display
  const recentInstitutionsList = recentPicks.length > 0
    ? recentPicks.map(name => institutions.find(i => i.name === name)).filter(Boolean) as typeof institutions
    : institutions.filter((i) => i.recent)

  const filteredInstitutions = search.trim()
    ? institutions.filter(
      (inst) =>
        inst.name.toLowerCase().startsWith(search.toLowerCase()) ||
        (inst.city && inst.city.toLowerCase().startsWith(search.toLowerCase()))
    )
    : recentInstitutionsList

  const handleSelect = (name: string) => {
    setSelectedInstitution(name)
    setSearch(name)
  }

  const handleContinue = () => {
    if (selectedInstitution) {
      localStorage.setItem("selectedInstitution", selectedInstitution)

      // Save to recent picks
      const savedRecents = localStorage.getItem("recentInstitutions")
      let recents: string[] = []
      if (savedRecents) {
        try {
          recents = JSON.parse(savedRecents)
        } catch (e) { }
      }
      recents = [selectedInstitution, ...recents.filter(name => name !== selectedInstitution)].slice(0, 3)
      localStorage.setItem("recentInstitutions", JSON.stringify(recents))
    }
    router.push("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0B1120] text-on-surface dark:text-slate-100 font-body transition-colors duration-300">
      {/* TopNavBar */}
      <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/20 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-screen-2xl mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-headline italic text-primary dark:text-blue-100 tracking-tight">
              PustakaONE
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-slate-200 font-label text-xs uppercase tracking-widest transition-colors">
                  <span>{lang === 'id' ? 'ID' : 'EN'}</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded overflow-hidden border border-slate-100 dark:border-slate-700">
                  <button onClick={() => setLanguage('en')} className="w-full text-left block px-4 py-3 text-primary dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-label text-xs tracking-widest border-b border-slate-100 dark:border-slate-700 transition-colors">
                    ENGLISH
                  </button>
                  <button onClick={() => setLanguage('id')} className="w-full text-left block px-4 py-3 text-primary dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-label text-xs tracking-widest transition-colors">
                    INDONESIA
                  </button>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 transition-colors flex items-center"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Dark Mode"
              >
                <span className="material-symbols-outlined text-xl">
                  {mounted && resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Split Screen */}
      <main className="flex-grow flex overflow-hidden">
        {/* Left Section: Image Background Hero */}
        <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0A1325]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg-stars.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1325] via-[#0A1325]/40 to-transparent opacity-90" />

          <div className="relative z-10 flex h-full flex-col justify-end px-12 xl:px-20 pb-32">
            <div className="max-w-lg">
              <h1 className="font-headline text-4xl lg:text-5xl text-white leading-tight mb-6">
                {t.instTitle || "Find Your Institution"}
              </h1>
              <p className="text-base text-slate-300/90 leading-relaxed mb-12 font-light max-w-sm">
                {t.instDesc || "Connect to your academic resources and unlock seamless access to the world's most prestigious editorial archives."}
              </p>

              <div className="flex items-center gap-6">
                <span className="h-[1px] w-12 bg-slate-500/50" />
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-slate-400">{t.libSys || "Library Access Systems"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Institution Search */}
        <section className="w-full lg:w-1/2 bg-surface-container-lowest dark:bg-slate-900 flex items-center justify-center px-6 md:px-12 py-10 transition-colors">
          <div className="w-full max-w-xl h-[80vh] min-h-[500px] max-h-[760px] flex flex-col rounded-[2rem] bg-white dark:bg-slate-950 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 p-8 md:p-10">
            <div className="mb-6 shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 dark:bg-slate-900 text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 px-4 py-2 mb-4">
                <span className="material-symbols-outlined text-base">school</span>
                {t.instAccess || "Institution access"}
              </div>
              <h2 className="font-headline text-3xl md:text-4xl text-on-surface dark:text-white leading-tight mb-3">
                {t.accessLib || "Access Library Services"}
              </h2>
              <p className="font-body text-sm md:text-base text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {t.accessLibDesc || "Sign in through your university or college to access subscribed content."}
              </p>
            </div>

            <div className="relative mb-6 shrink-0">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant dark:text-slate-500">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                id="institution-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchInst || "Search your university or college..."}
                className="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-surface-container-high dark:bg-slate-900 py-4 pl-14 pr-4 text-sm text-on-surface dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/30 transition-shadow shadow-sm"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("")
                    setSelectedInstitution(null)
                  }}
                  className="absolute right-4 inset-y-0 flex items-center text-on-surface-variant dark:text-slate-500 hover:text-primary dark:hover:text-blue-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>

            <div className="flex flex-col flex-1 min-h-0 mb-6">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <p className="font-label text-[10px] uppercase tracking-[0.35em] text-on-surface-variant dark:text-slate-500">
                  {search.trim() ? `${t.results || "Results"} (${filteredInstitutions.length})` : (t.recentAccess || "Recently accessed")}
                </p>
              </div>

              <div className="grid gap-3 overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((inst) => {
                    const isSelected = selectedInstitution === inst.name
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => handleSelect(inst.name)}
                        onMouseEnter={() => setHoveredId(inst.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`w-full flex items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-200 ${isSelected
                          ? "border-primary/40 bg-primary/5 dark:bg-blue-500/10"
                          : hoveredId === inst.id
                            ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900"
                            : "border-slate-200 bg-surface-container-high dark:border-slate-700 dark:bg-slate-900"
                          }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 dark:bg-blue-500/10 text-primary dark:text-blue-300 shadow-sm overflow-hidden p-1.5">
                          {inst.icon.includes(".") || inst.icon.includes("/") ? (
                            <img src={inst.icon} alt={inst.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="material-symbols-outlined text-xl">{inst.icon}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-body font-semibold text-on-surface dark:text-slate-100 truncate">
                            {inst.name}
                          </p>
                          <p className="font-label text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                            {inst.city}
                          </p>
                        </div>
                        <span className={`material-symbols-outlined transition-transform ${hoveredId === inst.id ? "text-primary dark:text-blue-300 translate-x-1" : "text-slate-400 dark:text-slate-500"}`}>
                          chevron_right
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <div className="flex items-center gap-4 rounded-3xl border border-slate-200 dark:border-slate-700 bg-surface-container-high dark:bg-slate-900 p-4 text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400">
                      <span className="material-symbols-outlined text-xl">search_off</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-semibold text-on-surface-variant truncate mb-0.5">
                        {t.noInstFound || "No institutions found for"} “{search}”
                      </p>
                      <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 truncate">
                        {t.tryAnother || "Try another keyword"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 shrink-0">
              <button
                id="archive-credentials-btn"
                onClick={handleContinue}
                disabled={!selectedInstitution}
                className={`w-full rounded-3xl font-label text-xs uppercase tracking-widest py-4 transition-all duration-200 shadow-lg ${selectedInstitution
                  ? "bg-primary dark:bg-blue-700 text-on-primary hover:bg-primary/90 dark:hover:bg-blue-600 shadow-primary/10 dark:shadow-blue-500/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                  }`}
              >
                {t.continueBtn || "Continue"}
              </button>
              <p className="text-center text-[11px] text-on-surface-variant/80 leading-relaxed">
                {t.authAccessMsg || "Authorized access only. By continuing, you agree to our"}{' '}
                <a href="#" className="underline hover:text-primary dark:hover:text-blue-300 transition-colors">
                  {t.archPolicy || "Archive Policy"}
                </a>{' '}
                {t.instTerms || "and institutional terms."}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Tray */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/20 dark:border-slate-700/50 z-50 transition-colors">
        <div className="flex items-center gap-2.5 pr-6 border-r border-outline-variant/30 dark:border-slate-700">
          <span className="material-symbols-outlined text-primary dark:text-blue-400 text-base">info</span>
          <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant dark:text-slate-500">
            {t.support || "Support"}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary dark:text-blue-400 text-base">policy</span>
          <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant dark:text-slate-500">
            {t.archPolicy || "Archive Policy"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 pl-6 border-l border-outline-variant/30 dark:border-slate-700">
          <span
            className="material-symbols-outlined text-tertiary dark:text-amber-400 text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
          <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant dark:text-slate-500">
            {t.portal || "PustakaONE Portal"}
          </span>
        </div>
      </div>
    </div>
  )
}
