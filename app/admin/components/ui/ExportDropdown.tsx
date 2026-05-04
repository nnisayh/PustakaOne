"use client"
import React, { useState, useRef, useEffect } from "react"
import { Download, ChevronDown, File, FileText, FileSpreadsheet } from "lucide-react"

interface ExportDropdownProps {
  onExport: (fmt: string) => void
}

import Portal from "../shared/Portal"

interface ExportDropdownProps {
  onExport: (fmt: string) => void
}

export function ExportDropdown({ onExport }: ExportDropdownProps) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const trigRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const formats = [
    { label: "Export PDF", icon: File, fmt: "PDF" },
    { label: "Export CSV", icon: FileText, fmt: "CSV" },
    { label: "Export Excel", icon: FileSpreadsheet, fmt: "Excel" }
  ]

  const updatePosition = () => {
    if (trigRef.current) {
      const r = trigRef.current.getBoundingClientRect()
      setStyle({
        position: "fixed",
        top: r.bottom + 8,
        left: r.left - (176 - r.width), // Align right (assuming 176px width)
        width: 176,
        zIndex: 9999
      })
    }
  }

  useEffect(() => {
    if (!open) return
    
    updatePosition()

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          trigRef.current && !trigRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleScroll = () => updatePosition()

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={trigRef}
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
      >
        <Download className="w-4 h-4" /> Export <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <Portal>
          <div 
            ref={menuRef}
            style={style}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-150"
          >
            {formats.map(({ label, icon: Icon, fmt }) => (
              <button
                key={fmt}
                onClick={() => { onExport(fmt); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors outline-none"
              >
                <Icon className="w-4 h-4 text-slate-400" /> {label}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  )
}
