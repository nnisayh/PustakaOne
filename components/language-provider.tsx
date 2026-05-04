"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

const translations = {
  id: {
    // Admin
    adminPanel: "Panel Admin",
    dashboard: "Dashboard",
    users: "Pengguna",
    journals: "Database Jurnal",
    logs: "Riwayat Akses",
    settings: "Pengaturan",
    logout: "Keluar",
    totalUsers: "Total Pengguna",
    totalAccess: "Total Akses",
    activeDB: "DB Aktif",
    systemActive: "Status Server",
    traffic: "Traffic Pengunjung",
    topDB: "Database Populer",
    search: "Cari fitur, user, atau ID...",
    notifTitle: "Notifikasi Baru",

    // Landing
    topUni: "Pusat Riset Mahasiswa",
    title1: "Akses Perpustakaan Kampus",
    title2: "dari Mana Saja.",
    subtitle: "Akses jutaan literatur akademik, e-book, dan prosiding dari mana saja. Gak perlu ribet, cari referensi penelitian jadi lebih gampang.",
    searchPlaceholder: "Cari database, nama jurnal, atau penerbit...",
    searchBtn: "Cari",
    providedDB: "Daftar Layanan Jurnal",
    clickLogo: "Klik logo penerbit di bawah ini buat masuk ke portal koleksinya.",
    loginBtn: "Masuk",
    logoutBtn: "Keluar",
    sivitas: "Sivitas Akademika",
    bukaPortal: "Buka Portal",
    getStarted: "Mulai Sekarang",
    guide: "Panduan",
    privacy: "Kebijakan Privasi",
    help: "Bantuan",
    notFound: "Gak Ketemu",
    notFoundDesc: "Hasilnya gak ada nih. Coba cek lagi ejaannya atau pakai kata kunci yang lebih umum.",

    // New Features
    backToHome: "Kembali ke Beranda",
    authenticating: "Autentikasi",
    navHome: "Beranda",
    navCollections: "Koleksi",
    navJournals: "Jurnal",
    navAbout: "Tentang",
    trustedBy: "Andalan mahasiswa & dosen Telkom University",
    workflowTitle: "Jembatan Ilmu Kamu",
    workflowDesc: "Lihat gimana PustakaONE bikin riset kamu jadi lebih praktis dalam satu tempat.",
    workflowLabel: "Cara Kerja",
    authLabel: "LOGIN",
    authTitle: "Masuk Aman",
    authDesc: "Masuk menggunakan akun institusi kamu yang sudah terdaftar.",
    aggLabel: "DATABASE",
    aggTitle: "Jurnal Terpusat",
    aggDesc: "Cek semua database langganan (JSTOR, Elsevier, IEEE) lewat satu tampilan aja.",
    accLabel: "AKSES",
    accTitle: "Akses Jarak Jauh",
    accDesc: "Baca PDF teks lengkap dari rumah atau sambil jalan tanpa harus pasang VPN.",
    feat1Title: "Koleksi Editorial",
    feat1Desc: "Daftar kurasi ahli buat bantu kamu cari jurnal terbaru setiap minggunya.",
    exploreBtn: "LIHAT KOLEKSI",
    feat2Title: "Terpercaya",
    feat2Desc: "Akses penuh ke jurnal berstandar global yang sudah lewat uji pakar.",
    feat3Title: "Kelola Riset",
    feat3Desc: "Simpan sitasi dan kelola riset kamu di folder pribadi cuma dengan sekali klik.",
    feat4Title: "Profil Peneliti",
    feat4Desc: "Sinkronisasi catatan dan bookmark kamu di semua perangkat secara instan.",
    footerHelp: "Pusat Bantuan",
    footerGuide: "Panduan",
    footerPrivacy: "Kebijakan Privasi",

    // App & Contact
    appExclusive: "Khusus Android",
    downloadApp: "Download PustakaONE",
    downloadDesc: "Akses katalog literatur langsung dari HP kamu. Sekarang PustakaONE baru tersedia buat perangkat Android.",
    contactUs: "Butuh Bantuan?",
    contactDesc: "Tim pustakawan kami siap bantu kalau kamu ada masalah akses atau butuh rekomendasi referensi.",
    contactBtn: "Hubungi Bantuan",
    emailUs: "Kirim Email",

    // Dashboard specific
    dashExplore: "Cari Referensi",
    dashExploreDesc: "Temukan jutaan literatur akademik dari pangkalan data global terbaik.",
    dashSearchPlaceholder: "Cari jurnal, judul, penulis, atau kata kunci...",
    dashAllSources: "Semua Pustaka",
    dashCampusRec: "Rekomendasi Kampus",
    dashSubscribedDB: "Database Jurnal Langganan",
    dashViewAll: "Lihat Semua",
    dashAICurated: "Rekomendasi Pintar AI",

    sidebarHome: "Beranda",
    sidebarEResources: "E-Resources",
    sidebarDatabases: "Database Jurnal",
    sidebarJournals: "Daftar Jurnal",
    sidebarEbooks: "Buku Elektronik",
    sidebarCollections: "Koleksi Pribadi",
    sidebarGeneral: "Koleksi Umum",
    sidebarFavorites: "Favorit",
    sidebarTheme: "Tema Tampilan",
    sidebarLang: "Bahasa",
    sidebarLogout: "Keluar Sesi",

    resTitle: "Katalog e-Resources",
    resDesc: "Cek semua database jurnal, e-book, dan jurnal yang dilanggan Telkom University.",
    resDB: "Database Jurnal",
    resDBDesc: "Akses eksklusif ke platform global ternama kayak Scopus, IEEE, Springer, dan lainnya.",
    resDBBtn: "Buka Katalog",
    resJournal: "Jurnal Ilmiah",
    resJournalDesc: "Cari jutaan jurnal nasional dan internasional dengan standar editorial yang ketat.",
    resJournalBtn: "Mulai Baca",
    resEbook: "Buku Elektronik",
    resEbookDesc: "Gak usah bawa buku cetak berat-berat. Cari ribuan e-book berlisensi buat kuliah kamu.",
    resEbookBtn: "Cari Buku",
    resHelpTitle: "Susah Cari Referensi?",
    resHelpDesc: "Perpustakaan Telkom University punya layanan permintaan literatur. Hubungi pustakawan kami kalau butuh bantuan akses.",
    resHelpBtn: "Ajukan Permintaan",

    favTitle: "Koleksi Favorit",
    favDesc: "Akses cepat ke referensi pilihan kamu. Jurnal dan e-book yang sering kamu pakai ada di sini.",
    favEmptyTitle: "Belum Ada Favorit",
    favEmptyDesc: "Kamu belum simpan referensi apa pun. Klik ikon Hati di kartu pustaka buat simpan ke sini.",
    favExploreBtn: "Cari Pustaka",

    // Institution Selection
    instTitle: "Cari Institusi Kamu",
    instDesc: "Hubungkan ke sumber daya akademik kamu dan buka akses mulus ke arsip editorial paling bergengsi di dunia.",
    libSys: "Sistem Akses Perpustakaan",
    instAccess: "Akses Institusi",
    accessLib: "Akses Layanan Perpustakaan",
    accessLibDesc: "Masuk lewat universitas atau kampus kamu buat akses konten langganan.",
    searchInst: "Cari universitas atau sekolah kamu...",
    results: "Hasil",
    recentAccess: "Terakhir diakses",
    noInstFound: "Institusi gak ketemu buat",
    tryAnother: "Coba kata kunci lain",
    continueBtn: "Lanjutkan",
    authAccessMsg: "Hanya untuk akses resmi. Dengan melanjutkan, kamu setuju sama",
    archPolicy: "Kebijakan Arsip",
    instTerms: "dan ketentuan institusi.",
    support: "Bantuan",
    portal: "Portal PustakaONE"
  },
  en: {
    // Admin
    adminPanel: "Admin",
    dashboard: "Dashboard",
    users: "Users",
    journals: "Databases",
    logs: "Activity Logs",
    settings: "Settings",
    logout: "Log Out",
    totalUsers: "Total Users",
    totalAccess: "Total Accesses",
    activeDB: "Active DBs",
    systemActive: "Uptime",
    traffic: "Visitor Traffic",
    topDB: "Top Databases",
    search: "Looking for something?",
    notifTitle: "New Alerts",

    // Landing
    topUni: "Student Research Hub",
    title1: "Access Your University",
    title2: "Library from Anywhere.",
    subtitle: "Access millions of ebooks, journals, and papers remotely. Save your time from commuting—just log in and dive right into your research.",
    searchPlaceholder: "What database are you looking for today?",
    searchBtn: "Search",
    providedDB: "Available Databases",
    clickLogo: "Just tap on a logo to jump right into the publisher's portal.",
    loginBtn: "Log In",
    logoutBtn: "Log Out",
    sivitas: "Student / Staff",
    bukaPortal: "Open Portal",
    getStarted: "Get Started",
    guide: "How to Use",
    privacy: "Privacy Policy",
    help: "Need Help?",
    notFound: "Oops, nothing found!",
    notFoundDesc: "Try double checking the spelling, or use a broader keyword.",

    // New Features
    backToHome: "Back to Home",
    authenticating: "Authenticating",
    navHome: "Home",
    navCollections: "Collections",
    navJournals: "Journals",
    navAbout: "About",
    trustedBy: "Trusted by researchers from 200+ institutions",
    workflowTitle: "A Seamless Bridge to Knowledge",
    workflowDesc: "Discover how PustakaONE centralizes your institutional research capabilities into one fluid, digital experience.",
    workflowLabel: "The Workflow",
    authLabel: "AUTHENTICATION",
    authTitle: "Secure Login",
    authDesc: "Sign in using your registered institutional credentials.",
    aggLabel: "AGGREGATION",
    aggTitle: "Centralized Journals",
    aggDesc: "Browse all your subscribed databases (JSTOR, Elsevier, IEEE) in a single, unified search interface.",
    accLabel: "ACCESSIBILITY",
    accTitle: "Remote Access",
    accDesc: "Access full-text PDF articles from home, the field, or while traveling without complex VPN configurations.",
    feat1Title: "Editorial Collections",
    feat1Desc: "Curated lists by field experts to help you navigate through thousands of newly published journals every week.",
    exploreBtn: "EXPLORE COLLECTIONS",
    feat2Title: "Peer Reviewed",
    feat2Desc: "Guaranteed access to only high-impact, peer-reviewed journals vetted by global academic standards.",
    feat3Title: "Digital Curator",
    feat3Desc: "Save citations and organize your research into private, shareable digital trays with one click.",
    feat4Title: "Researcher Profile",
    feat4Desc: "Synchronize your annotations and bookmarks across all your devices instantly.",
    footerHelp: "Help Center",
    footerGuide: "User Guide",
    footerPrivacy: "Privacy Policy",

    // App & Contact
    appExclusive: "Android Exclusive",
    downloadApp: "Get PustakaONE App",
    downloadDesc: "Access the entire literature catalog right from your fingertips. Currently, the PustakaONE app is exclusively available on Android devices.",
    contactUs: "Need Further Assistance?",
    contactDesc: "Our curators and librarians are ready to assist with access issues or literature recommendations during campus working hours.",
    contactBtn: "Contact Support Team",
    emailUs: "Send an Email",

    // Dashboard specific
    dashExplore: "Literature Exploration",
    dashExploreDesc: "Discover millions of academic literature from globally reputable databases.",
    dashSearchPlaceholder: "Search journals, article titles, authors, or keywords...",
    dashAllSources: "All Repositories",
    dashCampusRec: "University Recommendations",
    dashSubscribedDB: "Subscribed Databases",
    dashViewAll: "View All",
    dashAICurated: "AI-Powered Smart Recommendations",

    sidebarHome: "Home",
    sidebarEResources: "e-Resources",
    sidebarDatabases: "Databases",
    sidebarJournals: "Journals",
    sidebarEbooks: "e-Books",
    sidebarCollections: "Collections",
    sidebarGeneral: "General Folders",
    sidebarFavorites: "Favorites",
    sidebarTheme: "Theme Settings",
    sidebarLang: "Language",
    sidebarLogout: "Log Out",

    resTitle: "e-Resources Catalog",
    resDesc: "Browse Telkom University's entire collection of subscribed databases, e-books, and journals.",
    resDB: "Databases",
    resDBDesc: "Exclusive access to top-tier global literature platforms like Scopus, IEEE, Springer, and dozens more.",
    resDBBtn: "Open Catalog",
    resJournal: "Journals",
    resJournalDesc: "Explore millions of national and international journals curated with strict editorial standards.",
    resJournalBtn: "Start Reading",
    resEbook: "e-Books",
    resEbookDesc: "Leave the heavy books behind. Find thousands of licensed e-textbooks for various study programs.",
    resEbookBtn: "Find e-Books",
    resHelpTitle: "Access Issues?",
    resHelpDesc: "Telkom University Library provides a literature request service. Contact our librarians for access to specific references.",
    resHelpBtn: "Submit Request",

    favTitle: "Favorites",
    favDesc: "Quick access to your preferred literature. Your most frequently used journals and e-books will be organized here.",
    favEmptyTitle: "No Favorites Yet",
    favEmptyDesc: "You haven't saved any references yet. Click the Heart icon on a bibliography card to save it to this page.",
    favExploreBtn: "Explore Content",

    // Institution Selection
    instTitle: "Find Your Institution",
    instDesc: "Connect to your academic resources and unlock seamless access to the world's most prestigious editorial archives.",
    libSys: "Library Access Systems",
    instAccess: "Institution access",
    accessLib: "Access Library Services",
    accessLibDesc: "Sign in through your university or college to access subscribed content.",
    searchInst: "Search your university or college...",
    results: "Results",
    recentAccess: "Recently accessed",
    noInstFound: "No institutions found for",
    tryAnother: "Try another keyword",
    continueBtn: "Continue",
    authAccessMsg: "Authorized access only. By continuing, you agree to our",
    archPolicy: "Archive Policy",
    instTerms: "and institutional terms.",
    support: "Support",
    portal: "PustakaONE Portal"
  }
};

const LanguageContext = createContext<{ lang: Language, t: typeof translations['id'], toggleLang: () => void, setLanguage: (l: Language) => void } | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('appLang') as Language;
    if ((saved === 'en' || saved === 'id') && saved !== lang) {
      setLang(saved);
    }
    setMounted(true);
  }, [lang]);

  const toggleLang = () => {
    const newLang = lang === 'id' ? 'en' : 'id';
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
  };

  // Prevent hydration mismatch by rendering a consistent initial state
  // Children will be visible but context will be ready after client-side mount
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang, setLanguage }}>
      <div className={!mounted ? "invisible" : ""}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
