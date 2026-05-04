"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import {
  LayoutDashboard, Users, LineChart, BookText, ShieldCheck,
  Settings, HelpCircle, X, MoreHorizontal, Inbox
} from "lucide-react"

interface SidebarProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  isSidebarExpanded: boolean
  setIsSidebarExpanded: (expanded: boolean) => void
}

// ─── Logo SVG ────────────────────────────────────────────────────────────────
const PustakaOneLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 110 115" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="blueGrad" x1="0" y1="0" x2="110" y2="115" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2d78f2" />
        <stop offset="100%" stopColor="#2ac9fa" />
      </linearGradient>
    </defs>
    <path d="M 30 10 Q 10 10 10 25 Q 10 40 30 40 L 90 40 Q 80 25 105 10 Z" fill="url(#blueGrad)" />
    <path d="M 12 42 Q 32 42 32 57 Q 32 72 12 72 L 72 72 Q 92 72 92 57 Q 92 42 72 42 Z" fill="url(#blueGrad)" />
    <path d="M 28 74 Q 8 74 8 89 Q 8 104 28 104 L 88 104 Q 78 89 103 74 Z" fill="url(#blueGrad)" />
    <path d="M 24 10 L 38 10 L 38 52 L 31 45 L 24 52 Z" fill="#2fe0ff" />
  </svg>
)

// ─── Panel / Toggle Icon ──────────────────────────────────────────────────────
const PanelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", href: "/admin", labelKey: "dashboard" as const, icon: LayoutDashboard },
  { id: "users", href: "/admin/users", labelKey: "users" as const, icon: Users },
  { id: "analytics", href: "/admin/analytics", labelKey: "analytics" as const, icon: LineChart },
  { id: "databases", href: "/admin/databases", labelKey: "databases" as const, icon: BookText },
  { id: "security", href: "/admin/security", labelKey: "security" as const, icon: ShieldCheck },
  { id: "submissions", href: "/admin/submissions", labelKey: "submissions" as const, icon: Inbox },
]

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarExpanded,
  setIsSidebarExpanded,
}: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const navRefs = useRef<(HTMLElement | null)[]>([])
  const navContainerRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, left: 0, width: 0, height: 0, opacity: 0 })

  const prevPathname = useRef<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateIndicator = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      const activeIndex = NAV_ITEMS.findIndex(item => isActive(item.href))
      const activeEl = navRefs.current[activeIndex]
      if (!activeEl) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
        return
      }
      
      let top = activeEl.offsetTop
      let left = activeEl.offsetLeft
      
      // In collapsed mode, the ref is on the inner div, so we need to add the parent Link's offset
      if (activeEl.tagName.toLowerCase() === 'div' && activeEl.parentElement) {
        top += activeEl.parentElement.offsetTop
        left += activeEl.parentElement.offsetLeft
      }

      setIndicatorStyle({
        top,
        left,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1,
      })
    }, 150)
  }, [pathname, isSidebarExpanded, isSidebarOpen])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname
    updateIndicator()
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  }, [pathname, updateIndicator])

  useEffect(() => {
    updateIndicator()
  }, [isSidebarExpanded, isSidebarOpen, updateIndicator])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  // Mobile: sidebar show/hide via transform only
  // Desktop: sidebar expand/collapse via width only
  // Never mix the two.
  const mobileOpen = isSidebarOpen           // mobile overlay open
  const desktopExpanded = isSidebarExpanded  // desktop wide/narrow
  // For content layout (labels visible or not):
  // On desktop → follow desktopExpanded
  // On mobile  → always show full (mobileOpen controls visibility via transform)
  const showLabels = desktopExpanded         // desktop label visibility

  return (
    <aside
      className={`
        fixed top-0 bottom-0 left-0 z-50
        bg-white dark:bg-[#0f172a]
        flex flex-col overflow-visible
        lg:transition-none
        transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        ${desktopExpanded ? "lg:w-[250px]" : "lg:w-[84px]"}
        w-[250px]
        lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >

      {/* ── Logo Row ────────────────────────────────────────────────────────── */}
      <div className="h-[72px] flex items-center shrink-0 px-5 relative">

        {/* Mobile always shows expanded layout; Desktop follows desktopExpanded */}
        {(mobileOpen || desktopExpanded) ? (
          /**
           * EXPANDED — Logo + wordmark + toggle button always visible beside text
           */
          <div className="flex items-center w-full gap-2">
            {/* Logo mark navigates home */}
            <Link href="/admin" className="flex items-center gap-2.5 flex-1 min-w-0">
              <PustakaOneLogo className="w-9 h-9 shrink-0 drop-shadow-sm" />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-slate-900 dark:text-white text-[19px] whitespace-nowrap tracking-tight leading-none">
                  PustakaOne
                </span>
                <span className="text-[10px] text-[#adadad] dark:text-slate-500 font-medium whitespace-nowrap tracking-tight mt-0.5">
                  Telkom University
                </span>
              </div>
            </Link>

            {/* Collapse toggle — always visible, right beside the wordmark */}
            <button
              onClick={() => setIsSidebarExpanded(false)}
              title="Collapse sidebar"
              className="
                hidden lg:flex items-center justify-center shrink-0
                w-8 h-8
                text-[#adadad] dark:text-slate-400 hover:text-[#0288f4] dark:hover:text-[#2ac8f9]
                transition-all duration-200
              "
            >
              <PanelIcon />
            </button>

            {/* Mobile X close */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-2xl text-[#adadad] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          ) : null}

        {/* COLLAPSED (desktop only, never shown on mobile) */}
        {!mobileOpen && !desktopExpanded ? (
          /**
           * COLLAPSED — Logo icon only.
           * Hover: logo fades out, expand button fades in.
           */
          <div className="group/logo flex items-center justify-center w-full h-full">
            {/* Logo — visible by default */}
            <Link
              href="/admin"
              className="
                absolute inset-0 flex items-center justify-center
                opacity-100 group-hover/logo:opacity-0
                pointer-events-auto group-hover/logo:pointer-events-none
                transition-opacity duration-200
              "
            >
              <PustakaOneLogo className="w-9 h-9 drop-shadow-sm" />
            </Link>

            {/* Expand button — appears on hover */}
            <button
              onClick={() => setIsSidebarExpanded(true)}
              title="Expand sidebar"
              className="
                hidden lg:flex items-center justify-center
                absolute inset-0 w-full h-full
                opacity-0 group-hover/logo:opacity-100
                pointer-events-none group-hover/logo:pointer-events-auto
                transition-opacity duration-200
              "
            >
              <div className="
                flex items-center justify-center
                w-10 h-10 rounded-2xl
                bg-blue-50 dark:bg-[#2d78f2]/10
                border border-[#2d78f2]/25 dark:border-[#2ac9fa]/25
                text-[#2d78f2] dark:text-[#2ac9fa]
                transition-colors duration-150
              ">
                <PanelIcon />
              </div>
            </button>
          </div>
        ) : null}
      </div>

      {/* ── Nav Items ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navContainerRef}
        className={`
          flex-1 flex flex-col pt-8 pb-3 w-full overflow-y-auto relative
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${(mobileOpen || desktopExpanded) ? "gap-1.5 px-3" : "gap-2.5 px-2 items-center"}
        `}
      >
        {/* Sliding Indicator */}
        <div
          className={`absolute bg-gradient-to-r from-[#0288f4] to-[#2ac8f9] rounded-2xl z-0 ${mounted ? 'transition-all duration-300 ease-out' : 'transition-none'}`}
          style={{
            top: indicatorStyle.top,
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
            opacity: mounted ? indicatorStyle.opacity : 0,
            boxShadow: '0 4px 14px rgba(2,136,244,0.35)'
          }}
        />

        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const label = t[item.labelKey]

          return (mobileOpen || desktopExpanded) ? (
            /* ── Expanded nav item ── */
            <Link
              key={item.id}
              href={item.href}
              ref={el => { navRefs.current[index] = el }}
              onClick={e => { if (active) e.preventDefault() }}
              data-active-target={active ? "true" : "false"}
              className={`
                group flex items-center gap-3 px-4 py-[13px] rounded-2xl relative z-10
                transition-all duration-200 text-base font-medium
                ${active
                  ? "text-white"
                  : "text-[#adadad] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <Icon className={`w-[22px] h-[22px] shrink-0 transition-colors ${active ? "text-white" : "text-[#adadad] dark:text-slate-400"}`} />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ) : (
            /* ── Collapsed nav item ── */
            <Link
              key={item.id}
              href={item.href}
              onClick={e => { if (active) e.preventDefault() }}
              className="group flex flex-col items-center gap-1.5 w-full relative z-10"
              title={label}
            >
              <div
                ref={el => { navRefs.current[index] = el }}
                data-active-target={active ? "true" : "false"}
                className={`
                  w-11 h-11 rounded-2xl flex items-center justify-center
                  transition-all duration-200
                  ${active
                    ? "text-white"
                    : "group-hover:bg-[#f1f5f9] dark:group-hover:bg-slate-800"
                  }
              `}>
                <Icon className={`w-[26px] h-[26px] transition-colors ${active ? "text-white" : "text-[#adadad] dark:text-slate-400"}`} />
              </div>
              <span className={`text-[10px] font-medium leading-tight text-center max-w-[64px] break-words transition-colors ${active ? "text-[#2d78f2]" : "text-[#adadad] dark:text-slate-400"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom Actions ────────────────────────────────────────────────────── */}
      <div className={`
  flex flex-col shrink-0 pb-5 w-full
  border-t border-slate-100 dark:border-slate-800 pt-3
  ${(mobileOpen || desktopExpanded) ? "gap-1.5 px-3" : "gap-2.5 px-2 items-center"}
`}>
        {(mobileOpen || desktopExpanded) ? (
          <>
            <Link
              href="/admin/settings"
              className={`
          group flex items-center gap-3 px-4 py-[13px] rounded-2xl
          transition-all duration-200 text-base font-medium
          ${pathname === "/admin/settings"
                  ? "bg-gradient-to-r from-[#2d78f2] to-[#2ac9fa] text-white shadow-[0_6px_16px_rgba(45,120,242,0.30)]"
                  : "text-black hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
        `}
            >
              <Settings className={`w-[22px] h-[22px] shrink-0 ${pathname === "/admin/settings" ? "text-white" : "text-black"}`} />
              <span className="whitespace-nowrap">{t.settings}</span>
            </Link>

            <button className="group flex items-center gap-3 px-4 py-[13px] rounded-2xl w-full text-black hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 text-base font-medium">
              <HelpCircle className="w-[22px] h-[22px] shrink-0 text-black" />
              <span className="whitespace-nowrap">{t.helpSupport}</span>
            </button>
          </>
        ) : (
          /* Collapsed — "···" More with flyout */
          <div className="relative group/more flex flex-col items-center w-full px-2">
            <button className="flex flex-col items-center gap-1.5 w-full group/btn outline-none">
              <div className="
                w-11 h-11 rounded-2xl flex items-center justify-center 
                transition-all duration-300
                bg-transparent group-hover/more:bg-slate-100 dark:group-hover/more:bg-slate-800
                text-slate-400 group-hover/more:text-[#0288f4]
              ">
                <MoreHorizontal className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover/more:text-slate-600 dark:group-hover/more:text-slate-300 leading-none transition-colors">
                {t.more || "More"}
              </span>
            </button>

            {/* Flyout Menu */}
            <div className="
              absolute left-[70px] bottom-0 w-52
              bg-white dark:bg-slate-900
              border border-slate-100 dark:border-slate-800/60
              shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]
              rounded-[24px] p-2 z-[60]
              opacity-0 invisible pointer-events-none
              group-hover/more:opacity-100 group-hover/more:visible group-hover/more:pointer-events-auto
              translate-x-3 group-hover/more:translate-x-0
              transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
            ">
              <Link href="/admin/settings" className="flex items-center gap-3.5 px-4 py-3 text-[15px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group/item">
                <Settings className="w-[22px] h-[22px] text-slate-400 group-hover/item:text-[#0288f4] transition-colors" /> 
                <span>{t.settings}</span>
              </Link>
              <button className="w-full flex items-center gap-3.5 px-4 py-3 text-[15px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all mt-1 group/item">
                <HelpCircle className="w-[22px] h-[22px] text-slate-400 group-hover/item:text-[#0288f4] transition-colors" /> 
                <span>{t.helpSupport || "Help"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
