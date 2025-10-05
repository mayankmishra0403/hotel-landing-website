#!/usr/bin/env node
import { Client, Databases } from 'node-appwrite'

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

async function safeCreateAttribute(fn, collectionName, attributeName) {
  try {
    await fn()
    console.log(`  ✓ ${collectionName}.${attributeName}`)
  } catch (e) {
    if (e?.message?.includes('already exists') || e?.code === 409) {
      console.log(`  ~ ${collectionName}.${attributeName} (exists)`)
    } else {
      console.error(`  ✗ ${collectionName}.${attributeName}:`, e?.message || e)
    }
  }
}

async function defineUsersAttributes() {
  console.log('\n📋 Users Collection:')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'userId', 64, true), 'users', 'userId')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'name', 128, true), 'users', 'name')
  await safeCreateAttribute(() => databases.createEmailAttribute(databaseId, usersCollectionId, 'email', true), 'users', 'email')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'phone', 32, false), 'users', 'phone')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'address', 256, false), 'users', 'address')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'city', 128, false), 'users', 'city')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'country', 128, false), 'users', 'country')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, usersCollectionId, 'preferences', 2048, false), 'users', 'preferences')
  await safeCreateAttribute(() => databases.createIntegerAttribute(databaseId, usersCollectionId, 'loyaltyPoints', false, 0), 'users', 'loyaltyPoints')
  await safeCreateAttribute(() => databases.createEnumAttribute(databaseId, usersCollectionId, 'membershipTier', ['bronze','silver','gold','platinum'], false, 'bronze'), 'users', 'membershipTier')
  await safeCreateAttribute(() => databases.createDatetimeAttribute(databaseId, usersCollectionId, 'createdAt', true), 'users', 'createdAt')
  await safeCreateAttribute(() => databases.createDatetimeAttribute(databaseId, usersCollectionId, 'updatedAt', true), 'users', 'updatedAt')
}

async function defineBookingsAttributes() {
  console.log('\n📋 Bookings Collection:')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'userId', 64, true), 'bookings', 'userId')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'guestName', 128, true), 'bookings', 'guestName')
  await safeCreateAttribute(() => databases.createEmailAttribute(databaseId, bookingsCollectionId, 'guestEmail', true), 'bookings', 'guestEmail')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'guestPhone', 32, false), 'bookings', 'guestPhone')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'roomId', 64, true), 'bookings', 'roomId')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'roomName', 128, true), 'bookings', 'roomName')
  await safeCreateAttribute(() => databases.createFloatAttribute(databaseId, bookingsCollectionId, 'roomPrice', true), 'bookings', 'roomPrice')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'checkIn', 32, true), 'bookings', 'checkIn')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'checkOut', 32, true), 'bookings', 'checkOut')
  await safeCreateAttribute(() => databases.createIntegerAttribute(databaseId, bookingsCollectionId, 'guests', true), 'bookings', 'guests')
  await safeCreateAttribute(() => databases.createIntegerAttribute(databaseId, bookingsCollectionId, 'nights', true), 'bookings', 'nights')
  await safeCreateAttribute(() => databases.createFloatAttribute(databaseId, bookingsCollectionId, 'totalAmount', true), 'bookings', 'totalAmount')
  await safeCreateAttribute(() => databases.createFloatAttribute(databaseId, bookingsCollectionId, 'taxes', true), 'bookings', 'taxes')
  await safeCreateAttribute(() => databases.createFloatAttribute(databaseId, bookingsCollectionId, 'finalTotal', true), 'bookings', 'finalTotal')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'specialRequests', 1024, false), 'bookings', 'specialRequests')
  await safeCreateAttribute(() => databases.createEnumAttribute(databaseId, bookingsCollectionId, 'status', ['pending','confirmed','checked-in','checked-out','cancelled'], true), 'bookings', 'status')
  await safeCreateAttribute(() => databases.createEnumAttribute(databaseId, bookingsCollectionId, 'paymentStatus', ['pending','paid','refunded','failed'], true), 'bookings', 'paymentStatus')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'paymentMethod', 32, false), 'bookings', 'paymentMethod')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'confirmationId', 64, true), 'bookings', 'confirmationId')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'createdAt', 32, true), 'bookings', 'createdAt')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, bookingsCollectionId, 'updatedAt', 32, true), 'bookings', 'updatedAt')
}

async function defineReviewsAttributes() {
  console.log('\n📋 Reviews Collection:')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, reviewsCollectionId, 'userId', 64, true), 'reviews', 'userId')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, reviewsCollectionId, 'bookingId', 64, false), 'reviews', 'bookingId')
  await safeCreateAttribute(() => databases.createIntegerAttribute(databaseId, reviewsCollectionId, 'rating', true, 1, 5), 'reviews', 'rating')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, reviewsCollectionId, 'title', 128, true), 'reviews', 'title')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, reviewsCollectionId, 'comment', 1024, true), 'reviews', 'comment')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, reviewsCollectionId, 'createdAt', 32, true), 'reviews', 'createdAt')
}

async function defineContactsAttributes() {
  console.log('\n📋 Contacts Collection:')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, contactsCollectionId, 'name', 128, true), 'contacts', 'name')
  await safeCreateAttribute(() => databases.createEmailAttribute(databaseId, contactsCollectionId, 'email', true), 'contacts', 'email')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, contactsCollectionId, 'phone', 32, false), 'contacts', 'phone')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, contactsCollectionId, 'subject', 128, true), 'contacts', 'subject')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, contactsCollectionId, 'message', 2048, true), 'contacts', 'message')
  await safeCreateAttribute(() => databases.createEnumAttribute(databaseId, contactsCollectionId, 'status', ['new','read','replied'], false, 'new'), 'contacts', 'status')
  await safeCreateAttribute(() => databases.createStringAttribute(databaseId, contactsCollectionId, 'createdAt', 32, true), 'contacts', 'createdAt')
}

;(async () => {
  console.log('🚀 Adding attributes to collections...')
  
  await defineUsersAttributes()
  await defineBookingsAttributes()
  await defineReviewsAttributes()
  await defineContactsAttributes()
  
  console.log('\n✅ Schema definition complete!')
  console.log('\n📝 Next steps:')
  console.log('  1. Wait ~30 seconds for attributes to become available')
  console.log('  2. Test creating a booking via the website')
  console.log('  3. Check Appwrite console to verify data')
})().catch((e) => {
  console.error('❌ Schema definition failed:', e)
  process.exit(1)
})
