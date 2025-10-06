#!/bin/bash

# Cashfree Payment Gateway Setup Script
echo "🏨 Setting up Cashfree Payment Gateway for Hotel Ritam..."

# Install required dependencies
echo "📦 Installing dependencies..."
npm install cashfree-pg crypto-js

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Appwrite Configuration - Client Side
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68dfcb00003a886e1efe
NEXT_PUBLIC_APPWRITE_DATABASE_ID=68e2622c00363be97bc1
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=68e2622c003640f6281b
NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=68e2622c00364aa5a6aa
NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=68e2622c003643335f5a
NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID=68e2622c00364ef58e8a
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=68e2622c00364fdb2dde
NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=user_preferences

# Appwrite Server-Side API Configuration
APPWRITE_API_KEY=your_api_key_here
APPWRITE_PROJECT_ID=68dfcb00003a886e1efe
APPWRITE_DATABASE_ID=68e2622c00363be97bc1

# Cashfree Payment Gateway Configuration
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here
NEXT_PUBLIC_CASHFREE_MODE=sandbox
# Set to 'production' for live environment
EOF
fi

echo "✅ Cashfree integration setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Get your Cashfree credentials from https://merchant.cashfree.com/"
echo "2. Update CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local"
echo "3. Test the integration at http://localhost:3000/payment/test"
echo "4. Read CASHFREE_INTEGRATION.md for detailed instructions"
echo ""
echo "🚀 Ready to accept payments!"
