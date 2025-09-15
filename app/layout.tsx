import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'LegalCore Pro - Professional Legal Management',
  description: 'Comprehensive legal practice management software for law firms. Manage cases, clients, documents, billing and more.',
  keywords: 'legal software, law firm management, case management, legal billing, document management',
  authors: [{ name: 'LegalCore Pro Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 via-blue-50/30 to-white antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 via-blue-50/20 to-white">
              {children}
            </main>
          </div>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl',
          }}
        />
      </body>
    </html>
  )
}