"use client"
import { useLanguage } from '@/components/language-provider'
import Link from "next/link"
import { motion } from "framer-motion"

export default function FavoritesPage() {
  const { t } = useLanguage()
  return (
    <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full min-h-[calc(100vh-80px)] lg:min-h-screen flex flex-col relative overflow-hidden">

      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-400/10 dark:bg-red-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* Header */}
        <section className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-2xl sm:text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-white dark:to-slate-400 mb-2 md:mb-3 tracking-tight"
          >
            {t.favTitle || "Koleksi Favorit"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-body max-w-2xl"
          >
            {t.favDesc || "Akses cepat ke referensi pilihan Anda. Jurnal dan pustaka elektronik yang paling sering Anda gunakan akan tersimpan rapi di halaman ini."}
          </motion.p>
        </section>

        {/* Premium Empty State */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-6 rounded-[2rem] md:rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col items-center mt-4 md:mt-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4 text-center tracking-tight">{t.favEmptyTitle || "Belum Ada Favorit"}</h2>
            <p className="text-center text-slate-600 dark:text-slate-400 font-body max-w-[420px] mb-8 md:mb-10 leading-relaxed text-sm md:text-[15px]">
              {t.favEmptyDesc?.split('Hati')[0] || "Anda belum menyimpan referensi apa pun. Klik ikon "}<strong className="font-bold text-slate-800 dark:text-slate-200">Hati</strong>{t.favEmptyDesc?.split('Hati')[1] || " pada kartu daftar pustaka untuk menyimpannya ke halaman ini."}
            </p>
          </div>
        </motion.section>
      </div>

    </div>
  )
}
