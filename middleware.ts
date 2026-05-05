import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that are commonly targeted by malicious bots/users looking for vulnerabilities
const SUSPICIOUS_PATHS: string[] = [
  '/.env',
  '/.git',
  '/wp-admin',
  '/wp-login.php',
  '/phpmyadmin',
  '/config.php',
  '/.vscode',
  '/node_modules',
  '/package.json',
  '/package-lock.json',
  '/.htaccess',
  '/.ssh',
  '/backup',
  '/admin/config.php'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("auth_session")?.value

  // 1. Security Check (Existing)
  const isSuspicious = SUSPICIOUS_PATHS.some(path => {
    const lowPath = pathname.toLowerCase()
    const lowPattern = path.toLowerCase()
    return lowPath === lowPattern || 
           lowPath.startsWith(lowPattern + '/') || 
           lowPath.endsWith(lowPattern)
  })

  if (isSuspicious) {
    return NextResponse.redirect(new URL('/forbidden', request.url))
  }

  // 2. Session Parsing
  let user = null
  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie)
    } catch {
      console.error("Middleware session parse error")
    }
  }

  // 3. Redirection Logic
  const isAuthPage = pathname === '/login' || pathname === '/admin-login' || pathname === '/select-institution'
  const isLandingPage = pathname === '/'
  const baseUrl = process.env.NEXTAUTH_URL || request.url;

  if (user) {
    // Redirect away from landing/login if already authenticated
    if (isLandingPage || isAuthPage) {
      const target = user.role === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(target, baseUrl))
    }

    // Role-based protection for /admin
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', baseUrl))
    }
  } else {
    // Block access to private routes if not logged in
    if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
      return NextResponse.redirect(new URL('/admin-login', baseUrl))
    }
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', baseUrl))
    }
  }

  return NextResponse.next()
}

// Ensure middleware runs on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (app logo)
     * - forbidden (allow access to the target page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|forbidden).*)',
  ],
}
