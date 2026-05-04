"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

export default function Forbidden() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-900/5 dark:bg-slate-800/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.015] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Security Visual */}
        <div className="mb-10 flex justify-center">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 backdrop-blur-xl group-hover:rotate-6 transition-transform duration-500 relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
               <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-5xl md:text-6xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_person
              </span>
            </div>
            {/* Pulsing Alert Ring */}
            <div className="absolute inset-0 bg-red-500/20 rounded-[2.5rem] animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Status Label - Explicitly displaying the 'Access Denied' text here */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="py-1.5 px-4 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-label font-bold uppercase tracking-[0.2em] border border-red-200 dark:border-red-500/20">
              {t.errorAccessTitle || "Access Denied"}
          </span>
          <div className="h-0.5 w-12 bg-red-500/20"></div>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6 tracking-tight">
          Akses Terbatas
        </h1>
        
        <p className="font-body text-slate-600 dark:text-slate-400 text-lg mb-12 max-w-sm mx-auto leading-relaxed">
          {t.errorAccessDesc || "You don't have the required permissions to access this area. If you believe this is a mistake, please contact our administrator."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="group relative px-10 py-4 bg-primary dark:bg-blue-600 text-white font-label font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl overflow-hidden flex items-center gap-2 border border-white/10"
          >
             <span className="material-symbols-outlined text-xl">home</span>
             {t.backToHome || "Back to Home"}
          </Link>
          
          <Link 
            href="/help"
            className="px-8 py-4 bg-white dark:bg-slate-900 text-primary dark:text-slate-200 font-label font-bold text-xs border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest rounded-2xl shadow-sm"
          >
            {t.footerHelp || "Help Center"}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
