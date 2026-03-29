'use client'

import { m, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextRevealProps {
  lines: (string | ReactNode)[]
  className?: string
  lineClassName?: string
  staggerDelay?: number
  delay?: number
  /** If true, triggers on scroll into view. If false, plays on mount. */
  scrollTriggered?: boolean
}

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

const lineVariants = (reduced: boolean) => ({
  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : '110%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: 0.9,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  },
})

export default function TextReveal({
  lines,
  className,
  lineClassName,
  staggerDelay = 0.15,
  delay = 0,
  scrollTriggered = false,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion() ?? false

  const animateProps = scrollTriggered
    ? { whileInView: 'visible', viewport: { once: true, margin: '-80px' } }
    : { animate: 'visible' }

  return (
    <m.div
      className={className}
      variants={containerVariants(staggerDelay, delay)}
      initial="hidden"
      {...animateProps}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <m.div
            variants={lineVariants(prefersReducedMotion)}
            className={lineClassName}
          >
            {line}
          </m.div>
        </div>
      ))}
    </m.div>
  )
}
