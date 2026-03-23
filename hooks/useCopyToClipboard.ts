'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy');
      setCopied(false);
    }
  }, []);

  return { copy, copied, error };
}
