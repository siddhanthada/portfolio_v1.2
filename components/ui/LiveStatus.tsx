'use client'
import { useEffect, useState } from 'react'

export default function LiveStatus() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()

      const istTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const istDate = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      setTime(istTime)
      setDate(istDate)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const dot = (
    <div style={{ position: 'relative', width: '6px', height: '6px', flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: '-3px',
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.3,
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        }}
      />
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--accent)',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  )

  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--muted)',
          letterSpacing: '0.08em',
        }}
      >
        {/* Row 1: dot + status left, location right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {dot}
            <span>Available for Senior roles</span>
          </div>
          <span>Bangalore, IN</span>
        </div>
        {/* Row 2: centered clock */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '4px' }}>
          <span style={{ color: 'var(--muted)' }}>IST&nbsp;</span>
          <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>{time}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--muted)',
        letterSpacing: '0.08em',
      }}
    >
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {dot}
          <span>Available for Senior roles</span>
        </div>

        <span style={{ color: 'var(--border)', userSelect: 'none' }}>·</span>

        <span>Bangalore, IN</span>
      </div>

      {/* Right side — live clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="hidden sm:block">{date}</span>
        <span style={{ color: 'var(--border)' }} className="hidden sm:block">·</span>
        <span
          style={{
            color: 'var(--text)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.05em',
          }}
        >
          IST {time}
        </span>
      </div>
    </div>
  )
}
