"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { motion } from "framer-motion"

export default function PustakaOnePage() {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { lang, t, setLanguage } = useLanguage()

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<{ nama: string, email: string, role?: string } | null>(null)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const handleScroll = () => {
      const sections = ['home', 'about', 'help-center']
      let current = 'home'
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100) {
            current = section
          }
        }
      }
      setActiveTab(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getNavClass = (id: string) => {
    return activeTab === id
      ? "text-white border-b-2 border-white dark:border-blue-400 dark:text-blue-400 pb-1 font-label text-sm uppercase tracking-wider transition-colors"
      : "text-blue-100/70 border-b-2 border-transparent dark:text-slate-400 font-medium hover:text-white dark:hover:text-blue-300 transition-all duration-300 ease-in-out font-label text-sm uppercase tracking-wider pb-1"
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <div className="bg-surface dark:bg-[#0B1120] text-on-surface dark:text-slate-100 font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen transition-colors duration-300">
      {/* TopAppBar */}
      <header className="bg-primary dark:bg-slate-900/80 dark:backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-lg border-b border-transparent dark:border-slate-800 transition-colors duration-300">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="PustakaONE Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow" />
              <span className="text-2xl font-headline font-semibold tracking-tight dark:text-blue-50 text-white hidden sm:block">
                PustakaONE
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home') }} className={getNavClass('home')}>
                {t.navHome || "Home"}
              </Link>
              <Link href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about') }} className={getNavClass('about')}>
                {t.navAbout || "About"}
              </Link>
              <Link href="#help-center" onClick={(e) => { e.preventDefault(); scrollToSection('help-center') }} className={getNavClass('help-center')}>
                {t.footerHelp || "Help Center"}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-white/80 dark:text-slate-400 hover:text-white dark:hover:text-slate-200 font-label text-xs uppercase tracking-widest transition-colors">
                  <span>{lang === 'id' ? 'ID' : 'EN'}</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded overflow-hidden border border-slate-100 dark:border-slate-700">
                  <button onClick={() => setLanguage('en')} className="w-full text-left block px-4 py-3 text-primary dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-label text-xs tracking-widest border-b border-slate-100 dark:border-slate-700 transition-colors">
                    ENGLISH
                  </button>
                  <button onClick={() => setLanguage('id')} className="w-full text-left block px-4 py-3 text-primary dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-label text-xs tracking-widest transition-colors">
                    INDONESIA
                  </button>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                className="text-white/80 dark:text-slate-400 hover:text-white dark:hover:text-amber-400 transition-colors flex items-center"
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
              >
                <span className="material-symbols-outlined text-xl">
                  {mounted && resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Fixed Height for Desktop */}
        <section id="home" className="relative min-h-screen md:min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-24 md:py-0">
          {/* Background Image with Blur and Overlay */}
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
            className="max-w-5xl mx-auto px-6 md:px-8 relative z-10 text-center"
          >
            {/* Logic translations applied here */}
            {t.topUni && (
              <span className="inline-block py-1 px-4 rounded-full bg-white/10 dark:bg-blue-500/20 text-white dark:text-blue-200 text-xs font-label uppercase tracking-widest mb-6 border border-white/20 dark:border-blue-500/30 backdrop-blur-sm">
                {t.topUni}
              </span>
            )}

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-xl lg:whitespace-nowrap">
              {t.title1 ? (
                <>
                  {t.title1} <br /> <span className="text-blue-100 dark:text-blue-400">{t.title2}</span>
                </>
              ) : (
                "Access Your University Library from Anywhere"
              )}
            </h1>

            <p className="font-body text-lg md:text-xl text-blue-50/90 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
              {t.subtitle || "The premier gateway to global academic knowledge. Bridging the gap between institutional archives and your digital workspace through a curated editorial lens."}
            </p>

            {/* Single Get Started CTA */}
            <div className="flex justify-center mt-12 mb-4">
              <button
                onClick={() => {
                  router.push('/select-institution')
                }}
                className="group relative px-10 py-5 bg-white/95 dark:bg-blue-600 text-primary dark:text-white font-label font-bold text-sm shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] dark:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:scale-[1.02] transition-all duration-500 uppercase tracking-widest rounded-2xl overflow-hidden flex items-center justify-center gap-2 border border-white/20"
              >
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10 flex items-center gap-2 tracking-widest">{t.getStarted || "Get Started"} <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></span>
              </button>
            </div>


          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1, duration: 1 }, y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 text-white/50 dark:text-slate-400 hover:text-white dark:hover:text-white cursor-pointer transition-colors" 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="material-symbols-outlined text-4xl drop-shadow-md">
              keyboard_double_arrow_down
            </span>
          </motion.div>
        </section>

        {/* How It Works - Asymmetric Layout */}
        <section id="about" className="bg-slate-50 dark:bg-slate-900 py-24 md:py-32 transition-colors scroll-mt-20 relative">
          {/* Subtle noise/texture overlay for premium feel */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-4 md:gap-8 border-b border-outline-variant/30 dark:border-slate-800 pb-6 md:pb-0 md:border-none">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white mb-4 md:mb-6">{t.workflowTitle || "A Seamless Bridge to Knowledge"}</h2>
                <p className="font-body text-base md:text-lg text-secondary dark:text-slate-400">
                  {t.workflowDesc || "Discover how PustakaONE centralizes your institutional research capabilities into one fluid, digital experience."}
                </p>
              </motion.div>
              <div className="hidden md:block font-label text-xs uppercase tracking-[0.3em] text-outline dark:text-slate-500 pb-2 border-b border-outline-variant dark:border-slate-700">
                {t.workflowLabel || "The Workflow"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="flex flex-col gap-6 md:gap-8 group cursor-pointer"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 flex items-center justify-center rounded-xl shadow-md border border-slate-100 dark:border-slate-700 group-hover:shadow-lg group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl md:text-3xl group-hover:scale-110 transition-transform">login</span>
                </div>
                <div>
                  <span className="font-label text-primary dark:text-blue-400 font-bold text-xs md:text-sm mb-2 block tracking-widest uppercase">
                    01 / {t.authLabel || "AUTHENTICATION"}
                  </span>
                  <h4 className="font-headline text-xl md:text-2xl mb-3 md:mb-4 text-primary dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{t.authTitle || "Secure Login"}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base leading-relaxed">
                    {t.authDesc || "Connect via SSO using your existing university credentials. No new passwords required."}
                  </p>
                </div>
              </motion.div>
              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="flex flex-col gap-6 md:gap-8 group cursor-pointer"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 flex items-center justify-center rounded-xl shadow-md border border-slate-100 dark:border-slate-700 group-hover:shadow-lg group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl md:text-3xl group-hover:scale-110 transition-transform group-hover:rotate-12">hub</span>
                </div>
                <div>
                  <span className="font-label text-primary dark:text-blue-400 font-bold text-xs md:text-sm mb-2 block tracking-widest uppercase">
                    02 / {t.aggLabel || "AGGREGATION"}
                  </span>
                  <h4 className="font-headline text-xl md:text-2xl mb-3 md:mb-4 text-primary dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{t.aggTitle || "Centralized Journals"}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base leading-relaxed">
                    {t.aggDesc || "Browse all your subscribed databases (JSTOR, Elsevier, IEEE) in a single, unified search interface."}
                  </p>
                </div>
              </motion.div>
              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="flex flex-col gap-6 md:gap-8 group cursor-pointer"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 flex items-center justify-center rounded-xl shadow-md border border-slate-100 dark:border-slate-700 group-hover:shadow-lg group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-all duration-300">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl md:text-3xl group-hover:scale-110 transition-transform">distance</span>
                </div>
                <div>
                  <span className="font-label text-primary dark:text-blue-400 font-bold text-xs md:text-sm mb-2 block tracking-widest uppercase">
                    03 / {t.accLabel || "ACCESSIBILITY"}
                  </span>
                  <h4 className="font-headline text-xl md:text-2xl mb-3 md:mb-4 text-primary dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{t.accTitle || "Remote Access"}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base leading-relaxed">
                    {t.accDesc || "Access full-text PDF articles from home, the field, or while traveling without complex VPN configurations."}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid Feature Display */}
        <section className="py-24 md:py-32 bg-white dark:bg-[#0B1120] transition-colors">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-fr gap-4 md:gap-6">
              {/* Large Card */}
              <div className="md:col-span-8 bg-slate-50 dark:bg-slate-800/60 p-8 md:p-12 rounded-3xl flex flex-col justify-between overflow-hidden relative group border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative z-10">
                  <h3 className="font-headline text-2xl md:text-3xl text-primary dark:text-white mb-3 md:mb-4">{t.feat1Title || "Editorial Collections"}</h3>
                  <p className="font-body text-on-surface-variant dark:text-slate-400 text-sm md:text-base max-w-sm">
                    {t.feat1Desc || "Curated lists by field experts to help you navigate through thousands of newly published journals every week."}
                  </p>
                </div>

                <div className="absolute -right-10 md:-right-20 -bottom-10 md:-bottom-20 w-2/3 md:w-3/4 opacity-30 md:opacity-20 group-hover:opacity-40 md:group-hover:opacity-30 transition-opacity">
                  <img
                    alt="Stacked books"
                    className="rounded-lg transform -rotate-12 dark:brightness-75 dark:contrast-125"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDweQ40Tx7uoBBPbMaDHV4VfnHzgSw1If-r-1VaX8xRQ0yzU1zcPbGIib-UFyzVVePKzVlzx2rZ-VEfCc87VE2Om-fcJflcXEjHWuxAtca2qWl1OVCSt6zji6ek7rL57QpKS6eMklM_7XOf8qAC7lJu-C_DHBekxsqmuC-_lN9no4_oEaaHPHZ9riGNrqqwPw6afx3ud04mUrpqJQSQUQ7taDDWVHz3arabKf3eRE5PmWGuscqMYMMxEy4ZVSmKR5HERVHlcjnE4YY"
                  />
                </div>
              </div>

              {/* Small Side Top */}
              <div className="md:col-span-4 bg-primary dark:bg-blue-900/40 p-8 md:p-10 rounded-3xl flex flex-col justify-center text-white shadow-sm hover:shadow-md transition-shadow dark:border dark:border-blue-800/30">
                <span className="material-symbols-outlined text-4xl m-0 mb-4 text-blue-200 dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <h4 className="font-headline text-xl md:text-2xl mb-2">{t.feat2Title || "Peer Reviewed"}</h4>
                <p className="text-blue-100/80 dark:text-blue-100/70 text-xs md:text-sm leading-relaxed">
                  {t.feat2Desc || "Guaranteed access to only high-impact, peer-reviewed journals vetted by global academic standards."}
                </p>
              </div>

              {/* Small Side Bottom Left */}
              <div className="md:col-span-4 bg-amber-50 dark:bg-amber-900/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center text-amber-900 dark:text-amber-100/80 border border-amber-100 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl mb-4 text-amber-600 dark:text-amber-500">history_edu</span>
                <h4 className="font-headline text-xl md:text-2xl mb-2 text-amber-950 dark:text-white">{t.feat3Title || "Digital Curator"}</h4>
                <p className="text-amber-800/70 dark:text-amber-200/50 text-xs md:text-sm leading-relaxed">
                  {t.feat3Desc || "Save citations and organize your research into private, shareable digital trays with one click."}
                </p>
              </div>

              {/* Small Side Bottom Right */}
              <div className="md:col-span-8 bg-slate-50 dark:bg-slate-800/40 p-8 md:p-10 rounded-3xl flex flex-col sm:flex-row items-center gap-6 md:gap-8 group border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-headline text-xl md:text-2xl text-primary dark:text-white mb-2">{t.feat4Title || "Researcher Profile"}</h4>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm md:text-base leading-relaxed">{t.feat4Desc || "Synchronize your annotations and bookmarks across all your devices instantly."}</p>
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-4 border-white dark:border-slate-700 shrink-0">
                  <img
                    alt="Student studying"
                    className="w-full h-full object-cover grayscale opacity-80 sm:group-hover:grayscale-0 transition-all duration-500 dark:opacity-70 dark:sm:group-hover:opacity-100"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBltlYpRNBFTvLQ4A1SjvB0KLneHkKMmjDNPFUmmq1QeE30yFBBZIRs8SHB1JyFjkbKUeuPFFNgkbmnsXd2_oyWx7oBJ6htIxS-dGNuixT5FK3BS_nEf4bqqan25UJnDpsm8-fbDVHnvzOYQGBEvMn4_sgcHFREuU2Dh-FKydqq0LuafBn4AnZ3_OU7Ijenp0m3oZT5zdUWS7op5ERaJVL_t9IRlgJyHSD_XyZfhXyrMxHFEWQK_afxlpJf9tyVl94u4tN_byfWL5E"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Footer (CTA integrated) - Enhanced Stats display */}
        <section className="py-24 md:py-32 relative border-t border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Background & Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Library Background"
              className="w-full h-full object-cover filter blur-[2px] brightness-[0.3] dark:brightness-50 transition-all duration-1000 scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAIUsftECstsJxmO9AnAIMd0D631rKtmZawUwYVNJkUuGtVI-s3xDfD26tRiiBomuiFwcIaKgoOe1oWULak7VNDL1Zr5G6UCRbTnQwBwuruQJ10bSa_0o7RYbmEP_CK9IK4e5bAUzWkKyN0ou4fDoL_-w1z9Xs_kosKoH7rlqrgcBxaE1r14P4GGQlQAE10LXXvG0FcQLnyVJvIzMu1-zcu0hnFBYPARF7j2u8D9INiq5haRqXPb_kjtqafr-6VvaVFxQxXnZhIFo"
            />
            <div className="absolute inset-0 bg-primary/90 dark:bg-slate-950/90 transition-colors"></div>
            {/* Atmospheric gradient glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/20 dark:from-blue-500/10 to-transparent"></div>
          </div>

          <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10 text-center flex flex-col items-center">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-12 md:mb-16 font-medium drop-shadow-lg tracking-tight">
              {t.title2 ? `Ready to explore ${t.title2.replace('.', '?')}` : 'Ready to expand your archive?'}
            </h2>

            {/* Aesthetic Floating Statistics Card (No Buttons) */}
            <div className="relative w-full max-w-3xl mt-4 perspective-[1000px] flex justify-center items-center">
              {/* Decorative Mesh Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

              {/* Floating Glassmorphism Container */}
              <div className="relative z-10 w-full max-w-lg bg-white/5 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700 p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-between hover:-translate-y-2 hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.3)] hover:border-blue-400/30 transition-all duration-700 ease-out group">

                {/* Stat 1 */}
                <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-3xl md:text-5xl font-headline font-bold text-white tracking-widest drop-shadow-md">12M<span className="text-blue-400">+</span></span>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-blue-200/70 font-label">Journals</span>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-500 delay-75">
                  <span className="text-3xl md:text-5xl font-headline font-bold text-white tracking-widest drop-shadow-md">50K<span className="text-blue-400">+</span></span>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-blue-200/70 font-label">E-Books</span>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-500 delay-150">
                  <span className="text-3xl md:text-5xl font-headline font-bold text-white tracking-widest drop-shadow-md">150<span className="text-blue-400">+</span></span>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-blue-200/70 font-label">Databases</span>
                </div>

                {/* Embedded Glowing Light */}
                <div className="absolute inset-0 rounded-3xl mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Outer Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

          </div>
        </section>
      </main>

      {/* Mobile App & Support Section */}
      <section id="help-center" className="bg-surface dark:bg-[#0B1120] py-16 md:py-24 border-t border-slate-200/50 dark:border-slate-800 transition-colors scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          {/* Download Mobile App */}
          <div className="bg-gradient-to-br from-primary to-[#001736] dark:from-slate-900 dark:to-slate-900/80 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group shadow-xl border border-transparent dark:border-slate-800 transition-all hover:shadow-2xl">
            <div className="relative z-10 h-full flex flex-col items-start justify-center">
              <span className="inline-block py-1 px-4 rounded-full bg-blue-500/20 text-blue-100 text-[10px] sm:text-xs font-label uppercase tracking-widest mb-6 border border-blue-400/30 backdrop-blur-sm">
                {t.appExclusive || "Android Exclusive"}
              </span>
              <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight">
                {t.downloadApp || "Get PustakaONE App"}
              </h3>
              <p className="font-body text-blue-100/80 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mb-10">
                {t.downloadDesc || "Access the entire literature catalog right from your fingertips. Currently exclusively available on Android devices."}
              </p>
              <a href="#" className="inline-flex items-center hover:scale-105 transition-transform origin-left">
                <img
                  src={lang === 'id'
                    ? "https://play.google.com/intl/en_us/badges/static/images/badges/id_badge_web_generic.png"
                    : "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"}
                  alt="Get it on Google Play"
                  className="h-10 sm:h-12 md:h-14"
                />
              </a>
            </div>

            {/* Aesthetic Mockup / Shapes */}
            <div className="absolute -right-10 -bottom-10 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[150px] sm:text-[200px] text-white/5 dark:text-white/2 -rotate-12 group-hover:-rotate-6 transition-transform duration-700">
              phone_android
            </span>
          </div>

          {/* Contact Help Center */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col justify-center shadow-lg relative overflow-hidden transition-colors">
            <div className="relative z-10 w-full mb-8">
              <div className="w-14 h-14 bg-blue-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-slate-700 mx-auto lg:mx-0">
                <span className="material-symbols-outlined text-primary dark:text-slate-300 text-2xl">support_agent</span>
              </div>
            </div>
            <div className="relative z-10 flex flex-col flex-1 h-full text-center lg:text-left">
              <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl text-primary dark:text-slate-100 mb-3 md:mb-4">
                {t.contactUs || "Need Further Assistance?"}
              </h3>
              <p className="font-body text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-10 flex-1">
                {t.contactDesc || "Our curators and librarians are ready to assist with access issues or literature recommendations during working hours."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a href="#" className="px-6 py-3 bg-primary dark:bg-blue-600 text-white font-label font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-lg hover:bg-primary-container dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none whitespace-nowrap shadow-md">
                  <span className="material-symbols-outlined text-sm">chat</span> {t.contactBtn || "Contact Support Team"}
                </a>
                <a href="mailto:library@telkomuniversity.ac.id?subject=Bantuan Akses PustakaONE" className="px-6 py-3 bg-transparent border border-outline-variant dark:border-slate-700 text-primary dark:text-slate-300 font-label font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none whitespace-nowrap">
                  <span className="material-symbols-outlined text-sm">mail</span> {t.emailUs || "Send an Email"}
                </a>
              </div>
            </div>
            {/* Background Texture Detail */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-slate-800/30 pointer-events-none"></div>
          </div>

        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="bg-slate-50 dark:bg-slate-950 full-width py-8 md:py-12 border-t border-slate-200/50 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <span className="font-headline text-lg md:text-xl text-blue-950 dark:text-slate-200 font-semibold">PustakaONE | Telkom University</span>
            <p className="font-label text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500 text-center lg:text-left">
              © {new Date().getFullYear()} Telkom University Open Library. All Rights Reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="#" className="font-label text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-blue-900 dark:hover:text-slate-300 transition-colors">{t.footerHelp || "Bantuan"}</Link>
            <Link href="#" className="font-label text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-blue-900 dark:hover:text-slate-300 transition-colors">{t.footerGuide || "Panduan"}</Link>
            <Link href="#" className="font-label text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-blue-900 dark:hover:text-slate-300 transition-colors">{t.footerPrivacy || "Kebijakan Privasi"}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}