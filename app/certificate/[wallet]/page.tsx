"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProofRecord } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const PLATFORMS = ["github", "discord", "farcaster"] as const;

function shortWallet(wallet: string) {
 return wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "";
}

function fmtDate(iso?: string) {
 if (!iso) return "-";
 try {
 return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
 } catch {
 return iso;
 }
}

function uniqueCardId(wallet: string) {
 let h = 2166136261;
 for (let i = 0; i < wallet.length; i++) {
 h ^= wallet.charCodeAt(i);
 h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
 }
 const code = (h >>> 0).toString(36).toUpperCase().padStart(8, "0");
 return `VM-${code}-${wallet.slice(-4).toUpperCase()}`;
}

function monthsSince(iso?: string) {
 if (!iso) return 0;
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return 0;
 const now = new Date();
 return Math.max(0, (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()));
}

function clamp(value: number, min: number, max: number) {
 return Math.min(max, Math.max(min, value));
}

function computeScore(proofs: ProofRecord[]) {
 const github = proofs.find((p) => p.platform === "github");
 const discord = proofs.find((p) => p.platform === "discord");
 const farcaster = proofs.find((p) => p.platform === "farcaster");

 const repos = github?.repoCount || 0;
 const commits = github?.commitCount || 0;
 const followers = farcaster?.followerCount || 0;
 const servers = discord?.serverCount || 0;
 const discordAgeMonths = monthsSince(discord?.accountCreatedAt);

 const reposPts = clamp(Math.round((Math.min(repos, 120) / 120) * 24), 0, 24);
 const commitsPts = clamp(Math.round((Math.min(commits, 800) / 800) * 18), 0, 18);
 const agePts = clamp(Math.round((Math.min(discordAgeMonths, 72) / 72) * 18), 0, 18);
 const serversPts = clamp(Math.round((Math.min(servers, 50) / 50) * 12), 0, 12);
 const followersPts = clamp(Math.round((Math.min(followers, 5000) / 5000) * 20), 0, 20);
 const completionPts = clamp(Math.round((proofs.length / 3) * 8), 0, 8);

 const total = reposPts + commitsPts + agePts + serversPts + followersPts + completionPts;

 return {
 total,
 rows: [
 { label: "GitHub repos", value: String(repos), points: reposPts, max: 24 },
 { label: "GitHub commits", value: String(commits), points: commitsPts, max: 18 },
 { label: "Discord age (months)", value: String(discordAgeMonths), points: agePts, max: 18 },
 { label: "Discord servers", value: String(servers), points: serversPts, max: 12 },
 { label: "Farcaster followers", value: String(followers), points: followersPts, max: 20 },
 { label: "Completion bonus", value: `${proofs.length}/3`, points: completionPts, max: 8 },
 ],
 };
}

export default function CertificatePage({ params }: { params: { wallet: string } }) {
 const wallet = params.wallet;
 const [proofs, setProofs] = useState<ProofRecord[]>([]);
 const [copied, setCopied] = useState(false);

 useEffect(() => {
 fetch("/api/proof?wallet=" + wallet)
 .then((r) => r.json())
 .then((d) => setProofs(d?.proofs || []))
 .catch(() => setProofs([]));
 }, [wallet]);

 const cardId = useMemo(() => uniqueCardId(wallet), [wallet]);
 const score = useMemo(() => computeScore(proofs), [proofs]);
 const issueDate = proofs.length ? fmtDate(proofs[proofs.length - 1].verifiedAt) : fmtDate(new Date().toISOString());
 const topProof = useMemo(() => proofs.find((p) => p.pfpUrl) || proofs[0], [proofs]);

 const shareUrl = typeof window !== "undefined" ? window.location.href : `${APP_URL}/certificate/${wallet}`;
 const xText = encodeURIComponent(`My VerifyMe VM Card score is ${score.total}/100 on Rialo Devnet.`);
 const xUrl = `https://twitter.com/intent/tweet?text=${xText}&url=${encodeURIComponent(shareUrl)}`;

 function copyLink() {
 navigator.clipboard.writeText(shareUrl);
 setCopied(true);
 setTimeout(() => setCopied(false), 1500);
 }

 return (
 <div
 style={{
 minHeight: "100vh",
 padding: "88px 18px 48px",
 background: "linear-gradient(165deg, #f8f3e8 0%, #efe8db 55%, #f6efe3 100%)",
 color: "#0f172a",
 }}
 >
 <div style={{ maxWidth: 620, margin: "0 auto" }}>
 <h1 style={{ margin: 0, fontSize: 34, letterSpacing: "-0.02em" }}>VM Card</h1>
 <p style={{ marginTop: 8, color: "#334155" }}>Portable identity card for {shortWallet(wallet)}</p>

 <div
 style={{
 marginTop: 18,
 borderRadius: 24,
 border: "1px solid rgba(15,118,110,0.25)",
 background: "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(240,253,250,0.92) 52%, rgba(236,252,250,0.92) 100%)",
 boxShadow: "0 24px 40px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
 overflow: "hidden",
 }}
 >
 <div style={{ padding: 22 }}>
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
 <div>
 <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f766e" }}>
 VerifyMe | Rialo
 </div>
 <div style={{ marginTop: 4, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{score.total}/100</div>
 <div style={{ fontSize: 13, color: "#475569" }}>Realness score</div>
 </div>
 <div style={{ textAlign: "right" }}>
 <div style={{ fontSize: 11, color: "#475569" }}>Card ID</div>
 <div style={{ fontSize: 13, fontFamily: "monospace", color: "#0f766e", fontWeight: 700 }}>{cardId}</div>
 <div style={{ marginTop: 6, fontSize: 11, color: "#475569" }}>Issued {issueDate}</div>
 </div>
 </div>

 <div
 style={{
 marginTop: 14,
 border: "1px solid rgba(15,118,110,0.18)",
 borderRadius: 14,
 padding: "10px 12px",
 background: "rgba(255,255,255,0.8)",
 display: "flex",
 alignItems: "center",
 gap: 10,
 }}
 >
 {topProof?.pfpUrl ? (
 <img
 src={topProof.pfpUrl}
 alt="avatar"
 style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(15,118,110,0.24)" }}
 />
 ) : (
 <div
 style={{
 width: 44,
 height: 44,
 borderRadius: "50%",
 background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
 color: "#ffffff",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 fontWeight: 700,
 }}
 >
 {wallet[0]?.toUpperCase() || "V"}
 </div>
 )}
 <div style={{ minWidth: 0 }}>
 <div style={{ fontSize: 12, color: "#64748b" }}>Profile</div>
 <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
 {topProof?.maskedUsername || shortWallet(wallet)}
 </div>
 </div>
 <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569", textAlign: "right" }}>
 <div>Network</div>
 <div style={{ fontWeight: 700, color: "#0f766e" }}>Rialo Devnet</div>
 </div>
 </div>

 <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
 {score.rows.map((row) => (
 <div
 key={row.label}
 style={{
 borderRadius: 12,
 border: "1px solid rgba(148,163,184,0.35)",
 background: "rgba(255,255,255,0.78)",
 padding: "9px 11px",
 display: "flex",
 alignItems: "center",
 justifyContent: "space-between",
 }}
 >
 <div>
 <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{row.label}</div>
 <div style={{ fontSize: 12, color: "#64748b" }}>{row.value}</div>
 </div>
 <div style={{ fontSize: 13, color: "#0f766e", fontWeight: 700 }}>
 +{row.points}/{row.max}
 </div>
 </div>
 ))}
 </div>

 <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
 {PLATFORMS.map((p) => {
 const ok = proofs.some((x) => x.platform === p);
 return (
 <div
 key={p}
 style={{
 flex: 1,
 borderRadius: 10,
 border: "1px solid " + (ok ? "rgba(34,197,94,0.35)" : "rgba(148,163,184,0.35)"),
 background: ok ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.72)",
 textAlign: "center",
 padding: "8px 6px",
 fontSize: 12,
 fontWeight: 700,
 color: ok ? "#166534" : "#475569",
 }}
 >
 {p.toUpperCase()} {ok ? "OK" : "NONE"}
 </div>
 );
 })}
 </div>
 </div>

 <div
 style={{
 borderTop: "1px solid rgba(15,118,110,0.2)",
 background: "rgba(15,118,110,0.05)",
 padding: "12px 22px",
 display: "flex",
 justifyContent: "space-between",
 fontSize: 12,
 color: "#334155",
 }}
 >
 <span>Non-custodial identity signal card</span>
 <span>Shareable on X</span>
 </div>
 </div>

 <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
 <a
 href={xUrl}
 target="_blank"
 rel="noopener noreferrer"
 style={{
 height: 46,
 borderRadius: 12,
 background: "linear-gradient(135deg, #14b8a6, #38bdf8)",
 color: "#ffffff",
 textDecoration: "none",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 fontWeight: 700,
 }}
 >
 Share VM Card on X
 </a>

 <button
 onClick={copyLink}
 style={{
 height: 42,
 borderRadius: 10,
 border: "1px solid rgba(15,23,42,0.22)",
 background: "rgba(255,255,255,0.88)",
 color: "#0f172a",
 fontWeight: 600,
 cursor: "pointer",
 }}
 >
 {copied ? "Copied" : "Copy VM Card link"}
 </button>

 <a href={"/profile/" + wallet} style={{ color: "#0f766e", textDecoration: "none", fontWeight: 600 }}>
 View profile
 </a>
 </div>
 </div>
 </div>
 );
}

