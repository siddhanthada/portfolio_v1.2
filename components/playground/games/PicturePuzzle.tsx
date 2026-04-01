'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const COLS = 4
const ROWS = 4
const PIECE_W = 100
const PIECE_H = 80
const BOARD_W = COLS * PIECE_W // 400
const BOARD_H = ROWS * PIECE_H // 320
const SNAP_DIST = PIECE_W * 0.6

const IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'

const FACT =
  'Van Gogh painted this in June 1889 while voluntarily admitted to an asylum in Saint-Rémy-de-Provence — from memory. He never sold it in his lifetime. Today it hangs at MoMA, New York, and is one of the most recognised works in Western art.'

const CONFETTI_COLORS = ['#C8FF00', '#FF6B6B', '#4ECDC4', '#FFD700', '#FF69B4', '#87CEEB', '#A8E6CF']

interface Particle {
  x: number; y: number
  vx: number; vy: number
  color: string; size: number
  angle: number; spin: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function freshOrder(): number[] {
  let o: number[]
  do { o = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i)) }
  while (o.every((v, i) => v === i))
  return o
}

function slotToPos(slot: number) {
  return { x: (slot % COLS) * PIECE_W, y: Math.floor(slot / COLS) * PIECE_H }
}

interface DragState {
  pieceId: number
  fromSlot: number
  offsetX: number
  offsetY: number
  mouseX: number
  mouseY: number
}

export default function PicturePuzzle() {
  // order[slot] = pieceId
  const [order, setOrder] = useState<number[]>(() => freshOrder())
  const [drag, setDrag] = useState<DragState | null>(null)
  const [solved, setSolved] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  /* ── confetti ──────────────────────────────────────────────────────── */
  const animateConfetti = useCallback(() => {
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = particlesRef.current.filter(p => p.y < canvas.height + 30)
    for (const p of particlesRef.current) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.angle += p.spin
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    }
    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(animateConfetti)
    }
  }, [])

  const launchConfetti = useCallback(() => {
    const canvas = confettiRef.current
    if (!canvas) return
    particlesRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 7 + Math.random() * 7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.25,
    }))
    animateConfetti()
  }, [animateConfetti])

  useEffect(() => () => { cancelAnimationFrame(rafRef.current) }, [])

  /* ── drag handlers ─────────────────────────────────────────────────── */
  const handleMouseDown = useCallback((e: React.MouseEvent, pieceId: number) => {
    if (solved) return
    e.preventDefault()
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const slot = order.indexOf(pieceId)
    const sp = slotToPos(slot)
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    setDrag({ pieceId, fromSlot: slot, offsetX: mouseX - sp.x, offsetY: mouseY - sp.y, mouseX, mouseY })
  }, [order, solved])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag) return
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    setDrag(prev => prev ? { ...prev, mouseX: e.clientX - rect.left, mouseY: e.clientY - rect.top } : null)
  }, [drag])

  const handleMouseUp = useCallback(() => {
    if (!drag) return

    // centre of where piece was dropped
    const cx = drag.mouseX - drag.offsetX + PIECE_W / 2
    const cy = drag.mouseY - drag.offsetY + PIECE_H / 2

    let nearest = drag.fromSlot
    let minDist = Infinity
    for (let s = 0; s < COLS * ROWS; s++) {
      const sp = slotToPos(s)
      const d = Math.hypot(cx - (sp.x + PIECE_W / 2), cy - (sp.y + PIECE_H / 2))
      if (d < minDist) { minDist = d; nearest = s }
    }

    if (minDist < SNAP_DIST) {
      const newOrder = [...order]
      const displaced = newOrder[nearest]
      newOrder[nearest] = drag.pieceId
      newOrder[drag.fromSlot] = displaced
      setOrder(newOrder)
      if (newOrder.every((v, i) => v === i)) {
        setSolved(true)
        setTimeout(launchConfetti, 100)
      }
    }
    setDrag(null)
  }, [drag, order, launchConfetti])

  /* ── restart ───────────────────────────────────────────────────────── */
  const restart = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const canvas = confettiRef.current
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = []
    setSolved(false)
    setOrder(freshOrder())
  }, [])

  /* ── render ────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src={IMAGE_URL}
          alt="The Starry Night – Van Gogh"
          style={{
            width: 72,
            height: 58,
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 3,
            border: '1px solid var(--border)',
            opacity: 0.65,
          }}
        />
        <div>
          <p style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 12,
            color: 'var(--text)',
            margin: '0 0 2px',
            fontWeight: 500,
          }}>
            The Starry Night — Van Gogh
          </p>
          <p style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            color: 'var(--muted)',
            margin: 0,
          }}>
            Drag pieces to swap &bull; arrange to solve
          </p>
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative',
          width: BOARD_W,
          height: BOARD_H,
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: drag ? 'grabbing' : 'default',
        }}
      >
        {/* Slot outlines */}
        {Array.from({ length: COLS * ROWS }, (_, slot) => {
          const sp = slotToPos(slot)
          return (
            <div key={`sl-${slot}`} style={{
              position: 'absolute',
              left: sp.x, top: sp.y,
              width: PIECE_W, height: PIECE_H,
              border: '1px solid rgba(128,128,128,0.15)',
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }} />
          )
        })}

        {/* Pieces (all except the one being dragged) */}
        {order.map((pieceId, slot) => {
          if (drag?.pieceId === pieceId) return null
          const sp = slotToPos(slot)
          const correctCol = pieceId % COLS
          const correctRow = Math.floor(pieceId / COLS)
          const isCorrect = slot === pieceId
          return (
            <div
              key={pieceId}
              onMouseDown={e => handleMouseDown(e, pieceId)}
              style={{
                position: 'absolute',
                left: sp.x, top: sp.y,
                width: PIECE_W, height: PIECE_H,
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `${BOARD_W}px ${BOARD_H}px`,
                backgroundPosition: `-${correctCol * PIECE_W}px -${correctRow * PIECE_H}px`,
                backgroundRepeat: 'no-repeat',
                cursor: solved ? 'default' : 'grab',
                boxSizing: 'border-box',
                outline: isCorrect ? '2px solid rgba(200,255,0,0.7)' : 'none',
                outlineOffset: '-2px',
                transition: 'outline 0.15s',
                zIndex: 1,
              }}
            />
          )
        })}

        {/* Dragging piece */}
        {drag && (() => {
          const correctCol = drag.pieceId % COLS
          const correctRow = Math.floor(drag.pieceId / COLS)
          return (
            <div
              key="dragging"
              style={{
                position: 'absolute',
                left: drag.mouseX - drag.offsetX,
                top: drag.mouseY - drag.offsetY,
                width: PIECE_W, height: PIECE_H,
                backgroundImage: `url(${IMAGE_URL})`,
                backgroundSize: `${BOARD_W}px ${BOARD_H}px`,
                backgroundPosition: `-${correctCol * PIECE_W}px -${correctRow * PIECE_H}px`,
                backgroundRepeat: 'no-repeat',
                cursor: 'grabbing',
                zIndex: 10,
                boxShadow: '0 10px 32px rgba(0,0,0,0.45)',
                borderRadius: 2,
                opacity: 0.92,
              }}
            />
          )
        })()}

        {/* Confetti canvas */}
        <canvas
          ref={confettiRef}
          width={BOARD_W}
          height={BOARD_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}
        />

        {/* Solved overlay */}
        {solved && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.72)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px 32px',
            zIndex: 30, textAlign: 'center',
            gap: 0,
          }}>
            <span style={{ fontSize: 32, marginBottom: 12 }}>🎨</span>
            <p style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 12,
              color: '#E8E5DF',
              lineHeight: 1.75,
              marginBottom: 20,
              maxWidth: 300,
            }}>
              {FACT}
            </p>
            <button
              onClick={restart}
              style={{
                padding: '8px 28px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 2,
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
