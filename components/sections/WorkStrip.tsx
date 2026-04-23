'use client'

const STRIP_ITEMS = [
  { text: 'Fortune 100 Clients', accent: true },
  { text: 'VIT Vellore', accent: true },
  { text: 'Enterprise Design' },
  { text: 'B2B SaaS' },
  { text: 'Data Visualisation' },
  { text: 'Design Systems' },
  { text: 'Product Design' },
  { text: 'User Experience (UX)' },
  { text: 'User Interfaces (UI)' },
  { text: 'User Research' },
  { text: 'Information Architecture' },
  { text: 'Wireframing' },
  { text: 'Prototyping' },
  { text: 'Usability Testing' },
  { text: 'Interaction Design' },
  { text: 'Visual Design' },
  { text: 'UX Strategy' },
  { text: 'Agile Methodology' },
  { text: 'Stakeholder Management' },
  { text: 'Cross-functional Collaboration' },
  { text: 'Problem Solving' },
  { text: 'Accessibility' },
]

function Dot() {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '16px',
        color: 'var(--text)',
        margin: '0 24px',
        lineHeight: 1,
        opacity: 0.4,
      }}
    >
      ·
    </span>
  )
}

export default function WorkStrip() {
  const content = (
    <>
      {STRIP_ITEMS.map((item) => (
        <span key={item.text} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '12px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 500,
            }}
          >
            {item.text}
          </span>
          <Dot />
        </span>
      ))}
    </>
  )

  return (
    <div
      style={{
        width: '100%',
        height: 56,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="marquee-track"
        style={{ '--marquee-speed': '60s' } as React.CSSProperties}
      >
        <span className="flex items-center" style={{ gap: 0 }}>
          {content}
        </span>
        <span className="flex items-center" aria-hidden="true" style={{ gap: 0 }}>
          {content}
        </span>
      </div>
    </div>
  )
}
