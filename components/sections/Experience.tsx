'use client'

import { m, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import ScrollReveal from '@/components/motion/ScrollReveal'
import { useTheme } from '@/lib/ThemeContext'

const roles = [
  {
    company: 'o9 Solutions',
    role: 'Product Designer 2',
    period: 'May 2024 — Present',
    location: 'Bangalore',
    note: 'Charts · Icon System · Admin · WCAG 2.1',
  },
  {
    company: 'LeadSquared',
    role: 'Product Designer',
    period: 'Dec 2022 — Apr 2024',
    location: 'Bangalore',
    note: 'Service Product · Customer 360 · Ticketing',
  },
  {
    company: 'West Pharmaceutical Services',
    role: 'Associate UX Designer',
    period: 'Jan 2020 — Dec 2022',
    location: 'Bangalore',
    note: 'Enterprise Tools · E-commerce · SharePoint',
  },
]

function ExperienceRow({
  company,
  role,
  period,
  location,
  note,
  delay,
}: (typeof roles)[0] & { delay: number }) {
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const hoverBg = theme === 'light' ? 'rgba(234,230,223,1)' : 'rgba(17,17,17,1)'
  const defaultBg = theme === 'light' ? 'rgba(234,230,223,0)' : 'rgba(17,17,17,0)'

  return (
    <ScrollReveal delay={delay}>
      <m.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          backgroundColor: hovered ? hoverBg : defaultBg,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '32px 16px',
          borderRadius: 2,
          cursor: 'default',
        }}
      >
        {/* Desktop layout */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: '3fr 5fr 2fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-lg)',
              color: 'var(--text)',
              fontWeight: 500,
            }}
          >
            {company}
          </span>
          <div>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: hovered ? 'var(--text)' : 'var(--muted)',
                marginBottom: 4,
                transition: 'color 0.2s ease',
              }}
            >
              {role}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.06em',
                opacity: 0.7,
              }}
            >
              {note}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 'var(--text-sm)',
                color: hovered ? 'var(--text)' : 'var(--muted)',
                transition: 'color 0.2s ease',
              }}
            >
              {period}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: 'var(--muted)',
                opacity: 0.7,
              }}
            >
              {location}
            </span>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden flex-col" style={{ gap: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-lg)',
                color: 'var(--text)',
                fontWeight: 500,
              }}
            >
              {company}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: 'var(--muted)',
                flexShrink: 0,
              }}
            >
              {period}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted)',
            }}
          >
            {role}
          </span>
        </div>
      </m.div>
    </ScrollReveal>
  )
}

export default function Experience() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg)',
        paddingTop: 120,
        paddingBottom: 120,
      }}
      className="py-20 md:py-[120px]"
    >
      <div className="container">
        {/* Desktop: two-column label + list */}
        <div
          className="hidden md:grid"
          style={{ gridTemplateColumns: '2fr 10fr', gap: 64 }}
        >
          {/* Sticky label */}
          <div>
            <div style={{ position: 'sticky', top: 120 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Experience
              </span>
            </div>
          </div>

          {/* Roles list */}
          <div>
            {roles.map((role, i) => (
              <ExperienceRow key={role.company} {...role} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex md:hidden flex-col" style={{ gap: 0 }}>
          <ScrollReveal>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                color: 'var(--accent)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 32,
              }}
            >
              Experience
            </span>
          </ScrollReveal>
          {roles.map((role, i) => (
            <ExperienceRow key={role.company} {...role} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
