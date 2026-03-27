"use client";
import { useState } from "react";
import { SignInButton } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

interface Props {
  onSuccess: (data: {
    fid: number;
    username: string;
    custody: string;
    message: string;
    signature: string;
    nonce: string;
    domain: string;
    pfpUrl?: string;
  }) => void;
  onError?: (err: unknown) => void;
}

export default function FarcasterSignIn({ onSuccess, onError }: Props) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "38px", fontSize: "14px", color: "var(--success)" }}>
        Farcaster connected  saving...
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <SignInButton
        onSuccess={(data: any) => {
          if (!data || data.state !== "completed") return;
          const signatureParams = data.signatureParams || {};
          setDone(true);
          onSuccess({
            fid: data.fid ?? 0,
            username: data.username ?? "",
            custody: data.custody ?? "",
            message: data.message ?? "",
            signature: data.signature ?? "",
            nonce: data.nonce ?? "",
            domain: signatureParams.domain ?? "",
            pfpUrl: data.pfpUrl ?? "",
          });
        }}
        onError={onError}
      />
    </div>
  );
}

