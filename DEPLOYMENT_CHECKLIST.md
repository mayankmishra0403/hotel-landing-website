# 🚀 Production Deployment Checklist

## Quick Action Items (Do These Now!)

### ✅ Step 1: Fix Appwrite CORS (Blocking Login)
**Time**: 2 minutes

1. Go to: https://cloud.appwrite.io/console
2. Select your project (ID: `68dfcb00003a886e1efe`)
3. Click **Settings** → **Platforms**
4. Click **"Add Platform"** → Select **"Web App"**
5. Add first platform:
   - Name: `Hotel Production`
   - Hostname: `edu-nova.tech` (no https://)
   - Click **Save**
6. Click **"Add Platform"** again
7. Add second platform:
   - Name: `Hotel Production WWW`
   - Hostname: `www.edu-nova.tech`
   - Click **Save**

**Result**: Login will work immediately! ✨

---

### ✅ Step 2: Verify Vercel Auto-Deployment
**Time**: 1 minute

1. Go to: https://vercel.com/dashboard
2. Find your project: `hotel-landing-website`
3. Check **Deployments** tab
4. Look for latest deployment from `sanitize-secrets` branch
5. Status should be: **"Ready"** or **"Building"**

**If not deploying automatically**:
- Click **"Redeploy"** button
- Select latest commit: `fc830ae9`
- Click **"Redeploy"**

---

### ✅ Step 3: Test Production Website
**Time**: 3 minutes

**Test Login** (after Step 1):
- [ ] Go to https://www.edu-nova.tech
- [ ] Click "Login"
- [ ] Should work without CORS error ✅

**Test Payment**:
- [ ] Browse to "Rooms"
- [ ] Click "Book Now" on any room
- [ ] Fill booking form
- [ ] Click "Proceed to Payment"
- [ ] Should redirect to Cashfree checkout page ✅
- [ ] You'll see options: Card / UPI / Wallet / Net Banking ✅

---

### ✅ Step 4: Configure Cashfree Webhook
**Time**: 2 minutes

1. Login to: https://merchant.cashfree.com/
2. Go to **Developers** → **Webhooks**
3. Click **"Add Webhook"** or **"Configure"**
4. Enter webhook URL: `https://edu-nova.tech/api/payment/webhook`
5. Click **Save**

**Why?**: This enables real-time payment status updates when customers complete/cancel payments

---

## 🎯 Expected Results

After completing all steps:

| Feature | Status | What You'll See |
|---------|--------|----------------|
| Website | ✅ Live | https://www.edu-nova.tech loads |
| Login | ✅ Works | No CORS errors, users can login |
| Booking Form | ✅ Works | Modal opens, form validates |
| Payment | ✅ Works | Redirects to Cashfree checkout |
| Payment Options | ✅ Available | Card, UPI, Wallet, Net Banking |
| Payment Completion | ✅ Works | Returns to your site with status |
| Admin Panel | ✅ Accessible | Can view bookings after login |

---

## 🔍 How to Test Real Payment (Optional)

**Warning**: This will charge real money!

1. Complete a booking on your site
2. On Cashfree payment page:
   - Use **test card**: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - OTP: `123456`
3. Payment should succeed
4. You'll be redirected back to your site
5. Booking status should update to "Confirmed"

**Note**: Cashfree test mode uses test cards. Check with Cashfree if your production account has test mode enabled.

---

## ⚠️ Troubleshooting

### Login Still Fails?
- **Check**: Did you add BOTH domains in Appwrite?
  - `edu-nova.tech`
  - `www.edu-nova.tech`
- **Check**: Clear browser cache and try again
- **Check**: Look for errors in browser console (F12)

### Payment Still Shows 502?
- **Check**: Vercel deployed the latest code (commit `fc830ae9`)
- **Check**: Environment variables in Vercel dashboard:
  - `CASHFREE_APP_ID` = `10485420bbe37ea4e2f7a57270e2458401`
  - `CASHFREE_SECRET_KEY` = (your secret key from `.env.local`)
  - `NEXT_PUBLIC_CASHFREE_MODE` = `production`
- **Check**: Cashfree account is activated for production

### Webhook Not Working?
- **Check**: Webhook URL is exactly: `https://edu-nova.tech/api/payment/webhook`
- **Check**: No typos in Cashfree dashboard
- **Later**: You'll see webhook logs in Vercel → Functions → Logs

---

## 📊 Monitoring & Logs

### Vercel Logs:
- Go to: https://vercel.com/[your-project]/logs
- Filter by: `/api/payment/create-order`
- Look for: Cashfree API responses

### Cashfree Dashboard:
- Monitor transactions: https://merchant.cashfree.com/transactions
- Check for failed payments
- View payment analytics

### Appwrite Logs:
- Database → Bookings collection
- Check for new bookings
- Verify payment status updates

---

## ✨ Production is Ready When...

- [ ] Website loads at https://www.edu-nova.tech
- [ ] Users can login without errors
- [ ] Booking form submits successfully
- [ ] Payment redirects to Cashfree
- [ ] Cashfree shows: Card, UPI, Wallet options
- [ ] Payment completion returns to your site
- [ ] Webhook is configured in Cashfree
- [ ] Admin can view bookings

---

## 🎉 You're Live!

Once all checkboxes are ✅, your hotel booking website is **fully operational** with:
- ✅ Real payment processing
- ✅ User authentication
- ✅ Booking management
- ✅ Production security
- ✅ Webhook notifications

**Next**: Start promoting your website! 🚀

---

## 📞 Quick Reference

**Production URL**: https://edu-nova.tech  
**Vercel Dashboard**: https://vercel.com/dashboard  
**Appwrite Console**: https://cloud.appwrite.io/console  
**Cashfree Merchant**: https://merchant.cashfree.com/  
**GitHub Repo**: https://github.com/mayankmishra0403/hotel-landing-website  
**Current Branch**: `sanitize-secrets`

---

## 🔒 Security Notes

- ✅ All secrets in environment variables (not in code)
- ✅ Mock payments disabled in production
- ✅ Payment verification via Cashfree API only
- ✅ Webhook signatures validated
- ✅ HTTPS enforced on all pages
- ✅ Appwrite authentication secured
- ✅ GitHub secret scanning enabled

**Your production site is secure!** 🔐

