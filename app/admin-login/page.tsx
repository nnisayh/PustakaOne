"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { institutions, type Institution } from "@/lib/institutions"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentInst, setCurrentInst] = useState<Institution | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedInst = localStorage.getItem("selectedInstitution")
    if (savedInst) {
      const match = institutions.find(i => i.name === savedInst)
      if (match) setCurrentInst(match)
    }
  }, [])

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/admin")
      } else {
        setError(data.message || "Login gagal. Periksa kembali kredensial Anda.")
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-[#0B1120] text-on-surface dark:text-slate-100 font-body min-h-screen transition-colors duration-300" suppressHydrationWarning>
      
      <header className="absolute top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-6 max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden">
               {currentInst?.icon && (currentInst.icon.startsWith('/') || currentInst.icon.includes('.')) ? (
                  <img src={currentInst.icon} alt={currentInst.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">{currentInst?.icon || 'school'}</span>
                )}
            </div>
            <span className="text-2xl font-headline font-semibold tracking-tight text-white hidden sm:block">
              PustakaONE
            </span>
          </Link>
        </div>
      </header>

      <main className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-0">
        
        <div className="absolute inset-0 z-0">
          <img
            alt="Library architecture"
            className="w-full h-full object-cover scale-105 blur-[2px] brightness-50 dark:brightness-[0.4]"
            src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=2000&q=80"
          />
          <div className="absolute inset-0 bg-[#001736]/70 dark:bg-[#0B1120]/80 mix-blend-multiply transition-colors"></div>
          <div className="absolute inset-0 bg-primary/30 dark:bg-slate-950/50 transition-colors"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary dark:from-slate-900 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto px-6 relative z-10"
        >
          <div className="mb-8 text-center text-white">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 dark:bg-blue-500/20 text-white dark:text-blue-200 text-[10px] font-label uppercase tracking-[0.2em] mb-4 border border-white/20 dark:border-blue-500/30 backdrop-blur-sm">
              PORTAL ADMINISTRATOR
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl text-white leading-[1.1] mb-2 tracking-tighter drop-shadow-xl">
              Login Admin
            </h1>
            <p className="font-body text-blue-50/80 text-xs uppercase tracking-widest font-medium">
              Manual Access For Internal Staff
            </p>
          </div>

          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleManualLogin} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-blue-100 mb-2 ml-1">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/60 group-focus-within:text-white transition-colors text-xl">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-blue-200/30 outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-body"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-blue-100 mb-2 ml-1">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/60 group-focus-within:text-white transition-colors text-xl">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-blue-200/30 outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-body"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    MASUK SEBAGAI ADMIN
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[24px]">login</span>
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-white/10">
                <Link href="/" className="text-white/40 hover:text-white font-label text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> Kembali ke Beranda
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-8 text-white/30 text-[10px] text-center font-label uppercase tracking-[0.3em]">
            PROTECTED ACCESS • INTERNAL USE ONLY
          </p>
        </motion.div>

      </main>
    </div>
  )
}