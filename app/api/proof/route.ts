import { NextRequest, NextResponse } from "next/server";
import { proofStore } from "@/lib/proof-store";
import type { ProofRecord } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return NextResponse.json([], { status: 200 });
  return NextResponse.json(proofStore.get(wallet) || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      wallet, platform, proofHash, usernameHash, maskedUsername,
      txSignature, repoCount, followerCount, pfpUrl, accountCreatedAt,
    } = body;

    if (!wallet || !platform || !proofHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = proofStore.get(wallet) || [];
    const filtered = existing.filter((p) => p.platform !== platform);

    const proof: ProofRecord = {
      wallet, platform, proofHash,
      usernameHash: usernameHash || "",
      maskedUsername: maskedUsername || "",
      verifiedAt: new Date().toISOString(),
      ...(txSignature && { txSignature }),
      ...(repoCount !== undefined && { repoCount: Number(repoCount) }),
      ...(followerCount !== undefined && { followerCount: Number(followerCount) }),
      ...(pfpUrl && { pfpUrl }),
      ...(accountCreatedAt && { accountCreatedAt }),
    };

    proofStore.set(wallet, [...filtered, proof]);
    return NextResponse.json({ success: true, proof });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { wallet, platform } = await req.json();
    if (!wallet || !platform) {
      return NextResponse.json({ error: "Missing wallet or platform" }, { status: 400 });
    }
    const existing = proofStore.get(wallet) || [];
    proofStore.set(wallet, existing.filter((p) => p.platform !== platform));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
