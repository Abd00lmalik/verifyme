'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useProofSubmit(onSuccess?: () => void) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    const platform = searchParams.get('platform');
    const proofHash = searchParams.get('proofHash');
    const maskedUsername = searchParams.get('maskedUsername');
    const wallet = searchParams.get('wallet');
    const repoCount = searchParams.get('repoCount');
    const followerCount = searchParams.get('followerCount');

    if (success !== 'true' || !platform || !proofHash || !wallet) return;
    if (submitted || isSubmitting) return;

    const submit = async () => {
      setIsSubmitting(true);
      setError(null);
      try {
        const body: Record<string, unknown> = {
          wallet,
          platform,
          proofHash,
          maskedUsername: maskedUsername || '',
          usernameHash: '',
        };
        if (repoCount) body.repoCount = Number(repoCount);
        if (followerCount) body.followerCount = Number(followerCount);

        const res = await fetch('/api/proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to save proof');
        setSubmitted(true);
        onSuccess?.();

        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('platform');
        url.searchParams.delete('proofHash');
        url.searchParams.delete('maskedUsername');
        url.searchParams.delete('wallet');
        url.searchParams.delete('repoCount');
        url.searchParams.delete('followerCount');
        window.history.replaceState({}, '', url.toString());
      } catch (err) {
        setError('Failed to save verification');
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return { isSubmitting, submitted, error };
}
