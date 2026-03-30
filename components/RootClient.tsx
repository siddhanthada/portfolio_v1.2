'use client'

import { useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import CustomCursor from '@/components/ui/CustomCursor'
import Nav from '@/components/Nav'
import PageTransition from '@/components/motion/PageTransition'

function LenisScrollReset() {
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  return null
}

interface RootClientProps {
  children: ReactNode
}

export default function RootClient({ children }: RootClientProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
        <LenisScrollReset />
        <Nav />
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </ReactLenis>
    </LazyMotion>
  )
}
