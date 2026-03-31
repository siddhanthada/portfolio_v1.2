'use client'

import ScrollReveal from '@/components/motion/ScrollReveal'
import { m } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { value: '6+', label: 'Years in Enterprise' },
  { value: 'F100', label: 'Client Scale' },
  { value: '800+', label: 'Icons Shipped' },
]

export default function About() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: 'var(--bg)',
        paddingTop: 120,
        paddingBottom: 120,
      }}
      className="py-20 md:py-[120px]"
    >
      <div className="container">
        <div
          className="grid grid-cols-1 gap-16 md:grid-cols-[5fr_7fr] md:gap-20"
        >
          {/* Left — image placeholder */}
          <ScrollReveal direction="left">
            <div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                <Image
                  src="/work/about/my-picture.png"
                  alt="Siddhant Hada"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  priority
                />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginTop: 12,
                  letterSpacing: '0.06em',
                }}
              >
                Bangalore, India · 2025
              </p>
            </div>
          </ScrollReveal>

          {/* Right — text content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <ScrollReveal>
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
                About
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                I&apos;m a Product Designer with 6+ years of experience designing enterprise
                SaaS used by Fortune 100 companies. At o9, I lead charts and admin
                workflows for an AI-powered supply chain platform.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  marginBottom: 48,
                }}
              >
                Before o9, I built LeadSquared&apos;s Service product - ticketing workflows,
                Customer 360, and conversational resolution flows. I began my enterprise
                journey at West Pharmaceutical Services, and hold a B.Tech in Computer
                Science from VIT Vellore.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.3}>
              <div
                style={{
                  display: 'flex',
                  gap: 48,
                  marginBottom: 48,
                  flexWrap: 'wrap',
                }}
              >
                {stats.map((stat) => (
                  <div key={stat.value}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 'var(--text-2xl)',
                        color: 'var(--text)',
                        fontWeight: 400,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '11px',
                        color: 'var(--muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal delay={0.4}>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-fill"
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text)',
                  paddingBottom: 4,
                  borderBottom: '1px solid var(--accent)',
                }}
              >
                Download Resume →
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
