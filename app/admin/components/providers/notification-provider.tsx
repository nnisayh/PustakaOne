"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type NotificationType = 'success' | 'export' | 'error' | 'warning' | 'loading'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  desc?: string
  time: string
  unread: boolean
  isClosing?: boolean
}

interface NotificationContextType {
  history: NotificationItem[]
  activeStrips: NotificationItem[]
  notify: (type: NotificationType, title: string, desc?: string) => void
  markAllRead: () => void
  clearHistory: () => void
  dismissActive: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<NotificationItem[]>([])
  const [activeStrips, setActiveStrips] = useState<NotificationItem[]>([])

  const notify = useCallback((type: NotificationType, title: string, desc?: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    const d = new Date()
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` // HH:mm format
    
    const newNotif: NotificationItem = {
      id, type, title, desc, time, unread: true
    }

    setHistory(prev => [newNotif, ...prev])
    setActiveStrips(prev => [...prev, newNotif])

    // Auto dismiss strip after 3 seconds
    setTimeout(() => {
      dismissActive(id)
    }, 3000)
  }, [])

  const dismissActive = useCallback((id: string) => {
    setActiveStrips(prev => prev.map(n => n.id === id ? { ...n, isClosing: true } : n))
    
    // Purge from DOM after animation completes (500ms)
    setTimeout(() => {
      setActiveStrips(prev => prev.filter(n => n.id !== id))
    }, 500)
  }, [])

  const markAllRead = useCallback(() => {
    setHistory(prev => prev.map(n => ({ ...n, unread: false })))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      history,
      activeStrips,
      notify,
      markAllRead,
      clearHistory,
      dismissActive
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error("useNotifications must be used within NotificationProvider")
  return context
}
