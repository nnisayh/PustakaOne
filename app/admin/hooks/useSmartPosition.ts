"use client"
import { useState, useEffect, RefObject } from "react"

export const useSmartPosition = (
  triggerRef: RefObject<HTMLElement>,
  popoutRef: RefObject<HTMLElement>,
  isOpen: boolean
) => {
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoutRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current || !popoutRef.current) return
      
      const trigger = triggerRef.current.getBoundingClientRect()
      const popout = popoutRef.current.getBoundingClientRect()
      
      const spaceBelow = window.innerHeight - trigger.bottom
      const spaceRight = window.innerWidth - trigger.left

      setStyle({
        position: 'fixed',
        top: spaceBelow >= popout.height
          ? trigger.bottom + 8
          : trigger.top - popout.height - 8,
        left: spaceRight >= popout.width
          ? trigger.left
          : trigger.right - popout.width,
        zIndex: 9999,
      })
    }

    updatePosition()
    const t = setTimeout(updatePosition, 10) // Failsafe size calculation post-paint

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  return style
}
