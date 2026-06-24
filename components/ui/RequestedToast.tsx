'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/ThemeContext'

type Phase = 'hidden' | 'entering' | 'visible' | 'exiting'

export default function RequestedToast() {
  const { theme }     = useTheme()
  const isDark        = theme === 'dark'
  const [phase, setPhase] = useState<Phase>('hidden')

  const timerA      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerB      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverPaused = useRef(false)
  const pausedAt    = useRef(0)
  const remaining   = useRef(4000)

  const clearTimers = () => {
    if (timerA.current) clearTimeout(timerA.current)
    if (timerB.current) clearTimeout(timerB.current)
  }

  const startExit = useCallback(() => {
    clearTimers()
    setPhase('exiting')
    timerB.current = setTimeout(() => setPhase('hidden'), 350)
  }, [])

  const scheduleDismiss = useCallback((ms: number) => {
    if (timerA.current) clearTimeout(timerA.current)
    remaining.current = ms
    pausedAt.current  = Date.now()
    timerA.current    = setTimeout(startExit, ms)
  }, [startExit])

  const handleMouseEnter = () => {
    if (phase === 'hidden' || phase === 'exiting') return
    hoverPaused.current = true
    if (timerA.current) {
      clearTimeout(timerA.current)
      timerA.current    = null
      remaining.current = Math.max(0, remaining.current - (Date.now() - pausedAt.current))
    }
  }

  const handleMouseLeave = () => {
    if (!hoverPaused.current) return
    hoverPaused.current = false
    scheduleDismiss(remaining.current)
  }

  // Read sessionStorage once on mount — avoids all Next.js router/searchParams complexity
  useEffect(() => {
    if (sessionStorage.getItem('show_access_toast') !== '1') return
    sessionStorage.removeItem('show_access_toast')

    // Render invisible first, then animate in next frame
    setPhase('entering')
    timerA.current = setTimeout(() => {
      setPhase('visible')
      scheduleDismiss(4000)
    }, 50)
  }, [scheduleDismiss])

  // Cleanup on unmount
  useEffect(() => () => clearTimers(), [])

  if (phase === 'hidden') return null

  // Light: accent = #3D6B00 (olive) → white text works
  // Dark:  accent = #C8FF00 (neon)  → needs near-black text
  const textColor = isDark ? '#05070E' : '#FFFFFF'
  const xColor    = isDark ? 'rgba(5,7,14,0.5)'   : 'rgba(255,255,255,0.6)'
  const xHover    = isDark ? 'rgba(5,7,14,0.9)'   : '#FFFFFF'

  const isIn  = phase === 'entering'
  const isOut = phase === 'exiting'

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position:        'fixed',
        bottom:          32,
        left:            '50%',
        transform:       `translateX(-50%) translateY(${isIn ? 12 : 0}px)`,
        opacity:         isIn || isOut ? 0 : 1,
        transition:      'opacity 0.25s ease, transform 0.25s ease',
        zIndex:          99999,
        display:         'flex',
        alignItems:      'center',
        gap:             10,
        padding:         '12px 16px',
        borderRadius:    12,
        backgroundColor: 'var(--accent)',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.22)',
        fontFamily:      'var(--font-sans, sans-serif)',
        fontSize:        14,
        color:           textColor,
        whiteSpace:      'nowrap',
        userSelect:      'none',
        cursor:          'default',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>✉️</span>
      <span>Got it. I&apos;ll send it across asap 👋</span>
      <button
        onClick={startExit}
        aria-label="Dismiss"
        style={{
          marginLeft:    8,
          background:    'none',
          border:        'none',
          cursor:        'pointer',
          color:         xColor,
          padding:       '0 2px',
          display:       'flex',
          alignItems:    'center',
          fontSize:      18,
          lineHeight:    1,
          transition:    'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = xHover)}
        onMouseLeave={(e) => (e.currentTarget.style.color = xColor)}
      >
        ×
      </button>
    </div>
  )
}
