import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!wallet) {
    return NextResponse.redirect(`${appUrl}/verify?error=true&platform=github&message=${encodeURIComponent("Missing wallet address")}`);
  }

  if (!clientId) {
    return NextResponse.redirect(`${appUrl}/verify?error=true&platform=github&message=${encodeURIComponent("GitHub OAuth is not configured")}`);
  }

  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${appUrl}/api/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user",
    state: wallet,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

