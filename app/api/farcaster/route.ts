import { NextRequest, NextResponse } from 'next/server';

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as unknown as ArrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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

    const proofHash = await sha256(wallet + String(fid));
    const usernameHash = await sha256(username);
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

