"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"
import Portal from "@/app/admin/components/shared/Portal"

interface ConfirmDialogProps {
  title: string
  desc: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  confirmLabel?: string
  cancelLabel?: string
}

export default function ConfirmDialog({
  title,
  desc,
  onConfirm,
  onCancel,
  danger = true,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-[400px] shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="p-6 flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                danger
                  ? "bg-red-50 dark:bg-red-500/10 text-red-500"
                  : "bg-blue-50 dark:bg-blue-500/10 text-blue-500"
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
            </div>
          </div>
          <div className="p-6 pt-5 flex gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors ${
                danger
                  ? "bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20"
                  : "bg-[#2d78f2] hover:bg-blue-600 shadow-sm shadow-blue-500/20"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
