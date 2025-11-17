'use client'

import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't protect the login page
  if (pathname === '/login') {
    return <>{children}</>
  }
  
  // Protect all other routes
  return <ProtectedRoute>{children}</ProtectedRoute>
}
