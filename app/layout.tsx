import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import ThemeProviderWrapper from './components/layout/ThemeProviderWrapper'
import AppShell from './components/layout/AppShell'

export const metadata: Metadata = {
  title: 'AgentSave Dashboard',
  description: 'Save 30% on AI agent costs. One line of code.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeProviderWrapper>
          <AppShell>{children}</AppShell>
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
