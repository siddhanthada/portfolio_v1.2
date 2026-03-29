'use client'

import { useState, useRef, useCallback } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&'

function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    const totalFrames = 12
    const length = text.length

    if (frameRef.current) clearInterval(frameRef.current)

    frameRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === '.' || char === ' ') return char
            if (iteration / totalFrames > i / length) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join(''),
      )
      iteration++
      if (iteration > totalFrames) {
        clearInterval(frameRef.current!)
        setDisplay(text)
      }
    }, 30)
  }, [text])

  return (
    <span
      onMouseEnter={scramble}
      style={{ cursor: 'default', letterSpacing: '0.08em' }}
    >
      {display}
    </span>
  )
}

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        paddingTop: 32,
        paddingBottom: 32,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            color: 'var(--muted)',
            letterSpacing: '0.04em',
          }}
        >
          © 2026 Siddhant Hada. Built with Next.js + Framer Motion.
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            color: 'var(--muted)',
          }}
        >
          <ScrambleText text="siddhant.design" />
        </span>
      </div>
    </footer>
  )
}
