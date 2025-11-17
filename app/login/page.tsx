'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, Lock, Unlock, Volume2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'error'>('idle')
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = 'en-US'
        recognitionInstance.maxAlternatives = 3

        recognitionInstance.onresult = (event: any) => {
          // Get the latest result
          const lastResultIndex = event.results.length - 1
          const speechResult = event.results[lastResultIndex][0].transcript.toLowerCase().trim()
          
          // Only process if it's a final result
          if (event.results[lastResultIndex].isFinal) {
            setTranscript(speechResult)
            
            // Stop recognition to process result
            recognitionInstance.stop()
            
            // Check if user said "i'm tarun" or variations
            if (
              speechResult.includes("i'm tarun") || 
              speechResult.includes("im tarun") ||
              speechResult.includes("i am tarun")
            ) {
              setStatus('success')
              setTimeout(() => {
                login()
                router.push('/')
              }, 1500)
            } else {
              setStatus('error')
              setTimeout(() => {
                setStatus('idle')
                setTranscript('')
              }, 2000)
            }
          } else {
            // Show interim result
            setTranscript(speechResult + '...')
          }
        }

        recognitionInstance.onerror = () => {
          setStatus('error')
          setIsListening(false)
          setTimeout(() => setStatus('idle'), 2000)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [login, router])

  const startListening = () => {
    if (recognition) {
      setStatus('listening')
      setIsListening(true)
      setTranscript('')
      try {
        recognition.start()
      } catch (e) {
        // Already started, ignore
      }
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-cyan-100 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <motion.div
              animate={{
                scale: status === 'success' ? [1, 1.2, 1] : 1,
                rotate: status === 'success' ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              {status === 'success' ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
                  <Image
                    src="/tarun.png"
                    alt="Tarun"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-purple-600 shadow-lg">
                  <Image
                    src="/tarun.png"
                    alt="Tarun"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              )}
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              AI Study Tracker
            </CardTitle>
            <p className="text-gray-600 mt-2">Voice Authentication</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Voice Command Instructions */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Volume2 className="h-5 w-5" />
                <span className="font-medium">Speak Your Identity</span>
              </div>
              <p className="text-sm text-gray-500">Click the microphone and speak clearly</p>
            </div>

            {/* Microphone Button */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={status === 'success'}
                  className={`h-32 w-32 rounded-full text-white transition-all duration-300 ${
                    status === 'listening'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
                      : status === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : status === 'error'
                      ? 'bg-gradient-to-r from-red-600 to-orange-600'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600'
                  }`}
                >
                  <Mic className="h-16 w-16" />
                </Button>
              </motion.div>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status === 'listening' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Listening...</span>
                  </div>
                  {transcript && (
                    <p className="text-sm text-gray-600 italic">
                      Hearing: &ldquo;{transcript}&rdquo;
                    </p>
                  )}
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-2"
                >
                  <div className="text-green-600 font-semibold text-lg">
                    ✅ Welcome, Tarun!
                  </div>
                  <p className="text-sm text-gray-600">Unlocking your dashboard...</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-2"
                >
                  <div className="text-red-600 font-semibold">
                    ❌ Voice not recognized
                  </div>
                  {transcript && (
                    <p className="text-sm text-gray-600">
                      You said: &ldquo;{transcript}&rdquo;
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Incorrect voice command. Try again.</p>
                </motion.div>
              )}

              {status === 'idle' && !transcript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-gray-500"
                >
                  Click the microphone to begin
                </motion.div>
              )}
            </AnimatePresence>

            {/* Browser Support Check */}
            {!recognition && (
              <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                ⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.
              </div>
            )}

            {/* Visual Indicator */}
            {status === 'listening' && (
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-8 bg-gradient-to-t from-purple-600 to-pink-600 rounded-full"
                    animate={{
                      scaleY: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4 text-sm text-gray-600"
        >
          🔒 Secured with voice authentication
        </motion.div>
      </motion.div>
    </div>
  )
}
