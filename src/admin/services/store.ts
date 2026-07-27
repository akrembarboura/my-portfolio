/**
 * Local persistence store used as the default data backend for the admin.
 *
 * Every entity service is built on top of this abstraction so that swapping to
 * Supabase later only requires re-implementing `createRepository` against the
 * Supabase client — the page/hook layer stays untouched.
 */

const NAMESPACE = 'rnv_admin';

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function readCollection<T>(name: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) {
      localStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

export function writeCollection<T>(name: string, value: T[]): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (err) {
    console.error(`[store] Failed to persist ${name}`, err);
  }
}

export function readObject<T>(name: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) {
      localStorage.setItem(key(name), JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export function writeObject<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (err) {
    console.error(`[store] Failed to persist ${name}`, err);
  }
}

/** Artificial latency so loading states are visible and realistic. */
export function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
