'use client'

import Link from 'next/link'
import { BookOpen, Home, FolderOpen, Sparkles, Paperclip, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/subjects', label: 'Subjects', icon: FolderOpen },
    { href: '/topics', label: 'All Topics', icon: BookOpen },
    { href: '/resources', label: 'Resources', icon: Paperclip },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 shadow-lg shadow-gray-100/50"
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-400 absolute -top-1 -right-1" />
            </motion.div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent hidden xs:block">
              AI Study Tracker
            </span>
            <span className="text-base font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent xs:hidden">
              Study
            </span>
          </Link>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            {/* Logout Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-4 touch-manipulation"
              >
                <LogOut className="h-4 w-4 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
