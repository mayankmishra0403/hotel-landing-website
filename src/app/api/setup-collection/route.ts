import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, SERVER_CONFIG, isServerConfigured } from '@/lib/appwrite-server'

export async function POST(request: NextRequest) {
  try {
    if (!isServerConfigured()) {
      return NextResponse.json(
        { error: 'Server not configured - API key required' },
        { status: 500 }
      )
    }

    console.log('🚀 Creating User Preferences Collection...')

    // Create the collection
    const collection = await serverDatabases.createCollection(
      SERVER_CONFIG.databaseId,
      'user_preferences', // Collection ID
      'User Preferences'  // Collection Name
    )

    console.log('✅ Collection created:', collection.$id)

    // Create basic attributes one by one
    try {
      // userId - Required string
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'userId',
        36,
        true // required
      )
      console.log('✅ Created userId attribute')

      // favoriteServices - String array
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'favoriteServices',
        50,
        false, // not required
        undefined, // no default
        true // array
      )
      console.log('✅ Created favoriteServices attribute')

      // loyaltyPoints - Integer
      await serverDatabases.createIntegerAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'loyaltyPoints',
        false, // not required
        0,     // min
        999999, // max
        0      // default
      )
      console.log('✅ Created loyaltyPoints attribute')

      // membershipTier - String
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'membershipTier',
        20,
        false, // not required
        'bronze' // default
      )
      console.log('✅ Created membershipTier attribute')

      // previousServices - JSON as string
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'previousServices',
        5000,
        false, // not required
        '[]'   // default empty array
      )
      console.log('✅ Created previousServices attribute')

      // guestPreferences - JSON as string
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'guestPreferences',
        2000,
        false, // not required
        '{}'   // default empty object
      )
      console.log('✅ Created guestPreferences attribute')

      // preferredRoomTypes - String array
      await serverDatabases.createStringAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'preferredRoomTypes',
        50,
        false, // not required
        undefined, // no default
        true // array
      )
      console.log('✅ Created preferredRoomTypes attribute')

      // createdAt - DateTime
      await serverDatabases.createDatetimeAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'createdAt',
        false // not required
      )
      console.log('✅ Created createdAt attribute')

      // updatedAt - DateTime
      await serverDatabases.createDatetimeAttribute(
        SERVER_CONFIG.databaseId,
        collection.$id,
        'updatedAt',
        false // not required
      )
      console.log('✅ Created updatedAt attribute')

    } catch (attrError) {
      console.log('⚠️ Some attributes may have failed to create (this is normal for existing collections)')
    }

    return NextResponse.json({
      success: true,
      message: 'User preferences collection created successfully!',
      collectionId: collection.$id,
      instructions: `Add this to your .env.local file:\nNEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=${collection.$id}`
    })

  } catch (error: any) {
    console.error('❌ Failed to create collection:', error)
    
    if (error.code === 409) {
      return NextResponse.json({
        success: false,
        error: 'Collection already exists',
        message: 'The user_preferences collection already exists in your database.'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create collection',
      message: error.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}
