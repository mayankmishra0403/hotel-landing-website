import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    ok: true,
    timestamp: new Date().toISOString(),
    vercel: {
      env: process.env.VERCEL_ENV || null, // production | preview | development
      branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    },
    runtime: process.env.NODE_ENV || null,
    env: {
      baseUrlSet: Boolean(process.env.NEXT_PUBLIC_BASE_URL),
      cashfree: {
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || null,
        appIdSet: Boolean(process.env.CASHFREE_APP_ID),
        secretSet: Boolean(process.env.CASHFREE_SECRET_KEY),
      },
      appwrite: {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || null,
        projectIdPublicSet: Boolean(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        projectIdServerSet: Boolean(process.env.APPWRITE_PROJECT_ID),
        databaseIdPublicSet: Boolean(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
        databaseIdServerSet: Boolean(process.env.APPWRITE_DATABASE_ID),
        apiKeySet: Boolean(process.env.APPWRITE_API_KEY),
      },
    },
  }

  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
    },
  })
}
