# Deploy to Vercel with edu-nova.tech

## 1) Prepare Environment Variables (Vercel → Project → Settings → Environment Variables)

Required (Production):
- NEXT_PUBLIC_BASE_URL=https://edu-nova.tech
- NEXT_PUBLIC_CASHFREE_MODE=production
- CASHFREE_APP_ID=<your_production_app_id>
- CASHFREE_SECRET_KEY=<your_production_secret_key>
- NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
- NEXT_PUBLIC_APPWRITE_PROJECT_ID=68dfcb00003a886e1efe
- NEXT_PUBLIC_APPWRITE_DATABASE_ID=68e2622c00363be97bc1
- NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=68e2622c003640f6281b
- NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=68e2622c00364aa5a6aa
- NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=68e2622c003643335f5a
- NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID=68e2622c00364ef58e8a
- NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=68e2622c00364fdb2dde
- NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID=user_preferences
- APPWRITE_API_KEY=your_appwrite_api_key
- APPWRITE_PROJECT_ID=68dfcb00003a886e1efe
- APPWRITE_DATABASE_ID=68e2622c00363be97bc1

## 2) Cashfree Dashboard Settings
- Return URL: https://edu-nova.tech/payment/callback
- Webhook URL: https://edu-nova.tech/api/payment/webhook

## 3) Add Domain in Vercel
- Vercel → Project → Settings → Domains → Add edu-nova.tech
- For apex (edu-nova.tech):
  - Either set Vercel as nameservers (recommended), or
  - Add an A/ALIAS/ANAME per your DNS to Vercel (follow Vercel wizard)
- For www.edu-nova.tech: add CNAME to `cname.vercel-dns.com`

## 4) Build & Deploy
- Connect GitHub repo to Vercel and deploy the `sanitize-secrets` (or main) branch.
- Ensure the environment variables above are added in Vercel Production.

## 5) Test Flow (Live)
- Create a real booking with small amount.
- You should be redirected to Cashfree hosted checkout with Card/UPI/Wallet/Netbanking.
- After payment, you land on /payment/callback.
- Verify booking in Appwrite reflects paymentStatus SUCCESS.

## 6) Troubleshooting
- Webhook not firing: check Cashfree dashboard URL, inspect Vercel logs for /api/payment/webhook.
- Payment shows pending: verify /api/payment/verify call on callback page returns SUCCESS; if not, check credentials and Cashfree orderId.
- Mock page access: blocked in production by code.

## 7) Optional Staging
- Add staging.edu-nova.tech with sandbox keys:
  - NEXT_PUBLIC_CASHFREE_MODE=sandbox
  - CASHFREE_APP_ID=SANDBOX_APP_ID
  - CASHFREE_SECRET_KEY=SANDBOX_SECRET
  - NEXT_PUBLIC_BASE_URL=https://staging.edu-nova.tech
