import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple rate limit in-memory store
const rateLimit = new Map<string, { count: number; timestamp: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record) {
    rateLimit.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (now - record.timestamp > windowMs) {
    rateLimit.set(ip, { count: 1, timestamp: now })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'

  // Rate limiting logic
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  const limit = isAuthRoute ? 10 : 100
  const windowMs = 60000 // 1 minute

  if (!checkRateLimit(ip, limit, windowMs)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Skip auth checks if Supabase is not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured — allow all requests through
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as never)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage =
    request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

  console.log(
    `[${new Date().toISOString()}] Access: ${request.nextUrl.pathname} - User: ${user?.id || 'anonymous'} - IP: ${ip}`
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
