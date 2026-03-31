import { createHash } from "crypto";
import { RialinkClient } from "./client";
import type { Proof } from "./types";

const client = new RialinkClient();

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export const verifyWallet = (wallet: string) => {
  return client.verifyWallet(wallet);
};

export function validateProofIntegrity(proof: Proof): boolean {
  const wallet = String(proof.wallet || "").trim();
  const platform = String(proof.platform || "").trim();
  const userId = String(proof.userId || "").trim();
  const nonce = String(proof.nonce || "").trim();
  const proofHash = String(proof.proof_hash || "").trim();
  const version = String(proof.version || "v1");

  if (!wallet || !platform || !userId || !proofHash) return false;

  const expected =
    version === "v2"
      ? sha256Hex(`rialink:v2|${wallet}|${platform}|${userId}|${nonce}`)
      : sha256Hex(`rialink:v1|svm|${wallet}|${platform}|${userId}`);

  return expected === proofHash;
}

export * from "./types";
export { RialinkClient };
