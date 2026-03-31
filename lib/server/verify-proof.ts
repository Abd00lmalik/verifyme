import type { ProofRecord } from "@/lib/types";
import { computeProofHash } from "@/lib/proof-hash";
import { verifyProofSignature } from "@/lib/server/proof-signing";

const MAX_PROOF_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function verifyStoredProof(proof: ProofRecord): boolean {
  if (!proof || !proof.wallet || !proof.platform || !proof.userId || !proof.proofHash) {
    return false;
  }

  const version = proof.version === "v2" ? "v2" : "v1";
  const nonce = String(proof.nonce || "").trim() || (version === "v1" ? "legacy" : "");
  if (!nonce) return false;

  if (version === "v2") {
    const issuedAt = Number(proof.issuedAt || 0);
    if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;
    if (Date.now() - issuedAt > MAX_PROOF_AGE_MS) return false;
  }

  const expectedHash = computeProofHash({
    wallet: proof.wallet,
    platform: proof.platform,
    platformUserId: proof.userId,
    nonce,
    version,
  });
  if (expectedHash !== proof.proofHash) return false;

  return verifyProofSignature(expectedHash, proof.signature);
}
