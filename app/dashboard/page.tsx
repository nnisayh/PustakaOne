"use client"
import { motion } from "framer-motion"
import { useLanguage } from '@/components/language-provider'

export default function DashboardPage() {
  const { t } = useLanguage()
  return (
    <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full space-y-8 md:space-y-12">

      {/* Header & Search */}
      <section>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white mb-2 tracking-tight">{t.dashExplore || "Eksplorasi Referensi"}</h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 font-body">{t.dashExploreDesc || "Temukan jutaan literatur akademik dari pangkalan data premium global."}</p>
          </div>
          <div className="hidden md:flex gap-3 shrink-0">
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group">
              <span className="material-symbols-outlined text-[18px] md:text-[20px] group-hover:rotate-12 transition-transform">notifications</span>
            </button>
          </div>
        </div>

        {/* Elegant Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-3xl blur-[12px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient"></div>
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl md:rounded-3xl p-1.5 md:p-3">
            <span className="material-symbols-outlined text-blue-500 text-xl md:text-2xl ml-3 md:ml-4">search</span>
            <input
              type="text"
              placeholder={t.dashSearchPlaceholder || "Cari jurnal, judul artikel, penulis, atau kata kunci..."}
              className="flex-1 bg-transparent border-none outline-none px-3 md:px-6 text-slate-700 dark:text-slate-200 placeholder-slate-400 font-body text-sm md:text-base h-10 md:h-12"
            />
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3 md:pl-4 py-1 md:py-2 flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl px-3 md:px-4 h-10 md:h-12 transition-colors">
              <span className="text-[9px] md:text-xs font-label uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold hidden xs:block">Semua</span>
              <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Library Recommends */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="font-headline text-xl lg:text-2xl text-primary dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>hotel_class</span> {t.dashCampusRec || "Rekomendasi Kampus"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 md:p-5 rounded-[1.25rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-4 md:gap-5 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white dark:bg-slate-800 border border-red-50 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner p-1.5 md:p-2">
              <img src="/logo-telkom.png" alt="Telkom" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">Telkom University Open Library</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">openlibrary.telkomuniversity.ac.id</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[1.25rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-5 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform border border-white/50 shadow-inner">
              <span className="font-headline font-bold text-slate-700 dark:text-slate-300 text-xl tracking-tighter">OJS</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">Open Journal System</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">journals.telkomuniversity.ac.id</p>
            </div>
          </div>
        </div>
      </section>

      {/* Databases - Modern Tiles */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="font-headline text-xl lg:text-2xl text-primary dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>database</span> {t.dashSubscribedDB || "Pangkalan Data Berlangganan"}
          </h2>
          <button className="text-[10px] sm:text-xs font-label uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
            {t.dashViewAll || "Lihat Semua"} <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 hide-scrollbar">

          {/* Database Card 1 */}
          <div className="min-w-[180px] lg:min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[1.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 lg:hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-16 h-16 mb-5 rounded-full bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center p-3 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Scopus_logo.svg" alt="Scopus" className="w-full h-full object-contain filter " />
            </div>
            <h3 className="font-bold text-sm text-center text-primary dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Scopus</h3>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-label font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-balance mt-auto">Elsevier</p>
          </div>

          {/* Database Card 2 */}
          <div className="min-w-[180px] lg:min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[1.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 lg:hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-sky-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-16 h-16 mb-5 rounded-full bg-blue-50 dark:bg-slate-800 shadow-inner flex items-center justify-center p-2 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/IEEE_logo.svg/1200px-IEEE_logo.svg.png" alt="IEEE" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-bold text-sm text-center text-primary dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">IEEE Xplore</h3>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-label font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-auto">Engineering</p>
          </div>

          {/* Database Card 3 */}
          <div className="min-w-[180px] lg:min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[1.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 lg:hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-800 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-16 h-16 mb-5 rounded-full bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center p-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
              <span className="font-headline font-bold text-2xl text-slate-700 dark:text-slate-300">T&F</span>
            </div>
            <h3 className="font-bold text-sm text-center text-primary dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Taylor & Francis</h3>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-label font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-auto">Multidisciplinary</p>
          </div>

          {/* Database Card 4 */}
          <div className="min-w-[180px] lg:min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[1.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 lg:hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-16 h-16 mb-5 rounded-full bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center p-3 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Springer_Nature_logo.svg/2560px-Springer_Nature_logo.svg.png" alt="Springer" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-bold text-sm text-center text-primary dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">SpringerLink</h3>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-label font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-auto">Springer</p>
          </div>

          {/* Database Card 5 */}
          <div className="min-w-[180px] lg:min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[1.5rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 lg:hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="w-16 h-16 mb-5 rounded-full bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center p-3 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
              <span className="font-headline font-bold text-3xl text-slate-700 dark:text-slate-300" style={{ fontFamily: 'serif' }}>G</span>
            </div>
            <h3 className="font-bold text-sm text-center text-primary dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Gale Cengage</h3>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-label font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-auto">Reference</p>
          </div>
        </div>
      </section>

      {/* AI Curated For You */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="font-headline text-xl lg:text-2xl text-primary dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> {t.dashAICurated || "Kurasi Cerdas AI untuk Anda"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Article 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-1.5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>

            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[20px] p-6 h-full flex flex-col justify-between relative z-10 border border-white/50 dark:border-slate-700/30">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-purple-100/80 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-purple-200/50 dark:border-purple-500/20">Computer Science</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-purple-500 transition-colors">bookmark_border</span>
                </div>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-primary dark:text-white leading-snug mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Generative AI and Its Impact on Software Engineering Productivity
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  A comprehensive study on how modern LLMs are reshaping developer workflows, reducing debugging time, and redefining standard coding practices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span> Oct 2025
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[14px] text-blue-500">menu_book</span> IEEE Xplore
                </div>
              </div>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-1.5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>

            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[20px] p-6 h-full flex flex-col justify-between relative z-10 border border-white/50 dark:border-slate-700/30">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-blue-100/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-blue-200/50 dark:border-blue-500/20">Management</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-blue-500 transition-colors">bookmark_border</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary dark:text-white leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Sustainable Business Models in the Era of Digital Transformation
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  Analyzing the pivotal shift from traditional linear models to circular economies facilitated by robust digital platform integrations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span> Aug 2025
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">menu_book</span> Scopus
                </div>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-1.5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all group relative overflow-hidden cursor-pointer hidden md:block">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>

            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[20px] p-6 h-full flex flex-col justify-between relative z-10 border border-white/50 dark:border-slate-700/30">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-emerald-200/50 dark:border-emerald-500/20">Design & HCI</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-emerald-500 transition-colors">bookmark_border</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary dark:text-white leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Human-Computer Interaction: Spatial Computing & AR Interfaces
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  Evaluating usability heuristics for multi-dimensional augmented reality environments utilized in modern academic educational tools.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span> Sep 2025
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[14px] text-blue-500">menu_book</span> ScienceDirect
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-8"></div>
    </div>
  )
}
