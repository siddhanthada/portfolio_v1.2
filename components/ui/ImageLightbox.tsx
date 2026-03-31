'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'

type Props = {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  style?: React.CSSProperties
  className?: string
}

export default function ImageLightbox({
  src, alt, width, height, caption, style, className
}: Props) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Image with hover expand button */}
      <div
        style={{ position: 'relative', display: 'inline-block', width: '100%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={src}
          alt={alt}
          width={width || 760}
          height={height || 480}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: 4,
            border: '1px solid var(--border)',
            ...style,
          }}
          className={className}
          loading="lazy"
        />

        {/* Expand button — top right, shows on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(true)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                zIndex: 10,
              }}
              aria-label="Expand image"
            >
              <Expand size={14} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Caption */}
        {caption && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--muted)',
            textAlign: 'center',
            marginTop: 10,
            letterSpacing: '0.05em',
          }}>
            {caption}
          </p>
        )}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99990,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'zoom-out',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                zIndex: 99991,
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Image container — stop propagation so clicking image doesnt close */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                cursor: 'default',
              }}
            >
              <img
                src={src}
                alt={alt}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </motion.div>

            {/* Caption in lightbox */}
            {caption && (
              <p style={{
                position: 'fixed',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'rgba(240,237,232,0.5)',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>
                {caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
