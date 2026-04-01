'use client'

import { useEffect, useRef } from 'react'

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const GROUND = 170

    const state = {
      dinoY: GROUND - 40,
      velY: 0,
      onGround: true,
      canDoubleJump: true,
      cacti: [] as { x: number; w: number; h: number }[],
      frame: 0,
      score: 0,
      speed: 4,
      nextCactus: 80,
      dead: false,
      started: false,
    }

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const C = {
      get bg()     { return isLight() ? '#f4f1ec' : '#080808' },
      get ground() { return isLight() ? '#BFB3A4' : '#2A2A2A' },
      get text()   { return isLight() ? '#2A1F14' : '#F0EDE8' },
      get muted()  { return isLight() ? '#7A6A5A' : '#717171' },
      get accent() { return isLight() ? '#4A6600' : '#C8FF00' },
    }

    function jump() {
      if (state.dead) { reset(); return }
      if (!state.started) state.started = true
      if (state.onGround) {
        state.velY = -12
        state.onGround = false
        state.canDoubleJump = true
      } else if (state.canDoubleJump) {
        state.velY = -11
        state.canDoubleJump = false
      }
    }

    function reset() {
      state.dinoY = GROUND - 40
      state.velY = 0
      state.onGround = true
      state.canDoubleJump = true
      state.cacti = []
      state.frame = 0
      state.score = 0
      state.speed = 4
      state.nextCactus = 80
      state.dead = false
      state.started = false
    }

    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); jump() } }
    const onTap = () => jump()
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onTap)

    let rafId: number

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // bg
      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, W, H)

      // ground
      ctx.strokeStyle = C.ground
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, GROUND)
      ctx.lineTo(W, GROUND)
      ctx.stroke()

      if (!state.started) {
        ctx.fillStyle = C.muted
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Press Space or click to start', W / 2, GROUND / 2)
        ctx.textAlign = 'left'
      }

      if (state.dead) {
        ctx.fillStyle = C.text
        ctx.font = 'italic 28px serif'
        ctx.textAlign = 'center'
        ctx.fillText('Game Over', W / 2, H / 2 - 20)
        ctx.font = '14px monospace'
        ctx.fillStyle = C.muted
        ctx.fillText(`Score: ${Math.floor(state.score)}`, W / 2, H / 2 + 10)
        ctx.font = '12px monospace'
        ctx.fillText('Press Space to restart', W / 2, H / 2 + 35)
        ctx.textAlign = 'left'
        rafId = requestAnimationFrame(draw)
        return
      }

      if (state.started) {
        state.frame++
        state.score += 0.1
        state.speed = 4 + state.score * 0.01

        // physics
        state.velY += 0.6
        state.dinoY += state.velY
        if (state.dinoY >= GROUND - 40) {
          state.dinoY = GROUND - 40
          state.velY = 0
          state.onGround = true
          state.canDoubleJump = true
        }

        // spawn cactus
        state.nextCactus--
        if (state.nextCactus <= 0) {
          const w = 15 + Math.random() * 10
          const h = 30 + Math.random() * 25
          state.cacti.push({ x: W, w, h })
          state.nextCactus = 60 + Math.floor(Math.random() * 40)
        }

        // move + draw cacti
        for (let i = state.cacti.length - 1; i >= 0; i--) {
          state.cacti[i].x -= state.speed
          if (state.cacti[i].x + state.cacti[i].w < 0) { state.cacti.splice(i, 1); continue }
          ctx.fillStyle = C.text
          const c = state.cacti[i]
          ctx.fillRect(c.x, GROUND - c.h, c.w, c.h)

          // collision — check dino bottom vs cactus top (shrunk hitboxes)
          if (
            80 + 4 < c.x + c.w - 4 &&
            80 + 26 > c.x + 4 &&
            state.dinoY + 36 > GROUND - c.h + 4 &&
            state.dinoY < GROUND
          ) {
            state.dead = true
          }
        }
      }

      // dino
      ctx.fillStyle = C.text
      ctx.fillRect(80, state.dinoY, 30, 40)

      // score
      ctx.fillStyle = C.accent
      ctx.font = '12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${Math.floor(state.score)}`, W - 16, 24)
      ctx.textAlign = 'left'

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('click', onTap)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={220}
      style={{
        display: 'block',
        borderRadius: 4,
        border: '1px solid var(--border)',
      }}
    />
  )
}
