import { NextRequest, NextResponse } from "next/server";
import type { ProofRecord } from "@/lib/types";
import { resolveWalletFromCardId, getProofs, getIdentityRoot } from "@/lib/server/proof-storage";

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

    const proofs = (await getProofs(wallet)) as ProofRecord[];
    const identityRoot = await getIdentityRoot(wallet);

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

