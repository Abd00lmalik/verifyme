import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { ProofRecord } from "@/lib/types";
import { cardIdFromWallet } from "@/lib/card-id";

const redis = Redis.fromEnv();

async function resolveWalletFromCardId(cardId: string): Promise<string | null> {
  const cached = await redis.get<string>(`card:${cardId}`);
  if (cached) return cached;

  const keys = (await redis.keys("proofs:*")) as string[];
  for (const key of keys || []) {
    const wallet = String(key).replace(/^proofs:/, "");
    if (cardIdFromWallet(wallet) === cardId) {
      await redis.set(`card:${cardId}`, wallet);
      return wallet;
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const cardId = String(req.nextUrl.searchParams.get("cardId") || "").trim().toUpperCase();
    if (!cardId) {
      return NextResponse.json({ success: false, error: "cardId is required" }, { status: 400 });
    }

    const wallet = await resolveWalletFromCardId(cardId);
    if (!wallet) {
      return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 });
    }

    const proofs = (await redis.lrange<ProofRecord>(`proofs:${wallet}`, 0, -1)) || [];
    const identityRoot = (await redis.get<string>(`root:${wallet}`)) || null;

    return NextResponse.json({
      success: true,
      cardId,
      wallet,
      identityRoot,
      proofs,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
