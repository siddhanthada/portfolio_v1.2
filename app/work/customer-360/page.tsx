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
  { id: 'validation', num: '06', label: 'Validation' },
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
              Case Study 04
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
              A unified customer view for service agents — built from zero at LeadSquared.
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
                { label: 'Timeline', value: '4 Months · 2023' },
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
              src="/work/customer-360/img-360-with-all-widgets.png"
              alt="Customer 360 — unified view with all widgets"
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

            <ScrollReveal delay={0.1}>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7, marginBottom: 20 }}>
                Customer 360 consolidates data from various sources into a unified view, empowering organisations to deeply understand and engage with their customers. This case study explores the design journey of creating LeadSquared&apos;s Customer 360 platform from the ground up, prioritising usability and effectiveness to drive enhanced customer relationships and business growth.
              </p>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.8 }}>
                LeadSquared has a large customer base in the sales CRM domain. To fulfil service use cases, customers had to integrate with external tools like Freshdesk, Zendesk, and Zoho — it was a natural extension to create a product used by service agents to resolve customer issues efficiently. This gave rise to Service Cloud (LeadSquared&apos;s ticketing tool) and Customer 360, a unified view of the customer to support resolution.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <blockquote
                style={{
                  margin: '48px 0',
                  paddingLeft: 24,
                  borderLeft: '3px solid var(--accent)',
                  fontFamily: 'var(--font-display, serif)',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text)',
                  lineHeight: 1.5,
                }}
              >
                &ldquo;A customisable layout which is easy to configure and provide an agent with an overview of a customer he is serving.&rdquo;
              </blockquote>
            </ScrollReveal>
          </section>

          {/* ── 02 DISCOVERY ───────────────────────────────────────────── */}
          <section
            id="discovery"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="02" title="Discovery" subtitle="Understanding the space and user needs" />
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Label>Primary Research</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7, marginBottom: 28 }}>
                Conducted user interviews with companies already using a similar product for service, or planning to integrate a service application with their CRM. The aim was to answer the 5 Ws (Who, What, When, Where, Why) and H (How).
              </p>
              <div style={{ marginBottom: 48 }}>
                {[
                  'Tell a bit about yourself and your experience with customer support.',
                  'What companies have you worked for and how does the support process differ?',
                  'What does your day-to-day work look like? What kind of tickets do you handle?',
                  'Types of support queries that you get and how does the approach to solve them change?',
                  'Which ticketing tool or 360 application are you using and which do you feel is the best and worst?',
                  'Do you try to upsell or cross-sell any product or service?',
                ].map((q, i) => (
                  <div
                    key={i}
                    style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16, marginBottom: 12 }}
                  >
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
                      Q. {q}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Label>Secondary Research</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7, marginBottom: 24 }}>
                A unified customer view is not a new product — major competitors include Salesforce, Microsoft Dynamics, SAP Customer Data Platform, and Oracle CX Unity. A focused competitor analysis helped identify gaps and opportunities.
              </p>
              <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-card)' }}>
                      {['Competitor', 'Strengths', 'Gaps'].map((col) => (
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
                      ['Salesforce',              'Deep data integration, rich ecosystem',       'Complex for smaller teams'],
                      ['Microsoft Dynamics',      'Enterprise-grade, native M365 integration',   'Heavy configuration overhead'],
                      ['SAP Customer Data Plat.', 'Real-time unified profiles',                  'Cost and complexity prohibitive'],
                      ['Oracle CX Unity',         'AI-driven insights, omnichannel',             'Steep learning curve'],
                    ].map(([name, strengths, gaps], i) => (
                      <tr key={name} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-card)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', borderRight: '1px solid var(--border)' }}>{name}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', borderRight: '1px solid var(--border)' }}>{strengths}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>{gaps}</td>
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
              <SectionHeading num="03" title="Define" subtitle="Who are we designing for" />
            </ScrollReveal>

            {/* Personas */}
            <div className="grid md:grid-cols-2" style={{ gap: 16, marginBottom: 64 }}>
              {[
                {
                  name: 'Radhika',
                  meta: '35 · Technical Support Specialist',
                  points: [
                    'Difficult to switch between applications to resolve query',
                    'System is not very responsive to handle speed',
                    'Takes time to identify customer, causing delayed resolution',
                    'No proper instructions when stuck',
                  ],
                },
                {
                  name: 'Aman',
                  meta: '37 · IT Admin',
                  points: [
                    'Configurations are not smooth and easy',
                    'Documentation is not readily available',
                    'Updates need a lot of back and forth with service provider',
                  ],
                },
              ].map((persona, i) => (
                <ScrollReveal key={persona.name} delay={i * 0.15}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 24 }}>
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

            {/* Widgets */}
            <ScrollReveal delay={0.1}>
              <Label>Insights → Widgets</Label>
            </ScrollReveal>
            <div className="grid grid-cols-2" style={{ gap: 12 }}>
              {[
                { name: 'Customer Information', desc: 'All needed info and metrics' },
                { name: 'All Interactions',     desc: 'Sales plus Service history' },
                { name: 'Products Purchased',   desc: 'Status and details' },
                { name: 'Opportunity',          desc: 'For upsell or cross sell' },
                { name: 'All Tickets',          desc: 'Past queries of the customer' },
                { name: 'Actions',              desc: 'Actions to resolve query' },
              ].map((w, i) => (
                <ScrollReveal key={w.name} delay={i * 0.08}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 20 }}>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--text)', fontWeight: 500, marginBottom: 4, letterSpacing: '-0.01em' }}>{w.name}</p>
                    <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>{w.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* ── 04 DESIGN ──────────────────────────────────────────────── */}
          <section
            id="design"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="04" title="Design" subtitle="From concept to high-fidelity" />
            </ScrollReveal>

            {/* Process steps */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 48 }}>
                {['User Flow', 'Sketching', 'Low-fi', 'Feedback', 'Approval', 'Heuristic', 'Hi-Fi', 'Design System'].map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px', color: 'var(--text)' }}>
                        {step}
                      </span>
                    </div>
                    {i < 7 && <span style={{ color: 'var(--border)', fontSize: '14px' }}>→</span>}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* illus-all */}
            <ScrollReveal delay={0.1}>
              <div style={{ marginBottom: 12 }}>
                <ImageLightbox
                  src="/work/customer-360/illus-all.png"
                  alt="Overview of all design explorations"
                  width={800}
                  height={450}
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginBottom: 48 }}>
                Overview of all design explorations
              </p>
            </ScrollReveal>

            {/* Feature prioritisation */}
            <ScrollReveal delay={0.1}>
              <Label>Feature Prioritisation</Label>
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7, marginBottom: 24 }}>
                A lot of solutions emerge in design — but working within teams means respecting timelines and tech feasibility. Using an Impact/Effort framework, features were prioritised into Must Have vs Good to Have.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                {[
                  { label: 'Must Have · Low Effort',       items: ['Layout switching', 'Customer info widget', 'All tickets widget'] },
                  { label: 'Must Have · High Effort',      items: ['Configurable widget grid', 'Industry-specific layouts', 'Data source connection'] },
                  { label: 'Good to Have · Low Effort',    items: ['Bookmarked views', 'Export to PDF'] },
                  { label: 'Good to Have · High Effort',   items: ['AI-suggested layouts', 'Cross-sell nudges'] },
                ].map((quad, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                      padding: 16,
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {quad.label}
                    </p>
                    {quad.items.map((item) => (
                      <p key={item} style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 4 }}>
                        · {item}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* ── 05 SOLUTION ────────────────────────────────────────────── */}
          <section
            id="solution"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="05" title="Solution" subtitle="A unified view, built for agents" />
            </ScrollReveal>

            {[
              { label: 'Agent Side — Customer 360',   src: '/work/customer-360/img-360-with-all-widgets.png',    alt: 'Customer 360 with all widgets',              desc: 'Based on configuration, the agent has the option to change view as per ticket type for better issue resolution.' },
              { label: 'Widget Listing',              src: '/work/customer-360/img-widget-listing.png',           alt: 'Widget listing view',                        desc: 'All available widgets browsable and selectable for layout configuration.' },
              { label: 'Widget Configuration',        src: '/work/customer-360/img-widget-configuration.png',    alt: 'Widget configuration panel',                 desc: 'Detailed configuration options per widget type.' },
              { label: 'Layout Configuration',        src: '/work/customer-360/img-layout-configuration.png',    alt: 'Layout configuration — 3-step admin process', desc: '3-step admin process to configure layouts per industry — BFSI, Edtech, Fintech.' },
              { label: 'Layout Listing',              src: '/work/customer-360/img-layout-listing.png',           alt: 'Layout listing overview',                    desc: 'Overview of all saved layouts available to the admin.' },
              { label: 'Data Source Configuration',   src: '/work/customer-360/img-configure-data-source.png',   alt: 'Configure data source',                      desc: 'Connecting data sources to populate the unified view.' },
            ].map((block) => (
              <ScrollReveal key={block.label} delay={0.1}>
                <div style={{ marginBottom: 64 }}>
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

          {/* ── 06 VALIDATION ──────────────────────────────────────────── */}
          <section
            id="validation"
            style={{ paddingTop: 120, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}
          >
            <ScrollReveal>
              <SectionHeading num="06" title="Validation" subtitle="Heuristic evaluation and testing" />
            </ScrollReveal>

            {/* Heuristic cards */}
            <ScrollReveal delay={0.1}>
              <Label>Heuristic Evaluation</Label>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12, marginBottom: 48 }}>
              {[
                { title: 'User Education',      desc: 'Informing users about system state instead of leaving them confused — confirmations, error messages with actions.' },
                { title: 'Consistency',         desc: 'Standards maintained across all flows and states throughout the platform.' },
                { title: 'Error Prevention',    desc: 'Clear recovery paths when errors occur — skeletal loaders for loading states, cancellation flows.' },
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

            {/* Image pair */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 64, flexWrap: 'wrap' }}>
                {[
                  { src: '/work/customer-360/img-error-screens.png',    alt: 'Error states',      caption: 'Error States' },
                  { src: '/work/customer-360/img-skeletal-loaders.png', alt: 'Skeletal loaders',  caption: 'Skeletal Loaders' },
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
              <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.8 }}>
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
              href="/work/charts-modernisation"
              style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 'var(--text-base)', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              Next Case Study → Modernising Data Visualisation
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
