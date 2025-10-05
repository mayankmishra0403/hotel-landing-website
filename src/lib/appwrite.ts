import { Client, Account, Databases, Storage, ID } from 'appwrite'

// Appwrite configuration
export const APPWRITE_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'hotel-ritam',
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'hotel-ritam-db',
  collections: {
    bookings: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings',
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
    contacts: process.env.NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID || 'contacts',
  },
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'hotel-ritam-storage',
}

// Initialize Appwrite client
const client = new Client()
client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)

// Initialize services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Helper function to generate unique IDs
export const generateId = () => ID.unique()

export default client
