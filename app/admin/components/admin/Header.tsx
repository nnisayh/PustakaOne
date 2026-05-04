"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import {
  Search, Bell, Sun, Moon, ShieldCheck, Database, UserPlus, Menu,
  ChevronDown, Clock, LogOut, Settings, User, Globe
} from "lucide-react"
import GlobalSearch from "./GlobalSearch"

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void
}

export default function Header({ setIsSidebarOpen }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { lang, t, setLanguage } = useLanguage()
  const { history, markAllRead, clearHistory } = useNotifications()
  const router = useRouter()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const unreadCount = history.filter(n => n.unread).length
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  const isDark = resolvedTheme === 'dark'

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/admin-login');
      router.refresh();
    } catch (e) {
      router.push('/admin-login');
    }
  };

  return (
    <header className="
      relative z-30
      bg-[#f6f6f6] dark:bg-[#0f172a]
      px-6 h-[72px] mb-2
      flex items-center justify-between
      shrink-0
    ">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <GlobalSearch />
      </div>

      {/* Right: theme + lang + bell + profile */}
      <div className="flex items-center gap-1">

        {/* Theme + Language + Bell — grouped pill */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-2 py-1.5 gap-1.5 mr-2 shadow-sm">

          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifications(false); setShowProfileMenu(false) }}
              className="w-8 h-8 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-[18px] h-[18px]" />
            </button>
            {showLangMenu && (
              <div className="absolute top-full mt-2 right-0 w-36 bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex flex-col p-1.5">
                  <button onClick={() => { setLanguage('id'); setShowLangMenu(false) }} className={`px-3 py-2 text-left text-[13px] font-medium flex items-center justify-between rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${lang === 'id' ? 'text-[#2d78f2]' : 'text-slate-600 dark:text-slate-400'}`}>
                    🇮🇩 Indonesia
                    {lang === 'id' && <div className="w-1.5 h-1.5 rounded-full bg-[#2d78f2]" />}
                  </button>
                  <button onClick={() => { setLanguage('en'); setShowLangMenu(false) }} className={`px-3 py-2 text-left text-[13px] font-medium flex items-center justify-between rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${lang === 'en' ? 'text-[#2d78f2]' : 'text-slate-600 dark:text-slate-400'}`}>
                    🇺🇸 English
                    {lang === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-[#2d78f2]" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowLangMenu(false); setShowProfileMenu(false) }}
              className="relative w-8 h-8 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2d78f2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-[#2d78f2]"></span>
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white text-sm">{t.notifications ?? "Notifications"}</h4>
                    <p className="text-xs text-[#adadad] mt-0.5">{unreadCount === 0 ? "You're all caught up" : `${unreadCount} unread messages`}</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] font-semibold text-[#2d78f2] hover:underline">Mark all read</button>
                  )}
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">No notification history.</div>
                  ) : history.map(notif => (
                    <div key={notif.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-blue-50/50 dark:bg-[#2d78f2]/5' : ''}`}>
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : notif.type === 'error' ? 'bg-rose-500/10 text-rose-500' : notif.type === 'export' ? 'bg-[#2d78f2]/10 text-[#2d78f2]' : 'bg-slate-500/10 text-slate-500'}`}>
                        {notif.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : notif.type === 'error' ? <Database className="w-4 h-4" /> : notif.type === 'export' ? <UserPlus className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.unread ? 'font-medium text-slate-800 dark:text-white' : 'font-normal text-slate-600 dark:text-slate-300'}`}>{notif.title}</p>
                        <p className="text-xs text-[#adadad] mt-0.5 line-clamp-2 leading-relaxed">{notif.desc}</p>
                        <p className="text-[10px] text-[#adadad] mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {notif.time}</p>
                      </div>
                      {notif.unread && <div className="w-2 h-2 rounded-full bg-[#2d78f2] shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>

                {history.length > 0 && (
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-center flex justify-between items-center">
                    <button className="text-xs font-semibold text-slate-400 hover:text-[#2d78f2] transition-colors">{t.viewAll ?? "View all"} →</button>
                    <button onClick={clearHistory} className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">Clear All</button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>{/* end pill */}

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); setShowNotifications(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <img
                src="https://ui-avatars.com/api/?name=Jennie+Ruby&background=random&color=fff"
                className="w-full h-full object-cover"
                alt="Admin"
              />
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-[13px] font-medium text-black dark:text-white whitespace-nowrap">Jennie Ruby. J</p>
              <p className="text-[11px] text-[#adadad] font-normal whitespace-nowrap">Organization admin</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#adadad] hidden lg:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="font-medium text-slate-800 dark:text-white text-sm">Jennie Ruby. J</p>
                <p className="text-xs text-[#adadad] mt-0.5">admin@organization.com</p>
              </div>
              <div className="p-1.5">
                <button onClick={() => router.push('/admin/settings')} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={() => router.push('/admin/settings')} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Settings className="w-4 h-4" /> Account Settings
                </button>
              </div>
              <div className="p-1.5 border-t border-slate-100 dark:border-slate-700">
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                  <LogOut className="w-4 h-4" /> {t.logout ?? "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}