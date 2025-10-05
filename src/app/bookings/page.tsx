'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Star, Filter, Search, Eye, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import bookingService, { Booking } from '@/services/booking'

interface BookingDisplay {
  id: string
  hotelName: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  bookingDate: string
  roomNumber?: string
  specialRequests?: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login')
      return
    }

    // Load user's actual bookings from Appwrite
    const loadBookings = async () => {
      if (user?.$id) {
        try {
          setIsLoading(true)
          const userBookings = await bookingService.getUserBookings(user.$id)
          setBookings(userBookings)
          setFilteredBookings(userBookings)
        } catch (error) {
          console.error('Error loading bookings:', error)
          toast.error('Failed to load bookings')
          setBookings([])
          setFilteredBookings([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      loadBookings()
    }
  }, [user, loading, router])

  useEffect(() => {
    let filtered = bookings

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.confirmationId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredBookings(filtered)
  }, [bookings, statusFilter, searchQuery])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'checked-out':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'checked-in':
        return <CheckCircle className="w-5 h-5 text-purple-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'checked-out':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'checked-in':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return nights
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await bookingService.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      
      // Refresh bookings
      if (user?.$id) {
        const updatedBookings = await bookingService.getUserBookings(user.$id)
        setBookings(updatedBookings)
        setFilteredBookings(updatedBookings)
      }
      
      setSelectedBooking(null)
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Failed to cancel booking')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your hotel reservations</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms.'
                  : "You haven't made any bookings yet."}
              </p>
              <Link href="/rooms">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  Browse Rooms
                </button>
              </Link>
            </motion.div>
          ) : (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Hotel Ritam</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{booking.roomName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{booking.nights} nights</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${booking.finalTotal}</div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-blue-100 text-blue-600 p-3 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Booking Details */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Confirmation ID</label>
                          <p className="text-gray-900 font-mono">{selectedBooking.confirmationId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Hotel</label>
                          <p className="text-gray-900">Hotel Ritam</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Room</label>
                          <p className="text-gray-900">{selectedBooking.roomName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Guest Name</label>
                          <p className="text-gray-900">{selectedBooking.guestName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                            {getStatusIcon(selectedBooking.status)}
                            <span className="capitalize">{selectedBooking.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Check-in</label>
                          <p className="text-gray-900">{formatDate(selectedBooking.checkIn)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Check-out</label>
                          <p className="text-gray-900">{formatDate(selectedBooking.checkOut)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Guests</label>
                          <p className="text-gray-900">{selectedBooking.guests} {selectedBooking.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nights</label>
                          <p className="text-gray-900">{selectedBooking.nights} nights</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Booking Date</label>
                          <p className="text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.specialRequests && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requests</h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Room Amount</span>
                        <span className="text-gray-900">${selectedBooking.totalAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="text-gray-900">${selectedBooking.taxes}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-lg font-semibold text-gray-900">Final Total</span>
                        <span className="text-2xl font-bold text-blue-600">${selectedBooking.finalTotal}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Payment Status: <span className={`font-medium ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
                      <button 
                        onClick={() => handleCancelBooking(selectedBooking.$id!)}
                        className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
