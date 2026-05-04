"use client"
import { motion } from "framer-motion"

export default function CollectionsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-8 md:space-y-12 min-h-screen">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white mb-2 tracking-tight">Koleksi Ku</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-body">Manajemen referensi personal Anda. Simpan, susun, dan sitasi literatur dengan mudah.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-5 md:px-6 py-3 md:py-3.5 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all w-full md:w-fit justify-center group">
           <span className="material-symbols-outlined text-[18px]">add</span>
           <span className="font-label font-bold text-[10px] md:text-xs uppercase tracking-widest">Koleksi Baru</span>
        </button>
      </section>

      {/* Folders/Collections */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* General Collection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[1.25rem] shadow-sm hover:shadow-md transition-all cursor-pointer group">
           <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
              </div>
              <span className="material-symbols-outlined text-cyan-500 -rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
           </div>
           <h3 className="font-bold text-lg text-primary dark:text-white group-hover:text-blue-500 transition-colors">General Collection</h3>
           <p className="text-xs text-slate-500 mt-1 font-label">12 Artikel Tersimpan</p>
        </div>

        {/* Thesis Topic */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[1.25rem] shadow-sm hover:shadow-md transition-all cursor-pointer group">
           <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
              </div>
           </div>
           <h3 className="font-bold text-lg text-primary dark:text-white group-hover:text-amber-500 transition-colors">Referensi Skripsi</h3>
           <p className="text-xs text-slate-500 mt-1 font-label">45 Artikel Tersimpan</p>
        </div>

        {/* Machine Learning */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[1.25rem] shadow-sm hover:shadow-md transition-all cursor-pointer group">
           <div className="flex justify-between items-start mb-12">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
              </div>
           </div>
           <h3 className="font-bold text-lg text-primary dark:text-white group-hover:text-emerald-500 transition-colors">Machine Learning</h3>
           <p className="text-xs text-slate-500 mt-1 font-label">8 Artikel Tersimpan</p>
        </div>

      </section>

      {/* Empty State / Decor */}
      <section className="bg-blue-50/50 dark:bg-slate-800/20 border border-blue-100 dark:border-slate-800 border-dashed rounded-3xl p-8 md:p-12 text-center h-48 md:h-64 flex flex-col items-center justify-center">
         <span className="material-symbols-outlined text-3xl md:text-4xl text-slate-300 dark:text-slate-600 mb-3 block">style</span>
         <p className="font-label text-xs md:text-sm text-slate-500 dark:text-slate-400 px-4">Anda belum menyimpan artikel baru minggu ini.</p>
      </section>

    </div>
  )
}
