import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Reads ?hl= from the URL and clears it after the highlight animation ends (2.5s).
// Returns the raw highlight key so each page can compute which rows/cards match.
export function useHighlight(): string | null {
  const [searchParams, setSearchParams] = useSearchParams();
  const hl = searchParams.get('hl');

  useEffect(() => {
    if (!hl) return;
    const t = setTimeout(() => {
      setSearchParams(
        (prev) => { const next = new URLSearchParams(prev); next.delete('hl'); return next; },
        { replace: true },
      );
    }, 2500);
    return () => clearTimeout(t);
  }, [hl, setSearchParams]);

  return hl;
}
