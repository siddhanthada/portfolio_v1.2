'use client'

import ScrollReveal from '@/components/motion/ScrollReveal'

const principles = [
  {
    number: '01',
    headline: 'Systems over screens',
    body: 'Design the rules, not just the outcomes. Good systems make edge cases obvious.',
  },
  {
    number: '02',
    headline: 'Craft in the details',
    body: 'The micro is where trust is earned. Spacing, timing, and tone compound.',
  },
  {
    number: '03',
    headline: 'Ship, then sharpen',
    body: 'Good design moves. Perfection at the cost of momentum is just fear.',
  },
]

export default function Philosophy() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        {/* Desktop: horizontal row with vertical separators */}
        <div
          className="hidden md:flex"
          style={{ width: '100%' }}
        >
          {principles.map((p, i) => (
            <ScrollReveal key={p.number} delay={i * 0.15} className="flex-1">
              <div
                style={{
                  padding: '80px 48px',
                  borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    letterSpacing: '0.12em',
                    marginBottom: 20,
                  }}
                >
                  {p.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-xl)',
                    color: 'var(--text)',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 16,
                  }}
                >
                  {p.headline}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile: vertical stack with horizontal dividers */}
        <div className="flex md:hidden flex-col" style={{ padding: '0 20px' }}>
          {principles.map((p, i) => (
            <ScrollReveal key={p.number} delay={i * 0.1}>
              <div
                style={{
                  padding: '48px 0',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    letterSpacing: '0.12em',
                    marginBottom: 16,
                  }}
                >
                  {p.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-xl)',
                    color: 'var(--text)',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 12,
                  }}
                >
                  {p.headline}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
