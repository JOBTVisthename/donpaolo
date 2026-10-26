import axios from 'axios'
import { supabase } from './supabase'

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function api() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return axios.create({
    baseURL: `${base}/api/v1`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
