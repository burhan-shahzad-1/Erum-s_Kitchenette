import {
  ADMIN_CREDENTIALS,
  getSeedClientUsers,
  normalizeEmail,
  STORAGE_KEYS,
  type StoredClientUser,
} from './authConfig';

export function readUsersFromStorage(): StoredClientUser[] {
  if (typeof window === 'undefined') return getSeedClientUsers();
  const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_USERS);
  if (!raw) {
    const seed = getSeedClientUsers();
    localStorage.setItem(STORAGE_KEYS.CLIENT_USERS, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as StoredClientUser[];
    }
    const seed = getSeedClientUsers();
    localStorage.setItem(STORAGE_KEYS.CLIENT_USERS, JSON.stringify(seed));
    return seed;
  } catch {
    const seed = getSeedClientUsers();
    localStorage.setItem(STORAGE_KEYS.CLIENT_USERS, JSON.stringify(seed));
    return seed;
  }
}

export function writeUsersToStorage(users: StoredClientUser[]): void {
  localStorage.setItem(STORAGE_KEYS.CLIENT_USERS, JSON.stringify(users));
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CLIENT_SESSION);
}

export function setSessionUserId(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, userId);
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.CLIENT_SESSION);
}

export function findUserByEmail(
  users: StoredClientUser[],
  email: string
): StoredClientUser | undefined {
  const n = normalizeEmail(email);
  return users.find((u) => normalizeEmail(u.email) === n);
}

export function isAdminEmail(email: string): boolean {
  return normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email);
}
