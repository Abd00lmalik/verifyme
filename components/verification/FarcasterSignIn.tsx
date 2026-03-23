"use client";
import { useSignIn } from "@farcaster/auth-kit";
import { Spinner } from "@/components/ui/Spinner";

interface FarcasterSignInProps {
  onSuccess: (data: { fid: number; username: string; custody: string; signature: string }) => void;
  onError?: (err: unknown) => void;
}

export default function FarcasterSignIn({ onSuccess, onError }: FarcasterSignInProps) {
  const { signIn, isPolling, error } = useSignIn({
    onSuccess: (res) => {
      onSuccess({
        fid: res.fid ?? 0,
        username: res.username ?? "",
        custody: res.custody ?? "",
        signature: res.signature ?? "",
      });
    },
    onError: onError,
  });

  return (
    <button
      onClick={() => signIn()}
      disabled={isPolling}
      style={{
        width: "100%",
        height: "38px",
        borderRadius: "10px",
        background: "var(--accent)",
        color: "var(--text-inverse)",
        border: "none",
        cursor: isPolling ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        transition: "background 0.12s ease",
        letterSpacing: "-0.01em",
        opacity: isPolling ? 0.8 : 1,
      }}
      className="btn-primary"
    >
      {isPolling ? <Spinner size={14} /> : null}
      {isPolling ? "Connecting..." : "Connect Farcaster"}
    </button>
  );
}
