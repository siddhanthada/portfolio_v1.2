'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Expand, X } from 'lucide-react'
import ScrollReveal from '@/components/motion/ScrollReveal'
import GameModal from '@/components/playground/GameModal'

const DinoGame = dynamic(() => import('@/components/playground/games/DinoGame'), { ssr: false })
const PicturePuzzle = dynamic(() => import('@/components/playground/games/PicturePuzzle'), { ssr: false })
const FlowerBouquet = dynamic(() => import('@/components/playground/games/FlowerBouquet'), { ssr: false })
const DVDBounce = dynamic(() => import('@/components/playground/games/DVDBounce'), { ssr: false })
const ReactionTest = dynamic(() => import('@/components/playground/games/ReactionTest'), { ssr: false })
const SnakeGame = dynamic(() => import('@/components/playground/games/SnakeGame'), { ssr: false })

const BikeMap = dynamic(
  () => import('@/components/playground/BikeMap'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 480,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          Loading map...
        </span>
      </div>
    ),
  }
)

const sketches = [
  {
    src: '/work/playground/sketches/billie-joe-armstrong.png',
    name: 'Billie Joe Armstrong',
    meta: 'Graphite · 2021',
  },
  {
    src: '/work/playground/sketches/eiffel-tower.png',
    name: '3D Bridge',
    meta: 'Charcoal · 2020',
  },
  {
    src: '/work/playground/sketches/two-antelopes.png',
    name: 'Two Antelopes',
    meta: 'Graphite · 2022',
  },
]

const plugins = [
  {
    name: 'JSON to Table',
    description:
      'Paste any JSON object and instantly generate a clean, structured table frame in Figma. Built for designers who work with APIs and need to visualise data without leaving the tool.',
    link: 'https://www.figma.com/community/plugin/1234',
    note: null,
    active: true,
    opacity: 1,
  },
  {
    name: 'Skeletal Loader - Charts',
    description:
      'Generate accurate skeletal loaders for different chart types: configure chart structure, theme, and animation, and drop a ready-to-use component straight onto your canvas.',
    link: null,
    note: 'Published for o9',
    active: true,
    opacity: 1,
  },
  {
    name: 'Plugin 03',
    description: 'In progress. More details soon.',
    link: null,
    note: null,
    active: false,
    opacity: 0.55,
  },
]

export default function PlaygroundPage() {
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const openGame = useCallback((i: number) => setActiveGame(i), [])
  const closeGame = useCallback(() => setActiveGame(null), [])
  const [sketchOpen, setSketchOpen] = useState<number | null>(null)
  const [hoveredSketch, setHoveredSketch] = useState<number | null>(null)
  const [ridePhoto, setRidePhoto] = useState<{ src: string; alt: string } | null>(null)

  const GAMES = [
    {
      name: 'Chrome Dino',
      desc: 'Jump over cacti. Space or tap to jump. How far can you go?',
      component: <DinoGame />,
    },
    {
      name: 'Picture Puzzle',
      desc: 'Arrange the pieces of Van Gogh\'s Starry Night. Drag and drop to swap.',
      component: <PicturePuzzle />,
    },
    {
      name: 'Flower Bouquet',
      desc: 'Drag flowers onto the canvas and make something beautiful.',
      component: <FlowerBouquet />,
    },
    {
      name: 'DVD Bounce',
      desc: 'The logo bounces around. You wait for the corner. Classic.',
      component: <DVDBounce />,
    },
    {
      name: 'Reaction Test',
      desc: 'Click the moment it turns green. Find out how fast you actually are.',
      component: <ReactionTest />,
    },
    {
      name: 'Snake',
      desc: 'Eat the dot. Grow longer. Don\'t hit the walls or yourself.',
      component: <SnakeGame />,
    },
  ]

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
    }, 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSketchOpen(null); setRidePhoto(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const { src, alt } = (e as CustomEvent).detail
      setRidePhoto({ src, alt })
    }
    window.addEventListener('open-ride-photo', handler)
    return () => window.removeEventListener('open-ride-photo', handler)
  }, [])

  return (
    <main
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        color: 'var(--text)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 40px',
        }}
      >
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ paddingTop: 140, paddingBottom: 80 }}>
          <m.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Playground
            </span>
          </m.div>

          <m.h1
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400,
              color: 'var(--text)',
              marginTop: 12,
              lineHeight: 1.15,
            }}
          >
            Things I make when no one is watching.
          </m.h1>

          <m.p
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted)',
              marginTop: 10,
            }}
          >
            Sketches, rides, games, experiments.
          </m.p>
        </section>

        {/* ── SECTION 1: SKETCHES ──────────────────────── */}
        <section
          id="sketches"
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Sketches
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 500,
                color: 'var(--text)',
                marginTop: 8,
              }}
            >
              Pencil on paper
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted)',
                marginTop: 8,
                marginBottom: 40,
              }}
            >
              Made between 2020 and 2022. No references, just time.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 20,
              }}
            >
              {sketches.map((sketch, i) => (
                <m.div
                  key={sketch.name}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 30 } }
                  }
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* Image area */}
                  <div
                    style={{
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      width: '100%',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setHoveredSketch(i)}
                    onMouseLeave={() => setHoveredSketch(null)}
                  >
                    <img
                      src={sketch.src}
                      alt={sketch.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 400ms ease',
                      }}
                    />
                    <AnimatePresence>
                      {hoveredSketch === i && (
                        <m.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => { e.stopPropagation(); setSketchOpen(i) }}
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
                        </m.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans, sans-serif)',
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--text)',
                      }}
                    >
                      {sketch.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: 11,
                        color: 'var(--muted)',
                        marginTop: 4,
                      }}
                    >
                      {sketch.meta}
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Sketch lightbox overlays */}
        <AnimatePresence>
          {sketchOpen !== null && (
            <m.div
              key="sketch-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSketchOpen(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 99990,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: 24,
                cursor: 'zoom-out',
              }}
            >
              <button
                onClick={() => setSketchOpen(null)}
                style={{
                  position: 'fixed', top: 20, right: 20,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text)',
                  zIndex: 99991,
                }}
              >
                <X size={16} />
              </button>
              <m.img
                src={sketches[sketchOpen].src}
                alt={sketches[sketchOpen].name}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '90vw', maxHeight: '90vh',
                  objectFit: 'contain', borderRadius: 4,
                  border: '1px solid var(--border)',
                  cursor: 'default',
                }}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* Ride photo lightbox */}
        <AnimatePresence>
          {ridePhoto && (
            <m.div
              key="ride-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setRidePhoto(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 99990,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: 24,
                cursor: 'zoom-out',
              }}
            >
              <button
                onClick={() => setRidePhoto(null)}
                style={{
                  position: 'fixed', top: 20, right: 20,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text)',
                  zIndex: 99991,
                }}
              >
                <X size={16} />
              </button>
              <m.img
                src={ridePhoto.src}
                alt={ridePhoto.alt}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '90vw', maxHeight: '90vh',
                  objectFit: 'contain', borderRadius: 4,
                  border: '1px solid var(--border)',
                  cursor: 'default',
                }}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* ── SECTION 2: BIKE RIDES MAP ────────────────── */}
        <section
          id="rides"
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Rides
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 500,
                color: 'var(--text)',
                marginTop: 8,
              }}
            >
              Rode There
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                marginTop: 8,
                marginBottom: 32,
              }}
            >
              Seven rides on the Himalayan 450. From misty coffee estates to the southernmost tip of
              India.
            </p>

            <BikeMap />
          </ScrollReveal>
        </section>

        {/* ── SECTION 3: GAMES ─────────────────────────── */}
        <section
          id="games"
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Games
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 500,
                color: 'var(--text)',
                marginTop: 8,
              }}
            >
              Play Something
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                marginTop: 8,
                marginBottom: 40,
              }}
            >
              Small things built for fun. No frameworks, no overthinking.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {GAMES.map((game, i) => (
                <m.div
                  key={game.name}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                  whileHover={prefersReducedMotion ? {} : { y: -3, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                    }}
                  >
                    {game.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      marginTop: 6,
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {game.desc}
                  </div>
                  <m.button
                    onClick={() => openGame(i)}
                    whileHover={prefersReducedMotion ? {} : { backgroundColor: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }}
                    transition={{ duration: 0.15 }}
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
                      alignSelf: 'flex-start',
                    }}
                  >
                    Play
                  </m.button>
                </m.div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Game modals */}
        {GAMES.map((game, i) => (
          <GameModal
            key={game.name}
            isOpen={activeGame === i}
            onClose={closeGame}
            title={game.name}
          >
            {activeGame === i ? game.component : null}
          </GameModal>
        ))}

        {/* ── SECTION 4: FIGMA PLUGINS ─────────────────── */}
        <section
          id="experiments"
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            borderTop: '1px solid var(--border)',
          }}
        >
          <ScrollReveal>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Experiments
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 500,
                color: 'var(--text)',
                marginTop: 8,
              }}
            >
              Built This
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 'var(--text-base)',
                color: 'var(--muted)',
                marginTop: 8,
                marginBottom: 40,
              }}
            >
              Figma plugins built to solve real workflow problems.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: 16,
              }}
            >
              {plugins.map((plugin, i) => (
                <m.div
                  key={plugin.name}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          borderColor: 'var(--accent)',
                          transition: { duration: 0.2 },
                        }
                  }
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: 24,
                    opacity: plugin.opacity,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Tag */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 10,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 14,
                    }}
                  >
                    Figma Plugin
                  </span>

                  {/* Name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 500,
                      color: 'var(--text)',
                      marginBottom: 8,
                    }}
                  >
                    {plugin.name}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted)',
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    {plugin.description}
                  </p>

                  {/* CTA */}
                  <div style={{ marginTop: 20 }}>
                    {plugin.active && plugin.link ? (
                      <a
                        href={plugin.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: 11,
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        View on Figma Community ↗
                      </a>
                    ) : plugin.active && plugin.note ? (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: 11,
                          color: 'var(--muted)',
                        }}
                      >
                        {plugin.note}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: 10,
                          color: 'var(--muted)',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: 20,
                          padding: '4px 12px',
                          display: 'inline-block',
                        }}
                      >
                        Coming soon
                      </span>
                    )}
                  </div>
                </m.div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── FOOTER STRIP ─────────────────────────────── */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '40px 0',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            &larr; Back to Portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
