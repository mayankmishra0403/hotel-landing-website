# 🗄️ Creating User Preferences Collection in Appwrite

## Step 1: Go to Appwrite Console
1. Open: `https://fra.cloud.appwrite.io/console`
2. Select project: `68dfcb00003a886e1efe`
3. Go to **Databases** → Select database: `68e2622c00363be97bc1`

## Step 2: Create Collection
1. Click **"Create Collection"**
2. **Collection ID**: `user_preferences` (exactly this name)
3. **Name**: `User Preferences`
4. Click **"Create"**

## Step 3: Add Attributes (Fields)

### Required Attributes:
1. **userId** (String)
   - Type: String
   - Size: 36
   - Required: Yes
   - Array: No

2. **favoriteServices** (String Array)
   - Type: String
   - Size: 50
   - Required: No
   - Array: Yes

3. **previousServices** (JSON)
   - Type: JSON
   - Required: No
   - Default: []

4. **loyaltyPoints** (Integer)
   - Type: Integer
   - Min: 0
   - Max: 999999
   - Required: No
   - Default: 0

5. **membershipTier** (String)
   - Type: String
   - Size: 20
   - Required: No
   - Default: "bronze"

6. **guestPreferences** (JSON)
   - Type: JSON
   - Required: No
   - Default: {}

7. **createdAt** (DateTime)
   - Type: DateTime
   - Required: No

8. **updatedAt** (DateTime)
   - Type: DateTime
   - Required: No

## Step 4: Set Permissions
1. Go to **Settings** tab
2. **Document Security**: Enabled
3. **Permissions**:
   - **Create**: Users
   - **Read**: Users
   - **Update**: Users
   - **Delete**: Users

## Step 5: Update Environment Variables
Add this to your `.env.local`:
```bash
NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=your_new_collection_id_here
```

## Quick Setup Script (Alternative)
If you prefer, I can create a script to set this up automatically via API.
