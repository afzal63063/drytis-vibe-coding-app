import { useEffect, useState } from 'react';

/**
 * Reveals `text` progressively like an LLM stream. `charsPerTick` controls
 * typing speed; expose `done` so callers can swap in a completion state.
 * Passing a new `nonce` restarts the animation even if `text` is unchanged.
 */
export function useTypewriter(text: string, charsPerTick = 5, tickMs = 14, nonce = 0): { display: string; done: boolean } {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!text) return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + charsPerTick;
      });
    }, tickMs);
    return () => window.clearInterval(id);
  }, [text, charsPerTick, tickMs, nonce]);

  return { display: text.slice(0, count), done: count >= text.length };
}