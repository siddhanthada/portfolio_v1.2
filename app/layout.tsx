import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import RootClient from '@/components/RootClient'
import { ThemeProvider } from '@/lib/ThemeContext'
import GlitchOverlay from '@/components/ui/GlitchOverlay'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Siddhant Hada - Product Designer 2',
  description: 'Product Designer with 6+ years of experience designing enterprise software. Currently at o9 Solutions, Bangalore.',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Blocking script: reads saved theme from localStorage before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('portfolio-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){}` }} />
      </head>
      <body>
        <ThemeProvider>
          <GlitchOverlay />
          <RootClient>{children}</RootClient>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
