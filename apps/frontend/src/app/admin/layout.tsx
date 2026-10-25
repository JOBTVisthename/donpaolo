import type { Metadata } from 'next'
import AdminGuard from '@/components/AdminGuard'

export const metadata: Metadata = { title: 'Admin - Pregare Insieme' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
