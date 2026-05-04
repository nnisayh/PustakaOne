"use client"

import { useState } from "react"
import { useLanguage } from "@/app/admin/components/providers/language-provider"
import { useNotifications } from "@/app/admin/components/providers/notification-provider"
import { useTheme } from "next-themes"
import { User, Globe, Key, Bell, Palette, Moon, Sun, Save, Phone, Briefcase, Mail, Shield, Lock, Trash2, History, Download, LogOut, ChevronRight, Check } from "lucide-react"
import { AnimatedTabs } from "@/app/admin/components/ui/AnimatedTabs"
import { WidgetDropdown } from "@/app/admin/components/ui/WidgetDropdown"
import Portal from "@/app/admin/components/shared/Portal"
import ConfirmDialog from "@/app/admin/components/shared/ConfirmDialog"

export default function SettingsPage() {
  const { t, lang, setLanguage } = useLanguage()
  const { notify } = useNotifications()
  const { resolvedTheme, setTheme } = useTheme()

  // --- States ---
  // Profile
  const [adminName, setAdminName] = useState("Super Administrator")
  const [adminPosition, setAdminPosition] = useState("IT Security Lead")
  const [adminPhone, setAdminPhone] = useState("+62 812-3456-7890")
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null)
  
  // Password
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [passStrength, setPassStrength] = useState({ label: "None", color: "bg-slate-200", width: "0%" })

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState([
    { id: 'email_security', label: "Email notifications for security alerts", checked: true },
    { id: 'push_user', label: "Push notifications for new user registrations", checked: true },
    { id: 'daily_digest', label: "Daily digest report via email", checked: false },
    { id: 'excess_download', label: "Alert on excessive downloads (> 50/hour)", checked: true },
    { id: 'weekly_summary', label: "Weekly summary report via email", checked: true },
    { id: 'new_db', label: "Notify on new database added", checked: false },
  ])

  // Appearance & Language
  const [timezone, setTimezone] = useState("WIB (UTC+7)")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")

  // System Configuration
  const [sysConfig, setSysConfig] = useState({
    maxDownload: 50,
    maxLogin: 5,
    sessionTimeout: "1 jam",
    maintenanceMode: false
  })

  // Global UI
  const [confirmationConfig, setConfirmationConfig] = useState<{ title: string; desc: string; type: 'maintenance' | 'system' | 'danger'; onConfirm: () => void; isRed?: boolean } | null>(null)

  // --- Handlers ---
  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => {
      const next = { ...prev, [name]: value }
      if (name === "new") {
        if (!value) setPassStrength({ label: "None", color: "bg-slate-200", width: "0%" })
        else if (value.length < 6) setPassStrength({ label: "Weak", color: "bg-rose-500", width: "30%" })
        else if (value.length < 10) setPassStrength({ label: "Medium", color: "bg-amber-500", width: "65%" })
        else setPassStrength({ label: "Strong", color: "bg-emerald-500", width: "100%" })
      }
      return next
    })
  }

  const toggleNotif = (id: string) => {
    setNotifPrefs(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p))
    notify("success", "Preferences Saved", "Notifikasi telah diperbarui secara otomatis.")
  }

  const updateAppearance = (type: string, val: string) => {
    if (type === 'theme') setTheme(val)
    if (type === 'lang') setLanguage(val as 'id' | 'en')
    if (type === 'timezone') setTimezone(val)
    if (type === 'dateFormat') setDateFormat(val)
    notify("success", "Appearance Updated", "Tampilan dan bahasa telah diperbarui.")
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAdminPhoto(URL.createObjectURL(e.target.files[0]))
      notify("success", "Photo Updated", "Foto profil Anda telah diperbarui.")
    }
  }

  return (
    <div className="pb-20">
      <div className="mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-white tracking-tight">{t.settings}</h1>
        <p className="text-[#adadad] dark:text-slate-400 mt-1 text-xs sm:text-sm font-normal">{t.settingsDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* ROW 1: Profile & Notification Preferences */}
        
        {/* Admin Profile */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border-none text-[#2d78f2]">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-800 dark:text-white text-lg">Admin Profile</h3>
          </div>
          <div className="p-6 md:p-8 pt-0 space-y-6 flex-1">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {adminPhoto ? (
                    <img src={adminPhoto} className="w-full h-full object-cover" alt="Admin" />
                  ) : (
                    <span className="text-2xl font-semibold text-slate-400">{adminName.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#2d78f2] text-white cursor-pointer hover:scale-110 transition-transform">
                  <Palette className="w-3.5 h-3.5" />
                  <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 dark:text-white text-lg">{adminName}</h4>
                <p className="text-sm text-[#adadad] dark:text-slate-400">Super Administrator</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setAdminPhoto(null)} className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors tracking-wider">Reset Photo</button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Full Name</label>
                  <input value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Position</label>
                  <input value={adminPosition} onChange={e => setAdminPosition(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Phone Number</label>
                  <input value={adminPhone} onChange={e => setAdminPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 tracking-widest mb-2 px-1">Email Address</label>
                <input value="admin@telkomuniversity.ac.id" readOnly className="w-full bg-slate-100/50 dark:bg-slate-800/50 rounded-xl px-4 py-3 outline-none text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed" />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => notify("success", "Profile Updated", "Perubahan profil Anda telah berhasil disimpan.")}
                disabled={!adminName || !adminPosition}
                className="bg-[#2d78f2] text-white px-6 py-2.5 rounded-xl font-semibold text-[13px] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border-none text-amber-500">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-800 dark:text-white text-lg">Notification Preferences</h3>
          </div>
          <div className="p-6 md:p-8 pt-0 space-y-2 flex-1 scrollbar-hide">
             {notifPrefs.map((item, i) => (
                <label key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group border border-transparent">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#2d78f2] dark:group-hover:text-[#2ac9fa] transition-colors">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.checked ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" checked={item.checked} onChange={() => toggleNotif(item.id)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer-checked:bg-[#2d78f2] transition-colors" />
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all duration-300" />
                  </div>
                </label>
              ))}
          </div>
          <div className="p-8 pt-0 mt-auto">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[#2d78f2] shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-[#2d78f2]/80 dark:text-[#2ac9fa]/60 font-medium">Auto-save is active. Every change is applied instantly to your account preferences.</p>
            </div>
          </div>
        </div>

        {/* ROW 2: Change Password & Appearance */}
        
        {/* Change Password */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border-none text-purple-500">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-800 dark:text-white text-lg">Change Password</h3>
          </div>
          <div className="p-6 md:p-8 pt-0 space-y-5 flex-1">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwords.new !== passwords.confirm) return
              notify("success", "Password Updated", "Kata sandi Anda telah berhasil diperbarui.")
              setPasswords({ current: "", new: "", confirm: "" })
            }} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Current Password</label>
                  <input type="password" name="current" autoComplete="current-password" value={passwords.current} onChange={handlePassChange} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" placeholder="••••••••" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">New Password</label>
                    <input type="password" name="new" autoComplete="new-password" value={passwords.new} onChange={handlePassChange} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" placeholder="New password" />
                    
                    {/* Strength Indicator */}
                    {passwords.new && (
                      <div className="mt-3 px-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Strength: {passStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${passStrength.color} transition-all duration-500`} style={{ width: passStrength.width }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Confirm New Password</label>
                    <input type="password" name="confirm" autoComplete="new-password" value={passwords.confirm} onChange={handlePassChange} className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d78f2]/10 transition-all text-slate-800 dark:text-white font-medium" placeholder="Confirm password" />
                    {passwords.confirm && passwords.confirm !== passwords.new && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1.5 px-1 animate-in slide-in-from-top-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm}
                  className="bg-[#2d78f2] text-white px-6 py-2.5 rounded-xl font-semibold text-[13px] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Appearance & Language */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border-none text-indigo-500">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-slate-800 dark:text-white text-lg">Appearance & Language</h3>
          </div>
          <div className="p-6 md:p-8 pt-0 space-y-6 flex-1">
            <div>
              <label className="block text-[11px] font-black text-slate-400 tracking-widest mb-3 px-1">Visual Theme</label>
              <AnimatedTabs 
                tabs={[
                  { id: 'light', label: 'Light Mode' },
                  { id: 'dark', label: 'Dark Mode' },
                  { id: 'system', label: 'System' },
                ]}
                activeId={resolvedTheme || 'system'}
                onChange={(id) => updateAppearance('theme', id)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Display Language</label>
                <WidgetDropdown 
                  value={lang === 'id' ? "🇮🇩 Indonesia" : "🇺🇸 English"}
                  options={["🇮🇩 Indonesia", "🇺🇸 English"]}
                  onChange={(val) => updateAppearance('lang', val === "🇮🇩 Indonesia" ? 'id' : 'en')}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Timezone</label>
                <WidgetDropdown 
                  value={timezone}
                  options={["WIB (UTC+7)", "WITA (UTC+8)", "WIT (UTC+9)"]}
                  onChange={(val) => updateAppearance('timezone', val)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 tracking-widest mb-2 px-1">Short Date Format</label>
                <WidgetDropdown 
                  value={dateFormat}
                  options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                  onChange={(val) => updateAppearance('dateFormat', val)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Danger Zone */}
        <div className="lg:col-span-2 bg-red-50 dark:bg-red-500/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 md:p-8 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border-none text-red-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-red-600 dark:text-red-400 text-lg">Danger Zone</h3>
          </div>
          <div className="p-6 md:p-8 pt-0 space-y-4">
            <p className="text-sm text-red-600/70 dark:text-red-400/60 font-medium px-1">Actions in this area are irreversible. Please proceed with extreme caution.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <button 
                onClick={() => setConfirmationConfig({
                  title: "Reset Semua Pengaturan?",
                  desc: "Ini akan mengembalikan semua preferensi ke nilai default pabrik.",
                  type: 'danger',
                  isRed: true,
                  onConfirm: () => notify("success", "Settings Reset", "Semua pengaturan telah dikembalikan ke default.")
                })}
                className="p-4 rounded-xl text-red-600 dark:text-red-400 font-semibold text-sm hover:opacity-80 transition-all flex flex-col items-center gap-3 text-center bg-red-100/50 dark:bg-red-500/10"
              >
                <History className="w-6 h-6" />
                Reset All Settings
              </button>
              <button 
                onClick={() => setConfirmationConfig({
                  title: "Hapus Riwayat Notifikasi?",
                  desc: "Ini akan menghapus semua rekaman notifikasi untuk akun admin ini secara permanen.",
                  type: 'danger',
                  isRed: true,
                  onConfirm: () => notify("success", "History Cleared", "Riwayat notifikasi telah dihapus.")
                })}
                className="p-4 rounded-xl text-red-600 dark:text-red-400 font-bold text-sm hover:opacity-80 transition-all flex flex-col items-center gap-3 text-center bg-red-100/50 dark:bg-red-500/10 shadow-sm"
              >
                <Bell className="w-6 h-6" />
                Clear Notification History
              </button>
              <button 
                onClick={() => notify("success", "Logs Exported", "Admin audit logs are being downloaded...")}
                className="p-4 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm hover:opacity-80 transition-all flex flex-col items-center gap-3 text-center bg-white/50 dark:bg-slate-800/50"
              >
                <Download className="w-6 h-6" />
                Export Admin Logs
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Dialog Portal */}
      {confirmationConfig && (
        <ConfirmDialog 
          title={confirmationConfig.title}
          desc={confirmationConfig.desc}
          onCancel={() => setConfirmationConfig(null)}
          onConfirm={() => {
            confirmationConfig.onConfirm()
            setConfirmationConfig(null)
          }}
          danger={confirmationConfig.isRed}
          confirmLabel="Lanjutkan"
          cancelLabel="Batal"
        />
      )}
    </div>
  )
}
