'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Moon, Sun, SlidersHorizontal } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

function useTextScramble(text: string) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    const length = text.length
    const totalFrames = 10

    if (frameRef.current) clearInterval(frameRef.current)

    frameRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return char
            if (iteration / totalFrames > i / length) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join(''),
      )
      iteration++
      if (iteration > totalFrames) {
        clearInterval(frameRef.current!)
        setDisplay(text)
      }
    }, 30)
  }, [text])

  useEffect(() => () => { if (frameRef.current) clearInterval(frameRef.current) }, [])

  return { display, scramble }
}

function NavLink({ label, href }: { label: string; href: string }) {
  const { display, scramble } = useTextScramble(label)
  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      style={{
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSize: '13px',
        color: 'var(--text)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'color 0.2s ease',
        fontWeight: 400,
      }}
    >
      {display}
    </Link>
  )
}

type FontScale = 'sm' | 'md' | 'lg'
const FONT_SIZES: Record<FontScale, string> = { sm: '14px', md: '16px', lg: '18px' }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 10,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 8,
}

function PillToggle({
  options,
  active,
  onChange,
}: {
  options: string[]
  active: string
  onChange: (val: string) => void
}) {
  return (
    <div
      style={{
        width: '100%',
        height: 32,
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'var(--font-sans, sans-serif)',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.15s ease, color 0.15s ease',
            backgroundColor: active === opt ? 'var(--accent)' : 'transparent',
            color: active === opt ? 'var(--bg)' : 'var(--muted)',
            fontWeight: active === opt ? 600 : 400,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const isCaseStudy = pathname.startsWith('/work/')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [motionReduced, setMotionReduced] = useState(false)
  const [fontScale, setFontScale] = useState<FontScale>('md')
  const prefersReducedMotion = useReducedMotion()
  const { theme, toggleTheme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const accessBtnRef = useRef<HTMLButtonElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Restore preferences on mount
  useEffect(() => {
    const storedMotion = localStorage.getItem('reduced-motion') === 'true'
    if (storedMotion) {
      setMotionReduced(true)
      document.documentElement.setAttribute('data-reduced-motion', 'true')
    }
    const storedFont = localStorage.getItem('font-scale') as FontScale | null
    if (storedFont && FONT_SIZES[storedFont]) {
      setFontScale(storedFont)
      document.documentElement.style.fontSize = FONT_SIZES[storedFont]
    }
  }, [])

  // Close panel on outside click
  useEffect(() => {
    if (!isAccessibilityOpen) return
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !(target as Element).closest?.('[data-a11y-toggle]')
      ) {
        setIsAccessibilityOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [isAccessibilityOpen])

  // Close panel on Escape
  useEffect(() => {
    if (!isAccessibilityOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAccessibilityOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isAccessibilityOpen])

  const handleMotionToggle = (val: string) => {
    const reduced = val === 'Reduced'
    setMotionReduced(reduced)
    if (reduced) {
      document.documentElement.setAttribute('data-reduced-motion', 'true')
      localStorage.setItem('reduced-motion', 'true')
    } else {
      document.documentElement.removeAttribute('data-reduced-motion')
      localStorage.removeItem('reduced-motion')
    }
  }

  const handleFontScale = (scale: FontScale) => {
    setFontScale(scale)
    document.documentElement.style.fontSize = FONT_SIZES[scale]
    localStorage.setItem('font-scale', scale)
  }

  const fontLabels: [FontScale, string][] = [
    ['sm', 'A−'],
    ['md', 'A'],
    ['lg', 'A+'],
  ]

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          transition: 'backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease',
        }}
      >
        <div
          className="container"
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '13px',
              color: 'var(--text)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
            }}
          >
            SH<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>

          {/* Desktop right side — also shown on mobile for case study pages */}
          <div
            className={isCaseStudy ? 'flex' : 'hidden md:flex'}
            style={{ alignItems: 'center' }}
          >
            {/* Nav links — hidden on case study pages */}
            {!isCaseStudy && (
              <>
                <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                  {navLinks.map((l) => (
                    <NavLink key={l.label} label={l.label} href={l.href} />
                  ))}
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'var(--border)',
                    margin: '0 12px',
                  }}
                />
              </>
            )}

            {/* Icon buttons */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </button>

              {/* Accessibility toggle + dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  ref={accessBtnRef}
                  data-a11y-toggle=""
                  onClick={() => setIsAccessibilityOpen((v) => !v)}
                  aria-label="Accessibility settings"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: isAccessibilityOpen ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isAccessibilityOpen ? 'var(--text)' : 'var(--muted)',
                    transition: 'color 0.2s ease, background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isAccessibilityOpen) e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isAccessibilityOpen) e.currentTarget.style.color = 'var(--muted)'
                  }}
                >
                  <SlidersHorizontal size={15} />
                </button>

                {/* Accessibility dropdown panel — desktop only */}
                <AnimatePresence>
                  {!isMobile && isAccessibilityOpen && (
                    <m.div
                      ref={panelRef}
                      key="a11y-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: 210,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: 16,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        zIndex: 9999,
                      }}
                    >
                      {/* Motion */}
                      <span style={labelStyle}>Motion</span>
                      <PillToggle
                        options={['Full', 'Reduced']}
                        active={motionReduced ? 'Reduced' : 'Full'}
                        onChange={handleMotionToggle}
                      />

                      {/* Text Size */}
                      <div style={{ marginTop: 14 }}>
                        <span style={labelStyle}>Text Size</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {fontLabels.map(([scale, label]) => {
                            const active = fontScale === scale
                            return (
                              <button
                                key={scale}
                                onClick={() => handleFontScale(scale)}
                                style={{
                                  flex: 1,
                                  height: 30,
                                  borderRadius: 4,
                                  fontSize: 12,
                                  fontFamily: 'var(--font-sans, sans-serif)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                                  color: active ? 'var(--bg)' : 'var(--muted)',
                                  border: active ? 'none' : '1px solid var(--border)',
                                  fontWeight: active ? 600 : 400,
                                }}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile hamburger — hidden on case study pages */}
          {!isCaseStudy && (
            <button
              className="flex md:hidden flex-col justify-center items-center"
              style={{
                width: 32,
                height: 32,
                background: 'none',
                border: 'none',
                padding: 0,
                gap: 5,
              }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <m.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
                style={{
                  display: 'block',
                  width: 20,
                  height: 1,
                  backgroundColor: 'var(--text)',
                  transformOrigin: 'center',
                }}
              />
              <m.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
                style={{
                  display: 'block',
                  width: 20,
                  height: 1,
                  backgroundColor: 'var(--text)',
                  transformOrigin: 'center',
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            key="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 99,
              backgroundColor: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
              padding: '32px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {navLinks.map((l, i) => (
              <m.div
                key={l.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: [0.25, 1, 0.5, 1] }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: '1.5rem',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  {l.label}
                </Link>
              </m.div>
            ))}

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'var(--border)', margin: '8px 0' }} />

            {/* Theme + accessibility controls */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--muted)',
                }}
              >
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </button>
              <button
                data-a11y-toggle=""
                onClick={() => setIsAccessibilityOpen((v) => !v)}
                aria-label="Accessibility settings"
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: isAccessibilityOpen ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: isAccessibilityOpen ? 'var(--text)' : 'var(--muted)',
                }}
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>

            {/* Mobile accessibility panel */}
            <AnimatePresence>
              {isMobile && isAccessibilityOpen && (
                <m.div
                  ref={panelRef}
                  key="a11y-dropdown-mobile"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  style={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    width: 'auto',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                  }}
                >
                  <span style={labelStyle}>Motion</span>
                  <PillToggle
                    options={['Full', 'Reduced']}
                    active={motionReduced ? 'Reduced' : 'Full'}
                    onChange={handleMotionToggle}
                  />
                  <div style={{ marginTop: 14 }}>
                    <span style={labelStyle}>Text Size</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {fontLabels.map(([scale, label]) => {
                        const active = fontScale === scale
                        return (
                          <button
                            key={scale}
                            onClick={() => handleFontScale(scale)}
                            style={{
                              flex: 1, height: 30, borderRadius: 4,
                              fontSize: 12, fontFamily: 'var(--font-sans, sans-serif)',
                              cursor: 'pointer', transition: 'all 0.15s ease',
                              backgroundColor: active ? 'var(--accent)' : 'transparent',
                              color: active ? 'var(--bg)' : 'var(--muted)',
                              border: active ? 'none' : '1px solid var(--border)',
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
