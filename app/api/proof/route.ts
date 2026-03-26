import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import type { Platform, ProofRecord } from "@/lib/types";
import { cardIdFromWallet } from "@/lib/card-id";

const redis = Redis.fromEnv();
const PLATFORMS = new Set<Platform>(["github", "discord", "farcaster"]);

function maybeNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function computeIdentityRoot(proofs: ProofRecord[]): string | null {
  const hashes = proofs.map((p) => p.proofHash).filter(Boolean).sort();
  if (hashes.length === 0) return null;

  return createHash("sha256")
    .update(`verifyme:root:v1|${hashes.join("|")}`)
    .digest("hex");
}

export async function GET(req: NextRequest) {
  const walletValue = (req.nextUrl.searchParams.get("wallet") || "").trim();
  if (!walletValue) return NextResponse.json({ proofs: [] });

  try {
    const proofs = (await redis.lrange<ProofRecord>(`proofs:${walletValue}`, 0, -1)) || [];
    const cardId = cardIdFromWallet(walletValue);
    const identityRoot = (await redis.get<string>(`root:${walletValue}`)) || null;

    return NextResponse.json({ proofs, cardId, identityRoot });
  } catch {
    return NextResponse.json({ proofs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const walletValue = String(body.wallet || "").trim();
    const platformValue = String(body.platform || "") as Platform;
    const proofHashValue = String(body.proofHash || "").trim();

    if (!walletValue || !proofHashValue || !PLATFORMS.has(platformValue)) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    const repoCountNum = maybeNumber(body.repoCount);
    const commitCountNum = maybeNumber(body.commitCount);
    const followerCountNum = maybeNumber(body.followerCount);
    const serverCountNum = maybeNumber(body.serverCount);

    const proof: ProofRecord = {
      wallet: walletValue,
      platform: platformValue,
      proofHash: proofHashValue,
      usernameHash: String(body.usernameHash || ""),
      maskedUsername: String(body.maskedUsername || ""),
      verifiedAt: new Date().toISOString(),
      ...(repoCountNum !== undefined ? { repoCount: repoCountNum } : {}),
      ...(commitCountNum !== undefined ? { commitCount: commitCountNum } : {}),
      ...(followerCountNum !== undefined ? { followerCount: followerCountNum } : {}),
      ...(serverCountNum !== undefined ? { serverCount: serverCountNum } : {}),
      ...(body.pfpUrl ? { pfpUrl: String(body.pfpUrl) } : {}),
      ...(body.accountCreatedAt ? { accountCreatedAt: String(body.accountCreatedAt) } : {}),
    };

    const key = `proofs:${walletValue}`;
    const existing = (await redis.lrange<ProofRecord>(key, 0, -1)) || [];
    const filtered = existing.filter((p) => p.platform !== platformValue);

    await redis.del(key);
    if (filtered.length > 0) await redis.rpush(key, ...filtered);
    await redis.rpush(key, proof);

    const nextProofs = [...filtered, proof];
    const identityRoot = computeIdentityRoot(nextProofs);
    const cardId = cardIdFromWallet(walletValue);

    await redis.set(`card:${cardId}`, walletValue);

    if (identityRoot) {
      await redis.set(`root:${walletValue}`, identityRoot);
    } else {
      await redis.del(`root:${walletValue}`);
    }

    return NextResponse.json({ success: true, proof, cardId, identityRoot });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const walletValue = String(body.wallet || "").trim();
    const platformValue = String(body.platform || "") as Platform;

    if (!walletValue || !PLATFORMS.has(platformValue)) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    const key = `proofs:${walletValue}`;
    const existing = (await redis.lrange<ProofRecord>(key, 0, -1)) || [];
    const filtered = existing.filter((p) => p.platform !== platformValue);

    await redis.del(key);
    if (filtered.length > 0) await redis.rpush(key, ...filtered);

    const identityRoot = computeIdentityRoot(filtered);
    const cardId = cardIdFromWallet(walletValue);

    if (identityRoot) {
      await redis.set(`root:${walletValue}`, identityRoot);
      await redis.set(`card:${cardId}`, walletValue);
    } else {
      await redis.del(`root:${walletValue}`);
      await redis.del(`card:${cardId}`);
    }

    return NextResponse.json({ success: true, cardId, identityRoot });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
