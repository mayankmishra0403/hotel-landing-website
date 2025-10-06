'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import RoomCard from '@/components/rooms/RoomCard'
import EnhancedBookingModal from '@/components/ui/EnhancedBookingModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { roomsData } from '@/data/hotel'
import { Room } from '@/types/hotel'
import { Search, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RoomsPage() {
  const [rooms] = useState<Room[]>(roomsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 })
  const [capacityFilter, setCapacityFilter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  // Transform Room to BookingModal expected format
  const transformRoomForBooking = (room: Room) => ({
    id: room.id,
    name: room.name,
    price: room.price,
    image: room.images[0], // Use first image
    capacity: room.capacity,
    amenities: room.amenities
  })

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = room.price >= priceFilter.min && room.price <= priceFilter.max
    const matchesCapacity = capacityFilter === 0 || room.capacity >= capacityFilter
    
    return matchesSearch && matchesPrice && matchesCapacity
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Rooms & Suites"
        subtitle="Discover our carefully curated selection of luxury accommodations, each designed to provide you with the ultimate comfort and elegance for an unforgettable stay."
        badge="✨ Luxury Accommodations"
        backgroundImage="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070"
        gradientFrom="from-purple-600"
        gradientTo="to-pink-600"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  value={priceFilter.min}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, min: Number(e.target.value) }))}
                  placeholder="Min price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  value={priceFilter.max}
                  onChange={(e) => setPriceFilter(prev => ({ ...prev, max: Number(e.target.value) }))}
                  placeholder="Max price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Min Capacity</label>
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(Number(e.target.value))}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+ Guest</option>
                  <option value={2}>2+ Guests</option>
                  <option value={4}>4+ Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RoomCard
                  room={room}
                  onBookNow={() => {
                    setSelectedRoom(room)
                    setIsBookingModalOpen(true)
                  }}
                  onViewDetails={() => {
                    // Navigate to room details
                    console.log('Viewing room details:', room.id)
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setPriceFilter({ min: 0, max: 1000 })
                setCapacityFilter(0)
              }}
              variant="gradient"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Booking Modal */}
      <EnhancedBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedRoom(null)
        }}
        selectedRoom={selectedRoom ? transformRoomForBooking(selectedRoom) : undefined}
      />
    </div>
  )
}
