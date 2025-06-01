import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token && request.nextUrl.pathname === '/') {
    // Redirect to /login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed if authenticated or not on the root path
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
