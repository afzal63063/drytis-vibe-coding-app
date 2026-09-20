import { useEffect, useState } from 'react';

/**
 * Returns the current epoch ms, refreshed every `intervalMs` while `active` is
 * true. Returns 0 when inactive so consumers can gate expensive work.
 */
export function useNow(active: boolean, intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  return active ? now : 0;
}