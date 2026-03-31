import { createHash } from "crypto";
import type { Platform } from "@/lib/types";

const LEGACY_SPEC_PREFIX = "rialink:v1";
const V2_SPEC_PREFIX = "rialink:v2";

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export function computeProofHash(args: {
  wallet: string;
  platform: Platform;
  platformUserId: string | number;
  nonce: string;
  version?: "v1" | "v2";
}): string {
  const wallet = String(args.wallet).trim();
  const platform = args.platform;
  const platformUserId = String(args.platformUserId).trim();
  const version = args.version || "v2";

  if (version === "v1") {
    return sha256Hex(
      `${LEGACY_SPEC_PREFIX}|svm|${wallet}|${platform}|${platformUserId}`
    );
  }

  const nonce = String(args.nonce || "").trim();
  return sha256Hex(`${V2_SPEC_PREFIX}|${wallet}|${platform}|${platformUserId}|${nonce}`);
}

export function computeUsernameHash(args: {
  platform: Platform;
  username: string;
}): string {
  const username = String(args.username).trim().toLowerCase();
  return sha256Hex(`${LEGACY_SPEC_PREFIX}|username|${args.platform}|${username}`);
}
