import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import { Inter, Manrope } from 'next/font/google'
import { Providers } from './Providers'
import { isLang, negotiateLang, LANG_COOKIE, THEME_COOKIE } from '@/i18n/config'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'cyrillic'], display: 'swap' })
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'ApexSAT — Master the Score. Own the Journey.', template: '%s · ApexSAT' },
  description: 'Gamified SAT prep: video lessons, SAT-style practice, a mistake bank with spaced repetition, weekly leagues and streaks.',
  applicationName: 'ApexSAT',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090D16' },
    { media: '(prefers-color-scheme: light)', color: '#F4F6FB' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [jar, hdrs] = await Promise.all([cookies(), headers()])
  const cookieLang = jar.get(LANG_COOKIE)?.value
  const lang = isLang(cookieLang) ? cookieLang : negotiateLang(hdrs.get('accept-language'))
  const theme = jar.get(THEME_COOKIE)?.value === 'light' ? 'light' : 'dark'

  return (
    <html lang={lang} className={`${inter.variable} ${manrope.variable} ${theme}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-bg antialiased">
        <Providers lang={lang} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
