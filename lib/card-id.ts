const CARD_ID_PREFIX = "VM";

export function cardIdFromWallet(wallet: string): string {
  const normalized = (wallet || "").trim();
  let h = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const code = (h >>> 0).toString(36).toUpperCase().padStart(8, "0");
  const suffix = normalized.slice(-4).toUpperCase();
  return `${CARD_ID_PREFIX}-${code}-${suffix}`;
}

