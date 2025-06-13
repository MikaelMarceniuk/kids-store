import { Header } from '@/src/common/components/header'
import { SessionProvider } from '@/src/common/providers/session.provider'
import type React from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen min-w-[100vw]">
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="p-4 md:p-6 flex-1">{children}</div>
        </main>
      </div>
    </SessionProvider>
  )
}
