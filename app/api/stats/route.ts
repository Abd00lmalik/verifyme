import { NextResponse } from "next/server";
import { proofStore } from "@/lib/proof-store";
import { MOCK_WALLET } from "@/lib/mock-data";

export async function GET() {
  let wallets = 0;
  let proofs = 0;
  for (const [wallet, records] of proofStore.entries()) {
    if (wallet === MOCK_WALLET) continue; // exclude seeded demo data
    if (records.length > 0) wallets++;
    proofs += records.length;
  }
  return NextResponse.json({ wallets, proofs, platforms: 3 });
}
