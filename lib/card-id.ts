import { createHmac } from "crypto";

const CARD_ID_VERSION = "v1";
const CARD_ID_PREFIX = "VM";

function getSecret(): string {
  return process.env.CARD_ID_SECRET || "dev-secret-change-me";
}

export function cardIdFromWallet(wallet: string): string {
  const normalized = (wallet || "").trim();
  const digest = createHmac("sha256", getSecret())
    .update(`verifyme:${CARD_ID_VERSION}:${normalized}`)
    .digest("hex")
    .toUpperCase();

  return `${CARD_ID_PREFIX}-${digest.slice(0, 12)}`;
}
