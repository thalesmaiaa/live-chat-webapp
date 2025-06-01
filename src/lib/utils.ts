import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  if (!cookie) return null;
  return cookie.split('=')[1];
}
