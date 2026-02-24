import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ACCESS_TOKEN_KEY = 'yakka_access_token';
const LOGIN_PATH = '/';
const DASHBOARD_PATH = '/dashboard';

/**
 * Middleware de autenticación:
 * - Si no hay token y se intenta acceder a /dashboard/* → redirige a /
 * - Si hay token y se accede a / (login) → redirige a /dashboard
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === LOGIN_PATH;
  const isDashboard = pathname.startsWith(DASHBOARD_PATH);

  if (isDashboard && !token) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (isLoginPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
