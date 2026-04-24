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
  { id: 'context',    num: '01', label: 'Context' },
  { id: 'discovery',  num: '02', label: 'Discovery' },
  { id: 'define',     num: '03', label: 'Define' },
  { id: 'design',     num: '04', label: 'Design' },
  { id: 'solution',   num: '05', label: 'Solution' },
  { id: 'validation', num: '06', label: 'Craft' },
]

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SectionHeading({
  num,
  title,
  subtitle,
}: {
  num: string
  title: string
  subtitle?: string
}) {
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
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 'var(--text-base)',
            color: 'var(--muted)',
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </span>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Customer360() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [navVisible, setNavVisible] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [activeSection, setActiveSection] = useState('context')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Fade nav in after hero scrolls out
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

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Show left nav only on wide viewports
  useEffect(() => {
    const check = () => {
      setShowNav(window.innerWidth > 1100)
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Mobile scroll progress bar
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

      {/* Mobile progress bar */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: 'var(--border)',
          zIndex: 100,
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
            padding: '40px 40px 0',
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
                marginBottom: 16,
              }}
            >
              Case Study 02
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: 24,
              }}
            >
              Customer 360
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-lg)',
                color: 'var(--muted)',
                maxWidth: 600,
                lineHeight: 1.6,
                margin: '0 auto 48px',
              }}
            >
              Worked on LeadSquared&apos;s unified customer view from 0 to 1, for the agent who needs answers before the customer finishes speaking.
            </p>

            {/* Meta strip */}
            <div
              style={isMobile ? {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: 64,
                marginTop: 32,
                textAlign: 'left',
              } : {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 0,
                marginBottom: 64,
              }}
            >
              {[
                { label: 'Role',     value: 'Product Designer' },
                { label: 'Team',     value: '1 PM · 1 Designer · Dev Team' },
                { label: 'Timeline', value: '~ 2–3 Months' },
                { label: 'Company',  value: 'LeadSquared' },
              ].map((item, i) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                  {!isMobile && i > 0 && (
                    <div
                      style={{
                        width: 1,
                        height: 32,
                        backgroundColor: 'var(--border)',
                        margin: '0 24px',
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '10px',
                        color: 'var(--muted)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-sans, sans-serif)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text)',
                        fontWeight: 500,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </m.div>

          {/* Hero image */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
            style={{
              width: '100%',
              maxWidth: 960,
              borderRadius: 4,
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/work/customer-360-new/hero-image.png"
              alt="Customer 360 — unified view dashboard"
              width={960}
              height={540}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </m.div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            paddingTop: 32,
            paddingBottom: 40,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}
          >
            Scroll to explore
          </span>
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} color="var(--muted)" />
          </m.div>
        </m.div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', backgroundColor: 'var(--bg)' }}>

        {/* Sticky left nav — wide viewports only */}
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
            Customer 360
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
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      flexShrink: 0,
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

        {/* Content */}
        <div
          style={{ maxWidth: 760, margin: '0 auto', padding: '0 40px', width: '100%' }}
        >

          {/* ── 01 CONTEXT ─────────────────────────────────────────────── */}
          <section
            id="context"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="01" title="Context" />
            </ScrollReveal>

            {/* Where this started */}
            <ScrollReveal delay={0.1}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 4, marginBottom: 12 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 16 }}>
                    Where this started
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 14 }}>
                    About six months into designing LeadSquared&apos;s ticketing tool, I spent a lot of time understanding how support agents actually work.
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 14 }}>
                    One thing kept coming up: <strong style={{ color: 'var(--text)' }}>The ticket showed the issue, but not the customer.</strong>
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 14 }}>
                    Agents had to keep leaving the ticket to understand context, history, or past interactions. It slowed them down and broke their flow.
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7 }}>
                    That&apos;s where Customer 360 started — as a response to a pattern we kept seeing in real workflows.
                  </p>
                </div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 16 }}>
                    Business context
                  </p>
                  <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
                    {[
                      'Customers used tools like Freshdesk, Zendesk, or Zoho separately for support',
                      'LeadSquared was already strong on the sales CRM side',
                      'The data existed — it just wasn\'t usable in one place',
                    ].map((point) => (
                      <li key={point} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 12 }}>
                    Opportunity
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7 }}>
                    Bring customer context into the agent workflow, and extend LeadSquared into service in a natural way.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* The person at the centre */}
            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-xl)', color: 'var(--text)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: 56, marginBottom: 12 }}>
                The person at the centre of it
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Before jumping into solutions, we wanted to clearly understand who we were designing for and what a bad resolution actually feels like.
              </p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 4, padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Image src="/work/customer-360-new/radhika.svg" alt="Priya" width={64} height={64} style={{ borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>Priya<span style={{ color: 'var(--muted)', fontWeight: 400 }}>, 29</span></p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 16 }}>Support Agent, Bangalore, BFSI.</p>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>It&apos;s 11:20 AM.</p>
                  <ol style={{ paddingLeft: 20 }}>
                    {[
                      'A customer has been on hold for four minutes.',
                      'He applied for a loan 12 days ago and hasn\'t heard back.',
                      'Priya has five tabs open: CRM, Freshdesk, loan portal, WhatsApp, a tracking sheet.',
                      'She\'s typing the same question into multiple systems.',
                      'The customer is still waiting.',
                    ].map((point, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 4 }}>
                        {point}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                This wasn&apos;t a technology failure. The data existed.{' '}
                <strong style={{ color: 'var(--text)' }}>It was a visibility and speed problem,</strong>{' '}
                happening 40 to 60 times a day, per agent, across a 35-person team. The tools treated the ticket as the whole story.{' '}
                <strong style={{ color: 'var(--text)' }}>The customer was the story.</strong>{' '}
                The ticket was just one chapter.
              </p>
            </ScrollReveal>

            {/* Shift cards */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { from: 'Monitoring tickets',  to: 'Anticipating customer needs' },
                  { from: 'Data visibility',      to: 'Decision support at the moment of resolution' },
                  { from: 'Reactive resolution',  to: 'Prepared before the first word' },
                ].map((shift) => (
                  <div key={shift.from} style={{ border: '1px solid var(--border)', borderRadius: 4, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Shift</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 20, lineHeight: 1.5 }}>{shift.from}</p>
                    <span style={{ color: 'var(--accent)', fontSize: 20, lineHeight: 1, marginBottom: 20 }}>↓</span>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, lineHeight: 1.5 }}>{shift.to}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* ── 02 DISCOVERY ───────────────────────────────────────────── */}
          <section
            id="discovery"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="02" title="Discovery" subtitle="Primary and secondary research" />
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.1}>
              <Label>Primary Research</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                We spoke to support agents and team leads across 6 mid-sized companies, mostly in BFSI and EdTech, where LeadSquared was already being used on the sales side and teams were exploring service expansion.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 40 }}>
                {[
                  { num: '6',    label: 'Companies interviewed across BFSI and EdTech sectors' },
                  { num: '4.2',  label: 'Average tools open per agent during a single ticket resolution' },
                  { num: '2 min', label: 'Spent reconstructing context before any meaningful response' },
                ].map((stat, i) => (
                  <div key={stat.num} style={{ padding: '20px 24px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '28px', color: 'var(--accent)', fontWeight: 500, marginBottom: 8, letterSpacing: '-0.02em' }}>{stat.num}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Interview Q&As */}
            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 8 }}>
                Interview questions and what we heard
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                The aim was to understand the workflow end to end.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                {[
                  {
                    q: 'Walk me through what you do from the moment a ticket comes in to the moment it\'s closed.',
                    bfsi: 'Identify the customer, verify account, check product holdings, look for prior tickets then respond. That\'s 3 to 5 tool switches before a single word is said to the customer.',
                    edtech: 'Students contact support across email, chat, and calls for the same issue. Agents had no way to see that history without manually searching. Every ticket started from scratch.',
                  },
                  {
                    q: 'What information do you look for most often that takes too long to find?',
                    bfsi: 'Loan application stage, EMI status, KYC completion — the three most frequently cited pieces of information agents had to leave the ticket tool to find.',
                    edtech: 'Course enrollment status, batch details, fee receipts, and whether a previous support promise had been made and not honoured.',
                  },
                  {
                    q: 'What makes a ticket harder to resolve than it should be?',
                    bfsi: 'Fragmented tools, no visible customer history, and no direct action path. Knowing what to do but having to navigate away to do it was the biggest time sink.',
                    edtech: 'Repeated contacts from the same student with no way to track what was already promised. Agents over-apologised because they had no continuity.',
                  },
                  {
                    q: 'What does a really good resolution feel like compared to a bad one?',
                    both: 'Agents consistently described good resolutions as ones where they felt prepared before the conversation. When an agent could say "I can see your loan application is in the verification stage" before the customer had to explain anything, the customer\'s tone changed immediately. Bad resolutions happened when agents were visibly searching. Customers could hear it.',
                  },
                  {
                    q: 'Which tools do you use today, and what\'s the best and worst thing about them?',
                    bfsi: 'Freshdesk for tickets, LeadSquared CRM for customer info, separate portal for product data. Best: each tool works for its job. Worst: they don\'t talk to each other.',
                    edtech: 'Zendesk and the LMS separately. Agents switched tabs constantly. The CRM had customer data but wasn\'t visible during a ticket. They wanted everything in one place, not one more tab.',
                  },
                ].map((qa, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '20px 24px', borderRadius: 4 }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', fontWeight: 500, marginBottom: 16 }}>
                      Q. {qa.q}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: qa.both ? '1fr' : '1fr 1fr', gap: 16 }}>
                      {qa.both ? (
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Both</p>
                          <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{qa.both}</p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>BFSI</p>
                            <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{qa.bfsi}</p>
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>EdTech</p>
                            <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{qa.edtech}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 48 }}>
                <strong style={{ color: 'var(--text)', fontStyle: 'normal' }}>Workarounds at this scale:</strong>{' '}
                sticky notes on monitors, WhatsApp groups with team leads, personal escalation spreadsheets — to try to do just the basics of their jobs.
              </p>
            </ScrollReveal>

            {/* Competitor analysis */}
            <ScrollReveal delay={0.1}>
              <Label>Secondary Research — Competitor Analysis</Label>
              <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-card)' }}>
                      {['Tool', 'Strength', 'Gap'].map((col) => (
                        <th
                          key={col}
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '10px',
                            color: 'var(--accent)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '12px 16px',
                            textAlign: 'left',
                            borderBottom: '1px solid var(--border)',
                            fontWeight: 400,
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Salesforce Service Cloud', 'Comprehensive, deeply configurable, rich ecosystem',      'Requires dedicated admin; days to configure per use case'],
                      ['Microsoft Dynamics 365',   'Enterprise-grade, native M365 integration',              'Not viable without IT team involvement'],
                      ['Freshdesk',                'Easy onboarding, solid ticket management',               'Shallow customer context; limited view configurability'],
                      ['Zendesk',                  'Strong omnichannel support',                             'Customer profile depth limited without expensive add-ons'],
                      ['Customer 360 (LSQ)',        'Built on existing CRM data, no new integration layer needed', 'Deliberate constraint: configure in under 2 hours, no engineering required'],
                    ].map(([name, strength, gap], i) => (
                      <tr key={name} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-card)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{name}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', borderRight: '1px solid var(--border)' }}>{strength}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>{gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </section>

          {/* ── 03 DEFINE ──────────────────────────────────────────────── */}
          <section
            id="define"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="03" title="Define" subtitle="Who we were designing for" />
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
                Two distinct user types emerged, each with a different relationship to the product and different definitions of success.
              </p>
            </ScrollReveal>

            {/* Personas */}
            <div className="grid md:grid-cols-2" style={{ gap: 16, marginBottom: 64 }}>
              {[
                {
                  name: 'Radhika',
                  meta: '35 · Technical Support Specialist',
                  points: [
                    'Switches between 4+ applications to resolve a single query',
                    'System lag during peak hours adds anxiety to every interaction',
                    'Identifying and verifying the customer delays first response',
                    'No contextual help when stuck on an unusual ticket type',
                  ],
                },
                {
                  name: 'Aman',
                  meta: '37 · IT Admin / Service Configurator',
                  points: [
                    'Every configuration change requires back-and-forth with the service provider',
                    'Documentation is rarely available or current',
                    'No way to preview what agents see before publishing a layout',
                    'Integration updates risk breaking something without warning',
                  ],
                },
              ].map((persona, i) => (
                <ScrollReveal key={persona.name} delay={i * 0.15}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 24 }}>
                    <Image
                      src={persona.name === 'Aman' ? '/work/customer-360-new/aman.svg' : '/work/customer-360-new/radhika.svg'}
                      alt={persona.name}
                      width={48}
                      height={48}
                      style={{ borderRadius: '50%', marginBottom: 16 }}
                    />
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 4 }}>
                      {persona.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', marginBottom: 20 }}>
                      {persona.meta}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {persona.points.map((pt) => (
                        <div key={pt} style={{ display: 'flex', gap: 8 }}>
                          <span style={{ color: 'var(--accent)', flexShrink: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', lineHeight: '1.6' }}>—</span>
                          <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{pt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* From insight to widget */}
            <ScrollReveal delay={0.1}>
              <Label>From Insight to Widget</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
                After interviews, we had a lot of raw observations. The goal wasn&apos;t to list them — it was to translate each one into a clear product decision. Every widget needed to solve something real.
              </p>
            </ScrollReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 48 }}>
              {[
                { quote: '"I have to verify who the customer is before I can say anything useful. That alone takes a minute."', widget: 'Customer Info', img: '/work/customer-360-new/customer-info.png', alt: 'Customer Info widget' },
                { quote: '"I need to know if someone else already called them. Otherwise I\'m starting from 0 again."', widget: 'All Interactions', img: '/work/customer-360-new/all-interactions.png', alt: 'All Interactions widget' },
                { quote: '"The customer\'s product list and status — that\'s what every loan query comes down to."', widget: 'Products Purchased', img: '/work/customer-360-new/products-purchased.png', alt: 'Products Purchased widget' },
                { quote: '"Sometimes I can see there\'s an upsell opportunity but no way to flag it or act on it in the moment."', widget: 'Opportunity', img: '/work/customer-360-new/opportunity.png', alt: 'Opportunity widget' },
                { quote: '"I need to log the ticket, send a follow-up, escalate — all without leaving the customer\'s view."', widget: 'Actions', img: '/work/customer-360-new/actions.png', alt: 'Actions widget' },
                { quote: '"I want to see everything: past tickets, open issues, what was promised last time."', widget: 'All Tickets', img: '/work/customer-360-new/all-tickets.png', alt: 'All Tickets widget' },
              ].map((item, i) => (
                <ScrollReveal key={item.widget} delay={i * 0.05}>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                      <Image
                        src={item.img}
                        alt={item.alt}
                        width={400}
                        height={240}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                      <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{item.widget}</p>
                      <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic' }}>{item.quote}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Phase 1 scope */}
            <ScrollReveal delay={0.1}>
              <Label>Phase 1 Scope</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
                {[
                  { text: 'Does an agent need this to', bold: 'resolve a ticket faster?' },
                  { text: 'Can an admin configure this', bold: 'without engineering support?' },
                  { text: 'Does this work with', bold: 'data LeadSquared already holds?' },
                ].map((q, i) => (
                  <div key={i} style={{ padding: '16px 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {q.text} <strong style={{ color: 'var(--text)' }}>{q.bold}</strong>
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>
                Some features which were good but failed impact effort analysis were to be picked in phase 2:
              </p>
              <ul style={{ paddingLeft: 20, listStyleType: 'disc' }}>
                {['AI-Suggested Layouts', 'Cross-Sell Nudges', 'Omnichannel Interaction History', 'Export to PDF'].map((f) => (
                  <li key={f} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.8 }}>{f}</li>
                ))}
              </ul>
            </ScrollReveal>
          </section>

          {/* ── 04 DESIGN ──────────────────────────────────────────────── */}
          <section
            id="design"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="04" title="Design" subtitle="How the design actually moved" />
            </ScrollReveal>

            {/* Process steps */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 64 }}>
                {[
                  { num: '1', title: 'Observation from ticketing tool', desc: 'Foundation' },
                  { num: '2', title: 'Stakeholder framing',             desc: 'PM + Director' },
                  { num: '3', title: 'User interviews',                  desc: 'Companies' },
                  { num: '4', title: 'Synthesis + widget mapping',       desc: 'Insight → Feature' },
                  { num: '5', title: 'Entry point decision',             desc: 'First design call' },
                  { num: '6', title: 'Low-fi explorations',              desc: '4 hypotheses' },
                  { num: '7', title: 'Hi-fi + heuristic + handover',     desc: 'Delivery' },
                ].map((step) => (
                  <div key={step.num} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 12 }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '28px', color: 'var(--accent)', fontWeight: 300, lineHeight: 1.1, marginBottom: 8 }}>{step.num}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4, marginBottom: 4 }}>{step.title}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '11px', color: 'var(--muted)' }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Lo-fi sketches */}
            <ScrollReveal delay={0.1}>
              <Label>Design Exploration</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>
                Designs had to be made considering the agent works in a high pressure environment and on machines that are not very powerful.
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                Some trials and sketches made at that time:
              </p>
              <div style={{ marginBottom: 12 }}>
                <ImageLightbox
                  src="/work/customer-360-new/lofi-sketch.png"
                  alt="Lo-fi sketches and early explorations"
                  width={800}
                  height={300}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginBottom: 48 }}>
                Early lo-fi sketches
              </p>
            </ScrollReveal>

            {/* Entry point decision */}
            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-lg)', color: 'var(--text)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 8 }}>
                The entry point decision
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
                One of the important decisions was to decide the entry point to Customer 360.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                {[
                  { status: 'Rejected', statusColor: '#ef4444', title: 'Separate navigation item', desc: 'A separate icon in the navigation bar along with ticket, settings etc on left panel. The same fragmentation the product was trying to solve.' },
                  { status: 'Rejected', statusColor: '#ef4444', title: 'Embedded panel inside ticket', desc: 'Add a tab inside ticket detail page for customer 360. More information piled onto an already dense screen.' },
                  { status: 'Chosen',   statusColor: '#22c55e', title: 'Linked companion view via ticket', desc: 'Dedicated page launched from a persistent CTA at the top of the ticket. Clear path back. The switch was intentional. Customer 360 got its own breathing room.', highlight: true },
                ].map((option, i) => (
                  <div
                    key={option.title}
                    style={{
                      padding: '20px 24px',
                      borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                      borderTop: option.highlight ? `2px solid ${option.statusColor}` : 'none',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: option.statusColor, marginBottom: 8 }}>{option.status}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, marginBottom: 12, lineHeight: 1.4 }}>{option.title}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>{option.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Ticket detail page image */}
            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 12 }}>Ticket detail page:</p>
              <div style={{ marginBottom: 12 }}>
                <ImageLightbox
                  src="/work/customer-360-new/ticket-detail-page.png"
                  alt="Ticket detail page with Customer 360 CTA"
                  width={800}
                  height={450}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginBottom: 48 }}>
                Persistent CTA on ticket detail to launch Customer 360
              </p>
            </ScrollReveal>

            {/* Layout explorations */}
            <ScrollReveal delay={0.1}>
              <Label>Layout Explorations</Label>
            </ScrollReveal>
            {[
              {
                title: 'The Uniform Grid',
                status: 'Rejected',
                statusColor: '#ef4444',
                hypothesis: 'If every widget is the same size, agents can scan without learning a layout.',
                why: 'Agents didn\'t scan equally. BFSI agents needed product holdings and account tier first. EdTech needed enrollment status. Equal prominence forced search.',
                img: '/work/customer-360-new/uniform-grid.png',
                alt: 'Uniform grid layout exploration',
              },
              {
                title: 'Fixed Industry Templates',
                status: 'Rejected',
                statusColor: '#ef4444',
                hypothesis: 'If we pre-define the optimal layout per industry, agents never think about configuration.',
                why: 'Broke down for edge cases. A BFSI agent handling a complaint needed a different hierarchy than one handling a loan query. Fixed templates felt imposed.',
                img: '/work/customer-360-new/fixed-industry-template.png',
                alt: 'Fixed industry template layout',
              },
              {
                title: 'Configurable Canvas with Runtime Layout Switching',
                status: 'Chosen',
                statusColor: '#22c55e',
                hypothesis: 'If the admin defines the information hierarchy per use case, and agents switch between layouts at runtime, the layout does the cognitive work so the agent doesn\'t have to.',
                why: null,
                img: '/work/customer-360-new/runtime-layout-switching.png',
                alt: 'Configurable canvas with runtime layout switching',
              },
            ].map((exploration) => (
              <ScrollReveal key={exploration.title} delay={0.1}>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500 }}>{exploration.title}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: exploration.statusColor }}>{exploration.status}</p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 8 }}>
                    {exploration.hypothesis}
                  </p>
                  {exploration.why && (
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
                      <strong style={{ color: 'var(--text)' }}>Why failed:</strong> {exploration.why}
                    </p>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <ImageLightbox src={exploration.img} alt={exploration.alt} width={800} height={450} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </section>

          {/* ── 05 SOLUTION ────────────────────────────────────────────── */}
          <section
            id="solution"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="05" title="Solution" subtitle="One for the agent resolving in real time. One for the admin configuring once for many." />
            </ScrollReveal>

            {/* Agent side */}
            <ScrollReveal delay={0.1}>
              <Label>Agent Side — Customer 360 View</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                The layout the agent sees is entirely determined by the admin&apos;s configuration. Widget hierarchy, actions, and content reflect the ticket type. Agents switch layouts at runtime without touching admin settings.
              </p>
              <div style={{ marginBottom: 12 }}>
                <ImageLightbox
                  src="/work/customer-360-new/customer-360-final.png"
                  alt="Customer 360 final agent view"
                  width={960}
                  height={540}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginBottom: 56 }}>
                Final agent-side Customer 360 view
              </p>
            </ScrollReveal>

            {/* UI explorations V1–V5 */}
            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', fontWeight: 500, marginBottom: 24 }}>
                Some of the UI explorations that led to final design:
              </p>
            </ScrollReveal>
            {['v1', 'v2', 'v3', 'v4', 'v5'].map((v, i) => (
              <ScrollReveal key={v} delay={0.1}>
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
                    {i < 4 ? `V-${i + 1}` : 'Final'}
                  </p>
                  <ImageLightbox
                    src={`/work/customer-360-new/${v}.png`}
                    alt={`Customer 360 UI exploration ${i < 4 ? `V-${i + 1}` : 'final'}`}
                    width={760}
                    height={440}
                  />
                </div>
              </ScrollReveal>
            ))}

            {/* Admin side */}
            <ScrollReveal delay={0.1}>
              <div style={{ marginTop: 32 }}>
                <Label>Admin Side — 3-Step Configurator</Label>
                <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {[
                    { step: 'Step 1', title: 'Configure Widgets',    desc: 'Depends on the admin to keep or remove elements of a widget based on their use case.' },
                    { step: 'Step 2', title: 'Configure Layouts',    desc: 'Arrange selected widgets into a layout, define hierarchy, set default view per ticket type.' },
                    { step: 'Step 3', title: 'Connect Data Sources', desc: 'Link external data sources to populate widget content — no engineering required.' },
                  ].map((s, i) => (
                    <div key={s.step} style={{ padding: '20px 24px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{s.step}</p>
                      <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, marginBottom: 8 }}>{s.title}</p>
                      <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {[
              { label: 'Widget Listing',        src: '/work/customer-360-new/widget-listing.png',        alt: 'Widget listing view',                    desc: 'All available widgets browsable and selectable for layout configuration.' },
              { label: 'Widget Configuration',  src: '/work/customer-360-new/widget-configuration.png',  alt: 'Widget configuration panel',             desc: 'Detailed configuration options per widget type — toggle fields on/off, reorder, rename.' },
              { label: 'Layout Tab',            src: '/work/customer-360-new/layout-tab.png',            alt: 'Layout tab — admin view',                desc: 'Admin-side layout listing with all configured views and their assigned ticket types.' },
              { label: 'Layout Configuration',  src: '/work/customer-360-new/layout-configuration.png',  alt: 'Layout configuration — 3-step admin process', desc: '3-step admin process to configure layouts per industry — BFSI, EdTech, Fintech.' },
              { label: 'Data Source Tab',       src: '/work/customer-360-new/data-source-tab.png',       alt: 'Data source configuration',              desc: 'Connecting external data sources to populate the unified view — no engineering required.' },
            ].map((block) => (
              <ScrollReveal key={block.label} delay={0.1}>
                <div style={{ marginBottom: 48 }}>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {block.label}
                  </p>
                  <div style={{ marginBottom: 12 }}>
                    <ImageLightbox src={block.src} alt={block.alt} width={800} height={450} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
                    {block.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </section>

          {/* ── 06 CRAFT ──────────────────────────────────────────────── */}
          <section
            id="validation"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="06" title="Craft" subtitle="Edge cases, errors, and the details that make it trustworthy" />
            </ScrollReveal>

            {/* Heuristic evaluation */}
            <ScrollReveal delay={0.1}>
              <Label>Heuristic Evaluation</Label>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12, marginBottom: 48 }}>
              {[
                { title: 'User Education',       desc: 'Informing users about system state instead of leaving them confused — confirmations, error messages with clear actions.' },
                { title: 'Consistency',          desc: 'Standards maintained across all flows and states throughout the platform.' },
                { title: 'Error Prevention',     desc: 'Clear recovery paths when errors occur — skeletal loaders for loading states, cancellation flows.' },
                { title: 'Help & Documentation', desc: 'Contextual support throughout, reducing time-to-resolve for new admins and agents.' },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 24 }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>{item.title}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Error illustrations */}
            <ScrollReveal delay={0.1}>
              <div style={{ marginBottom: 12 }}>
                <ImageLightbox
                  src="/work/customer-360-new/error-illustrations.png"
                  alt="Error state illustrations"
                  width={800}
                  height={400}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginBottom: 32 }}>
                Error state illustrations
              </p>
            </ScrollReveal>

            {/* Error screens + Skeletal loaders pair */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
                {[
                  { src: '/work/customer-360-new/error-screens.png',    alt: 'Error states',     caption: 'Error States' },
                  { src: '/work/customer-360-new/skeletal-loaders.png', alt: 'Skeletal loaders', caption: 'Skeletal Loaders' },
                ].map((img) => (
                  <div key={img.caption} style={{ flex: '1 1 48%', minWidth: 0 }}>
                    <div style={{ marginBottom: 8 }}>
                      <ImageLightbox src={img.src} alt={img.alt} width={400} height={250} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>{img.caption}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Testing */}
            <ScrollReveal delay={0.1}>
              <Label>Testing Approach</Label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['Microsoft Clarity', 'Pendo'].map((tool) => (
                  <span
                    key={tool}
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: '12px',
                      color: 'var(--text)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 20,
                      padding: '4px 12px',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', lineHeight: 1.8 }}>
                Data-driven testing via Microsoft Clarity provided heatmaps and session recordings to understand real agent behaviour post-launch. Pendo enabled in-app guides and A/B testing in focus groups, helping iterate on the configuration flow for admins.
              </p>
            </ScrollReveal>
          </section>

          {/* ── BOTTOM NAV ──────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border)',
              paddingTop: 48,
              paddingBottom: 48,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <Link
              href="/"
              style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              ← Back to Work
            </Link>
            <Link
              href="/work/smart-cards"
              style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Next Case Study → Smart Cards
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
