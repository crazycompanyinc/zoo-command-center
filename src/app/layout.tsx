import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZOO Command Center',
  description: 'Ecosystem Dashboard — ZOO Technologies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0a0a0b] text-[#f0f0f0] antialiased">{children}</body>
    </html>
  )
}
