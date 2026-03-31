'use client'

import { useRef, useState, useEffect } from 'react'

type FlowerType = 0 | 1 | 2 | 3 | 4

const FLOWERS = ['🌸', '🌺', '🌻', '🌹', '🌷']

const COLORS: { petals: string; center: string }[] = [
  { petals: 'rgba(255,182,193,0.9)', center: 'rgba(255,150,160,1)' },
  { petals: 'rgba(220,50,50,0.9)',   center: 'rgba(180,20,20,1)' },
  { petals: 'rgba(255,200,50,0.9)',  center: 'rgba(120,70,10,1)' },
  { petals: 'rgba(180,30,30,0.9)',   center: 'rgba(100,10,10,1)' },
  { petals: 'rgba(180,100,200,0.9)', center: 'rgba(140,60,160,1)' },
]

function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: FlowerType,
  scale: number,
  rotation: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)

  const { petals, center } = COLORS[type]
  const petalR = 10
  const dist = 14

  // stem
  ctx.strokeStyle = 'rgba(60,140,60,0.9)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 8)
  ctx.lineTo(0, 28)
  ctx.stroke()

  // petals
  ctx.fillStyle = petals
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, petalR, 0, Math.PI * 2)
    ctx.fill()
  }

  // center
  ctx.fillStyle = center
  ctx.beginPath()
  ctx.arc(0, 0, 8, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

export default function FlowerBouquet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState<FlowerType>(0)
  const flowers = useRef<{ x: number; y: number; type: FlowerType; scale: number; rot: number }[]>([])

  const redraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#080808'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (const f of flowers.current) drawFlower(ctx, f.x, f.y, f.type, f.scale, f.rot)
  }

  useEffect(() => { redraw() }, [])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const scale = 0.7 + Math.random() * 0.5
    const rot = (Math.random() - 0.5) * (Math.PI / 6)
    flowers.current.push({ x, y, type: active, scale, rot })
    redraw()
  }

  const clear = () => { flowers.current = []; redraw() }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'bouquet.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Flower selector */}
      <div style={{ display: 'flex', gap: 8 }}>
        {FLOWERS.map((f, i) => (
          <button
            key={i}
            onClick={() => setActive(i as FlowerType)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${active === i ? 'var(--accent)' : 'var(--border)'}`,
              background: 'var(--bg-card)',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={420}
        onClick={handleClick}
        style={{
          display: 'block',
          borderRadius: 4,
          border: '1px solid var(--border)',
          cursor: 'crosshair',
        }}
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={clear}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            padding: '7px 20px',
            borderRadius: 2,
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 13,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
        >
          Clear
        </button>
        <button
          onClick={save}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            padding: '7px 20px',
            borderRadius: 2,
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 13,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
        >
          Save as PNG
        </button>
      </div>
    </div>
  )
}
