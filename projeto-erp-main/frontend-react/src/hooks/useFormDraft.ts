import { useEffect } from 'react';

export function useFormDraft<T>(key: string, value: T, enabled: boolean): void {
  useEffect(() => {
    if (enabled) sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value, enabled]);
}

export function loadFormDraft<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  try { return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}

export function clearFormDraft(key: string): void {
  sessionStorage.removeItem(key);
}
