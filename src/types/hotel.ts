export interface Room {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  available: boolean
  size: number
  bedType: string
}

export interface Booking {
  id: string
  roomId: string
  guestName: string
  guestEmail: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: 'confirmed' | 'pending' | 'cancelled'
  specialRequests?: string
}

export interface Hotel {
  name: string
  description: string
  address: string
  phone: string
  email: string
  amenities: string[]
  images: string[]
  rating: number
  reviews: Review[]
}

export interface Review {
  id: string
  guestName: string
  rating: number
  comment: string
  date: Date
  roomId?: string
}

export interface BookingFormData {
  checkIn: string
  checkOut: string
  guests: number
  roomType?: string
}
