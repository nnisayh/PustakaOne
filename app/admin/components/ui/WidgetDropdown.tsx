"use client"
import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react"
import Portal from "../shared/Portal"

interface WidgetDropdownProps {
  value: string
  options: string[]
  onChange: (val: string) => void
  icon?: React.ReactNode
}

export function WidgetDropdown({ value, options, onChange, icon }: WidgetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const trigRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (trigRef.current) {
      const r = trigRef.current.getBoundingClientRect()
      setStyle({
        position: "fixed",
        top: r.bottom + 8,
        left: r.left,
        minWidth: Math.max(r.width, 160),
        zIndex: 9999
      })
    }
  }

  useEffect(() => {
    if (!isOpen) return
    
    updatePosition()

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && 
          trigRef.current && !trigRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => updatePosition()

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <button
        ref={trigRef}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/60 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors outline-none"
      >
        {icon && (
          <span className="text-slate-400">
            {icon === 'calendar' ? <CalendarIcon className="w-4 h-4" /> : icon}
          </span>
        )}
        {value}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <Portal>
          <div 
            ref={menuRef}
            style={style}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex flex-col gap-1">
              {options.map((opt, idx) => (
                <button
                  key={`${opt}-${idx}`}
                  onClick={() => {
                    onChange(opt)
                    setIsOpen(false)
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-[13px] transition-colors ${
                    value === opt
                      ? "bg-[#2d78f2] text-white font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  }`}
                >
                  {opt || <span className="opacity-0">Empty</span>}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
