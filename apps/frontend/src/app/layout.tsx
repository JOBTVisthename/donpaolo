import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'Pregare Insieme – La forza della preghiera, insieme',
  description: 'Preghiera, ascolto e fede cristiana su WhatsApp. 7 giorni gratis, poi 2,90 € al mese.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={lora.variable}>
      <body>{children}</body>
    </html>
  )
}
