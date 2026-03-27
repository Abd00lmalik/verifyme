import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import type { Platform, ProofRecord } from "@/lib/types";
import { cardIdFromWallet } from "@/lib/card-id";

const redis = Redis.fromEnv();
const PROOF_PREFIX = "proofs:";
const ROOT_PREFIX = "root:";
const CARD_PREFIX = "card:";

function computeIdentityRoot(proofs: ProofRecord[]): string | null {
  const hashes = proofs.map((p) => p.proofHash).filter(Boolean).sort();
  if (hashes.length === 0) return null;
  return createHash("sha256")
    .update(`verifyme:root:v1|${hashes.join("|")}`)
    .digest("hex");
}

export async function getProofs(wallet: string): Promise<ProofRecord[]> {
  const key = `${PROOF_PREFIX}${wallet}`;
  return (await redis.lrange<ProofRecord>(key, 0, -1)) || [];
}

export async function getIdentityRoot(wallet: string): Promise<string | null> {
  const root = await redis.get<string>(`${ROOT_PREFIX}${wallet}`);
  return root || null;
}

export async function saveProof(wallet: string, proof: ProofRecord) {
  const key = `${PROOF_PREFIX}${wallet}`;
  const existing = (await redis.lrange<ProofRecord>(key, 0, -1)) || [];
  const filtered = existing.filter((p) => p.platform !== proof.platform);

  await redis.del(key);
  if (filtered.length > 0) await redis.rpush(key, ...filtered);
  await redis.rpush(key, proof);

  const nextProofs = [...filtered, proof];
  const identityRoot = computeIdentityRoot(nextProofs);
  const cardId = cardIdFromWallet(wallet);

  await redis.set(`${CARD_PREFIX}${cardId}`, wallet);

  if (identityRoot) {
    await redis.set(`${ROOT_PREFIX}${wallet}`, identityRoot);
  } else {
    await redis.del(`${ROOT_PREFIX}${wallet}`);
  }

  return { proof, proofs: nextProofs, cardId, identityRoot };
}

export async function deleteProof(wallet: string, platform: Platform) {
  const key = `${PROOF_PREFIX}${wallet}`;
  const existing = (await redis.lrange<ProofRecord>(key, 0, -1)) || [];
  const filtered = existing.filter((p) => p.platform !== platform);

  await redis.del(key);
  if (filtered.length > 0) await redis.rpush(key, ...filtered);

  const identityRoot = computeIdentityRoot(filtered);
  const cardId = cardIdFromWallet(wallet);

  if (identityRoot) {
    await redis.set(`${ROOT_PREFIX}${wallet}`, identityRoot);
    await redis.set(`${CARD_PREFIX}${cardId}`, wallet);
  } else {
    await redis.del(`${ROOT_PREFIX}${wallet}`);
    await redis.del(`${CARD_PREFIX}${cardId}`);
  }

  return { cardId, identityRoot };
}

export async function resolveWalletFromCardId(cardId: string): Promise<string | null> {
  const cached = await redis.get<string>(`${CARD_PREFIX}${cardId}`);
  if (cached) return cached;

  // Fallback for older data: scan proofs keys (slow)
  const keys = (await redis.keys(`${PROOF_PREFIX}*`)) as string[];
  for (const key of keys || []) {
    const wallet = String(key).replace(PROOF_PREFIX, "");
    if (cardIdFromWallet(wallet) === cardId) {
      await redis.set(`${CARD_PREFIX}${cardId}`, wallet);
      return wallet;
    }
  }

  return null;
}

