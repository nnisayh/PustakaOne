"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function SessionWatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Jangan cek session di halaman publik agar tidak kena infinite redirect
    const publicPaths = ["/", "/login", "/admin-login", "/select-institution", "/forbidden"];
    if (publicPaths.includes(pathname)) return;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          // Session habis! Langsung tendang ke login
          const target = pathname.startsWith("/admin") ? "/admin-login" : "/login";
          window.location.href = target;
        }
      } catch (error) {
        console.error("Session monitor error:", error);
      }
    };

    // Cek setiap 15 detik
    const interval = setInterval(checkSession, 15000);
    
    // Cek juga saat user pindah tab atau kembali ke tab
    window.addEventListener("focus", checkSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkSession);
    };
  }, [pathname, router]);

  return null;
}
