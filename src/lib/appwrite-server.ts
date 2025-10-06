import { Client, Databases, ID } from 'node-appwrite'

// Server-side Appwrite configuration with API key
const serverClient = new Client()

serverClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68dfcb00003a886e1efe')
  .setKey(process.env.APPWRITE_API_KEY || '') // Server API Key for admin operations

// Server-side services
export const serverDatabases = new Databases(serverClient)

// Server-side configuration
export const SERVER_CONFIG = {
  projectId: process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68dfcb00003a886e1efe',
  databaseId: process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68e2622c00363be97bc1',
  collections: {
    bookings: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || '68e2622c00364aa5a6aa',
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '68e2622c003640f6281b',
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || '68e2622c003643335f5a',
    contacts: process.env.NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID || '68e2622c00364ef58e8a',
    userPreferences: process.env.NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID || 'user_preferences',
  }
}

// Generate secure IDs using server-side API
export const generateSecureId = () => ID.unique()

// Check if server configuration is properly set up
export const isServerConfigured = () => {
  const apiKey = process.env.APPWRITE_API_KEY
  return apiKey && apiKey !== 'your_api_key_here_from_appwrite_console' && apiKey.length > 0
}

export default serverClient
