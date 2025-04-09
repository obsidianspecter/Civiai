import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'AI Assistant - CiviAI',
  description: 'Chat with our Civil Engineering AI Assistant for expert guidance and answers',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return children
} 