'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'
import CustomCursor from '@/components/ui/CustomCursor'
import Nav from '@/components/Nav'
import PageTransition from '@/components/motion/PageTransition'

interface RootClientProps {
  children: ReactNode
}

export default function RootClient({ children }: RootClientProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
        <Nav />
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </ReactLenis>
    </LazyMotion>
  )
}
