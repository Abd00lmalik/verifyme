import { NextRequest, NextResponse } from "next/server";

const APP_URL = "https://verifyme-two.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet") || "unknown";
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      `${APP_URL}/api/github/callback?mock=true&wallet=${wallet}&code=mock_code&state=${wallet}`
    );
  }

  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${APP_URL}/api/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user",
    state: wallet,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
