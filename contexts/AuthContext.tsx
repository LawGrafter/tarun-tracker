'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('tarun_voice_auth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = () => {
    localStorage.setItem('tarun_voice_auth', 'authenticated')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('tarun_voice_auth')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
