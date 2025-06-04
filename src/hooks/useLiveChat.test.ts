import { useLiveChat } from './useLiveChat';

// src/hooks/useLiveChat.test.ts

jest.mock('@/lib/utils', () => {
  const mockExtractCookie = jest.fn();
  return {
    extractCookie: mockExtractCookie,
    mockExtractCookie,
  };
});
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const { mockExtractCookie } = jest.requireMock('@/lib/utils');
const mockUseRouter = jest.requireMock('next/navigation').useRouter;

describe('useLiveChat', () => {
  let originalFetch: typeof global.fetch;
  let fetchMock: jest.Mock;
  let pushMock: jest.Mock;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ push: pushMock });
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
      configurable: true,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('calls fetch with correct params and returns response', async () => {
    mockExtractCookie.mockReturnValue(undefined);
    const response = { status: 200 };
    fetchMock.mockResolvedValue(response);

    const { request } = useLiveChat();
    const req = {
      method: 'POST' as const,
      url: '/test',
      headers: { 'X-Test': '1' },
      body: { foo: 'bar' },
    };
    const result = await request(req);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/live-chat/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Test': '1',
        }),
        body: JSON.stringify({ foo: 'bar' }),
      }),
    );
    expect(result).toBe(response);
  });

  test('adds Authorization header if authToken exists', async () => {
    mockExtractCookie.mockReturnValue('token123');
    fetchMock.mockResolvedValue({ status: 200 });

    const { request } = useLiveChat();
    await request({ method: 'GET', url: '/auth', headers: undefined });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token123',
        }),
      }),
    );
  });

  test('does not add Authorization header if no authToken', async () => {
    mockExtractCookie.mockReturnValue(undefined);
    fetchMock.mockResolvedValue({ status: 200 });

    const { request } = useLiveChat();
    await request({ method: 'GET', url: '/noauth', headers: undefined });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );
  });

  test('clears auth cookie and redirects on 401', async () => {
    mockExtractCookie.mockReturnValue('token');
    fetchMock.mockResolvedValue({ status: 401 });

    const { request } = useLiveChat();
    // Set cookie to test clearing
    document.cookie = 'authToken=token; path=/';
    await request({ method: 'GET', url: '/unauth', headers: undefined });

    expect(document.cookie).toContain('authToken=;');
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  test('clears auth cookie and redirects on 403', async () => {
    mockExtractCookie.mockReturnValue('token');
    fetchMock.mockResolvedValue({ status: 403 });

    const { request } = useLiveChat();
    document.cookie = 'authToken=token; path=/';
    await request({ method: 'GET', url: '/forbidden', headers: undefined });

    expect(document.cookie).toContain('authToken=;');
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  test('does not clear cookie or redirect on other status', async () => {
    mockExtractCookie.mockReturnValue('token');
    fetchMock.mockResolvedValue({ status: 200 });

    const { request } = useLiveChat();
    document.cookie = 'authToken=token; path=/';
    await request({ method: 'GET', url: '/ok', headers: undefined });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
