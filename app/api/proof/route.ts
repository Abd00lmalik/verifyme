import { NextRequest, NextResponse } from 'next/server';
import type { ProofRecord } from '@/lib/types';

// In-memory store — replaces with Rialo contract calls when devnet is available
const proofStore = new Map<string, ProofRecord[]>();

// Seed with mock data so /profile/demo works immediately
import { MOCK_PROOFS, MOCK_WALLET } from '@/lib/mock-data';
proofStore.set(MOCK_WALLET, [...MOCK_PROOFS]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  if (!wallet) return NextResponse.json([], { status: 200 });

  const proofs = proofStore.get(wallet) || [];
  return NextResponse.json(proofs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, platform, proofHash, usernameHash, maskedUsername, txSignature, repoCount, followerCount } = body;

    if (!wallet || !platform || !proofHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = proofStore.get(wallet) || [];
    const filtered = existing.filter((p) => p.platform !== platform);

    const proof: ProofRecord = {
      wallet,
      platform,
      proofHash,
      usernameHash: usernameHash || '',
      maskedUsername: maskedUsername || '',
      verifiedAt: new Date().toISOString(),
      txSignature,
      ...(repoCount !== undefined && { repoCount: Number(repoCount) }),
      ...(followerCount !== undefined && { followerCount: Number(followerCount) }),
    };

    // TODO: Replace with Rialo contract call when devnet RPC is available
    proofStore.set(wallet, [...filtered, proof]);

    return NextResponse.json({ success: true, proof });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, platform } = body;

    if (!wallet || !platform) {
      return NextResponse.json({ error: 'Missing wallet or platform' }, { status: 400 });
    }

    const existing = proofStore.get(wallet) || [];
    // TODO: Replace with Rialo contract call to revoke on-chain
    proofStore.set(wallet, existing.filter((p) => p.platform !== platform));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
