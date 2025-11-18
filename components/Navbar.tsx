'use client'

import Link from 'next/link'
import { BookOpen, Home, FolderOpen, Sparkles, Paperclip, LogOut, StickyNote, Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/subjects', label: 'Subjects', icon: FolderOpen },
    { href: '/topics', label: 'All Topics', icon: BookOpen },
    { href: '/notes', label: 'Notes', icon: StickyNote },
    { href: '/resources', label: 'Resources', icon: Paperclip },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 shadow-lg shadow-gray-100/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <BookOpen className="h-6 w-6 text-primary" />
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                AI Study Tracker
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
              {/* Desktop Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Mobile Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300',
                          pathname === item.href
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Logout Button at Bottom */}
                <div className="p-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
