'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMenu, FiX, FiLogOut, FiHome, FiUsers, FiAlertTriangle, FiImage } from 'react-icons/fi'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-spiritual-900 text-white transition-all ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${ !sidebarOpen && 'hidden' }`}>Emmaus</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-spiritual-800 rounded"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spiritual-800 transition"
          >
            <FiHome size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spiritual-800 transition"
          >
            <FiUsers size={20} />
            {sidebarOpen && <span>Utenti</span>}
          </Link>
          <Link
            href="/admin/alerts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spiritual-800 transition"
          >
            <FiAlertTriangle size={20} />
            {sidebarOpen && <span>Alert</span>}
          </Link>
          <Link href="/admin/social" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-spiritual-800 transition">
            <FiImage size={20} />
            {sidebarOpen && <span>Social</span>}
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-spiritual-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/20 rounded-lg transition"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${ sidebarOpen ? 'ml-64' : 'ml-20' } transition-all`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
