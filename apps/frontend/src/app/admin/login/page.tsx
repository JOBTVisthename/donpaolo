'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Credenziali non valide'); return }
    router.push('/admin/ceo')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-8 shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Pregare Insieme</h1>
        <p className="text-center text-gray-600">Area riservata</p>
        {error && <div className="rounded bg-red-50 px-4 py-2 text-red-700">{error}</div>}
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded border px-4 py-2" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded border px-4 py-2" />
        <button disabled={loading} className="w-full rounded bg-amber-700 py-2 text-white">{loading ? 'Accesso...' : 'Accedi'}</button>
      </form>
    </div>
  )
}
