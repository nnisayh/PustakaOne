"use client"

import React, { useState } from "react"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { 
  Download, FileText, BarChart3, Users, 
  Mail, Search, Link as LinkIcon, MousePointer2 
} from "lucide-react"

// Reuse existing logic from previous tab components
import EResourceDownloadReports from "./EResourceDownloadReports"
import TitleDownloadReports from "./TitleDownloadReports"
import DataUsageTab from "../DataUsageTab"
import SearchTab from "../SearchTab"
import EClicksTab from "../EClicksTab"

// New small specialized views would go here or be implemented inline for simplicity if they are small
import WelcomeEmailReports from "./WelcomeEmailReports"
import LibraryRecommendedTab from "../LibraryRecommendedTab"

interface AppAnalyticsViewProps {
  isDark: boolean
  chartTextColor: string
  gridColor: string
}

export default function AppAnalyticsView({ isDark, chartTextColor, gridColor }: AppAnalyticsViewProps) {
  const [subTab, setSubTab] = useState("eresource")

  const tabs = [
    { id: 'eresource', label: 'eResource Download Reports', icon: <Download className="w-4 h-4" /> },
    { id: 'title', label: 'Title Level Download Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'usage', label: 'Data Usage Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'email', label: 'Welcome Email Reports', icon: <Mail className="w-4 h-4" /> },
    { id: 'search', label: 'Search Analytics', icon: <Search className="w-4 h-4" /> },
    { id: 'links', label: 'Library Recommended Link Click Analytics', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'section', label: 'eResource Section Click Analytics', icon: <MousePointer2 className="w-4 h-4" /> },
  ]

  const tabConfigs: Record<string, any> = {
    'eresource': {
      title: 'eResource Download Reports',
      subtitle: 'Tracking individual footprint and content acquisition'
    },
    'title': {
      title: 'Title Level Download Reports',
      subtitle: 'Granular tracking of specific book and journal titles'
    },
    'usage': {
      title: 'Data Usage Reports',
      subtitle: 'Monitoring overall data consumption across all library platforms'
    },
    'email': {
      title: 'Welcome Email Performance Reports',
      subtitle: 'Tracking delivery and engagement of automated onboarding emails'
    },
    'search': {
      title: 'Search Intent Analytics',
      subtitle: 'Understanding user needs through keyword and platform search trends'
    },
    'links': {
      title: 'Recommended Link Click Analytics',
      subtitle: 'Engagement monitoring for library-curated external resources'
    },
    'section': {
      title: 'eResource Section Click Analytics',
      subtitle: 'Activity distribution across Databases, Journals, and eBooks'
    }
  }

  const currentConfig = tabConfigs[subTab]

  return (
    <div className="bg-white dark:bg-[#111827] p-6 md:p-8 xl:p-12 rounded-[32px] border border-slate-100 dark:border-slate-800/50 animate-in fade-in duration-500">
      {/* Level 2 Sub-Tabs Navigation (Database Style) */}
      <div className="flex gap-8 mb-8 overflow-x-auto scrollbar-hide relative z-10 border-b border-slate-100 dark:border-slate-800/50">
        {tabs.map((tab) => {
          const isActive = subTab === tab.id
          return (
            <button 
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2.5 pb-4 px-2 transition-all relative whitespace-nowrap group
                ${isActive ? 'text-[#0288f4] font-medium' : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {React.cloneElement(tab.icon as React.ReactElement, { 
                className: `w-5 h-5 transition-colors ${isActive ? 'text-[#0288f4]' : 'text-slate-400 group-hover:text-slate-600'}` 
              })}
              <span className="text-[16px]">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-[#0288f4] rounded-t-full shadow-[0_-1px_10px_rgba(2,136,244,0.3)] animate-in zoom-in-95 duration-300" />
              )}
            </button>
          )
        })}
      </div>

      <div className="space-y-8" key={subTab}>
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <h3 className="font-medium text-slate-800 dark:text-white text-2xl tracking-tight transition-all duration-300">{currentConfig.title}</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium transition-all duration-300">{currentConfig.subtitle}</p>
        </div>

        <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {subTab === 'eresource' && <EResourceDownloadReports isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'title' && <TitleDownloadReports isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'usage' && <DataUsageTab isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'email' && <WelcomeEmailReports isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'search' && <SearchTab isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'links' && <LibraryRecommendedTab isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
          {subTab === 'section' && <EClicksTab isDark={isDark} chartTextColor={chartTextColor} gridColor={gridColor} />}
        </div>
      </div>
    </div>
  )
}
