import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  const isAuthenticatedPath =
    request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/register';
  const isUserAuthenticated = Boolean(token);

  if (!isUserAuthenticated && isAuthenticatedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
