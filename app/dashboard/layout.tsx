"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { institutions, type Institution } from '@/lib/institutions'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ nama: string, email: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(true)
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentInst, setCurrentInst] = useState<Institution | null>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { lang, setLanguage, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login'; // Pindah langsung ke login
    } catch (err) {
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("user")
    
    if (saved && saved !== "undefined") {
      try {
        const parsedUser = JSON.parse(saved);
        setUser(parsedUser);

        // --- LOGIC INACTIVITY (Aktif untuk SEMUA saat testing) ---
        let timeout: NodeJS.Timeout;
        const resetTimer = () => {
          clearTimeout(timeout);
          // Set ke 60 detik (1 menit) untuk testing
          timeout = setTimeout(() => {
            handleLogout(); // Langsung logout tanpa alert
          }, 60000); 
        };

        // Pasang sensor gerakan
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('click', resetTimer);
        
        resetTimer();

        return () => {
          window.removeEventListener('mousemove', resetTimer);
          window.removeEventListener('keypress', resetTimer);
          window.removeEventListener('click', resetTimer);
          clearTimeout(timeout);
        };
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem("user");
        router.push("/login");
      }
    } else {
      // Jika localStorage kosong, coba tanya server (siapa tahu baru login via SSO)
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user))
            setUser(data.user)
          } else {
            router.push("/login")
          }
        })
        .catch(() => {
          router.push("/login")
        })
    }

    const savedInst = localStorage.getItem("selectedInstitution")
    if (savedInst) {
      const match = institutions.find(i => i.name === savedInst)
      if (match) setCurrentInst(match)
    }
  }, [router])

  if (!user) return null // or a sexy loading spinner

  return (
    <div className="flex h-screen bg-surface dark:bg-[#0B1120] text-on-surface dark:text-slate-100 font-body overflow-hidden transition-colors selection:bg-blue-200 dark:selection:bg-blue-900">

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-white dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-colors z-20 relative backdrop-blur-xl shrink-0">

        {/* Subtle Gradient Line At Top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400"></div>

        {/* Branding Area */}
        <div className="p-8 flex flex-col items-center border-b border-slate-100 dark:border-slate-800/50">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow mb-4 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden p-2">
            {currentInst?.icon && (currentInst.icon.startsWith('/') || currentInst.icon.includes('.')) ? (
              <img src={currentInst.icon} alt={currentInst.name} className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-primary">{currentInst?.icon || 'school'}</span>
            )}
          </div>
          <h2 className="font-headline font-bold text-primary dark:text-white text-xl tracking-tight">PustakaONE</h2>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-slate-500 mt-1 text-center">{currentInst?.name || 'Telkom University'}</p>
        </div>

        {/* Navigation Area */}
        <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
          <nav className="space-y-1.5">
            {/* Home */}
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all group relative overflow-hidden ${pathname === '/dashboard' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
              {pathname === '/dashboard' && <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 z-0"></div>}
              {pathname === '/dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full z-10"></div>}
              <span className="material-symbols-outlined text-[18px] relative z-10 transition-transform group-hover:scale-110" style={{ fontVariationSettings: pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
              <span className="relative z-10">{t.sidebarHome || "Beranda"}</span>
            </Link>

            {/* eResources */}
            <div>
              <div className="flex items-center w-full relative group">
                <Link
                  href="/dashboard/resources"
                  className="flex-1 flex items-center gap-3 pl-4 py-3.5 rounded-l-2xl font-label font-bold text-xs uppercase tracking-wider transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50"
                >
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 0" }}>book</span>
                  <span>{t.sidebarEResources || "Sumber Daya Elektronik"}</span>
                </Link>
                <div className="flex items-center justify-end pr-4 py-3.5 rounded-r-2xl bg-transparent group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setIsResourcesOpen(!isResourcesOpen)}>
                  <button>
                    <span className={`material-symbols-outlined text-[18px] text-cyan-500 dark:text-cyan-400 transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${isResourcesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col pl-12 pr-4 py-1 space-y-1 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                  <Link href="/dashboard/databases" className="text-[11px] font-label font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors">{t.sidebarDatabases || "Pangkalan Data Ilmiah"}</Link>
                  <Link href="/dashboard/journals" className="text-[11px] font-label font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors">{t.sidebarJournals || "Direktori Jurnal"}</Link>
                  <Link href="/dashboard/ebooks" className="text-[11px] font-label font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors">{t.sidebarEbooks || "Repositori Monograf"}</Link>
                </div>
              </div>
            </div>

            {/* Collections */}
            <div>
              <div className="flex items-center w-full relative group">
                <Link
                  href="/dashboard/collections"
                  className="flex-1 flex items-center gap-3 pl-4 py-3.5 rounded-l-2xl font-label font-bold text-xs uppercase tracking-wider transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50"
                >
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">layers</span>
                  <span>{t.sidebarCollections || "Koleksi Pribadi"}</span>
                </Link>
                <div className="flex items-center justify-end pr-4 py-3.5 rounded-r-2xl bg-transparent group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}>
                  <button>
                    <span className={`material-symbols-outlined text-[18px] text-cyan-500 dark:text-cyan-400 transition-transform duration-300 ${isCollectionsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${isCollectionsOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col pl-12 pr-4 py-1 space-y-1 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-6">
                  <Link href="/dashboard/collections/general" className="flex items-center justify-between py-2 transition-colors group/item">
                    <span className="text-[11px] font-label font-medium text-slate-500 dark:text-slate-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">{t.sidebarGeneral || "Koleksi Umum"}</span>
                    <span className="material-symbols-outlined text-[14px] text-cyan-400 -rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Favourites */}
            <Link href="/dashboard/favorites" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all group relative overflow-hidden ${pathname === '/dashboard/favorites' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
              {pathname === '/dashboard/favorites' && <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 z-0"></div>}
              {pathname === '/dashboard/favorites' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full z-10"></div>}
              <span className="material-symbols-outlined text-[18px] relative z-10 transition-transform group-hover:scale-110" style={{ fontVariationSettings: pathname === '/dashboard/favorites' ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              <span className="relative z-10">{t.sidebarFavorites || "Favorit"}</span>
            </Link>

          </nav>
        </div>

        {/* Theme Settings */}
        <div className="px-4 pb-1">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 font-label font-bold text-xs uppercase tracking-wider transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] group-hover:text-amber-500 dark:group-hover:text-blue-300 transition-colors">
                {mounted ? (resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode') : 'settings_brightness'}
              </span>
              <span>{t.sidebarTheme || "Tema Antarmuka"}</span>
            </div>
            <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700/80 rounded-full relative transition-colors shadow-inner flex items-center">
              <div className={`absolute w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${mounted && resolvedTheme === 'dark' ? 'left-[18px] bg-blue-400' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>



        {/* User Card & Logout */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center gap-3 px-4 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-slate-50 dark:bg-slate-800/40 mb-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
              {user.nama.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-primary dark:text-slate-200 truncate">{user.nama}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate tracking-wide">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 font-label font-bold text-[11px] uppercase tracking-widest transition-colors hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span> {t.sidebarLogout || "Keluar Sesi"}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-950 z-[50] lg:hidden flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400"></div>

            {/* Branding */}
            <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm p-1.5 transition-transform hover:scale-105 overflow-hidden">
                  {currentInst?.icon && (currentInst.icon.startsWith('/') || currentInst.icon.includes('.')) ? (
                    <img src={currentInst.icon} alt={currentInst.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-primary">{currentInst?.icon || 'school'}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-headline font-bold text-primary dark:text-white text-[19px] leading-none tracking-tight">PustakaONE</h2>
                  <p className="text-[10px] font-label uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                    {currentInst?.name || 'Telkom University'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Nav (Shared component would be better centerized, but doing direct copy for simplicity/speed) */}
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Copy same nav items here, effectively making it accessible on mobile */}
              <nav className="space-y-1.5">
                <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all ${pathname === '/dashboard' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>{t.sidebarHome || "Beranda"}</span>
                </Link>

                <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/resources" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all ${pathname.includes('resources') ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[18px]">book</span>
                  <span>{t.sidebarEResources || "E-Resources"}</span>
                </Link>

                <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/collections" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all ${pathname.includes('collections') ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  <span>{t.sidebarCollections || "Collections"}</span>
                </Link>

                <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/favorites" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-label font-bold text-xs uppercase tracking-wider transition-all ${pathname === '/dashboard/favorites' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>{t.sidebarFavorites || "Favorit"}</span>
                </Link>
              </nav>
            </div>

            {/* Integrated Controls in Mobile Sidebar (Theme & Language) */}
            <div className="px-4 border-t border-slate-100 dark:border-slate-800/50 py-4 space-y-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-label font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">
                    {mounted ? (resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode') : 'settings_brightness'}
                  </span>
                  <span>{t.sidebarTheme || "Tema Tampilan"}</span>
                </div>
                <div className={`w-6 h-3 rounded-full relative ${resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${resolvedTheme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </button>

              {/* Language Switcher Integrated */}
              <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-label font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">translate</span>
                  <span>{t.sidebarLang || "Bahasa"}</span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${lang === 'id' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    IND
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-400'}`}
                  >
                    ENG
                  </button>
                </div>
              </div>
            </div>

            {/* User card in mobile sidebar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white dark:border-slate-800">
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">{user.nama.charAt(0)}</div>
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-primary dark:text-white truncate">{user.nama}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-label font-bold text-[10px] uppercase tracking-[0.15em] border border-red-100 dark:border-red-900/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {t.sidebarLogout || "Keluar Sesi"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 dark:bg-[#080d18]/50">

        {/* Mobile Navbar Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-30 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden p-1.5 border border-slate-100">
              {currentInst?.icon && (currentInst.icon.startsWith('/') || currentInst.icon.includes('.')) ? (
                <img src={currentInst.icon} alt={currentInst.name} className="w-full h-full object-contain" />
              ) : (
                <span className="material-symbols-outlined text-xl text-primary">{currentInst?.icon || 'school'}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-primary dark:text-white text-base tracking-tight">PustakaONE</span>
              <span className="text-[8px] font-label uppercase tracking-widest text-slate-500 -mt-1">{currentInst?.name || 'Telkom University'}</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">
              {user.nama.charAt(0)}
            </div>
          </div>
        </header>

        {/* Combined scrollable container for main area */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Subtle patterned background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.015] pointer-events-none z-0 fixed"></div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>


      {/* Floating Language Switcher - Bottom Right Dropdown (Desktop Only) */}
      <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
          >
            <img
              src={lang === 'id' ? "https://flagcdn.com/w40/id.png" : "https://flagcdn.com/w40/gb.png"}
              alt={lang}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <span className="text-xs font-label font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">{lang === 'id' ? 'IND' : 'ENG'}</span>
            <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden p-1.5"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/50 mb-1">
                  <p className="text-[9px] font-label font-bold uppercase tracking-[0.2em] text-slate-400">{t.sidebarLang || "Bahasa"}</p>
                </div>
                <button
                  onClick={() => { setLanguage('id'); setIsLangOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${lang === 'id' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src="https://flagcdn.com/w40/id.png" alt="ID" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-label font-bold uppercase tracking-wider">IND</span>
                  </div>
                  {lang === 'id' && <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>}
                </button>
                <button
                  onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${lang === 'en' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-label font-bold uppercase tracking-wider">ENG</span>
                  </div>
                  {lang === 'en' && <span className="material-symbols-outlined text-[16px] text-blue-500">check_circle</span>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}
