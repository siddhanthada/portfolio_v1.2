'use client'

export default function WorkStrip() {
  const content = (
    <>
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
        Currently at o9 Solutions
      </span>
      <Dot />
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
        Ex-LeadSquared
      </span>
      <Dot />
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
        B.Tech CS, VIT
      </span>
      <Dot />
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
        Fortune 100 Clients
      </span>
      <Dot />
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
        Open to Senior Roles
      </span>
      <Dot />
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
        Bangalore, India
      </span>
      <Dot />
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
        style={{ '--marquee-speed': '40s' } as React.CSSProperties}
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

function Dot() {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '16px',
        color: 'var(--text)',
        margin: '0 24px',
        lineHeight: 1,
      }}
    >
      ·
    </span>
  )
}
