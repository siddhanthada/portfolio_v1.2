'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import ScrollReveal from '@/components/motion/ScrollReveal'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { Lock } from 'lucide-react'

/* ── Nav sections ────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'context',    label: '01  Context' },
  { id: 'problem',    label: '02  Problem' },
  { id: 'research',   label: '03  Research' },
  { id: 'principles', label: '04  Principles' },
  { id: 'decisions',  label: '05  Decisions' },
  { id: 'the-stand',  label: '06  The Stand' },
  { id: 'outcomes',   label: '07  Outcomes' },
  { id: 'reflection', label: '08  Reflection' },
]

/* ── Shared sub-components ───────────────────────────────────────────────── */

function CaseImage({
  src,
  alt,
  bg,
  marginTop = 0,
  caption,
}: {
  src: string
  alt: string
  bg?: string
  marginTop?: number
  caption?: string
}) {
  return (
    <div style={{ marginTop }}>
      <ImageLightbox
        src={src}
        alt={alt}
        width={760}
        height={480}
        caption={caption}
        style={bg ? { backgroundColor: bg } : undefined}
      />
    </div>
  )
}

function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '10px',
          color: 'var(--accent)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {num}
      </span>
      <h2
        style={{
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 500,
          color: 'var(--text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-display, serif)',
        fontStyle: 'italic',
        fontSize: 'var(--text-lg)',
        color: 'var(--muted)',
        marginBottom: 32,
        marginTop: 0,
        lineHeight: 1.5,
      }}
    >
      {children}
    </p>
  )
}

function BodyText({
  children,
  muted = false,
  mb = 24,
}: {
  children: React.ReactNode
  muted?: boolean
  mb?: number
}) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSize: 'var(--text-base)',
        color: muted ? 'var(--muted)' : 'var(--text)',
        lineHeight: 1.7,
        margin: 0,
        marginBottom: mb,
      }}
    >
      {children}
    </p>
  )
}

function InfoCard({
  children,
  padding = 24,
}: {
  children: React.ReactNode
  padding?: number
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding,
      }}
    >
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'block',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px',
        color: 'var(--accent)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}
    >
      {children}
    </span>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSize: 'var(--text-base)',
        fontWeight: 600,
        color: 'var(--text)',
        margin: '0 0 10px',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h3>
  )
}

function AccentBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: 24,
        fontFamily: 'var(--font-display, serif)',
        fontStyle: 'italic',
        fontSize: 'var(--text-base)',
        color: 'var(--muted)',
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  )
}

function PillLabel({ type }: { type: 'current' | 'proposed' }) {
  const isCurrent = type === 'current'
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        borderRadius: 2,
        backgroundColor: isCurrent ? 'rgba(255,107,107,0.12)' : 'rgba(var(--accent-rgb, 74,144,226), 0.12)',
        color: isCurrent ? '#FF6B6B' : 'var(--accent)',
        border: `1px solid ${isCurrent ? 'rgba(255,107,107,0.3)' : 'rgba(74,144,226,0.3)'}`,
        marginBottom: 12,
      }}
    >
      {isCurrent ? 'Current' : 'Proposed'}
    </span>
  )
}

function SectionDivider({ mt = 48 }: { mt?: number }) {
  return (
    <div
      style={{
        marginTop: mt,
        paddingTop: mt,
        borderTop: '1px solid var(--border)',
      }}
    />
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ChartsModernisation() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [navVisible, setNavVisible] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [activeSection, setActiveSection] = useState('context')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Password gate state
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  // Check session storage on mount
  useEffect(() => {
    if (sessionStorage.getItem('charts-auth') === 'true') {
      setUnlocked(true)
    }
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
    return () => clearTimeout(t)
  }, [])

  // Hero intersection observer for nav visibility
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [unlocked])

  // Active section tracking
  useEffect(() => {
    if (!unlocked) return
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.2 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [unlocked])

  // Responsive state
  useEffect(() => {
    const check = () => {
      setShowNav(window.innerWidth > 1100)
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setScrollProgress(el.scrollTop / (el.scrollHeight - el.clientHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePasswordSubmit = useCallback(() => {
    if (password === 'happyhappy') {
      sessionStorage.setItem('charts-auth', 'true')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }, [password])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePasswordSubmit()
  }

  // Password gate
  if (!unlocked) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div style={{ maxWidth: 400, width: '100%', padding: '0 40px' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              color: 'var(--accent)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Case Study 01
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              color: 'var(--text)',
              lineHeight: 1.15,
              margin: '0 0 8px',
            }}
          >
            Modernising Data Visualisation
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted)',
              margin: '0 0 40px',
              lineHeight: 1.6,
            }}
          >
            This case study is password protected.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Lock size={14} color="var(--muted)" />
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '10px',
                color: 'var(--muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Password required
            </span>
          </div>

          <m.div
            animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              style={{
                width: '100%',
                height: 48,
                backgroundColor: 'var(--bg-card)',
                border: `1px solid ${error ? '#FF6B6B' : 'var(--border)'}`,
                borderRadius: 4,
                padding: '0 16px',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = 'var(--accent)'
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = 'var(--border)'
              }}
            />
          </m.div>

          <AnimatePresence>
            {error && (
              <m.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '12px',
                  color: '#FF6B6B',
                  margin: '8px 0 0',
                }}
              >
                Incorrect password
              </m.p>
            )}
          </AnimatePresence>

          <button
            onClick={handlePasswordSubmit}
            style={{
              marginTop: 16,
              width: '100%',
              height: 44,
              backgroundColor: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: 2,
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile scroll progress bar */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: 'var(--border)',
            zIndex: 49,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${scrollProgress * 100}%`,
              backgroundColor: 'var(--accent)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* Left sticky nav */}
      {showNav && (
        <m.nav
          animate={{
            opacity: navVisible ? 1 : 0,
            pointerEvents: navVisible ? 'all' : 'none',
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            left: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 160,
            zIndex: 50,
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Charts
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    borderLeft: isActive
                      ? '2px solid var(--accent)'
                      : '2px solid transparent',
                    padding: '6px 0 6px 10px',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: isActive ? 'var(--text)' : 'var(--muted)',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </m.nav>
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="hero-stars"
        style={{
          backgroundColor: 'var(--bg)',
          paddingTop: isMobile ? 120 : 140,
          paddingBottom: 80,
        }}
      >
        {/* Back link */}
        <div style={{ padding: isMobile ? '0 20px 32px' : '0 40px 32px' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Back
          </Link>
        </div>

        {/* Center content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isMobile ? '0 20px' : '0 40px',
            textAlign: 'center',
          }}
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Case Study 01
            </span>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: '0 0 16px',
              }}
            >
              Modernising Data Visualisation
            </h1>
          </m.div>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-lg)',
              color: 'var(--muted)',
              maxWidth: 600,
              lineHeight: 1.6,
              margin: '0 auto',
              marginTop: 16,
            }}
          >
            Stabilising, unifying, and modernising data visualisation in a high-stakes enterprise planning platform.
          </m.p>

          {/* Meta strip */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 48,
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Role', value: 'Product Designer 2' },
              { label: 'Scope', value: 'Full Ownership' },
              { label: 'Timeline', value: '4 Months' },
              { label: 'Company', value: 'o9 Solutions' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  padding: isMobile ? '16px 20px' : '20px 32px',
                  borderRight: (!isMobile && i < arr.length - 1) ? '1px solid var(--border)' : 'none',
                  borderBottom: isMobile ? '1px solid var(--border)' : 'none',
                  width: isMobile ? '50%' : 'auto',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '10px',
                    color: 'var(--muted)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text)',
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </m.div>

          {/* Hero image */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
            style={{
              width: '100%',
              maxWidth: 960,
              marginTop: 64,
            }}
          >
            <CaseImage
              src="/work/charts-modernisation/charts-hero.png"
              alt="Modernising Data Visualisation Hero"
            />
          </m.div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 40px',
        }}
      >

        {/* ── SECTION 01: CONTEXT ───────────────────────────────────────── */}
        <section
          id="context"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="01" title="Context" />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <InfoCard>
                <CardLabel>About o9</CardLabel>
                <CardTitle>Enterprise planning at scale</CardTitle>
                <BodyText muted mb={0}>
                  o9 Solutions is an AI-driven integrated business planning platform used by Fortune 100 companies for supply chain, finance, and commercial planning. The platform is data-heavy by nature: almost every screen involves charts, tables, and metrics that planners depend on to make decisions worth millions.
                </BodyText>
              </InfoCard>

              <InfoCard>
                <CardLabel>Charts Specific</CardLabel>
                <CardTitle>A legacy system showing its age</CardTitle>
                <BodyText muted mb={0}>
                  Charts in o9 were built on jqPlot, a jQuery-based charting library that had not been maintained for years. As the product scaled and the design system evolved, these charts became the most visually inconsistent and technically fragile part of the product.
                </BodyText>
              </InfoCard>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <InfoCard padding={24}>
                <CardLabel>Timeline</CardLabel>
                <BodyText muted mb={0}>
                  4 months from kickoff to handoff, spanning discovery, definition, design, and developer collaboration.
                </BodyText>
              </InfoCard>

              <InfoCard padding={24}>
                <CardLabel>Stakeholders</CardLabel>
                <BodyText muted mb={0}>
                  Product Manager, Engineering Lead, 3 frontend engineers, Design Systems team, and enterprise customer representatives.
                </BodyText>
              </InfoCard>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <InfoCard>
              <CardLabel>Responsibilities</CardLabel>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  'Led end-to-end design: from research framing to final spec delivery',
                  'Audited all existing chart instances across the product',
                  'Defined chart design principles and visual standards',
                  'Designed every chart type: line, bar, waterfall, scatter, donut, heatmap',
                  'Created interaction patterns for tooltips, legends, zoom, and empty states',
                  'Partnered with engineering on Highcharts configuration and theming',
                  'Validated decisions against real planner workflows with PM and customer success',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}>
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </InfoCard>
          </ScrollReveal>
        </section>

        {/* ── SECTION 02: PROBLEM ───────────────────────────────────────── */}
        <section
          id="problem"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="02" title="Problem" />
            <SubTitle>Beyond visual inconsistency</SubTitle>
            <BodyText mb={48}>
              The charts problem was framed internally as a visual refresh. But when I dug into usage patterns and talked with customer success teams, it became clear the issues ran much deeper. Charts were not just inconsistent. They were actively eroding user confidence in the data.
            </BodyText>
          </ScrollReveal>

          {[
            {
              title: 'Broken trust in data',
              body: 'jqPlot rendered inconsistently across browsers and screen sizes. Planners reported seeing different axis scales, clipped labels, and overlapping ticks depending on where they opened a view. When you cannot trust how a number is displayed, you cannot trust the number.',
              image: '/work/charts-modernisation/trust.png',
              imageAlt: 'Broken trust in data visualisation',
            },
            {
              title: 'Weak visual hierarchy',
              body: 'Every chart used the same weight for every element. Gridlines, data labels, axis titles, and data lines all competed for attention. There was no signal of what mattered. Planners spent time reading charts rather than acting on them.',
              image: '/work/charts-modernisation/hierarchy.png',
              imageAlt: 'Weak visual hierarchy in charts',
            },
            {
              title: 'A fragmented system',
              body: 'Charts were styled differently across modules: Supply chain planning had one palette, financial planning another, commercial planning a third. There was no unified token system. Each module had bespoke overrides on top of jqPlot defaults, making any systemic fix nearly impossible.',
              image: '/work/charts-modernisation/fragmented-system.png',
              imageAlt: 'Fragmented chart system across modules',
            },
            {
              title: 'Blind spots in interactions',
              body: 'Tooltips were inconsistent or missing. Legends did not always link to the correct series. Zoom and pan states were broken on several chart types. Users had no reliable way to explore data, just a static read-only image that happened to update.',
              image: '/work/charts-modernisation/blind-spot.png',
              imageAlt: 'Blind spots in chart interactions',
            },
          ].map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: 24,
                  marginBottom: 16,
                }}
              >
                <CardTitle>{card.title}</CardTitle>
                <BodyText muted mb={16}>{card.body}</BodyText>
                <CaseImage src={card.image} alt={card.imageAlt} />
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.1}>
            <div
              style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 24,
                marginTop: 32,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display, serif)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-base)',
                  color: 'var(--muted)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Constraint: this was a migration, not a redesign. The platform had hundreds of chart instances across dozens of modules. We could not afford to redesign from scratch. Every decision had to be achievable through Highcharts configuration and a shared token system.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 03: RESEARCH ──────────────────────────────────────── */}
        <section
          id="research"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="03" title="Research" />
            <SubTitle>Focused on decision confidence, not novelty</SubTitle>
            <BodyText mb={40}>
              I did not approach this as a data visualisation research project. I approached it as a trust and decision-speed problem. The goal was not to find beautiful chart styles. It was to understand what makes planners confident in what they see, and what causes them to second-guess it.
            </BodyText>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
                marginBottom: 40,
              }}
            >
              {[
                {
                  label: 'Contextual sessions',
                  title: 'Watching planners work',
                  body: 'Joined 4 customer success calls where planners were actively using charts in live planning sessions. Observed where they paused, zoomed, hovered, or switched tabs.',
                },
                {
                  label: 'Internal interviews',
                  title: 'Talking to customer success',
                  body: 'Interviewed 6 customer success managers who spent daily time in charts on behalf of clients. They were the best proxy for real user pain.',
                },
                {
                  label: 'Heuristic audit',
                  title: 'Reviewing every chart instance',
                  body: 'Audited 140+ chart instances across the product. Documented rendering issues, colour inconsistencies, broken interactions, and missing states.',
                },
                {
                  label: 'Competitive review',
                  title: 'Learning from best in class',
                  body: 'Reviewed charting in Tableau, Power BI, and Anaplan. Not to copy, but to identify conventions that enterprise planners already had muscle memory for.',
                },
                {
                  label: 'Library evaluation',
                  title: 'Working with engineering',
                  body: 'Collaborated with the frontend lead to evaluate Highcharts, Chart.js, and D3. Highcharts was chosen for its enterprise feature set and accessibility support.',
                },
              ].map((card) => (
                <InfoCard key={card.title}>
                  <CardLabel>{card.label}</CardLabel>
                  <CardTitle>{card.title}</CardTitle>
                  <BodyText muted mb={0}>{card.body}</BodyText>
                </InfoCard>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <InfoCard>
              <CardLabel>Key Findings</CardLabel>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  'Planners do not explore charts, they scan for anomalies. Speed of pattern recognition matters more than depth of interaction.',
                  'Colour is used as meaning. When colours change between modules, planners lose their mental model.',
                  'Tooltip timing and content is the most common complaint. Planners hover and see either nothing or too much.',
                  'Empty states are a trust signal. A blank chart looks like a bug. Planners need to know data is loading or absent, not broken.',
                  'Axis labels are the most ignored element, until they are wrong. Then they destroy trust in the whole chart.',
                  'Legends are rarely read, but always expected. Their absence creates anxiety even when users can read the chart without them.',
                  'Export and screenshot usage is high. Charts need to look as good outside the product as inside it.',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    <span style={{ color: 'var(--accent)', marginTop: 3, flexShrink: 0 }}>
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </InfoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 8,
                marginTop: 32,
              }}
            >
              {[
                '/work/charts-modernisation/research-1.png',
                '/work/charts-modernisation/research-2.png',
                '/work/charts-modernisation/research-3.png',
                '/work/charts-modernisation/research-4.png',
              ].map((src, i) => (
                <ImageLightbox
                  key={src}
                  src={src}
                  alt={`Research finding ${i + 1}`}
                  width={380}
                  height={260}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '12px',
                color: 'var(--muted)',
                textAlign: 'center',
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              Audit samples from the chart inventory review
            </p>
          </ScrollReveal>
        </section>

        {/* ── SECTION 04: PRINCIPLES ────────────────────────────────────── */}
        <section
          id="principles"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="04" title="Principles" />
            <BodyText mb={40}>
              Before designing any chart type, I needed to establish the principles that would govern every decision. These were not aspirational values. They were operational constraints that the team could use to resolve disagreements and evaluate options.
            </BodyText>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {[
              {
                num: '01',
                title: 'Data first',
                body: 'Every visual element must earn its place. If a gridline, label, or colour is not helping the user read the data faster, remove it. Decoration is noise.',
              },
              {
                num: '02',
                title: 'Consistency over cleverness',
                body: 'Use the same patterns everywhere. If a tooltip works a certain way in a line chart, it works the same way in a bar chart. No surprises.',
              },
              {
                num: '03',
                title: 'Accessible by default',
                body: 'Colour alone cannot carry meaning. Every data series must be distinguishable by shape or pattern as well. WCAG AA contrast across all themes.',
              },
              {
                num: '04',
                title: 'States are features',
                body: 'Loading, empty, error, and overflow are not edge cases. They are high-frequency in enterprise planning. Each needs a designed response.',
              },
              {
                num: '05',
                title: 'Export-ready',
                body: 'Charts are shared in slides, emails, and reports. The design must hold at lower resolution, on white backgrounds, and without interactivity.',
              },
            ].map((p, i) => (
              <ScrollReveal key={p.num} delay={i * 0.08}>
                <InfoCard>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      color: 'var(--accent)',
                      letterSpacing: '0.18em',
                      marginBottom: 12,
                    }}
                  >
                    {p.num}
                  </span>
                  <CardTitle>{p.title}</CardTitle>
                  <BodyText muted mb={0}>{p.body}</BodyText>
                </InfoCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.1}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted)',
                textAlign: 'center',
                margin: '32px 0 0',
                lineHeight: 1.7,
              }}
            >
              These five principles were reviewed and agreed with the PM and engineering lead before any design work began. They became the filter for every review conversation.
            </p>
          </ScrollReveal>
        </section>

        {/* ── SECTION 05: DECISIONS ─────────────────────────────────────── */}
        <section
          id="decisions"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="05" title="Decisions" />
            <SubTitle>Foundational work before chart-specific changes</SubTitle>
            <BodyText mb={48}>
              Most of the meaningful design work happened at the system level, not the chart type level. Before designing individual charts, I had to establish the shared foundation that all charts would inherit.
            </BodyText>
          </ScrollReveal>

          {/* A: Typography */}
          <ScrollReveal delay={0.05}>
            <h3
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-lg)',
                fontWeight: 500,
                color: 'var(--text)',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              A. Typography in charts
            </h3>
            <BodyText muted mb={20}>
              jqPlot used pixel-based font sizes that did not scale. I moved everything to a type scale tied to the design system tokens. Chart labels use 11px mono. Axis titles use 12px sans. Data labels use 12px sans medium. No text below 11px anywhere.
            </BodyText>
            <PillLabel type="proposed" />
            <CaseImage
              src="/work/charts-modernisation/typography.png"
              alt="Proposed typography system for charts"
            />
          </ScrollReveal>

          {/* B: Visual noise */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                B. Reducing visual noise
              </h3>
              <BodyText muted mb={20}>
                The original charts had full borders, heavy gridlines, and visible backgrounds. I removed all borders, reduced gridlines to a single horizontal set at low opacity, and used the page background as the chart background. Less chrome, more data.
              </BodyText>
              <CaseImage
                src="/work/charts-modernisation/visual-noise.png"
                alt="Visual noise reduction in charts"
              />
            </ScrollReveal>
          </div>

          {/* C: Fallback and empty states */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                C. Fallback and empty states
              </h3>
              <BodyText muted mb={20}>
                A blank chart area was indistinguishable from a loading state or a data error. I designed three explicit states: loading (skeleton with shimmer), empty (illustration with context text), and error (icon with retry action). Each uses the same structural layout as the data state so the transition is smooth.
              </BodyText>
              <CaseImage
                src="/work/charts-modernisation/fallback.png"
                alt="Chart fallback and empty states"
              />
            </ScrollReveal>
          </div>

          {/* D: Tooltips */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                D. Tooltip redesign
              </h3>
              <BodyText muted mb={20}>
                The old tooltip was a plain HTML box with no structure. It showed raw numbers with no context: no units, no formatting, no comparison. The new tooltip uses a structured card with a header (period or category), a primary value with formatted number, and up to 3 secondary values. Series names are colour-coded using the data series colours.
              </BodyText>
              <PillLabel type="current" />
              <CaseImage
                src="/work/charts-modernisation/current-tooltip.png"
                alt="Current tooltip design"
              />
              <div style={{ marginTop: 16 }}>
                <PillLabel type="proposed" />
                <CaseImage
                  src="/work/charts-modernisation/proposed-tooltip.png"
                  alt="Proposed tooltip design"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* E: Legends */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                E. Legend positioning and interaction
              </h3>
              <BodyText muted mb={20}>
                Legends were previously placed below charts in a horizontal scroll, invisible on mobile. I moved them above the chart area (right-aligned), limited to 5 visible items with a toggle for more. Clicking a legend item toggles that series on and off with a smooth fade. Hovering a legend item fades all other series to 20% opacity.
              </BodyText>
              <PillLabel type="current" />
              <CaseImage
                src="/work/charts-modernisation/current-legend.png"
                alt="Current legend design"
              />
              <div style={{ marginTop: 16 }}>
                <PillLabel type="proposed" />
                <CaseImage
                  src="/work/charts-modernisation/proposed-legend.png"
                  alt="Proposed legend design"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* F: Colour patterns */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                F. Colour and pattern system
              </h3>
              <BodyText muted mb={20}>
                I defined a 10-colour sequential palette that works in both light and dark mode. The palette is ordered by perceptual distance: adjacent colours are as different as possible to aid series discrimination. For accessibility, each series also gets a unique line dash pattern (solid, dashed, dotted, dash-dot) so colour-blind users can distinguish series.
              </BodyText>
              <PillLabel type="proposed" />
              <CaseImage
                src="/work/charts-modernisation/patterns.png"
                alt="Proposed colour and pattern system"
              />
            </ScrollReveal>
          </div>

          {/* G: Chart layout */}
          <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <ScrollReveal delay={0.05}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 16px',
                  letterSpacing: '-0.02em',
                }}
              >
                G. Chart container layout
              </h3>
              <BodyText muted mb={20}>
                The chart container was unsystematic: titles, subtitles, and action menus were positioned differently everywhere. I defined a strict anatomy: title top-left, subtitle below, action menu top-right (export, expand, settings), legend top-right below actions, chart area full-width below legend, and an optional caption bottom-left.
              </BodyText>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 16,
                }}
              >
                <div>
                  <PillLabel type="current" />
                  <CaseImage
                    src="/work/charts-modernisation/current-chart-layout.png"
                    alt="Current chart container layout"
                  />
                </div>
                <div>
                  <PillLabel type="proposed" />
                  <CaseImage
                    src="/work/charts-modernisation/proposed-chart-layout.png"
                    alt="Proposed chart container layout"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* New functionalities */}
          <ScrollReveal delay={0.1}>
            <div style={{ marginTop: 48 }}>
              <InfoCard>
                <CardLabel>New Functionalities</CardLabel>
                <CardTitle>Things that did not exist before</CardTitle>
                <ul
                  style={{
                    margin: '8px 0 0',
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {[
                    'Expand to full-screen mode for dense charts',
                    'Persistent zoom state: zoom in, navigate away, return to same zoom',
                    'Cross-chart hover: hover on one chart highlights the same point in adjacent charts',
                    'Annotation support: planners can pin notes to specific data points',
                    'Threshold lines: horizontal reference lines with labels (e.g. "Target", "Last year")',
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontFamily: 'var(--font-sans, sans-serif)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      <span style={{ color: 'var(--accent)', marginTop: 3, flexShrink: 0 }}>
                        &bull;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 24,
                marginTop: 32,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display, serif)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-base)',
                  color: 'var(--muted)',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Motion and interaction: all chart animations use a 300ms ease-out curve. Data updates animate the difference, not a full redraw. Series appear sequentially on first load (left-to-right for line charts, bottom-up for bar charts) to help planners follow the data narrative.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 06: THE STAND ─────────────────────────────────────── */}
        <section
          id="the-stand"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="06" title="The Stand" />
            <SubTitle>Runtime Settings Panel</SubTitle>
            <BodyText mb={40}>
              Midway through the project, a product manager requested a "runtime settings panel" that would let planners toggle between chart types on the fly: switch a line chart to a bar chart, or a stacked bar to a grouped bar. This was positioned as a power-user feature that would increase flexibility.
            </BodyText>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InfoCard>
                <CardLabel>The ask</CardLabel>
                <BodyText muted mb={0}>
                  Build a settings panel accessible from the chart action menu that exposes chart type, series grouping, and axis configuration as user-adjustable settings.
                </BodyText>
              </InfoCard>

              <InfoCard>
                <CardLabel>Why I pushed back</CardLabel>
                <BodyText muted mb={0}>
                  Enterprise planning charts are not generic. The chart type is chosen by the product team because it is the right representation for that specific data and that specific decision. Giving planners the ability to switch types introduces the risk of choosing a chart that actively misleads: a line chart implies continuity, a waterfall implies accumulation. Wrong chart type for a given dataset is a data literacy problem embedded in the UI.
                </BodyText>
              </InfoCard>

              <InfoCard>
                <CardLabel>What we agreed on</CardLabel>
                <BodyText muted mb={0}>
                  A limited settings panel: toggle between absolute and percentage values for stacked charts, toggle between linear and logarithmic scale for charts where the range is extreme, and toggle data labels on and off. No chart type switching. These settings change representation of the same data, not the chart type itself.
                </BodyText>
              </InfoCard>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div
              style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 24,
                marginTop: 32,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 12px',
                }}
              >
                What we chose not to change
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  'Chart type: chosen by the product team per use case, not user-configurable',
                  'Colour palette: system-defined, not themeable per user (consistency is the feature)',
                  'Animation speed: fixed at 300ms, no preference toggle (reduces QA surface area)',
                  'Grid density: fixed horizontal-only, no option for vertical gridlines',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    <span style={{ color: 'var(--accent)', marginTop: 3, flexShrink: 0 }}>
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 07: OUTCOMES ──────────────────────────────────────── */}
        <section
          id="outcomes"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="07" title="Outcomes" />
            <BodyText mb={48}>
              The migration shipped over 4 weeks across 6 modules. Engineering handled the Highcharts configuration using the design tokens and spec documentation I provided. Post-launch feedback came through customer success within the first month.
            </BodyText>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
                marginBottom: 40,
              }}
            >
              {[
                {
                  num: '0',
                  suffix: ' chart-related',
                  body: 'customer escalations in the first 30 days post-launch, compared to an average of 3 per month on the old system.',
                },
                {
                  num: '140+',
                  suffix: '',
                  body: 'chart instances migrated consistently using a shared configuration layer, with no module-specific overrides required.',
                },
                {
                  num: '2x',
                  suffix: '',
                  body: 'faster chart implementation time for new features, according to the frontend lead, due to the configuration-driven approach.',
                },
                {
                  num: '1',
                  suffix: ' source of truth',
                  body: 'for chart design: a single Figma library with all chart types, all states, and all interaction patterns, used by 3 product designers.',
                },
              ].map((card) => (
                <InfoCard key={card.num + card.suffix}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    {card.num}
                    {card.suffix && (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 400,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {card.suffix}
                      </span>
                    )}
                  </span>
                  <BodyText muted mb={0}>{card.body}</BodyText>
                </InfoCard>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div
              style={{
                maxWidth: 960,
                margin: '0 auto',
                width: '100%',
              }}
            >
              <ImageLightbox
                src="/work/charts-modernisation/suggested.png"
                alt="Final charts system overview"
                width={960}
                height={600}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '12px',
                  color: 'var(--muted)',
                  textAlign: 'center',
                  marginTop: 12,
                  marginBottom: 0,
                }}
              >
                Proposed charts overview across chart types
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 08: REFLECTION ────────────────────────────────────── */}
        <section
          id="reflection"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="08" title="Reflection" />
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {[
              {
                num: '01',
                body: 'The most impactful design work was invisible to users. The type scale, the colour system, the empty states: none of these are things planners notice or comment on. But they are the reason charts stopped being a source of friction. Good systems design means users stop thinking about the tool.',
              },
              {
                num: '02',
                body: 'Pushing back on the runtime settings panel was the right call. Not because flexibility is wrong, but because in this context, flexibility was a way for the product to avoid making decisions. When a product team is unsure which chart type is right, the answer is to do the research, not to expose the choice to the user.',
              },
              {
                num: '03',
                body: 'I underestimated the documentation burden. Designing 12 chart types with 4 states each and 3 interaction modes is a lot of spec. In retrospect, I would have built the Figma library and spec documentation concurrently from the start, not at the end. The handoff could have been 2 weeks shorter.',
              },
            ].map((item) => (
              <ScrollReveal key={item.num} delay={0.05}>
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      color: 'var(--accent)',
                      letterSpacing: '0.18em',
                      flexShrink: 0,
                      paddingTop: 4,
                    }}
                  >
                    {item.num}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── BOTTOM NAV ────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '48px 0',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Back to Work
          </Link>

          <Link
            href="/work/customer-360"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '12px',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Next Case Study: Customer 360 →
          </Link>
        </div>
      </div>
    </>
  )
}
