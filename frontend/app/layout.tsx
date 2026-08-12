import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { ReviewsProvider } from '@/context/reviews-context'
import Header from '@/components/header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Gaming Platform — Discover & Review Games',
  description: 'Browse, track, and review the best games across all genres and platforms.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          <ReviewsProvider>
            <Header />
            {children}
          </ReviewsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
