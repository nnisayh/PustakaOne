"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import UserDetailDrawer from "@/app/admin/components/shared/UserDetailDrawer"
import DatabaseDetailDrawer from "@/app/admin/components/shared/DatabaseDetailDrawer"
import SecurityLogDetailDrawer from "@/app/admin/components/shared/SecurityLogDetailDrawer"

type DrawerType = "user" | "database" | "log" | null

interface GlobalUIState {
  activeDrawer: { type: DrawerType; data: any } | null
  openDrawer: (type: DrawerType, data: any) => void
  closeDrawer: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const GlobalUIContext = createContext<GlobalUIState | undefined>(undefined)

export function GlobalUIProvider({ children }: { children: ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<{ type: DrawerType; data: any } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const openDrawer = (type: DrawerType, data: any) => {
    setActiveDrawer({ type, data })
  }

  const closeDrawer = () => {
    setActiveDrawer(null)
  }

  return (
    <GlobalUIContext.Provider value={{ activeDrawer, openDrawer, closeDrawer, searchQuery, setSearchQuery }}>
      {children}
      
      {/* Global Drawers Layer */}
      {activeDrawer?.type === "user" && (
        <UserDetailDrawer 
          user={activeDrawer.data} 
          onClose={closeDrawer} 
        />
      )}
      {activeDrawer?.type === "database" && (
        <DatabaseDetailDrawer 
          db={activeDrawer.data} 
          onClose={closeDrawer} 
        />
      )}
      {activeDrawer?.type === "log" && (
        <SecurityLogDetailDrawer 
          log={activeDrawer.data} 
          onClose={closeDrawer} 
        />
      )}
    </GlobalUIContext.Provider>
  )
}

export function useGlobalUI() {
  const context = useContext(GlobalUIContext)
  if (context === undefined) {
    throw new Error("useGlobalUI must be used within a GlobalUIProvider")
  }
  return context
}
