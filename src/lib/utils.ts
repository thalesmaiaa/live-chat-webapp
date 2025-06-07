export function extractCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  if (!cookie) return null;
  return cookie.split('=')[1];
}
