"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Platform, ProofRecord } from "@/lib/types";
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
    const commitCount = searchParams.get("commitCount");
    const followerCount = searchParams.get("followerCount");
    const serverCount = searchParams.get("serverCount");
    const pfpUrl = searchParams.get("pfpUrl") || "";
    const accountCreatedAt = searchParams.get("accountCreatedAt") || "";

    if (success !== "true" || !platform || !proofHash || !wallet) return;
    processed.current = true;

    const proof: ProofRecord = {
      wallet,
      platform: platform as Platform,
      proofHash,
      usernameHash: "",
      maskedUsername: maskedUsername || "",
      verifiedAt: new Date().toISOString(),
      ...(repoCount ? { repoCount: parseInt(repoCount, 10) } : {}),
      ...(commitCount ? { commitCount: parseInt(commitCount, 10) } : {}),
      ...(followerCount ? { followerCount: parseInt(followerCount, 10) } : {}),
      ...(serverCount ? { serverCount: parseInt(serverCount, 10) } : {}),
      ...(pfpUrl ? { pfpUrl } : {}),
      ...(accountCreatedAt ? { accountCreatedAt } : {}),
    };

    saveProofToStorage(wallet, proof);

    fetch("/api/proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proof),
    }).catch(() => {});

    const url = new URL(window.location.href);
    [
      "success",
      "platform",
      "proofHash",
      "usernameHash",
      "maskedUsername",
      "wallet",
      "repoCount",
      "commitCount",
      "followerCount",
      "serverCount",
      "pfpUrl",
      "accountCreatedAt",
    ].forEach((k) => url.searchParams.delete(k));
    window.history.replaceState({}, "", url.toString());

    onSuccess?.();
  }, [searchParams, onSuccess]);
}
