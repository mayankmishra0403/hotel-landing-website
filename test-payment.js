import { CashfreeService } from '../src/lib/cashfree-service'
import { BookingPaymentData } from '../src/lib/cashfree-config'

// Test data
const testBookingData: BookingPaymentData = {
  bookingId: 'test-booking-123',
  userId: 'test-user-456',
  guestName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  checkInDate: '2025-10-10',
  checkOutDate: '2025-10-12',
  roomType: 'Deluxe Room',
  guests: 2,
  totalAmount: 1000,
  selectedServices: [
    { name: 'Spa Service', price: 100 }
  ],
  specialRequests: 'Late checkout'
}

async function testPaymentOrder() {
  try {
    console.log('🧪 Testing Cashfree payment order creation...')
    console.log('Test data:', JSON.stringify(testBookingData, null, 2))
    
    const cashfreeService = new CashfreeService()
    const result = await cashfreeService.createPaymentOrder(testBookingData)
    
    console.log('✅ Payment order created successfully:')
    console.log(JSON.stringify(result, null, 2))
    
  } catch (error: any) {
    console.error('❌ Error creating payment order:')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
  }
}

testPaymentOrder()
