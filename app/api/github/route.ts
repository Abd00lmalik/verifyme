import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet') || 'unknown';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    // Mock mode
    return NextResponse.redirect(
      `${appUrl}/api/github/callback?mock=true&wallet=${wallet}&code=mock_code&state=${wallet}`
    );
  }

  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${appUrl}/api/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user',
    state: wallet,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
