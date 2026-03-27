import { NextRequest, NextResponse } from "next/server";
import { issueWalletChallenge } from "@/lib/server/wallet-proof";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const wallet = String(req.nextUrl.searchParams.get("wallet") || "").trim();
  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 400 });
  }

  const challenge = await issueWalletChallenge(wallet);
  return NextResponse.json(challenge);
}

