"use client";
import { SignInButton, useProfile } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

interface Props {
  onSuccess: (data: { fid: number; username: string; custody: string; signature: string }) => void;
  onError?: (err: unknown) => void;
}

export default function FarcasterSignIn({ onSuccess, onError }: Props) {
  return (
    <div style={{ width: "100%" }}>
      <SignInButton
        onSuccess={({ fid, username, custody, signature }) =>
          onSuccess({ fid: fid ?? 0, username: username ?? "", custody: custody ?? "", signature: signature ?? "" })
        }
        onError={onError}
      />
    </div>
  );
}
