'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Room } from '@/types/hotel'
import { formatCurrency } from '@/lib/utils'
import { 
  Users, 
  Bed, 
  Maximize, 
  Wifi, 
  Coffee, 
  Car, 
  Tv,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye
} from 'lucide-react'
import { motion } from 'framer-motion'

interface RoomCardProps {
  room: Room
  onBookNow?: () => void
  onViewDetails?: () => void
}

export default function RoomCard({ room, onBookNow, onViewDetails }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === room.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? room.images.length - 1 : prev - 1
    )
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="w-4 h-4" />
    if (amenityLower.includes('coffee')) return <Coffee className="w-4 h-4" />
    if (amenityLower.includes('parking')) return <Car className="w-4 h-4" />
    if (amenityLower.includes('tv')) return <Tv className="w-4 h-4" />
    return <Star className="w-4 h-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -10,
        rotateY: 2,
        scale: 1.02
      }}
      className="group perspective-1000"
    >
      <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-white relative transform-gpu">
        {/* Enhanced Image Carousel */}
        <div className="relative h-72 overflow-hidden rounded-t-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url("${room.images[currentImageIndex] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"}")`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Image Navigation */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {room.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Enhanced Availability Badge */}
          <motion.div 
            className="absolute top-4 left-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Badge 
              variant={room.available ? "default" : "secondary"}
              className={`${room.available 
                ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700" 
                : "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
              } text-white font-semibold px-3 py-1 shadow-lg backdrop-blur-sm border-0`}
            >
              {room.available ? "✨ Available" : "❌ Booked"}
            </Badge>
          </motion.div>

          {/* Enhanced Price Badge */}
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Badge className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-4 py-2 text-sm shadow-xl backdrop-blur-sm border-0 transform hover:scale-105 transition-all duration-300">
              {formatCurrency(room.price)}<span className="text-xs opacity-90">/night</span>
            </Badge>
          </motion.div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {room.name}
            </h3>
          </div>
          
          {/* Room Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Up to {room.capacity}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{room.bedType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Maximize className="w-4 h-4" />
              <span>{room.size} m²</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {room.description}
          </p>

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-xs"
                >
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {room.amenities.length > 4 && (
                <div className="flex items-center space-x-1 bg-blue-100 rounded-full px-3 py-1 text-xs text-blue-600">
                  <span>+{room.amenities.length - 4} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={onBookNow}
              disabled={!room.available}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
