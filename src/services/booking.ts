import { databases, generateId, APPWRITE_CONFIG } from '@/lib/appwrite'
import { Models } from 'appwrite'

export interface Booking {
  $id?: string
  userId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  roomId: string
  roomName: string
  roomPrice: number
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalAmount: number
  taxes: number
  finalTotal: number
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentMethod?: string
  confirmationId: string
  createdAt: string
  updatedAt: string
}

export interface BookingFilters {
  userId?: string
  status?: string
  checkIn?: string
  checkOut?: string
  dateRange?: {
    start: string
    end: string
  }
}

class BookingService {
  // Create new booking using secure API
  async createBooking(bookingData: Omit<Booking, '$id' | 'confirmationId' | 'createdAt' | 'updatedAt'>): Promise<any> {
    try {
      // Use server-side API route for secure booking creation with API key
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create booking')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Booking creation failed')
      }

      return result.booking

    } catch (error) {
      console.error('Create booking error:', error)
      throw error
    }
  }

  // Get booking by ID
  async getBooking(bookingId: string): Promise<any | null> {
    try {
      const response = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.bookings,
        bookingId
      )
      return response
    } catch (error) {
      console.error('Get booking error:', error)
      return null
    }
  }

  // Get bookings by user ID using secure API
  async getUserBookings(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/bookings?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        console.error('Failed to fetch user bookings')
        return []
      }

      const result = await response.json()
      
      if (result.success) {
        return result.bookings || []
      }

      return []
    } catch (error) {
      console.error('Get user bookings error:', error)
      return []
    }
  }

  // Get all bookings (admin)
  async getAllBookings(filters?: BookingFilters): Promise<any[]> {
    try {
      let queries: string[] = []
      
      if (filters?.status) {
        // Add status filter query
      }
      
      if (filters?.dateRange) {
        // Add date range filter queries
      }

      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.bookings,
        queries
      )
      return response.documents
    } catch (error) {
      console.error('Get all bookings error:', error)
      return []
    }
  }

  // Update booking
  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<any> {
    try {
      const response = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.bookings,
        bookingId,
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      )
      return response
    } catch (error) {
      console.error('Update booking error:', error)
      throw error
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<any> {
    try {
      const response = await this.updateBooking(bookingId, {
        status: 'cancelled',
        paymentStatus: 'refunded',
        specialRequests: reason ? `Cancelled: ${reason}` : 'Cancelled by user',
      })
      return response
    } catch (error) {
      console.error('Cancel booking error:', error)
      throw error
    }
  }

  // Confirm booking (admin)
  async confirmBooking(bookingId: string): Promise<any> {
    try {
      const response = await this.updateBooking(bookingId, {
        status: 'confirmed',
        paymentStatus: 'paid',
      })
      return response
    } catch (error) {
      console.error('Confirm booking error:', error)
      throw error
    }
  }

  // Check-in guest
  async checkIn(bookingId: string): Promise<any> {
    try {
      const response = await this.updateBooking(bookingId, {
        status: 'checked-in',
      })
      return response
    } catch (error) {
      console.error('Check-in error:', error)
      throw error
    }
  }

  // Check-out guest
  async checkOut(bookingId: string): Promise<any> {
    try {
      const response = await this.updateBooking(bookingId, {
        status: 'checked-out',
      })
      return response
    } catch (error) {
      console.error('Check-out error:', error)
      throw error
    }
  }

  // Get booking statistics
  async getBookingStats(): Promise<{
    total: number
    confirmed: number
    pending: number
    cancelled: number
    revenue: number
  }> {
    try {
      const bookings = await this.getAllBookings()
      
      const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings
          .filter(b => b.paymentStatus === 'paid')
          .reduce((sum, b) => sum + (b.finalTotal || 0), 0)
      }
      
      return stats
    } catch (error) {
      console.error('Get booking stats error:', error)
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        revenue: 0
      }
    }
  }

  // Search bookings
  async searchBookings(query: string): Promise<any[]> {
    try {
      // You can implement search by confirmation ID, guest name, email, etc.
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.bookings,
        [
          // Add search queries here
        ]
      )
      return response.documents.filter(booking => 
        booking.confirmationId.toLowerCase().includes(query.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(query.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Search bookings error:', error)
      return []
    }
  }
}

const bookingService = new BookingService()
export default bookingService
