"use client";
import { useState, useEffect, useCallback } from "react";
import type { VerificationState, Platform } from "@/lib/types";

const PLATFORMS: Platform[] = ["github", "discord", "farcaster"];

function getStorageKey(wallet: string) {
  return `verifyme_proofs_${wallet}`;
}

export function saveProofToStorage(wallet: string, proof: any) {
  try {
    const key = getStorageKey(wallet);
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = existing.filter((p: any) => p.platform !== proof.platform);
    localStorage.setItem(key, JSON.stringify([...filtered, proof]));
  } catch {}
}

export function removeProofFromStorage(wallet: string, platform: Platform) {
  try {
    const key = getStorageKey(wallet);
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify(existing.filter((p: any) => p.platform !== platform)));
  } catch {}
}

export function useVerifications(wallet: string | null) {
  const [verifications, setVerifications] = useState<VerificationState[]>(
    PLATFORMS.map((p) => ({ platform: p, status: "unverified" as const }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const buildStates = useCallback((proofs: any[]): VerificationState[] => {
    return PLATFORMS.map((platform) => {
      const proof = proofs.find((p) => p.platform === platform);
      return proof
        ? { platform, status: "verified" as const, proof }
        : { platform, status: "unverified" as const };
    });
  }, []);

  const refetch = useCallback(async () => {
    if (!wallet) return;
    // Load from localStorage immediately
    try {
      const cached = JSON.parse(localStorage.getItem(getStorageKey(wallet)) || "[]");
      if (cached.length > 0) setVerifications(buildStates(cached));
    } catch {}
    // Then sync with server
    try {
      const res = await fetch(`/api/proof?wallet=${wallet}`);
      if (res.ok) {
        const data = await res.json();
        if (data.proofs?.length > 0) {
          localStorage.setItem(getStorageKey(wallet), JSON.stringify(data.proofs));
          setVerifications(buildStates(data.proofs));
        }
      }
    } catch {}
  }, [wallet, buildStates]);

  useEffect(() => {
    if (!wallet) {
      setVerifications(PLATFORMS.map((p) => ({ platform: p, status: "unverified" as const })));
      return;
    }
    setIsLoading(true);
    // Load from localStorage first (instant)
    try {
      const cached = JSON.parse(localStorage.getItem(getStorageKey(wallet)) || "[]");
      setVerifications(buildStates(cached));
    } catch {}
    setIsLoading(false);
    // Background sync with server
    refetch();
  }, [wallet, buildStates, refetch]);

  return { verifications, isLoading, refetch };
}
