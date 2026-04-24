'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m, useScroll, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { projects, type Project } from '@/lib/projects'
import ScrollReveal from '@/components/motion/ScrollReveal'

const GAP = 32

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(Math.max(t, 0), 1)
}

function remap(p: number, start: number, end: number): number {
  return Math.min(Math.max((p - start) / (end - start), 0), 1)
}

const easeInOutCubic = (v: number) =>
  v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2

function ProjectCardInner({
  project,
  cardRef,
}: {
  project: Project
  cardRef?: React.Ref<HTMLDivElement>
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <m.div
      ref={cardRef}
      data-cursor-text="View Work →"
      whileHover="hover"
      initial="rest"
      animate="rest"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        cursor: project.href ? 'pointer' : 'default',
      }}
      variants={{
        rest: { y: 0, borderColor: 'var(--border)' },
        hover: { y: -6, borderColor: '#2E2E2E' },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
        {project.slug === 'smart-cards' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/work/smart-cards/main-frame-image.png"
              alt={project.name}
              width={400}
              height={600}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </div>
        ) : (project.slug === 'customer-360' || project.slug === 'locus-last-mile' || project.slug === 'charts-modernisation') ? (
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Image
                src={
                  project.slug === 'locus-last-mile'
                    ? '/work/locus-last-mile/assignment-dashboard.png'
                    : project.slug === 'charts-modernisation'
                    ? '/work/charts-modernisation/charts-hero.png'
                    : '/work/customer-360-new/hero-image.png'
                }
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <m.div
              style={{
                position: 'absolute',
                inset: 0,
                background: project.gradient,
              }}
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.04 },
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: project.accentColor,
                opacity: 0.25,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: project.accentColor,
                opacity: 0.15,
              }}
            />
          </>
        )}
      </div>

      {/* Content area */}
      <div
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: 'var(--accent)',
              letterSpacing: '0.1em',
            }}
          >
            {project.number}
          </span>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.04em',
              textAlign: 'right',
            }}
          >
            {project.tags.join(', ')}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 'var(--text-xl)',
            color: 'var(--text)',
            fontWeight: 500,
            marginTop: 8,
            lineHeight: 1.25,
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted)',
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          {project.oneLiner}
        </p>

        <m.div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          variants={{
            rest: { x: 0 },
            hover: { x: 4 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans, sans-serif)',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            View Case Study →
            {project.slug === 'charts-modernisation' && (
              <Lock size={10} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            )}
          </span>
        </m.div>
      </div>
    </m.div>
  )
}

function ProjectCard({
  project,
  cardRef,
}: {
  project: Project
  cardRef?: React.Ref<HTMLDivElement>
}) {
  if (project.href) {
    return (
      <Link href={project.href} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
        <ProjectCardInner project={project} cardRef={cardRef} />
      </Link>
    )
  }
  return <ProjectCardInner project={project} cardRef={cardRef} />
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Per-card raw progress [0→1] over their individual input ranges
  const rawP1 = useTransform(scrollYProgress, [0.0,  0.38], [0, 1])
  const rawP2 = useTransform(scrollYProgress, [0.03, 0.41], [0, 1])
  const rawP3 = useTransform(scrollYProgress, [0.06, 0.44], [0, 1])
  const rawP4 = useTransform(scrollYProgress, [0.09, 0.47], [0, 1])

  // Eased progress — ease-in-out cubic for snappy settle
  const easedP1 = useTransform(rawP1, easeInOutCubic)
  const easedP2 = useTransform(rawP2, easeInOutCubic)
  const easedP3 = useTransform(rawP3, easeInOutCubic)
  const easedP4 = useTransform(rawP4, easeInOutCubic)

  // Rotation and scale — declarative via useTransform, no DOM measurement needed
  const card1rot   = useTransform(easedP1, [0, 1], [-1.5, 0])
  const card2rot   = useTransform(easedP2, [0, 1], [2.0, 0])
  const card2scale = useTransform(easedP2, [0, 1], [0.98, 1.0])
  const card3rot   = useTransform(easedP3, [0, 1], [-1.0, 0])
  const card3scale = useTransform(easedP3, [0, 1], [0.96, 1.0])
  const card4rot   = useTransform(easedP4, [0, 1], [1.5, 0])
  const card4scale = useTransform(easedP4, [0, 1], [0.94, 1.0])

  // x/y motion values — updated imperatively because they depend on card dimensions
  const card2x = useMotionValue(0)
  const card2y = useMotionValue(5)
  const card3x = useMotionValue(-5)
  const card3y = useMotionValue(0)
  const card4x = useMotionValue(0)
  const card4y = useMotionValue(0)

  useEffect(() => {
    if (prefersReducedMotion) return

    const updateCards = (p: number) => {
      if (!card1Ref.current) return
      if (window.innerWidth < 768) return

      const rect = card1Ref.current.getBoundingClientRect()
      const cardW = rect.width
      const cardH = rect.height

      // Apply easing to per-card remapped progress
      const e2 = easeInOutCubic(remap(p, 0.03, 0.41))
      const e3 = easeInOutCubic(remap(p, 0.06, 0.44))
      const e4 = easeInOutCubic(remap(p, 0.09, 0.47))

      // Cards start stacked at center (card 1 position) + small fan offsets
      // x/y values animate from stacked position to natural grid position (0, 0)
      card2x.set(lerp(6 - (cardW + GAP), 0, e2))
      card2y.set(lerp(5, 0, e2))
      card3x.set(lerp(-5, 0, e3))
      card3y.set(lerp(8 - (cardH + GAP), 0, e3))
      card4x.set(lerp(9 - (cardW + GAP), 0, e4))
      card4y.set(lerp(12 - (cardH + GAP), 0, e4))
    }

    const initTimer = setTimeout(() => updateCards(scrollYProgress.get()), 100)
    const unsubscribe = scrollYProgress.on('change', updateCards)

    return () => {
      clearTimeout(initTimer)
      unsubscribe()
    }
  }, [scrollYProgress, prefersReducedMotion, card2x, card2y, card3x, card3y, card4x, card4y])

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        backgroundColor: 'var(--bg)',
        paddingTop: 120,
        paddingBottom: 120,
      }}
      className="py-20 md:py-[120px]"
    >
      <div className="container">
        {/* Heading block */}
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 64,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Selected Work
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--text)',
                  fontWeight: 400,
                  lineHeight: 1.25,
                }}
              >
                Four projects. One obsession - clarity.
              </h2>
            </div>
            <span
              className="hidden md:block"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted)',
                paddingTop: 4,
              }}
            >
              (2022 — 2026)
            </span>
          </div>
        </ScrollReveal>

        {/* Desktop fan-out grid */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: '1fr 1fr',
            gridAutoRows: '1fr',
            gap: GAP,
          }}
        >
          {/* Card 1 — anchor: de-spins from -1.5° */}
          <m.div ref={card1Ref} style={{ rotate: card1rot, height: '100%' }}>
            <ProjectCard project={projects[0]} />
          </m.div>

          {/* Card 2 — fans to top-right */}
          <m.div style={{ x: card2x, y: card2y, rotate: card2rot, scale: card2scale, height: '100%' }}>
            <ProjectCard project={projects[1]} />
          </m.div>

          {/* Card 3 — fans to bottom-left */}
          <m.div style={{ x: card3x, y: card3y, rotate: card3rot, scale: card3scale, height: '100%' }}>
            <ProjectCard project={projects[2]} />
          </m.div>

          {/* Card 4 — fans to bottom-right */}
          <m.div style={{ x: card4x, y: card4y, rotate: card4rot, scale: card4scale, height: '100%' }}>
            <ProjectCard project={projects[3]} />
          </m.div>
        </div>

        {/* Mobile vertical list */}
        <div
          className="flex md:hidden flex-col"
          style={{ gap: 24 }}
        >
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
