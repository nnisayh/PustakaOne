"use client"

import React from "react";
import { useLanguage } from "@/components/language-provider";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Loading() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Check if we are heading to dashboard or admin (auth context)
  const isAuthContext = pathname?.includes("/dashboard") || pathname?.includes("/admin");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#030712] transition-colors duration-500">
      {/* Dynamic background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Simple Breathing Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center animate-[pulse_1.5s_ease-in-out_infinite] mb-8">
          <img
            src="/logo.png"
            alt="PustakaONE Logo"
            className="h-32 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Loading Content */}
        <div className="text-center space-y-3">
          <h2 className="font-headline font-bold text-primary dark:text-white text-xl tracking-tight">PustakaONE</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
          </div>
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 font-bold mt-2">
            {isAuthContext ? (t.authenticating || "Authenticating") : (t.loading || "Processing data")}
          </p>
        </div>
      </div>
    </div>
  );
}
