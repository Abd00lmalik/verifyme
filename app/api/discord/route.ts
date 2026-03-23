import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet') || 'unknown';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      `${appUrl}/api/discord/callback?mock=true&wallet=${wallet}&state=${wallet}`
    );
  }

  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${appUrl}/api/discord/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify',
    state: wallet,
  });

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}
