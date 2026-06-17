/**
 * Type-safe localStorage utilities with error handling for corrupted data.
 *
 * These utilities handle all edge cases:
 * - localStorage not available (SSR, private browsing)
 * - Corrupted/invalid JSON
 * - Storage quota exceeded
 */

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;

    const parsed = JSON.parse(item) as T;
    return parsed;
  } catch {
    // Corrupted data — clear it and return fallback
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage completely unavailable
    }
    return fallback;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or localStorage unavailable
    console.warn(`Failed to save to localStorage key "${key}".`);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable
  }
}
