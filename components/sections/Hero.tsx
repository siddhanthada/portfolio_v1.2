'use client'

import { useRef, useEffect, useCallback, useState, type MutableRefObject } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import MagneticButton from '@/components/ui/MagneticButton'
import { useTheme } from '@/lib/ThemeContext'
import { ArrowDown, ArrowUpRight, Volume2, VolumeX, Pause, Play } from 'lucide-react'

/* ─── Text scramble (same mechanic as Nav hover) ─────────────────────────── */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

function useTextScramble(text: string, mountDelay?: number) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    const length = text.length
    const totalFrames = 20          // was 10 — slower resolve
    const intervalMs  = 55          // was 30 — more time between frames
    if (frameRef.current) clearInterval(frameRef.current)
    frameRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ' || char === ',' || char === '.') return char
          if (iteration / totalFrames > i / length) return char
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join('')
      )
      iteration++
      if (iteration > totalFrames) {
        clearInterval(frameRef.current!)
        setDisplay(text)
      }
    }, intervalMs)
  }, [text])

  useEffect(() => {
    if (mountDelay === undefined) return
    const t = setTimeout(scramble, mountDelay)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (frameRef.current) clearInterval(frameRef.current) }, [])

  return { display, scramble }
}

/* ─── Constants ───────────────────────────────────────────────────────────── */


const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number]
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.9 } },
}
const lineVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
}
const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
})

const H_SIZE        = 'clamp(4.5rem, 5.2vw, 6.8rem)'
const H_SIZE_MOBILE = 'clamp(3.4rem, 14vw, 5rem)'

/* ─── Char shimmer ────────────────────────────────────────────────────────── */

function applyCharGlow(el: HTMLSpanElement, intensity: number, isAccent: boolean, entering: boolean) {
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
    isAccent ? `0 0 20px rgba(200,255,0,${w})` : `0 0 20px rgba(255,255,255,${w})`,
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
    const refIdx = refStart + nonSpaceCount++
    return (
      <span
        key={i}
        ref={(el) => { charRefs.current[refIdx] = el }}
        data-accent={isAccent ? 'true' : undefined}
        data-intensity="0"
        style={{ display: 'inline-block', ...(isAccent ? { color: 'var(--accent)' } : {}) }}
      >
        {char}
      </span>
    )
  })
}

function renderCharsStatic(text: string, accentDot: boolean): React.ReactNode[] {
  return text.split('').map((char, i) => {
    if (char === ' ') return <span key={i}> </span>
    const isAccent = accentDot && char === '.' && i === text.length - 1
    return (
      <span key={i} style={{ display: 'inline-block', ...(isAccent ? { color: 'var(--accent)' } : {}) }}>
        {char}
      </span>
    )
  })
}

const REF_START_1 = 0
const REF_START_2 = 9
const REF_START_3 = 16

/* ─── Hero ────────────────────────────────────────────────────────────────── */

export default function Hero() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const { theme } = useTheme()
  const lv = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : lineVariants

  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const rafPending = useRef(false)
  const lastMouse = useRef({ x: -9999, y: -9999 })
  const glitchLayerRef = useRef<HTMLDivElement>(null)
  const hasInitialGlitched = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const darkVideoRef  = useRef<HTMLVideoElement | null>(null)  // active dark
  const darkVideoBRef = useRef<HTMLVideoElement | null>(null)  // standby dark
  const lightVideoRef  = useRef<HTMLVideoElement | null>(null) // active light
  const lightVideoBRef = useRef<HTMLVideoElement | null>(null) // standby light
  const darkContainerRef = useRef<HTMLDivElement>(null)
  const lightContainerRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [istTime, setIstTime] = useState('')

  // Scramble on mount — fires after the fade-in reveals the meta block
  const { display: roleDisplay } = useTextScramble('Product Designer', 700)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const update = () => setIstTime(
      new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      })
    )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Two-video crossfade loop — each container holds an active + standby video.
  // When active is ~2 s from its end the standby (already at frame 0) starts
  // playing and the two opacities swap over CROSSFADE_S seconds.
  // The viewer always sees real video; the background is never exposed.
  useEffect(() => {
    if (prefersReducedMotion) return

    const CROSSFADE_S = 2
    const VID_CSS = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;transform:scale(1.25);transform-origin:center top;transition:opacity 0s'

    let crossfading = false

    // Make a single video element inside a container
    const makeVid = (container: HTMLDivElement, src: string, active: boolean): HTMLVideoElement => {
      const v = document.createElement('video')
      v.src = src
      v.muted = true
      v.loop = false
      v.playsInline = true
      v.style.cssText = VID_CSS
      v.style.opacity = active ? '1' : '0'
      container.appendChild(v)
      if (active) v.play().catch(e => console.warn('[Hero]', e))
      return v
    }

    // Setup one container — handles Strict Mode double-invoke
    const setup = (
      container: HTMLDivElement | null,
      src: string,
      refA: MutableRefObject<HTMLVideoElement | null>,
      refB: MutableRefObject<HTMLVideoElement | null>,
      isDark: boolean,
    ) => {
      if (!container) return
      const existing = container.querySelectorAll('video')
      if (existing.length >= 2) {
        // Strict Mode second run — restore refs from DOM
        refA.current = existing[0] as HTMLVideoElement
        refB.current = existing[1] as HTMLVideoElement
        if (isDark) { setIsPlaying(!refA.current.paused); setIsMuted(refA.current.muted) }
        return
      }
      existing.forEach(v => v.remove())
      refA.current = makeVid(container, src, true)
      refB.current = makeVid(container, src, false)
      if (isDark) {
        refA.current.addEventListener('playing', () => setIsPlaying(true))
        refA.current.addEventListener('pause',   () => setIsPlaying(false))
      }
    }

    setup(darkContainerRef.current,  '/work/hero-bg/sky-dark.mp4',   darkVideoRef,  darkVideoBRef,  true)
    setup(lightContainerRef.current, '/work/hero-bg/sky-light2.mp4', lightVideoRef, lightVideoBRef, false)

    // Cross-fade: swap active ↔ standby with overlapping opacities
    const doCrossfade = () => {
      if (crossfading) return
      crossfading = true

      // Current active videos
      const da = darkVideoRef.current
      const la = lightVideoRef.current
      // Standby videos
      const db = darkVideoBRef.current
      const lb = lightVideoBRef.current

      if (!da || !db || !la || !lb) { crossfading = false; return }

      // Prime standbys from frame 0 while still invisible
      db.currentTime = 0
      lb.currentTime = 0
      db.play().catch(() => {})
      lb.play().catch(() => {})

      // Give standbys one frame to decode then start the opacity swap
      requestAnimationFrame(() => {
        const t = `opacity ${CROSSFADE_S}s ease`
        da.style.transition = t;  da.style.opacity = '0'
        la.style.transition = t;  la.style.opacity = '0'
        db.style.transition = t;  db.style.opacity = '1'
        lb.style.transition = t;  lb.style.opacity = '1'
      })

      setTimeout(() => {
        // Old actives are now invisible — pause + reset them as the new standbys
        da.pause(); da.style.transition = 'none'; da.style.opacity = '0'; da.currentTime = 0
        la.pause(); la.style.transition = 'none'; la.style.opacity = '0'; la.currentTime = 0

        // Swap refs so the rest of the app sees the new active
        darkVideoRef.current  = db;  darkVideoBRef.current  = da
        lightVideoRef.current = lb;  lightVideoBRef.current = la

        // Re-attach playing/pause events to new active dark video
        db.addEventListener('playing', () => setIsPlaying(true))
        db.addEventListener('pause',   () => setIsPlaying(false))

        crossfading = false
      }, (CROSSFADE_S + 0.1) * 1000)
    }

    // Watch active dark video — trigger crossfade when 2 s remain
    const onTimeUpdate = () => {
      const d = darkVideoRef.current
      if (!d || !d.duration || crossfading) return
      if (d.duration - d.currentTime <= CROSSFADE_S) doCrossfade()
    }

    // Attach timeupdate to BOTH dark videos so it still fires after the swap
    const attachTimeUpdate = (v: HTMLVideoElement | null) => {
      if (v) v.addEventListener('timeupdate', onTimeUpdate)
    }
    attachTimeUpdate(darkVideoRef.current)
    attachTimeUpdate(darkVideoBRef.current)

    return () => {
      darkVideoRef.current  = null
      darkVideoBRef.current = null
      lightVideoRef.current  = null
      lightVideoBRef.current = null
    }
  }, [prefersReducedMotion])

  // Toggle mute — set DOM directly so React re-render doesn't fight us
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      ;[darkVideoRef, darkVideoBRef, lightVideoRef, lightVideoBRef].forEach(r => {
        if (r.current) r.current.muted = next
      })
      return next
    })
  }, [])

  const togglePlay = useCallback(() => {
    const dark  = darkVideoRef.current
    const light = lightVideoRef.current
    if (!dark) return
    if (dark.paused) {
      dark?.play().catch(() => {})
      light?.play().catch(() => {})
    } else {
      dark?.pause()
      light?.pause()
    }
  }, [])

  // Glitch
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
          if (i === frames.length - 1) { el.style.opacity = '0'; el.style.visibility = 'hidden' }
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
    const isReduced = typeof window !== 'undefined' &&
      document.documentElement.getAttribute('data-reduced-motion') === 'true'
    if (isReduced) return
    if (!hasInitialGlitched.current) {
      hasInitialGlitched.current = true
      const t = setTimeout(runGlitch, 2200)
      intervalRef.current = setInterval(runGlitch, 12000)
      return () => { clearTimeout(t); if (intervalRef.current) clearInterval(intervalRef.current) }
    }
  }, [])

  useEffect(() => {
    const onThemeGlitch = () => setTimeout(runGlitch, 950)
    window.addEventListener('theme-glitch', onThemeGlitch)
    return () => window.removeEventListener('theme-glitch', onThemeGlitch)
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
        const dist = Math.hypot(mx - (rect.left + rect.width / 2), my - (rect.top + rect.height / 2))
        let intensity = 0
        if (dist < 60) intensity = 1
        else if (dist < 140) intensity = 1 - (dist - 60) / 80
        const isAccent = el.dataset.accent === 'true'
        const entering = parseFloat(el.dataset.intensity ?? '0') === 0 && intensity > 0
        el.dataset.intensity = String(intensity)
        applyCharGlow(el, intensity, isAccent, entering)
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    charRefs.current.forEach((el) => {
      if (!el) return
      el.dataset.intensity = '0'
      applyCharGlow(el, 0, el.dataset.accent === 'true', false)
    })
  }, [])

  const sansStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    display: 'block',
    fontFamily: 'var(--font-display, serif)',
    fontStyle: 'italic',
    fontSize: isMobile ? H_SIZE_MOBILE : H_SIZE,
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    ...extra,
  })
  const displayStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: 'var(--font-display, serif)',
    fontStyle: 'italic',
    fontSize: isMobile ? `calc(${H_SIZE_MOBILE} * 0.96)` : `calc(${H_SIZE} * 0.96)`,
    fontWeight: 400,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
    ...extra,
  })

  const isDark = theme === 'dark'

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', minHeight: '100svh', backgroundColor: 'var(--bg)', overflow: 'hidden' }}
    >
      {/* ── Dual video containers — videos injected via DOM in useEffect ────── */}
      {!prefersReducedMotion && (
        <>
          <div
            ref={darkContainerRef}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
              opacity: isDark ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
          <div
            ref={lightContainerRef}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
              opacity: isDark ? 0 : 1,
              transition: 'opacity 0.8s ease',
            }}
          />
        </>
      )}

      {/* ── Video overlay — dark mode only ───────────────────────────────── */}
      {isDark && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'rgba(6,6,10,0.55)',
        }} />
      )}

      {/* ── Vignettes — dark theme only ───────────────────────────────────── */}
      {isDark && (
        <>
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
            background: 'linear-gradient(to bottom, rgba(8,8,8,0.88) 0%, transparent 100%)',
            zIndex: 1, pointerEvents: 'none',
          }} />
          <div aria-hidden style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
            background: 'linear-gradient(to top, rgba(8,8,8,0.92) 0%, transparent 100%)',
            zIndex: 1, pointerEvents: 'none',
          }} />
        </>
      )}
      {/* No side vignettes — both videos fill edges cleanly */}

      {/* ── Noise ─────────────────────────────────────────────────────────── */}
      <div className="noise-overlay" style={{ zIndex: 2 }} />

      {/* ── Video controls — bottom-right, desktop only ───────────────────── */}
      {!prefersReducedMotion && !isMobile && (
        <div style={{
          position: 'absolute', bottom: 32, right: 24, zIndex: 20,
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(8,8,8,0.45)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(240,237,232,0.45)',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,237,232,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>

          {/* Mute / Unmute */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(8,8,8,0.45)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(240,237,232,0.45)',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240,237,232,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        className="container"
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center',
          minHeight: '100svh',
          paddingTop: 96, paddingBottom: 96,
        }}
      >
        <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: isMobile ? -150 : 0 }}>

          {/* ── Meta: role + location/time ─────────────────────────────────── */}
          <m.div
            variants={fadeIn(0.25)}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--accent)',
            }}>
              {roleDisplay}
            </span>
            <div style={{ width: 32, height: 1, background: 'var(--border)', opacity: 0.5 }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px', letterSpacing: '0.1em', color: isDark ? 'rgba(255,255,255,0.52)' : 'rgba(0,0,0,0.52)',
            }}>
              <span>Bangalore, IN</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span suppressHydrationWarning style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}>
                IST {istTime}
              </span>
            </div>
          </m.div>

          {/* ── Headline ──────────────────────────────────────────────────── */}
          <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
            <m.div
              variants={prefersReducedMotion ? {} : containerVariants}
              initial="hidden"
              animate="visible"
              style={{ lineHeight: 0.97 }}
            >
              {/* Row 1: Designing — Row 2 on mobile: systems */}
              <m.div
                variants={lv}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: isMobile ? 'center' : 'baseline',
                  flexDirection: isMobile ? 'column' : 'row',
                  flexWrap: 'wrap',
                  gap: isMobile ? '8px 0' : '0 20px',
                }}
              >
                <span style={sansStyle()}>
                  {renderChars('Designing', charRefs, REF_START_1, false)}
                </span>
                <span style={{ ...displayStyle(), display: 'inline-block' }}>
                  {renderChars('systems', charRefs, REF_START_2, false)}
                </span>
              </m.div>

              {/* Row 2 desktop / Row 3 mobile: that think. */}
              <m.div variants={lv} style={{ marginTop: isMobile ? '8px' : '20px' }}>
                <span style={sansStyle()}>
                  {renderChars('that think.', charRefs, REF_START_3, true)}
                </span>
              </m.div>
            </m.div>

            {/* Glitch layer */}
            <div
              ref={glitchLayerRef}
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, opacity: 0, visibility: 'hidden',
                pointerEvents: 'none', zIndex: 11, lineHeight: 0.97, color: 'var(--text)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', flexWrap: 'wrap', gap: '0 20px' }}>
                <span style={sansStyle()}>{renderCharsStatic('Designing', false)}</span>
                <span style={{ ...displayStyle(), display: 'inline-block' }}>{renderCharsStatic('systems', false)}</span>
              </div>
              <div style={{ marginTop: '20px' }}>
                <span style={sansStyle()}>{renderCharsStatic('that think.', true)}</span>
              </div>
            </div>
          </div>

          {/* ── Role tags — glass pill ─────────────────────────────────────── */}
          <m.div variants={fadeIn(1.0)} initial="hidden" animate="visible" style={{ marginTop: 42 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '7px 20px', borderRadius: 100,
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.65)',
              gap: 0,
              transition: 'background 0.4s ease, border-color 0.4s ease',
            }}>
              {(isMobile
                ? ['Enterprise Product', 'Design Systems']
                : ['Enterprise Product', 'Design Systems', 'Data Visualisation']
              ).map((tag, i) => (
                <span key={tag} style={{
                  display: 'flex', alignItems: 'center',
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '12px',
                  color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
                  letterSpacing: '0.04em',
                  transition: 'color 0.4s ease',
                }}>
                  {i > 0 && <span style={{ margin: '0 12px', opacity: 0.35 }}>/</span>}
                  {tag}
                </span>
              ))}
            </div>
          </m.div>

          {/* ── CTAs — desktop only; mobile renders these in the bottom bar ── */}
          {!isMobile && (
            <m.div
              variants={fadeIn(1.2)}
              initial="hidden"
              animate="visible"
              style={{ marginTop: 72, display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'center' }}
            >
              <MagneticButton
                as="a"
                href="#work"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(12px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                  border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.55)',
                  color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)',
                  boxShadow: isDark
                    ? '0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                View Work <ArrowDown size={14} />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="/work/resume/Siddhant_Resume.pdf"
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
            </m.div>
          )}

        </div>
      </div>

      {/* ── Mobile bottom bar — controls (right) + CTAs (stacked) ────────── */}
      {isMobile && (
        <m.div
          variants={fadeIn(1.2)}
          initial="hidden"
          animate="visible"
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            zIndex: 20,
            padding: '0 20px 36px',
          }}
        >
          {/* Video controls — right aligned, above CTAs */}
          {!prefersReducedMotion && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(8,8,8,0.45)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(240,237,232,0.45)',
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(8,8,8,0.45)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(240,237,232,0.45)',
                }}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
            </div>
          )}

          {/* CTAs — stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MagneticButton
              as="a"
              href="#work"
              style={{
                width: '100%', justifyContent: 'center',
                backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.28)',
                backdropFilter: 'blur(12px) saturate(150%)',
                WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.55)',
                color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)',
                boxShadow: isDark
                  ? '0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)'
                  : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            >
              View Work <ArrowDown size={14} />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/work/resume/Siddhant_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%', justifyContent: 'center',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                fontWeight: 600,
                border: '1px solid var(--accent)',
              }}
            >
              Resume <ArrowUpRight size={14} />
            </MagneticButton>
          </div>
        </m.div>
      )}
    </section>
  )
}
