'use client'

import { useState, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, null]

function countInversions(tiles: (number | null)[]) {
  const nums = tiles.filter((t): t is number => t !== null)
  let inv = 0
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] > nums[j]) inv++
  return inv
}

function generateSolvable() {
  let tiles: (number | null)[]
  do {
    tiles = [...GOAL].sort(() => Math.random() - 0.5)
  } while (countInversions(tiles) % 2 !== 0 || tiles.join() === GOAL.join())
  return tiles
}

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<(number | null)[]>(generateSolvable)
  const [moves, setMoves] = useState(0)

  const solved = tiles.join() === GOAL.join()

  const handleClick = useCallback((idx: number) => {
    if (solved) return
    const emptyIdx = tiles.indexOf(null)
    const row = Math.floor(idx / 3), col = idx % 3
    const eRow = Math.floor(emptyIdx / 3), eCol = emptyIdx % 3
    const adjacent =
      (Math.abs(row - eRow) === 1 && col === eCol) ||
      (Math.abs(col - eCol) === 1 && row === eRow)
    if (!adjacent) return
    const next = [...tiles]
    next[emptyIdx] = next[idx]
    next[idx] = null
    setTiles(next)
    setMoves(m => m + 1)
  }, [tiles, solved])

  const reset = () => { setTiles(generateSolvable()); setMoves(0) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: 'var(--muted)' }}>
        Moves: {moves}
      </div>

      <m.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 120px)',
          gridTemplateRows: 'repeat(3, 120px)',
          gap: 4,
        }}
      >
        {tiles.map((tile, idx) => (
          <m.div
            key={tile ?? 'empty'}
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            onClick={() => handleClick(idx)}
            whileHover={tile !== null ? { scale: 1.03 } : {}}
            style={{
              width: 120,
              height: 120,
              background: tile !== null ? 'var(--bg-card)' : 'var(--bg)',
              border: tile !== null ? '1px solid var(--border)' : 'none',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: 32,
              fontWeight: 300,
              color: 'var(--text)',
              cursor: tile !== null ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            {tile}
          </m.div>
        ))}
      </m.div>

      <AnimatePresence>
        {solved && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--accent)' }}>
              Solved!
            </div>
            <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
              {moves} moves
            </div>
            <button
              onClick={reset}
              style={{
                marginTop: 14,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                padding: '8px 24px',
                borderRadius: 2,
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 13,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              Play again
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
