import { middleware } from './middleware';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ type: 'redirect', url })),
    next: jest.fn(() => ({ type: 'next' })),
  },
}));

const createMockRequest = (options: { cookieValue?: string; pathname?: string; url?: string }) => {
  return {
    cookies: {
      get: jest.fn((name: string) =>
        name === 'authToken' && options.cookieValue ? { value: options.cookieValue } : undefined,
      ),
    },
    nextUrl: {
      pathname: options.pathname ?? '/',
    },
    url: options.url ?? 'http://localhost/',
  } as unknown as NextRequest;
};

describe('middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /login if not authenticated and on root path', () => {
    const req = createMockRequest({
      cookieValue: undefined,
      pathname: '/',
      url: 'http://localhost/',
    });
    const res = middleware(req);
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', 'http://localhost/'));
    expect(res).toEqual({ type: 'redirect', url: new URL('/login', 'http://localhost/') });
  });

  it('allows request if authenticated and on root path', () => {
    const req = createMockRequest({
      cookieValue: 'token123',
      pathname: '/',
      url: 'http://localhost/',
    });
    const res = middleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(res).toEqual({ type: 'next' });
  });

  it('allows request if authenticated and not on root path', () => {
    const req = createMockRequest({
      cookieValue: 'token123',
      pathname: '/dashboard',
      url: 'http://localhost/dashboard',
    });
    const res = middleware(req);
    expect(NextResponse.next).toHaveBeenCalled();
    expect(res).toEqual({ type: 'next' });
  });
});
