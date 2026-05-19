// Simple admin session stored in sessionStorage (client-side only)
// For CIS311 scope — not production auth

export const ADMIN_SESSION_KEY = 'brisket_admin';

export interface AdminSession {
  id: string;
  username: string;
  name: string;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function setAdminSession(admin: AdminSession) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
