import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, SERVER_CONFIG, generateSecureId, isServerConfigured } from '@/lib/appwrite-server'

export async function POST(request: NextRequest) {
  try {
    // Check if server is properly configured
    if (!isServerConfigured()) {
      return NextResponse.json(
        { 
          error: 'Server not configured', 
          message: 'Please add your Appwrite API key to environment variables' 
        },
        { status: 500 }
      )
    }

    const bookingData = await request.json()

    // Generate secure confirmation ID
    const confirmationId = `HTR-${Date.now().toString().slice(-8).toUpperCase()}`
    
    // Prepare booking document with secure ID
    const booking = {
      ...bookingData,
      confirmationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Create booking using server-side API with API key
    const response = await serverDatabases.createDocument(
      SERVER_CONFIG.databaseId,
      SERVER_CONFIG.collections.bookings,
      generateSecureId(), // Use server-side secure ID generation
      booking
    )

    return NextResponse.json({
      success: true,
      booking: response,
      confirmationId: confirmationId
    })

  } catch (error) {
    console.error('Server booking creation error:', error)
    
    // Handle different types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Booking creation failed', 
          message: error.message,
          details: 'Please check your Appwrite configuration and API key'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Unknown error occurred',
        message: 'Please try again later'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isServerConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get user bookings using server-side API
    const response = await serverDatabases.listDocuments(
      SERVER_CONFIG.databaseId,
      SERVER_CONFIG.collections.bookings,
      [
        // Add query filters here when needed
      ]
    )

    // Filter bookings by userId (since we can't use Query.equal without proper indexes)
    const userBookings = response.documents.filter((doc: any) => doc.userId === userId)

    return NextResponse.json({
      success: true,
      bookings: userBookings
    })

  } catch (error) {
    console.error('Server booking fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
