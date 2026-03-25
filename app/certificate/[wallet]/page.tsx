"use client";
import { useEffect, useState } from "react";
import type { ProofRecord } from "@/lib/types";
function GitHubIcon({ size = 18 }: { size?: number }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="#7C3AED"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>); }
function DiscordIcon({ size = 18 }: { size?: number }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>); }
function FarcasterIcon({ size = 18 }: { size?: number }) { return (<svg width={size} height={size} viewBox="0 0 24 24" fill="#855DCD"><path d="M11.996 0C5.372 0 0 5.372 0 11.996c0 6.625 5.372 12 11.996 12C18.625 24 24 18.625 24 11.996 24 5.372 18.625 0 11.996 0zm5.24 17.08h-2.2v-4.702c0-.972-.385-1.46-1.154-1.46-.848 0-1.271.512-1.271 1.46v2.516h-2.19v-2.516c0-.948-.424-1.46-1.271-1.46-.77 0-1.155.488-1.155 1.46V17.08h-2.2V9.723h2.2v.95c.476-.73 1.19-1.097 2.14-1.097.963 0 1.72.4 2.27 1.2.564-.8 1.38-1.2 2.44-1.2 1.8 0 2.39 1.25 2.39 3.13V17.08zM7.42 8.33c-.73 0-1.32-.59-1.32-1.32 0-.73.59-1.32 1.32-1.32.73 0 1.32.59 1.32 1.32 0 .73-.59 1.32-1.32 1.32zm9.15 0c-.73 0-1.32-.59-1.32-1.32 0-.73.59-1.32 1.32-1.32.73 0 1.32.59 1.32 1.32 0 .73-.59 1.32-1.32 1.32z"/></svg>); }
const ICONS = { github: GitHubIcon, discord: DiscordIcon, farcaster: FarcasterIcon };
const NAMES: Record<string, string> = { github: "GitHub", discord: "Discord", farcaster: "Farcaster" };
const PLATFORMS = ["github", "discord", "farcaster"];
function truncate(addr: string) { return addr.slice(0, 6) + "..." + addr.slice(-4); }
function fmtHash(h: string) { return "0x" + h.slice(0, 4) + "..." + h.slice(-4); }
function fmtDate(iso: string) { try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return iso; } }
export default function CertificatePage({ params }: { params: { wallet: string } }) {
  const [proofs, setProofs] = useState<ProofRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const wallet = params.wallet;
  useEffect(() => {
    fetch("/api/proof?wallet=" + wallet).then(r => r.json()).then(d => setProofs(d.proofs || [])).catch(() => setProofs([])).finally(() => setLoading(false));
  }, [wallet]);
  function copyLink() { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  const count = proofs.length;
  const tweetText = encodeURIComponent("I just cryptographically verified my identity on @RialoProtocol using VerifyMe. " + count + " of 3 platforms linked on-chain.");
  const tweetUrl = encodeURIComponent("https://verifyme-two.vercel.app/certificate/" + wallet);
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 48px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>Identity Certificate</p>
          <h1 style={{ fontSize: "30px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {count === 3 ? "Fully Verified Builder" : count > 0 ? count + " of 3 Platforms Verified" : "No Verifications Yet"}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Stored permanently on the Rialo blockchain</p>
        </div>
        <div style={{ background: "linear-gradient(160deg, #0D1117 0%, #0E1520 60%, #0D1117 100%)", border: "1px solid rgba(92,225,230,0.25)", borderRadius: "20px", padding: "28px", position: "relative", overflow: "hidden", boxShadow: "0 0 80px rgba(92,225,230,0.04)" }}>
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(92,225,230,0.5), transparent)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px", color: "#5CE1E6" }}>✓</span>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>VerifyMe</span>
            </div>
            <span style={{ fontSize: "11px", color: "#5CE1E6", background: "rgba(92,225,230,0.07)", border: "1px solid rgba(92,225,230,0.15)", borderRadius: "6px", padding: "3px 8px", fontWeight: 500 }}>Built on Rialo</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "6px" }}>Wallet</p>
            <p style={{ fontSize: "15px", fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 500 }}>{truncate(wallet)}</p>
          </div>
          <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>Verified Identities</p>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>Loading...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {PLATFORMS.map(p => {
                const proof = proofs.find(pr => pr.platform === p);
                const verified = !!proof;
                const Icon = ICONS[p as keyof typeof ICONS];
                return (
                  <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "10px", background: verified ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.015)", border: verified ? "1px solid rgba(52,211,153,0.12)" : "1px solid rgba(255,255,255,0.05)", opacity: verified ? 1 : 0.45 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Icon size={16} />
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: verified ? "var(--text-primary)" : "var(--text-muted)" }}>{NAMES[p]}</p>
                        {verified && proof && (<p style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)", marginTop: "1px" }}>{fmtHash(proof.proofHash)}</p>)}
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: verified ? "#34D399" : "var(--text-muted)", background: verified ? "rgba(52,211,153,0.1)" : "transparent", border: verified ? "1px solid rgba(52,211,153,0.2)" : "1px solid transparent", borderRadius: "6px", padding: "2px 8px" }}>
                      {verified ? "✓ Verified" : "Unverified"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ height: "1px", background: "var(--border-subtle)", marginBottom: "16px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "4px" }}>Network</p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#34D399", fontWeight: 500 }}>Rialo Devnet</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "4px" }}>Issued</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{proofs.length > 0 ? fmtDate(proofs[proofs.length - 1].verifiedAt) : "—"}</p>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(92,225,230,0.3), transparent)" }} />
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <a href={"https://twitter.com/intent/tweet?text=" + tweetText + "&url=" + tweetUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, height: "44px", borderRadius: "10px", background: "#000", border: "1px solid #2a2a2a", color: "#fff", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </a>
          <button onClick={copyLink} style={{ flex: 1, height: "44px", borderRadius: "10px", background: "transparent", border: "1px solid var(--border-default)", color: copied ? "var(--success)" : "var(--text-secondary)", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            {copied ? "✓ Link copied!" : "Copy link"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <a href={"/profile/" + wallet} style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>View full profile →</a>
          <a href="/verify" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>Dashboard →</a>
        </div>
      </div>
    </div>
  );
}