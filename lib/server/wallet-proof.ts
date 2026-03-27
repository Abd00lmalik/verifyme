import { Redis } from "@upstash/redis";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import type { WalletProofPayload } from "@/lib/wallet-proof";

const redis = Redis.fromEnv();
const CHALLENGE_TTL_SECONDS = 10 * 60;

function challengeKey(wallet: string) {
  return `challenge:${wallet}`;
}

export async function issueWalletChallenge(wallet: string) {
  const nonce = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const issuedAt = new Date().toISOString();
  await redis.set(challengeKey(wallet), nonce, { ex: CHALLENGE_TTL_SECONDS });
  return { nonce, issuedAt };
}

export async function verifyWalletProof(wallet: string, proof: WalletProofPayload | undefined) {
  if (!proof || !proof.message || !proof.signature || !proof.nonce) {
    return { ok: false, error: "Missing wallet proof" };
  }

  const expected = await redis.get<string>(challengeKey(wallet));
  if (!expected || expected !== proof.nonce) {
    return { ok: false, error: "Wallet proof expired or invalid" };
  }

  // basic message sanity check
  if (!proof.message.includes(`Wallet: ${wallet}`) || !proof.message.includes(`Nonce: ${proof.nonce}`)) {
    return { ok: false, error: "Wallet proof message mismatch" };
  }

  try {
    const msgBytes = new TextEncoder().encode(proof.message);
    const sigBytes = bs58.decode(proof.signature);
    const pubKey = new PublicKey(wallet);
    const valid = nacl.sign.detached.verify(msgBytes, sigBytes, pubKey.toBytes());
    if (!valid) return { ok: false, error: "Invalid wallet signature" };
  } catch {
    return { ok: false, error: "Invalid wallet signature" };
  }

  // Keep the challenge active for a short session window to avoid re-signing every action
  await redis.set(challengeKey(wallet), proof.nonce, { ex: CHALLENGE_TTL_SECONDS });
  return { ok: true };
}
