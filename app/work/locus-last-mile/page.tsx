'use client'

import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/motion/ScrollReveal'
import ImageLightbox from '@/components/ui/ImageLightbox'

/* ── Nav sections ────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'promise',      num: '01', label: 'The Promise' },
  { id: 'people',       num: '02', label: 'The People' },
  { id: 'research',     num: '03', label: 'Research' },
  { id: 'constraints',  num: '04', label: 'Constraints' },
  { id: 'metrics',      num: '05', label: 'Metrics' },
  { id: 'workflow',     num: '06', label: 'Workflow' },
  { id: 'solution',     num: '07', label: 'Solution' },
  { id: 'rajans-story', num: '08', label: "Rajan's Story" },
  { id: 'reflection',   num: '09', label: 'Reflection' },
]

/* ── Shared sub-components ───────────────────────────────────────────────── */

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
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function MonoLabel({ children, accent = true }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      style={{
        display: 'block',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px',
        color: accent ? 'var(--accent)' : 'var(--muted)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}
    >
      {children}
    </span>
  )
}

function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: 24,
        margin: '0 0 48px',
        fontFamily: 'var(--font-display, serif)',
        fontStyle: 'italic',
        fontSize: 'var(--text-xl)',
        color: 'var(--text)',
        lineHeight: 1.5,
      }}
    >
      {children}
    </blockquote>
  )
}

function MutedQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: 24,
        margin: 0,
        fontFamily: 'var(--font-display, serif)',
        fontStyle: 'italic',
        fontSize: 'var(--text-lg)',
        color: 'var(--muted)',
        lineHeight: 1.6,
      }}
    >
      {children}
    </blockquote>
  )
}

function CaseImage({
  src,
  alt,
  caption,
  marginTop = 0,
  bg,
}: {
  src: string
  alt: string
  caption?: string
  marginTop?: number
  bg?: string
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

function Connector() {
  return (
    <div
      style={{
        width: 2,
        height: 40,
        backgroundColor: 'var(--border)',
        margin: '0 auto',
      }}
    />
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function LocusLastMile() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [navVisible, setNavVisible] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [activeSection, setActiveSection] = useState('promise')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const check = () => {
      setShowNav(window.innerWidth > 1100)
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  return (
    <>

      {/* Mobile scroll progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: 'var(--border)',
          zIndex: 200,
          display: showNav ? 'none' : 'block',
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
            Locus Last Mile
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map(({ id, num, label }) => {
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
          minHeight: '100svh',
          backgroundColor: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingTop: 64,
        }}
      >
        {/* Back link */}
        <div style={{ padding: '20px 40px' }}>
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
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '40px 20px 60px' : '40px 40px 60px',
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
                marginBottom: 24,
              }}
            >
              Case Study 02
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
                fontSize: isMobile ? 'clamp(2.8rem, 12vw, 4rem)' : 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: '0 0 16px',
              }}
            >
              Locus Last Mile
            </h1>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '13px',
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                marginBottom: 32,
              }}
            >
              LLM
            </span>
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
            }}
          >
            One promise. 661 orders. One manager to make sure it all happens.
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
              gap: isMobile ? 0 : 0,
              marginTop: 48,
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Role', value: 'Product Designer' },
              { label: 'Type', value: 'Personal Project' },
              { label: 'Tools', value: 'Figma, AI-assisted' },
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
            <div
              style={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <Image
                src="/work/locus-last-mile/assignment-dashboard.png"
                alt="Locus Last Mile Assignment Dashboard"
                width={960}
                height={600}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>
          </m.div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore
          </span>
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} color="var(--muted)" />
          </m.div>
        </m.div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 40px',
        }}
      >

        {/* ── SECTION 01: THE PROMISE ───────────────────────────────────── */}
        <section
          id="promise"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="01" title="The Promise" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BlockQuote>
              One promise. 661 orders. One manager to make sure it all happens.
            </BlockQuote>
          </ScrollReveal>

          {/* Two blocks */}
          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 32,
                marginBottom: 48,
              }}
            >
              <div>
                <MonoLabel>From the Brief</MonoLabel>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--text)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Warehouse manager arrives at 7am. 400 to 800 orders. 2 hours to assign everything before the first slot opens. By midday riders are on the road and things start breaking. A bike breaks down, a customer is not home, a slot is about to be missed. Every failure cascades. The problem is not that he lacks information. It is that he cannot act on it fast enough.
                </p>
              </div>
              <div>
                <MonoLabel>The Reframe</MonoLabel>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  How do we design a dashboard that helps Manjunath stay ahead of failures, not just aware of them? One that enables fast, confident decisions across all orders so every customer gets their parcel exactly when promised.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Mode pills */}
          <ScrollReveal delay={0.15}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {['Planning', 'Monitoring', 'Exceptions'].map((mode, i, arr) => (
                  <div key={mode} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '10px 20px',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '12px',
                        color: 'var(--text)',
                      }}
                    >
                      {mode}
                    </div>
                    {i < arr.length - 1 && (
                      <span style={{ color: 'var(--accent)', fontSize: '14px' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: '12px',
                  color: 'var(--muted)',
                  margin: 0,
                }}
              >
                Manjunath's day has three distinct modes. These became the foundation for every structural decision.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 02: THE PEOPLE ────────────────────────────────────── */}
        <section
          id="people"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="02" title="The People" />
          </ScrollReveal>

          {/* Manjunath card */}
          <ScrollReveal delay={0.05}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: isMobile ? 16 : 24,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'flex-start',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1d0024, #100014)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '16px',
                      color: 'var(--accent)',
                    }}
                  >
                    MJ
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '0 0 4px',
                    }}
                  >
                    Manjunath, 51
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--muted)',
                      margin: '0 0 20px',
                    }}
                  >
                    Warehouse Manager, HSR Layout Bangalore Hub
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      margin: '0 0 12px',
                    }}
                  >
                    Five questions running in his mind at any moment:
                  </p>

                  <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      'How many orders are still unassigned?',
                      'Which time slots are at risk?',
                      'Which riders have not moved yet?',
                      'Who is asking for help right now?',
                      'How many orders are completed out of the total?',
                    ].map((q, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: 'var(--text-base)',
                            color: 'var(--accent)',
                            flexShrink: 0,
                            lineHeight: 1.6,
                          }}
                        >
                          {i + 1}.
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-sans, sans-serif)',
                            fontSize: 'var(--text-base)',
                            color: 'var(--text)',
                            lineHeight: 1.6,
                          }}
                        >
                          {q}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted)',
                      fontStyle: 'italic',
                      marginTop: 20,
                      marginBottom: 0,
                    }}
                  >
                    The aim was to design something that removes the anxiety behind all five.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Rajan card */}
          <ScrollReveal delay={0.1}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: isMobile ? 16 : 24,
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #806a6a, #665654)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '16px',
                      color: 'var(--text)',
                    }}
                  >
                    RK
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '0 0 4px',
                    }}
                  >
                    Rajan, 67
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--muted)',
                      margin: '0 0 16px',
                    }}
                  >
                    Patient, Begur
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    He ordered his blood pressure medicine three days ago. Delivery was promised between 10 and 12 today. He has not stepped out of his house. He is waiting.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Connecting quote */}
          <ScrollReveal delay={0.15}>
            <MutedQuote>
              Rajan will never see Manjunath's dashboard. But every design decision in this project exists to make sure his order reaches him on time.
            </MutedQuote>
          </ScrollReveal>
        </section>

        {/* ── SECTION 03: RESEARCH ──────────────────────────────────────── */}
        <section
          id="research"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="03" title="Understanding the World" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Without access to real users, understanding Manjunath meant getting close to his world through other means. Secondary research, contextual observation, and structured inference shaped everything that followed.
            </p>
          </ScrollReveal>

          {[
            {
              key: 'A',
              title: 'Secondary Research',
              body: 'Started by researching how last-mile delivery hubs operate in India. Read about hub-and-spoke logistics models, the 7 to 10am pressure window before the first delivery slot opens, and what makes the morning assignment phase so high-stakes. Browsed Locus\'s own published content on last-mile operations. Used Claude to stress-test assumptions, think through edge cases, and simulate failure scenarios. Explored operational forums where delivery managers and riders share their day-to-day realities.',
              isInsights: false,
            },
            {
              key: 'B',
              title: 'Google Maps Reconnaissance',
              body: 'Looked up Swiggy, Zomato, and Blinkit dark stores and delivery hubs across HSR Layout, Koramangala, and Begur. Went through photos of the physical spaces, bikes parked outside, handwritten order sheets on tables. Read reviews left by delivery partners, complaints about slot pressure, heat, limited break time, and last-minute reassignments. This is not data. But it made Manjunath feel real.',
              isInsights: false,
            },
            {
              key: 'C',
              title: 'What This Revealed',
              isInsights: true,
              insights: [
                'Managers do not sit. They walk the floor constantly, check their phone in 10-second bursts, and context-switch continuously. The dashboard needed to work at a glance, not as a reading experience.',
                'Help requests pile up exactly when the manager is most overwhelmed. Mid-morning is when exceptions start compounding on top of each other. Exception visibility cannot be buried in a secondary tab.',
                'Rider familiarity with an area is critical in Indian delivery contexts. A new rider in an unfamiliar zone loses 20 to 30 minutes per batch just navigating. The system needed to surface this as a risk signal, not just metadata.',
              ],
            },
          ].map((block, i) => (
            <ScrollReveal key={block.key} delay={0.05 * (i + 1)}>
              <div
                style={{
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  padding: '28px 0',
                }}
              >
                <MonoLabel>{block.key}</MonoLabel>
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
                  {block.title}
                </h3>
                {block.isInsights ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {block.insights!.map((insight, j) => (
                      <div key={j}>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '10px',
                            color: 'var(--accent)',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            marginBottom: 6,
                          }}
                        >
                          Insight
                        </span>
                        <p
                          style={{
                            fontFamily: 'var(--font-sans, sans-serif)',
                            fontSize: 'var(--text-base)',
                            color: 'var(--text)',
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {block.body}
                  </p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </section>

        {/* ── SECTION 04: CONSTRAINTS ───────────────────────────────────── */}
        <section
          id="constraints"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="04" title="The Constraints" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Assumptions were grounded in research. These were the rules of the operational world Manjunath works within.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
              }}
            >
              {[
                {
                  label: 'The Hub',
                  title: 'The Hub',
                  bullets: [
                    'One morning batch arrives daily. The full day\'s orders are known at the start of the shift.',
                    'Three delivery slots: 10 to 12, 2 to 4, 5 to 7.',
                    'Handles pharma, FMCG, grocery, and e-commerce.',
                    'One hub serves one city zone for the shift.',
                  ],
                },
                {
                  label: 'Riders',
                  title: 'Riders',
                  bullets: [
                    '20 active riders with 2 standby riders.',
                    'Each rider carries 25 to 40 orders in a single batch.',
                    'One batch covers the rider\'s full day across all slots.',
                    'System tracks rider familiarity with specific areas.',
                  ],
                },
                {
                  label: 'Order Assignments',
                  title: 'Order Assignments',
                  bullets: [
                    'System auto-suggests assignments using geography, time slot, capacity, priority, vehicle type, and area familiarity.',
                    'Manjunath reviews, adjusts, and confirms. He makes the decision, not the system.',
                    'Orders are confirmed in bulk, not individually.',
                  ],
                },
                {
                  label: 'Returns',
                  title: 'Returns',
                  bullets: [
                    'Three return types: failed delivery, customer-initiated reverse pickup, and damaged package before dispatch.',
                    'Reverse pickups behave like delivery tasks.',
                    'All return types are managed in the same interface.',
                  ],
                },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: 24,
                  }}
                >
                  <MonoLabel>{card.label}</MonoLabel>
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '0 0 12px',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {card.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'var(--font-sans, sans-serif)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted)',
                          lineHeight: 1.7,
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── SECTION 05: METRICS ───────────────────────────────────────── */}
        <section
          id="metrics"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="05" title="Success Metrics" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              If a design element does not move one of these numbers, it does not belong on the screen.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 12,
                marginBottom: 40,
              }}
            >
              {[
                { value: '95%+', label: 'Orders delivered successfully' },
                { value: '90%+', label: 'Delivered within promised slot' },
                { value: '100%', label: 'Assigned before 10am' },
                { value: '<5%', label: 'Failed delivery rate' },
                { value: '5 min', label: 'Max time to acknowledge help request' },
                { value: '2 hrs', label: 'Morning assignment window' },
                { value: '0', label: 'Exceptions requiring dashboard exit' },
                { value: '0', label: 'Ambiguous failures at shift close' },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                      color: 'var(--accent)',
                      margin: '0 0 8px',
                      lineHeight: 1.1,
                    }}
                  >
                    {m.value}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <MutedQuote>
              A good day is the day Rajan opens his door at 11:04am and has no reason to call the pharmacy.
            </MutedQuote>
          </ScrollReveal>
        </section>

        {/* ── SECTION 06: WORKFLOW ──────────────────────────────────────── */}
        <section
          id="workflow"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="06" title="The Workflow" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              The plan is made in the morning. Reality breaks it by afternoon. This shaped how the product was structured from the start.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CaseImage
              src="/work/locus-last-mile/workflow-llm.png"
              alt="Workflow diagram"
              caption="Manjunath's day mapped across three modes"
              bg="#ffffff"
              marginTop={40}
            />
          </ScrollReveal>

          {/* First approach */}
          <ScrollReveal delay={0.15}>
            <div style={{ marginTop: 48 }}>
              <MonoLabel accent={false}>First Approach</MonoLabel>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 12px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                Unidirectional Flow
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                My first instinct was a single dashboard that shifts based on time of day. Planning Mode in the morning, Monitoring Mode after dispatch. Intelligent, contextual, clean. But it forced Manjunath into a mode he did not choose, and broke down the moment he needed to jump between contexts mid-morning.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                {['/work/locus-last-mile/lofi-v1.png', '/work/locus-last-mile/lofi-v1.1.png'].map((src, i) => (
                  <ImageLightbox
                    key={i}
                    src={src}
                    alt={`Lo-fi exploration ${i + 1}`}
                    width={380}
                    height={240}
                  />
                ))}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  textAlign: 'center',
                  margin: '0 0 32px',
                }}
              >
                Early lo-fi exploration of the unidirectional approach
              </p>
            </div>
          </ScrollReveal>

          {/* Final approach */}
          <ScrollReveal delay={0.2}>
            <div style={{ marginTop: 32 }}>
              <MonoLabel>Final Approach</MonoLabel>
              <h3
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  color: 'var(--text)',
                  margin: '0 0 12px',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                Tabbed View
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  marginBottom: 40,
                }}
              >
                The shift to a tab structure gave Manjunath control. He moves between Assignment, Monitoring, Orders, Summary, and Settings on his own terms. The system supports his decisions rather than dictating his flow.
              </p>
            </div>
          </ScrollReveal>

          {/* Happy path flow */}
          <ScrollReveal delay={0.25}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Arrives at Hub', desc: '' },
                  { label: 'Reviews total orders', desc: '' },
                  { label: 'Marks absences', desc: '' },
                  { label: 'Reviews system plan', desc: '' },
                  { label: 'Approves assignments', desc: '' },
                  { label: 'Monitors riders', desc: '' },
                  { label: 'Resolves exceptions', desc: '' },
                  { label: 'Closes shift', desc: '' },
                ].map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '10px 16px',
                        fontFamily: 'var(--font-sans, sans-serif)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text)',
                        fontWeight: 500,
                      }}
                    >
                      {step.label}
                    </div>
                    {i < arr.length - 1 && (
                      <span style={{ color: 'var(--accent)', fontSize: '14px', padding: '4px 16px' }}>↓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 8,
                  padding: '24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                }}
              >
                {[
                  'Arrives at Hub',
                  'Reviews total orders',
                  'Marks absences',
                  'Reviews system plan',
                  'Approves assignments',
                  'Monitors riders',
                  'Resolves exceptions',
                  'Closes shift',
                ].map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans, sans-serif)',
                        fontSize: '12px',
                        color: 'var(--text)',
                        fontWeight: 500,
                      }}
                    >
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ color: 'var(--accent)', fontSize: '13px' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>

        {/* ── SECTION 07: SOLUTION ──────────────────────────────────────── */}
        <section
          id="solution"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="07" title="The Solution" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                marginBottom: 48,
              }}
            >
              Six screens. One morning. This is the happy path.
            </p>
          </ScrollReveal>

          {[
            {
              label: 'Step 01',
              title: 'Assignment Dashboard',
              img: '/work/locus-last-mile/assignment-dashboard.png',
              desc: 'Manjunath arrives and sees the full picture. Total orders, slot breakdown, rider availability, and the system-generated assignment plan are all visible at once. No hunting for context.',
            },
            {
              label: 'Step 02',
              title: 'Assignment Review',
              img: '/work/locus-last-mile/assignment-review.png',
              desc: 'He reviews the plan the system has created. Each rider, their assigned orders, and the geographic grouping are laid out for his approval. He reads, not enters.',
            },
            {
              label: 'Step 03',
              title: 'Manual Adjustment',
              img: '/work/locus-last-mile/manual-adjustment.png',
              desc: 'Where the system falls short, Manjunath steps in. He can reassign orders, swap riders between zones, or flag priority parcels before confirming.',
            },
            {
              label: 'Step 04',
              title: 'Final Confirmation',
              img: '/work/locus-last-mile/final-confirmation.png',
              desc: 'One action pushes the confirmed plan to all riders. Bulk confirmation, not order-by-order. The morning assignment closes in minutes, not hours.',
            },
            {
              label: 'Step 05',
              title: 'Assignment Done',
              img: '/work/locus-last-mile/assignment-done.png',
              desc: "Riders receive their batches. The dashboard shifts into monitoring mode. Manjunath's role changes from planner to supervisor.",
            },
            {
              label: 'Step 06',
              title: 'Monitoring Dashboard',
              img: '/work/locus-last-mile/monitoring-dashboard.png',
              desc: 'Live view of all riders in the field. Status, location, completion rate, and active exceptions are visible at a glance. The interface stays calm so Manjunath can stay calm.',
            },
          ].map((block, i, arr) => (
            <div key={block.label}>
              <ScrollReveal delay={i * 0.1}>
                <div style={{ marginBottom: 8 }}>
                  <MonoLabel>{block.label}</MonoLabel>
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '0 0 12px',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    {block.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {block.desc}
                  </p>
                  <ImageLightbox
                    src={block.img}
                    alt={block.title}
                    width={760}
                    height={480}
                  />
                </div>
              </ScrollReveal>
              {i < arr.length - 1 && <Connector />}
            </div>
          ))}
        </section>

        {/* ── SECTION 08: RAJAN'S STORY ─────────────────────────────────── */}
        <section
          id="rajans-story"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <SectionHeading num="08" title="Rajan's Story" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                fontStyle: 'italic',
                marginBottom: 16,
              }}
            >
              (Rajan might not get his medicine on time)
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                lineHeight: 1.7,
                marginBottom: 48,
              }}
            >
              Rajan is expecting his medicine before 12pm. Manjunath arrived at 7 and planned to finish assignment by 8. This is what actually happened.
            </p>
          </ScrollReveal>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: isMobile ? 48 : 60,
                width: 2,
                backgroundColor: 'var(--border)',
              }}
            />

            {[
              {
                time: '7:00 AM',
                narrative: 'Manjunath reaches the hub. One rider is absent. He activates the 2 buffer riders, but they are new and still getting familiar with the zones. One of them is Deepak.',
                img: '/work/locus-last-mile/ec-1.png',
                accent: false,
              },
              {
                time: '11:00 AM',
                narrative: 'Barry and Deepak are assigned the same zone 1. Deepak is unfamiliar with the area but the system has flagged this as a risk.',
                img: '/work/locus-last-mile/ec-2.png',
                accent: false,
              },
              {
                time: '11:00 AM',
                narrative: "Manjunath receives a help request from Deepak. His bike has broken down and he cannot continue. Manjunath checks the status and location of nearby riders and decides to reassign Deepak's priority orders. One of those orders belongs to Rajan.",
                img: '/work/locus-last-mile/ec-3.png',
                accent: false,
              },
              {
                time: '11:00 AM',
                narrative: "The reassignment happens inside the dashboard without leaving the monitoring view. Manjunath selects Rajan's order and moves it to Barry, who is close to Begur.",
                img: '/work/locus-last-mile/ec-4.png',
                accent: false,
              },
              {
                time: '11:20 AM',
                narrative: 'Manjunath tracks both riders in real time. Barry is moving. The slot window is open until 12.',
                img: '/work/locus-last-mile/ec-4.1.png',
                accent: false,
              },
              {
                time: '11:45 AM',
                narrative: 'Barry delivers the package to Rajan. The slot is met. The promise holds.',
                img: '/work/locus-last-mile/ec-5.png',
                accent: true,
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div
                  style={{
                    display: 'flex',
                    gap: 32,
                    marginBottom: 40,
                    position: 'relative',
                  }}
                >
                  {/* Timestamp + dot */}
                  <div
                    style={{
                      width: isMobile ? 48 : 60,
                      flexShrink: 0,
                      textAlign: 'right',
                      paddingTop: 14,
                      paddingRight: 16,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: isMobile ? '10px' : '12px',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        display: 'block',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.time}
                    </span>
                    {/* Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        right: -((item.accent ? 5 : 4) + 1),
                        top: 16,
                        width: item.accent ? 10 : 8,
                        height: item.accent ? 10 : 8,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        zIndex: 1,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        borderLeft: '3px solid var(--accent)',
                        borderRadius: '0 4px 4px 0',
                        padding: '16px 20px',
                        marginBottom: 16,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-sans, sans-serif)',
                          fontSize: 'var(--text-base)',
                          color: item.accent ? 'var(--text)' : 'var(--muted)',
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {item.narrative}
                      </p>
                    </div>
                    <ImageLightbox
                      src={item.img}
                      alt={`Timeline step ${i + 1}`}
                      width={700}
                      height={440}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Closing line */}
          <ScrollReveal delay={0.1}>
            <div style={{ marginTop: 48 }}>
              <blockquote
                style={{
                  borderLeft: '3px solid var(--accent)',
                  paddingLeft: 24,
                  margin: '0 0 40px',
                  fontFamily: 'var(--font-display, serif)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--text)',
                  lineHeight: 1.6,
                }}
              >
                Rajan opens his door. He has no reason to call the pharmacy.
              </blockquote>
            </div>
          </ScrollReveal>

          {/* Summary dashboard */}
          <ScrollReveal delay={0.15}>
            <CaseImage
              src="/work/locus-last-mile/summary-dash.png"
              alt="End of shift summary dashboard"
              caption="End-of-shift summary. Every order accounted for."
            />
          </ScrollReveal>
        </section>

        {/* ── SECTION 09: REFLECTION ────────────────────────────────────── */}
        <section
          id="reflection"
          style={{
            paddingTop: 120,
            paddingBottom: 80,
          }}
        >
          <ScrollReveal>
            <SectionHeading num="09" title="Reflection" />
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              'We take stressful operational scenarios too lightly when we are not close to them. What looks like a simple routing problem is actually a web of human decisions, time pressure, and cascading failures. Design for the person in that pressure, not the ideal-state user.',
              'Given more time, the focus would shift to micro-interactions and component polish. The bigger screens are directionally right, but the value for Manjunath lives in the small moments. How fast does an alert surface? How easy is a reassignment drag? Those details matter more than the layout.',
              'Next steps would be to detail the screens that were left incomplete, then build no-code prototypes to set expectations and test with real hub managers before any development begins.',
            ].map((text, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--accent)',
                      flexShrink: 0,
                      lineHeight: 1.8,
                    }}
                  >
                    {i + 1}.
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
                    {text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>

      {/* ── BOTTOM NAVIGATION ─────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '48px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 'var(--text-base)',
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
          href="/work/charts-modernisation"
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          Next Case Study: Modernising Data Visualisation →
        </Link>
      </div>

    </>
  )
}
