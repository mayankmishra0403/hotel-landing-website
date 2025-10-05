#!/usr/bin/env node
import { Client, Databases, IndexType } from 'node-appwrite'

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID
const bookingsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID
const reviewsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID
const contactsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('Missing required env vars')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)

async function safeCreateIndex(collectionId, key, type, attributes, collectionName) {
  try {
    await databases.createIndex(databaseId, collectionId, key, type, attributes)
    console.log(`  ✓ ${collectionName}.${key}`)
  } catch (e) {
    if (e?.message?.includes('already exists') || e?.code === 409) {
      console.log(`  ~ ${collectionName}.${key} (exists)`)
    } else {
      console.error(`  ✗ ${collectionName}.${key}:`, e?.message || e)
    }
  }
}

;(async () => {
  console.log('🔍 Creating indexes...\n')
  
  console.log('📋 Users indexes:')
  await safeCreateIndex(usersCollectionId, 'idx_userId', IndexType.Key, ['userId'], 'users')
  await safeCreateIndex(usersCollectionId, 'idx_email', IndexType.Key, ['email'], 'users')
  
  console.log('\n📋 Bookings indexes:')
  await safeCreateIndex(bookingsCollectionId, 'idx_userId', IndexType.Key, ['userId'], 'bookings')
  await safeCreateIndex(bookingsCollectionId, 'idx_confirmationId', IndexType.Unique, ['confirmationId'], 'bookings')
  await safeCreateIndex(bookingsCollectionId, 'idx_status', IndexType.Key, ['status'], 'bookings')
  await safeCreateIndex(bookingsCollectionId, 'idx_createdAt', IndexType.Key, ['createdAt'], 'bookings')
  
  console.log('\n📋 Reviews indexes:')
  await safeCreateIndex(reviewsCollectionId, 'idx_userId', IndexType.Key, ['userId'], 'reviews')
  await safeCreateIndex(reviewsCollectionId, 'idx_bookingId', IndexType.Key, ['bookingId'], 'reviews')
  
  console.log('\n📋 Contacts indexes:')
  await safeCreateIndex(contactsCollectionId, 'idx_status', IndexType.Key, ['status'], 'contacts')
  await safeCreateIndex(contactsCollectionId, 'idx_createdAt', IndexType.Key, ['createdAt'], 'contacts')
  
  console.log('\n✅ Indexes created!')
})().catch((e) => {
  console.error('❌ Index creation failed:', e)
  process.exit(1)
})
