import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AthleteOS — Performance Intelligence',
  description: 'Plataforma de inteligência de performance e monitoramento de atletas para o futebol de base.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
