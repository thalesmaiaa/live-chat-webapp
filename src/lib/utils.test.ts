import { extractCookie } from './utils';

describe('extractCookie', () => {
  beforeEach(() => {
    // @ts-expect-error to simulate a non-browser environment
    global.document = { cookie: '' };
  });

  it('returns null if cookie is not found', () => {
    global.document.cookie = 'bar=123; baz=456';
    expect(extractCookie('foo')).toBeNull();
  });

  it('returns the value of the cookie if found', () => {
    global.document.cookie = 'foo=abc';
    expect(extractCookie('foo')).toBe('abc');
  });

  it('handles cookies with special characters', () => {
    global.document.cookie = 'foo=a%20b%3Dc';
    expect(extractCookie('foo')).toBe('a%20b%3Dc');
  });
});
