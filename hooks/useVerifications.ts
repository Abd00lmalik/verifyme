'use client';

import { useState, useEffect, useCallback } from 'react';
import type { VerificationState, Platform } from '@/lib/types';

const PLATFORMS: Platform[] = ['github', 'discord', 'farcaster'];

export function useVerifications(wallet: string | null) {
  const [verifications, setVerifications] = useState<VerificationState[]>(
    PLATFORMS.map((p) => ({ platform: p, status: 'unverified' as const }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = useCallback(async () => {
    if (!wallet) {
      setVerifications(
        PLATFORMS.map((p) => ({ platform: p, status: 'unverified' as const }))
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proof?wallet=${wallet}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const proofs = await res.json();
      setVerifications(
        PLATFORMS.map((platform) => {
          const proof = proofs.find(
            (p: { platform: Platform }) => p.platform === platform
          );
          return proof
            ? { platform, status: 'verified' as const, proof }
            : { platform, status: 'unverified' as const };
        })
      );
    } catch (err) {
      setError('Could not load verifications');
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  return { verifications, isLoading, error, refetch: fetchVerifications };
}
