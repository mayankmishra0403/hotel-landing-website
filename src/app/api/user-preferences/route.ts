import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, SERVER_CONFIG, generateSecureId, isServerConfigured } from '@/lib/appwrite-server'

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

    try {
      // Get user preferences using server-side API
      const response = await serverDatabases.listDocuments(
        SERVER_CONFIG.databaseId,
        SERVER_CONFIG.collections.userPreferences
      )

      // Filter by userId (manual filtering since collection might not have proper indexes)
      const userPrefs = response.documents.find((doc: any) => doc.userId === userId)

      return NextResponse.json({
        success: true,
        preferences: userPrefs || null
      })

    } catch (dbError) {
      // Handle case where user_preferences collection doesn't exist
      console.log('User preferences collection not available:', dbError)
      return NextResponse.json({
        success: true,
        preferences: null,
        message: 'Enhanced features will be available when user preferences collection is created'
      })
    }

  } catch (error) {
    console.error('Server preferences fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isServerConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      )
    }

    const preferencesData = await request.json()

    try {
      // Check if preferences already exist
      const existing = await serverDatabases.listDocuments(
        SERVER_CONFIG.databaseId,
        SERVER_CONFIG.collections.userPreferences
      )

      const existingPrefs = existing.documents.find((doc: any) => doc.userId === preferencesData.userId)

      let response

      if (existingPrefs) {
        // Update existing preferences
        response = await serverDatabases.updateDocument(
          SERVER_CONFIG.databaseId,
          SERVER_CONFIG.collections.userPreferences,
          existingPrefs.$id,
          {
            ...preferencesData,
            updatedAt: new Date().toISOString()
          }
        )
      } else {
        // Create new preferences with secure ID
        response = await serverDatabases.createDocument(
          SERVER_CONFIG.databaseId,
          SERVER_CONFIG.collections.userPreferences,
          generateSecureId(),
          {
            ...preferencesData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        )
      }

      return NextResponse.json({
        success: true,
        preferences: response
      })

    } catch (dbError) {
      console.log('User preferences collection not available:', dbError)
      return NextResponse.json({
        success: false,
        message: 'User preferences collection not available. Enhanced features will activate when collection is created.',
        error: 'Collection not found'
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Server preferences save error:', error)
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isServerConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured' },
        { status: 500 }
      )
    }

    const { action, userId, data } = await request.json()

    try {
      // Get existing preferences
      const existing = await serverDatabases.listDocuments(
        SERVER_CONFIG.databaseId,
        SERVER_CONFIG.collections.userPreferences
      )

      const existingPrefs = existing.documents.find((doc: any) => doc.userId === userId)

      if (!existingPrefs) {
        return NextResponse.json(
          { error: 'User preferences not found' },
          { status: 404 }
        )
      }

      let updateData: any = { updatedAt: new Date().toISOString() }

      switch (action) {
        case 'addPoints':
          updateData = {
            ...updateData,
            loyaltyPoints: (existingPrefs.loyaltyPoints || 0) + data.points,
            membershipTier: calculateMembershipTier((existingPrefs.loyaltyPoints || 0) + data.points)
          }
          break

        case 'addService':
          updateData = {
            ...updateData,
            previousServices: [
              ...(existingPrefs.previousServices || []),
              data.service
            ]
          }
          break

        case 'updateFavorites':
          updateData = {
            ...updateData,
            favoriteServices: data.services
          }
          break

        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }

      const response = await serverDatabases.updateDocument(
        SERVER_CONFIG.databaseId,
        SERVER_CONFIG.collections.userPreferences,
        existingPrefs.$id,
        updateData
      )

      return NextResponse.json({
        success: true,
        preferences: response
      })

    } catch (dbError) {
      console.log('User preferences collection not available:', dbError)
      return NextResponse.json({
        success: false,
        message: 'Enhanced features not available yet'
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Server preferences update error:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}

// Helper function to calculate membership tier
function calculateMembershipTier(points: number): string {
  if (points >= 1000) return 'platinum'
  if (points >= 500) return 'gold'
  if (points >= 200) return 'silver'
  return 'bronze'
}
