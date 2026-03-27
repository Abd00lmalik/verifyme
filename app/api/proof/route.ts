import { NextRequest, NextResponse } from "next/server";
import type { Platform, ProofRecord } from "@/lib/types";
import { saveProof, getProofs, getIdentityRoot, deleteProof } from "@/lib/server/proof-storage";
import { verifyWalletProof } from "@/lib/server/wallet-proof";
import { cardIdFromWallet } from "@/lib/card-id";

const PLATFORMS = new Set<Platform>(["github", "discord", "farcaster"]);

function maybeNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req: NextRequest) {
  const walletValue = (req.nextUrl.searchParams.get("wallet") || "").trim();
  if (!walletValue) return NextResponse.json({ proofs: [] });

  try {
    const proofs = await getProofs(walletValue);
    const identityRoot = await getIdentityRoot(walletValue);
    const cardId = cardIdFromWallet(walletValue);
    return NextResponse.json({ proofs, identityRoot, cardId });
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
    const walletProof = body.walletProof;

    if (!walletValue || !proofHashValue || !PLATFORMS.has(platformValue)) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    const verify = await verifyWalletProof(walletValue, walletProof);
    if (!verify.ok) {
      return NextResponse.json({ success: false, error: verify.error }, { status: 401 });
    }

    const repoCountNum = maybeNumber(body.repoCount);
    const commitCountNum = maybeNumber(body.commitCount);
    const followerCountNum = maybeNumber(body.followerCount);
    const serverCountNum = maybeNumber(body.serverCount);

    const txSignatureValue = body.txSignature
      ? String(body.txSignature)
      : `offchain:${Date.now()}`;

    const proof: ProofRecord = {
      wallet: walletValue,
      platform: platformValue,
      proofHash: proofHashValue,
      usernameHash: String(body.usernameHash || ""),
      maskedUsername: String(body.maskedUsername || ""),
      verifiedAt: new Date().toISOString(),
      txSignature: txSignatureValue,
      ...(repoCountNum !== undefined ? { repoCount: repoCountNum } : {}),
      ...(commitCountNum !== undefined ? { commitCount: commitCountNum } : {}),
      ...(followerCountNum !== undefined ? { followerCount: followerCountNum } : {}),
      ...(serverCountNum !== undefined ? { serverCount: serverCountNum } : {}),
      ...(body.pfpUrl ? { pfpUrl: String(body.pfpUrl) } : {}),
      ...(body.accountCreatedAt ? { accountCreatedAt: String(body.accountCreatedAt) } : {}),
    };

    const saved = await saveProof(walletValue, proof);
    return NextResponse.json({ success: true, proof: saved.proof, cardId: saved.cardId, identityRoot: saved.identityRoot });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const walletValue = String(body.wallet || "").trim();
    const platformValue = String(body.platform || "") as Platform;
    const walletProof = body.walletProof;

    if (!walletValue || !PLATFORMS.has(platformValue)) {
      return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    const verify = await verifyWalletProof(walletValue, walletProof);
    if (!verify.ok) {
      return NextResponse.json({ success: false, error: verify.error }, { status: 401 });
    }

    const result = await deleteProof(walletValue, platformValue);
    return NextResponse.json({ success: true, cardId: result.cardId, identityRoot: result.identityRoot });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
