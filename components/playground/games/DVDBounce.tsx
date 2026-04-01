'use client'

import { useEffect, useRef } from 'react'

const COLORS_DARK  = ['#C8FF00', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFEAA7', '#A8E6CF', '#DDA0DD']
const COLORS_LIGHT = ['#4A6600', '#CC2222', '#006060', '#1A4488', '#886600', '#2A6644', '#662288']
const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'
function getPalette() {
  return isLight() ? COLORS_LIGHT : COLORS_DARK
}

export default function DVDBounce() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cornersRef = useRef(0)
  const countElRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const TEXT = 'SH.'
    ctx.font = 'bold 28px monospace'
    const tw = ctx.measureText(TEXT).width
    const th = 28

    let x = Math.random() * (W - tw)
    let y = Math.random() * (H - th) + th
    let dx = 2.5
    let dy = 2.5
    let color = getPalette()[Math.floor(Math.random() * getPalette().length)]
    let flashFrames = 0
    let flashColor = color
    let corners = 0

    let rafId: number

    function pickColor() {
      const palette = getPalette()
      let c: string
      do { c = palette[Math.floor(Math.random() * palette.length)] } while (c === color)
      return c
    }

    function draw() {
      let hitX = false
      let hitY = false

      x += dx
      y += dy

      if (x <= 0) { x = 0; dx = Math.abs(dx); hitX = true }
      if (x + tw >= W) { x = W - tw; dx = -Math.abs(dx); hitX = true }
      if (y - th <= 0) { y = th; dy = Math.abs(dy); hitY = true }
      if (y >= H) { y = H; dy = -Math.abs(dy); hitY = true }

      if (hitX) color = pickColor()
      if (hitY) color = pickColor()

      if (hitX && hitY) {
        corners++
        flashFrames = 3
        flashColor = color
        if (countElRef.current) countElRef.current.textContent = `Corners: ${corners}`
      }

      // bg
      ctx.fillStyle = isLight() ? '#f4f1ec' : '#080808'
      ctx.fillRect(0, 0, W, H)

      // flash
      if (flashFrames > 0) {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = flashColor
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha = 1
        flashFrames--
      }

      // text
      ctx.fillStyle = color
      ctx.font = 'bold 28px monospace'
      ctx.fillText(TEXT, x, y)

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={640}
        height={380}
        style={{
          display: 'block',
          borderRadius: 4,
          border: '1px solid var(--border)',
        }}
      />
      <div
        ref={countElRef}
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
        }}
      >
        Corners: 0
      </div>
    </div>
  )
}
