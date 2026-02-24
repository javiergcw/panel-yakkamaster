/**
 * Almacenamiento de sesión (token + user) para cliente y middleware.
 * El middleware solo usa la cookie del token para proteger rutas.
 */

import type { User } from '../models';

const ACCESS_TOKEN_KEY = 'yakka_access_token';
const USER_KEY = 'yakka_user';
const TOKEN_MAX_AGE = 60 * 60; // 1 hora en segundos (o usar expires_in del response)

export function setAccessToken(token: string, maxAgeSeconds: number = TOKEN_MAX_AGE): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ACCESS_TOKEN_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAccessToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
}

export function setUser(user: User, maxAgeSeconds: number = TOKEN_MAX_AGE): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${USER_KEY}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getUser(): User | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${USER_KEY}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as User;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${USER_KEY}=; path=/; max-age=0`;
}

/** Clears token and user (call on sign out). */
export function clearSession(): void {
  clearAccessToken();
  clearUser();
}
