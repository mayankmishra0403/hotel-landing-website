# Cashfree Payment Gateway Integration

This document provides a complete guide for integrating Cashfree Payment Gateway into your Hotel Ritam booking system.

## 🏗️ Architecture Overview

The integration follows this flow:
1. **User completes booking form** → Creates booking record in database
2. **Payment order creation** → Calls Cashfree API to create payment session
3. **User redirected to Cashfree** → Secure payment processing
4. **Payment completion** → User redirected back with payment status
5. **Webhook notification** → Real-time payment status updates
6. **Booking confirmation** → Update booking status and send confirmations

## 📦 Installation

### 1. Install Dependencies

```bash
npm install cashfree-pg crypto-js
```

### 2. Environment Configuration

Add these variables to your `.env.local`:

```bash
# Cashfree Payment Gateway Configuration
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here
NEXT_PUBLIC_CASHFREE_MODE=sandbox
# Set to 'production' for live environment
```

### 3. Get Cashfree Credentials

1. Sign up at [Cashfree Dashboard](https://merchant.cashfree.com/)
2. Go to **Credentials** section
3. Copy your **App ID** and **Secret Key**
4. Replace the placeholder values in `.env.local`

## 🔧 Components Created

### 1. Core Configuration (`src/lib/cashfree-config.ts`)
- Payment gateway configuration
- Environment management
- Amount validation and formatting
- URL generation for callbacks

### 2. Payment Service (`src/lib/cashfree-service.ts`)  
- Order creation with Cashfree
- Payment verification
- Webhook signature verification
- Refund processing
- Payment status mapping

### 3. API Routes

#### `/api/payment/create-order`
- **POST**: Creates Cashfree payment order
- **Input**: Booking details, guest information, selected services
- **Output**: Payment session token and redirect URL

#### `/api/payment/verify`
- **POST**: Verifies payment status with Cashfree
- **GET**: Checks payment status by order ID
- **Updates**: Booking record with payment information

#### `/api/payment/webhook`
- **POST**: Handles Cashfree webhook notifications
- **Features**: Signature verification, real-time status updates
- **Events**: Payment success, failure, user dropped

### 4. Payment Callback Page (`src/app/payment/callback/page.tsx`)
- User-friendly payment result display
- Automatic payment verification
- Booking confirmation or retry options
- Responsive design with animations

## 🎯 Integration Points

### Enhanced Booking Modal
The booking modal has been updated to:
- Create booking record first (with pending payment)
- Generate Cashfree payment order
- Redirect user to payment gateway
- Handle payment responses

### Key Changes:
```typescript
// Before: Direct booking creation
const res = await bookingService.createBooking(payload)

// After: Create booking → Create payment order → Redirect
const bookingResult = await bookingService.createBooking(payload)
const paymentResult = await fetch('/api/payment/create-order', {...})
window.location.href = paymentUrl
```

## 💰 Payment Flow

### 1. Order Creation
```javascript
{
  orderId: "HOTEL_booking123_1634567890",
  orderAmount: 2500,
  orderCurrency: "INR",
  customerDetails: {
    customerId: "user123",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "9876543210"
  }
}
```

### 2. Payment Methods Supported
- Credit Cards (Visa, MasterCard, RuPay)
- Debit Cards
- Net Banking (All major banks)
- UPI (GPay, PhonePe, Paytm, etc.)
- Digital Wallets (Paytm, Mobikwik, etc.)
- Pay Later (Simpl, LazyPay, etc.)

### 3. Fee Structure
- Base booking amount
- Service fee: 2.5% of booking amount
- GST: 18% on service fee
- **Total = Booking + Service Fee + GST**

## 🔒 Security Features

### 1. Webhook Signature Verification
```typescript
const signature = request.headers.get('x-webhook-signature')
const timestamp = request.headers.get('x-webhook-timestamp')
const isValid = cashfreeService.verifyWebhookSignature(rawBody, signature, timestamp)
```

### 2. Server-Side API Authentication
- All Cashfree API calls happen server-side
- Credentials never exposed to client
- Secure signature generation for each request

### 3. Payment Status Verification
- Double verification: redirect callback + webhook
- Payment amount validation
- Order ID matching with booking records

## 🚀 Testing

### Sandbox Environment
1. Set `NEXT_PUBLIC_CASHFREE_MODE=sandbox` in `.env.local`
2. Use test credentials from Cashfree dashboard
3. Use test payment methods:
   - **Test Card**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **OTP**: 123456

### Test Payment Scenarios
- **Successful Payment**: Use test card with CVV 123
- **Failed Payment**: Use test card with CVV 400
- **Pending Payment**: Use test card with CVV 500

## 📊 Database Schema Updates

### Booking Records
New fields added to booking collection:
```javascript
{
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled',
  paymentOrderId: 'HOTEL_booking123_1634567890',
  paymentTransactionId: 'cf_payment_123456',
  paymentAmount: 2500,
  paymentTime: '2024-01-15T10:30:00Z',
  paymentMethod: 'upi'
}
```

## 🎨 User Experience

### Payment Journey
1. **Booking Form Completion** → All steps of enhanced booking modal
2. **Payment Summary** → Clear breakdown of charges and fees
3. **Secure Redirect** → Cashfree hosted payment page
4. **Payment Processing** → Multiple payment options
5. **Result Display** → Beautiful success/failure page with details
6. **Confirmation** → Email/SMS notifications (to be implemented)

### Error Handling
- Network timeouts with retry options
- Invalid payment data validation
- User-friendly error messages
- Fallback to customer support contact

## 🔄 Webhook Configuration

In your Cashfree dashboard:
1. Go to **Webhook** settings
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Enable events: `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `PAYMENT_USER_DROPPED_WEBHOOK`
4. Test webhook delivery

## 📈 Production Deployment

### 1. Environment Switch
```bash
# Production settings
NEXT_PUBLIC_CASHFREE_MODE=production
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
```

### 2. Domain Configuration
- Update return URLs in Cashfree dashboard
- Configure webhook URLs for production domain
- Test all payment flows in production environment

### 3. Monitoring
- Monitor webhook delivery success rates
- Track payment success/failure rates
- Set up alerts for payment anomalies

## 🛠️ Customization Options

### Payment Methods
Customize available payment methods in `cashfree-service.ts`:
```typescript
orderMeta: {
  paymentMethods: 'cc,dc,nb,upi' // Remove unwanted methods
}
```

### Styling
- Customize payment callback page styling
- Update booking modal payment section
- Brand colors and logos in payment flow

### Business Logic
- Modify fee calculation logic
- Add promotional discounts
- Implement dynamic pricing

## 📞 Support & Troubleshooting

### Common Issues
1. **Invalid Signature Error**: Check webhook signature verification
2. **Amount Mismatch**: Ensure amount is in paise (multiply by 100)
3. **Timeout Errors**: Implement proper retry logic

### Debug Mode
Enable detailed logging in development:
```typescript
console.log('Payment Order:', paymentOrder)
console.log('Webhook Data:', webhookData)
```

### Contact Support
- **Cashfree Support**: support@cashfree.com
- **Documentation**: https://dev.cashfree.com/
- **Dashboard**: https://merchant.cashfree.com/

---

## 🎉 Ready to Go!

Your Cashfree integration is now complete! Users can:
- ✅ Select premium hotel services
- ✅ Complete secure payments
- ✅ Receive instant confirmations
- ✅ Track booking status
- ✅ Get real-time updates

**Next Steps:**
1. Add your Cashfree credentials to `.env.local`
2. Test the payment flow in sandbox mode
3. Configure webhooks in Cashfree dashboard
4. Deploy to production with live credentials
