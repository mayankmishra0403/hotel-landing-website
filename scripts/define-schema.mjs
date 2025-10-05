#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client, TablesDB, Permission, Role } from 'node-appwrite'

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing one of: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const tables = new TablesDB(client)

const __filename = fileURLToPath(import.meta.url)
const __dirnameESM = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirnameESM, '..')
const envPath = path.join(workspaceRoot, '.env.local')

function loadEnvLocal() {
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

// No table creation here; we only add columns to existing collections/tables.

async function defineUsers(tableId) {
  await tables.createStringColumn(databaseId, tableId, 'userId', 64, true)
  await tables.createStringColumn(databaseId, tableId, 'name', 128, true)
  await tables.createEmailColumn(databaseId, tableId, 'email', true)
  await tables.createStringColumn(databaseId, tableId, 'phone', 32, false)
  await tables.createStringColumn(databaseId, tableId, 'address', 256, false)
  await tables.createStringColumn(databaseId, tableId, 'city', 128, false)
  await tables.createStringColumn(databaseId, tableId, 'country', 128, false)
  await tables.createStringColumn(databaseId, tableId, 'preferences', 2048, false)
  await tables.createIntegerColumn({ databaseId, tableId, key: 'loyaltyPoints', required: false, xdefault: 0 })
  await tables.createEnumColumn({ databaseId, tableId, key: 'membershipTier', elements: ['bronze','silver','gold','platinum'], required: false, xdefault: 'bronze' })
  await tables.createDatetimeColumn(databaseId, tableId, 'createdAt', true)
  await tables.createDatetimeColumn(databaseId, tableId, 'updatedAt', true)
}

async function defineBookings(tableId) {
  await tables.createStringColumn(databaseId, tableId, 'userId', 64, true)
  await tables.createStringColumn(databaseId, tableId, 'guestName', 128, true)
  await tables.createEmailColumn(databaseId, tableId, 'guestEmail', true)
  await tables.createStringColumn(databaseId, tableId, 'guestPhone', 32, false)
  await tables.createStringColumn(databaseId, tableId, 'roomId', 64, true)
  await tables.createStringColumn(databaseId, tableId, 'roomName', 128, true)
  await tables.createFloatColumn(databaseId, tableId, 'roomPrice', true)
  await tables.createDatetimeColumn(databaseId, tableId, 'checkIn', true)
  await tables.createDatetimeColumn(databaseId, tableId, 'checkOut', true)
  await tables.createIntegerColumn(databaseId, tableId, 'guests', true)
  await tables.createIntegerColumn(databaseId, tableId, 'nights', true)
  await tables.createFloatColumn(databaseId, tableId, 'totalAmount', true)
  await tables.createFloatColumn(databaseId, tableId, 'taxes', true)
  await tables.createFloatColumn(databaseId, tableId, 'finalTotal', true)
  await tables.createStringColumn(databaseId, tableId, 'specialRequests', 1024, false)
  await tables.createEnumColumn(databaseId, tableId, 'status', ['pending','confirmed','checked-in','checked-out','cancelled'], true)
  await tables.createEnumColumn(databaseId, tableId, 'paymentStatus', ['pending','paid','refunded','failed'], true)
  await tables.createStringColumn(databaseId, tableId, 'paymentMethod', 32, false)
  await tables.createStringColumn(databaseId, tableId, 'confirmationId', 64, true)
  await tables.createDatetimeColumn(databaseId, tableId, 'createdAt', true)
  await tables.createDatetimeColumn(databaseId, tableId, 'updatedAt', true)
}

async function defineReviews(tableId) {
  await tables.createStringColumn(databaseId, tableId, 'userId', 64, true)
  await tables.createStringColumn(databaseId, tableId, 'bookingId', 64, false)
  await tables.createIntegerColumn({ databaseId, tableId, key: 'rating', required: true, min: 1, max: 5 })
  await tables.createStringColumn(databaseId, tableId, 'title', 128, true)
  await tables.createStringColumn(databaseId, tableId, 'comment', 1024, true)
  await tables.createDatetimeColumn(databaseId, tableId, 'createdAt', true)
}

async function defineContacts(tableId) {
  await tables.createStringColumn(databaseId, tableId, 'name', 128, true)
  await tables.createEmailColumn(databaseId, tableId, 'email', true)
  await tables.createStringColumn(databaseId, tableId, 'phone', 32, false)
  await tables.createStringColumn(databaseId, tableId, 'subject', 128, true)
  await tables.createStringColumn(databaseId, tableId, 'message', 2048, true)
  await tables.createEnumColumn(databaseId, tableId, 'status', ['new','read','replied'], false, 'new')
  await tables.createDatetimeColumn(databaseId, tableId, 'createdAt', true)
}

;(async () => {
  console.log('Defining TablesDB schema on existing collections...')
  // Load .env.local if needed
  if (!databaseId) loadEnvLocal()
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  const uId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID
  const bId = process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID
  const rId = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID
  const cId = process.env.NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID

  if (!dbId || !uId || !bId || !rId || !cId) {
    console.error('Missing one or more collection IDs in environment (.env.local): USERS/BOOKINGS/REVIEWS/CONTACTS')
    process.exit(1)
  }

  console.log('Creating columns for users...')
  await defineUsers(uId)
  console.log('Creating columns for bookings...')
  await defineBookings(bId)
  console.log('Creating columns for reviews...')
  await defineReviews(rId)
  console.log('Creating columns for contacts...')
  await defineContacts(cId)

  console.log('Schema defined successfully.')
})().catch((e) => {
  console.error('Schema definition failed:', e)
  process.exit(1)
})
