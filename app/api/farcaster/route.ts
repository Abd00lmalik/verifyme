import { NextRequest, NextResponse } from 'next/server';

function sha256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').repeat(8).slice(0, 64);
}

function maskUsername(username: string): string {
  if (!username || username.length <= 4) return username;
  return username.slice(0, 2) + '****' + username.slice(-2);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, fid, username, custody, signature, followerCount } = body;

    if (!wallet || !fid || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Verify SIWF signature against Farcaster relay when devnet RPC is available
    // For now, accept all signed-in users (mock mode)

    const proofHash = sha256(wallet + String(fid));
    const usernameHash = sha256(username);
    const maskedUsername = maskUsername(username);

    return NextResponse.json({
      success: true,
      proofHash,
      usernameHash,
      maskedUsername,
      platform: 'farcaster',
      followerCount: followerCount || null,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



