# MASTER PROMPT: Build “Hotel Ritam” full‑stack Next.js app (exact feature clone)

You are an expert full‑stack engineer. Create a production‑ready clone of a hotel booking website named “Hotel Ritam” using Next.js App Router with TypeScript and Tailwind. Include complete UI, data models, API routes, authentication, booking flow with premium services, payment integration (mock + Cashfree‑ready), user preferences with loyalty points, deployment artifacts, and docs. Deliver a runnable monorepo‑quality project.

## Tech stack and baseline
- Framework: Next.js 15+ (App Router), TypeScript, React Server Components where suitable
- Styling: Tailwind CSS, Framer Motion for tasteful animations
- Forms/validation: React Hook Form + Zod
- Icons: lucide-react
- State: Lightweight React state; no Redux
- Backend: Next.js Route Handlers (server-only), Appwrite SDK (client + server)
- Database: Appwrite (Databases + Auth + Storage)
- Payments: Mock payment flow + Cashfree wiring (no secrets); production-ready abstraction
- Build quality: ESLint + Prettier; pass build; add minimal tests for critical flows
- Deployment: Vercel (vercel.json), environment variables, README

## Project structure
- next.config.ts (images remotePatterns, eslint/typescript options sane by default)
- tailwind.config.ts, postcss.config.mjs, eslint config, tsconfig.json
- public/ (favicon, placeholder images, debug HTMLs for payment/test if useful)
- src/
  - app/
    - layout.tsx, globals.css, favicon route
    - page.tsx (home/hero)
    - amenities/page.tsx
    - rooms/page.tsx
    - dining/page.tsx
    - gallery/page.tsx
    - contact/page.tsx
    - bookings/page.tsx (user’s bookings list)
    - profile/page.tsx (user dashboard + preferences)
    - auth/login/page.tsx
    - auth/register/page.tsx
    - payment/
      - test/page.tsx (mock)
      - callback/page.tsx
      - mock/page.tsx
    - api/
      - health/route.ts
      - bookings/route.ts (GET user bookings, POST create booking)
      - user-preferences/route.ts (GET/POST/PUT preferences)
      - payment/
        - create/route.ts (mock create)
        - create-order/route.ts (Cashfree-ready stub)
        - verify/route.ts (mock verify)
        - webhook/route.ts (mock handler)
      - setup-collection/route.ts (optional helper to create user_preferences in Appwrite)
  - components/
    - sections/ (Hero, Services, Rooms teaser, Amenities, Dining, Gallery, Testimonials, Contact, QuickLinks, Footer, Header)
    - ui/ (EnhancedBookingModal.tsx, Button, Input, Select, Toast)
    - auth/AuthModal.tsx
  - contexts/AuthContext.tsx (basic auth provider using Appwrite)
  - lib/
    - appwrite.ts (client SDK init using NEXT_PUBLIC_*)
    - appwrite-server.ts (server SDK with APPWRITE_API_KEY; no client import)
    - payment/
      - cashfree.ts (types + helpers)
      - cashfree-client.ts (client-side helpers)
    - cashfree-config.ts (reads env; safe defaults)
  - services/
    - auth.ts (login/register/logout; SSR-safe; no secrets on client)
    - booking.ts (create/list bookings via API routes)
    - userPreferences.ts (get/update preferences via API routes)
  - data/ (static hotel data if needed; rooms/amenities definitions)

## Pages and UI requirements
- Global layout: Sticky header (logo, nav), Hero with background media, CTA “Special Offers”
- Home sections: Hero, Services, Rooms highlights, Amenities, Dining, Gallery, Testimonials, QuickLinks, Footer
- Rooms page: list cards with images, price per night, capacity, Book Now buttons
- Amenities page: grid of hotel amenities
- Dining page: restaurant cards with menus teaser
- Gallery page: image grid with lightbox
- Contact page: form with name/email/message; creates Appwrite “contacts” document
- Auth pages: login/register with email+password (Appwrite)
- Profile page: show user info, loyalty tier/points, favorite services, service history; allow updating preferences
- Bookings page: list of user bookings with status and totals

## Booking flow (EnhancedBookingModal)
- 6-step flow inside `src/components/ui/EnhancedBookingModal.tsx`:
  1) Dates + guests
  2) Room selection
  3) Premium services selection (8 items):
     - Airport Transfer ($50)
     - Spa Treatment ($120)
     - Room Service ($30)
     - Late Checkout ($25)
     - Breakfast Buffet ($20)
     - Gym Access ($15)
     - City Tour ($40)
     - Laundry Service ($18)
  4) Guest details
  5) Review summary (nights, base room cost, services total, taxes/fees)
  6) Payment (mock confirm + “Proceed to pay” option)
- Show dynamic pricing calc, loyalty points preview, and membership tier
- On submit:
  - POST /api/bookings with room, dates, guests, totalPrice, selectedServices (store also in specialRequests summary), and status=“pending” or “confirmed” depending on mock payment result
  - Update user preferences totals/points (server route handles logic; don’t trust client)

## User preferences and loyalty
- Appwrite collection: user_preferences
- Document shape:
  - userId: string (required, unique per user)
  - favoriteServices: string[] (default [])
  - loyaltyPoints: number (default 0)
  - membershipTier: "bronze" | "silver" | "gold" | "platinum" (default "bronze")
  - previousServices: Array<{ service: string; usedCount: number; lastUsed: string }>
  - guestPreferences: Record<string, unknown> (JSON), e.g., dietaryRestrictions, preferredServices
  - preferredRoomTypes: string[] (optional)
  - createdAt/updatedAt: datetime
- Loyalty logic (server-side):
  - points = 50 base + 10 per selected service + 5 per night
  - tiers: bronze < 200 → silver < 600 → gold < 1200 → platinum
  - update previousServices counts and lastUsed
- Provide /api/user-preferences GET (by userId), POST (create), PUT (upsert/update)

## Data model (Appwrite collections)
- users: Appwrite auth users (built-in)
- bookings: userId, roomId/roomName, checkIn, checkOut, guests, selectedServices (string[]), specialRequests (string summary), totalPrice, status, createdAt
- reviews: userId, rating, comment, createdAt
- contacts: name, email, message, createdAt
- user_preferences: as above
- Provide scripts or API helper to create user_preferences attributes if missing (graceful 404 fallback in routes)

## API routes behavior
- All write operations server-side via Appwrite Server SDK using APPWRITE_API_KEY; never expose API key to the client
- /api/bookings (GET user bookings via query userId; POST create booking)
- /api/user-preferences (GET by userId; POST create; PUT update)
- /api/payment/create (mock create intent)
- /api/payment/create-order (Cashfree-ready stub: read env, return payload to client)
- /api/payment/verify (mock verify; update booking status accordingly)
- /api/payment/webhook (mock endpoint; log and validate signature if configured)
- /api/health (return { ok: true, ts })

## Auth
- Appwrite email/password auth; client uses NEXT_PUBLIC_APPWRITE_* to call account endpoints
- AuthContext provides user session, login, register, logout; SSR-safe patterns
- Protect profile/bookings with client guards; sensitive data checks server-side

## Payments
- Implement mock payment fully (happy/unhappy path)
- Add Cashfree client abstraction and server route stubs; read env:
  - CF_APP_ID, CF_SECRET_KEY (server-only)
  - CASHFREE_BASE_URL (sandbox by default)
- Do not hardcode secrets. If not provided, mock only.

## Environment variables
- Required (client):
  - NEXT_PUBLIC_APPWRITE_ENDPOINT
  - NEXT_PUBLIC_APPWRITE_PROJECT_ID
  - NEXT_PUBLIC_APPWRITE_DATABASE_ID
  - NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID
  - NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID
  - NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID
  - NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID
  - NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID
- Required (server):
  - APPWRITE_API_KEY
  - APPWRITE_PROJECT_ID
  - APPWRITE_DATABASE_ID
- Optional (payments server):
  - CF_APP_ID
  - CF_SECRET_KEY
  - CASHFREE_BASE_URL
- Provide .env.example and instructions. Never commit real secrets.

## CORS and domains (critical)
- Document: In Appwrite Console → Project → Settings → Platforms → Web
  - Add exact origins you’ll use:
    - http://localhost:3000
    - https://your-vercel-project-url.vercel.app
    - https://your-custom-domain (e.g., https://www.edu-nova.tech)
  - Appwrite must return Access-Control-Allow-Origin matching the page origin

## UX polish
- Responsive, accessible (labels, alt text)
- Image optimization via next/image; remotePatterns include images.unsplash.com
- Framer Motion for subtle entrance animations
- Toasts for success/error; loading states on API calls

## Quality gates
- ESLint with @typescript-eslint and Next.js rules; Prettier
- Minimal tests: one server route, one booking calc, one component render
- Run build to ensure it compiles; optionally allow ignoreDuringBuilds/ignoreBuildErrors only if needed (prefer clean)

## Deliverables
- Complete source with the structure above
- README with setup steps:
  - Create Appwrite project, set env, create collections
  - Add CORS origins in Appwrite
  - Local run, testing, deployment to Vercel
- vercel.json minimal config
- Scripts or routes to bootstrap user_preferences (optional helper)
- No secrets checked in

## Success criteria
- Can register/login
- Can create bookings with services and see total price
- Preferences persist; points and tier update on booking
- Mock payment changes booking status
- All routes work both locally and on Vercel (with envs set)
- No client exposure of server secrets; API key only used server-side
- CORS works on custom domain and Vercel preview/prod

End of prompt.
