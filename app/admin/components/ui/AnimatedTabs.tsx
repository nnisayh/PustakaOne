"use client"

import React from "react"

export interface TabItem {
  id: string
  label: string
}

interface AnimatedTabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  containerClassName?: string
  activePillClassName?: string
  tabClassName?: string
  activeTabClassName?: string
  inactiveTabClassName?: string
}

export function AnimatedTabs({
  tabs,
  activeId,
  onChange,
  containerClassName = "bg-slate-100 dark:bg-slate-800 rounded-xl p-1",
  activePillClassName = "bg-white dark:bg-[#111827] shadow-sm rounded-lg",
  tabClassName = "py-1.5 px-4 text-[13px] font-semibold transition-colors flex items-center justify-center whitespace-nowrap",
  activeTabClassName = "text-slate-800 dark:text-white",
  inactiveTabClassName = "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
}: AnimatedTabsProps) {
  const activeIndex = tabs.findIndex(t => t.id === activeId)
  const safeIndex = activeIndex === -1 ? 0 : activeIndex

  return (
    <div 
      className={`relative grid z-0 w-full ${containerClassName}`}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {/* Sliding Background Pill */}
      <div 
        className={`absolute top-1 bottom-1 z-0 ${activePillClassName} transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        style={{
          width: `calc(100% / ${tabs.length} - 8px)`,
          left: `calc(${safeIndex} * 100% / ${tabs.length} + 4px)`,
        }}
      />
      
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 bg-transparent ${tabClassName} ${isActive ? activeTabClassName : inactiveTabClassName}`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
