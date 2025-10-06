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
    description: 'Multi-course chef special dinner for two',
    price: 85,
    icon: Utensils,
    category: 'dining',
    duration: '2 hours',
    popular: false
  },
  {
    id: 'room-service',
    name: '24/7 Premium Room Service',
    description: 'Unlimited room service with premium menu',
    price: 30,
    icon: Coffee,
    category: 'service',
    duration: 'All day',
    popular: true
  },
  {
    id: 'fitness',
    name: 'Personal Fitness Trainer',
    description: 'One-on-one fitness session with equipment',
    price: 60,
    icon: Dumbbell,
    category: 'wellness',
    duration: '1 hour',
    popular: false
  },
  {
    id: 'pool',
    name: 'Private Pool Access',
    description: 'Exclusive pool area with cabana service',
    price: 75,
    icon: Waves,
    category: 'recreation',
    duration: '4 hours',
    popular: true
  },
  {
    id: 'entertainment',
    name: 'Live Music Evening',
    description: 'Private acoustic performance in your room',
    price: 150,
    icon: Music,
    category: 'entertainment',
    duration: '2 hours',
    popular: false
  },
  {
    id: 'concierge',
    name: 'Personal Concierge Service',
    description: 'Dedicated concierge for bookings and arrangements',
    price: 40,
    icon: Gift,
    category: 'service',
    duration: 'All day',
    popular: true
  }
]

// Available rooms data
const availableRooms = [
  {
    id: 'deluxe-ocean',
    name: 'Deluxe Ocean View',
    price: 299,
    image: '/images/room1.jpg',
    capacity: 2,
    amenities: ['Ocean View', 'King Bed', 'WiFi', 'Mini Bar']
  },
  {
    id: 'luxury-suite',
    name: 'Luxury Suite',
    price: 499,
    image: '/images/room2.jpg',
    capacity: 4,
    amenities: ['Living Room', 'Kitchenette', 'Balcony', 'Premium WiFi']
  },
  {
    id: 'premium-garden',
    name: 'Premium Garden View',
    price: 199,
    image: '/images/room3.jpg',
    capacity: 2,
    amenities: ['Garden View', 'Queen Bed', 'Work Desk', 'Coffee Machine']
  }
]

// Booking steps
const bookingSteps = [
  { id: 1, title: 'Dates & Guests', icon: Calendar },
  { id: 2, title: 'Room Selection', icon: MapPin },
  { id: 3, title: 'Services', icon: Star },
  { id: 4, title: 'Guest Details', icon: Users },
  { id: 5, title: 'Payment', icon: CreditCard },
  { id: 6, title: 'Confirmation', icon: Check }
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

  // Update room ID when selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      setBookingData(prev => ({
        ...prev,
        roomId: selectedRoom.id
      }))
    }
  }, [selectedRoom])

  // Load user preferences when modal opens
  useEffect(() => {
    if (isOpen && user) {
      const loadUserData = async () => {
        try {
          const preferences = await userPreferencesService.getUserPreferences(user.$id)
          if (preferences) {
            // Pre-select favorite services
            setBookingData(prev => ({
              ...prev,
              selectedServices: preferences.favoriteServices || [],
              guestDetails: {
                ...prev.guestDetails,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                preferences: {
                  ...prev.guestDetails.preferences,
                  ...preferences.guestPreferences
                }
              }
            }))
          } else {
            // Set basic user info even if no preferences exist
            setBookingData(prev => ({
              ...prev,
              guestDetails: {
                ...prev.guestDetails,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                email: user.email || ''
              }
            }))
          }
        } catch (error) {
          console.error('Error loading user preferences:', error)
          // Set basic user info if preferences service fails
          setBookingData(prev => ({
            ...prev,
            guestDetails: {
              ...prev.guestDetails,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              email: user.email || ''
            }
          }))
        }
      }

      loadUserData()
    }
  }, [isOpen, user])

  // Calculations for display
  const selectedRoomData = selectedRoom || availableRooms.find(room => room.id === bookingData.roomId)
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
        ...(prev[parent as keyof typeof prev] as any),
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
        // Redirect to login page
        window.location.href = '/auth/login'
        return
      }

      // Validate phone number
      const phone = bookingData.guestDetails.phone
      if (!phone || phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit mobile number starting with 6-9')
        setCurrentStep(4) // Go back to guest details step
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

      // Create booking in database first (with pending payment status)
      const bookingPayload = {
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
        paymentStatus: 'pending' as const,
        paymentMethod: 'cashfree',
      }

      const bookingResult: any = await bookingService.createBooking(bookingPayload as any)
      const bookingId = bookingResult?.bookingId || bookingResult?.$id
      
      if (!bookingId) {
        throw new Error('Failed to create booking')
      }

      // Prepare payment data - SIMPLIFIED
      const paymentData = {
        bookingId,
        guestName: `${bookingData.guestDetails.firstName} ${bookingData.guestDetails.lastName}`.trim(),
        email: bookingData.guestDetails.email,
        phone: bookingData.guestDetails.phone,
        totalAmount: Math.round(finalTotal)
      }

      // Create payment order using NEW simplified API
      console.log('💳 Creating payment order...', paymentData)
      
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const paymentResult = await paymentResponse.json()

      if (!paymentResponse.ok || !paymentResult.success) {
        throw new Error(paymentResult.error || 'Unable to create payment order. Please try again.')
      }

      console.log('✅ Payment order created:', paymentResult.orderId)

      // Save enhanced booking preferences (if available)
      try {
        const pointsEarned = 50 + (bookingData.selectedServices.length * 10) + (nights * 5)
        
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
        }
      } catch (prefError) {
        console.log('User preferences update failed:', prefError)
      }

      // Redirect to Cashfree payment page
      if (paymentResult.paymentUrl) {
        console.log('🔄 Redirecting to payment page...')
        toast.success('Redirecting to secure payment gateway...', { duration: 2000 })
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = paymentResult.paymentUrl
        }, 1500)
      } else {
        throw new Error('Payment URL not received. Please try again.')
      }

    } catch (error: any) {
      console.error('Booking error:', error)
      toast.error(error?.message || 'Booking failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

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
          {/* Header with Progress */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Book Your Stay</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {bookingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-white text-blue-600 border-white' 
                      : 'border-white/50 text-white/50'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.id ? 'text-white' : 'text-white/50'
                  }`}>
                    {step.title}
                  </span>
                  {index < bookingSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-white' : 'bg-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Authentication Check */}
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-yellow-800">Sign In Required</h4>
                </div>
                <p className="text-yellow-700 mb-4">
                  Please sign in to your account to continue with the booking process.
                </p>
                <Button
                  onClick={() => window.location.href = '/auth/login'}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Sign In to Continue
                </Button>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {/* Step 1: Dates & Guests */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Select Your Dates</h3>
                    <p className="text-gray-600">Choose your check-in and check-out dates</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleInputChange('checkOut', e.target.value)}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {nights > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        {nights} night{nights > 1 ? 's' : ''} selected
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Room Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Selected Room</h3>
                    <p className="text-gray-600">Review your room selection</p>
                  </div>

                  {selectedRoomData && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="border-2 border-blue-500 bg-blue-50 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedRoomData.name}</h4>
                          <p className="text-gray-600 mb-4">Capacity: {selectedRoomData.capacity} guests</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedRoomData.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">${selectedRoomData.price}</p>
                          <p className="text-gray-500">per night</p>
                          {nights > 0 && (
                            <p className="text-lg font-semibold text-gray-900 mt-2">
                              Total: ${selectedRoomData.price * nights}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Services */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Services</h3>
                    <p className="text-gray-600">Enhance your stay with our exclusive services</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {hotelServices.map((service) => {
                      const IconComponent = service.icon
                      const isSelected = bookingData.selectedServices.includes(service.id)
                      
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          {service.popular && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <IconComponent className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{service.duration}</span>
                                <div className="text-right">
                                  <p className="font-bold text-blue-600">${service.price}</p>
                                  {nights > 0 && (
                                    <p className="text-xs text-gray-500">
                                      ${service.price * nights} total
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1"
                              >
                                <Check className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {bookingData.selectedServices.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Selected Services Summary</h4>
                      <div className="space-y-2">
                        {selectedServiceObjects.map((service) => (
                          <div key={service.id} className="flex justify-between items-center">
                            <span className="text-gray-700">{service.name}</span>
                            <span className="font-semibold text-gray-900">
                              ${service.price} × {nights} = ${service.price * nights}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Services Total:</span>
                            <span className="text-blue-600">${servicesTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Guest Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Guest Information</h3>
                    <p className="text-gray-600">Tell us about yourself and your preferences</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        value={bookingData.guestDetails.firstName}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={bookingData.guestDetails.lastName}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'lastName', e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={bookingData.guestDetails.email}
                        onChange={(e) => handleNestedInputChange('guestDetails', 'email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number * (10-digit Indian mobile number)
                      </label>
                      <Input
                        type="tel"
                        value={bookingData.guestDetails.phone}
                        onChange={(e) => {
                          // Only allow numbers and format to 10 digits
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                          handleNestedInputChange('guestDetails', 'phone', value)
                        }}
                        placeholder="9876543210"
                        required
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        className={`${
                          bookingData.guestDetails.phone && bookingData.guestDetails.phone.length !== 10
                            ? 'border-red-300 focus:border-red-500'
                            : ''
                        }`}
                      />
                      {bookingData.guestDetails.phone && bookingData.guestDetails.phone.length !== 10 && (
                        <p className="text-red-500 text-sm mt-1">
                          Please enter a valid 10-digit mobile number starting with 6-9
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={bookingData.guestDetails.specialRequests}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)}
                      placeholder="Any special requests or requirements..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Guest Preferences */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Room Preferences</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bed Type
                        </label>
                        <select
                          value={bookingData.guestDetails.preferences.bedType}
                          onChange={(e) => handleNestedInputChange('guestDetails', 'preferences', {
                            ...bookingData.guestDetails.preferences,
                            bedType: e.target.value
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="king">King Bed</option>
                          <option value="queen">Queen Bed</option>
                          <option value="twin">Twin Beds</option>
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="high">High Floor</option>
                          <option value="middle">Middle Floor</option>
                          <option value="low">Low Floor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Payment Processing</h3>
                    <p className="text-gray-600">You will be redirected to our secure payment partner</p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Room ({nights} nights)</span>
                        <span className="font-semibold">${roomTotal}</span>
                      </div>
                      {servicesTotal > 0 && (
                        <div className="flex justify-between">
                          <span>Services</span>
                          <span className="font-semibold">${servicesTotal}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxes & Fees</span>
                        <span className="font-semibold">${taxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total Amount</span>
                          <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800">Secure Payment via Cashfree</h4>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>• Your payment will be processed securely by Cashfree Payment Gateway</p>
                      <p>• All major credit cards, debit cards, UPI, and net banking supported</p>
                      <p>• Your booking will be confirmed immediately after successful payment</p>
                      <p>• You will receive a confirmation email with all booking details</p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Supported Payment Methods</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="flex items-center justify-center p-3 bg-white rounded-lg border">
                        <CreditCard className="w-6 h-6 text-gray-600 mr-2" />
                        <span className="text-sm font-medium">Cards</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-lg border">
                        <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                        <span className="text-sm font-medium">UPI</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-lg border">
                        <div className="w-6 h-6 bg-green-600 rounded mr-2"></div>
                        <span className="text-sm font-medium">Net Banking</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-lg border">
                        <div className="w-6 h-6 bg-purple-600 rounded mr-2"></div>
                        <span className="text-sm font-medium">Wallets</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                  </motion.div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 mb-6">Your reservation has been successfully created</p>
                    
                    {confirmationId && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-blue-800 font-semibold">Confirmation ID: {confirmationId}</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 rounded-xl p-6 text-left">
                      <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Guest:</span>
                          <span>{bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room:</span>
                          <span>{selectedRoomData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span>{bookingData.checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span>{bookingData.checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{bookingData.guests}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-2 border-t">
                          <span>Total Paid:</span>
                          <span>${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentStep < 6 && (
                <>Step {currentStep} of {bookingSteps.length}</>
              )}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 1 && currentStep < 6 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isProcessing}
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 5 && (
                <Button
                  onClick={nextStep}
                  disabled={
                    !user ||
                    (currentStep === 1 && (!bookingData.checkIn || !bookingData.checkOut || nights <= 0)) ||
                    (currentStep === 2 && !bookingData.roomId) ||
                    (currentStep === 4 && (
                      !bookingData.guestDetails.firstName || 
                      !bookingData.guestDetails.lastName || 
                      !bookingData.guestDetails.email || 
                      !bookingData.guestDetails.phone ||
                      bookingData.guestDetails.phone.length !== 10 ||
                      !/^[6-9]\d{9}$/.test(bookingData.guestDetails.phone)
                    ))
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 5 && (
                <Button
                  onClick={handleBooking}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Proceed to Payment <CreditCard className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
              
              {currentStep === 6 && (
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
