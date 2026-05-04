"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { institutions, type Institution } from "@/lib/institutions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [currentInst, setCurrentInst] = useState<Institution | null>(null)

  useEffect(() => {
    const savedInst = localStorage.getItem("selectedInstitution")
    if (savedInst) {
      const match = institutions.find(i => i.name === savedInst)
      if (match) setCurrentInst(match)
    }
  }, [])

  // Handle login logic moved to SAML button

  return (
    <div className="bg-surface dark:bg-[#0B1120] text-on-surface dark:text-slate-100 font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen transition-colors duration-300" suppressHydrationWarning>
      
      {/* TopAppBar Minimal for Login */}
      <header className="absolute top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-6 max-w-screen-2xl mx-auto" suppressHydrationWarning>
          <Link href="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden" suppressHydrationWarning>
               {currentInst?.icon && (currentInst.icon.startsWith('/') || currentInst.icon.includes('.')) ? (
                  <img src={currentInst.icon} alt={currentInst.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">{currentInst?.icon || 'school'}</span>
                )}
            </div>
            <span className="text-2xl font-headline font-semibold tracking-tight dark:text-blue-50 text-white hidden sm:block">
              PustakaONE
            </span>
          </Link>
        </div>
      </header>

      <main className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-0">
        
        {/* EXACT Background from Landing Page */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Library architecture"
            className="w-full h-full object-cover scale-105 blur-[2px] brightness-50 dark:brightness-[0.4]"
            src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=2000&q=80"
          />
          {/* Duotone overlay to match Telkom's deep blue theme */}
          <div className="absolute inset-0 bg-[#001736]/70 dark:bg-[#0B1120]/80 mix-blend-multiply transition-colors"></div>
          {/* Base overlay for contrast */}
          <div className="absolute inset-0 bg-primary/30 dark:bg-slate-950/50 transition-colors"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary dark:from-slate-900 to-transparent pointer-events-none"></div>
          {/* Bottom fading-out gradient to match the next section's background seamlessly */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto px-6 relative z-10"
        >
          <div className="mb-8 text-center text-white">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 dark:bg-blue-500/20 text-white dark:text-blue-200 text-xs font-label uppercase tracking-widest mb-6 border border-white/20 dark:border-blue-500/30 backdrop-blur-sm">
              SISTEM AUTENTIKASI
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl text-white leading-[1.1] mb-2 tracking-tighter drop-shadow-xl">
              Login Mahasiswa
            </h1>
            <p className="font-body text-blue-50/90 dark:text-slate-300 text-sm max-w-sm mx-auto drop-shadow uppercase tracking-widest font-medium">
              {currentInst?.name || "Telkom University"} Remote Access
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* SAML SSO Button */}
              <div className="pt-6 flex flex-col items-center gap-6 w-full">
                <button
                  onClick={() => window.location.href = "/api/auth/saml/login"}
                  className="w-full bg-white text-[#002B49] hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl group"
                >
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform text-[24px]">fingerprint</span>
                  MASUK VIA SSO KAMPUS
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[24px]">arrow_forward</span>
                </button>

                <p className="text-white/70 text-xs text-center font-body italic">
                  Anda akan diarahkan ke halaman login pusat untuk verifikasi identitas secara aman.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  )
}