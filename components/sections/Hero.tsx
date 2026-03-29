'use client'

import { useRef, useEffect, useCallback } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import MagneticButton from '@/components/ui/MagneticButton'
import LiveStatus from '@/components/ui/LiveStatus'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const WireframeSphere = dynamic(
  () => import('@/components/ui/WireframeSphere'),
  { ssr: false },
)

/* ─── Variants ────────────────────────────────────────────────────────────── */

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } },
}

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE },
  },
}

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  },
})

/* ─── Star initialiser ───────────────────────────────────────────────────── */

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  phase: number
  color: string
}

function makeStars(W: number, H: number): Star[] {
  return Array.from({ length: 220 }, (_, i) => {
    const tier = Math.random()
    let radius: number
    if (tier < 0.6) {
      radius = 0.4 + Math.random() * 0.4
    } else if (tier < 0.9) {
      radius = 0.8 + Math.random() * 0.6
    } else {
      radius = 1.4 + Math.random() * 0.6
    }

    const colorRoll = Math.random()
    let color: string
    if (colorRoll < 0.8) {
      color = '255,255,255'
    } else if (colorRoll < 0.92) {
      color = '255,240,200'
    } else {
      color = '180,210,255'
    }

    return {
      x: Math.random() * W,
      y: Math.random() * H,
      radius,
      baseOpacity: 0.15 + Math.random() * 0.7,
      phase: ((i * 2.399963) % 1) * Math.PI * 2,
      color,
    }
  })
}

/* ─── Star Canvas ────────────────────────────────────────────────────────── */

function StarCanvas({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: Star[] = []
    let rafId = 0
    let frame = 0
    let alive = true

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.round(r.width) || window.innerWidth
      canvas.height = Math.round(r.height) || window.innerHeight
      stars = makeStars(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const drawFrame = () => {
      if (!alive) return
      const W = canvas.width
      const H = canvas.height
      if (!W || !H) { rafId = requestAnimationFrame(drawFrame); return }

      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const pulse = Math.sin(frame * 0.02 + s.phase) * 0.3
        const op = Math.max(0.15, Math.min(0.85, s.baseOpacity + pulse))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color},${op})`
        ctx.fill()
      }

      frame++
      if (!reduced) rafId = requestAnimationFrame(drawFrame)
    }

    if (reduced) {
      drawFrame()
    } else {
      rafId = requestAnimationFrame(drawFrame)
    }

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─── Character shimmer helpers ──────────────────────────────────────────── */

function applyCharGlow(
  el: HTMLSpanElement,
  intensity: number,
  isAccent: boolean,
  entering: boolean,
) {
  const dur = entering ? '0.3s' : '0.6s'
  el.style.transition = `color ${dur} ease, text-shadow ${dur} ease, transform ${dur} ease`

  if (intensity <= 0) {
    el.style.color = isAccent ? 'var(--accent)' : ''
    el.style.textShadow = ''
    el.style.transform = ''
    return
  }

  el.style.color = isAccent ? 'var(--accent)' : '#FFFFFF'
  el.style.transform = `scale(${1 + 0.08 * intensity})`
  const w = (0.9 * intensity).toFixed(2)
  const g1 = (0.4 * intensity).toFixed(2)
  const g2 = (0.15 * intensity).toFixed(2)
  el.style.textShadow = [
    isAccent
      ? `0 0 20px rgba(200,255,0,${w})`
      : `0 0 20px rgba(255,255,255,${w})`,
    `0 0 40px rgba(200,255,0,${g1})`,
    `0 0 80px rgba(200,255,0,${g2})`,
  ].join(', ')
}

function renderChars(
  text: string,
  charRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
  refStart: number,
  accentDot: boolean,
): React.ReactNode[] {
  const chars = text.split('')
  let nonSpaceCount = 0
  return chars.map((char, i) => {
    if (char === ' ') return <span key={i}> </span>
    const isAccent = accentDot && char === '.' && i === chars.length - 1
    const refIdx = refStart + nonSpaceCount
    nonSpaceCount++
    return (
      <span
        key={i}
        ref={(el) => { charRefs.current[refIdx] = el }}
        data-accent={isAccent ? 'true' : undefined}
        data-intensity="0"
        style={{
          display: 'inline-block',
          ...(isAccent ? { color: 'var(--accent)' } : {}),
        }}
      >
        {char}
      </span>
    )
  })
}

// Static char renderer for glitch layer (no refs, no hover shimmer)
function renderCharsStatic(
  text: string,
  accentDot: boolean,
): React.ReactNode[] {
  const chars = text.split('')
  return chars.map((char, i) => {
    if (char === ' ') return <span key={i}> </span>
    const isAccent = accentDot && char === '.' && i === chars.length - 1
    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          ...(isAccent ? { color: 'var(--accent)' } : {}),
        }}
      >
        {char}
      </span>
    )
  })
}

// Precomputed refStart values — "Designing" has 9 non-space chars, "systems" has 7
const REF_START_1 = 0
const REF_START_2 = 9   // after "Designing"
const REF_START_3 = 16  // after "Designing" + "systems"

/* ─── Hero ────────────────────────────────────────────────────────────────── */

export default function Hero() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const lv = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : lineVariants

  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const rafPending = useRef(false)
  const lastMouse = useRef({ x: -9999, y: -9999 })
  const glitchLayerRef = useRef<HTMLDivElement>(null)
  const hasInitialGlitched = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const runGlitch = useCallback(() => {
    const el = glitchLayerRef.current
    if (!el) return

    const frames = [
      [[0, 15, -3], [40, 8, 4], [75, 12, -2]],
      [[5, 20, -8], [30, 6, 12], [60, 15, -6], [85, 8, 4]],
      [[0, 10, 14], [25, 18, -10], [55, 8, 8], [78, 14, -12]],
      [[10, 12, -6], [35, 20, 10], [65, 10, -8]],
      [[15, 8, 4], [45, 14, -6], [70, 10, 6]],
      [[0, 25, -3], [50, 10, 5], [80, 8, -3]],
      [[20, 15, 2], [55, 8, -3]],
      [[30, 12, -2], [65, 6, 2]],
      [[10, 8, 3]],
      [],
    ] as [number, number, number][][]

    const frameDurations = [45, 40, 50, 40, 45, 35, 40, 35, 30, 60]

    el.style.opacity = '1'
    el.style.visibility = 'visible'

    let totalDelay = 0
    frames.forEach((slices, i) => {
      setTimeout(() => {
        if (slices.length === 0) {
          el.style.clipPath = 'inset(0 0 100% 0)'
          el.style.transform = 'translateX(0)'
          if (i === frames.length - 1) {
            el.style.opacity = '0'
            el.style.visibility = 'hidden'
          }
          return
        }
        slices.forEach((slice, si) => {
          setTimeout(() => {
            const [y, h, x] = slice
            el.style.clipPath = `inset(${y}% 0 ${100 - y - h}% 0)`
            el.style.transform = `translateX(${x}px)`
          }, si * 12)
        })
      }, totalDelay)
      totalDelay += frameDurations[i]
    })
  }, [])

  useEffect(() => {
    const isReduced =
      typeof window !== 'undefined' &&
      document.documentElement.getAttribute('data-reduced-motion') === 'true'
    if (isReduced) return

    if (!hasInitialGlitched.current) {
      hasInitialGlitched.current = true
      const firstTimer = setTimeout(runGlitch, 2200)
      intervalRef.current = setInterval(runGlitch, 12000)

      return () => {
        clearTimeout(firstTimer)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleThemeGlitch = () => {
      setTimeout(runGlitch, 950)
    }

    window.addEventListener('theme-glitch', handleThemeGlitch)
    return () => window.removeEventListener('theme-glitch', handleThemeGlitch)
  }, [runGlitch])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    lastMouse.current = { x: e.clientX, y: e.clientY }
    if (rafPending.current) return
    rafPending.current = true

    requestAnimationFrame(() => {
      rafPending.current = false
      const { x: mx, y: my } = lastMouse.current

      charRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(mx - cx, my - cy)

        let intensity = 0
        if (dist < 60) {
          intensity = 1
        } else if (dist < 140) {
          intensity = 1 - (dist - 60) / 80
        }

        const isAccent = el.dataset.accent === 'true'
        const prevIntensity = parseFloat(el.dataset.intensity ?? '0')
        const entering = prevIntensity === 0 && intensity > 0
        el.dataset.intensity = String(intensity)
        applyCharGlow(el, intensity, isAccent, entering)
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    charRefs.current.forEach((el) => {
      if (!el) return
      const isAccent = el.dataset.accent === 'true'
      el.dataset.intensity = '0'
      applyCharGlow(el, 0, isAccent, false)
    })
  }, [])

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        minHeight: '100svh',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ── Background ─────────────────────────────────────────────────── */}
      <StarCanvas reduced={prefersReducedMotion} />
      <div className="noise-overlay" style={{ zIndex: 1 }} />

      {/* ── 3D Sphere (right half, desktop only) ─────────────────────── */}
      <WireframeSphere />

      {/* ── Live status bar ──────────────────────────────────────────────── */}
      <m.div
        variants={fadeIn(0.25)}
        initial="hidden"
        animate="visible"
        style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 10,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="container"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <LiveStatus />
        </div>
      </m.div>

      {/* ── Center content block ─────────────────────────────────────────── */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 140,
          paddingBottom: 140,
          minHeight: '100svh',
        }}
      >
        {/* Constrain headline to left 55% on desktop */}
        <div className="md:w-[55%]">
          {/* Label */}
          <m.span
            variants={fadeIn(0.4)}
            initial="hidden"
            animate="visible"
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: 'var(--accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            Product Designer
          </m.span>

          {/* Headline — two-layer: base + glitch clone */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>

            {/* Layer A — animated base */}
            <m.div
              variants={prefersReducedMotion ? {} : containerVariants}
              initial="hidden"
              animate="visible"
              style={{ lineHeight: '1.0' }}
            >
              {/* Line 1: Designing */}
              <m.div variants={lv}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-hero)',
                    fontWeight: 300,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {renderChars('Designing', charRefs, REF_START_1, false)}
                </span>
              </m.div>

              {/* Line 2: systems */}
              <m.div variants={lv} style={{ transform: 'translateY(-12px)' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display, serif)',
                    fontStyle: 'italic',
                    fontSize: 'calc(var(--text-hero) * 0.96)',
                    fontWeight: 400,
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                    paddingBottom: '20px',
                    paddingLeft: '4px',
                  }}
                >
                  {renderChars('systems', charRefs, REF_START_2, false)}
                </span>
              </m.div>

              {/* Line 3: that think. — "." glows green */}
              <m.div variants={lv} style={{ transform: 'translateY(-6px)' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-hero)',
                    fontWeight: 300,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {renderChars('that think.', charRefs, REF_START_3, true)}
                </span>
              </m.div>
            </m.div>

            {/* Layer B — glitch duplicate, invisible until triggered */}
            <div
              ref={glitchLayerRef}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                zIndex: 11,
                lineHeight: '1.0',
                color: 'var(--text)',
              }}
            >
              {/* Line 1: Designing */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-hero)',
                    fontWeight: 300,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {renderCharsStatic('Designing', false)}
                </span>
              </div>

              {/* Line 2: systems */}
              <div style={{ transform: 'translateY(-12px)' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display, serif)',
                    fontStyle: 'italic',
                    fontSize: 'calc(var(--text-hero) * 0.96)',
                    fontWeight: 400,
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                    paddingBottom: '20px',
                    paddingLeft: '4px',
                  }}
                >
                  {renderCharsStatic('systems', false)}
                </span>
              </div>

              {/* Line 3: that think. */}
              <div style={{ transform: 'translateY(-6px)' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-hero)',
                    fontWeight: 300,
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {renderCharsStatic('that think.', true)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <m.div
        variants={fadeIn(1.2)}
        initial="hidden"
        animate="visible"
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          {/* Role tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '12px',
              color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}
          >
            {['Enterprise Product', 'Design Systems', 'Data Visualisation'].map(
              (tag, i) => (
                <span key={tag} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && (
                    <span style={{ margin: '0 10px', opacity: 0.4 }}>/</span>
                  )}
                  {tag}
                </span>
              ),
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <MagneticButton
              as="a"
              href="#work"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
              }}
            >
              View Work <ArrowDown size={14} />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                fontWeight: 600,
                border: '1px solid var(--accent)',
              }}
            >
              Resume <ArrowUpRight size={14} />
            </MagneticButton>
          </div>
        </div>
      </m.div>
    </section>
  )
}
