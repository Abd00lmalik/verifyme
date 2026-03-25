import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { ProofRecord } from "@/lib/types";

const redis = Redis.fromEnv();
const PLATFORMS = new Set(["github", "discord", "farcaster"]);

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ proofs: [] });

  try {
    const proofs = await redis.lrange<ProofRecord>(`proofs:${wallet}`, 0, -1);
    return NextResponse.json({ proofs: proofs || [] });
  } catch {
    return NextResponse.json({ proofs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wallet,
      platform,
      proofHash,
      usernameHash,
      maskedUsername,
      repoCount,
      commitCount,
      followerCount,
      serverCount,
      pfpUrl,
      accountCreatedAt,
    } = body;

    if (!wallet || !platform || !proofHash || !PLATFORMS.has(String(platform))) {
      return NextResponse.json({ success: false, error: "Missing/invalid fields" }, { status: 400 });
    }

    const platformValue = String(platform) as ProofRecord["platform"];

    const proof: ProofRecord = {
      wallet: String(wallet),
      platform: platformValue,
      proofHash: String(proofHash),
      usernameHash: String(usernameHash || ""),
      maskedUsername: String(maskedUsername || ""),
      verifiedAt: new Date().toISOString(),
      ...(repoCount !== undefined && { repoCount: Number(repoCount) }),
      ...(commitCount !== undefined && { commitCount: Number(commitCount) }),
      ...(followerCount !== undefined && { followerCount: Number(followerCount) }),
      ...(serverCount !== undefined && { serverCount: Number(serverCount) }),
      ...(pfpUrl ? { pfpUrl: String(pfpUrl) } : {}),
      ...(accountCreatedAt ? { accountCreatedAt: String(accountCreatedAt) } : {}),
    };

    const key = `proofs:${wallet}`;
    const existing = await redis.lrange<ProofRecord>(key, 0, -1);
    const filtered = (existing || []).filter((p) => p.platform !== platformValue);

    await redis.del(key);
    if (filtered.length > 0) await redis.rpush(key, ...filtered);
    await redis.rpush(key, proof);

    return NextResponse.json({ success: true, proof });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { wallet, platform } = await req.json();
    if (!wallet || !platform || !PLATFORMS.has(String(platform))) {
      return NextResponse.json({ success: false, error: "Missing/invalid fields" }, { status: 400 });
    }

    const platformValue = String(platform) as ProofRecord["platform"];
    const key = `proofs:${wallet}`;
    const existing = await redis.lrange<ProofRecord>(key, 0, -1);
    const filtered = (existing || []).filter((p) => p.platform !== platformValue);

    await redis.del(key);
    if (filtered.length > 0) await redis.rpush(key, ...filtered);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
