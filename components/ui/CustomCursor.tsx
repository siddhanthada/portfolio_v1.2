'use client'

import { m, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export type CursorType = 'motion' | 'precise'

// Figma-style arrow cursor path — tip at (0,0), body extends down-right
// Shape: classic pointer arrow with tail notch
const CURSOR_PATH = 'M0 0L0 17L4 12.5L7.5 19L10 17.5L6.5 11L13 11Z'

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [cursorText, setCursorText] = useState<string | null>(null)
  const [isTouch, setIsTouch] = useState(true)
  const [cursorType, setCursorType] = useState<CursorType>('motion')
  const activeCardRef = useRef<Element | null>(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setIsTouch(false)

    // Restore saved cursor type
    const stored = localStorage.getItem('cursor-type') as CursorType | null
    if (stored === 'precise') setCursorType('precise')

    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cardEl = target.closest('[data-cursor-text]')
      if (cardEl) {
        activeCardRef.current = cardEl
        setCursorText(cardEl.getAttribute('data-cursor-text'))
        setIsInteractive(false)
        return
      } else {
        activeCardRef.current = null
        setCursorText(null)
      }
      if (target.closest('a, button, [data-cursor-expand]')) {
        setIsInteractive(true)
      } else {
        setIsInteractive(false)
      }
    }

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (!related) {
        setIsInteractive(false)
        setCursorText(null)
        activeCardRef.current = null
        return
      }
      if (!related.closest('[data-cursor-text]')) {
        setCursorText(null)
        activeCardRef.current = null
      }
      if (!related.closest('a, button, [data-cursor-expand]')) {
        setIsInteractive(false)
      }
    }

    const onCursorTypeChange = (e: Event) => {
      setCursorType((e as CustomEvent<CursorType>).detail)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('cursor-type-change', onCursorTypeChange)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('cursor-type-change', onCursorTypeChange)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [mouseX, mouseY, visible])

  if (isTouch || prefersReducedMotion) return null

  /* ── Precise mode: Figma-style arrow, zero lag ─────────────────────────── */
  if (cursorType === 'precise') {
    return (
      <>
        {/* Arrow cursor — tip at mouse position, no spring */}
        <m.div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            x: mouseX,
            y: mouseY,
            pointerEvents: 'none',
            zIndex: 999999,
          }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <svg
            width="15"
            height="21"
            viewBox="0 0 15 21"
            fill="none"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
              transition: 'filter 0.15s ease',
            }}
          >
            <path
              d={CURSOR_PATH}
              fill={isInteractive ? 'var(--accent)' : 'var(--text)'}
              stroke="var(--bg)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </m.div>

        {/* Cursor text pill — offset below-right from tip */}
        <AnimatePresence>
          {cursorText && (
            <m.div
              key="precise-pill"
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                x: mouseX,
                y: mouseY,
                translateX: 18,
                translateY: 18,
                pointerEvents: 'none',
                zIndex: 999998,
              }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
            >
              <div
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg)',
                  padding: '5px 11px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                }}
              >
                {cursorText}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  /* ── Motion mode: original spring dot + ring ───────────────────────────── */
  return (
    <>
      {/* Inner dot — follows mouse with zero lag */}
      <m.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 999999,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
          }}
        />
      </m.div>

      {/* Outer ring — lagged spring */}
      <m.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 999998,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {cursorText ? (
            <m.div
              key="cursor-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                padding: '5px 11px',
                borderRadius: '100px',
                fontSize: '11px',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}
            >
              {cursorText}
            </m.div>
          ) : (
            <m.div
              key="cursor-ring"
              animate={{
                scale: isInteractive ? 2.5 : 1,
                opacity: isInteractive ? 0.9 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid var(--accent-ring)',
              }}
            />
          )}
        </AnimatePresence>
      </m.div>
    </>
  )
}
