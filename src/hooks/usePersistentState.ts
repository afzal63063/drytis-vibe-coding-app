import { useEffect, useState } from 'react';

/**
 * Persist state to localStorage under `key`. Returns in-memory value + setter.
 * Reads are lazy and serialized only once on mount.
 */
export function usePersistentState<T>(key: string, initial: () => T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      /* corrupted storage — fall back to initial */
    }
    return initial();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}