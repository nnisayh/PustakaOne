"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar as CalendarIcon, ChevronDown, Check, ChevronLeft, ChevronRight, Download, FileText, Table, FileJson, X } from "lucide-react"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { useLanguage } from "@/app/admin/components/providers/language-provider"

export type DateMode = 'single' | 'range'
export type Granularity = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
export type ExportFormat = 'PDF' | 'CSV' | 'Excel'

interface DashboardFiltersProps {
  dateMode: DateMode
  setDateMode: (mode: DateMode) => void
  singleDate: Date | null
  setSingleDate: (date: Date | null) => void
  dateRange: { start: Date | null; end: Date | null }
  setDateRange: (range: { start: Date | null; end: Date | null }) => void
  granularity: Granularity
  setGranularity: (g: Granularity) => void
  onExport: (format: ExportFormat) => void
  onFilterChange: () => void
}

export default function DashboardFilters({
  dateMode, setDateMode,
  singleDate, setSingleDate,
  dateRange, setDateRange,
  granularity, setGranularity,
  onExport, onFilterChange
}: DashboardFiltersProps) {
  const { t, lang } = useLanguage()
  const GRANULARITIES: Granularity[] = ['Daily', 'Weekly', 'Monthly', 'Yearly']
  const GRANULARITY_LABELS: Record<Granularity, string> = {
    Daily: t.daily,
    Weekly: t.weekly,
    Monthly: t.monthly,
    Yearly: t.yearly
  }

  const EXPORT_FORMATS = [
    { id: 'PDF', icon: FileText, label: t.exportAsPDF },
    { id: 'CSV', icon: Table, label: t.exportAsCSV },
    { id: 'Excel', icon: FileJson, label: t.exportAsExcel },
  ]

  const MONTHS = [t.january, t.february, t.march, t.april, t.may, t.june, t.july, t.august, t.september, t.october, t.november, t.december]
  const SHORT_MONTHS = [t.janShort, t.febShort, t.marShort, t.aprShort, t.mayShort, t.junShort, t.julShort, t.augShort, t.sepShort, t.octShort, t.novShort, t.decShort]
  const DAYS = [t.sunShort, t.monShort, t.tueShort, t.wedShort, t.thuShort, t.friShort, t.satShort]
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGranularity, setShowGranularity] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [tempStart, setTempStart] = useState<Date | null>(dateRange.start)
  const [tempEnd, setTempEnd] = useState<Date | null>(dateRange.end)

  // Granularity UI State
  const [tempGranularity, setTempGranularity] = useState<Granularity>(granularity)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewDecadeStart, setViewDecadeStart] = useState(() => Math.floor(new Date().getFullYear() / 8) * 8)

  const calRef = useRef<HTMLDivElement>(null)
  const granRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calRef.current && !calRef.current.contains(event.target as Node)) setShowCalendar(false)
      if (granRef.current && !granRef.current.contains(event.target as Node)) setShowGranularity(false)
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) setShowExport(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sync when Granularity Dropdown opens
  useEffect(() => {
    if (showGranularity) setTempGranularity(granularity)
  }, [showGranularity, granularity])

  // Sync temp local range
  useEffect(() => {
    setTempStart(dateRange.start)
    setTempEnd(dateRange.end)
  }, [dateRange, showCalendar])

  const autoSuggestGranularity = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) setGranularity('Daily')
    else if (diffDays >= 1 && diffDays <= 14) setGranularity('Weekly')
    else if (diffDays >= 15 && diffDays <= 90) setGranularity('Monthly')
    else setGranularity('Yearly')
  }

  const getSmartDateLabel = () => {
    if (dateMode === 'single' && singleDate) {
      return singleDate.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: singleDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
    }

    if (dateMode === 'range' && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)

      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (diffDays === 0) return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      if (diffDays === 6 && end.getTime() === today.getTime()) return t.last7Days

      const startIsFirst = start.getDate() === 1
      const endIsLast = end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()
      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()

      if (startIsFirst && endIsLast) {
        if (sameMonth) return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        else {
          const sMonth = start.toLocaleDateString('en-US', { month: 'short' })
          const eMonth = end.toLocaleDateString('en-US', { month: 'short' })
          return `${sMonth} - ${eMonth} ${end.getFullYear()}`
        }
      }

      if (start.getMonth() === 0 && start.getDate() === 1 && end.getMonth() === 11 && end.getDate() === 31) {
        if (start.getFullYear() === end.getFullYear()) return `${start.getFullYear()}`
      }

      return `${start.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}`
    }

    return dateMode === 'single' ? t.selectDate : t.selectRange
  }

  // --- Calendar logic ---
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); setCurrentYear(currentYear - 1)
    } else setCurrentMonth(currentMonth - 1)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); setCurrentYear(currentYear + 1)
    } else setCurrentMonth(currentMonth + 1)
  }

  const handleDayClick = (dayStr: number) => {
    const clickedDate = new Date(currentYear, currentMonth, dayStr)
    clickedDate.setHours(0, 0, 0, 0)

    if (dateMode === 'single') {
      setSingleDate(clickedDate)
      setShowCalendar(false)
      autoSuggestGranularity(clickedDate, clickedDate)
      onFilterChange()
    } else {
      if (tempGranularity === 'Weekly') {
        const endObj = new Date(clickedDate)
        endObj.setDate(clickedDate.getDate() + 6)
        setTempStart(clickedDate)
        setTempEnd(endObj)
      } else {
        if (!tempStart || (tempStart && tempEnd)) {
          setTempStart(clickedDate)
          setTempEnd(null)
        } else if (tempStart && !tempEnd) {
          if (clickedDate < tempStart) {
            setTempEnd(tempStart)
            setTempStart(clickedDate)
          } else {
            setTempEnd(clickedDate)
          }
        }
      }
    }
  }

  const handleApplyRange = () => {
    if (tempStart && tempEnd) {
      setDateRange({ start: tempStart, end: tempEnd })
      setShowCalendar(false)
      autoSuggestGranularity(tempStart, tempEnd)
      onFilterChange()
    }
  }

  const generateDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} className="w-8 h-8" />)
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const d = new Date(currentYear, currentMonth, day)
      d.setHours(0, 0, 0, 0)

      let isSelected = false, isBetween = false, isStart = false, isEnd = false
      if (dateMode === 'single') isSelected = singleDate?.getTime() === d.getTime()
      else {
        isStart = tempStart?.getTime() === d.getTime()
        isEnd = tempEnd?.getTime() === d.getTime()
        isSelected = isStart || isEnd
        if (tempStart && tempEnd) isBetween = d > tempStart && d < tempEnd
      }

      return (
        <button
          key={`day-${day}`}
          onClick={() => handleDayClick(day)}
          className={`w-8 h-8 rounded-full text-[13px] font-medium transition-colors relative
            ${isSelected ? 'bg-[#2d78f2] text-white z-10 shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 z-10'}`}
        >
          {isBetween && <div className="absolute inset-y-0 left-[-4px] right-[-4px] bg-[#2d78f2]/10 dark:bg-[#2d78f2]/20 z-0" />}
          {isStart && tempEnd && tempStart.getTime() !== tempEnd.getTime() && <div className="absolute inset-y-0 right-[-4px] w-1/2 bg-[#2d78f2]/10 dark:bg-[#2d78f2]/20 z-0" />}
          {isEnd && tempStart && tempStart.getTime() !== tempEnd.getTime() && <div className="absolute inset-y-0 left-[-4px] w-1/2 bg-[#2d78f2]/10 dark:bg-[#2d78f2]/20 z-0" />}
          <span className="relative z-20">{day}</span>
        </button>
      )
    })
    return [...blanks, ...days]
  }

  const renderGranularityContext = () => {
    const navContainerClass = "flex justify-center items-center gap-4 mb-5 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl mx-1"
    const navButtonClass = "w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#2d78f2] text-slate-400 hover:text-[#2d78f2] transition-all"
    const navTextClass = "text-[14px] font-semibold text-slate-800 dark:text-white min-w-[100px] text-center tracking-tight"

    let content = null

    if (tempGranularity === 'Daily' || tempGranularity === 'Weekly') {
      content = (
        <div className="py-2 px-1 text-center">
          <div className={navContainerClass}>
            <button onClick={handlePrevMonth} className={navButtonClass}><ChevronLeft className="w-4 h-4" /></button>
            <span className={navTextClass}>{MONTHS[currentMonth]} {currentYear}</span>
            <button onClick={handleNextMonth} className={navButtonClass}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 place-items-center gap-y-1">
            {DAYS.map(d => <span key={d} className="text-[10px] font-semibold text-slate-400 w-8 text-center mb-1 opacity-50">{d[0]}</span>)}
            {generateDays()}
          </div>
          <p className="mt-4 text-[11px] font-semibold text-slate-400 tracking-widest opacity-60">
            {tempGranularity === 'Daily' ? 'Select a single date' : 'Select any date to pick that week'}
          </p>
        </div>
      )
    } else if (tempGranularity === 'Monthly') {
      content = (
        <div>
          <div className={navContainerClass}>
            <button onClick={() => setViewYear(y => y - 1)} className={navButtonClass}><ChevronLeft className="w-4 h-4" /></button>
            <span className={navTextClass}>{viewYear}</span>
            <button onClick={() => setViewYear(y => y + 1)} className={navButtonClass}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SHORT_MONTHS.map((m, idx) => (
              <button
                key={m}
                onClick={() => {
                  const start = new Date(viewYear, idx, 1)
                  const end = new Date(viewYear, idx + 1, 0)
                  setDateMode('range')
                  setDateRange({ start, end })
                  setGranularity('Monthly')
                  setShowGranularity(false)
                  onFilterChange()
                }}
                className="py-2.5 px-1 text-[13px] font-semibold text-center rounded-xl bg-slate-50 hover:bg-[#2d78f2] hover:text-white hover:shadow-md dark:bg-slate-800/50 dark:hover:bg-[#2d78f2] dark:text-slate-300 transition-all"
              >{m}</button>
            ))}
          </div>
        </div>
      )
    } else if (tempGranularity === 'Yearly') {
      const years = Array.from({ length: 8 }, (_, i) => viewDecadeStart + i)
      content = (
        <div>
          <div className={navContainerClass}>
            <button onClick={() => setViewDecadeStart(y => y - 8)} className={navButtonClass}><ChevronLeft className="w-4 h-4" /></button>
            <span className={navTextClass}>{viewDecadeStart} - {viewDecadeStart + 7}</span>
            <button onClick={() => setViewDecadeStart(y => y + 8)} className={navButtonClass}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => {
                  const start = new Date(y, 0, 1)
                  const end = new Date(y, 11, 31)
                  setDateMode('range')
                  setDateRange({ start, end })
                  setGranularity('Yearly')
                  setShowGranularity(false)
                  onFilterChange()
                }}
                className="py-3 px-1 text-[12px] font-semibold text-center rounded-xl bg-slate-50 hover:bg-[#2d78f2] hover:text-white hover:shadow-md dark:bg-slate-800/50 dark:hover:bg-[#2d78f2] dark:text-slate-300 transition-all"
              >{y}</button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {content}
        <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
          <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            {t.granularityNote?.replace("{granularity}", GRANULARITY_LABELS[tempGranularity]) || `Updating granularity to ${tempGranularity}`}
          </p>
          <button
            onClick={() => {
              setGranularity(tempGranularity)
              setShowGranularity(false)
              if (tempGranularity === 'Weekly' && tempStart && tempEnd) {
                setDateRange({ start: tempStart, end: tempEnd })
              }
              onFilterChange()
            }}
            className="w-full mt-3 py-2.5 bg-[#2d78f2] text-white rounded-xl text-[13px] font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all tracking-widest"
          >
            {t.apply || "Apply"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 relative z-50">
      {/* Date & Granularity Pill */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl h-10 px-1 transition-all relative z-[60]">

        {/* Calendar Trigger */}
        <div className="relative" ref={calRef} style={{ isolation: 'isolate' }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group h-full"
          >
            <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-[#2d78f2] transition-colors" />
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{getSmartDateLabel()}</span>
          </button>

          {/* Custom Calendar Dropdown */}
          {showCalendar && (
            <div className="absolute top-full right-0 md:right-auto md:left-0 mt-3 w-[300px] min-h-[360px] flex flex-col bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[70]">

              {/* Mode Toggle */}
              <div className="mb-4">
                <AnimatedTabs
                  tabs={[{ id: 'single', label: t.singleDate }, { id: 'range', label: t.dateRange }]}
                  activeId={dateMode}
                  onChange={(id) => setDateMode(id as 'single' | 'range')}
                />
              </div>

              {/* Header: Navigasi Bulan */}
              <div className="flex justify-center items-center gap-6 mb-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mx-1">
                <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#2d78f2] text-slate-400 hover:text-[#2d78f2] transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[14px] font-semibold text-slate-800 dark:text-white w-32 text-center tracking-tight">{MONTHS[currentMonth]} {currentYear}</span>
                <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#2d78f2] text-slate-400 hover:text-[#2d78f2] transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 place-items-center gap-y-1">
                {DAYS.map(d => <span key={d} className="text-[11px] font-semibold text-slate-400 w-8 text-center mb-2">{d}</span>)}
                {generateDays()}
              </div>

              {/* Actions (Opacity Toggle to maintain fixed layout height) */}
              <div className={`mt-auto flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 transition-all duration-300 ${dateMode === 'range' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                <button onClick={() => setShowCalendar(false)} className="flex-1 py-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  {t.cancel}
                </button>
                <button onClick={handleApplyRange} className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#2d78f2] hover:bg-[#2ac9fa] rounded-xl shadow-sm transition-colors">
                  {t.apply}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0" />

        {/* Granularity Dropdown Base */}
        <div className="relative" ref={granRef} style={{ isolation: 'isolate' }}>
          <button
            onClick={() => setShowGranularity(!showGranularity)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group h-full"
          >
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{GRANULARITY_LABELS[granularity]}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showGranularity && (
          <div className="absolute top-full right-0 mt-3 w-[320px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-6 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wide">{t.updateGranularity}</h4>
                <button onClick={() => setShowGranularity(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <AnimatedTabs
                  tabs={GRANULARITIES.map(g => ({ id: g, label: GRANULARITY_LABELS[g] }))}
                  activeId={tempGranularity}
                  onChange={(id) => setTempGranularity(id as 'Daily' | 'Weekly' | 'Monthly' | 'Yearly')}
                  tabClassName="py-1.5 text-[12px] font-semibold transition-colors flex items-center justify-center"
                />
              </div>

              {renderGranularityContext()}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Export Pill */}
      <div className="relative" ref={exportRef} style={{ isolation: 'isolate' }}>
        <button
          onClick={() => setShowExport(!showExport)}
          className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors font-semibold text-[13px] text-slate-700 dark:text-slate-200 relative z-50 h-10"
        >
          <span>{t.exports}</span>
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

        {showExport && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-[70] py-2 animate-in slide-in-from-top-2 duration-200">
            {EXPORT_FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onExport(f.id as any)
                  setShowExport(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <f.icon className="w-4 h-4 text-slate-400" />
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
