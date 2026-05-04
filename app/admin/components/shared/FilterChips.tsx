"use client"
import React from "react"
import { X, RotateCcw } from "lucide-react"

interface Chip {
  category: string
  value: string
  onClear: () => void
}

interface FilterChipsProps {
  chips: Chip[]
  onResetAll: () => void
}

export default function FilterChips({ chips, onResetAll }: FilterChipsProps) {
  if (chips.length === 0) return null

  // Function to determine the entire style set for a chip based on its type/value
  const getChipStyle = (category: string, value: string) => {
    const cat = category.toUpperCase()
    const val = value.trim()

    // 1. STATUS & DYNAMIC LOGIC (Traffic Light)
    if (cat === "STATUS") {
      if (val === "Active" || val === "Success" || val === "OK" || val === "Approved") 
        return "bg-emerald-50 border-emerald-100 text-emerald-600"
      if (val === "Inactive")          
        return "bg-slate-50 border-slate-100 text-slate-500"
      if (val === "Pending")          
        return "bg-amber-50 border-amber-100 text-amber-600"
      if (val === "Maintenance")          
        return "bg-orange-50 border-orange-100 text-orange-600"
      if (val === "Rejected" || val === "Blocked" || val === "Failed" || val === "FAIL" || val === "Down") 
        return "bg-rose-50 border-rose-100 text-rose-600"
    }

    // 2. FACULTY COLORS (Brand Themed)
    if (cat === "FACULTY") {
      const facultyMap: Record<string, string> = {
        FTE: "bg-blue-50 border-blue-100 text-blue-600",
        FRI: "bg-emerald-50 border-emerald-100 text-emerald-600",
        FIF: "bg-amber-50 border-amber-100 text-amber-600",
        FEB: "bg-teal-50 border-teal-100 text-teal-600",
        FKB: "bg-purple-50 border-purple-100 text-purple-600",
        FIT: "bg-cyan-50 border-cyan-100 text-cyan-600",
        FIK: "bg-orange-50 border-orange-100 text-orange-600",
      }
      return facultyMap[val] || "bg-slate-50 border-slate-100 text-slate-500"
    }

    // 3. ROLE COLORS (Requested Specific Palettes)
    if (cat === "ROLE") {
      if (val === "Mahasiswa S1") return "bg-blue-50 border-blue-100 text-[#2563EB]"
      if (val === "Mahasiswa S2") return "bg-sky-50 border-sky-100 text-[#38BDF8]"
      if (val === "Dosen")        return "bg-blue-50/50 border-blue-100/50 text-[#93C5FD]"
      if (val === "Staff")        return "bg-indigo-50/50 border-indigo-100/50 text-[#BFDBFE]"
    }

    // 4. TYPE (Submissions — Article Request)
    if (cat === "TYPE") {
      if (val === "Manual Request") return "bg-blue-50 border-blue-100 text-blue-600"
      if (val === "Auto Request")   return "bg-purple-50 border-purple-100 text-purple-600"
    }

    // 5. CATEGORY (Submissions — Purchase Suggestion)
    if (cat === "CATEGORY") {
      if (val === "eBook")   return "bg-teal-50 border-teal-100 text-teal-600"
      if (val === "Journal") return "bg-orange-50 border-orange-100 text-orange-600"
    }

    // Default Fallback
    return "bg-slate-50 border-slate-100 text-slate-500"
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
      {chips.map((chip, i) => {
        const styleClasses = getChipStyle(chip.category, chip.value)
        
        return (
          <div 
            key={`${chip.category}-${chip.value}-${i}`}
            className={`flex items-center gap-1.5 px-[12px] py-[6px] border rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:brightness-95 group ${styleClasses}`}
          >
            <span className="opacity-60 text-[12px] font-semibold tracking-tight">
              {chip.category}:
            </span>
            <span className="text-[12px] font-bold tracking-tight">
              {chip.value}
            </span>
            <button 
              onClick={chip.onClear}
              className="ml-1 p-0.5 opacity-60 hover:opacity-100 transition-opacity rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
      
      <button 
        onClick={onResetAll}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#DC2626] hover:text-[#B91C1C] transition-all group"
      >
        <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:rotate-[-45deg]" />
        RESET ALL
      </button>
    </div>
  )
}
