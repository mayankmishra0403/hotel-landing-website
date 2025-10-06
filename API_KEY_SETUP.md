# 🔐 API Key Setup Guide

## How to Get Your Appwrite API Key

### Step 1: Go to Appwrite Console
1. Open [https://fra.cloud.appwrite.io/console](https://fra.cloud.appwrite.io/console)
2. Login to your account
3. Select your project: `68dfcb00003a886e1efe`

### Step 2: Generate API Key
1. In the left sidebar, click on **"API Keys"**
2. Click **"Create API Key"**
3. Give it a name: `Hotel Ritam Server Key`
4. Set expiration to **"Never"** (for production)
5. Set scopes to include:
   - `databases.read`
   - `databases.write` 
   - `documents.read`
   - `documents.write`
   - `collections.read`
6. Click **"Create"**
7. **Copy the API key** (you'll only see it once!)

### Step 3: Add to Environment Variables
1. Open your `.env.local` file
2. Replace `your_api_key_here_from_appwrite_console` with your actual API key:
   ```bash
   APPWRITE_API_KEY=your_actual_api_key_here
   ```

### Step 4: Restart Development Server
```bash
npm run dev
```

## 🎯 What This Enables

### ✅ Secure ID Generation
- All database IDs now generated server-side with API key
- No more client-side ID generation vulnerabilities
- Proper production-ready security

### ✅ Enhanced Database Operations
- Server-side booking creation with secure IDs
- API-based user preferences management
- Proper error handling and fallbacks

### ✅ Production Ready
- API key authentication for all database operations
- Secure server-side routes
- Proper separation of client/server operations

## 🏗️ Current Architecture

```
Client (Browser) 
    ↓ 
Next.js API Routes (/api/bookings, /api/user-preferences)
    ↓ 
Appwrite Server SDK (with API key)
    ↓ 
Appwrite Database
```

## 🧪 Testing the Setup

1. After adding API key, try booking a room
2. Check browser Network tab - should see calls to `/api/bookings`
3. Booking should complete successfully with secure ID generation
4. Check Appwrite console - new bookings should appear with proper IDs

## 🚨 Security Notes

- **Never commit API keys to git**
- API key should only be in `.env.local` (already in .gitignore)
- Server-side routes automatically use API key for authentication
- Client-side code no longer has direct database access

Your booking system is now production-ready with proper API key authentication! 🏨✨
