import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solar System Explorer | 太阳系探索者',
  description: 'An interactive 3D visualization of our solar system with real-time planetary positions',
  keywords: ['solar system', 'planets', '3D', 'astronomy', 'space', 'visualization'],
  authors: [{ name: 'Solar System Explorer' }],
  openGraph: {
    title: 'Solar System Explorer',
    description: 'Explore our solar system in stunning 3D',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

