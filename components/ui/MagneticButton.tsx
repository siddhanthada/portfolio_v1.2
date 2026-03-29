'use client'

import { m, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ReactNode, useRef, CSSProperties } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
  'data-cursor-expand'?: string
}

export default function MagneticButton({
  children,
  className,
  style,
  onClick,
  as: Tag = 'button',
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    x.set(dx * 12)
    y.set(dy * 12)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const sharedProps = {
    onClick,
    'data-cursor-expand': 'true',
    className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 28px',
      borderRadius: '2px',
      fontFamily: 'var(--font-sans, sans-serif)',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      letterSpacing: '0.02em',
      transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
      whiteSpace: 'nowrap' as const,
      ...style,
    },
  }

  return (
    <m.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {Tag === 'a' ? (
        <a href={href} target={target} rel={rel} {...sharedProps}>
          {children}
        </a>
      ) : (
        <button type="button" {...sharedProps}>
          {children}
        </button>
      )}
    </m.div>
  )
}
