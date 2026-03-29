'use client'

import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isExiting, setIsExiting] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(false), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isExiting && (
          <m.div
            key="page-transition"
            initial={{ y: '0%' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '-100%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 1, ease: [0.76, 0, 0.24, 1] }
            }
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              backgroundColor: 'var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <m.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '13px',
                color: 'var(--text)',
                letterSpacing: '0.12em',
              }}
            >
              siddhant.design
            </m.span>
          </m.div>
        )}
      </AnimatePresence>
      {children}
    </>
  )
}
