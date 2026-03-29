'use client'

import { m, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left'
  duration?: number
  className?: string
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const shouldReduce =
    typeof window !== 'undefined' &&
    document.documentElement.getAttribute('data-reduced-motion') === 'true'
  const isReduced = prefersReducedMotion || shouldReduce

  const initial = isReduced
    ? { opacity: 1, y: 0, x: 0 }
    : direction === 'up'
    ? { opacity: 0, y: 30 }
    : { opacity: 0, x: -20 }

  return (
    <m.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={
        isReduced
          ? { duration: 0 }
          : { duration, delay, ease: [0.25, 1, 0.5, 1] }
      }
      className={className}
    >
      {children}
    </m.div>
  )
}
