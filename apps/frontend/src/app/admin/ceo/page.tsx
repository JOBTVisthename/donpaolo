// apps/frontend/src/app/admin/ceo/page.tsx
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  FiUsers, FiMessageSquare, FiAlertTriangle, FiSearch, 
  FiFilter, FiX, FiUser, FiCalendar, FiMapPin 
} from 'react-icons/fi'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface User {
  id: string
  name: string
  phone_number: string
  province: string
  parrocchia: string
  risk_level: 'none' | 'low' | 'medium' | 'high'
  subscription_status: string
  birth_date?: string
  last_contact?: string
}

interface Message {
  id: string
  user_message: string
  ai_response: string
  created_at: string
}

export default function CEODashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')

  // Mock data per il grafico
  const chartData = [
    { name: 'Lun', messaggi: 120 },
    { name: 'Mar', messaggi: 150 },
    { name: 'Mer', messaggi: 300 },
    { name: 'Gio', messaggi: 280 },
    { name: 'Ven', messaggi: 400 },
    { name: 'Sab', messaggi: 350 },
    { name: 'Dom', messaggi: 500 },
  ]

  useEffect(() => {
    fetchUsers()
  }, [filterRisk])

  const fetchUsers = async () => {
    try {
      // In produzione: const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations?risk=${filterRisk}`)
      // Simulazione per anteprima:
      setUsers([
        { id: '1', name: 'Mario Rossi', phone_number: '+39 333 1234567', province: 'Roma', parrocchia: 'San Pietro', risk_level: 'high', subscription_status: 'active', last_contact: '2024-05-23T10:00:00Z' },
        { id: '2', name: 'Giulia Bianchi', phone_number: '+39 347 7654321', province: 'Milano', parrocchia: 'Duomo', risk_level: 'none', subscription_status: 'trial', last_contact: '2024-05-23T09:30:00Z' },
      ])
    } catch (err) {
      toast.error('Errore caricamento utenti')
    }
  }

  const openUserDrawer = async (user: User) => {
    setSelectedUser(user)
    try {
      // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations/${user.id}`)
      // setChatHistory(res.data)
      setChatHistory([
        { id: '1', user_message: 'Don Paolo, mi sento molto solo oggi.', ai_response: 'Caro Mario, la solitudine può essere un deserto, ma ricorda che il Signore cammina sempre al tuo fianco...', created_at: '2024-05-23T08:00:00Z' }
      ])
    } catch (err) {
      toast.error('Errore caricamento chat')
    }
  }

  return (
    <AdminLayout>
      <Toaster />
      <div className="space-y-6">
        {/* Header & Metrics */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard CEO</h1>
            <p className="text-gray-600">Monitoraggio attività spirituale e supporto comunità</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Utenti Totali" value="1.240" icon={<FiUsers />} color="blue" />
          <StatCard title="Attivi Oggi" value="482" icon={<FiMessageSquare />} color="green" />
          <StatCard title="Rosari Guidati" value="89" icon={<FiUsers />} color="purple" />
          <StatCard title="Alert Rischio" value="3" icon={<FiAlertTriangle />} color="red" />
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="md:col-span-2 card p-6">
            <h3 className="text-lg font-bold mb-4">Traffico Messaggi (Settimana)</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="messaggi" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* High Risk Alert Box */}
          <div className="card p-6 bg-red-50 border-red-100 flex flex-col justify-center">
            <FiAlertTriangle className="text-red-600 mb-2" size={32} />
            <h3 className="text-red-900 font-bold text-xl">Attenzione Rischio</h3>
            <p className="text-red-700 text-sm mt-1">Ci sono 3 utenti che hanno espresso pensieri critici o isolamento grave nelle ultime 2 ore.</p>
            <button onClick={() => setFilterRisk('high')} className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg font-bold text-sm">GESTISCI ORA</button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between bg-gray-50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cerca nome o telefono..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-spiritual-500 bg-white"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-2 border rounded-lg bg-white text-sm"
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value="all">Tutti i livelli di rischio</option>
                <option value="high">Rischio Alto 🔴</option>
                <option value="medium">Rischio Medio 🟠</option>
                <option value="low">Rischio Basso 🟡</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Utente</th>
                <th className="px-6 py-4">Territorio</th>
                <th className="px-6 py-4">Rischio</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4 text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => openUserDrawer(user)}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.phone_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{user.province}</div>
                    <div className="text-gray-500 text-xs">{user.parrocchia}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                      user.risk_level === 'medium' ? 'bg-orange-100 text-orange-700' :
                      user.risk_level === 'low' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-600">{user.subscription_status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-spiritual-600 font-bold">Vedi Chat &rarr;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONVERSATION DRAWER (Anteprima Live) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-4 border-b flex items-center justify-between bg-spiritual-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser size={20} />
                </div>
                <div>
                  <h2 className="font-bold">{selectedUser.name}</h2>
                  <p className="text-xs opacity-80">{selectedUser.phone_number}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            {/* User Info Quick Summary */}
            <div className="p-4 bg-gray-50 grid grid-cols-2 gap-4 text-xs border-b">
              <div className="flex items-center gap-2"><FiMapPin className="text-gray-400" /> {selectedUser.province} - {selectedUser.parrocchia}</div>
              <div className="flex items-center gap-2"><FiCalendar className="text-gray-400" /> Nascita: 12/05/1975</div>
            </div>

            {/* Chat History Area (WhatsApp Style) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />
              
              {chatHistory.map(chat => (
                <div key={chat.id} className="space-y-4 relative">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
                      <p className="text-sm text-gray-800">{chat.user_message}</p>
                      <div className="text-[10px] text-gray-500 text-right mt-1">
                        {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-xs font-bold text-spiritual-600 mb-1">Don Paolo</p>
                      <p className="text-sm text-gray-800">{chat.ai_response}</p>
                      <div className="text-[10px] text-gray-400 text-right mt-1">
                        {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer / Direct Message */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Invia messaggio diretto..." 
                  className="flex-1 px-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-spiritual-500"
                />
                <button className="p-2 bg-spiritual-600 text-white rounded-full"><FiUsers size={18} /></button>
              </div>
              <button className="w-full mt-3 py-2 border border-green-500 text-green-600 rounded-lg text-xs font-bold hover:bg-green-50">SEGNA COME GESTITO</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  }
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}