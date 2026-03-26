import { NextRequest, NextResponse } from "next/server";

const APP_URL = "https://verifyme-two.vercel.app";

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
}

function maskUsername(username: string): string {
  if (!username || username.length <= 4) return username;
  return username.slice(0, 2) + "****" + username.slice(-2);
}

function discordAccountCreated(id: string): string {
  try {
    const ms = Math.floor(parseInt(id, 10) / 4194304) + 1420070400000;
    return new Date(ms).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const wallet = searchParams.get("state") || searchParams.get("wallet") || "unknown";
  const mock = searchParams.get("mock");

  try {
    let username = "mockuser11";
    let id = "123456789012345678";
    let avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
    let serverCount = 8;

    if (!mock) {
      if (!code) throw new Error("No code provided");

      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID || "",
          client_secret: process.env.DISCORD_CLIENT_SECRET || "",
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI || `${APP_URL}/api/discord/callback`,
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

      const token = String(tokenData.access_token || "");
      if (!token) throw new Error("No Discord token");

      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const user = await userRes.json();

      username = user.username;
      id = user.id;
      avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;

      const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (guildsRes.ok) {
        const guilds = await guildsRes.json();
        serverCount = Array.isArray(guilds) ? guilds.length : 0;
      }
    }

    const params = new URLSearchParams({
      success: "true",
      platform: "discord",
      proofHash: hash(wallet + id),
      usernameHash: hash(username),
      maskedUsername: maskUsername(username),
      pfpUrl: avatar,
      accountCreatedAt: discordAccountCreated(id),
      serverCount: String(serverCount),
      wallet,
    });

    return NextResponse.redirect(`${APP_URL}/verify?${params.toString()}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${APP_URL}/verify?error=true&platform=discord&message=${encodeURIComponent(msg)}`
    );
  }
}
