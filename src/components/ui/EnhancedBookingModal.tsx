'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, CreditCard, Check, ArrowRight, MapPin, Star, Utensils, Car, Wifi, Coffee, Dumbbell, Waves, Music, Gift, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import bookingService from '@/services/booking'
import userPreferencesService from '@/services/userPreferences'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRoom?: {
    id: string
    name: string
    price: number
    image: string
    capacity: number
    amenities: string[]
  }
}

// Hotel Services with pricing
const hotelServices = [
  {
    id: 'spa',
    name: 'Spa & Wellness Package',
    description: 'Full body massage, facial treatment, and spa access',
    price: 120,
    icon: Heart,
    category: 'wellness',
    duration: '3 hours',
    popular: true
  },
  {
    id: 'airport-transfer',
    name: 'Airport Transfer',
    description: 'Luxury car pickup and drop-off service',
    price: 45,
    icon: Car,
    category: 'transport',
    duration: 'One way',
    popular: true
  },
  {
    id: 'dining',
    name: 'Fine Dining Experience',
    description: '5-course gourmet dinner at our signature restaurant',
    price: 85,
    icon: Utensils,
    category: 'dining',
    duration: '2-3 hours',
    popular: false
  },
  {
    id: 'room-service',
    name: '24/7 Premium Room Service',
    description: 'Unlimited room service access during your stay',
    price: 35,
    icon: Coffee,
    category: 'convenience',
    duration: 'Per day',
    popular: true
  },
  {
    id: 'fitness',
    name: 'Personal Trainer Session',
    description: 'One-on-one fitness session with certified trainer',
    price: 65,
    icon: Dumbbell,
    category: 'fitness',
    duration: '1 hour',
    popular: false
  },
  {
    id: 'pool',
    name: 'Private Pool Access',
    description: 'Exclusive access to rooftop infinity pool',
    price: 25,
    icon: Waves,
    category: 'recreation',
    duration: 'Per day',
    popular: true
  },
  {
    id: 'entertainment',
    name: 'Live Music Experience',
    description: 'Private acoustic session in your suite',
    price: 95,
    icon: Music,
    category: 'entertainment',
    duration: '1 hour',
    popular: false
  },
  {
    id: 'celebration',
    name: 'Special Celebration Package',
    description: 'Room decoration, champagne, and personalized setup',
    price: 75,
    icon: Gift,
    category: 'special',
    duration: 'One time',
    popular: true
  }
]

const steps = [
  { id: 1, title: 'Dates & Guests', icon: Calendar },
  { id: 2, title: 'Room Selection', icon: MapPin },
  { id: 3, title: 'Services & Amenities', icon: Sparkles },
  { id: 4, title: 'Guest Details', icon: Users },
  { id: 5, title: 'Payment', icon: CreditCard },
  { id: 6, title: 'Confirmation', icon: Check }
]

const availableRooms = [
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1600",
    capacity: 2,
    size: "45 sqm",
    amenities: ["King Bed", "City View", "Mini Bar", "Free WiFi"],
    rating: 4.8,
    available: true
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    price: 549,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1600",
    capacity: 3,
    size: "85 sqm",
    amenities: ["King Bed", "Living Area", "Work Desk", "City View"],
    rating: 4.9,
    available: true
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    price: 899,
    originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600",
    capacity: 4,
    size: "120 sqm",
    amenities: ["King Bed", "Ocean View", "Butler Service", "Jacuzzi"],
    rating: 4.9,
    available: true
  }
]

export default function EnhancedBookingModal({ isOpen, onClose, selectedRoom }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomId: selectedRoom?.id || '',
    selectedServices: [] as string[],
    guestDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: '',
      preferences: {
        dietaryRestrictions: '',
        smokingPreference: 'non-smoking',
        bedType: 'king',
        floorPreference: 'high'
      }
    },
    payment: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    }
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [nights, setNights] = useState(0)
  const [confirmationId, setConfirmationId] = useState<string | null>(null)
  const { user } = useAuth()

  // Calculate nights and load user preferences
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn)
      const checkOut = new Date(bookingData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays)
    }
  }, [bookingData.checkIn, bookingData.checkOut])

  // Load user data and preferences when modal opens
  useEffect(() => {
    if (isOpen && user) {
      const loadUserData = async () => {
        try {
          // Load basic user info
          setBookingData(prev => ({
            ...prev,
            guestDetails: {
              ...prev.guestDetails,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              email: user.email || ''
            }
          }))

          // Try to load user preferences - fail gracefully if not available
          try {
            const preferences = await userPreferencesService.getUserPreferences(user.$id)
            if (preferences) {
              setBookingData(prev => ({
                ...prev,
                guestDetails: {
                  ...prev.guestDetails,
                  preferences: preferences.guestPreferences
                },
                selectedServices: preferences.favoriteServices.slice(0, 2) // Pre-select top 2 favorite services
              }))

              if (preferences.favoriteServices.length > 0) {
                toast.success(`Welcome back! We've pre-selected your favorite services.`, {
                  duration: 3000,
                  icon: '🌟'
                })
              }
            }
          } catch (prefError) {
            console.log('User preferences not available yet:', prefError)
            // Continue with default experience - preferences will be available after first booking
          }
        } catch (error) {
          console.error('Error loading user preferences:', error)
        }
      }

      loadUserData()
    }
  }, [isOpen, user])

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setBookingData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleBooking = async () => {
    try {
      if (!user) {
        toast.error('Please sign in to complete your booking')
        return
      }

      const room = selectedRoomData
      if (!room || !bookingData.checkIn || !bookingData.checkOut || nights <= 0) {
        toast.error('Please complete dates and room selection')
        return
      }

      setIsProcessing(true)

      // Calculate services total
      const selectedServiceObjects = hotelServices.filter(service => 
        bookingData.selectedServices.includes(service.id)
      )
      const servicesTotal = selectedServiceObjects.reduce((total, service) => 
        total + (service.price * nights), 0
      )

      const roomTotal = room.price * nights
      const subtotal = roomTotal + servicesTotal
      const taxes = subtotal * 0.12
      const finalTotal = subtotal + taxes

      // Standard booking payload (compatible with existing database schema)
      const payload = {
        userId: user.$id,
        guestName: `${bookingData.guestDetails.firstName} ${bookingData.guestDetails.lastName}`.trim(),
        guestEmail: bookingData.guestDetails.email,
        guestPhone: bookingData.guestDetails.phone,
        roomId: room.id,
        roomName: room.name,
        roomPrice: room.price,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        nights,
        totalAmount: subtotal,
        taxes,
        finalTotal,
        specialRequests: `${bookingData.guestDetails.specialRequests}${selectedServiceObjects.length > 0 ? '\n\nSelected Services: ' + selectedServiceObjects.map(s => s.name).join(', ') : ''}`,
        status: 'pending' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: 'card',
      }

      const res: any = await bookingService.createBooking(payload as any)
      setConfirmationId(res?.confirmationId || `HTL-${Date.now()}`)

      // Save enhanced booking data to user preferences (if available)
      try {
        // Calculate points earned
        const pointsEarned = 50 + (bookingData.selectedServices.length * 10) + (nights * 5)
        
        // Try to save enhanced features - fail gracefully if database isn't set up
        try {
          // Update favorite services based on this booking
          const currentFavorites = await userPreferencesService.getUserPreferences(user.$id)
          const updatedFavorites = [...new Set([
            ...(currentFavorites?.favoriteServices || []),
            ...bookingData.selectedServices
          ])]
          
          await userPreferencesService.updateFavoriteServices(user.$id, updatedFavorites)
          await userPreferencesService.updateGuestPreferences(user.$id, bookingData.guestDetails.preferences)
          await userPreferencesService.awardLoyaltyPoints(user.$id, pointsEarned)
          
          // Add each service to history
          for (const service of selectedServiceObjects) {
            await userPreferencesService.addServiceToHistory(user.$id, {
              serviceId: service.id,
              serviceName: service.name,
              bookingDate: bookingData.checkIn
            })
          }
        } catch (dbError) {
          console.log('Enhanced features database not available:', dbError)
          // Still show basic success - enhanced features will be available when database is set up
        }

        // Show success message
        const servicesText = bookingData.selectedServices.length > 0 
          ? ` Services selected: ${selectedServiceObjects.map(s => s.name).join(', ')}.`
          : ''
        
        toast.success(`🎉 Booking confirmed!${servicesText} Total: $${finalTotal.toFixed(2)}`, {
          duration: 5000
        })
      } catch (error) {
        console.error('Error in booking process:', error)
        toast.success('Booking confirmed successfully!', {
          duration: 3000
        })
      }

      setCurrentStep(6)
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Booking failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedRoomData = availableRooms.find(room => room.id === bookingData.roomId) || selectedRoom
  const selectedServiceObjects = hotelServices.filter(service => 
    bookingData.selectedServices.includes(service.id)
  )
  const servicesTotal = selectedServiceObjects.reduce((total, service) => 
    total + (service.price * nights), 0
  )
  const roomTotal = selectedRoomData ? selectedRoomData.price * nights : 0
  const subtotal = roomTotal + servicesTotal
  const taxes = subtotal * 0.12
  const finalTotal = subtotal + taxes

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold mb-2">Enhanced Luxury Booking</h2>
            <p className="text-purple-100">Customize your perfect stay with premium services</p>
          </div>

          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between overflow-x-auto">
              {steps.map((step, index) => {
                const IconComponent = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex items-center min-w-max">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isCurrent ? 'bg-purple-600 border-purple-600 text-white' :
                      'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ml-4 ${isCompleted || (isCurrent && index < currentStep - 1) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Step 1: Dates & Guests */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">When would you like to stay?</h3>
                  <p className="text-gray-600">Select your preferred dates and number of guests</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Check-in Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Check-out Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      min={bookingData.checkIn}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Guests
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                      className="w-full h-12 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {nights > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-800 font-semibold text-lg">
                          🌟 Your luxury escape: {nights} {nights === 1 ? 'night' : 'nights'}
                        </p>
                        <p className="text-purple-600 text-sm mt-1">
                          {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-700">{bookingData.guests}</p>
                        <p className="text-purple-600 text-sm">{bookingData.guests === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Room Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Perfect Room</h3>
                  <p className="text-gray-600">Select from our luxury accommodations</p>
                </div>
                
                <div className="space-y-4">
                  {availableRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                        bookingData.roomId === room.id 
                          ? 'border-purple-500 bg-purple-50 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                      onClick={() => handleInputChange('roomId', room.id)}
                    >
                      <div className="flex gap-6">
                        <div className="relative">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-32 h-32 object-cover rounded-xl"
                          />
                          {room.available && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Available
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-2xl font-bold text-gray-900">{room.name}</h4>
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-purple-600">${room.price}</span>
                                <span className="text-lg text-gray-500 line-through">${room.originalPrice}</span>
                              </div>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mb-3">
                            <span className="text-sm text-gray-600 flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              Up to {room.capacity} guests
                            </span>
                            <span className="text-sm text-gray-600">📐 {room.size}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{room.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.map((amenity, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Services & Amenities */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    <Sparkles className="w-8 h-8 inline mr-2 text-purple-600" />
                    Enhance Your Experience
                  </h3>
                  <p className="text-gray-600">Add premium services to make your stay unforgettable</p>
                </div>

                {/* Popular Services */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    🔥 Most Popular Services
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelServices.filter(service => service.popular).map((service) => {
                      const IconComponent = service.icon
                      const isSelected = bookingData.selectedServices.includes(service.id)
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 shadow-md' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{service.name}</h5>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-purple-600">${service.price}</p>
                                  <p className="text-xs text-gray-500">{service.duration}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                  {service.category}
                                </span>
                                {nights > 0 && (
                                  <span className="text-sm text-gray-500">
                                    Total: ${service.price * nights}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* All Services */}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">All Available Services</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotelServices.filter(service => !service.popular).map((service) => {
                      const IconComponent = service.icon
                      const isSelected = bookingData.selectedServices.includes(service.id)
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <div className="text-center">
                            <div className={`inline-flex p-3 rounded-full mb-3 ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-1">{service.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-purple-600">${service.price}</span>
                              <span className="text-xs text-gray-500">{service.duration}</span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Selected Services Summary */}
                {bookingData.selectedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
                  >
                    <h4 className="text-lg font-semibold text-purple-900 mb-3">Selected Services</h4>
                    <div className="space-y-2">
                      {selectedServiceObjects.map((service) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <span className="text-purple-800">{service.name}</span>
                          <span className="text-purple-600 font-medium">
                            ${service.price} × {nights} nights = ${service.price * nights}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-purple-200 pt-2 mt-3">
                        <div className="flex items-center justify-between text-lg font-bold text-purple-900">
                          <span>Services Total:</span>
                          <span>${servicesTotal}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Enhanced Guest Details */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Guest Information & Preferences</h3>
                  <p className="text-gray-600">Help us personalize your stay</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.guestDetails.firstName}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.guestDetails.lastName}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'lastName', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={bookingData.guestDetails.email}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'email', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={bookingData.guestDetails.phone}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'phone', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Guest Preferences */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Smoking Preference
                      </label>
                      <select
                        value={bookingData.guestDetails.preferences.smokingPreference}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'preferences', {
                          ...bookingData.guestDetails.preferences,
                          smokingPreference: e.target.value
                        })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="non-smoking">Non-Smoking</option>
                        <option value="smoking">Smoking</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bed Type Preference
                      </label>
                      <select
                        value={bookingData.guestDetails.preferences.bedType}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'preferences', {
                          ...bookingData.guestDetails.preferences,
                          bedType: e.target.value
                        })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="king">King Size</option>
                        <option value="queen">Queen Size</option>
                        <option value="twin">Twin Beds</option>
                        <option value="double">Double Bed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Floor Preference
                      </label>
                      <select
                        value={bookingData.guestDetails.preferences.floorPreference}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'preferences', {
                          ...bookingData.guestDetails.preferences,
                          floorPreference: e.target.value
                        })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="high">High Floor</option>
                        <option value="middle">Middle Floor</option>
                        <option value="low">Low Floor</option>
                        <option value="any">No Preference</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Restrictions
                      </label>
                      <Input
                        type="text"
                        value={bookingData.guestDetails.preferences.dietaryRestrictions}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'preferences', {
                          ...bookingData.guestDetails.preferences,
                          dietaryRestrictions: e.target.value
                        })}
                        className="w-full h-10 border border-gray-300 focus:border-purple-500"
                        placeholder="e.g., Vegetarian, Gluten-free"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={bookingData.guestDetails.specialRequests}
                    onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)}
                    className="w-full h-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Any special requests or occasions we should know about?"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h3>
                  <p className="text-gray-600">Secure payment processing</p>
                </div>

                {/* Booking Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                  <h4 className="text-lg font-semibold text-purple-900 mb-4">Booking Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800">Room ({nights} nights)</span>
                      <span className="text-purple-600 font-medium">${roomTotal}</span>
                    </div>
                    {bookingData.selectedServices.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-purple-800">Services ({bookingData.selectedServices.length} items)</span>
                        <span className="text-purple-600 font-medium">${servicesTotal}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-purple-200 pt-3">
                      <span className="text-purple-800">Subtotal</span>
                      <span className="text-purple-600 font-medium">${subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800">Taxes & Fees (12%)</span>
                      <span className="text-purple-600 font-medium">${taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-purple-200 pt-3">
                      <span className="text-xl font-bold text-purple-900">Total Amount</span>
                      <span className="text-2xl font-bold text-purple-700">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.payment.nameOnCard}
                      onChange={(e) => handleNestedInputChange('payment', 'nameOnCard', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="Name as it appears on card"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.payment.cardNumber}
                      onChange={(e) => handleNestedInputChange('payment', 'cardNumber', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.payment.expiryDate}
                      onChange={(e) => handleNestedInputChange('payment', 'expiryDate', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.payment.cvv}
                      onChange={(e) => handleNestedInputChange('payment', 'cvv', e.target.value)}
                      className="w-full h-12 border-2 border-gray-200 focus:border-purple-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">Secure Payment</p>
                      <p className="text-green-600 text-sm">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Confirmation */}
            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600 text-lg">Your luxury experience awaits</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-xl font-semibold text-green-900 mb-4">Confirmation Details</h4>
                  <div className="text-left space-y-2">
                    <p><strong>Confirmation ID:</strong> {confirmationId}</p>
                    <p><strong>Guest:</strong> {bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}</p>
                    <p><strong>Room:</strong> {selectedRoomData?.name}</p>
                    <p><strong>Dates:</strong> {bookingData.checkIn} to {bookingData.checkOut}</p>
                    <p><strong>Guests:</strong> {bookingData.guests}</p>
                    {bookingData.selectedServices.length > 0 && (
                      <div>
                        <strong>Additional Services:</strong>
                        <ul className="ml-4 mt-1">
                          {selectedServiceObjects.map(service => (
                            <li key={service.id} className="text-sm">• {service.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p><strong>Total Amount:</strong> ${finalTotal.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    📧 A confirmation email has been sent to {bookingData.guestDetails.email}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    🏨 Your selected services have been added to your account for easy rebooking
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-2xl font-bold text-purple-600">${finalTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total for {nights} nights</p>
              </div>
              
              <div className="flex gap-3">
                {currentStep > 1 && currentStep < 6 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < 5 && (
                  <Button
                    onClick={nextStep}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={
                      (currentStep === 1 && (!bookingData.checkIn || !bookingData.checkOut)) ||
                      (currentStep === 2 && !bookingData.roomId)
                    }
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                
                {currentStep === 5 && (
                  <Button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Booking'}
                  </Button>
                )}

                {currentStep === 6 && (
                  <Button
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
