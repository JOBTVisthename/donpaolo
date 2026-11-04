'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

type Post = { id: string; platform: 'instagram' | 'facebook'; image_url: string; caption: string; status: string; scheduled_for: string | null; error?: string | null }

const API = (process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/social'
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '') || ''
const call = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(API + path, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}`, ...(init.headers || {}) } })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.error || `Errore ${r.status}`)
  return j
}
const toLocal = (iso: string | null) => { if (!iso) return ''; const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16) }

async function toJpegBase64(file: File): Promise<string> {
  const img = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
  const c = document.createElement('canvas')
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.85).split(',')[1]
}

function Card({ p, onChange }: { p: Post; onChange: () => void }) {
  const [caption, setCaption] = useState(p.caption)
  const [when, setWhen] = useState(toLocal(p.scheduled_for))
  const [busy, setBusy] = useState(false)
  const save = async (status?: string) => {
    setBusy(true)
    try {
      await call(`/posts/${p.id}`, { method: 'PATCH', body: JSON.stringify({ caption, scheduled_for: when ? new Date(when).toISOString() : null, ...(status ? { status } : {}) }) })
      onChange()
    } catch (e: any) { alert(e.message) } finally { setBusy(false) }
  }
  const remove = async () => { if (!confirm('Eliminare questo post?')) return; await call(`/posts/${p.id}`, { method: 'DELETE' }); onChange() }
  return (
    <div className="flex gap-4 rounded-lg bg-white p-4 shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image_url} alt="" className="h-32 w-32 flex-none rounded object-cover" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded bg-gray-100 px-2 py-0.5 font-medium capitalize">{p.platform}</span>
          <span className={p.status === 'approved' ? 'text-green-700' : p.status === 'published' ? 'text-blue-700' : 'text-gray-500'}>{p.status}</span>
        </div>
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} className="w-full rounded border p-2 text-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="rounded border p-1 text-sm" />
          <button disabled={busy} onClick={() => save()} className="rounded border px-3 py-1 text-sm">Salva</button>
          <button disabled={busy || !when} onClick={() => save('approved')} className="rounded bg-green-700 px-3 py-1 text-sm text-white disabled:opacity-40">Approva</button>
          <button onClick={remove} className="ml-auto text-sm text-red-600">Elimina</button>
        </div>
      </div>
    </div>
  )
}

export default function SocialPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [when, setWhen] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => { try { setPosts((await call('/posts')).posts) } catch (e: any) { setMsg(e.message) } }, [])
  useEffect(() => { if (!token()) router.push('/admin/login'); else load() }, [load, router])

  const generate = async () => {
    if (!file) return
    setBusy(true); setMsg('Carico l’immagine e preparo le bozze…')
    try {
      const { url } = await call('/upload', { method: 'POST', body: JSON.stringify({ dataBase64: await toJpegBase64(file) }) })
      await call('/generate', { method: 'POST', body: JSON.stringify({ imageUrl: url, note, scheduledFor: when ? new Date(when).toISOString() : null }) })
      setFile(null); setNote(''); setWhen(''); setMsg('Bozze create: controllale qui sotto.'); load()
    } catch (e: any) { setMsg(e.message) } finally { setBusy(false) }
  }

  const days = posts.reduce<Record<string, Post[]>>((a, p) => {
    const k = p.scheduled_for ? new Date(p.scheduled_for).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Senza data'
    ;(a[k] = a[k] || []).push(p); return a
  }, {})

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social</h1>
          <p className="mt-2 text-gray-600">Carica un’immagine: preparo le bozze per Instagram e Facebook, tu le correggi e le approvi.</p>
        </div>
        <div className="space-y-3 rounded-lg bg-white p-4 shadow">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota facoltativa (tema, santo, occasione)" className="w-full rounded border p-2 text-sm" />
          <div className="flex items-center gap-3">
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="rounded border p-1 text-sm" />
            <button disabled={!file || busy} onClick={generate} className="rounded bg-green-700 px-4 py-2 text-white disabled:opacity-40">{busy ? 'Attendi…' : 'Genera bozze'}</button>
          </div>
          {msg && <p className="text-sm text-gray-600">{msg}</p>}
        </div>
        {Object.entries(days).map(([d, list]) => (
          <section key={d} className="space-y-3">
            <h2 className="text-lg font-semibold capitalize text-gray-800">{d}</h2>
            {list.map((p) => <Card key={p.id + p.caption} p={p} onChange={load} />)}
          </section>
        ))}
        {!posts.length && <p className="text-gray-500">Nessun post ancora.</p>}
      </div>
    </AdminLayout>
  )
}
