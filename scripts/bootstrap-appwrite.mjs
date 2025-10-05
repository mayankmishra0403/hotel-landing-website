#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Client, Databases, Storage, Permission, Role, ID } from 'node-appwrite'

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID or APPWRITE_API_KEY in environment')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)
const storage = new Storage(client)

const __filename = fileURLToPath(import.meta.url)
const __dirnameESM = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirnameESM, '..')
const envPath = path.join(workspaceRoot, '.env.local')

async function safeCreateDatabase(databaseId, name) {
  try {
    const res = await databases.create(databaseId, name)
    return res.$id || databaseId
  } catch (err) {
    // If database already exists or API differs, try to find any existing DBs
    console.error('createDatabase error (continuing):', err.message || err)
    return databaseId
  }
}

async function safeCreateCollection(databaseId, collectionId, name) {
  try {
    const permissions = [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]
    const res = await databases.createCollection(
      databaseId,
      collectionId,
      name,
      permissions,
      true, // documentSecurity
      true  // enabled
    )
    return res.$id || collectionId
  } catch (err) {
    console.error(`createCollection ${name} error (continuing):`, err.message || err)
    return collectionId
  }
}

async function safeCreateBucket(bucketId, name) {
  try {
    const permissions = [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]
    const res = await storage.createBucket(
      bucketId,
      name,
      permissions,
      false, // fileSecurity
      true,  // enabled
      undefined, // maximumFileSize
      ['jpg','jpeg','png','webp','pdf']
    )
    return res.$id || bucketId
  } catch (err) {
    console.error('createBucket error (continuing):', err.message || err)
    return bucketId
  }
}

function writeEnv(updates) {
  let content = ''
  if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8')

  for (const [key, value] of Object.entries(updates)) {
    const re = new RegExp(`^${key}=.*$`, 'm')
    if (re.test(content)) {
      content = content.replace(re, `${key}=${value}`)
    } else {
      content += `\n${key}=${value}`
    }
  }

  fs.writeFileSync(envPath, content, 'utf8')
}

;(async () => {
  console.log('Bootstrapping Appwrite resources...')

  const databaseId = ID.unique()
  const usersCollectionId = ID.unique()
  const bookingsCollectionId = ID.unique()
  const reviewsCollectionId = ID.unique()
  const contactsCollectionId = ID.unique()
  const bucketId = ID.unique()

  console.log('Creating database...')
  const createdDatabaseId = await safeCreateDatabase(databaseId, 'hotel-ritam-db')

  console.log('Creating collections...')
  const createdUsersId = await safeCreateCollection(createdDatabaseId, usersCollectionId, 'users')
  const createdBookingsId = await safeCreateCollection(createdDatabaseId, bookingsCollectionId, 'bookings')
  const createdReviewsId = await safeCreateCollection(createdDatabaseId, reviewsCollectionId, 'reviews')
  const createdContactsId = await safeCreateCollection(createdDatabaseId, contactsCollectionId, 'contacts')

  console.log('Creating storage bucket...')
  const createdBucketId = await safeCreateBucket(bucketId, 'hotel-ritam-uploads')

  const updates = {
    NEXT_PUBLIC_APPWRITE_ENDPOINT: endpoint,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: projectId,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: createdDatabaseId,
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID: createdUsersId,
    NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID: createdBookingsId,
    NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID: createdReviewsId,
    NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID: createdContactsId,
    NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID: createdBucketId,
  }

  writeEnv(updates)

  console.log('\nCreated resources:')
  console.log('DATABASE_ID=', createdDatabaseId)
  console.log('USERS_COLLECTION_ID=', createdUsersId)
  console.log('BOOKINGS_COLLECTION_ID=', createdBookingsId)
  console.log('REVIEWS_COLLECTION_ID=', createdReviewsId)
  console.log('CONTACTS_COLLECTION_ID=', createdContactsId)
  console.log('BUCKET_ID=', createdBucketId)

  console.log('\n.env.local updated at', envPath)
  console.log('\nDone.')
})().catch(err => {
  console.error('Bootstrap failed:', err)
  process.exit(1)
})
