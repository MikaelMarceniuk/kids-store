import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'

import { Toaster } from '../common/components/ui/sonner'
import { QueryClientProvider } from '../common/providers/query-client.provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kids Toy Store - Loja de Brinquedos Infantis',
  description:
    'Loja de brinquedos infantis com uma ampla variedade de produtos para crianças de todas as idades. Encontre brinquedos educativos, jogos, bonecos e muito mais!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <QueryClientProvider>{children}</QueryClientProvider>
        </div>
        <Toaster richColors />
      </body>
    </html>
  )
}
