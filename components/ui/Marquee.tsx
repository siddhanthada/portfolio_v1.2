'use client'

import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  className?: string
}

export default function Marquee({ children, speed = 40, className }: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className ?? ''}`}
      style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        <span className="flex items-center shrink-0">{children}</span>
        <span className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </span>
      </div>
    </div>
  )
}
