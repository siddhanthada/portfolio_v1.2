'use client'

import { useEffect, ReactNode } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function GameModal({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(8,8,8,0.97)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'default',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
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
              zIndex: 10000,
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div
            style={{
              position: 'fixed',
              top: 22,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              zIndex: 10000,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>

          {/* Content */}
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              marginTop: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              flex: 1,
            }}
          >
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
