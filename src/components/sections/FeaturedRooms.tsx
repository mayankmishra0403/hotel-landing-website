'use client'

import RoomCard from '@/components/rooms/RoomCard'
import { Button } from '@/components/ui/button'
import { roomsData } from '@/data/hotel'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeaturedRooms() {
  const featuredRooms = roomsData.slice(0, 3)

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #000 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 inline-block">
              ✨ Luxury Accommodations
            </span>
          </motion.div>
          
          <h2 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rooms & Suites
            </span>
          </h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our carefully curated selection of luxury accommodations, 
            each designed to provide you with the ultimate comfort and elegance.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {featuredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
              viewport={{ once: true }}
            >
              <RoomCard
                room={room}
                onBookNow={() => {
                  console.log('Booking room:', room.id)
                }}
                onViewDetails={() => {
                  console.log('Viewing room details:', room.id)
                }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/rooms">
              <Button 
                variant="gradient" 
                size="xl" 
                className="px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl"
              >
                <span className="mr-2">🏨</span>
                Explore All Rooms
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
