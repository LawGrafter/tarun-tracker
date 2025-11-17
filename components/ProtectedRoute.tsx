'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
}
