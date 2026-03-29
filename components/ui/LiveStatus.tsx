'use client'
import { useEffect, useState } from 'react'

export default function LiveStatus() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

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
          <div style={{ position: 'relative', width: '6px', height: '6px' }}>
            {/* Outer pulse ring */}
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
            {/* Inner dot */}
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
