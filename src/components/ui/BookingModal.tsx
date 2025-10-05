'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, CreditCard, Check, ArrowRight, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import bookingService from '@/services/booking'
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

const steps = [
  { id: 1, title: 'Dates & Guests', icon: Calendar },
  { id: 2, title: 'Room Selection', icon: MapPin },
  { id: 3, title: 'Guest Details', icon: Users },
  { id: 4, title: 'Payment', icon: CreditCard },
  { id: 5, title: 'Confirmation', icon: Check }
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

export default function BookingModal({ isOpen, onClose, selectedRoom }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomId: selectedRoom?.id || '',
    guestDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: ''
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

  // Calculate nights when dates change
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn)
      const checkOut = new Date(bookingData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays)
    }
  }, [bookingData.checkIn, bookingData.checkOut])

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

  const nextStep = () => {
    if (currentStep < 5) {
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
        totalAmount: room.price * nights,
        taxes: (room.price * nights) * 0.12,
        finalTotal: (room.price * nights) * 1.12,
        specialRequests: bookingData.guestDetails.specialRequests,
        status: 'pending' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: 'card',
      }

      const res: any = await bookingService.createBooking(payload as any)
      setConfirmationId(res?.confirmationId || null)
      setCurrentStep(5)
      toast.success('Booking confirmed')
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Booking failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedRoomData = availableRooms.find(room => room.id === bookingData.roomId) || selectedRoom
  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : 0
  const taxes = totalPrice * 0.12
  const finalTotal = totalPrice + taxes

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
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold mb-2">Book Your Stay</h2>
            <p className="text-blue-100">Secure your luxury experience at Hotel Ritam</p>
          </div>

          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const IconComponent = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isCurrent ? 'bg-blue-600 border-blue-600 text-white' :
                      'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${isCompleted || (isCurrent && index < currentStep - 1) ? 'bg-green-500' : 'bg-gray-300'}`} />
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Dates</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      className="w-full h-12"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <Input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      className="w-full h-12"
                      min={bookingData.checkIn}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Guests
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                      className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      📅 Your stay: {nights} {nights === 1 ? 'night' : 'nights'}
                    </p>
                  </div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Room</h3>
                
                <div className="space-y-4">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        bookingData.roomId === room.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('roomId', room.id)}
                    >
                      <div className="flex gap-4">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-bold text-gray-900">{room.name}</h4>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                                <span className="text-lg text-gray-500 line-through">${room.originalPrice}</span>
                              </div>
                              <p className="text-sm text-gray-500">per night</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm text-gray-600">👥 Up to {room.capacity} guests</span>
                            <span className="text-sm text-gray-600">📐 {room.size}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{room.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Guest Details */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.guestDetails.firstName}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)}
                      className="w-full h-12"
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
                      className="w-full h-12"
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
                      className="w-full h-12"
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
                      className="w-full h-12"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={bookingData.guestDetails.specialRequests}
                    onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requests or preferences..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h3>
                
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h4>
                  {selectedRoomData && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{selectedRoomData.name}</span>
                        <span>${selectedRoomData.price}/night</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{nights} nights</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & Fees</span>
                        <span>${taxes.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name on Card *
                    </label>
                    <Input
                      type="text"
                      value={bookingData.payment.nameOnCard}
                      onChange={(e) => handleNestedInputChange('payment', 'nameOnCard', e.target.value)}
                      className="w-full h-12"
                      placeholder="Enter name as on card"
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
                      className="w-full h-12"
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
                      className="w-full h-12"
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
                      className="w-full h-12"
                      placeholder="123"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-100 rounded-full p-8 inline-block mb-6"
                >
                  <Check className="w-16 h-16 text-green-600" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Thank you for choosing Hotel Ritam. Your booking has been confirmed and you'll receive a confirmation email shortly.
                </p>
                <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
                  <h4 className="font-bold text-gray-900 mb-3">Booking Details:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Confirmation ID:</span>
                      <span className="font-mono">HTR-{Math.random().toString().substr(2, 8)}</span>
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
                      <span>Room:</span>
                      <span>{selectedRoomData?.name}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Paid:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {currentStep < 5 && (
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                Previous
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  Cancel
                </Button>
                
                {currentStep === 4 ? (
                  <Button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Complete Booking
                      </div>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!bookingData.checkIn || !bookingData.checkOut)) ||
                      (currentStep === 2 && !bookingData.roomId)
                    }
                    className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
