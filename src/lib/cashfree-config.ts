/**
 * Cashfree Payment Gateway Configuration
 * 
 * This file contains the configuration and utilities for integrating
 * Cashfree Payment Gateway with the hotel booking system.
 */

export interface CashfreeConfig {
  appId: string
  secretKey: string
  environment: 'sandbox' | 'production'
  apiVersion: string
}

export interface PaymentOrderRequest {
  orderId: string
  orderAmount: number
  orderCurrency: string
  customerDetails: {
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
  }
  orderMeta?: {
    returnUrl?: string
    notifyUrl?: string
    paymentMethods?: string
  }
}

export interface PaymentOrderResponse {
  cftoken: string
  orderId: string
  orderAmount: number
  orderCurrency: string
  paymentSessionId: string
}

export interface BookingPaymentData {
  bookingId: string
  userId: string
  guestName: string
  email: string
  phone: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  guests: number
  totalAmount: number
  selectedServices: Array<{
    name: string
    price: number
  }>
  specialRequests?: string
}

// Cashfree Configuration
export const getCashfreeConfig = (): CashfreeConfig => {
  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY
  const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE as 'sandbox' | 'production'

  console.log('🔧 Loading Cashfree config:', {
    appId: appId ? `${appId.substring(0, 6)}...` : 'NOT SET',
    secretKey: secretKey ? `${secretKey.substring(0, 6)}...` : 'NOT SET',
    mode: mode || 'sandbox'
  })

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials not configured. Please add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to your environment variables.')
  }

  return {
    appId,
    secretKey,
    environment: mode || 'sandbox',
    apiVersion: '2023-08-01'
  }
}

// API URLs based on environment
export const getCashfreeApiUrl = (environment: 'sandbox' | 'production'): string => {
  return environment === 'production' 
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'
}

// Generate unique order ID
export const generateOrderId = (bookingId: string): string => {
  const timestamp = Date.now()
  return `HOTEL_${bookingId}_${timestamp}`
}

// Validate payment amount (minimum 1 INR)
export const validatePaymentAmount = (amount: number): boolean => {
  return amount >= 1 && amount <= 100000000 // Max 1 crore
}

 // Format currency for Cashfree (supports INR, USD, etc.)
export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2)
}

// Generate return URL for payment completion
export const generateReturnUrl = (bookingId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/payment/callback?bookingId=${bookingId}`
}

// Generate webhook URL for payment notifications
export const generateWebhookUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/api/payment/webhook`
}

// Payment status enum
export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  USER_DROPPED = 'USER_DROPPED'
}

// Service fee calculation (2.5% + GST)
export const calculatePaymentFees = (amount: number): {
  subtotal: number
  serviceFee: number
  gst: number
  total: number
} => {
  const subtotal = amount
  const serviceFee = Math.round(amount * 0.025) // 2.5% service fee
  const gst = Math.round(serviceFee * 0.18) // 18% GST on service fee
  const total = subtotal + serviceFee + gst

  return {
    subtotal,
    serviceFee,
    gst,
    total
  }
}
