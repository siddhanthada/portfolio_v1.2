'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
type ThemeContextType = { theme: Theme; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
    const initial = stored ?? preferred
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const isReduced =
      document.documentElement.getAttribute('data-reduced-motion') === 'true'

    if (isReduced) {
      setTheme(next)
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('portfolio-theme', next)
      return
    }

    window.dispatchEvent(new CustomEvent('theme-glitch'))

    const applyTheme = () => {
      setTheme(next)
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('portfolio-theme', next)
      window.removeEventListener('apply-theme-change', applyTheme)
    }
    window.addEventListener('apply-theme-change', applyTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
