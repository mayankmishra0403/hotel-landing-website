'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BookingModal from '@/components/ui/BookingModal'
import { Calendar, Users, Search, Star, Award } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

export default function Hero() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const backgroundImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  const handleSearch = () => {
    setIsBookingModalOpen(true)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  }

  // Deterministic PRNG to avoid hydration mismatch for particles
  const mulberry32 = (seed: number) => {
    let t = seed >>> 0
    return () => {
      t += 0x6d2b79f5
      let r = Math.imul(t ^ (t >>> 15), 1 | t)
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
  }

  const particles = useMemo(() => {
    const rand = mulberry32(123456)
    return Array.from({ length: 20 }).map(() => ({
      left: `${(rand() * 100).toFixed(6)}%`,
      top: `${(rand() * 100).toFixed(6)}%`,
      duration: rand() * 3 + 2,
      delay: rand() * 2,
    }))
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden -mt-[1px]">
      {/* Animated Background Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${image}")` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-blue-900/60" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [-20, -100], opacity: [0, 1, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-24 md:pt-0">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center text-white max-w-6xl mx-auto"
          >
            {/* Hotel Rating Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">5-Star Luxury Hotel</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="block">Welcome to</span>
              <motion.span 
                className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Hotel Ritam
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-3xl mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Experience unparalleled luxury and comfort in the heart of the city. 
              <br className="hidden md:block" />
              Where every moment becomes an <span className="text-yellow-400 font-medium">unforgettable memory</span>.
            </motion.p>

            {/* Enhanced Booking Form */}
            <motion.div
              variants={itemVariants}
              className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-5xl mx-auto border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              }}
            >
              {/* Form Title */}
              <motion.div
                variants={itemVariants}
                className="text-center mb-8"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Stay</h3>
                <p className="text-gray-300">Book your luxury experience today</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                {/* Check In */}
                <motion.div 
                  variants={itemVariants}
                  className="group"
                >
                  <label className="block text-sm font-semibold mb-3 text-gray-200 group-hover:text-white transition-colors">
                    Check In
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-14 rounded-xl backdrop-blur-sm hover:bg-white/20 focus:bg-white/20 transition-all duration-300 text-lg"
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>

                {/* Check Out */}
                <motion.div 
                  variants={itemVariants}
                  className="group"
                >
                  <label className="block text-sm font-semibold mb-3 text-gray-200 group-hover:text-white transition-colors">
                    Check Out
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-14 rounded-xl backdrop-blur-sm hover:bg-white/20 focus:bg-white/20 transition-all duration-300 text-lg"
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>

                {/* Guests */}
                <motion.div 
                  variants={itemVariants}
                  className="group"
                >
                  <label className="block text-sm font-semibold mb-3 text-gray-200 group-hover:text-white transition-colors">
                    Guests
                  </label>
                  <div className="relative">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full h-14 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 hover:bg-white/20 transition-all duration-300 text-lg backdrop-blur-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num} className="text-gray-900 bg-white">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-white transition-colors" />
                  </div>
                </motion.div>

                {/* Enhanced Search Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="h-14 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full group"
                  >
                    <Search className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Search Luxury Rooms
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mt-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="xl"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-xl font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Special Offers
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-80"
            >
              <div className="flex items-center space-x-2 text-sm">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Award Winning</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-5 h-5 text-blue-400" />
                <span>10,000+ Happy Guests</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center group-hover:border-yellow-400 transition-colors duration-300">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-4 bg-gradient-to-b from-white to-yellow-400 rounded-full mt-2"
          />
        </div>
        <p className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors">Scroll to explore</p>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </section>
  )
}
