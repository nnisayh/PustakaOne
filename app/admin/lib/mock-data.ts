// ─── Traffic & Overview Data ───────────────────────────────────────────────
export const trafficData = [
  { day: "Mon", visitors: 2100, pageviews: 3200 },
  { day: "Tue", visitors: 5800, pageviews: 8200 },
  { day: "Wed", visitors: 3100, pageviews: 4600 },
  { day: "Thu", visitors: 6500, pageviews: 9400 },
  { day: "Fri", visitors: 4200, pageviews: 6100 },
  { day: "Sat", visitors: 1500, pageviews: 2200 },
  { day: "Sun", visitors: 4800, pageviews: 6800 },
]

export const topJournalsData = [
  { name: "IEEE Xplore", accesses: 14500 },
  { name: "ScienceDirect", accesses: 11200 },
  { name: "ProQuest", accesses: 8900 },
  { name: "SpringerLink", accesses: 7400 },
  { name: "ACM Digital", accesses: 6200 },
]

export const userTypesData = [
  { name: "Mahasiswa S1", value: 65 },
  { name: "Mahasiswa S2", value: 20 },
  { name: "Dosen", value: 10 },
  { name: "Staff", value: 5 },
]

export const recentActivityData = [
  { id: "#1042", user: "Budi Santoso", action: "Accessed IEEE Xplore — 'Machine Learning AI'", time: "2 min", ip: "10.4.22.1", type: "access" },
  { id: "#1041", user: "Dr. Hendra W.", action: "Downloaded 'Data Science Review' from ScienceDirect", time: "15 min", ip: "192.168.1.5", type: "download" },
  { id: "#1040", user: "Anita Putri", action: "Logged in via SSO", time: "1 jam", ip: "114.120.44.2", type: "login" },
  { id: "#1039", user: "Rina Marlina", action: "Failed login attempt (Wrong password)", time: "2 jam", ip: "103.22.14.99", type: "failed" },
  { id: "#1038", user: "Ahmad Kurniawan", action: "Searched 'deep learning' on Scopus", time: "3 jam", ip: "10.4.22.15", type: "search" },
]

// ─── Users Data ────────────────────────────────────────────────────────────
export const FACULTIES = [
  "FIF", "FTE", "FEB", "FKB", "FRI", "FIT", "FIK"
] as const

// Faculty color map — updated spec
// Faculty color map — Final Official Telkom University Branding
export const FACULTY_COLORS: Record<string, string> = {
  FTE: "bg-blue-100 text-blue-600",
  FRI: "bg-green-100 text-green-600",
  FIF: "bg-yellow-100 text-yellow-700",
  FEB: "bg-teal-100 text-teal-600",
  FKB: "bg-purple-100 text-purple-600",
  FIT: "bg-cyan-100 text-cyan-600",
  FIK: "bg-orange-100 text-orange-600",
}

export const MAJORS: Record<string, string[]> = {
  FIF: ["S1 Informatika", "S1 Teknologi Informasi", "S1 Data Sains"],
  FTE: ["S1 Teknik Telekomunikasi", "S1 Teknik Elektro", "S1 Teknik Komputer"],
  FEB: ["S1 Manajemen", "S1 Akuntansi", "S1 Ekonomi Pembangunan"],
  FKB: ["S1 DKV", "S1 Desain Interior", "S1 Kriya"],
  FRI: ["S1 Teknik Industri", "S1 Sistem Informasi", "S1 Teknik Logistik"],
  FIT: ["S1 Teknik Fisika", "S1 Teknik Biomedis"],
}

export const ROLES = ["Mahasiswa S1", "Mahasiswa S2", "Dosen", "Staff", "Institute Admin", "Institute Subadmin"] as const

export const mockUsers = [
  { id: 1,  nama: "Budi Santoso",      email: "budi@student.telkomuniversity.ac.id",  nim: "1301204123", faculty: "FIF", major: "S1 Informatika",            role: "Mahasiswa S1", status: "Active",   lastAccess: "2 menit lalu",   createdAt: "2026-04-10", expiryDate: "" },
  { id: 2,  nama: "Dr. Hendra Wijaya", email: "hendra@telkomuniversity.ac.id",         nim: "NIP198012",  faculty: "FIF", major: "S1 Informatika",            role: "Dosen",        status: "Active",   lastAccess: "15 menit lalu",  createdAt: "2026-04-05", expiryDate: "2027-12-31" },
  { id: 3,  nama: "Anita Putri",       email: "anita@student.telkomuniversity.ac.id",  nim: "1301205456", faculty: "FEB", major: "S1 Manajemen",             role: "Mahasiswa S2", status: "Active",   lastAccess: "1 jam lalu",     createdAt: "2026-04-12", expiryDate: "" },
  { id: 4,  nama: "Rina Marlina",      email: "rina@student.telkomuniversity.ac.id",   nim: "1301203789", faculty: "FKB", major: "S1 DKV",                  role: "Mahasiswa S1", status: "Inactive", lastAccess: "3 hari lalu",    createdAt: "2026-03-22", expiryDate: "" },
  { id: 5,  nama: "Ahmad Kurniawan",   email: "ahmad@student.telkomuniversity.ac.id",  nim: "1301206012", faculty: "FTE", major: "S1 Teknik Telekomunikasi", role: "Mahasiswa S1", status: "Active",   lastAccess: "3 jam lalu",    createdAt: "2026-04-18", expiryDate: "" },
  { id: 6,  nama: "Dr. Siti Aminah",   email: "siti@telkomuniversity.ac.id",           nim: "NIP199205",  faculty: "FEB", major: "S1 Akuntansi",            role: "Dosen",        status: "Active",   lastAccess: "30 menit lalu", createdAt: "2026-04-02", expiryDate: "2027-06-30" },
  { id: 7,  nama: "Dian Permata",      email: "dian@student.telkomuniversity.ac.id",   nim: "1301207345", faculty: "FRI", major: "S1 Teknik Industri",      role: "Mahasiswa S1", status: "Active",   lastAccess: "5 jam lalu",    createdAt: "2026-04-20", expiryDate: "" },
  { id: 8,  nama: "Reza Mahardika",    email: "reza@student.telkomuniversity.ac.id",   nim: "1301208678", faculty: "FIF", major: "S1 Data Sains",           role: "Mahasiswa S1", status: "Active",   lastAccess: "1 jam lalu",    createdAt: "2026-04-15", expiryDate: "" },
  { id: 9,  nama: "Prof. Bambang S.",  email: "bambang@telkomuniversity.ac.id",        nim: "NIP198507",  faculty: "FTE", major: "S1 Teknik Elektro",       role: "Dosen",        status: "Active",   lastAccess: "2 jam lalu",    createdAt: "2026-03-01", expiryDate: "2028-01-31" },
  { id: 10, nama: "Lina Fitriani",     email: "lina@telkomuniversity.ac.id",           nim: "NIP199811",  faculty: "FIF", major: "S1 Teknologi Informasi",  role: "Staff",        status: "Active",   lastAccess: "10 menit lalu", createdAt: "2026-04-08", expiryDate: "" },
  { id: 11, nama: "Yoga Pratama",      email: "yoga@student.telkomuniversity.ac.id",   nim: "1301209001", faculty: "FIT", major: "S1 Teknik Fisika",        role: "Mahasiswa S2", status: "Active",   lastAccess: "4 jam lalu",    createdAt: "2026-04-19", expiryDate: "" },
  { id: 12, nama: "Dewi Lestari",      email: "dewi@student.telkomuniversity.ac.id",   nim: "1301209334", faculty: "FIT", major: "S1 Teknik Biomedis",      role: "Mahasiswa S1", status: "Inactive", lastAccess: "1 minggu lalu", createdAt: "2026-02-14", expiryDate: "" },
  { id: 13, nama: "Farid Hidayat",     email: "farid@student.telkomuniversity.ac.id",  nim: "1301201111", faculty: "FIF", major: "S1 Informatika",           role: "Mahasiswa S1", status: "Inactive", lastAccess: "2 minggu lalu", createdAt: "2026-01-30", expiryDate: "" },
  { id: 14, nama: "Sarah Nabila",      email: "sarah@student.telkomuniversity.ac.id",  nim: "1301202222", faculty: "FKB", major: "S1 DKV",                  role: "Mahasiswa S1", status: "Blocked",  lastAccess: "5 hari lalu",   createdAt: "2026-03-10", expiryDate: "", previousStatus: "Active" },
  { id: 15, nama: "Agus Setyawan",     email: "agus@telkomuniversity.ac.id",           nim: "NIP198810",  faculty: "FTE", major: "S1 Teknik Elektro",       role: "Dosen",        status: "Blocked",  lastAccess: "1 minggu lalu", createdAt: "2026-02-20", expiryDate: "2027-01-01", previousStatus: "Active" },
  { id: 16, nama: "Maya Sari",         email: "maya@student.telkomuniversity.ac.id",   nim: "1301203333", faculty: "FEB", major: "S1 Manajemen",             role: "Mahasiswa S1", status: "Blocked",  lastAccess: "3 hari lalu",   createdAt: "2026-03-25", expiryDate: "", previousStatus: "Inactive" },
  { id: 17, nama: "Admin Library",     email: "admin@telkomuniversity.ac.id",          nim: "ADM001",     faculty: "FIF", major: "S1 Informatika",            role: "Institute Admin",    status: "Active",   lastAccess: "Just now",      createdAt: "2026-04-01", expiryDate: "" },
  { id: 18, nama: "Fauzan Subadmin",   email: "fauzan@telkomuniversity.ac.id",         nim: "ADM002",     faculty: "FTE", major: "S1 Teknik Elektro",       role: "Institute Subadmin", status: "Active",   lastAccess: "10 menit lalu", createdAt: "2026-04-05", expiryDate: "" },
]

export const activeOnlineUsers = [
  { name: "Budi Santoso",    faculty: "FIF", role: "Mahasiswa S1", since: "10:42" },
  { name: "Dr. Hendra W.",   faculty: "FIF", role: "Dosen",        since: "10:30" },
  { name: "Anita Putri",     faculty: "FEB", role: "Mahasiswa S2", since: "09:55" },
  { name: "Ahmad Kurniawan", faculty: "FTE", role: "Mahasiswa S1", since: "10:15" },
  { name: "Lina Fitriani",   faculty: "FIF", role: "Staff",        since: "08:00" },
  { name: "Dr. Siti Aminah", faculty: "FEB", role: "Dosen",        since: "09:20" },
  { name: "Reza Mahardika",  faculty: "FIF", role: "Mahasiswa S1", since: "10:50" },
  { name: "Admin Library",   faculty: "FIF", role: "Institute Admin", since: "08:15" },
]

// ─── Analytics Data ────────────────────────────────────────────────────────
export const keywordTrendData = [
  { month: "Jan", "Machine Learning": 180, "Deep Learning": 120, "Data Science": 320, "IoT": 90, "Cloud Computing": 110 },
  { month: "Feb", "Machine Learning": 420, "Deep Learning": 150, "Data Science": 190, "IoT": 280, "Cloud Computing": 65 },
  { month: "Mar", "Machine Learning": 280, "Deep Learning": 480, "Data Science": 375, "IoT": 110, "Cloud Computing": 210 },
  { month: "Apr", "Machine Learning": 550, "Deep Learning": 280, "Data Science": 165, "IoT": 420, "Cloud Computing": 68 },
  { month: "Mei", "Machine Learning": 310, "Deep Learning": 620, "Data Science": 455, "IoT": 135, "Cloud Computing": 312 },
  { month: "Jun", "Machine Learning": 680, "Deep Learning": 420, "Data Science": 160, "IoT": 510, "Cloud Computing": 70 },
]

export const keywordTableData = [
  { keyword: "Machine Learning", frequency: 2340, trend: "+23%", trendUp: true, topFaculty: "FIF", peakMonth: "June" },
  { keyword: "Deep Learning", frequency: 1890, trend: "+45%", trendUp: true, topFaculty: "FTE", peakMonth: "May" },
  { keyword: "Data Science", frequency: 1560, trend: "-8%", trendUp: false, topFaculty: "FIF", peakMonth: "May" },
  { keyword: "IoT", frequency: 1230, trend: "+12%", trendUp: true, topFaculty: "FTE", peakMonth: "June" },
  { keyword: "Cloud Computing", frequency: 980, trend: "0%", trendUp: null, topFaculty: "FIF", peakMonth: "May" },
  { keyword: "Cybersecurity", frequency: 870, trend: "+31%", trendUp: true, topFaculty: "FIF", peakMonth: "April" },
  { keyword: "Blockchain", frequency: 650, trend: "-15%", trendUp: false, topFaculty: "FRI", peakMonth: "January" },
  { keyword: "5G Network", frequency: 540, trend: "+8%", trendUp: true, topFaculty: "FTE", peakMonth: "March" },
]

export const platformRankingData = [
  { rank: 1, name: "Scopus", accesses: 14500, status: "renew" },
  { rank: 2, name: "IEEE Xplore", accesses: 11200, status: "renew" },
  { rank: 3, name: "ScienceDirect", accesses: 8900, status: "renew" },
  { rank: 4, name: "ProQuest", accesses: 4200, status: "evaluate" },
  { rank: 5, name: "JSTOR", accesses: 1800, status: "evaluate" },
]

export const downloadTrendData = [
  { day: "Mon", downloads: 245 },
  { day: "Tue", downloads: 580 },
  { day: "Wed", downloads: 210 },
  { day: "Thu", downloads: 690 },
  { day: "Fri", downloads: 356 },
  { day: "Sat", downloads: 820 },
  { day: "Sun", downloads: 165 },
]

export const excessDownloadAlerts = [
  { id: 101, user: "Budi Santoso", count: 67, faculty: "FIF", ip: "10.4.22.1", time: "10:45 AM", status: "Pending" },
  { id: 102, user: "Ahmad Kurniawan", count: 82, faculty: "FTE", ip: "10.4.22.15", time: "09:15 AM", status: "Pending" },
]

export const anomalyLogs = [
  { id: 100, user: "Dr. Hendra W.", count: 45, faculty: "FIF", ip: "192.168.1.5", time: "Yesterday, 02:30 PM", status: "Investigated" },
  { id: 99, user: "Anita Putri", count: 52, faculty: "FEB", ip: "114.120.44.2", time: "Yesterday, 11:15 AM", status: "Dismissed" },
  { id: 98, user: "Rina Marlina", count: 38, faculty: "FKB", ip: "103.22.14.99", time: "2 days ago", status: "Investigated" },
]

// ─── Databases Data ────────────────────────────────────────────────────────
export const mockJournals = [
  { id: 1, name: "IEEE Xplore", category: "Engineering", url: "https://ieeexplore.ieee.org", accessMethod: "SAML", status: "Active", uptime: "99.9%", responseTime: "42ms", publisher: "IEEE", subscriptionExpiry: "31 Dec 2026", coverage: "Journals, Conference Papers, Standards", lastChecked: "2 mins ago" },
  { id: 2, name: "ScienceDirect", category: "Multidisciplinary", url: "https://sciencedirect.com", accessMethod: "Proxy", status: "Active", uptime: "99.8%", responseTime: "38ms", publisher: "Elsevier", subscriptionExpiry: "15 Nov 2026", coverage: "Journals, Books", lastChecked: "5 mins ago" },
  { id: 3, name: "ProQuest", category: "Social Sciences", url: "https://proquest.com", accessMethod: "Proxy", status: "Maintenance", uptime: "95.2%", responseTime: "1.2s", publisher: "ProQuest LLC", subscriptionExpiry: "20 Oct 2026", coverage: "Dissertations, News, Periodicals", lastChecked: "1 min ago" },
  { id: 4, name: "SpringerLink", category: "Multidisciplinary", url: "https://link.springer.com", accessMethod: "SAML", status: "Active", uptime: "99.7%", responseTime: "55ms", publisher: "Springer Nature", subscriptionExpiry: "05 Jan 2027", coverage: "Books, Journals, Series", lastChecked: "10 mins ago" },
  { id: 5, name: "ACM Digital Library", category: "Computer Science", url: "https://dl.acm.org", accessMethod: "Direct", status: "Down", uptime: "78.1%", responseTime: "timeout", publisher: "ACM", subscriptionExpiry: "12 Dec 2026", coverage: "Computing Literature", lastChecked: "Just now" },
  { id: 6, name: "Emerald Insight", category: "Business", url: "https://emerald.com", accessMethod: "Proxy", status: "Active", uptime: "99.5%", responseTime: "60ms", publisher: "Emerald Publishing", subscriptionExpiry: "30 Sep 2026", coverage: "Case Studies, Management", lastChecked: "15 mins ago" },
  { id: 7, name: "Wiley Online", category: "Science", url: "https://onlinelibrary.wiley.com", accessMethod: "SAML", status: "Active", uptime: "99.6%", responseTime: "48ms", publisher: "John Wiley & Sons", subscriptionExpiry: "18 Aug 2027", coverage: "Life, Health, Physical Sciences", lastChecked: "8 mins ago" },
  { id: 8, name: "JSTOR", category: "Humanities", url: "https://jstor.org", accessMethod: "Proxy", status: "Active", uptime: "99.4%", responseTime: "65ms", publisher: "ITHAKA", subscriptionExpiry: "01 Mar 2027", coverage: "Art, History, Literature", lastChecked: "12 mins ago" },
]

export const healthCheckData = [
  { name: "IEEE", status: "up", responseTime: "42ms", uptime: "99.9%" },
  { name: "ScienceDirect", status: "up", responseTime: "38ms", uptime: "99.8%" },
  { name: "ProQuest", status: "slow", responseTime: "1.2s", uptime: "95.2%" },
  { name: "SpringerLink", status: "up", responseTime: "55ms", uptime: "99.7%" },
  { name: "ACM Digital", status: "down", responseTime: "timeout", uptime: "78.1%" },
  { name: "Emerald", status: "up", responseTime: "60ms", uptime: "99.5%" },
  { name: "Wiley", status: "up", responseTime: "48ms", uptime: "99.6%" },
  { name: "JSTOR", status: "up", responseTime: "65ms", uptime: "99.4%" },
]

export const mockJournalItems = [
  { id: 101, title: "Nature", publisher: "Nature Publishing Group", category: "Science", status: "Active", updatedDate: "2026-04-18", expiryDate: "2026-12-31" },
  { id: 102, title: "Science", publisher: "American Association for the Advancement of Science", category: "Science", status: "Active", updatedDate: "2026-04-10", expiryDate: "2026-11-30" },
  { id: 103, title: "The Lancet", publisher: "Elsevier", category: "Health", status: "Maintenance", updatedDate: "2026-03-22", expiryDate: "2026-10-15" },
  { id: 104, title: "Cell", publisher: "Cell Press", category: "Science", status: "Active", updatedDate: "2026-04-05", expiryDate: "2026-12-31" },
  { id: 105, title: "IEEE Access", publisher: "IEEE", category: "Engineering", status: "Active", updatedDate: "2026-04-19", expiryDate: "2026-12-31" },
]

export const mockEbooks = [
  { id: 201, judul: "Introduction to Algorithms", penerbit: "MIT Press", category: "Computer Science", status: "Active", tanggal: "2026-01-15", expiry: "Lifetime" },
  { id: 202, judul: "Artificial Intelligence: A Modern Approach", penerbit: "Pearson", category: "Computer Science", status: "Active", tanggal: "2025-11-20", expiry: "2027-01-01" },
  { id: 203, judul: "Clean Code", penerbit: "Prentice Hall", category: "Engineering", status: "Maintenance", tanggal: "2025-08-10", expiry: "Lifetime" },
  { id: 204, judul: "Design Patterns", penerbit: "Addison-Wesley", category: "Engineering", status: "Active", tanggal: "2025-09-05", expiry: "Lifetime" },
  { id: 205, judul: "Deep Learning", penerbit: "MIT Press", category: "Computer Science", status: "Active", tanggal: "2026-02-28", expiry: "2027-12-31" },
]

export const availableDatabases = [
  { id: 1001, name: "Scopus", category: "Multidisciplinary", accessMethod: "SAML", url: "https://scopus.com", description: "Abstract and citation database", publisher: "Elsevier", subscriptionExpiry: "12 Dec 2027", coverage: "Articles, Books" },
  { id: 1002, name: "Taylor & Francis Online", category: "Social Sciences", accessMethod: "Proxy", url: "https://tandfonline.com", description: "Journal platform", publisher: "Informa UK Limited", subscriptionExpiry: "31 Oct 2026", coverage: "Journals" },
  { id: 1003, name: "Statista", category: "Business", accessMethod: "IP-based", url: "https://statista.com", description: "Global data and business intelligence", publisher: "Statista GmbH", subscriptionExpiry: "01 Jan 2027", coverage: "Statistics, Reports" },
  { id: 1004, name: "Web of Science", category: "Multidisciplinary", accessMethod: "SAML", url: "https://webofscience.com", description: "Research analytics", publisher: "Clarivate", subscriptionExpiry: "25 Feb 2028", coverage: "Journals, Data" },
]

export const availableJournalItems = [
  { id: 2001, title: "Nature Biotechnology", publisher: "Springer Nature", updatedDate: "2026-04-10", expiryDate: "2027-12-31" },
  { id: 2002, title: "Artificial Intelligence Review", publisher: "Springer Nature", updatedDate: "2026-03-28", expiryDate: "2026-12-31" },
  { id: 2003, title: "Journal of Finance", publisher: "Wiley", updatedDate: "2026-04-15", expiryDate: "2028-06-30" },
  { id: 2004, title: "Computer Graphics Forum", publisher: "Wiley", updatedDate: "2026-04-05", expiryDate: "2027-11-15" },
  { id: 2005, title: "MIS Quarterly", publisher: "MISRC", updatedDate: "2026-03-12", expiryDate: "2026-12-31" },
]

export const availableEbookItems = [
  { id: 3001, judul: "Clean Architecture", penerbit: "Prentice Hall", tanggal: "2025-05-15", expiry: "Lifetime" },
  { id: 3002, judul: "The Pragmatic Programmer", penerbit: "Addison-Wesley", tanggal: "2024-11-10", expiry: "Lifetime" },
  { id: 3003, judul: "Designing Data-Intensive Applications", penerbit: "O'Reilly", tanggal: "2026-01-20", expiry: "2028-01-01" },
  { id: 3004, judul: "Computer Networks", penerbit: "Pearson", tanggal: "2025-08-01", expiry: "2027-08-01" },
  { id: 3005, judul: "Operating System Concepts", penerbit: "Wiley", tanggal: "2025-03-30", expiry: "Lifetime" },
]

// ─── Security Data ─────────────────────────────────────────────────────────
export const securityStats = {
  successfulLogins: 1245,
  failedLogins: 23,
  anomalies: 3,
  blockedIps: 12
}

export const anomalyAlerts = [
  {
    id: 1,
    severity: "critical",
    title: "Login dari 2 lokasi berbeda",
    description: 'User "Budi Santoso" login dari Jakarta (10:00) lalu dari Surabaya (10:05). Jarak: 700km dalam 5 menit.',
    user: "Budi Santoso",
    time: "10:05",
  },
  {
    id: 2,
    severity: "medium",
    title: "Brute force terdeteksi",
    description: "IP 103.22.14.99 mencoba login 15x dalam 2 menit. Akun target: rina@student.telkomuniversity.ac.id",
    user: "Rina Marlina",
    time: "08:30",
  },
  {
    id: 3,
    severity: "medium",
    title: "Unduhan berlebih",
    description: 'User "Ahmad Kurniawan" mengunduh 82 file dalam 45 menit dari IEEE Xplore.',
    user: "Ahmad Kurniawan",
    time: "09:15",
  },
]

export const securityLogs = [
  { id: "#1042", user: "Budi Santoso", type: "Access", status: "success", ip: "10.4.22.1", location: "Jakarta", time: "2 mnt lalu" },
  { id: "#1041", user: "Dr. Hendra W.", type: "Download", status: "success", ip: "192.168.1.5", location: "Bandung", time: "15 mnt lalu" },
  { id: "#1040", user: "Anita Putri", type: "Login", status: "success", ip: "114.120.44.2", location: "Bandung", time: "1 jam lalu" },
  { id: "#1039", user: "Rina Marlina", type: "Login", status: "failed", ip: "103.22.14.99", location: "Unknown", time: "2 jam lalu" },
  { id: "#1038", user: "Unknown", type: "Login", status: "failed", ip: "103.22.14.99", location: "Unknown", time: "2 jam lalu" },
  { id: "#1037", user: "Ahmad Kurniawan", type: "Download", status: "success", ip: "10.4.22.15", location: "Bandung", time: "3 jam lalu" },
  { id: "#1036", user: "Dr. Siti Aminah", type: "Access", status: "success", ip: "192.168.2.10", location: "Bandung", time: "3 jam lalu" },
  { id: "#1035", user: "Yoga Pratama", type: "Login", status: "success", ip: "114.120.50.8", location: "Surabaya", time: "4 jam lalu" },
  { id: "#1034", user: "Unknown", type: "Login", status: "failed", ip: "185.220.101.42", location: "Germany", time: "5 jam lalu" },
  { id: "#1033", user: "Dian Permata", type: "Access", status: "success", ip: "10.4.23.8", location: "Bandung", time: "5 jam lalu" },
]

// ─── Chart Color Constants ─────────────────────────────────────────────────
export const CHART_COLORS = ['#2d78f2', '#2ac9fa', '#7fc9fb', '#38bdf8']
export const KEYWORD_COLORS = ['#2d78f2', '#2ac9fa', '#2ac9fa', '#7fc9fb', '#38bdf8']

export const securityTrendData = [
  { date: "Mon", success: 1200, fail: 12 },
  { date: "Tue", success: 1350, fail: 15 },
  { date: "Wed", success: 1100, fail: 8 },
  { date: "Thu", success: 1420, fail: 45 },
  { date: "Fri", success: 1500, fail: 22 },
  { date: "Sat", success: 850, fail: 10 },
  { date: "Sun", success: 920, fail: 18 }
]

export const blockedIPsData = [
  { ip: "103.22.14.99", reason: "Brute force attempts (15x)", time: "2 hours ago" },
  { ip: "185.220.101.42", reason: "Suspicious German Tor Node", time: "5 hours ago" },
  { ip: "45.133.1.22", reason: "Multiple access violations", time: "1 day ago" }
]

export const alertHistoryData = [
  { id: 101, severity: "critical", title: "Malware Signature Detected", description: "Blocked payload from IP 110.12.33.4", time: "Yesterday", status: "Blocked" },
  { id: 102, severity: "low", title: "Failed Login Spike", description: "3 failed attempt for Admin account", time: "2 days ago", status: "Dismissed" }
]

// ─── Extended Analytics Data ───────────────────────────────────────────────

// Downloads by Faculty (PDF vs HTML Stacked)
export const downloadReportData = [
  { faculty: "FIF", pdf: 890, html: 210, users: 320, sessions: 1200 },
  { faculty: "FTE", pdf: 670, html: 180, users: 210, sessions: 980 },
  { faculty: "FEB", pdf: 540, html: 120, users: 180, sessions: 750 },
  { faculty: "FKB", pdf: 420, html: 150, users: 150, sessions: 620 },
  { faculty: "FRI", pdf: 380, html: 90, users: 110, sessions: 540 },
  { faculty: "FIT", pdf: 310, html: 115, users: 95, sessions: 480 },
  { faculty: "FIK", pdf: 290, html: 85, users: 80, sessions: 410 },
]

// Data Usage by Faculty (GB)
export const dataUsageFacultyData = [
  { faculty: "FIF", usage: 45.2, users: 320, sessions: 1200 },
  { faculty: "FTE", usage: 32.1, users: 210, sessions: 980 },
  { faculty: "FEB", usage: 28.5, users: 180, sessions: 750 },
  { faculty: "FKB", usage: 15.8, users: 150, sessions: 620 },
  { faculty: "FRI", usage: 12.4, users: 110, sessions: 540 },
  { faculty: "FIT", usage: 10.2, users: 95, sessions: 480 },
  { faculty: "FIK", usage: 8.5, users: 80, sessions: 410 },
]

// Resource wise Data Usage (Pie)
export const dataUsageResourceData = [
  { name: "Scopus", value: 450, color: '#2d78f2' },
  { name: "IEEE Xplore", value: 380, color: '#2ac9fa' },
  { name: "ScienceDirect", value: 310, color: '#7fc9fb' },
  { name: "ProQuest", value: 240, color: '#38bdf8' },
  { name: "SpringerLink", value: 180, color: '#94e2ff' },
]

// Search Engine Usage (Pie)
export const searchEngineUsageData = [
  { name: "MyDiscovery", value: 45, color: '#2d78f2' },
  { name: "Google Scholar", value: 25, color: '#2ac9fa' },
  { name: "EBSCO", value: 15, color: '#7fc9fb' },
  { name: "Direct Publisher", value: 10, color: '#38bdf8' },
  { name: "Internal Search", value: 5, color: '#94e2ff' },
]

// eResource Click Analytics
export const eResourceClickTypeData = [
  { name: "Database", value: 450, color: '#2d78f2' },
  { name: "eBook", value: 280, color: '#2ac9fa' },
  { name: "Journal", value: 320, color: '#7fc9fb' },
  { name: "External Link", value: 120, color: '#38bdf8' },
  { name: "Document File", value: 80, color: '#94e2ff' },
]

export const eResourceClickTitleData = [
  { title: "IEEE Xplore", users: 320, clicks: 1200, trend: "+12%" },
  { title: "Scopus", users: 210, clicks: 980, trend: "+8%" },
  { title: "ScienceDirect", users: 180, clicks: 750, trend: "-3%" },
  { title: "SpringerLink", users: 150, clicks: 620, trend: "+15%" },
  { title: "Oxford Journals", users: 120, clicks: 540, trend: "+5%" },
]

// ─── Tertiary Reporting Datasets (Downloads Tab) ───────────────────────────

export const userCategoryDownloadData = [
  { category: "Mahasiswa S1", pdf: 2450, html: 850, users: 1240, sessions: 4500 },
  { category: "Mahasiswa S2", pdf: 1200, html: 450, users: 450, sessions: 1800 },
  { category: "Dosen", pdf: 850, html: 320, users: 210, sessions: 950 },
  { category: "Staff", pdf: 120, html: 45, users: 85, sessions: 240 },
]

export const resourceDownloadData = [
  { resource: "Scopus", pdf: 1450, html: 320, users: 850, sessions: 3200 },
  { resource: "IEEE Xplore", pdf: 1200, html: 280, users: 640, sessions: 2800 },
  { resource: "ScienceDirect", pdf: 980, html: 210, users: 520, sessions: 2100 },
  { resource: "ProQuest", pdf: 750, html: 180, users: 410, sessions: 1500 },
  { resource: "SpringerLink", pdf: 540, html: 140, users: 320, sessions: 1200 },
]

export const dailyDownloadData = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-04-${String(i + 1).padStart(2, '0')}`,
  pdf: Math.floor(Math.random() * 200) + 50,
  html: Math.floor(Math.random() * 80) + 20,
  users: Math.floor(Math.random() * 100) + 30,
  sessions: Math.floor(Math.random() * 300) + 100,
}))

export const monthlyDownloadData = [
  { month: "January 2026", pdf: 4500, html: 1200, users: 3200, sessions: 12000 },
  { month: "February 2026", pdf: 4200, html: 1100, users: 3100, sessions: 11500 },
  { month: "March 2026", pdf: 5400, html: 1500, users: 4200, sessions: 15000 },
  { month: "April 2026", pdf: 6200, html: 1800, users: 4800, sessions: 18500 },
  { month: "May 2026", pdf: 5800, html: 1600, users: 4500, sessions: 17000 },
  { month: "June 2026", pdf: 7100, html: 2100, users: 5200, sessions: 21000 },
]

// ─── User-wise Analytics Data ──────────────────────────────────────────────
export const userWiseUsageData = [
  { nim: "1301210001", name: "Budi Santoso", faculty: "FIF", sessions: 197, dataUsage: "165.0 GB", lastActive: "2 hours ago" },
  { nim: "1301210422", name: "Rina Marlina", faculty: "FIF", sessions: 178, dataUsage: "82.5 GB", lastActive: "5 hours ago" },
  { nim: "1103210085", name: "Ahmad Kurniawan", faculty: "FTE", sessions: 80, dataUsage: "58.5 GB", lastActive: "1 day ago" },
  { nim: "1103212040", name: "Siti Aminah", faculty: "FTE", sessions: 36, dataUsage: "8.3 GB", lastActive: "3 days ago" },
  { nim: "1402213102", name: "Dian Permata", faculty: "FEB", sessions: 194, dataUsage: "2.27 GB", lastActive: "Just now" },
]

export const userWiseDownloadData = [
  { nim: "1301210001", name: "Budi Santoso", sessions: 42, pdfs: 56, htmls: 12, total: 68 },
  { nim: "1301210422", name: "Rina Marlina", sessions: 28, pdfs: 34, htmls: 8, total: 42 },
  { nim: "1103210085", name: "Ahmad Kurniawan", sessions: 35, pdfs: 43, htmls: 15, total: 58 },
  { nim: "1402213102", name: "Dian Permata", sessions: 22, pdfs: 28, htmls: 6, total: 34 },
]

export const userTitleDownloadData = [
  { nim: "1301210001", name: "Budi Santoso", sessions: 124, pdfs: 124, htmls: 45, total: 169 },
  { nim: "1301210422", name: "Rina Marlina", sessions: 89, pdfs: 89, htmls: 32, total: 121 },
  { nim: "1103210085", name: "Ahmad Kurniawan", sessions: 76, pdfs: 76, htmls: 28, total: 104 },
  { nim: "1103212040", name: "Siti Aminah", sessions: 54, pdfs: 54, htmls: 18, total: 72 },
  { nim: "1402213102", name: "Dian Permata", sessions: 42, pdfs: 42, htmls: 11, total: 53 },
]

// ─── Welcome Email Statistics ──────────────────────────────────────────────
export const welcomeEmailStats = {
  totalSent: 1240,
  opened: 980, // 79%
  failed: 45,
  pending: 215,
  trends: [
    { day: 'Mon', sent: 120, opened: 95 },
    { day: 'Tue', sent: 150, opened: 110 },
    { day: 'Wed', sent: 200, opened: 160 },
    { day: 'Thu', sent: 180, opened: 140 },
    { day: 'Fri', sent: 220, opened: 180 },
    { day: 'Sat', sent: 210, opened: 175 },
    { day: 'Sun', sent: 160, opened: 120 },
  ]
}

export const userCategoryEmailData = [
  { category: "MAHASISWA S1 TEKNOLOGI INFORMASI - KAMPUS JAKARTA (FIF)", users: 60, sent: 60, opened: 4, loggedIn: 0, neverLoggedIn: 60, invalid: 0 },
  { category: "MAHASISWA S2 MANAJEMEN PJJ (FEB)", users: 45, sent: 90, opened: 2, loggedIn: 0, neverLoggedIn: 45, invalid: 0 },
  { category: "MAHASISWA S2 INFORMATIKA (FIF)", users: 41, sent: 41, opened: 0, loggedIn: 4, neverLoggedIn: 37, invalid: 0 },
  { category: "MAHASISWA S2 TEKNIK ELEKTRO (FTE)", users: 38, sent: 71, opened: 3, loggedIn: 3, neverLoggedIn: 35, invalid: 0 },
  { category: "MAHASISWA S2 ADMINISTRASI BISNIS (FEB)", users: 33, sent: 33, opened: 0, loggedIn: 1, neverLoggedIn: 32, invalid: 0 },
  { category: "MAHASISWA S2 MANAJEMEN (FEB)", users: 24, sent: 24, opened: 0, loggedIn: 2, neverLoggedIn: 22, invalid: 0 },
  { category: "MAHASISWA S2 SISTEM INFORMASI (FRI)", users: 24, sent: 48, opened: 2, loggedIn: 4, neverLoggedIn: 20, invalid: 0 },
  { category: "MAHASISWA S2 TEKNIK INDUSTRI (FRI)", users: 18, sent: 32, opened: 2, loggedIn: 1, neverLoggedIn: 15, invalid: 0 },
  { category: "MAHASISWA S2 ILMU KOMUNIKASI (FKB)", users: 15, sent: 15, opened: 2, loggedIn: 2, neverLoggedIn: 13, invalid: 0 },
]

export const facultyEmailData = [
  { faculty: "FIF", dosen: 45, mhsS1: 850, mhsS2: 120, staff: 25, total: 1040 },
  { faculty: "FTE", dosen: 38, mhsS1: 620, mhsS2: 95, staff: 18, total: 771 },
  { faculty: "FEB", dosen: 42, mhsS1: 740, mhsS2: 150, staff: 30, total: 962 },
  { faculty: "FKB", dosen: 25, mhsS1: 520, mhsS2: 60, staff: 15, total: 620 },
  { faculty: "FRI", dosen: 30, mhsS1: 580, mhsS2: 80, staff: 20, total: 710 },
  { faculty: "FIT", dosen: 22, mhsS1: 450, mhsS2: 40, staff: 12, total: 524 },
  { faculty: "FIK", dosen: 18, mhsS1: 380, mhsS2: 35, staff: 10, total: 443 },
]

export const roleEmailData = [
  { role: "Mahasiswa S1", users: 1240, sent: 1240, opened: 980, loggedIn: 450, neverLoggedIn: 790, invalid: 30 },
  { role: "Mahasiswa S2", users: 450, sent: 900, opened: 120, loggedIn: 180, neverLoggedIn: 270, invalid: 10 },
  { role: "Dosen", users: 210, sent: 210, opened: 195, loggedIn: 190, neverLoggedIn: 20, invalid: 5 },
  { role: "Staff", users: 85, sent: 85, opened: 70, loggedIn: 65, neverLoggedIn: 20, invalid: 0 },
]

// ─── Trend Reports History ─────────────────────────────────────────────────
export const monthlyActivityTrend = [
  { month: 'Jan', activeUsers: 8500, newUsers: 450, bounceRate: 12 },
  { month: 'Feb', activeUsers: 9200, newUsers: 520, bounceRate: 10 },
  { month: 'Mar', activeUsers: 10500, newUsers: 680, bounceRate: 8 },
  { month: 'Apr', activeUsers: 11200, newUsers: 710, bounceRate: 9 },
  { month: 'May', activeUsers: 12800, newUsers: 890, bounceRate: 7 },
  { month: 'Jun', activeUsers: 14500, newUsers: 950, bounceRate: 6 },
]

export const monthlyDownloadTrend = [
  { month: 'Jan', journal: 4500, ebook: 1200, database: 8500 },
  { month: 'Feb', journal: 4800, ebook: 1400, database: 8900 },
  { month: 'Mar', journal: 5200, ebook: 1550, database: 9500 },
  { month: 'Apr', journal: 5500, ebook: 1800, database: 10200 },
  { month: 'May', journal: 6200, ebook: 2100, database: 11500 },
  { month: 'Jun', journal: 6800, ebook: 2400, database: 12800 },
]

// ─── Library Recommended Links Click Data ──────────────────────────────────
export const recommendedLinkClicks = [
  { title: "Turnitin Guide", category: "Academic Integrity", clicks: 1450, trend: "+15%" },
  { title: "Mendeley Workshop", category: "Citation Tool", clicks: 980, trend: "+22%" },
  { title: "Journal Publication Fund", category: "Service", clicks: 750, trend: "+5%" },
  { title: "Research Methodology", category: "LibGuide", clicks: 1200, trend: "+12%" },
]
// ─── Title Level Download Reports Data ──────────────────────────────────────
export const publisherWiseDownloadData = [
  { publisher: "Elsevier", pdf: 2850, html: 850, users: 1200, sessions: 4500 },
  { publisher: "IEEE", pdf: 2100, html: 420, users: 950, sessions: 3800 },
  { publisher: "Springer Nature", pdf: 1850, html: 380, users: 800, sessions: 3200 },
  { publisher: "Wiley", pdf: 1450, html: 320, users: 650, sessions: 2800 },
  { publisher: "Taylor & Francis", pdf: 980, html: 210, users: 500, sessions: 2100 },
  { publisher: "SAGE", pdf: 750, html: 180, users: 400, sessions: 1500 },
  { publisher: "Oxford University Press", pdf: 540, html: 140, users: 320, sessions: 1200 },
]

export const topTitlesDownloadData = [
  { title: "Machine Learning: A Probabilistic Perspective", pdf: 1127, html: 1, users: 31, sessions: 345 },
  { title: "Deep Learning (Adaptive Computation and Machine Learning series)", pdf: 574, html: 3, users: 48, sessions: 233 },
  { title: "Artificial Intelligence: A Modern Approach", pdf: 432, html: 3, users: 19, sessions: 184 },
  { title: "Introduction to Algorithms", pdf: 405, html: 8, users: 50, sessions: 180 },
  { title: "Pattern Recognition and Machine Learning", pdf: 372, html: 1, users: 23, sessions: 144 },
  { title: "Computer Networking: A Top-Down Approach", pdf: 318, html: 2, users: 34, sessions: 143 },
  { title: "Clean Code: A Handbook of Agile Software Craftsmanship", pdf: 310, html: 10, users: 23, sessions: 154 },
  { title: "The Pragmatic Programmer", pdf: 306, html: 0, users: 1, sessions: 97 },
  { title: "Database System Concepts", pdf: 291, html: 7, users: 32, sessions: 153 },
  { title: "Operating System Concepts", pdf: 274, html: 4, users: 28, sessions: 130 },
]
