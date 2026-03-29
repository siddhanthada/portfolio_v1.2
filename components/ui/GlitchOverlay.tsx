'use client'
import { useEffect, useRef } from 'react'

export default function GlitchOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animatingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleGlitch = () => {
      if (animatingRef.current) return
      animatingRef.current = true

      try {
        const audioCtx = new AudioContext()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.frequency.setValueAtTime(880, audioCtx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.2)
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.25)
      } catch {}

      const w = canvas.width
      const h = canvas.height
      const startTime = performance.now()
      const duration = 800

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('apply-theme-change'))
      }, 400)

      const draw = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        ctx.clearRect(0, 0, w, h)

        if (progress < 1) {
          const intensity = progress < 0.5
            ? progress / 0.5
            : 1 - (progress - 0.5) / 0.5

          const numSlices = Math.floor(6 + intensity * 18)

          for (let i = 0; i < numSlices; i++) {
            const sliceY = Math.random() * h
            const sliceH = Math.random() * (h / 8) + 4
            const offsetX = (Math.random() - 0.5) * 60 * intensity
            const alpha = Math.random() * 0.85 * intensity

            const colorRoll = Math.random()
            if (colorRoll < 0.5) {
              ctx.fillStyle = `rgba(240, 237, 232, ${alpha})`
            } else if (colorRoll < 0.75) {
              ctx.fillStyle = `rgba(200, 255, 0, ${alpha * 0.7})`
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`
            }
            ctx.fillRect(offsetX, sliceY, w, sliceH)

            if (Math.random() > 0.5) {
              ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.3})`
              ctx.fillRect(offsetX + 4 * intensity, sliceY, w, sliceH * 0.5)
            }

            if (Math.random() > 0.5) {
              ctx.fillStyle = `rgba(0, 100, 255, ${alpha * 0.3})`
              ctx.fillRect(offsetX - 4 * intensity, sliceY + sliceH * 0.5, w, sliceH * 0.5)
            }

            if (Math.random() > 0.7) {
              ctx.fillStyle = `rgba(0, 255, 100, ${alpha * 0.15})`
              ctx.fillRect(offsetX + 2, sliceY, w, sliceH)
            }
          }

          if (progress > 0.42 && progress < 0.58) {
            const flashAlpha = (1 - Math.abs(progress - 0.5) / 0.08) * 0.35 * intensity
            ctx.fillStyle = `rgba(240, 237, 232, ${flashAlpha})`
            ctx.fillRect(0, 0, w, h)
          }

          if (intensity > 0.4) {
            for (let y = 0; y < h; y += 4) {
              ctx.fillStyle = `rgba(0, 0, 0, ${0.15 * intensity})`
              ctx.fillRect(0, y, w, 2)
            }
          }

          requestAnimationFrame(draw)
        } else {
          ctx.clearRect(0, 0, w, h)
          animatingRef.current = false
        }
      }

      requestAnimationFrame(draw)
    }

    window.addEventListener('theme-glitch', handleGlitch)
    return () => {
      window.removeEventListener('theme-glitch', handleGlitch)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  )
}
