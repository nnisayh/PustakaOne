"use client"
import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import Portal from "./Portal"
import { FACULTY_COLORS } from "@/app/admin/lib/mock-data"

interface MultiSelectFilterProps {
  selected: string[]
  placeholder: string
  options: string[]
  onChange: (values: string[]) => void
  labelPrefix?: string
}

export default function MultiSelectFilter({ 
  selected, 
  placeholder, 
  options, 
  onChange,
  labelPrefix
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const ref = useRef<HTMLDivElement>(null)
  const trigRef = useRef<HTMLButtonElement>(null)

  const updatePosition = () => {
    if (trigRef.current) {
      const r = trigRef.current.getBoundingClientRect()
      setStyle({ 
        position: "fixed", 
        top: r.bottom + 6, 
        left: r.left, 
        width: Math.max(r.width, 220), 
        zIndex: 9999 
      })
    }
  }

  useEffect(() => {
    if (!open) return
    
    // Initial position
    updatePosition()

    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && 
          trigRef.current && !trigRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleScroll = () => {
      updatePosition()
    }

    document.addEventListener("mousedown", h)
    // capture: true catches scrolls inside overflow containers too
    window.addEventListener("scroll", handleScroll, true)
    
    return () => {
      document.removeEventListener("mousedown", h)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [open])

  const handleToggle = () => {
    setOpen(p => !p)
  }

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  const clear = () => {
    onChange([])
    setOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        ref={trigRef}
        onClick={handleToggle}
        className={`flex items-center gap-2.5 bg-white dark:bg-[#111827] border rounded-xl px-4 py-2.5 text-sm font-medium transition-all outline-none whitespace-nowrap
          ${open ? "ring-2 ring-[#2d78f2]/20 border-[#2d78f2]" : "border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
      >
        <span className="truncate max-w-[120px]">
          {selected.length > 0 
            ? `${selected.length} ${placeholder}` 
            : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <Portal>
          <div 
            ref={ref}
            style={style} 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
          >
            <button
              onClick={clear}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] transition-colors flex items-center justify-between mb-1
                ${selected.length === 0 ? "bg-[#2d78f2] text-white font-semibold" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              All {placeholder}
              {selected.length === 0 && <Check className="w-3.5 h-3.5" />}
            </button>
            <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {options.map(opt => {
                const isSel = selected.includes(opt)
                const facultyColor = FACULTY_COLORS[opt]

                return (
                  <button
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors flex items-center justify-between group
                      ${isSel ? "bg-slate-50 dark:bg-slate-800/50 text-[#2d78f2] font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {facultyColor ? (
                        <span className={`px-[8px] py-[3px] rounded-[20px] text-[10px] font-bold ${facultyColor} shrink-0 w-fit shadow-sm`}>
                          {opt}
                        </span>
                      ) : (
                        <span>{opt}</span>
                      )}
                    </div>
                    {isSel && <Check className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
