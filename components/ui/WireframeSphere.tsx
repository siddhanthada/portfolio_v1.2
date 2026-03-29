'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WireframeSphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)
    renderer.domElement.style.cursor = 'default'
    container.appendChild(renderer.domElement)

    const canvas = renderer.domElement

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.z = 3.5

    // ── Inner wireframe ───────────────────────────────────────────────────────
    const geometry  = new THREE.IcosahedronGeometry(1, 1)
    const edges     = new THREE.EdgesGeometry(geometry)
    const material  = new THREE.LineBasicMaterial({
      color: 0xf0ede8,
      transparent: true,
      opacity: 0.35,
    })
    const wireframe = new THREE.LineSegments(edges, material)
    scene.add(wireframe)

    // ── Outer wireframe ───────────────────────────────────────────────────────
    const outerGeometry  = new THREE.IcosahedronGeometry(1.45, 1)
    const outerEdges     = new THREE.EdgesGeometry(outerGeometry)
    const outerMaterial  = new THREE.LineBasicMaterial({
      color: 0xc8ff00,
      transparent: true,
      opacity: 0.08,
    })
    const outerWireframe = new THREE.LineSegments(outerEdges, outerMaterial)
    scene.add(outerWireframe)

    // ── Theme ─────────────────────────────────────────────────────────────────
    const applyTheme = (theme: string) => {
      const isLight = theme === 'light'
      material.color.set(isLight ? 0x111111 : 0xf0ede8)
      material.opacity       = isLight ? 0.55 : 0.35
      outerMaterial.color.set(isLight ? 0x888888 : 0xc8ff00)
      outerMaterial.opacity  = isLight ? 0.15 : 0.08
    }

    applyTheme(document.documentElement.getAttribute('data-theme') || 'dark')

    const observer = new MutationObserver(() => {
      applyTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ── Rotation state ────────────────────────────────────────────────────────
    const rot = {
      autoX: 0,
      autoY: 0,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      isOver: false,
    }

    // ── Mouse handlers ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      rot.targetMouseX = ((e.clientY - rect.top)  / rect.height - 0.5) * 0.15
      rot.targetMouseY = ((e.clientX - rect.left) / rect.width  - 0.5) * 0.15
      rot.isOver = true
    }

    const onMouseLeave = () => {
      rot.isOver = false
      rot.targetMouseX = 0
      rot.targetMouseY = 0
    }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      // Always auto-rotate — slow and continuous
      rot.autoX += 0.0004
      rot.autoY += 0.0006

      // Smoothly lerp mouse influence toward target
      rot.mouseX += (rot.targetMouseX - rot.mouseX) * 0.015
      rot.mouseY += (rot.targetMouseY - rot.mouseY) * 0.015

      // Final rotation = auto + mouse influence blended in
      wireframe.rotation.x = rot.autoX + rot.mouseX
      wireframe.rotation.y = rot.autoY + rot.mouseY

      // Outer shell rotates on different axes — counter feel
      outerWireframe.rotation.x =  rot.autoX * 0.6 - rot.mouseX * 0.5
      outerWireframe.rotation.y = -rot.autoY * 0.8 + rot.mouseY * 0.5
      outerWireframe.rotation.z =  rot.autoX * 0.3

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize',     onResize)
      observer.disconnect()
      geometry.dispose()
      edges.dispose()
      material.dispose()
      outerGeometry.dispose()
      outerEdges.dispose()
      outerMaterial.dispose()
      renderer.dispose()
      if (container.contains(canvas)) container.removeChild(canvas)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hidden md:block"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'all',
      }}
    />
  )
}
