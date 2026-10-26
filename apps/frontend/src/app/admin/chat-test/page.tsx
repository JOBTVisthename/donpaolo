'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSend, FiMic, FiStopCircle } from 'react-icons/fi'
import { api } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  emotion?: string
}

export default function ChatTest() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Benvenuto 🙏\nMi piacerebbe conoscerti meglio per accompagnarti nella preghiera.\n\nCome preferisci essere chiamato?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate API call to backend
      const testPhone = process.env.NEXT_PUBLIC_TEST_PHONE || ''
      if (!testPhone) throw new Error('Imposta NEXT_PUBLIC_TEST_PHONE in .env.local con il numero di un utente di test')
      const c = await api()
      const response = await c.post('/messages', {
        userId: testPhone,
        content: input,
        type: 'text',
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        emotion: response.data.emotion,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Scusa, ho avuto un problema a procesare il tuo messaggio. Prova di nuovo.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        // Handle audio data
        console.log('Audio recorded:', event.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'sereno':
        return 'bg-green-50'
      case 'ansioso':
        return 'bg-yellow-50'
      case 'triste':
        return 'bg-blue-50'
      case 'paura':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">Test Chat Bot - Emmaus AI</h1>
        <p className="text-sm text-gray-600">Testa le risposte del bot spirituale</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-spiritual-600 text-white'
                  : `${getEmotionColor(message.emotion)} border border-gray-200`
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.emotion && (
                <p className="text-xs mt-2 opacity-75">Emozione: {message.emotion}</p>
              )}
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'opacity-75' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('it-IT')}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Scrivi un messaggio... (es: 'Ho una preoccupazione che mi tormenta')"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-500 disabled:bg-gray-100"
            />

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FiStopCircle size={20} />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <FiMic size={20} />
              </button>
            )}

            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-spiritual-600 text-white rounded-lg hover:bg-spiritual-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FiSend size={20} />
            </button>
          </div>

          {/* Test Prompts */}
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">💡 Test rapidi:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInput('Ho un problema con mio figlio, non so come comunicare')}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-left"
              >
                Problema famigliare
              </button>
              <button
                onClick={() => setInput('Mi sento molto solo e abbandonato da Dio')}
                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-left"
              >
                Isolamento
              </button>
              <button
                onClick={() => setInput('Voglio pregare il rosario, puoi guidarmi?')}
                className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-left"
              >
                Rosario Guidato
              </button>
              <button
                onClick={() => setInput('Non so se posso ancora avere fede dopo quello che mi è successo')}
                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-left"
              >
                Crisi di Fede
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
