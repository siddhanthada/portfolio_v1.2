'use client'

import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Settings, X } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

type FontScale = 'sm' | 'md' | 'lg'

const FONT_SIZES: Record<FontScale, string> = { sm: '14px', md: '16px', lg: '18px' }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 10,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: 8,
}

function PillToggle({
  options,
  active,
  onChange,
}: {
  options: string[]
  active: string
  onChange: (val: string) => void
}) {
  return (
    <div
      style={{
        width: '100%',
        height: 36,
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'var(--font-sans, sans-serif)',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.15s ease, color 0.15s ease',
            backgroundColor: active === opt ? 'var(--accent)' : 'transparent',
            color: active === opt ? 'var(--bg)' : 'var(--muted)',
            fontWeight: active === opt ? 600 : 400,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [motionReduced, setMotionReduced] = useState(false)
  const [fontScale, setFontScale] = useState<FontScale>('md')
  const panelRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  // Restore preferences on mount
  useEffect(() => {
    const storedMotion = localStorage.getItem('reduced-motion') === 'true'
    if (storedMotion) {
      setMotionReduced(true)
      document.documentElement.setAttribute('data-reduced-motion', 'true')
    }

    const storedFont = localStorage.getItem('font-scale') as FontScale | null
    if (storedFont && FONT_SIZES[storedFont]) {
      setFontScale(storedFont)
      document.documentElement.style.fontSize = FONT_SIZES[storedFont]
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleMotionToggle = (reduced: boolean) => {
    setMotionReduced(reduced)
    if (reduced) {
      document.documentElement.setAttribute('data-reduced-motion', 'true')
      localStorage.setItem('reduced-motion', 'true')
    } else {
      document.documentElement.removeAttribute('data-reduced-motion')
      localStorage.removeItem('reduced-motion')
    }
  }

  const handleFontScale = (scale: FontScale) => {
    setFontScale(scale)
    document.documentElement.style.fontSize = FONT_SIZES[scale]
    localStorage.setItem('font-scale', scale)
  }

  const fontLabels: [FontScale, string][] = [['sm', 'A−'], ['md', 'A'], ['lg', 'A+']]

  return (
    <div ref={panelRef} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 9000 }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Accessibility settings"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <Settings size={16} color="var(--text)" />
      </button>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              width: 240,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 12,
                marginBottom: 16,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 10,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Accessibility
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close panel"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Theme */}
            <div>
              <span style={labelStyle}>Theme</span>
              <PillToggle
                options={['Dark', 'Light']}
                active={theme === 'light' ? 'Light' : 'Dark'}
                onChange={(val) => {
                  if ((val === 'Light') !== (theme === 'light')) toggleTheme()
                }}
              />
            </div>

            {/* Motion */}
            <div style={{ marginTop: 16 }}>
              <span style={labelStyle}>Motion</span>
              <PillToggle
                options={['Full', 'Reduced']}
                active={motionReduced ? 'Reduced' : 'Full'}
                onChange={(val) => handleMotionToggle(val === 'Reduced')}
              />
            </div>

            {/* Text Size */}
            <div style={{ marginTop: 16 }}>
              <span style={labelStyle}>Text Size</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {fontLabels.map(([scale, label]) => {
                  const active = fontScale === scale
                  return (
                    <button
                      key={scale}
                      onClick={() => handleFontScale(scale)}
                      style={{
                        flex: 1,
                        height: 32,
                        borderRadius: 4,
                        fontSize: 12,
                        fontFamily: 'var(--font-sans, sans-serif)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: active ? 'var(--accent)' : 'transparent',
                        color: active ? 'var(--bg)' : 'var(--muted)',
                        border: active ? 'none' : '1px solid var(--border)',
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
