"use client";
import { useSignIn } from "@farcaster/auth-kit";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  onSuccess: (data: { fid: number; username: string; custody: string; signature: string }) => void;
  onError?: (err: unknown) => void;
}

export default function FarcasterSignIn({ onSuccess, onError }: Props) {
  const { signIn, isPolling, isSuccess, isError, error, qrCodeUri, connect, url } = useSignIn({
    onSuccess: (res) => {
      onSuccess({
        fid: res.fid ?? 0,
        username: res.username ?? "",
        custody: res.custody ?? "",
        signature: res.signature ?? "",
      });
    },
    onError,
  });

  const handleClick = async () => {
    await connect();
    signIn();
  };

  if (qrCodeUri && isPolling) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center" }}>
          Scan with Warpcast on your phone
        </p>
        <div style={{ background: "white", padding: "12px", borderRadius: "10px", display: "inline-block" }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url || qrCodeUri)}`} width={160} height={160} alt="Farcaster QR" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Spinner size={12} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Waiting for approval...</span>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--accent-text)" }}>
            Open in Warpcast instead
          </a>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPolling}
      style={{
        width: "100%", height: "38px", borderRadius: "10px",
        background: "var(--accent)", color: "var(--text-inverse)",
        border: "none", cursor: isPolling ? "not-allowed" : "pointer",
        fontSize: "14px", fontWeight: 500, fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        opacity: isPolling ? 0.8 : 1,
      }}
    >
      {isPolling ? <Spinner size={14} /> : null}
      {isPolling ? "Connecting..." : "Connect Farcaster"}
    </button>
  );
}
