import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Basketball Stat Tracker',
  description: 'Something something',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " flex"}>
        <NavBar/>
        <main className="flex min-h-screen flex-col items-center justify-between p-8 grow">
            {children}
        </main>
      </body>
    </html>
  )
}
