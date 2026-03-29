'use client'

import { useState } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import ScrollReveal from '@/components/motion/ScrollReveal'

const EMAIL = 'hadasiddhant@gmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: create temp input
      const input = document.createElement('input')
      input.value = EMAIL
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section
      id="contact"
      style={{
        backgroundColor: 'var(--bg)',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 120,
        borderTop: '1px solid var(--border)',
      }}
      className="py-20 md:py-[120px]"
    >
      <div
        className="container"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 0,
        }}
      >
        {/* Label */}
        <ScrollReveal>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: 'var(--accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Get in touch
          </span>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.1}>
          <h2
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 7vw, 5rem)',
              color: 'var(--text)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              marginBottom: 24,
              maxWidth: 800,
            }}
          >
            Let&apos;s make something worth shipping.
          </h2>
        </ScrollReveal>

        {/* Sub */}
        <ScrollReveal delay={0.2}>
          <p
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted)',
              lineHeight: 1.7,
              maxWidth: 480,
              marginBottom: 48,
            }}
          >
            Open to Senior Product Designer roles. Also happy to talk design,
            systems, or motorcycles.
          </p>
        </ScrollReveal>

        {/* Email */}
        <ScrollReveal delay={0.3}>
          <div style={{ position: 'relative', marginBottom: 48 }}>
            <button
              type="button"
              onClick={handleCopy}
              className="email-link"
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-xl)',
                color: 'var(--text)',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                letterSpacing: '-0.01em',
              }}
            >
              {EMAIL}
            </button>

            {/* Copied toast */}
            <AnimatePresence>
              {copied && (
                <m.div
                  key="copied"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg)',
                    padding: '5px 12px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.04em',
                  }}
                >
                  Copied!
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={0.4}>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
            {[
              { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/siddhanthada/' },
              { label: 'Medium ↗', href: 'https://medium.com/@hadasiddhant' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--text)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--muted)')
                }
              >
                {label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
