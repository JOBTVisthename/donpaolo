'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (path === '/admin/login') { setOk(true); return }
    supabase.auth.getSession().then(({ data }) => {
      const mail = data.session?.user.email
      if (mail && mail === process.env.NEXT_PUBLIC_ADMIN_EMAIL) setOk(true)
      else router.replace('/admin/login')
    })
  }, [path, router])

  return ok ? <>{children}</> : null
}
