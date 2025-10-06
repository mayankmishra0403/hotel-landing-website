import { serverDatabases, SERVER_CONFIG } from '@/lib/appwrite-server'
import { Permission, Role } from 'node-appwrite'

export async function createUserPreferencesCollection() {
  try {
    console.log('🚀 Creating User Preferences Collection...')

    // Create the collection
    const collection = await serverDatabases.createCollection(
      SERVER_CONFIG.databaseId,
      'user_preferences', // Collection ID
      'User Preferences', // Collection Name
      [
        Permission.create(Role.users()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    )

    console.log('✅ Collection created:', collection.$id)

    // Add attributes
    const attributes = [
      {
        key: 'userId',
        type: 'string',
        size: 36,
        required: true,
        array: false
      },
      {
        key: 'favoriteServices',
        type: 'string',
        size: 50,
        required: false,
        array: true,
        default: []
      },
      {
        key: 'previousServices',
        type: 'string', // JSON as string
        size: 5000,
        required: false,
        array: false,
        default: '[]'
      },
      {
        key: 'loyaltyPoints',
        type: 'integer',
        min: 0,
        max: 999999,
        required: false,
        default: 0
      },
      {
        key: 'membershipTier',
        type: 'string',
        size: 20,
        required: false,
        array: false,
        default: 'bronze'
      },
      {
        key: 'guestPreferences',
        type: 'string', // JSON as string
        size: 2000,
        required: false,
        array: false,
        default: '{}'
      },
      {
        key: 'preferredRoomTypes',
        type: 'string',
        size: 50,
        required: false,
        array: true,
        default: []
      },
      {
        key: 'createdAt',
        type: 'datetime',
        required: false
      },
      {
        key: 'updatedAt',
        type: 'datetime',
        required: false
      }
    ]

    // Create each attribute
    for (const attr of attributes) {
      try {
        let result
        if (attr.type === 'string') {
          result = await serverDatabases.createStringAttribute(
            SERVER_CONFIG.databaseId,
            collection.$id,
            attr.key,
            attr.size || 255,
            attr.required,
            typeof attr.default === 'string' ? attr.default : undefined,
            attr.array || false
          )
        } else if (attr.type === 'integer') {
          result = await serverDatabases.createIntegerAttribute(
            SERVER_CONFIG.databaseId,
            collection.$id,
            attr.key,
            attr.required,
            attr.min,
            attr.max,
            typeof attr.default === 'number' ? attr.default : undefined
          )
        } else if (attr.type === 'datetime') {
          result = await serverDatabases.createDatetimeAttribute(
            SERVER_CONFIG.databaseId,
            collection.$id,
            attr.key,
            attr.required
          )
        }
        console.log(`✅ Created attribute: ${attr.key}`)
      } catch (attrError) {
        console.error(`❌ Failed to create attribute ${attr.key}:`, attrError)
      }
    }

    console.log('🎉 User Preferences Collection setup complete!')
    console.log(`📝 Add this to your .env.local:`)
    console.log(`NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=${collection.$id}`)

    return collection

  } catch (error) {
    console.error('❌ Failed to create collection:', error)
    throw error
  }
}

// Run the setup if called directly
if (typeof window === 'undefined' && require.main === module) {
  createUserPreferencesCollection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
