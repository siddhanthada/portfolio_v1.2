import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import RootClient from '@/components/RootClient'
import { ThemeProvider } from '@/lib/ThemeContext'
import GlitchOverlay from '@/components/ui/GlitchOverlay'
import BackToTop from '@/components/ui/BackToTop'

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

export const metadata: Metadata = {
  title: 'Siddhant Hada — Product Designer',
  description:
    'Senior Product Designer at o9 Solutions. Building enterprise software for Fortune 100 companies. Bangalore, India.',
  openGraph: {
    title: 'Siddhant Hada — Product Designer',
    description: 'Senior Product Designer. Enterprise · Design Systems · Data Visualisation.',
    url: 'https://siddhant.design',
    siteName: 'siddhant.design',
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
      <body>
        <ThemeProvider>
          <GlitchOverlay />
          <BackToTop />
          <RootClient>{children}</RootClient>
        </ThemeProvider>
      </body>
    </html>
  )
}
