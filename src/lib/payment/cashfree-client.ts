/**
 * Cashfree Web SDK loader and popup checkout helper (graceful fallback)
 */
'use client'

type CashfreeMode = 'PROD' | 'TEST'

declare global {
  interface Window {
    Cashfree?: any
  }
}

export async function loadCashfreeSdk(): Promise<any | null> {
  if (typeof window === 'undefined') return null
  if (window.Cashfree) return window.Cashfree

  const cfMode: CashfreeMode = (process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'PROD' : 'TEST')

  const script = document.createElement('script')
  // Try official v2 SDK URLs
  script.src = cfMode === 'PROD'
    ? 'https://sdk.cashfree.com/js/ui/2.0/cashfree.prod.js'
    : 'https://sdk.cashfree.com/js/ui/2.0/cashfree.sandbox.js'
  script.async = true

  const loaded = new Promise<boolean>((resolve) => {
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
  })

  document.head.appendChild(script)
  const ok = await loaded
  if (!ok) return null
  return window.Cashfree || null
}

export async function openCashfreePopup(paymentSessionId: string): Promise<'completed' | 'cancelled' | 'failed'> {
  const cashfree = await loadCashfreeSdk()
  if (!cashfree) throw new Error('Cashfree SDK failed to load')

  // New SDK pattern: instantiate and call checkout
  try {
    const cf = new cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'PROD' : 'TEST' })
    const result = await cf.checkout({
      paymentSessionId,
      redirectTarget: '_modal'
    })
    // If SDK resolves, treat as completed (Cashfree recommends verifying server-side regardless)
    if (result) return 'completed'
    return 'failed'
  } catch (e) {
    // Some SDKs expose as function rather than class; try alternate call
    try {
      const result = await cashfree.checkout({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'PROD' : 'TEST',
        paymentSessionId,
        redirectTarget: '_modal'
      })
      if (result) return 'completed'
      return 'failed'
    } catch (err) {
      console.error('Cashfree popup error:', err)
      return 'failed'
    }
  }
}
