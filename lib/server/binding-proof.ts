import { createHmac } from "crypto";
import type { Platform } from "@/lib/types";
import type { WalletProofPayload } from "@/lib/wallet-proof";

export interface BindingProof {
  method: string;
  algorithm: "HS256";
  verifier: string;
  issuedAt: string;
  socialSessionId: string;
  walletNonce: string;
  walletSignature: string;
  walletMessage: string;
  token: string;
}

interface BindingProofPayload {
  v: "verifyme-binding-v1";
  wallet: string;
  platform: Platform;
  userId: string;
  username: string;
  proofHash: string;
  method: string;
  socialSessionId: string;
  verifiedAt: string;
  walletProof: {
    nonce: string;
    issuedAt: string;
    message: string;
    signature: string;
  };
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getBindingSigningSecret() {
  const secret = process.env.PROOF_SIGNING_SECRET || process.env.POLICY_SIGNING_SECRET;
  if (!secret) {
    throw new Error("Missing PROOF_SIGNING_SECRET (or POLICY_SIGNING_SECRET fallback)");
  }
  return secret;
}

function signPayload(payload: BindingProofPayload): string {
  const secret = getBindingSigningSecret();
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(body)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `${body}.${signature}`;
}

export function createBindingProof(args: {
  wallet: string;
  platform: Platform;
  userId: string;
  username: string;
  proofHash: string;
  proofMethod: string;
  socialSessionId: string;
  verifiedAt: string;
  walletProof: WalletProofPayload;
}): BindingProof {
  const payload: BindingProofPayload = {
    v: "verifyme-binding-v1",
    wallet: args.wallet,
    platform: args.platform,
    userId: args.userId,
    username: args.username,
    proofHash: args.proofHash,
    method: args.proofMethod,
    socialSessionId: args.socialSessionId,
    verifiedAt: args.verifiedAt,
    walletProof: {
      nonce: args.walletProof.nonce,
      issuedAt: args.walletProof.issuedAt,
      message: args.walletProof.message,
      signature: args.walletProof.signature,
    },
  };

  return {
    method: args.proofMethod,
    algorithm: "HS256",
    verifier: "verifyme-api",
    issuedAt: args.verifiedAt,
    socialSessionId: args.socialSessionId,
    walletNonce: args.walletProof.nonce,
    walletSignature: args.walletProof.signature,
    walletMessage: args.walletProof.message,
    token: signPayload(payload),
  };
}
