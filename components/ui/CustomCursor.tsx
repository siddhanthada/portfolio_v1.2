'use client'

import { m, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [cursorText, setCursorText] = useState<string | null>(null)
  const [isTouch, setIsTouch] = useState(true)
  const activeCardRef = useRef<Element | null>(null)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setIsTouch(false)

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

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [mouseX, mouseY, visible])

  if (isTouch || prefersReducedMotion) return null

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
          zIndex: 9999,
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
          zIndex: 9998,
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
