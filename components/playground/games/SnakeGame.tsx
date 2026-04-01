'use client'

import { useEffect, useRef } from 'react'

const COLS = 20
const ROWS = 20
const CELL = 20
const W = COLS * CELL // 400
const H = ROWS * CELL // 400
const BASE_INTERVAL = 130

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
interface Pt { x: number; y: number }

const OPPOSITE: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }

function randomFood(snake: Pt[]): Pt {
  let p: Pt
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (snake.some(s => s.x === p.x && s.y === p.y))
  return p
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const C = {
      get bg()     { return isLight() ? '#f4f1ec' : '#080808' },
      get grid()   { return isLight() ? '#D8CFC4' : '#1E1E1E' },
      get text()   { return isLight() ? '#2A1F14' : '#F0EDE8' },
      get muted()  { return isLight() ? '#7A6A5A' : '#717171' },
      get accent() { return isLight() ? '#4A6600' : '#C8FF00' },
      get food()   { return isLight() ? '#CC2222' : '#FF6B6B' },
    }

    // ── game state ────────────────────────────────────────────────────
    let snake: Pt[] = [{ x: 10, y: 10 }]
    let dir: Dir = 'RIGHT'
    let nextDir: Dir = 'RIGHT'
    let food: Pt = randomFood(snake)
    let score = 0
    let started = false
    let dead = false
    let intervalId: ReturnType<typeof setInterval> | null = null

    // ── drawing ───────────────────────────────────────────────────────
    function draw() {
      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, W, H)

      // subtle grid dots
      ctx.fillStyle = C.grid
      for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
          ctx.fillRect(x * CELL + CELL / 2 - 0.5, y * CELL + CELL / 2 - 0.5, 1, 1)

      if (!started && !dead) {
        ctx.fillStyle = C.accent
        ctx.fillRect(snake[0].x * CELL + 2, snake[0].y * CELL + 2, CELL - 4, CELL - 4)
        ctx.fillStyle = C.muted
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Arrow keys / WASD to start', W / 2, H / 2 - 10)
        ctx.fillText('or click', W / 2, H / 2 + 10)
        ctx.textAlign = 'left'
        return
      }

      if (dead) {
        ctx.fillStyle = C.text
        ctx.font = 'italic 28px serif'
        ctx.textAlign = 'center'
        ctx.fillText('Game Over', W / 2, H / 2 - 20)
        ctx.font = '14px monospace'
        ctx.fillStyle = C.muted
        ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 8)
        ctx.font = '12px monospace'
        ctx.fillText('Space or click to restart', W / 2, H / 2 + 32)
        ctx.textAlign = 'left'
        return
      }

      // food
      ctx.fillStyle = C.food
      ctx.beginPath()
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
      ctx.fill()

      // snake — head is accent, tail fades
      const len = snake.length
      snake.forEach((seg, i) => {
        if (i === 0) {
          ctx.fillStyle = C.accent
        } else {
          const alpha = Math.max(0.25, 1 - (i / len) * 0.75)
          ctx.globalAlpha = alpha
          ctx.fillStyle = C.text
        }
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
        ctx.globalAlpha = 1
      })

      // score
      ctx.fillStyle = C.accent
      ctx.font = 'bold 13px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${score}`, W - 10, 18)
      ctx.textAlign = 'left'
    }

    // ── tick ──────────────────────────────────────────────────────────
    function tick() {
      if (!started || dead) return
      dir = nextDir
      const head = snake[0]
      const nh: Pt = {
        x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
        y: head.y + (dir === 'DOWN'  ? 1 : dir === 'UP'   ? -1 : 0),
      }

      if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) {
        dead = true
        if (intervalId) { clearInterval(intervalId); intervalId = null }
        draw(); return
      }

      if (snake.some(s => s.x === nh.x && s.y === nh.y)) {
        dead = true
        if (intervalId) { clearInterval(intervalId); intervalId = null }
        draw(); return
      }

      const ate = nh.x === food.x && nh.y === food.y
      snake = [nh, ...snake]
      if (ate) {
        score++
        food = randomFood(snake)
        // speed up slightly every 5 points
        const speed = Math.max(60, BASE_INTERVAL - Math.floor(score / 5) * 10)
        if (intervalId) { clearInterval(intervalId); intervalId = setInterval(tick, speed) }
      } else {
        snake.pop()
      }
      draw()
    }

    // ── reset / start ─────────────────────────────────────────────────
    function reset() {
      if (intervalId) { clearInterval(intervalId); intervalId = null }
      snake = [{ x: 10, y: 10 }]
      dir = 'RIGHT'
      nextDir = 'RIGHT'
      food = randomFood(snake)
      score = 0
      dead = false
      started = true
      intervalId = setInterval(tick, BASE_INTERVAL)
      draw()
    }

    // ── input ─────────────────────────────────────────────────────────
    const DIR_MAP: Record<string, Dir> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!started || dead) reset()
        return
      }
      const newDir = DIR_MAP[e.key]
      if (!newDir) return
      e.preventDefault()
      if (!started || dead) { reset(); return }
      if (newDir !== OPPOSITE[dir]) nextDir = newDir
    }

    const onClick = () => { if (!started || dead) reset() }

    draw()
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('click', onClick)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{
        display: 'block',
        borderRadius: 4,
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    />
  )
}
