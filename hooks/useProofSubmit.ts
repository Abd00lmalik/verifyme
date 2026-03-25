"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { saveProofToStorage } from "./useVerifications";

export function useProofSubmit(onSuccess?: () => void) {
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    const success = searchParams.get("success");
    const platform = searchParams.get("platform");
    const proofHash = searchParams.get("proofHash");
    const maskedUsername = searchParams.get("maskedUsername");
    const wallet = searchParams.get("wallet") || localStorage.getItem("verifyme_pending_wallet");
    const repoCount = searchParams.get("repoCount");
    const followerCount = searchParams.get("followerCount");

    if (success !== "true" || !platform || !proofHash || !wallet) return;
    processed.current = true;

    const proof: ProofRecord = {
      wallet,
      platform: platform as Platform,
      proofHash,
      usernameHash: "",
      maskedUsername: maskedUsername || "",
      verifiedAt: new Date().toISOString(),
      ...(repoCount ? { repoCount: parseInt(repoCount) } : {}),
      ...(followerCount ? { followerCount: parseInt(followerCount) } : {}),
    };

    // Save to localStorage immediately
    saveProofToStorage(wallet, proof);

    // Also save to server
    fetch("/api/proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proof),
    }).catch(() => {});

    // Clean URL
    const url = new URL(window.location.href);
    ["success","platform","proofHash","usernameHash","maskedUsername","wallet","repoCount","followerCount"].forEach(k => url.searchParams.delete(k));
    window.history.replaceState({}, "", url.toString());

    onSuccess?.();
  }, [searchParams, onSuccess]);
}


