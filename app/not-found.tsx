"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors">

      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 dark:bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 dark:bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <motion.img
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              src="/logo.png"
              alt="PustakaONE Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl opacity-20 dark:opacity-30"
            />
            <span className="absolute inset-0 flex items-center justify-center font-headline text-8xl md:text-9xl font-bold text-primary/10 dark:text-blue-400/10 select-none">
              404
            </span>
          </div>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl text-primary dark:text-white mb-6 drop-shadow-sm">
          {t.error404Title || "Page Not Found"}
        </h1>

        <p className="font-body text-secondary dark:text-slate-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          {t.error404Desc || "Oops! It seems you've wandered into the library's restricted archives."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-primary dark:bg-blue-600 text-white font-label font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-widest rounded-2xl overflow-hidden flex items-center gap-2 border border-white/10"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            {t.backToHome || "Kembali ke Beranda"}
          </Link>

          <Link
            href="/help"
            className="px-8 py-4 bg-white dark:bg-slate-800 text-primary dark:text-slate-200 font-label font-bold text-sm border border-outline-variant dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest rounded-2xl"
          >
            {t.footerHelp || "Bantuan"}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
