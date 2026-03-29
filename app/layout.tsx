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
