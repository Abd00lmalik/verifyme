"use client";

import { useCallback, useEffect, useState } from "react";
import type { VerificationState, ProofRecord } from "@/lib/types";

const PLATFORMS = ["github", "discord", "farcaster"] as const;

function emptyStates(): VerificationState[] {
  return PLATFORMS.map((platform) => ({
    platform,
    status: "unverified" as const,
  }));
}

function toStates(proofs: ProofRecord[]): VerificationState[] {
  return PLATFORMS.map((platform) => {
    const proof = proofs.find((row) => row.platform === platform);
    return proof
      ? { platform, status: "verified" as const, proof }
      : { platform, status: "unverified" as const };
  });
}

export function useVerifications(wallet: string | null) {
  const [verifications, setVerifications] = useState<VerificationState[]>(emptyStates);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProofs = useCallback(async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/proof?wallet=${encodeURIComponent(walletAddress)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const proofs = Array.isArray(data?.proofs) ? (data.proofs as ProofRecord[]) : [];
      setVerifications(toStates(proofs));
    } catch (err) {
      setVerifications(emptyStates());
      setError(err instanceof Error ? err.message : "Failed to load proofs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!wallet) {
      setVerifications(emptyStates());
      return;
    }
    fetchProofs(wallet);
  }, [wallet, fetchProofs]);

  const refetch = useCallback(() => {
    if (!wallet) return;
    fetchProofs(wallet);
  }, [wallet, fetchProofs]);

  return { verifications, setVerifications, isLoading, error, refetch };
}
