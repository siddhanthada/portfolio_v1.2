'use client'

import { useEffect, useRef, useState } from 'react'
import { m, LazyMotion, domAnimation } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '@/components/motion/ScrollReveal'
import ImageLightbox from '@/components/ui/ImageLightbox'

/* ── Nav sections ─────────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'problem',       num: '01', label: 'Problem' },
  { id: 'users',         num: '02', label: 'Users' },
  { id: 'research',      num: '03', label: 'Research' },
  { id: 'constraints',   num: '04', label: 'Constraints' },
  { id: 'principles',    num: '05', label: 'Principles' },
  { id: 'flows',         num: '06', label: 'Flows' },
  { id: 'lofi',          num: '07', label: 'Lo-fi' },
  { id: 'final-screens', num: '08', label: 'Final Screens' },
  { id: 'edge-cases',    num: '09', label: 'Edge Cases' },
  { id: 'reflection',    num: '10', label: 'Reflection' },
]

/* ── Shared sub-components ────────────────────────────────────────────────── */

function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '11px',
          color: 'var(--accent)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8,
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
          lineHeight: 1.25,
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'block',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '10px',
        color: 'var(--accent)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {children}
    </span>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Connector() {
  return (
    <div
      style={{
        width: 2,
        height: 32,
        backgroundColor: 'var(--border)',
        margin: '0 auto',
      }}
    />
  )
}

function BodyText({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSize: 'var(--text-base)',
        color: 'var(--muted)',
        lineHeight: 1.8,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SmartCards() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [navVisible, setNavVisible] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [activeSection, setActiveSection] = useState('problem')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  /* scroll to top on mount */
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
    return () => clearTimeout(t)
  }, [])

  /* hero exit observer */
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

  /* active section tracking */
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

  /* responsive */
  useEffect(() => {
    const check = () => {
      setShowNav(window.innerWidth > 1100)
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* scroll progress for mobile bar */
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

  /* shared content styles */
  const contentStyle: React.CSSProperties = {
    maxWidth: 760,
    margin: '0 auto',
    padding: isMobile ? '0 20px' : '0 40px',
  }

  const sectionStyle: React.CSSProperties = {
    paddingTop: 120,
    paddingBottom: 80,
    borderTop: '1px solid var(--border)',
  }

  return (
    <LazyMotion features={domAnimation}>

      {/* Mobile progress bar */}
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
            Smart Cards
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
                      fontSize: '10px',
                      color: 'var(--muted)',
                      minWidth: 20,
                    }}
                  >
                    {num}
                  </span>
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
            {'← Back'}
          </Link>
        </div>

        {/* Hero content */}
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
                fontSize: '11px',
                color: 'var(--accent)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              Case Study 04
            </span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontStyle: 'italic',
              fontSize: isMobile ? 'clamp(2.8rem, 12vw, 4rem)' : 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 400,
              color: 'var(--text)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
            }}
          >
            Smart Cards
          </m.h1>

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
            Empowering households to manage, issue, and track supplementary cards within families, all from a single app.
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
              { label: 'Role',  value: 'Product Designer' },
              { label: 'Type',  value: 'Personal Project' },
              { label: 'Focus', value: 'Mobile, Fintech' },
              { label: 'Year',  value: '2024' },
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
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
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
            <Image
              src="/work/smart-cards/main-frame-image.png"
              alt="Smart Cards Hero"
              width={960}
              height={644}
              style={{
                width: 'auto',
                maxWidth: '100%',
                height: 'auto',
                maxHeight: 644,
                borderRadius: 4,
                border: '1px solid var(--border)',
                display: 'block',
                margin: '0 auto',
              }}
              priority
            />
          </m.div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.08em',
            }}
          >
            Scroll to explore
          </span>
          <m.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} color="var(--muted)" />
          </m.div>
        </m.div>
      </div>

      {/* ── SECTION 01: PROBLEM ──────────────────────────────────────────────── */}
      <section id="problem" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="01" title="Problem Framing" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              Modern households prefer digital payments for shopping and managing allowances. A practical way to do this is by assigning supplementary cards linked to the primary account.
            </BodyText>
          </ScrollReveal>

          {/* Two blocks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16,
              marginBottom: 48,
            }}
          >
            <ScrollReveal delay={0.1}>
              <Card>
                <MonoLabel>Challenge</MonoLabel>
                <BodyText>
                  Giving digital allowances lacks control and transparency. Existing flows for supplementary cards are often complex. KYC of all members is time-consuming if users go for a full account. Very little customisation means users feel disconnected from their cards, resulting in low adoption.
                </BodyText>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Card>
                <MonoLabel>Problem Statement</MonoLabel>
                <BodyText>
                  Enable prime users to easily set up and manage supplementary cards with spending controls, all within the same app. Ensuring they feel confident, secure, and in control.
                </BodyText>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
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
              The goal was not just to add a feature. It was to make a family feel like a unit inside a banking app.
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 02: USERS ─────────────────────────────────────────────────── */}
      <section id="users" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="02" title="Users and Personas" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              Two distinct users with different needs, different mental models, and different levels of control. The design had to work for both.
            </BodyText>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* Persona 1 */}
            <ScrollReveal delay={0.1}>
              <Card>
                {/* Avatar */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a2744, #0d1833)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '14px',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    AG
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 500,
                    color: 'var(--text)',
                    margin: '0 0 4px',
                  }}
                >
                  Akash Gupta, 36
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    color: 'var(--muted)',
                    margin: '0 0 20px',
                  }}
                >
                  Marketing Manager · Prime Account Holder
                </p>
                <MonoLabel>Goals</MonoLabel>
                <ul style={{ margin: '0 0 16px', padding: '0 0 0 16px' }}>
                  {['Digitally manage allowances', 'Set limits and monitor spends', 'Ensure secure usage'].map((g) => (
                    <li key={g} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{g}</li>
                  ))}
                </ul>
                <MonoLabel>Frustrations</MonoLabel>
                <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                  {['No quick control options', 'Hard to track spends in real-time', 'App flow feels complex'].map((f) => (
                    <li key={f} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{f}</li>
                  ))}
                </ul>
              </Card>
            </ScrollReveal>

            {/* Persona 2 */}
            <ScrollReveal delay={0.2}>
              <Card>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2d1a44, #1a0d33)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '14px',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    PS
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 500,
                    color: 'var(--text)',
                    margin: '0 0 4px',
                  }}
                >
                  Priya Sinha, 20
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    color: 'var(--muted)',
                    margin: '0 0 20px',
                  }}
                >
                  College Student · Supplementary Cardholder
                </p>
                <MonoLabel>Goals</MonoLabel>
                <ul style={{ margin: '0 0 16px', padding: '0 0 0 16px' }}>
                  {['Spend easily for daily needs', 'Know balance and limits quickly', 'Use app with minimal effort'].map((g) => (
                    <li key={g} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{g}</li>
                  ))}
                </ul>
                <MonoLabel>Frustrations</MonoLabel>
                <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                  {['Declines without clarity', 'Too many restrictions', 'Confusing app navigation'].map((f) => (
                    <li key={f} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{f}</li>
                  ))}
                </ul>
              </Card>
            </ScrollReveal>
          </div>

          {/* Context note */}
          <ScrollReveal delay={0.15}>
            <div
              style={{
                background: 'var(--bg-card)',
                borderLeft: '3px solid var(--accent)',
                padding: '16px 20px',
                borderRadius: '0 4px 4px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted)',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Prime user: someone with a bank account and proper KYC complete. Secondary user: a family member who may or may not have an account at that bank, for example children over 18, spouse, or parents.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 03: RESEARCH ──────────────────────────────────────────────── */}
      <section id="research" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="03" title="Competitive Research" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              I looked at both banking and non-banking apps to understand the family addition flow better.
            </BodyText>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            <ScrollReveal delay={0.1}>
              <Card>
                <MonoLabel>Banking Apps: HDFC, BOB and Fintechs</MonoLabel>
                <BodyText>
                  They provide an option to add supplementary cards but as requests to be submitted, not in-app. Debit card visualisation is not very intuitive. Navigation in HDFC is particularly complex. Fintech apps are more intuitive but are mostly built for credit use cases.
                </BodyText>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Card>
                <MonoLabel>Netflix, YouTube</MonoLabel>
                <BodyText>
                  Allow adding family members with controls like kids profiles, avatar addition, content settings, and preferences. The experience is more holistic. These platforms treat family management as a core feature, not an afterthought.
                </BodyText>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <blockquote
              style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: 24,
                margin: 0,
                fontFamily: 'var(--font-display, serif)',
                fontStyle: 'italic',
                fontSize: 'var(--text-base)',
                color: 'var(--text)',
                lineHeight: 1.6,
              }}
            >
              The benchmark for family management is not other banks. It is the apps families actually use every day.
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 04: CONSTRAINTS ───────────────────────────────────────────── */}
      <section id="constraints" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="04" title="Constraints and Regulations" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              In banking, rules are strict. Nothing can be assumed. Every design decision had to comply with existing regulations.
            </BodyText>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {[
              {
                num: '01',
                title: 'KYC Requirement',
                body: 'Mandatory for the primary cardholder. Supplementary holders only need basic information. The primary user bears all liability for supplementary card transactions.',
              },
              {
                num: '02',
                title: 'Card Regulations',
                body: 'Cards can have custom visuals. Orientation can be changed but must contain the chip. Size and corner radius are fixed per ISO/IEC 7810 ID-1 format.',
              },
              {
                num: '03',
                title: 'Age Restrictions',
                body: 'Some banks require a minimum age of 15 or 16. Others restrict to adults only. No credit history is built for supplementary cardholders.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 0.1}>
                <Card style={{ padding: 20, height: '100%' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                    }}
                  >
                    {item.num}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '8px 0',
                    }}
                  >
                    {item.title}
                  </p>
                  <BodyText style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    {item.body}
                  </BodyText>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 05: PRINCIPLES ────────────────────────────────────────────── */}
      <section id="principles" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="05" title="UX Principles" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              Four principles guided every design decision from the first sketch to the final screen.
            </BodyText>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16,
            }}
          >
            {[
              {
                num: '01',
                title: 'Control Without Complexity',
                body: 'Users should feel in charge but not overwhelmed with decisions. Power should be accessible, not visible at all times.',
              },
              {
                num: '02',
                title: 'Visibility Equals Trust',
                body: 'Always show where the money is going, who is using it, and what is left. Transparency is the foundation of trust in financial products.',
              },
              {
                num: '03',
                title: 'Personal, Not Just Functional',
                body: 'Each card is tied to a person, not a category. The UX should reflect that emotionally and visually through customisation.',
              },
              {
                num: '04',
                title: 'Progressive Disclosure',
                body: 'Only show complexity when needed. Keep the first-time experience clean, contextual, and fast.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 0.08}>
                <Card style={{ padding: 20, height: '100%' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                    }}
                  >
                    {item.num}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '8px 0',
                    }}
                  >
                    {item.title}
                  </p>
                  <BodyText style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    {item.body}
                  </BodyText>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06: FLOWS ─────────────────────────────────────────────────── */}
      <section id="flows" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="06" title="Journey Flows" />
          </ScrollReveal>

          {/* Flow A */}
          <ScrollReveal delay={0.1}>
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Supplementary Card Addition Flow
              </span>
              <ImageLightbox
                src="/work/smart-cards/flowchart-card-addition.png"
                alt="Supplementary card addition flow"
                width={760}
                height={480}
                caption="Primary card addition flow"
              />
            </div>
          </ScrollReveal>

          {/* Flow B */}
          <ScrollReveal delay={0.1}>
            <div style={{ marginTop: 40 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Alternate Flow for Family Member Addition
              </span>
              <ImageLightbox
                src="/work/smart-cards/flowechart-family-member.png"
                alt="Alternate family member addition flow"
                width={760}
                height={480}
                caption="Alternate family member addition"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 07: LO-FI ─────────────────────────────────────────────────── */}
      <section id="lofi" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="07" title="Lo-fi Screens" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              Eight screens exploring the core flows before moving to high fidelity.
            </BodyText>
          </ScrollReveal>

          {/* Group A */}
          <ScrollReveal delay={0.1}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Home and Cards Overview
            </span>
          </ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 32,
            }}
          >
            {[
              { src: 'lofi-1.png', caption: 'Home' },
              { src: 'lofi-2.png', caption: 'Promotion popup' },
              { src: 'lofi-3.png', caption: 'Cards: My card' },
              { src: 'lofi-4.png', caption: 'Cards: Family cards' },
            ].map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 0.08}>
                <ImageLightbox
                  src={`/work/smart-cards/${img.src}`}
                  alt={img.caption}
                  width={360}
                  height={640}
                  caption={img.caption}
                />
              </ScrollReveal>
            ))}
          </div>

          {/* Group B */}
          <ScrollReveal delay={0.1}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 16,
                marginTop: 32,
              }}
            >
              Card Addition Flow
            </span>
          </ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {[
              { src: 'lofi-5.png', caption: 'Step 1: Select member' },
              { src: 'lofi-6.png', caption: 'Step 1: Add member' },
              { src: 'lofi-7.png', caption: 'Step 2: Customise card' },
              { src: 'lofi-8.png', caption: 'Step 3: Configure settings' },
            ].map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 0.08}>
                <ImageLightbox
                  src={`/work/smart-cards/${img.src}`}
                  alt={img.caption}
                  width={360}
                  height={640}
                  caption={img.caption}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 08: FINAL SCREENS ─────────────────────────────────────────── */}
      <section id="final-screens" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="08" title="Final Screens" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 48 }}>
              Six screens covering the full journey from promotional discovery to card configuration.
            </BodyText>
          </ScrollReveal>

          {[
            {
              step: 'Screen 01',
              title: 'Promotional Prompt',
              img: 'hifi-1.png',
              desc: 'A contextual prompt that surfaces for first-time users when they are not on an action screen, such as the home tab. Does not interrupt the flow.',
            },
            {
              step: 'Screen 02',
              title: 'Family Cards Overview',
              img: 'hifi-2.png',
              desc: 'Combined family cards and personal card at one place for easy management. Shows supplementary card holders, quick actions, and spend monitoring. The prime card does not show supplementary holder details.',
            },
            {
              step: 'Screen 03',
              title: 'Step 1: Select Member',
              img: 'hifi-3.png',
              desc: 'Allows selection of already-added members with support for multiple selection. If a member is not yet added, this can be done directly without breaking the flow.',
            },
            {
              step: 'Screen 04',
              title: 'Step 1: Add Member',
              img: 'hifi-4.png',
              desc: 'Collects only the basic information required for a supplementary cardholder per regulations. Mobile verification included for secondary card holder login.',
            },
            {
              step: 'Screen 05',
              title: 'Step 2: Customise Card',
              img: 'hifi-5.png',
              desc: 'An avatar or picture can be added to give a personalised touch. This visual also shows up for the supplementary card holder in their app view.',
            },
            {
              step: 'Screen 06',
              title: 'Step 3: Configure Settings',
              img: 'hifi-6.png',
              desc: 'Predefined templates for roles like Spouse, Parents, or Child. Optional to select. Options are grouped so they do not feel overwhelming. Easy selection with better visibility.',
            },
          ].map((screen, i) => (
            <div key={screen.step}>
              <ScrollReveal delay={i * 0.1}>
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '10px',
                      color: 'var(--accent)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {screen.step}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      margin: '0 0 24px',
                    }}
                  >
                    {screen.title}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ width: isMobile ? 260 : 320 }}>
                      <ImageLightbox
                        src={`/work/smart-cards/${screen.img}`}
                        alt={screen.title}
                        width={320}
                        height={640}
                      />
                    </div>
                  </div>
                  <BodyText style={{ maxWidth: 560, margin: '0 auto' }}>
                    {screen.desc}
                  </BodyText>
                </div>
              </ScrollReveal>
              {i < 5 && <Connector />}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 09: EDGE CASES ────────────────────────────────────────────── */}
      <section id="edge-cases" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="09" title="Edge Cases" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <BodyText style={{ marginBottom: 40 }}>
              The scenarios that separate a good product from a great one.
            </BodyText>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                num: '01',
                body: 'Family member with an active card is deleted. Should not be allowed without explicit confirmation first.',
              },
              {
                num: '02',
                body: 'Card used for a restricted category. Instead of a silent failure, the prime user gets a notification and can approve the transaction.',
              },
              {
                num: '03',
                body: 'Maximum member limit reached. A clear empty or limit state shown when no more cards can be assigned.',
              },
              {
                num: '04',
                body: 'Supplementary cardholder app experience. No edit options available. Tracking features only, so they can monitor spends and limits without controlling them.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 0.1}>
                <Card style={{ padding: 20 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      marginBottom: 8,
                    }}
                  >
                    {item.num}
                  </span>
                  <BodyText>{item.body}</BodyText>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: REFLECTION ────────────────────────────────────────────── */}
      <section id="reflection" style={sectionStyle}>
        <div style={contentStyle}>
          <ScrollReveal>
            <SectionHeading num="10" title="Reflection" />
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              'UI could be improved with more focus on individual components and polish given additional time.',
              'Screens for all edge cases can and should be designed before handoff.',
              'Supplementary user flows deserve their own dedicated design pass.',
              'User testing would validate whether the design solves the actual problems or just the assumed ones.',
            ].map((text, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <BodyText>{text}</BodyText>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM NAVIGATION ─────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '48px 0',
        }}
      >
        <div
          style={{
            ...contentStyle,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
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
            {'← Back to Work'}
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
            {'Next Case Study: Modernising Data Visualisation →'}
          </Link>
        </div>
      </div>

    </LazyMotion>
  )
}
