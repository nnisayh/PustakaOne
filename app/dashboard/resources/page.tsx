"use client"
import { useLanguage } from '@/components/language-provider'
import { motion } from "framer-motion"

export default function EResourcesPage() {
  const { t } = useLanguage()
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-12 h-min-screen">

      {/* Header */}
      <section>
        <div className="mb-6 md:mb-8">
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white mb-2 tracking-tight">{t.resTitle || "Katalog e-Resources"}</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-body">{t.resDesc || "Jelajahi seluruh koleksi pangkalan data, buku elektronik, dan jurnal yang dilanggan oleh Telkom University."}</p>
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

        {/* Category: Databases */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 md:mb-6 border border-blue-100 dark:border-blue-800/50 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl md:text-3xl">database</span>
          </div>
          <h2 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">{t.resDB || "Pangkalan Data"}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
            {t.resDBDesc || "Akses eksklusif ke platform literatur global ternama seperti Scopus, IEEE, Springer, dan puluhan pangkalan data lainnya."}
          </p>
          <div className="mt-5 md:mt-6 flex items-center text-[10px] md:text-xs font-bold font-label uppercase tracking-widest text-blue-500">
            {t.resDBBtn || "Buka Katalog"} <span className="material-symbols-outlined text-[14px] md:text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Category: Journals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 md:mb-6 border border-amber-100 dark:border-amber-800/50 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl md:text-3xl">article</span>
          </div>
          <h2 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">{t.resJournal || "Jurnal Ilmiah"}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
            {t.resJournalDesc || "Jelajahi jutaan jurnal nasional dan internasional yang telah dikurasi dengan standar editorial ketat."}
          </p>
          <div className="mt-5 md:mt-6 flex items-center text-[10px] md:text-xs font-bold font-label uppercase tracking-widest text-amber-500">
            {t.resJournalBtn || "Mulai Membaca"} <span className="material-symbols-outlined text-[14px] md:text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Category: eBooks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 md:mb-6 border border-emerald-100 dark:border-emerald-800/50 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl md:text-3xl">menu_book</span>
          </div>
          <h2 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-white mb-2">{t.resEbook || "Buku Elektronik"}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
            {t.resEbookDesc || "Tinggalkan buku cetak yang berat. Temukan ribuan buku teks elektronik berlisensi untuk berbagai program studi."}
          </p>
          <div className="mt-5 md:mt-6 flex items-center text-[10px] md:text-xs font-bold font-label uppercase tracking-widest text-emerald-500">
            {t.resEbookBtn || "Cari Buku"} <span className="material-symbols-outlined text-[14px] md:text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </section>

      {/* Info Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-12 relative overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl mix-blend-overlay"></div>

        <div className="relative z-10 lg:max-w-xl text-center lg:text-left">
          <h3 className="font-headline text-xl md:text-3xl font-bold mb-3">{t.resHelpTitle || "Kendala Mengakses Referensi?"}</h3>
          <p className="text-blue-100 leading-relaxed font-body text-xs md:text-base">
            {t.resHelpDesc || "Perpustakaan Telkom University menyediakan layanan permintaan literatur. Hubungi pustakawan kami untuk membantu Anda mendapatkan akses ke referensi tertentu."}
          </p>
        </div>
        <div className="relative z-10 w-full lg:w-auto shrink-0">
          <button className="w-full lg:w-auto bg-white text-blue-900 px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-label font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            {t.resHelpBtn || "Ajukan Permohonan"}
          </button>
        </div>
      </section>

    </div>
  )
}
