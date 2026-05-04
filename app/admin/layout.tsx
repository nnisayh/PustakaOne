"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Sidebar from "@/app/admin/components/admin/Sidebar"
import Header from "@/app/admin/components/admin/Header"
import { NotificationProvider } from "@/app/admin/components/providers/notification-provider"
import { GlobalUIProvider } from "@/app/admin/components/providers/global-ui-provider"
import { ThemeProvider } from "@/app/admin/components/providers/theme-provider"
import { LanguageProvider } from "@/app/admin/components/providers/language-provider"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/admin-login';
    } catch (err) {
      window.location.href = '/admin-login';
    }
  }

  useEffect(() => { 
    setMounted(true)
    document.documentElement.classList.add('admin-mode')
    
    // Check Auth
    const saved = localStorage.getItem("user")
    if (saved) {
      const parsedUser = JSON.parse(saved)
      if (parsedUser.role !== 'admin') {
        router.push('/') // Tendang jika bukan admin
      } else {
        setUser(parsedUser)
        
        // --- LOGIC INACTIVITY (1 Menit untuk Testing) ---
        let timeout: NodeJS.Timeout;
        const resetTimer = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            handleLogout();
          }, 60000); 
        };

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
      }
    } else {
      router.push('/admin-login')
    }

    return () => {
      document.documentElement.classList.remove('admin-mode')
    }
  }, [router])

  // Close mobile sidebar on route change
  useEffect(() => { setIsSidebarOpen(false) }, [pathname])

  if (!mounted || !user) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <NotificationProvider>
          <GlobalUIProvider>
            <div 
              className="min-h-screen flex bg-[#f6f6f6] dark:bg-[#0f172a] text-foreground transition-colors duration-300 font-sans relative"
            >
            {/* Mobile overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            />

            {/* Main content */}
            <main className={`
            flex-1 min-w-0 overflow-visible min-h-screen flex flex-col gap-6 
            relative z-10
            ${isSidebarExpanded ? 'lg:ml-[250px]' : 'lg:ml-[84px]'}
          `}>
              <Header setIsSidebarOpen={setIsSidebarOpen} />

              <div className="mx-6 mb-6 flex-1 relative">
                <div key={pathname} className="page-content">
                  {children}
                </div>
              </div>
            </main>
          </div>
          </GlobalUIProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
