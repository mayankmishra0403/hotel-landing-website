'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, Mail, MapPin, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { user } = useAuth()

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Close menu on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMenuOpen])

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Enhanced Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-3">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 hover:text-yellow-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+1 (555) 123-4567</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 hover:text-yellow-300 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="w-4 h-4" />
              <span className="font-medium">info@hotelritam.com</span>
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center space-x-2 hover:text-yellow-300 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="w-4 h-4" />
            <span className="font-medium">123 Luxury Avenue, Downtown</span>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Enhanced Logo */}
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Hotel </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-500">
                Ritam
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/rooms" className="text-gray-700 hover:text-blue-600 font-medium">
              Rooms
            </Link>
            <Link href="/amenities" className="text-gray-700 hover:text-blue-600 font-medium">
              Amenities
            </Link>
            <Link href="/dining" className="text-gray-700 hover:text-blue-600 font-medium">
              Dining
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link href="/profile">
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user.name || 'Account'}</span>
                  </div>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
              )}
            <Button variant="gradient">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav 
            className="md:hidden py-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLinkClick}>
                Home
              </Link>
              <Link href="/rooms" className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLinkClick}>
                Rooms
              </Link>
              <Link href="/amenities" className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLinkClick}>
                Amenities
              </Link>
              <Link href="/dining" className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLinkClick}>
                Dining
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLinkClick}>
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Welcome, {user.name}
                    </div>
                    <Link href="/profile" onClick={handleLinkClick}>
                      <Button variant="outline" size="sm" className="w-full">
                        My Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href="/auth/login" onClick={handleLinkClick}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </Link>
                )}
                <Button variant="gradient" size="sm" onClick={handleLinkClick}>
                  Book Now
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  )
}
