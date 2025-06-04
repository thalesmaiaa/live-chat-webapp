import { cn, extractCookie } from './utils';

describe('extractCookie', () => {
  beforeEach(() => {
    // @ts-expect-error to simulate a non-browser environment
    global.document = { cookie: '' };
  });

  it('returns null if document is undefined', () => {
    // @ts-expect-error to simulate a non-browser environment
    delete global.document;
    expect(extractCookie('foo')).toBeNull();
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
describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('merges tailwind classes with conflicts', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined/null/false values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });
});
