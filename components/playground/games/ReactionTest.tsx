'use client'

import { useState, useRef, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'

type Phase = 'idle' | 'waiting' | 'go' | 'result' | 'tooearly'

function getRating(ms: number) {
  if (ms < 150) return 'Inhuman'
  if (ms < 200) return 'Elite'
  if (ms < 300) return 'Fast'
  if (ms < 500) return 'Average'
  return 'Take a nap'
}

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [reaction, setReaction] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleClick = () => {
    if (phase === 'idle' || phase === 'result' || phase === 'tooearly') {
      setPhase('waiting')
      const delay = 1500 + Math.random() * 3000
      timerRef.current = setTimeout(() => {
        startRef.current = performance.now()
        setPhase('go')
      }, delay)
      return
    }
    if (phase === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current)
      setPhase('tooearly')
      timerRef.current = setTimeout(() => setPhase('idle'), 1200)
      return
    }
    if (phase === 'go') {
      const ms = Math.round(performance.now() - startRef.current)
      setReaction(ms)
      setPhase('result')
    }
  }

  const bgColor =
    phase === 'waiting' || phase === 'tooearly'
      ? '#3D0000'
      : phase === 'go'
      ? '#C8FF00'
      : 'var(--bg-card)'

  return (
    <div
      onClick={handleClick}
      style={{
        width: 500,
        height: 360,
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgColor,
        transition: 'background 0.15s ease',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <m.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--text)' }}>
              Click to start
            </div>
          </m.div>
        )}

        {phase === 'waiting' && (
          <m.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 16, color: 'rgba(255,100,100,0.7)' }}>
              Wait...
            </div>
          </m.div>
        )}

        {phase === 'tooearly' && (
          <m.div
            key="tooearly"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 16, color: 'rgba(255,100,100,0.9)' }}>
              Too early!
            </div>
          </m.div>
        )}

        {phase === 'go' && (
          <m.div
            key="go"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 20, fontWeight: 700, color: '#080808' }}>
              NOW!
            </div>
          </m.div>
        )}

        {phase === 'result' && reaction !== null && (
          <m.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 56, fontWeight: 300, color: 'var(--text)', lineHeight: 1 }}>
                {reaction}
              </span>
              <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: 20, color: 'var(--muted)' }}>ms</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--accent)', marginTop: 10 }}>
              {getRating(reaction)}
            </div>
            <button
              onClick={() => setPhase('idle')}
              style={{
                marginTop: 20,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                padding: '8px 24px',
                borderRadius: 2,
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'block',
                margin: '16px auto 0',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
            >
              Try again
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
